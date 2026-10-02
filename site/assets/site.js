'use strict';
const root = document.documentElement;
const themeButton = document.getElementById('theme');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}
let storedTheme;
try { storedTheme = localStorage.getItem('sapinsapin-experiments-theme'); } catch (_) {}
setTheme(['light', 'dark'].includes(storedTheme) ? storedTheme : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeButton.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  try { localStorage.setItem('sapinsapin-experiments-theme', root.dataset.theme); } catch (_) {}
});
const plot = document.getElementById('learning-chart');
if (plot) {
  try {
    const data = JSON.parse(document.getElementById('results').textContent);
    const runSelect = document.getElementById('chart-run');
    const metricSelect = document.getElementById('chart-metric');
    const status = document.getElementById('chart-status');
    const NS = 'http://www.w3.org/2000/svg';
    function node(tag, attrs, text) {
      const element = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, String(value)));
      if (text !== undefined) element.textContent = text;
      return element;
    }
    function draw() {
      const run = data.fsc.arms.find(item => item.id === runSelect.value);
      const metric = metricSelect.value;
      if (!run || !run.curve.length) throw new Error('No checkpoint curve is available.');
      const width = Math.max(280, Math.min(1040, plot.clientWidth));
      const height = 340, left = 43, right = width - 14, top = 30, bottom = height - 46;
      const reference = metric === 'eval_normalized_wer' ? data.fsc.baseline.normalized_wer : metric === 'eval_normalized_cer' ? data.fsc.baseline.normalized_cer : null;
      const values = run.curve.map(item => item[metric]);
      const max = Math.max(...values, reference || 0) * 1.08;
      const x = step => left + step / run.steps * (right - left);
      const y = value => bottom - value / max * (bottom - top);
      const svg = node('svg', {viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-labelledby': 'curve-title curve-description'});
      svg.append(node('title', {id: 'curve-title'}, `${runSelect.selectedOptions[0].textContent}: ${metricSelect.selectedOptions[0].textContent}`));
      svg.append(node('desc', {id: 'curve-description'}, 'Checkpoint values are plotted without smoothing. Focus a point for its value. Full final-run values are also in the table.'));
      for (let i = 0; i <= 4; i++) {
        const value = i / 4 * max;
        svg.append(node('line', {x1: left, x2: right, y1: y(value), y2: y(value), class: 'grid'}));
        svg.append(node('text', {x: left - 9, y: y(value) + 4, 'text-anchor': 'end'}, value.toFixed(metric === 'eval_loss' ? 1 : 0)));
      }
      for (let i = 0; i <= 4; i++) {
        const step = Math.round(i / 4 * run.steps);
        svg.append(node('text', {x: x(step), y: bottom + 22, 'text-anchor': i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}, step.toLocaleString('en')));
      }
      svg.append(node('text', {x: (left + right) / 2, y: height - 3, 'text-anchor': 'middle', class: 'axis-label'}, 'Training step'));
      if (reference !== null) {
        svg.append(node('line', {x1: left, x2: right, y1: y(reference), y2: y(reference), class: 'baseline'}));
        svg.append(node('text', {x: left + 5, y: y(reference) - 7}, `Base ${reference.toFixed(2)}%`));
      }
      if (metric === 'eval_normalized_wer') {
        svg.append(node('line', {x1: left, x2: right, y1: y(25), y2: y(25), class: 'gate'}));
        svg.append(node('text', {x: left + 5, y: y(25) - 7}, 'Target <25%'));
      }
      svg.append(node('polyline', {points: run.curve.map(item => `${x(item.step)},${y(item[metric])}`).join(' '), class: 'curve'}));
      for (const item of run.curve) {
        const label = `Step ${item.step}: ${item[metric].toFixed(4)}${metric === 'eval_loss' ? '' : '%'}`;
        const point = node('circle', {cx: x(item.step), cy: y(item[metric]), r: 4.5, class: 'dot', tabindex: 0, role: 'img', 'aria-label': label});
        point.append(node('title', {}, label));
        point.addEventListener('focus', () => { status.textContent = label; });
        point.addEventListener('pointerenter', () => { status.textContent = label; });
        svg.append(point);
      }
      plot.replaceChildren(svg);
      status.textContent = `${run.curve.length} checkpoint evaluations. These are trainer evaluation values; final fresh-process scores are in the result table.`;
    }
    runSelect.addEventListener('change', draw);
    metricSelect.addEventListener('change', draw);
    window.addEventListener('resize', draw);
    draw();
  } catch (_) {
    plot.textContent = 'The interactive curve could not load. Use the checkpoint table or download the result JSON.';
    plot.classList.add('error-note');
  }
}
let printState;
window.addEventListener('beforeprint', () => {
  printState = {theme: root.dataset.theme, details: [...document.querySelectorAll('details')].map(el => [el, el.open])};
  setTheme('light');
  printState.details.forEach(([el]) => { el.open = true; });
});
window.addEventListener('afterprint', () => {
  if (!printState) return;
  setTheme(printState.theme);
  printState.details.forEach(([el, open]) => { el.open = open; });
  printState = undefined;
});
