/* ==========================================================================
   figures.js (build-time) — returns self-contained inline SVG strings.
   Used to author SEAG-style VISUAL questions. Each generator returns an SVG
   string that the runtime injects directly (our own trusted content).
   Colours align with the site palette (blue #3D6FF0).
   ========================================================================== */

const BLUE = '#3D6FF0', BLUE2 = '#6C8FF6', INK = '#2A2E45', GREY = '#8A90A6';
const GRID = '#D7DCEA', GREEN = '#27AE8B', AMBER = '#E9A23B', RED = '#E4572E', PURPLE = '#8E7CF0';
const PALETTE = [BLUE, GREEN, AMBER, RED, PURPLE, '#4BB1E8'];

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* ---- Bar chart ---- */
function barChart({ title = '', cats, yStep = 1, yMax = null, yLabel = '' }) {
  const W = 340, H = 240, padL = 40, padB = 46, padT = title ? 30 : 14, padR = 14;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const maxV = yMax || Math.ceil(Math.max(...cats.map(c => c.value)) / yStep) * yStep;
  const bw = plotW / cats.length;
  const y = v => padT + plotH - (v / maxV) * plotH;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">`;
  if (title) s += `<text x="${W/2}" y="18" text-anchor="middle" font-size="15" font-weight="800" fill="${INK}">${esc(title)}</text>`;
  // gridlines + y labels
  for (let v = 0; v <= maxV; v += yStep) {
    const yy = y(v);
    s += `<line x1="${padL}" y1="${yy}" x2="${W-padR}" y2="${yy}" stroke="${GRID}" stroke-width="1"/>`;
    s += `<text x="${padL-6}" y="${yy+4}" text-anchor="end" font-size="11" fill="${GREY}">${v}</text>`;
  }
  if (yLabel) s += `<text transform="translate(12,${padT+plotH/2}) rotate(-90)" text-anchor="middle" font-size="11" fill="${GREY}">${esc(yLabel)}</text>`;
  // bars
  cats.forEach((c, i) => {
    const x = padL + i * bw + bw * 0.18;
    const w = bw * 0.64;
    const yy = y(c.value);
    s += `<rect x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${w.toFixed(1)}" height="${(padT+plotH-yy).toFixed(1)}" rx="4" fill="${PALETTE[i % PALETTE.length]}"/>`;
    s += `<text x="${(x+w/2).toFixed(1)}" y="${H-padB+16}" text-anchor="middle" font-size="12" fill="${INK}">${esc(c.label)}</text>`;
  });
  // axes
  s += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT+plotH}" stroke="${INK}" stroke-width="1.5"/>`;
  s += `<line x1="${padL}" y1="${padT+plotH}" x2="${W-padR}" y2="${padT+plotH}" stroke="${INK}" stroke-width="1.5"/>`;
  s += `</svg>`;
  return s;
}

/* ---- Pictogram ---- */
function pictogram({ title = '', rows, per, symbol = '●' }) {
  const W = 340, rowH = 34, padT = title ? 34 : 12, padL = 96;
  const H = padT + rows.length * rowH + 30;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">`;
  if (title) s += `<text x="${W/2}" y="20" text-anchor="middle" font-size="15" font-weight="800" fill="${INK}">${esc(title)}</text>`;
  rows.forEach((r, i) => {
    const cy = padT + i * rowH + rowH / 2;
    s += `<text x="${padL-10}" y="${cy+5}" text-anchor="end" font-size="13" fill="${INK}">${esc(r.label)}</text>`;
    const full = Math.floor(r.count / per);
    const frac = (r.count % per) / per;
    let x = padL;
    for (let k = 0; k < full; k++) { s += `<text x="${x}" y="${cy+7}" font-size="20" fill="${BLUE}">${symbol}</text>`; x += 24; }
    if (frac > 0) s += `<text x="${x}" y="${cy+7}" font-size="20" fill="${BLUE}" opacity="0.5">${symbol}</text>`;
  });
  s += `<text x="${padL}" y="${H-10}" font-size="11" fill="${GREY}">Key: ${esc(symbol)} = ${per}</text>`;
  s += `</svg>`;
  return s;
}

/* ---- Angle diagram (single angle between two rays) ---- */
function angleDiagram(deg, { label = '?', showArc = true } = {}) {
  const W = 300, H = 200, cx = 70, cy = 150, len = 150;
  const rad = deg * Math.PI / 180;
  const x2 = cx + len * Math.cos(-rad), y2 = cy + len * Math.sin(-rad);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">`;
  s += `<line x1="${cx}" y1="${cy}" x2="${cx+len}" y2="${cy}" stroke="${INK}" stroke-width="2.5"/>`;
  s += `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="2.5"/>`;
  if (showArc) {
    const r = 34;
    const ax = cx + r, ay = cy;
    const bx = cx + r * Math.cos(-rad), by = cy + r * Math.sin(-rad);
    const large = deg > 180 ? 1 : 0;
    s += `<path d="M ${ax} ${ay} A ${r} ${r} 0 ${large} 0 ${bx.toFixed(1)} ${by.toFixed(1)}" fill="none" stroke="${BLUE}" stroke-width="2"/>`;
    const mid = -rad / 2, lr = 52;
    s += `<text x="${(cx+lr*Math.cos(mid)).toFixed(1)}" y="${(cy+lr*Math.sin(mid)+4).toFixed(1)}" text-anchor="middle" font-size="15" font-weight="800" fill="${BLUE}">${esc(label)}</text>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`;
  s += `</svg>`;
  return s;
}

/* ---- Triangle with two known angles ---- */
function triangleAngles(a, b, { unknown = '?' } = {}) {
  const W = 300, H = 210;
  // fixed triangle shape, labels placed at vertices
  const A = [40, 170], B = [260, 170], C = [150, 40];
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">`;
  s += `<polygon points="${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}" fill="${BLUE2}22" stroke="${INK}" stroke-width="2.5"/>`;
  s += `<text x="${A[0]+16}" y="${A[1]-10}" font-size="15" font-weight="800" fill="${BLUE}">${a}°</text>`;
  s += `<text x="${B[0]-40}" y="${B[1]-10}" font-size="15" font-weight="800" fill="${BLUE}">${b}°</text>`;
  s += `<text x="${C[0]-10}" y="${C[1]+26}" font-size="15" font-weight="800" fill="${RED}">${unknown}</text>`;
  s += `</svg>`;
  return s;
}

/* ---- Rectangle with side labels ---- */
function rectangle(l, w, { lUnit = 'cm', showArea = false } = {}) {
  const W = 300, H = 200;
  const maxw = 210, maxh = 130;
  const scale = Math.min(maxw / l, maxh / w);
  const rw = l * scale, rh = w * scale;
  const x = (W - rw) / 2, y = (H - rh) / 2 - 4;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">`;
  s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${rw.toFixed(1)}" height="${rh.toFixed(1)}" fill="${BLUE2}22" stroke="${INK}" stroke-width="2.5"/>`;
  s += `<text x="${(x+rw/2).toFixed(1)}" y="${(y+rh+22).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${l} ${lUnit}</text>`;
  s += `<text x="${(x-10).toFixed(1)}" y="${(y+rh/2+5).toFixed(1)}" text-anchor="end" font-size="14" font-weight="700" fill="${INK}">${w} ${lUnit}</text>`;
  s += `</svg>`;
  return s;
}

/* ---- Coordinate grid with points ---- */
function coordGrid({ points = [], size = 6, mark = null }) {
  const W = 260, H = 260, pad = 26, plot = W - pad - 10;
  const step = plot / size;
  const X = gx => pad + gx * step, Y = gy => (H - pad) - gy * step;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">`;
  for (let i = 0; i <= size; i++) {
    s += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(size)}" stroke="${GRID}"/>`;
    s += `<line x1="${X(0)}" y1="${Y(i)}" x2="${X(size)}" y2="${Y(i)}" stroke="${GRID}"/>`;
    s += `<text x="${X(i)}" y="${Y(0)+16}" text-anchor="middle" font-size="10" fill="${GREY}">${i}</text>`;
    if (i > 0) s += `<text x="${X(0)-8}" y="${Y(i)+4}" text-anchor="end" font-size="10" fill="${GREY}">${i}</text>`;
  }
  s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(size)}" y2="${Y(0)}" stroke="${INK}" stroke-width="2"/>`;
  s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(size)}" stroke="${INK}" stroke-width="2"/>`;
  points.forEach(p => {
    s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="${BLUE}"/>`;
    if (p.label) s += `<text x="${X(p.x)+8}" y="${Y(p.y)-6}" font-size="13" font-weight="800" fill="${BLUE}">${esc(p.label)}</text>`;
  });
  s += `</svg>`;
  return s;
}

/* ---- Regular polygon (name / sides / symmetry) ---- */
function regularPolygon(sides, { lines = 0 } = {}) {
  const W = 220, H = 200, cx = 110, cy = 105, r = 78;
  let pts = [];
  for (let i = 0; i < sides; i++) {
    const ang = -Math.PI / 2 + i * 2 * Math.PI / sides;
    pts.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]);
  }
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">`;
  s += `<polygon points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="${BLUE2}22" stroke="${INK}" stroke-width="2.5"/>`;
  s += `</svg>`;
  return s;
}

/* ---- Shaded fraction bar ---- */
function fractionBar(num, den) {
  const W = 320, H = 70, pad = 10, cw = (W - 2 * pad) / den;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">`;
  for (let i = 0; i < den; i++) {
    const x = pad + i * cw;
    s += `<rect x="${x.toFixed(1)}" y="16" width="${cw.toFixed(1)}" height="38" fill="${i < num ? BLUE : '#fff'}" stroke="${INK}" stroke-width="1.5"/>`;
  }
  s += `</svg>`;
  return s;
}

/* ---- Clock face ---- */
function clock(h, m) {
  const W = 180, H = 180, cx = 90, cy = 90, r = 78;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  for (let i = 1; i <= 12; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 6;
    s += `<text x="${(cx + (r-14) * Math.cos(a)).toFixed(1)}" y="${(cy + (r-14) * Math.sin(a) + 5).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${i}</text>`;
  }
  const hourA = -Math.PI / 2 + ((h % 12) + m / 60) * Math.PI / 6;
  const minA = -Math.PI / 2 + m * Math.PI / 30;
  s += `<line x1="${cx}" y1="${cy}" x2="${(cx + 40 * Math.cos(hourA)).toFixed(1)}" y2="${(cy + 40 * Math.sin(hourA)).toFixed(1)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<line x1="${cx}" y1="${cy}" x2="${(cx + 60 * Math.cos(minA)).toFixed(1)}" y2="${(cy + 60 * Math.sin(minA)).toFixed(1)}" stroke="${BLUE}" stroke-width="3" stroke-linecap="round"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="4" fill="${RED}"/>`;
  s += `</svg>`;
  return s;
}

module.exports = { barChart, pictogram, angleDiagram, triangleAngles, rectangle, coordGrid, regularPolygon, fractionBar, clock };
