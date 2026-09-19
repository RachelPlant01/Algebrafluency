/* ===================== Hit the Algebra Button ===================== */

const state = {
  mode: null,          // 'times' | 'decimals' | 'algebra'
  timerLength: 60,
  score: 0,
  streak: 0,
  bestStreak: 0,
  correctCount: 0,
  wrongCount: 0,
  timeLeft: 60,
  timerId: null,
  current: null,        // {questionText, answer, options:[{label, correct}]}
  settings: {
    times: { tables: [] },
    squares: { type: 'mix' },
    negatives: { tables: [], level: 1 },
    decimals: { level: 1 },
    algebra: { level: 1, variables: ['x','y'] }
  }
};

/* ---------- helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ===================== SCREEN NAVIGATION ===================== */
function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
}

/* ===================== HOME ===================== */
$$('.mode-card').forEach(card => {
  card.addEventListener('click', () => {
    state.mode = card.dataset.mode;
    openSettings(state.mode);
  });
});

/* ===================== SETTINGS ===================== */
const SETTINGS_META = {
  times: {
    title: 'Times Tables',
    themeClass: 'mode-times-theme'
  },
  squares: {
    title: 'Squares & Roots',
    themeClass: 'mode-squares-theme'
  },
  negatives: {
    title: 'Negative Numbers',
    themeClass: 'mode-negatives-theme'
  },
  decimals: {
    title: 'Multiples & Decimals',
    themeClass: 'mode-decimals-theme'
  },
  algebra: {
    title: 'Algebra',
    themeClass: 'mode-algebra-theme'
  }
};

function openSettings(mode) {
  const meta = SETTINGS_META[mode];
  $('#settings-title').textContent = meta.title;
  const body = $('#settings-body');
  body.innerHTML = '';
  document.body.className = '';
  document.body.classList.add(meta.themeClass);

  if (mode === 'times') {
    body.appendChild(buildTimesSettings());
  } else if (mode === 'squares') {
    body.appendChild(buildSquaresSettings());
  } else if (mode === 'negatives') {
    body.appendChild(buildNegativesSettings());
  } else if (mode === 'decimals') {
    body.appendChild(buildDecimalsSettings());
  } else if (mode === 'algebra') {
    body.appendChild(buildAlgebraSettings());
  }

  showScreen('screen-settings');
}

function buildTimesSettings() {
  const wrap = document.createElement('div');
  const label = document.createElement('p');
  label.className = 'settings-label';
  label.textContent = 'Which tables?';
  wrap.appendChild(label);

  const hint = document.createElement('p');
  hint.className = 'settings-hint';
  hint.textContent = 'Tap the ones you want to practise. Leave none picked for a mix of all of them.';
  wrap.appendChild(hint);

  const row = document.createElement('div');
  row.className = 'chip-row';
  row.id = 'times-chips';

  const allTables = [2,3,4,5,6,7,8,9,10,11,12];
  allTables.forEach(t => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = t + '×';
    chip.dataset.table = t;
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const selected = $$('#times-chips .chip.selected').map(c => Number(c.dataset.table));
      state.settings.times.tables = selected;
    });
    row.appendChild(chip);
  });
  wrap.appendChild(row);
  state.settings.times.tables = [];
  return wrap;
}

function buildSquaresSettings() {
  const wrap = document.createElement('div');
  const label = document.createElement('p');
  label.className = 'settings-label';
  label.textContent = 'Question type';
  wrap.appendChild(label);

  const row = document.createElement('div');
  row.className = 'chip-row';
  row.id = 'squares-type-chips';

  const types = [
    { key: 'mix', title: 'Mix of both', desc: 'e.g. 4² = 16, 50² = 2500, (-6)² = 36, √0.36 = 0.6' },
    { key: 'square', title: 'Squares only', desc: 'e.g. 7² = 49, 50² = 2500, (-3)² = 9, 0.6² = 0.36' },
    { key: 'root', title: 'Square roots only', desc: 'e.g. √49 = 7, √2500 = 50, √0.36 = 0.6' }
  ];
  types.forEach((t, i) => {
    const chip = document.createElement('button');
    chip.className = 'chip level-chip' + (i === 0 ? ' selected' : '');
    chip.dataset.type = t.key;
    chip.innerHTML = `${t.title}<span class="chip-desc">${t.desc}</span>`;
    chip.addEventListener('click', () => {
      $$('#squares-type-chips .chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.settings.squares.type = t.key;
    });
    row.appendChild(chip);
  });
  wrap.appendChild(row);
  state.settings.squares.type = 'mix';
  return wrap;
}

function buildNegativesSettings() {
  const wrap = document.createElement('div');
  const label = document.createElement('p');
  label.className = 'settings-label';
  label.textContent = 'Which tables?';
  wrap.appendChild(label);

  const hint = document.createElement('p');
  hint.className = 'settings-hint';
  hint.textContent = 'Tap the ones you want to practise. Leave none picked for a mix of all of them.';
  wrap.appendChild(hint);

  const row = document.createElement('div');
  row.className = 'chip-row';
  row.id = 'negatives-chips';

  const allTables = [2,3,4,5,6,7,8,9,10,11,12];
  allTables.forEach(t => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = t + '×';
    chip.dataset.table = t;
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const selected = $$('#negatives-chips .chip.selected').map(c => Number(c.dataset.table));
      state.settings.negatives.tables = selected;
    });
    row.appendChild(chip);
  });
  wrap.appendChild(row);
  state.settings.negatives.tables = [];

  const levelLabel = document.createElement('p');
  levelLabel.className = 'settings-label';
  levelLabel.style.marginTop = '18px';
  levelLabel.textContent = 'Difficulty';
  wrap.appendChild(levelLabel);

  const levelRow = document.createElement('div');
  levelRow.className = 'chip-row';
  levelRow.id = 'negatives-level-chips';
  const levels = [
    { level: 1, title: 'Level 1 — One negative number', desc: 'e.g. -6 × 7, 5 × -8 (always a negative answer)' },
    { level: 2, title: 'Level 2 — Mixed signs', desc: 'e.g. -4 × -9 (two negatives too)' }
  ];
  levels.forEach((l, i) => {
    const chip = document.createElement('button');
    chip.className = 'chip level-chip' + (i === 0 ? ' selected' : '');
    chip.dataset.level = l.level;
    chip.innerHTML = `${l.title}<span class="chip-desc">${l.desc}</span>`;
    chip.addEventListener('click', () => {
      $$('#negatives-level-chips .chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.settings.negatives.level = l.level;
    });
    levelRow.appendChild(chip);
  });
  wrap.appendChild(levelRow);
  state.settings.negatives.level = 1;

  return wrap;
}

function buildDecimalsSettings() {
  const wrap = document.createElement('div');
  const label = document.createElement('p');
  label.className = 'settings-label';
  label.textContent = 'Difficulty';
  wrap.appendChild(label);

  const row = document.createElement('div');
  row.className = 'chip-row';
  row.id = 'decimals-level-chips';

  const levels = [
    { level: 1, title: 'Level 1 — Multiples of 10', desc: 'e.g. 5 × 0.7, 40 × 80, 30 × 6' },
    { level: 2, title: 'Level 2 — Multiples of 100', desc: 'e.g. 300 × 0.2, 40 × 0.03' },
    { level: 3, title: 'Level 3 — Decimal × Decimal', desc: 'e.g. 0.3 × 0.4, 0.02 × 0.6' }
  ];

  levels.forEach((l, i) => {
    const chip = document.createElement('button');
    chip.className = 'chip level-chip' + (i === 0 ? ' selected' : '');
    chip.dataset.level = l.level;
    chip.innerHTML = `${l.title}<span class="chip-desc">${l.desc}</span>`;
    chip.addEventListener('click', () => {
      $$('#decimals-level-chips .chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.settings.decimals.level = l.level;
    });
    row.appendChild(chip);
  });
  wrap.appendChild(row);
  state.settings.decimals.level = 1;
  return wrap;
}

function buildAlgebraSettings() {
  const wrap = document.createElement('div');

  const varLabel = document.createElement('p');
  varLabel.className = 'settings-label';
  varLabel.textContent = 'Letters';
  wrap.appendChild(varLabel);

  const varRow = document.createElement('div');
  varRow.className = 'chip-row';
  varRow.id = 'algebra-var-chips';
  const varOptions = [
    { key: 'x', label: 'x only' },
    { key: 'y', label: 'y only' },
    { key: 'mixed', label: 'x and y' }
  ];
  varOptions.forEach((opt, i) => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (i === 2 ? ' selected' : '');
    chip.textContent = opt.label;
    chip.dataset.key = opt.key;
    chip.addEventListener('click', () => {
      $$('#algebra-var-chips .chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.settings.algebra.variables = opt.key === 'mixed' ? ['x','y'] : [opt.key];
    });
    varRow.appendChild(chip);
  });
  wrap.appendChild(varRow);
  state.settings.algebra.variables = ['x','y'];

  const levelLabel = document.createElement('p');
  levelLabel.className = 'settings-label';
  levelLabel.style.marginTop = '18px';
  levelLabel.textContent = 'Difficulty';
  wrap.appendChild(levelLabel);

  const levelRow = document.createElement('div');
  levelRow.className = 'chip-row';
  levelRow.id = 'algebra-level-chips';
  const levels = [
    { level: 1, title: 'Level 1 — Coefficient × term', desc: 'e.g. 8y × 3, 5x × 4' },
    { level: 2, title: 'Level 2 — Term × term', desc: 'e.g. 3x × 2x, 4y × 2y' },
    { level: 3, title: 'Level 3 — Mixed & harder', desc: 'negatives, x² × x, bigger numbers' }
  ];
  levels.forEach((l, i) => {
    const chip = document.createElement('button');
    chip.className = 'chip level-chip' + (i === 0 ? ' selected' : '');
    chip.dataset.level = l.level;
    chip.innerHTML = `${l.title}<span class="chip-desc">${l.desc}</span>`;
    chip.addEventListener('click', () => {
      $$('#algebra-level-chips .chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.settings.algebra.level = l.level;
    });
    levelRow.appendChild(chip);
  });
  wrap.appendChild(levelRow);
  state.settings.algebra.level = 1;

  return wrap;
}

$('#settings-back').addEventListener('click', () => showScreen('screen-home'));

$$('#timer-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    $$('#timer-chips .chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    state.timerLength = Number(chip.dataset.timer);
  });
});

$('#start-btn').addEventListener('click', startGame);

/* ===================== QUESTION GENERATORS ===================== */

/* ---- Times tables ---- */
// Builds a shuffled list of multipliers (1-12, excluding `exclude`) with the
// closest ones to `exclude` first, so distractors are plausible but every
// option is still a genuine multiple of the table being practised.
function multiplierPool(exclude, max = 12) {
  const near = [exclude-1, exclude+1, exclude-2, exclude+2].filter(m => m >= 1 && m <= max && m !== exclude);
  const all = Array.from({ length: max }, (_, i) => i + 1);
  const others = all.filter(m => m !== exclude && !near.includes(m));
  return shuffle(near).concat(shuffle(others));
}

function genTimesQuestion() {
  const tables = state.settings.times.tables.length ? state.settings.times.tables : [2,3,4,5,6,7,8,9,10,11,12];
  const a = pick(tables);
  const b = randInt(1, 12);
  const product = a * b;

  if (Math.random() < 0.5) {
    // Division: product ÷ table = multiplier — the exact inverse fact.
    const options = new Set([b]);
    for (const m of multiplierPool(b)) {
      if (options.size >= 4) break;
      options.add(m);
    }
    return {
      questionText: `${product} ÷ ${a}`,
      answerLabel: String(b),
      options: shuffle(Array.from(options)).map(v => ({ label: String(v), correct: v === b }))
    };
  }

  const options = new Set([product]);
  for (const m of multiplierPool(b)) {
    if (options.size >= 4) break;
    options.add(a * m);
  }
  return {
    questionText: `${a} × ${b}`,
    answerLabel: String(product),
    options: shuffle(Array.from(options)).map(v => ({ label: String(v), correct: v === product }))
  };
}

/* ---- Squares & Roots ---- */
const SQUARES_UNIT_MAX = 15;   // whole numbers 1-15
const SQUARES_SCALED_MAX = 9;  // magnitude 1-9 for the ×10 and ÷10 categories

// Picks the number to square: mostly a whole number 1-15, sometimes a
// multiple of ten (10-90) or a tenth (0.1-0.9). {mag, scale, max} matches
// the {digit, scale} shape factorDisplay/coreScaleToDecimalString expect
// (value = mag × 10^scale), so those helpers work unchanged here.
function pickSquareBase() {
  const roll = Math.random();
  if (roll < 0.55) return { mag: randInt(1, SQUARES_UNIT_MAX), scale: 0, max: SQUARES_UNIT_MAX };
  if (roll < 0.775) return { mag: randInt(1, SQUARES_SCALED_MAX), scale: 1, max: SQUARES_SCALED_MAX };
  return { mag: randInt(1, SQUARES_SCALED_MAX), scale: -1, max: SQUARES_SCALED_MAX };
}

function genSquaresQuestion() {
  const type = state.settings.squares.type || 'mix';
  const isRoot = type === 'root' ? true : type === 'square' ? false : Math.random() < 0.5;
  const base = pickSquareBase();
  const baseDisplay = factorDisplay({ digit: base.mag, scale: base.scale });
  const squareStr = coreScaleToDecimalString(base.mag * base.mag, base.scale * 2);

  if (isRoot) {
    // Square root: always the principal (positive) root — no negative bases here.
    const options = new Set([baseDisplay]);
    for (const m of multiplierPool(base.mag, base.max)) {
      if (options.size >= 4) break;
      options.add(factorDisplay({ digit: m, scale: base.scale }));
    }
    return {
      questionText: `√${squareStr}`,
      answerLabel: baseDisplay,
      options: shuffle(Array.from(options)).map(v => ({ label: v, correct: v === baseDisplay }))
    };
  }

  // Square: sometimes a negative base, shown in brackets — e.g. (-7)² = 49.
  const isNegative = Math.random() < 0.35;
  const questionText = `${isNegative ? `(-${baseDisplay})` : baseDisplay}²`;

  const options = new Set([squareStr]);
  if (isNegative) options.add('-' + squareStr); // classic mistake: forgetting a negative squared is positive
  for (const m of multiplierPool(base.mag, base.max)) {
    if (options.size >= 4) break;
    options.add(coreScaleToDecimalString(m * m, base.scale * 2));
  }

  return {
    questionText,
    answerLabel: squareStr,
    options: shuffle(Array.from(options)).map(v => ({ label: v, correct: v === squareStr }))
  };
}

/* ---- Times tables with negative numbers ---- */
function genNegativesQuestion() {
  const tables = state.settings.negatives.tables.length ? state.settings.negatives.tables : [2,3,4,5,6,7,8,9,10,11,12];
  const level = state.settings.negatives.level || 1;
  const aMag = pick(tables);
  const bMag = randInt(1, 12);

  let aSign, bSign;
  if (level === 1) {
    if (Math.random() < 0.5) { aSign = -1; bSign = 1; } else { aSign = 1; bSign = -1; }
  } else {
    aSign = Math.random() < 0.5 ? -1 : 1;
    bSign = Math.random() < 0.5 ? -1 : 1;
  }

  const a = aSign * aMag;
  const b = bSign * bMag;
  const product = a * b;
  const productSign = aSign * bSign;

  if (Math.random() < 0.5) {
    // Division: product ÷ table = multiplier, signs and all.
    const options = new Set([b, -b]);
    for (const m of multiplierPool(bMag)) {
      if (options.size >= 4) break;
      const useFlippedSign = Math.random() < 0.4;
      options.add((useFlippedSign ? -bSign : bSign) * m);
    }
    return {
      questionText: `${product} ÷ ${a}`,
      answerLabel: String(b),
      options: shuffle(Array.from(options)).map(v => ({ label: String(v), correct: v === b }))
    };
  }

  // Every option is ± (aMag × some multiplier 1-12) — a genuine table value,
  // just possibly with the wrong sign or the wrong multiplier, never an
  // unrelated number.
  const options = new Set([product, -product]);
  for (const m of multiplierPool(bMag)) {
    if (options.size >= 4) break;
    const magVal = aMag * m;
    const useFlippedSign = Math.random() < 0.4;
    options.add((useFlippedSign ? -productSign : productSign) * magVal);
  }

  return {
    questionText: `${a} × ${b}`,
    answerLabel: String(product),
    options: shuffle(Array.from(options)).map(v => ({ label: String(v), correct: v === product }))
  };
}

/* ---- Multiples & Decimals ---- */
// A factor is {digit (1-9), scale (power of ten)}
function makeFactor(kind) {
  const digit = randInt(1, 9);
  const scaleMap = { unit: 0, ten: 1, hundred: 2, tenth: -1, hundredth: -2 };
  return { digit, scale: scaleMap[kind], kind };
}

function factorDisplay(f) {
  if (f.scale >= 0) return String(f.digit * Math.pow(10, f.scale));
  const shift = -f.scale;
  return '0.' + '0'.repeat(shift - 1) + f.digit;
}

// Keeps a distractor digit within the valid 1-9 range by wrapping around.
function wrapDigit(d) {
  return ((d - 1) % 9 + 9) % 9 + 1;
}

function coreScaleToDecimalString(core, totalScale) {
  if (totalScale >= 0) return String(core * Math.pow(10, totalScale));
  const shift = -totalScale;
  let s = String(core).padStart(shift + 1, '0');
  let intPart = s.slice(0, s.length - shift);
  let fracPart = s.slice(s.length - shift);
  fracPart = fracPart.replace(/0+$/, '');
  if (fracPart === '') return intPart;
  return intPart + '.' + fracPart;
}

const DECIMAL_TEMPLATES = {
  1: [['unit','tenth'], ['ten','ten'], ['ten','unit']],
  2: [['hundred','tenth'], ['ten','hundredth'], ['hundred','hundred'], ['unit','hundredth']],
  3: [['tenth','tenth'], ['hundredth','tenth'], ['hundred','unit']]
};

function decimalsPoolForLevel(level) {
  let pool = DECIMAL_TEMPLATES[1].slice();
  if (level >= 2) pool = pool.concat(DECIMAL_TEMPLATES[2]);
  if (level >= 3) pool = pool.concat(DECIMAL_TEMPLATES[3]);
  return pool;
}

function genDecimalsQuestion() {
  const level = state.settings.decimals.level || 1;
  const pool = decimalsPoolForLevel(level);
  const [kindA, kindB] = pick(pool);
  const fa = makeFactor(kindA);
  const fb = makeFactor(kindB);
  const core = fa.digit * fb.digit;
  const totalScale = fa.scale + fb.scale;
  const productStr = coreScaleToDecimalString(core, totalScale);

  if (Math.random() < 0.5) {
    // Division: product ÷ one factor = the other factor, the exact inverse.
    const [divisor, quotient] = Math.random() < 0.5 ? [fa, fb] : [fb, fa];
    const answer = factorDisplay(quotient);
    const optionSet = new Set([answer]);
    const variantMakers = [
      () => factorDisplay({ digit: quotient.digit, scale: quotient.scale + 1 }),
      () => factorDisplay({ digit: quotient.digit, scale: quotient.scale - 1 }),
      () => factorDisplay({ digit: wrapDigit(quotient.digit + pick([-1,1,2,-2])), scale: quotient.scale }),
      () => factorDisplay({ digit: quotient.digit, scale: quotient.scale + pick([-2,2]) })
    ];
    let guard = 0;
    while (optionSet.size < 4 && guard < 40) {
      guard++;
      const val = pick(variantMakers)();
      if (val !== answer && Number(val) > 0) optionSet.add(val);
    }
    return {
      questionText: `${productStr} ÷ ${factorDisplay(divisor)}`,
      answerLabel: answer,
      options: shuffle(Array.from(optionSet)).map(v => ({ label: v, correct: v === answer }))
    };
  }

  const optionSet = new Set([productStr]);
  const variantMakers = [
    () => coreScaleToDecimalString(core, totalScale + 1),
    () => coreScaleToDecimalString(core, totalScale - 1),
    () => coreScaleToDecimalString(Math.max(1, core + pick([-1,1,2,-2])), totalScale),
    () => coreScaleToDecimalString(fa.digit === fb.digit ? core : (fa.digit + 1) * fb.digit, totalScale),
    () => coreScaleToDecimalString(core, totalScale + pick([-2,2]))
  ];
  let guard = 0;
  while (optionSet.size < 4 && guard < 40) {
    guard++;
    const val = pick(variantMakers)();
    if (val !== productStr && Number(val) > 0) optionSet.add(val);
  }

  return {
    questionText: `${factorDisplay(fa)} × ${factorDisplay(fb)}`,
    answerLabel: productStr,
    options: shuffle(Array.from(optionSet)).map(v => ({ label: v, correct: v === productStr }))
  };
}

/* ---- Algebra ---- */
const SUPERSCRIPT = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };

function formatTerm(coef, letter, exp) {
  if (!letter || exp === 0) return String(coef);
  let coefPart;
  if (coef === 1) coefPart = '';
  else if (coef === -1) coefPart = '-';
  else coefPart = String(coef);
  const expPart = SUPERSCRIPT[exp] !== undefined ? SUPERSCRIPT[exp] : ('^' + exp);
  return `${coefPart}<em class="var-letter">${letter}</em>${expPart}`;
}

function randomTerm({ letter, allowNegative, maxCoef, exp }) {
  let coef = randInt(2, maxCoef);
  if (allowNegative && Math.random() < 0.35) coef = -coef;
  return { coef, letter, exp };
}

function multiplyTerms(t1, t2) {
  const coef = t1.coef * t2.coef;
  if (t1.letter && t2.letter && t1.letter === t2.letter) {
    return { coef, letter: t1.letter, exp: t1.exp + t2.exp };
  }
  if (t1.letter && !t2.letter) return { coef, letter: t1.letter, exp: t1.exp };
  if (!t1.letter && t2.letter) return { coef, letter: t2.letter, exp: t2.exp };
  return { coef, letter: null, exp: 0 };
}

function genAlgebraQuestion() {
  const level = state.settings.algebra.level || 1;
  const vars = state.settings.algebra.variables.length ? state.settings.algebra.variables : ['x','y'];
  const letter = pick(vars);
  const allowNegative = level >= 3;
  const maxCoef = level >= 3 ? 12 : (level === 2 ? 9 : 9);

  let t1, t2;
  if (level === 1) {
    t1 = randomTerm({ letter, allowNegative: false, maxCoef, exp: 1 });
    t2 = { coef: randInt(2, maxCoef), letter: null, exp: 0 };
    if (Math.random() < 0.5) [t1, t2] = [t2, t1];
  } else if (level === 2) {
    t1 = randomTerm({ letter, allowNegative: false, maxCoef, exp: 1 });
    t2 = randomTerm({ letter, allowNegative: false, maxCoef, exp: 1 });
  } else {
    const pattern = pick(['termTerm', 'squareTerm', 'coefTerm', 'negTerm']);
    if (pattern === 'termTerm') {
      t1 = randomTerm({ letter, allowNegative, maxCoef, exp: 1 });
      t2 = randomTerm({ letter, allowNegative, maxCoef, exp: 1 });
    } else if (pattern === 'squareTerm') {
      t1 = { coef: randInt(2, maxCoef), letter, exp: 2 };
      t2 = randomTerm({ letter, allowNegative, maxCoef, exp: 1 });
    } else if (pattern === 'coefTerm') {
      t1 = randomTerm({ letter, allowNegative, maxCoef, exp: 1 });
      t2 = { coef: randInt(2, maxCoef), letter: null, exp: 0 };
    } else {
      t1 = randomTerm({ letter, allowNegative: true, maxCoef, exp: 1 });
      t2 = randomTerm({ letter, allowNegative: true, maxCoef, exp: 1 });
    }
  }

  const result = multiplyTerms(t1, t2);

  if (Math.random() < 0.5) {
    // Division: (t1 × t2) ÷ one term = the other term, the exact inverse.
    const [divisor, quotient] = Math.random() < 0.5 ? [t1, t2] : [t2, t1];
    const answer = formatTerm(quotient.coef, quotient.letter, quotient.exp);
    const questionText = `${formatTerm(result.coef, result.letter, result.exp)} ÷ ${formatTerm(divisor.coef, divisor.letter, divisor.exp)}`;

    const variants = new Set([answer]);
    const variantMakers = [
      () => formatTerm(quotient.coef, quotient.letter, result.exp),                    // forgot to subtract exponents
      () => formatTerm(quotient.coef, quotient.letter, quotient.exp + 1),              // exponent off by one
      () => formatTerm(quotient.coef + pick([-2,-1,1,2]), quotient.letter, quotient.exp),
      () => formatTerm(-quotient.coef, quotient.letter, quotient.exp),                 // sign slip
      () => formatTerm(result.coef, quotient.letter, quotient.exp)                     // used dividend's coefficient instead of dividing
    ];
    let guard = 0;
    while (variants.size < 4 && guard < 40) {
      guard++;
      const val = pick(variantMakers)();
      if (val !== answer && val !== '0' && val !== '-0') variants.add(val);
    }

    return {
      questionText,
      answerLabel: answer,
      options: shuffle(Array.from(variants)).map(v => ({ label: v, correct: v === answer }))
    };
  }

  const answer = formatTerm(result.coef, result.letter, result.exp);
  const questionText = `${formatTerm(t1.coef, t1.letter, t1.exp)} × ${formatTerm(t2.coef, t2.letter, t2.exp)}`;

  const variants = new Set([answer]);
  const variantMakers = [
    () => formatTerm(result.coef, result.letter, 1),                       // forgot to add exponents
    () => formatTerm(t1.coef + t2.coef, result.letter, result.exp),        // added coefficients instead of multiplying
    () => formatTerm(result.coef, result.letter, result.exp + 1),          // exponent off by one
    () => formatTerm(result.coef + pick([-2,-1,1,2]), result.letter, result.exp),
    () => formatTerm(-result.coef, result.letter, result.exp)              // sign slip
  ];
  let guard = 0;
  while (variants.size < 4 && guard < 40) {
    guard++;
    const val = pick(variantMakers)();
    if (val !== answer && val !== '0' && val !== '-0') variants.add(val);
  }

  return {
    questionText,
    answerLabel: answer,
    options: shuffle(Array.from(variants)).map(v => ({ label: v, correct: v === answer }))
  };
}

function generateQuestion() {
  if (state.mode === 'times') return genTimesQuestion();
  if (state.mode === 'squares') return genSquaresQuestion();
  if (state.mode === 'negatives') return genNegativesQuestion();
  if (state.mode === 'decimals') return genDecimalsQuestion();
  if (state.mode === 'algebra') return genAlgebraQuestion();
}

/* ===================== GAME LOOP ===================== */
function startGame() {
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.correctCount = 0;
  state.wrongCount = 0;
  state.timeLeft = state.timerLength;

  const themeClass = SETTINGS_META[state.mode].themeClass;
  document.body.className = '';
  document.body.classList.add(themeClass);

  $('#hud-score').textContent = '0';
  $('#hud-streak').textContent = '0';
  $('#hud-time-wrap').style.display = state.timerLength > 0 ? 'block' : 'none';
  $('#sign-hint').style.display = state.mode === 'negatives' ? 'block' : 'none';
  $('#hud-time').textContent = state.timeLeft;
  $('#timer-bar').style.width = '100%';
  $('#timer-bar-wrap') && null;
  $('.timer-bar-wrap') && ($('.timer-bar-wrap').style.display = state.timerLength > 0 ? 'block' : 'none');

  showScreen('screen-game');
  nextQuestion();

  clearInterval(state.timerId);
  if (state.timerLength > 0) {
    state.timerId = setInterval(tick, 1000);
  }
}

function tick() {
  state.timeLeft--;
  $('#hud-time').textContent = Math.max(0, state.timeLeft);
  $('#timer-bar').style.width = Math.max(0, (state.timeLeft / state.timerLength) * 100) + '%';
  if (state.timeLeft <= 0) {
    endGame();
  }
}

function nextQuestion() {
  state.current = generateQuestion();
  $('#question').innerHTML = state.current.questionText;
  const answersWrap = $('#answers');
  answersWrap.innerHTML = '';
  state.current.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.innerHTML = opt.label;
    btn.dataset.correct = opt.correct ? 'true' : 'false';
    btn.addEventListener('click', () => handleAnswer(btn, opt.correct));
    answersWrap.appendChild(btn);
  });
}

function handleAnswer(btn, correct) {
  $$('.answer-btn').forEach(b => b.disabled = true);
  const flash = $('#feedback-flash');

  if (correct) {
    btn.classList.add('correct');
    state.score++;
    state.streak++;
    state.correctCount++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    flash.className = 'feedback-flash flash-correct';
  } else {
    btn.classList.add('wrong');
    state.streak = 0;
    state.wrongCount++;
    flash.className = 'feedback-flash flash-wrong';
    $$('.answer-btn').forEach(b => {
      if (b.dataset.correct === 'true') b.classList.add('correct');
    });
  }
  requestAnimationFrame(() => { flash.className = 'feedback-flash'; });

  $('#hud-score').textContent = state.score;
  $('#hud-streak').textContent = state.streak;

  setTimeout(() => {
    if (state.timerLength === 0 || state.timeLeft > 0) {
      nextQuestion();
    }
  }, 450);
}

$('#quit-btn').addEventListener('click', () => {
  clearInterval(state.timerId);
  showScreen('screen-home');
});

/* ===================== RESULTS ===================== */
function endGame() {
  clearInterval(state.timerId);
  const total = state.correctCount + state.wrongCount;
  const accuracy = total ? Math.round((state.correctCount / total) * 100) : 0;

  $('#res-score').textContent = state.score;
  $('#res-streak').textContent = state.bestStreak;
  $('#res-accuracy').textContent = accuracy + '%';

  let msg = 'Keep practising!';
  if (accuracy >= 90) msg = 'Amazing work! 🌟';
  else if (accuracy >= 70) msg = 'Great job! 👏';
  else if (accuracy >= 50) msg = 'Good effort — try again! 💪';

  $('#res-message').textContent = msg;
  showScreen('screen-results');
}

$('#play-again-btn').addEventListener('click', startGame);
$('#change-mode-btn').addEventListener('click', () => showScreen('screen-home'));

/* ===================== KEYBOARD SHORTCUTS ===================== */
document.addEventListener('keydown', (e) => {
  if (!$('#screen-game').classList.contains('active')) return;
  const idx = Number(e.key) - 1;
  const buttons = $$('.answer-btn');
  if (idx >= 0 && idx < buttons.length && !buttons[idx].disabled) {
    buttons[idx].click();
  }
});
