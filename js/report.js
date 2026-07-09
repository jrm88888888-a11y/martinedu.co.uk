/* ==========================================================================
   report.js — marking, diagnostic analysis & report rendering
   ---------------------------------------------------------------------------
   Pedagogical basis (kept deliberately transparent for parents/teachers):
   • Retrieval practice & spacing (Roediger & Karpicke, 2006) — revisit weak
     topics through active recall, spaced over days.
   • Metacognitive calibration (Flavell; Dunlosky & Rawson, 2012) — a good
     learner's confidence matches their accuracy. We surface mismatches.
   • Hypercorrection effect (Butterfield & Metcalfe, 2001) — errors made with
     HIGH confidence are, once directly corrected, especially likely to stick.
     So "confident-but-wrong" answers are high-value to target now.
   • Address misconceptions before fluency — a confidently-held wrong rule is
     prioritised above a simple gap, because it will keep producing errors.
   ========================================================================== */

const Report = (() => {

  const CONFIDENT = c => c >= 4;          // "quite sure" / "very sure"
  const UNSURE    = c => c != null && c <= 3;

  function build(session) {
    const { questions, responses, subject } = session;
    const details = questions.map((q, i) => {
      const r = responses[i];
      return {
        id: q.id, topic: q.topic, stem: q.stem, type: q.type,
        figure: q.figure || null,
        response: r.response, answer: q.answer, unit: q.unit,
        explanation: q.explanation,
        confidence: r.confidence,
        correct: MartinData.isCorrect(q, r.response),
      };
    });

    const total = details.length;
    const correct = details.filter(d => d.correct).length;
    const pct = Math.round((correct / total) * 100);

    // ---- Per-topic aggregation ----
    const topicMap = {};
    details.forEach(d => {
      const t = (topicMap[d.topic] ||= { id: d.topic, attempted: 0, correct: 0, confidentWrong: 0, confidentRight: 0 });
      t.attempted++;
      if (d.correct) t.correct++;
      if (CONFIDENT(d.confidence) && !d.correct) t.confidentWrong++;
      if (CONFIDENT(d.confidence) && d.correct) t.confidentRight++;
    });
    const topics = Object.values(topicMap).map(t => ({
      ...t,
      name: MartinData.topicName(subject, t.id),
      emoji: MartinData.topicEmoji(subject, t.id),
      accuracy: t.correct / t.attempted,
    })).sort((a, b) => a.accuracy - b.accuracy);

    // ---- Confidence calibration quadrants ----
    const calibration = { secure: 0, misconception: 0, fragile: 0, gap: 0 };
    details.forEach(d => {
      const conf = CONFIDENT(d.confidence);
      if (d.correct && conf)  calibration.secure++;
      else if (!d.correct && conf) calibration.misconception++;
      else if (d.correct && !conf) calibration.fragile++;
      else calibration.gap++;
    });

    // ---- Confident slips (answered confidently, got it wrong) ----
    const confidentSlips = details
      .filter(d => CONFIDENT(d.confidence) && !d.correct)
      .map(d => ({ id: d.id, topic: d.topic, topicName: MartinData.topicName(subject, d.topic),
                   stem: d.stem, response: d.response, answer: d.answer, unit: d.unit }));

    // ---- Priority revision list ----
    // priority = teaching-need(0..100) + confident-error boost. Higher = revise sooner.
    const priorities = topics
      .filter(t => t.correct < t.attempted)          // only topics with at least one error
      .map(t => {
        const teachingNeed = (1 - t.accuracy) * 100;
        const misconceptionBoost = t.confidentWrong * 30;
        const score = Math.round(teachingNeed + misconceptionBoost);
        const lowEvidence = t.attempted < 3;
        let reason;
        if (t.confidentWrong > 0) {
          reason = `Answered ${t.confidentWrong} question${t.confidentWrong > 1 ? 's' : ''} confidently but got ${t.confidentWrong > 1 ? 'them' : 'it'} wrong — a sign of a misunderstanding worth fixing first.`;
        } else if (t.accuracy < 0.5) {
          reason = `Fewer than half correct here — a good topic to rebuild from the basics.`;
        } else {
          reason = `A few slips to tidy up with some quick practice.`;
        }
        if (lowEvidence) reason += ` (Based on only ${t.attempted} question${t.attempted > 1 ? 's' : ''}, so treat as a hint.)`;
        return { id: t.id, name: t.name, emoji: t.emoji, score,
                 accuracy: t.accuracy, attempted: t.attempted,
                 correct: t.correct, confidentWrong: t.confidentWrong,
                 flag: t.confidentWrong > 0, reason, lowEvidence };
      })
      .sort((a, b) => b.score - a.score);

    // ---- Strengths ----
    const strengths = topics
      .filter(t => t.accuracy >= 0.8)
      .sort((a, b) => b.accuracy - a.accuracy)
      .map(t => ({ id: t.id, name: t.name, emoji: t.emoji, accuracy: t.accuracy }));

    return {
      subject, subjectName: session.subjectName, mode: session.mode, modeLabel: session.modeLabel,
      total, correct, pct, topics, calibration, priorities, strengths, confidentSlips, details,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
  }

  /* ------------------------------ Rendering ------------------------------ */
  function render() {
    const rep = App.lastReport || loadSavedReport();
    if (!rep) return go('#/');
    App.lastReport = rep;
    scrollTop();

    $app().className = 'wrap wrap-wide';

    const tierClass = a => a >= 0.8 ? 'good' : a >= 0.5 ? 'mid' : 'weak';

    $app().innerHTML = `
      <button class="back-link no-print" onclick="go('#/')">← Home</button>

      <div id="reportDoc">
      <!-- Header -->
      <div class="card">
        <div class="row-between">
          <div>
            <span class="pill subject-${rep.subject}">${rep.subject === 'maths' ? '🔢 Maths' : '📖 English'} · ${esc(rep.modeLabel)}</span>
            <h1 style="margin:12px 0 2px">Your Practice Report</h1>
            <p class="faint" style="margin:0">MartinEdu · SEAG practice · ${esc(rep.date)}</p>
          </div>
        </div>

        <div class="score-hero">
          <div class="score-ring" style="--pct:${rep.pct}%">
            <div class="inner"><b>${rep.pct}%</b><span>${rep.correct} / ${rep.total}</span></div>
          </div>
          <p class="muted">${encourage(rep.pct)}</p>
        </div>

        <div class="stat-row">
          <div class="stat"><b>${rep.correct}</b><span>Correct</span></div>
          <div class="stat"><b>${rep.total - rep.correct}</b><span>To practise</span></div>
          <div class="stat"><b>${rep.strengths.length}</b><span>Strong topics</span></div>
        </div>
        <p class="faint center">This is a practice score to guide revision — it is not an official SEAG standardised age score.</p>
      </div>

      <!-- Strengths & focus -->
      <div class="card">
        <h2>🌟 Strengths &amp; 🎯 Focus areas</h2>
        <p class="muted" style="margin-bottom:6px"><b>You're strong at:</b></p>
        <div>${rep.strengths.length
          ? rep.strengths.map(t => `<span class="tag strong">${t.emoji} ${esc(t.name)} · ${Math.round(t.accuracy*100)}%</span>`).join('')
          : `<span class="faint">Keep practising — your strengths will show up here soon.</span>`}</div>
        <p class="muted" style="margin:14px 0 6px"><b>Best topics to focus on:</b></p>
        <div>${rep.priorities.length
          ? rep.priorities.slice(0,4).map(t => `<span class="tag weak">${t.emoji} ${esc(t.name)}</span>`).join('')
          : `<span class="faint">No clear weak spots — lovely work!</span>`}</div>
      </div>

      <!-- Calibration -->
      <div class="card">
        <h2>🧭 Confidence check</h2>
        <p class="muted">A great learner's confidence matches how they actually did. Here's how your
           self-ratings lined up with your answers:</p>
        <div class="matrix">
          <div class="cell secure"><b>${rep.calibration.secure}</b>
            <span class="cap">✅ Secure</span><span class="sub">Sure &amp; correct — well known.</span></div>
          <div class="cell misconception"><b>${rep.calibration.misconception}</b>
            <span class="cap">⚠️ Confident slips</span><span class="sub">Sure but wrong — fix these first.</span></div>
          <div class="cell fragile"><b>${rep.calibration.fragile}</b>
            <span class="cap">🍀 Lucky / fragile</span><span class="sub">Unsure but correct — consolidate.</span></div>
          <div class="cell gap"><b>${rep.calibration.gap}</b>
            <span class="cap">📘 Gaps</span><span class="sub">Unsure &amp; wrong — needs teaching.</span></div>
        </div>
      </div>

      <!-- Confident slips detail (the requested flag) -->
      ${rep.confidentSlips.length ? `
      <div class="card" style="border-color:var(--misconception)">
        <h2>⚠️ Confident slips to fix first</h2>
        <p class="muted">You felt sure on these but they didn't go to plan. Research (the “hypercorrection
           effect”) shows these are exactly the errors that stick best once you correct them — so they're top value.</p>
        ${rep.confidentSlips.map(s => `
          <div class="review-item">
            <span class="qtopic">${MartinData.topicEmoji(rep.subject, s.topic)} ${esc(s.topicName)}</span>
            <div style="margin-top:6px"><b>${esc(s.stem)}</b></div>
            <div class="qa">Your answer: <b style="color:var(--misconception)">${esc(s.response ?? '—')}</b>
                 &nbsp;·&nbsp; Correct: <b style="color:var(--secure)">${esc(s.answer)}${s.unit?(' '+esc(s.unit)):''}</b></div>
          </div>`).join('')}
      </div>` : ''}

      <!-- Priority revision list -->
      <div class="card">
        <h2>📋 Your revision plan</h2>
        <p class="muted">Ordered by what will help most — confident mistakes first, then the topics with the
           most to gain. Tap “Practise” to jump into a mini-lesson.</p>
        <div class="priority">
          ${rep.priorities.length ? rep.priorities.map((p, i) => `
            <div class="item ${p.flag ? 'flag' : ''}">
              <div class="rank">${i + 1}</div>
              <div style="flex:1">
                <h3>${p.emoji} ${esc(p.name)} ${p.flag ? '⚠️' : ''}</h3>
                <p>${Math.round(p.accuracy*100)}% correct (${p.correct}/${p.attempted})</p>
                <p class="why">${esc(p.reason)}</p>
              </div>
              <button class="btn ghost go no-print" onclick="go('#/lesson/${rep.subject}/${p.id}')">Practise →</button>
            </div>`).join('')
          : `<p class="celebrate"><span class="big">🎉</span><br>No weak topics today — fantastic!</p>`}
        </div>
      </div>

      <!-- Topic breakdown -->
      <div class="card">
        <h2>📊 Every topic</h2>
        ${rep.topics.map(t => `
          <div class="topic-bar ${tierClass(t.accuracy)}">
            <div class="row"><span>${t.emoji} ${esc(t.name)}</span><span>${t.correct}/${t.attempted}</span></div>
            <div class="track"><span style="width:${Math.round(t.accuracy*100)}%"></span></div>
          </div>`).join('')}
      </div>

      <!-- Question review -->
      <div class="card">
        <h2>🔍 Look back at every question</h2>
        ${rep.details.map((d, i) => `
          <div class="review-item">
            <div class="row-between">
              <span class="qnum">Q${i + 1} · ${esc(MartinData.topicName(rep.subject, d.topic))}</span>
              <span class="badge ${d.correct ? 'right' : 'wrong'}">${d.correct ? '✔ Correct' : '✘ Not yet'}</span>
            </div>
            <div style="margin-top:6px"><b>${esc(d.stem)}</b></div>
            ${d.figure ? `<div class="figure figure-sm">${d.figure}</div>` : ''}
            <div class="qa">Your answer: <b>${esc(d.response ?? '—')}</b>${d.correct ? '' : ` · Correct: <b style="color:var(--secure)">${esc(d.answer)}${d.unit?(' '+esc(d.unit)):''}</b>`}
                 &nbsp;·&nbsp; ${confLabel(d.confidence)}</div>
            ${d.explanation ? `<div class="exp">💡 ${esc(d.explanation)}</div>` : ''}
          </div>`).join('')}
      </div>

      <!-- Pedagogy note -->
      <div class="card">
        <h2>👨‍👩‍👧 A note for grown-ups</h2>
        <p class="muted">This report is built on well-established learning science. Topics are ranked for revision
          using <b>retrieval practice and spacing</b> (revisit weak areas actively, over several short sessions),
          <b>metacognitive calibration</b> (does confidence match accuracy?), and the <b>hypercorrection effect</b>
          (high-confidence errors, once corrected, are especially well remembered — so we surface them first).
          Scores shown are raw practice results to guide revision, not official SEAG standardised age scores.</p>
      </div>
      </div><!-- /reportDoc -->

      <div class="quiz-nav no-print">
        <button class="btn" onclick="MartinPDF.download()">⬇️ Download PDF</button>
        <button class="btn ghost" onclick="go('#/lessons/${rep.subject}')">Go to mini-lessons</button>
        <button class="btn soft" onclick="go('#/')">New test</button>
      </div>
    `;
  }

  function encourage(pct) {
    if (pct >= 85) return 'Outstanding work — you’re really SEAG-ready! 🌟';
    if (pct >= 70) return 'Great effort! A few tweaks and you’ll be flying. 🚀';
    if (pct >= 50) return 'Solid start — your revision plan below will boost you fast. 💪';
    return 'Every expert started here. Let’s tackle your plan one topic at a time. 🌱';
  }
  function confLabel(c) {
    const m = { 1: 'No idea', 2: 'Not so sure', 3: 'Neutral', 4: 'Quite sure', 5: 'Very sure' };
    return c ? `felt: <i>${m[c]}</i>` : 'no confidence rating';
  }

  return { build, render };
})();
