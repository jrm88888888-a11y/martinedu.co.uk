/* ==========================================================================
   lessons.js — interactive mini-lessons + retrieval-practice fallback
   Bespoke lessons live in data/lessons/{topic}.json (fully authored ones).
   Any topic without a bespoke lesson gets a live practice set drawn from the
   question bank — active recall with instant feedback (retrieval practice).
   ========================================================================== */

const Lessons = (() => {
  const BESPOKE = new Set([
    // Maths
    'number', 'fdp', 'ratio', 'algebra', 'measures', 'money', 'geometry', 'data',
    // English
    'comprehension', 'cloze', 'spelling', 'punctuation', 'grammar', 'synonyms', 'vocab',
  ]); // fully authored lessons for every SEAG topic
  let S = null; // runtime state

  /* ---------------- Lesson picker ---------------- */
  function renderList(subject) {
    scrollTop();
    $app().className = 'wrap';
    const subs = subject && MartinData.TOPICS[subject] ? [subject] : ['maths', 'english'];
    const blocks = subs.map(sub => {
      const cards = MartinData.TOPICS[sub].map(t => {
        const ready = BESPOKE.has(t.id);
        return `
          <button class="lesson-card" onclick="go('#/lesson/${sub}/${t.id}')">
            <span class="chip ${ready ? 'ready' : ''}">${ready ? '★ Full lesson' : 'Practice set'}</span>
            <div class="emoji">${t.emoji}</div>
            <h3>${esc(t.name)}</h3>
            <p>${ready ? 'A guided mini-lesson with theory and practice.' : 'Active-recall practice questions with instant feedback.'}</p>
          </button>`;
      }).join('');
      return `
        <div class="card">
          <h2>${sub === 'maths' ? '🔢 Maths' : '📖 English'} mini-lessons</h2>
          <div class="lesson-list">${cards}</div>
        </div>`;
    }).join('');

    $app().innerHTML = `
      <button class="back-link" onclick="go('#/')">← Home</button>
      <div class="hero"><h1>Mini-lessons 🎒</h1>
        <p>Short, friendly lessons and practice. Start with your revision-plan topics,
           or explore anything you like.</p></div>
      ${blocks}`;
  }

  /* ---------------- Run a lesson ---------------- */
  async function renderLesson(subject, topic) {
    if (!MartinData.TOPICS[subject]) return renderList();
    $app().className = 'wrap';
    $app().innerHTML = `<div class="card center"><h2>Loading your lesson… 🎒</h2></div>`;
    let data = null;
    if (BESPOKE.has(topic)) {
      try { data = await fetch(`data/lessons/${topic}.json`).then(r => r.ok ? r.json() : null); } catch (e) {}
    }
    if (data) { S = { subject, topic, data, step: 0, data_steps: data.steps }; return renderStep(); }
    return practiceFallback(subject, topic);
  }

  function renderStep() {
    scrollTop();
    const steps = S.data_steps;
    const i = S.step;
    const step = steps[i];
    const dots = steps.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('');
    let body = '';

    if (step.type === 'teach' || step.type === 'example') {
      body = `
        <div class="lesson-section">
          <span class="kicker">${step.type === 'example' ? 'Let’s try one' : 'Learn it'}</span>
          <h2>${esc(step.heading || '')}</h2>
          <div>${step.html || ''}</div>
        </div>`;
    } else if (step.type === 'practice') {
      body = practiceBlock(step, `pr_${i}`);
    }

    $app().innerHTML = `
      <button class="back-link" onclick="go('#/lessons/${S.subject}')">← All lessons</button>
      <div class="card">
        <div class="row-between">
          <span class="pill subject-${S.subject}">${S.data.emoji || '🎓'} ${esc(S.data.title)}</span>
          <span class="qnum">Step ${i + 1} / ${steps.length}</span>
        </div>
        <div class="step-dots">${dots}</div>
        ${body}
        <div class="quiz-nav">
          <button class="btn soft" ${i === 0 ? 'disabled' : ''} onclick="Lessons.prev()">← Back</button>
          ${i < steps.length - 1
            ? `<button class="btn" id="nextBtn" onclick="Lessons.next()">Next →</button>`
            : `<button class="btn" onclick="Lessons.finish()">Finish 🎉</button>`}
        </div>
      </div>`;

    // For practice steps, gate "Next" until answered
    if (step.type === 'practice') {
      const nb = document.getElementById('nextBtn'); // may be finish on last step
      // allow proceeding but encourage answering; no hard gate to avoid frustration
    }
  }

  /* ---------------- A practice question block (shared) ---------------- */
  function practiceBlock(q, uid) {
    // Shuffle options once so the answer isn't always first (answers match by text)
    if (q.options && !q._shuffled) { q.options = MartinData.shuffle(q.options); q._shuffled = true; }
    const opts = (q.options || []).map((o, k) => `
      <button class="option" id="${uid}_o${k}" onclick="Lessons.check('${uid}', ${k})">
        <span class="key">${'ABCDEF'[k]}</span><span>${esc(o)}</span>
      </button>`).join('');
    const numeric = q.qtype === 'numeric';
    return `
      <div class="practice-q">
        <span class="kicker">Your turn 💪</span>
        <div class="stem">${esc(q.stem)}</div>
        ${q.figure ? `<div class="figure">${q.figure}</div>` : ''}
        ${numeric
          ? `<div><input class="numeric-input" id="${uid}_num" placeholder="?" inputmode="decimal"
                onkeydown="if(event.key==='Enter')Lessons.checkNum('${uid}')" />
              ${q.unit ? `<span class="numeric-suffix">${esc(q.unit)}</span>` : ''}
              <div style="margin-top:12px"><button class="btn" onclick="Lessons.checkNum('${uid}')">Check</button></div></div>`
          : `<div class="options">${opts}</div>`}
        <div class="feedback" id="${uid}_fb"></div>
      </div>`;
  }

  function _feedback(uid, ok, q) {
    const fb = document.getElementById(uid + '_fb');
    fb.className = 'feedback show ' + (ok ? 'correct' : 'incorrect');
    fb.innerHTML = (ok ? '✅ Yes! ' : `❌ Not quite — the answer is <b>${esc(q.answer)}${q.unit ? (' ' + esc(q.unit)) : ''}</b>. `)
      + (q.explain ? esc(q.explain) : '');
  }
  function check(uid, k) {
    const q = _currentPractice(uid);
    const chosen = q.options[k];
    const ok = MartinData.isCorrect({ type: 'mcq', answer: q.answer }, chosen);
    document.querySelectorAll(`[id^="${uid}_o"]`).forEach((el, idx) => {
      el.classList.toggle('selected', idx === k);
    });
    _feedback(uid, ok, q);
  }
  function checkNum(uid) {
    const q = _currentPractice(uid);
    const val = document.getElementById(uid + '_num').value;
    const ok = MartinData.isCorrect({ type: 'numeric', answer: q.answer, accept: q.accept }, val);
    _feedback(uid, ok, q);
  }
  function _currentPractice(uid) {
    // bespoke lesson step or fallback set
    if (S.data_steps) return S.data_steps[S.step];
    return S.set[S.step];
  }

  function next() { if (S.step < (S.data_steps ? S.data_steps.length : S.set.length) - 1) { S.step++; S.data_steps ? renderStep() : renderPractice(); } }
  function prev() { if (S.step > 0) { S.step--; S.data_steps ? renderStep() : renderPractice(); } }
  function finish() {
    scrollTop();
    $app().innerHTML = `
      <div class="card celebrate">
        <div class="big">🎉🌟</div>
        <h1>Lesson complete!</h1>
        <p class="muted">Brilliant focus. Little and often is the secret — come back tomorrow for another go.</p>
        <div class="quiz-nav" style="justify-content:center">
          <button class="btn" onclick="go('#/lessons/${S.subject}')">More lessons</button>
          <button class="btn ghost" onclick="go('#/mode/${S.subject}')">Try a test</button>
        </div>
      </div>`;
  }

  /* ---------------- Retrieval-practice fallback (bank-driven) ---------------- */
  async function practiceFallback(subject, topic) {
    await MartinData.load(subject);
    const pool = MartinData.shuffle(
      MartinData.__all(subject).filter(q => q.topic === topic)
    ).slice(0, 6);

    if (!pool.length) {
      $app().innerHTML = `
        <button class="back-link" onclick="go('#/lessons/${subject}')">← All lessons</button>
        <div class="card"><h2>${MartinData.topicEmoji(subject, topic)} ${esc(MartinData.topicName(subject, topic))}</h2>
          <p>A full guided lesson for this topic is coming soon. In the meantime, try a mini-test to practise!</p>
          <button class="btn" onclick="go('#/mode/${subject}')">Try a test</button></div>`;
      return;
    }
    // adapt bank questions to the practice-block shape
    S = {
      subject, topic, step: 0,
      set: pool.map(q => ({
        stem: q.stem, qtype: q.type, options: q.options, answer: q.answer,
        accept: q.accept, unit: q.unit, explain: q.explanation, figure: q.figure,
      })),
    };
    renderPractice();
  }
  function renderPractice() {
    scrollTop();
    const set = S.set, i = S.step, q = set[i];
    const dots = set.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('');
    $app().innerHTML = `
      <button class="back-link" onclick="go('#/lessons/${S.subject}')">← All lessons</button>
      <div class="card">
        <div class="row-between">
          <span class="pill subject-${S.subject}">${MartinData.topicEmoji(S.subject, S.topic)} ${esc(MartinData.topicName(S.subject, S.topic))}</span>
          <span class="qnum">Practice ${i + 1} / ${set.length}</span>
        </div>
        <div class="step-dots">${dots}</div>
        <p class="muted">Practising by recalling is one of the best ways to learn. Have a go, then check!</p>
        ${practiceBlock(q, `fb_${i}`)}
        <div class="quiz-nav">
          <button class="btn soft" ${i === 0 ? 'disabled' : ''} onclick="Lessons.prev()">← Back</button>
          ${i < set.length - 1
            ? `<button class="btn" onclick="Lessons.next()">Next →</button>`
            : `<button class="btn" onclick="Lessons.finish()">Finish 🎉</button>`}
        </div>
      </div>`;
  }

  return { renderList, renderLesson, renderStep, renderPractice, next, prev, finish, check, checkNum };
})();
