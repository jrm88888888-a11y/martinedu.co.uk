/* ==========================================================================
   data.js — topic taxonomy, question loading, test assembly, answer checking
   Data-driven: to grow the bank to ~1000+1000, just add more objects to the
   JSON files in /data. Nothing else needs to change.
   ========================================================================== */

const MartinData = (() => {

  /* ---- Topic taxonomy (aligned to the SEAG English & Maths domains) ---- */
  const TOPICS = {
    maths: [
      { id: 'number',   name: 'Number & Place Value', emoji: '🔢', weight: 5 },
      { id: 'fdp',      name: 'Fractions, Decimals & Percentages', emoji: '🍰', weight: 6, flagship: true },
      { id: 'ratio',    name: 'Ratio & Proportion',   emoji: '⚖️', weight: 3 },
      { id: 'algebra',  name: 'Algebra & Patterns',   emoji: '🧩', weight: 4 },
      { id: 'measures', name: 'Measures',             emoji: '📏', weight: 5 },
      { id: 'money',    name: 'Money',                emoji: '💷', weight: 3 },
      { id: 'geometry', name: 'Shape & Space',        emoji: '📐', weight: 5 },
      { id: 'data',     name: 'Data & Probability',   emoji: '📊', weight: 4 },
    ],
    english: [
      { id: 'comprehension', name: 'Reading Comprehension', emoji: '📖', weight: 7 },
      { id: 'cloze',         name: 'Cloze (Gap-fill)',      emoji: '🕳️', weight: 4 },
      { id: 'spelling',      name: 'Spelling',              emoji: '✏️', weight: 4 },
      { id: 'punctuation',   name: 'Punctuation',           emoji: '❗', weight: 4 },
      { id: 'grammar',       name: 'Grammar',               emoji: '🔤', weight: 5 },
      { id: 'synonyms',      name: 'Synonyms & Antonyms',   emoji: '🔁', weight: 5, flagship: true },
      { id: 'vocab',         name: 'Vocabulary & Word Logic', emoji: '🧠', weight: 4 },
    ],
  };

  const MODES = {
    full: { key: 'full', label: 'Full Test', count: 56, mins: 60 },
    mini: { key: 'mini', label: 'Mini-Test', count: 16, mins: 18 },
  };

  const CONFIDENCE = [
    { v: 1, label: 'No idea' },
    { v: 2, label: 'Not so sure' },
    { v: 3, label: 'Neutral' },
    { v: 4, label: 'Quite sure' },
    { v: 5, label: 'Very sure' },
  ];

  let _bank = { maths: [], english: [] }; // flat arrays of questions
  let _loaded = { maths: false, english: false };

  function topicName(subject, id) {
    const t = (TOPICS[subject] || []).find(t => t.id === id);
    return t ? t.name : id;
  }
  function topicEmoji(subject, id) {
    const t = (TOPICS[subject] || []).find(t => t.id === id);
    return t ? t.emoji : '•';
  }

  /* ---- Load question data for a subject ---- */
  async function load(subject) {
    if (_loaded[subject]) return _bank[subject];
    const out = [];
    try {
      const main = await fetch(`data/${subject}/questions.json`).then(r => r.json());
      main.forEach(q => out.push(normQ(q, subject)));
    } catch (e) { console.warn('No main questions for', subject, e); }

    if (subject === 'english') {
      // Comprehension is stored as passages with attached questions
      try {
        const comp = await fetch('data/english/comprehension.json').then(r => r.json());
        comp.forEach(passage => {
          passage.questions.forEach((q, i) => {
            out.push(normQ({
              ...q,
              topic: 'comprehension',
              passageId: passage.id,
              passageTitle: passage.title,
              passage: passage.text,
            }, subject, `${passage.id}-Q${i + 1}`));
          });
        });
      } catch (e) { console.warn('No comprehension data', e); }
    }
    _bank[subject] = out;
    _loaded[subject] = true;
    return out;
  }

  function normQ(q, subject, fallbackId) {
    return {
      id: q.id || fallbackId || (subject[0].toUpperCase() + '-' + Math.random().toString(36).slice(2, 8)),
      subject,
      topic: q.topic,
      type: q.type || 'mcq',            // 'mcq' | 'numeric'
      difficulty: q.difficulty || 2,     // 1 easy, 2 med, 3 hard
      stem: q.stem,
      figure: q.figure || null,          // inline SVG string for visual questions
      options: q.options || null,        // for mcq
      answer: q.answer,                  // correct option text OR numeric answer
      accept: q.accept || null,          // extra accepted numeric strings
      unit: q.unit || '',
      explanation: q.explanation || '',
      skill: q.skill || '',
      passage: q.passage || null,
      passageId: q.passageId || null,
      passageTitle: q.passageTitle || null,
    };
  }

  /* ---- Fisher–Yates shuffle ---- */
  function shuffle(a) {
    const arr = a.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ---- Build a test: proportional coverage across topics, no repeats ---- */
  function buildTest(subject, mode) {
    const target = MODES[mode].count;
    const topics = TOPICS[subject];
    const byTopic = {};
    topics.forEach(t => { byTopic[t.id] = shuffle(_bank[subject].filter(q => q.topic === t.id)); });

    const totalWeight = topics.reduce((s, t) => s + t.weight, 0);
    // Desired count per topic (at least 1 where questions exist)
    const desired = {};
    topics.forEach(t => {
      const d = Math.round(target * (t.weight / totalWeight));
      desired[t.id] = Math.min(Math.max(d, byTopic[t.id].length ? 1 : 0), byTopic[t.id].length);
    });
    // Rounding can push the sum above (or below) target — reconcile to exactly target
    const sumDesired = () => topics.reduce((s, t) => s + desired[t.id], 0);
    let guardR = 0;
    while (sumDesired() > target && guardR++ < 2000) {
      // trim the topic currently contributing the most
      const t = topics.slice().sort((a, b) => desired[b.id] - desired[a.id]).find(t => desired[t.id] > 1)
             || topics.slice().sort((a, b) => desired[b.id] - desired[a.id])[0];
      desired[t.id]--;
    }

    const picked = [];
    const cursor = {};
    topics.forEach(t => cursor[t.id] = 0);

    // First pass: take desired count from each topic
    topics.forEach(t => {
      for (let i = 0; i < desired[t.id]; i++) picked.push(byTopic[t.id][cursor[t.id]++]);
    });
    // Fill remaining slots round-robin from any topic that still has questions
    let guard = 0;
    while (picked.length < target && guard < 5000) {
      guard++;
      let added = false;
      for (const t of topics) {
        if (picked.length >= target) break;
        if (cursor[t.id] < byTopic[t.id].length) { picked.push(byTopic[t.id][cursor[t.id]++]); added = true; }
      }
      if (!added) break; // bank exhausted (prototype has a finite bank)
    }

    // Order: group comprehension questions by passage together, otherwise shuffle
    const comp = picked.filter(q => q.topic === 'comprehension');
    const rest = shuffle(picked.filter(q => q.topic !== 'comprehension'));
    const compByPassage = {};
    comp.forEach(q => { (compByPassage[q.passageId] ||= []).push(q); });
    const compBlocks = Object.values(compByPassage);
    // Put comprehension block(s) first, then the rest.
    // Clone each question and SHUFFLE mcq options so the answer isn't always in
    // the same position (answers are matched by text, so this is safe).
    return [].concat(...compBlocks, rest).map(q =>
      q.type === 'mcq' && q.options ? { ...q, options: shuffle(q.options) } : { ...q });
  }

  function bankCount(subject) { return _bank[subject].length; }
  function bankCountByTopic(subject) {
    const out = {};
    (TOPICS[subject] || []).forEach(t => out[t.id] = _bank[subject].filter(q => q.topic === t.id).length);
    return out;
  }

  /* ---- Answer checking ---- */
  function normStr(s) {
    return String(s ?? '')
      .toLowerCase().trim()
      .replace(/[£$,\s]/g, '')
      .replace(/percent/g, '%');
  }
  function isCorrect(q, response) {
    if (response == null || response === '') return false;
    if (q.type === 'numeric') {
      const cands = [q.answer, ...(q.accept || [])].map(normStr);
      const r = normStr(response);
      if (cands.includes(r)) return true;
      // numeric equivalence (e.g. "0.5" vs ".50")
      const rn = parseFloat(r.replace('%', ''));
      return cands.some(c => {
        const cn = parseFloat(c.replace('%', ''));
        return !isNaN(rn) && !isNaN(cn) && Math.abs(rn - cn) < 1e-9;
      });
    }
    return normStr(response) === normStr(q.answer);
  }

  return {
    TOPICS, MODES, CONFIDENCE,
    load, buildTest, topicName, topicEmoji,
    bankCount, bankCountByTopic, isCorrect, shuffle,
    __all: (subject) => _bank[subject] || [],   // raw pool access for practice sets
  };
})();
