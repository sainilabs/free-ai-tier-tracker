import {
  daysUntil,
  expiryStatus,
  creditPercent,
  creditsRemaining,
  dailyBudget,
  sortByUrgency,
} from '../src/tracker.js';

const grid = document.getElementById('grid');
const stats = document.getElementById('stats');
const search = document.getElementById('search');
const filter = document.getElementById('filter');

const STATUS_LABEL = {
  'active': 'Active',
  'expiring-soon': 'Expiring soon',
  'expired': 'Expired',
  'no-expiry': 'No expiry',
};

let tools = [];

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k' : String(Math.round(n * 100) / 100);
}

function expiryLine(tool, now) {
  if (!tool.expiryDate) return 'No expiry date set';
  const d = daysUntil(tool.expiryDate, now);
  if (d < 0) return `Expired ${-d}d ago`;
  if (d === 0) return 'Expires today';
  return `${d}d left`;
}

function card(tool, now) {
  const status = expiryStatus(tool, now);
  const pct = creditPercent(tool);
  const remaining = creditsRemaining(tool);
  const budget = dailyBudget(tool, now);
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="card-top">
      <h2><a href="${tool.url}" target="_blank" rel="noopener">${tool.name}</a></h2>
      <span class="badge ${status}">${STATUS_LABEL[status]}</span>
    </div>
    <p class="category">${tool.category} · resets ${tool.freeTier.reset}</p>
    <div class="bar"><i style="width:${pct.toFixed(1)}%"></i></div>
    <div class="meta">
      <span><b>${fmt(remaining)}</b> / ${fmt(tool.freeTier.limit)} ${tool.freeTier.unit} left</span>
      <span>${expiryLine(tool, now)}</span>
    </div>
    <div class="meta"><span>Safe daily budget</span><span><b>${fmt(budget)}</b> ${tool.freeTier.unit}</span></div>
    ${tool.notes ? `<p class="notes">${tool.notes}</p>` : ''}
  `;
  return el;
}

function render() {
  const now = new Date().toISOString();
  const q = search.value.trim().toLowerCase();
  const f = filter.value;
  const visible = sortByUrgency(tools, now).filter((t) => {
    if (q && !(t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))) return false;
    if (f !== 'all' && expiryStatus(t, now) !== f) return false;
    return true;
  });

  grid.innerHTML = '';
  if (visible.length === 0) {
    grid.innerHTML = '<p class="empty">No tools match your search.</p>';
  } else {
    for (const tool of visible) grid.appendChild(card(tool, now));
  }

  const counts = { active: 0, 'expiring-soon': 0, expired: 0, 'no-expiry': 0 };
  for (const t of tools) counts[expiryStatus(t, now)]++;
  stats.innerHTML = `
    <div class="stat"><b>${tools.length}</b><span>tools tracked</span></div>
    <div class="stat"><b>${counts.active}</b><span>active</span></div>
    <div class="stat"><b>${counts['expiring-soon']}</b><span>expiring soon</span></div>
    <div class="stat"><b>${counts.expired}</b><span>expired</span></div>
  `;
}

search.addEventListener('input', render);
filter.addEventListener('change', render);

fetch('../data/tools.json')
  .then((r) => r.json())
  .then((data) => { tools = data; render(); })
  .catch(() => { grid.innerHTML = '<p class="empty">Could not load tool data.</p>'; });
