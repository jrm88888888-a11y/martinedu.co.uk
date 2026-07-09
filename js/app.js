/* ==========================================================================
   app.js — hash router, home & mode-select views, shared state
   ========================================================================== */

const App = {
  session: null,          // active test session
  lastReport: null,       // last completed report (also saved to localStorage)
};

const $app = () => document.getElementById('app');

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function go(hash) { location.hash = hash; }
function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

/* ---------------- Router ---------------- */
async function router() {
  const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean);
  const view = parts[0] || 'home';

  try {
    if (view === 'home' || !view)      return renderHome();
    if (view === 'mode')               return renderModeSelect(parts[1]);
    if (view === 'test')               return Quiz.start(parts[1], parts[2]);
    if (view === 'report')             return Report.render();
    if (view === 'lessons')            return Lessons.renderList(parts[1]);
    if (view === 'lesson')             return Lessons.renderLesson(parts[1], parts[2]);
    renderHome();
  } catch (e) {
    console.error(e);
    $app().innerHTML = `<div class="card"><h2>Oops!</h2><p>Something went wrong loading that page.</p>
      <button class="btn" onclick="go('#/')">Back to start</button></div>`;
  }
}

/* ---------------- Home: choose subject ---------------- */
function renderHome() {
  scrollTop();
  const saved = loadSavedReport();
  $app().innerHTML = `
    <section class="hero">
      <h1>Let's practise for your SEAG test! 🎯</h1>
      <p>Choose a subject, pick a full test or a quick mini-test, and I'll build you a
         friendly report showing what you're brilliant at and what to practise next.</p>
    </section>

    <div class="pick-grid">
      <button class="subject-card maths" onclick="go('#/mode/maths')">
        <span class="emoji">🔢</span>
        <h2>Maths</h2>
        <p>Number, fractions, shapes, measures, data and more.</p>
      </button>
      <button class="subject-card english" onclick="go('#/mode/english')">
        <span class="emoji">📖</span>
        <h2>English</h2>
        <p>Comprehension, spelling, grammar, vocabulary and more.</p>
      </button>
    </div>

    <div class="spacer"></div>
    <div class="card center">
      <h3>New here? 🌟</h3>
      <p class="muted">Every question has a little <b>confidence gauge</b> — just tap how sure you feel.
         It helps your report spot the tricky topics where you <i>felt</i> sure but slipped up.</p>
      <button class="btn ghost" onclick="go('#/lessons')">Explore the mini-lessons</button>
    </div>

    ${saved ? `
    <div class="card">
      <div class="row-between">
        <div><h3 style="margin:0">Your last report</h3>
        <p class="faint" style="margin:0">${esc(saved.subjectName)} · ${esc(saved.modeLabel)} · scored ${saved.correct}/${saved.total}</p></div>
        <button class="btn soft" onclick="reopenSaved()">Open again</button>
      </div>
    </div>` : ''}
  `;
}

function reopenSaved() {
  const saved = loadSavedReport();
  if (saved) { App.lastReport = saved; go('#/report'); }
}

/* ---------------- Mode select ---------------- */
function renderModeSelect(subject) {
  if (!MartinData.TOPICS[subject]) return renderHome();
  scrollTop();
  const isM = subject === 'maths';
  const name = isM ? 'Maths' : 'English';
  const topics = MartinData.TOPICS[subject];
  $app().innerHTML = `
    <button class="back-link" onclick="go('#/')">← Back</button>
    <div class="card">
      <span class="pill subject-${subject}">${isM ? '🔢' : '📖'} ${name}</span>
      <h1 style="margin-top:12px">Choose your test</h1>
      <div class="mode-grid">
        <button class="mode-card" onclick="go('#/test/${subject}/full')">
          <div class="big">${MartinData.MODES.full.count}</div>
          <h3>Full Test</h3>
          <p>A complete practice paper (~${MartinData.MODES.full.mins} min), just like the real thing.</p>
        </button>
        <button class="mode-card" onclick="go('#/test/${subject}/mini')">
          <div class="big">${MartinData.MODES.mini.count}</div>
          <h3>Mini-Test</h3>
          <p>A quick warm-up (~${MartinData.MODES.mini.mins} min) to practise a little every day.</p>
        </button>
      </div>
      <div class="note">
        <b>Topics covered:</b> ${topics.map(t => `${t.emoji} ${esc(t.name)}`).join(' · ')}
      </div>
    </div>
  `;
}

/* ---------------- Saved report persistence ---------------- */
function saveReport(report) {
  try { localStorage.setItem('martinedu:lastReport', JSON.stringify(report)); } catch (e) {}
}
function loadSavedReport() {
  if (App.lastReport) return App.lastReport;
  try {
    const raw = localStorage.getItem('martinedu:lastReport');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
