/* ==========================================================================
   quiz.js — the test runner (one question per screen) + confidence gauge
   ========================================================================== */

const Quiz = (() => {

  async function start(subject, mode) {
    if (!MartinData.TOPICS[subject] || !MartinData.MODES[mode]) return go('#/');
    $app().innerHTML = `<div class="card center"><h2>Getting your questions ready… ✨</h2></div>`;
    await MartinData.load(subject);
    const questions = MartinData.buildTest(subject, mode);
    if (!questions.length) {
      $app().innerHTML = `<div class="card"><h2>No questions yet</h2>
        <p>This subject's question bank is still being filled.</p>
        <button class="btn" onclick="go('#/')">Back</button></div>`;
      return;
    }
    App.session = {
      subject, mode,
      subjectName: subject === 'maths' ? 'Maths' : 'English',
      modeLabel: MartinData.MODES[mode].label,
      questions,
      idx: 0,
      responses: questions.map(q => ({ id: q.id, response: null, confidence: null })),
      startedAt: Date.now(),
    };
    renderQuestion();
  }

  function renderQuestion() {
    const s = App.session;
    const q = s.questions[s.idx];
    const r = s.responses[s.idx];
    const total = s.questions.length;
    const pct = Math.round(((s.idx) / total) * 100);
    scrollTop();

    let answerHTML = '';
    if (q.type === 'numeric') {
      answerHTML = `
        <div style="display:flex;align-items:center;margin:6px 0 4px">
          <input class="numeric-input" id="numInput" inputmode="decimal" autocomplete="off"
                 placeholder="?" value="${r.response != null ? esc(r.response) : ''}"
                 oninput="Quiz.setNumeric(this.value)" onkeydown="if(event.key==='Enter')Quiz.next()" />
          ${q.unit ? `<span class="numeric-suffix">${esc(q.unit)}</span>` : ''}
        </div>
        <p class="faint">Type your answer${q.unit ? ' (just the number)' : ''}.</p>`;
    } else {
      const keys = ['A', 'B', 'C', 'D', 'E', 'F'];
      answerHTML = `<div class="options">` + q.options.map((opt, i) => `
        <button class="option ${r.response === opt ? 'selected' : ''}" onclick="Quiz.setChoice(${i})">
          <span class="key">${keys[i]}</span><span>${esc(opt)}</span>
        </button>`).join('') + `</div>`;
    }

    const gaugeHTML = MartinData.CONFIDENCE.map(c => `
      <button data-c="${c.v}" class="${r.confidence === c.v ? 'selected' : ''}" onclick="Quiz.setConfidence(${c.v})">
        <span class="dot"></span>${esc(c.label)}
      </button>`).join('');

    $app().innerHTML = `
      <div class="quiz-head no-print">
        <span class="pill subject-${s.subject}">${s.subject === 'maths' ? '🔢 Maths' : '📖 English'} · ${esc(s.modeLabel)}</span>
        <span class="qnum">Question ${s.idx + 1} of ${total}</span>
      </div>
      <div class="progress"><span style="width:${pct}%"></span></div>

      <div class="card">
        <div class="row-between" style="margin-bottom:10px">
          <span class="qtopic">${MartinData.topicEmoji(s.subject, q.topic)} ${esc(MartinData.topicName(s.subject, q.topic))}</span>
        </div>

        ${q.passage ? `<div class="passage">
            ${q.passageTitle ? `<h4>${esc(q.passageTitle)}</h4>` : ''}
            ${esc(q.passage).replace(/\n/g, '<br>')}
          </div>` : ''}

        <div class="stem">${esc(q.stem)}</div>
        ${q.figure ? `<div class="figure">${q.figure}</div>` : ''}
        ${answerHTML}

        <div class="confidence">
          <span class="label">How sure are you? 🤔</span>
          <div class="gauge">${gaugeHTML}</div>
        </div>
      </div>

      <div class="quiz-nav no-print">
        <button class="btn soft" ${s.idx === 0 ? 'disabled' : ''} onclick="Quiz.prev()">← Back</button>
        <span class="faint" id="navHint"></span>
        ${s.idx === total - 1
          ? `<button class="btn" onclick="Quiz.finish()">Finish &amp; see report ✅</button>`
          : `<button class="btn" onclick="Quiz.next()">Next →</button>`}
      </div>
    `;
  }

  function setChoice(i) {
    const s = App.session;
    s.responses[s.idx].response = s.questions[s.idx].options[i];
    // reflect selection without full re-render
    document.querySelectorAll('.option').forEach((el, idx) => el.classList.toggle('selected', idx === i));
  }
  function setNumeric(val) { App.session.responses[App.session.idx].response = val; }
  function setConfidence(v) {
    App.session.responses[App.session.idx].confidence = v;
    document.querySelectorAll('.gauge button').forEach(b => b.classList.toggle('selected', +b.dataset.c === v));
  }

  function next() { const s = App.session; if (s.idx < s.questions.length - 1) { s.idx++; renderQuestion(); } }
  function prev() { const s = App.session; if (s.idx > 0) { s.idx--; renderQuestion(); } }

  function finish() {
    const s = App.session;
    const unanswered = s.responses.filter(r => r.response == null || r.response === '').length;
    const noConf = s.responses.filter(r => r.confidence == null).length;
    let msg = 'Finish the test and see your report?';
    if (unanswered) msg += `\n\n• ${unanswered} question(s) not answered (they'll be marked as incorrect).`;
    if (noConf) msg += `\n• ${noConf} question(s) without a confidence rating.`;
    if (unanswered || noConf) {
      if (!confirm(msg)) return;
    }
    const report = Report.build(s);
    App.lastReport = report;
    saveReport(report);
    go('#/report');
  }

  return { start, renderQuestion, setChoice, setNumeric, setConfidence, next, prev, finish };
})();
