// Interactive rebuild of the GovGig "Submittal Register — Summary" screen (Figma: Summary Design 4).
// Mounts into <div data-submittal-demo>. Sample data only.
(() => {
  const root = document.querySelector('[data-submittal-demo]');
  if (!root) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- tiny icon set (24px grid, stroke) ----------
  const ICONS = {
    back: 'M19 12H5m6-6-6 6 6 6',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    chevL: 'M15 6l-6 6 6 6',
    chevR: 'M9 6l6 6-6 6',
    chevD: 'M6 9l6 6 6-6',
    chevU: 'M6 15l6-6 6 6',
    collapse: 'M17 6l-6 6 6 6M7 5v14',
    swap: 'M7 8h12l-3-3M17 16H5l3 3',
    exit: 'M19 12H7m4-5-5 5 5 5',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-2.2-1.3L14.5 3h-5l-.3 2.4a7.6 7.6 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5a7.4 7.4 0 0 0 0 2.6l-2 1.5 2 3.4 2.3-.9a7.6 7.6 0 0 0 2.2 1.3l.3 2.4h5l.3-2.4a7.6 7.6 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z',
    grid: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
    list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
    board: 'M4 4h16v16H4zM9.5 4v16M14.5 4v16',
    cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
    plus: 'M12 5v14M5 12h14',
    sign: 'M5 20h14M7 16l9-9 2 2-9 9H7z',
    chat: 'M4 5h16v11H8l-4 4z',
    bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0',
    spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
    dash: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    info: 'M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4',
    stories: 'M7 4v16M17 4v16M7 8h10M7 16h10',
    users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.6',
    docs: 'M4 6h16M4 12h10M4 18h7M17 14l3 3-3 3',
    table: 'M4 5h16v14H4zM4 10h16M10 10v9',
    sched: 'M4 5h16v14H4zM4 9h16',
    edit: 'M5 19h14M7 15l8-8 2 2-8 8H7z',
    book: 'M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z',
    lib: 'M5 4h14v16H5zM9 8h6M9 12h6',
    check: 'M5 12l5 5 9-10',
  };
  const icon = (name, size = 16, w = 1.8) =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;

  // ---------- sample data ----------
  const KPIS = [
    { n: 47, label: 'Total submittals', note: '+ 12 this month', tone: 'green' },
    { n: 14, label: 'With Gov', note: '6 due back this week', tone: 'navy' },
    { n: 3, label: 'Overdue', note: '6 projected by May 15', tone: 'red' },
    { n: 11, label: 'Closing this week', note: '4 ahead of schedule', tone: 'green' },
  ];
  const PIPELINE = [
    ['Submittals', 3, 2, 2], ['Assign & schedule', 2, 0, 2], ['AI output', 4, 4, 0],
    ['Specialist review', 0, 2, 0], ['Awaiting decision', 2, 0, 0], ['Correction needed', 2, 0, 1], ['Closed', 4, 0, 0],
  ];
  const UPCOMING = [
    ['SR-008', 'Generator - 500kW', '7d late'], ['SR-003', 'Fire supression form', '5d late'],
    ['SR-011', 'Roof membrane repair', '2d late'], ['SR-014', 'HVAC ductwork shop drawings', '1d late'],
    ['SR-019', 'Elevator controls', 'Due today'],
  ];
  const WINDOWS = [
    [2, 'Sent May 1, 2026', 'Door Hardware', 'SR-012', 'NAVFAC NW'],
    [3, 'Sent May 3, 2026', 'Structural Steel', 'SR-008', 'NAVFAC HQ'],
    [4, 'Sent May 4, 2026', 'Door Hardware', 'SR-013', 'NAVFAC NW'],
    [5, 'Sent May 4, 2026', 'Fire Suppression', 'SR-003', 'NAVFAC NW'],
    [8, 'Sent May 7, 2026', 'Roof Membrane', 'SR-011', 'NAVFAC NW'],
    [11, 'Sent May 10, 2026', 'Generator - 500kW', 'SR-016', 'NAVFAC HQ'],
  ];
  const SUBS = [
    ['Apex Fire', 80, 8, 4], ['BuildRight', 70, 15, 5], ['ConcreteCo', 67, 13, 6],
    ['Ironworks', 54, 20, 34], ['PowerGen', 45, 25, 57], ['Skyline Electric', 50, 35, 82],
  ];
  const MONTHS = [
    { label: 'April 2026', weeks: ['Apr 5 - 11', 'Apr 12 - 18', 'Apr 19 - 25', 'Apr 26 - May 2', 'May 3+'], items: [3, 2, 4, 1, 3] },
    { label: 'May 2026', weeks: ['May 3 - 9', 'May 10 - 16', 'May 17 - 23', 'May 24 - 30', 'May 31+'], items: [2, 5, 4, 6, 2] },
    { label: 'June 2026', weeks: ['May 31 - Jun 6', 'Jun 7 - 13', 'Jun 14 - 20', 'Jun 21 - 27', 'Jun 28+'], items: [1, 3, 7, 2, 1] },
  ];
  const LIST = [
    ['SR-003', 'Fire supression form', 'Ironworks', 'Specialist review', 'a', 'May 14'],
    ['SR-008', 'Structural Steel', 'Ironworks', 'Blocked', 'r', 'May 2'],
    ['SR-011', 'Roof membrane repair', 'BuildRight', 'Correction needed', 'r', 'May 18'],
    ['SR-012', 'Door Hardware', 'Apex Fire', 'With Gov', 'g', 'May 15'],
    ['SR-013', 'Door Hardware (east wing)', 'Apex Fire', 'With Gov', 'g', 'May 18'],
    ['SR-014', 'HVAC ductwork shop drawings', 'Skyline Electric', 'AI output', 'a', 'May 20'],
    ['SR-016', 'Generator - 500kW', 'PowerGen', 'With Gov', 'g', 'May 24'],
    ['SR-019', 'Elevator controls', 'Skyline Electric', 'Assign & schedule', 'a', 'May 27'],
    ['SR-021', 'Concrete mix design', 'ConcreteCo', 'Closed', 'g', 'Apr 30'],
  ];

  const tone = n => (n === 0 ? 'n' : null);
  const fmtHours = h => (h < 24 ? `${h}h` : `${Math.floor(h / 24)}d ${h % 24}h`);
  const rateTone = (v, good, bad, higherIsBetter) =>
    higherIsBetter ? (v >= good ? 't-green' : v >= bad ? 't-amber' : 't-red')
                   : (v <= good ? 't-green' : v <= bad ? 't-amber' : 't-red');

  const NAV = [
    [null, [['dash', 'Dashboard'], ['info', 'Project Info'], ['stories', 'Stories'], ['users', 'Contact list']]],
    ['Configuration', [['docs', 'Source Docs'], ['table', 'Submittal Register', true], ['sched', 'Schedule']]],
    ['Documentation', [['edit', 'Create Document'], ['book', 'Library'], ['lib', 'Templates']]],
  ];

  root.innerHTML = `
  <div class="sd" role="region" aria-label="Interactive GovGig Submittal Register demo">
    <aside class="sd-side">
      <div class="sd-brand">
        <img src="assets/govgig/demo/logo.png" alt="GovGig">
        <button type="button" class="sd-icon-btn sd-collapse" aria-label="Collapse sidebar" aria-expanded="true">${icon('collapse', 18)}</button>
      </div>
      <div class="sd-project">
        <div class="sd-project-card">
          <div style="min-width:0"><strong>Kitsap Naval Base Repair</strong><span class="sd-status">Post-Award</span></div>
          <span class="t-navy" style="color:#4a7bd0">${icon('swap', 16)}</span>
        </div>
        <div class="sd-project-actions">
          <button type="button" class="sd-btn" data-toast="Leaving project… (demo)">${icon('exit', 14)}Exit project</button>
          <button type="button" class="sd-btn" data-toast="Project settings (demo)">${icon('gear', 14, 1.5)}Settings</button>
        </div>
      </div>
      <nav class="sd-nav" aria-label="Project">
        ${NAV.map(([head, items]) => `
          ${head ? `<h4><span class="sd-label">${head}</span>${icon('chevU', 14)}</h4>` : ''}
          ${items.map(([ic, label, active]) => `<a href="#" class="${active ? 'is-active' : ''}" title="${label}">${icon(ic, 16, 1.6)}<span class="sd-label">${label}</span></a>`).join('')}`).join('')}
      </nav>
      <div class="sd-user"><span class="sd-avatar">M</span><div>Marcus Webb<small>Advanced Technology Construction</small></div></div>
    </aside>

    <div class="sd-main">
      <header class="sd-top">
        <button type="button" class="sd-back" data-toast="Back to projects (demo)">${icon('back', 16)}Back</button>
        <span class="sd-title">Kitsap Naval Base Repair</span>
        <div class="sd-top-actions">
          <div class="sd-menu-wrap sd-hide-sm">
            <button type="button" class="sd-btn sd-sign" aria-haspopup="true" aria-expanded="false">${icon('sign', 15)}Signatures <span class="sd-count">3</span>${icon('chevD', 14)}</button>
            <div class="sd-menu" role="menu">
              <p>Waiting on you</p>
              <button type="button" role="menuitem" data-sign>SR-003 Fire suppression <small>Due today</small></button>
              <button type="button" role="menuitem" data-sign>SR-012 Door hardware <small>May 15</small></button>
              <button type="button" role="menuitem" data-sign>SR-016 Generator <small>May 24</small></button>
            </div>
          </div>
          <button type="button" class="sd-btn sd-ask" data-toast="Ask GovGig: “What’s blocking SR-008?”">${icon('spark', 15)}Ask GovGig</button>
          <button type="button" class="sd-icon-btn sd-hide-sm" aria-label="Messages" data-toast="No new messages">${icon('chat', 18)}</button>
          <button type="button" class="sd-icon-btn sd-dot" aria-label="Notifications" data-toast="2 submittals returned by NAVFAC">${icon('bell', 18)}</button>
        </div>
      </header>

      <div class="sd-scroll" tabindex="0" aria-label="Submittal summary (scrollable)">
        <div class="sd-toolbar">
          <div class="sd-tabs" role="tablist" aria-label="View">
            <span class="sd-tab-pill" aria-hidden="true"></span>
            <button type="button" role="tab" aria-selected="true" data-view="summary">${icon('grid', 15)}<span class="sd-label">Summary</span></button>
            <button type="button" role="tab" aria-selected="false" data-view="list">${icon('list', 15)}<span class="sd-label">List</span></button>
            <button type="button" role="tab" aria-selected="false" data-view="board">${icon('board', 15)}<span class="sd-label">Board</span></button>
            <button type="button" role="tab" aria-selected="false" data-view="calendar">${icon('cal', 15)}<span class="sd-label">Calendar</span></button>
          </div>
          <button type="button" class="sd-btn sd-btn--primary" data-toast="New submittal item (demo)">${icon('plus', 15)}<span class="sd-label">Add item</span></button>
        </div>

        <section class="sd-view" data-view-panel="summary">
          <div class="sd-welcome">
            <span class="sd-spark">${icon('spark', 13)}</span>
            <div>
              <strong>Welcome back to your submittal</strong>
              <p>Approve critical submittals by July 12th and upload updated project documents to keep the NAVFAC project on track!</p>
              <div class="sd-actions">
                <button type="button" class="sd-btn" data-toast="Opening SR-003…">Review Submittal Item SR-003 <span class="arrow">${icon('arrow', 15)}</span></button>
                <button type="button" class="sd-btn" data-toast="Schedule updated">Update Schedule <span class="arrow">${icon('arrow', 15)}</span></button>
              </div>
            </div>
          </div>

          <div class="sd-card" style="margin-top:14px">
            <h3>This Month’s Key Performance Indicators</h3>
            <div class="sd-kpis">
              ${KPIS.map(k => `<div class="sd-kpi"><b data-count="${k.n}">${k.n}</b><span>${k.label}</span><em class="t-${k.tone}">${k.note}</em></div>`).join('')}
            </div>
          </div>

          <div class="sd-grid sd-grid--a">
            <div class="sd-card">
              <h3>Status Pipeline Age</h3>
              <p class="sd-sub">Duration submittal items remain at each stage</p>
              <hr>
              <div class="sd-scroll-x">
                <table class="sd-table">
                  <thead><tr><th>Status</th><th>0 - 3d</th><th>4 - 7d</th><th>7d+</th><th>Total</th></tr></thead>
                  <tbody>
                    ${PIPELINE.map(([s, a, b, c]) => `<tr><td>${s}</td>
                      <td><span class="cell ${tone(a) || 'g'}">${a || '-'}</span></td>
                      <td><span class="cell ${tone(b) || 'a'}">${b || '-'}</span></td>
                      <td><span class="cell ${tone(c) || 'r'}">${c || '-'}</span></td>
                      <td>${a + b + c}</td></tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="sd-card">
              <h3>Critical path risks</h3>
              <p class="sd-sub">Top blockers this week</p>
              <hr>
              <div class="sd-list">
                <div class="sd-risk">
                  <div class="sd-risk-head"><strong><span class="sd-id">SR-008</span>Structural Steel</strong><span class="badge r" data-risk-badge>10d late</span></div>
                  <p data-risk-text>Steel erection status blocked. $120,000 Total</p>
                  <div class="sd-actions">
                    <button type="button" class="sd-btn sd-btn--primary" data-toast="Opening SR-008 Structural Steel…">View Item</button>
                    <button type="button" class="sd-btn" data-change-status>Change Status</button>
                  </div>
                </div>
                <div class="sd-upcoming">
                  <h4>Upcoming Items</h4>
                  ${UPCOMING.map(([id, name, late]) => `<div class="sd-row"><span><span class="sd-id">${id}</span>${name}</span><span class="badge ${late.includes('late') ? 'a' : 'g'}">${late}</span></div>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="sd-grid sd-grid--b">
            <div class="sd-card">
              <h3>Government Approval Windows</h3>
              <p class="sd-sub">Days remaining of 14-day timeline</p>
              <hr>
              <div class="sd-list">
                ${WINDOWS.map(([d, sent, name, id, office]) => {
                  const t = d <= 2 ? 'r' : d <= 5 ? 'a' : 'g';
                  return `<div class="sd-window-item">
                    <span class="sd-days ${t}">${d}<small>d</small></span>
                    <div style="min-width:0"><span class="meta t-${t === 'r' ? 'red' : t === 'a' ? 'amber' : 'green'}">${sent}</span><strong>${name}</strong></div>
                    <span class="where">${id} • ${office}</span>
                    <span class="sd-progress t-${t === 'r' ? 'red' : t === 'a' ? 'amber' : 'green'}" title="${d} of 14 days left"><i data-w="${Math.round(((14 - d) / 14) * 100)}"></i></span>
                  </div>`;
                }).join('')}
              </div>
            </div>

            <div class="sd-card">
              <h3>Subcontractor Performance</h3>
              <p class="sd-sub">Based on <b>upload rate</b> • <b>re-works</b> • <b>responsiveness</b></p>
              <hr>
              <div class="sd-scroll-x"><table class="sd-perf">
                <thead><tr><th></th>
                  <th><button type="button" data-sort="1">On-time</button></th>
                  <th><button type="button" data-sort="2">Rework</button></th>
                  <th><button type="button" data-sort="3">Response</button></th></tr></thead>
                <tbody></tbody>
              </table></div>
            </div>
          </div>

          <div class="sd-card" style="margin-top:14px">
            <div class="sd-chart-head"><h3>Approval Deadlines - Monthly</h3><p class="sd-sub">Items = submittals needing internal decision that week</p></div>
            <hr>
            <div class="sd-bars"></div>
            <div class="sd-weeks"></div>
            <div class="sd-month">
              <button type="button" class="sd-btn" data-month="-1" aria-label="Previous month">${icon('back', 15)}</button>
              <span aria-live="polite"></span>
              <button type="button" class="sd-btn" data-month="1" aria-label="Next month">${icon('arrow', 15)}</button>
            </div>
          </div>
        </section>

        <section class="sd-view" data-view-panel="list" hidden>
          <div class="sd-listview">
            <table>
              <thead><tr><th>ID</th><th>Item</th><th>Subcontractor</th><th>Status</th><th>Due</th></tr></thead>
              <tbody>${LIST.map(([id, name, sub, status, t, due]) => `<tr><td class="t-navy">${id}</td><td>${name}</td><td>${sub}</td><td><span class="badge ${t}">${status}</span></td><td>${due}</td></tr>`).join('')}</tbody>
            </table>
          </div>
        </section>
        <section class="sd-view" data-view-panel="board" hidden>
          <div class="sd-empty">${icon('board', 28, 1.4)}<strong>Board view</strong>Drag submittals between stages — not part of this demo.</div>
        </section>
        <section class="sd-view" data-view-panel="calendar" hidden>
          <div class="sd-empty">${icon('cal', 28, 1.4)}<strong>Calendar view</strong>Due dates on a timeline — not part of this demo.</div>
        </section>
      </div>
      <div class="sd-toast" role="status" aria-live="polite">${icon('check', 15, 2.2)}<span></span></div>
    </div>
  </div>`;

  const $ = s => root.querySelector(s);
  const $$ = s => [...root.querySelectorAll(s)];
  const app = $('.sd');
  const scroller = $('.sd-scroll');

  // ---------- toast ----------
  const toastEl = $('.sd-toast');
  let toastTimer;
  const toast = msg => {
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-shown'), 2200);
  };
  $$('[data-toast]').forEach(b => b.addEventListener('click', () => toast(b.dataset.toast)));
  $$('.sd-nav a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    if (!a.classList.contains('is-active')) toast(`${a.title} isn’t part of this demo`);
  }));

  // ---------- sidebar collapse ----------
  const collapseBtn = $('.sd-collapse');
  collapseBtn.addEventListener('click', () => {
    const collapsed = app.classList.toggle('is-collapsed');
    collapseBtn.setAttribute('aria-expanded', String(!collapsed));
    collapseBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    requestAnimationFrame(movePill);
  });

  // ---------- signatures menu ----------
  const signBtn = $('.sd-sign');
  const menu = $('.sd-menu');
  const setMenu = open => { menu.classList.toggle('is-open', open); signBtn.setAttribute('aria-expanded', String(open)); };
  signBtn.addEventListener('click', e => { e.stopPropagation(); setMenu(!menu.classList.contains('is-open')); });
  document.addEventListener('click', e => { if (!menu.contains(e.target)) setMenu(false); });
  root.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  let signed = 0;
  $$('[data-sign]').forEach(b => b.addEventListener('click', () => {
    b.disabled = true;
    b.style.opacity = 0.45;
    signed++;
    const left = 3 - signed;
    $('.sd-count').textContent = left;
    if (!left) $('.sd-count').style.background = '#188038';
    toast(left ? `Signed — ${left} left` : 'All signatures done');
  }));

  // ---------- tabs with sliding pill ----------
  const tabs = $$('.sd-tabs [role="tab"]');
  const pill = $('.sd-tab-pill');
  function movePill() {
    const active = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    pill.style.width = `${active.offsetWidth}px`;
    pill.style.transform = `translateX(${active.offsetLeft}px)`;
  }
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(o => o.setAttribute('aria-selected', String(o === t)));
    $$('[data-view-panel]').forEach(p => { p.hidden = p.dataset.viewPanel !== t.dataset.view; });
    movePill();
    scroller.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  new ResizeObserver(movePill).observe($('.sd-tabs'));

  // Sticky toolbar gets a shadow once content scrolls under it
  const toolbar = $('.sd-toolbar');
  scroller.addEventListener('scroll', () => toolbar.classList.toggle('is-stuck', scroller.scrollTop > 4), { passive: true });

  // ---------- critical path: change status ----------
  const risk = $('.sd-risk');
  $('[data-change-status]').addEventListener('click', () => {
    const review = risk.classList.toggle('is-review');
    $('[data-risk-badge]').className = `badge ${review ? 'a' : 'r'}`;
    $('[data-risk-badge]').textContent = review ? 'In review' : '10d late';
    $('[data-risk-text]').textContent = review ? 'Moved to specialist review. Ironworks notified.' : 'Steel erection status blocked. $120,000 Total';
    toast(review ? 'SR-008 moved to In review' : 'SR-008 set back to Blocked');
  });

  // ---------- subcontractor table: sortable ----------
  const perfBody = $('.sd-perf tbody');
  const renderSubs = rows => {
    perfBody.innerHTML = rows.map(([name, on, re, resp], i) => `<tr>
      <td><span>${i + 1}</span>${name}</td>
      <td class="${rateTone(on, 65, 50, true)}">${on}%</td>
      <td class="${rateTone(re, 15, 20, false)}">${re}%</td>
      <td class="${rateTone(resp, 6, 40, false)}">${fmtHours(resp)}</td></tr>`).join('');
  };
  renderSubs(SUBS);
  $$('[data-sort]').forEach(btn => btn.addEventListener('click', () => {
    const col = +btn.dataset.sort;
    const dir = btn.dataset.dir === 'desc' ? 'asc' : 'desc';
    $$('[data-sort]').forEach(b => delete b.dataset.dir);
    btn.dataset.dir = dir;
    const sorted = [...SUBS].sort((a, b) => (dir === 'asc' ? a[col] - b[col] : b[col] - a[col]));
    perfBody.classList.remove('is-sorting');
    void perfBody.offsetWidth;
    perfBody.classList.add('is-sorting');
    renderSubs(sorted);
  }));

  // ---------- monthly bar chart ----------
  const bars = $('.sd-bars');
  const weeks = $('.sd-weeks');
  const monthLabel = $('.sd-month span');
  let month = 1;
  const renderMonth = () => {
    const m = MONTHS[month];
    const max = 7;
    bars.innerHTML = m.items.map((n, i) => {
      const level = n >= 5 ? 'hi' : n >= 4 ? 'mid' : 'lo';
      return `<div class="sd-bar ${level}" style="--h:${Math.max(8, (n / max) * 100)}%">
        <i></i><b>${n} item${n === 1 ? '' : 's'}</b>
        <span class="tip"><strong>${m.weeks[i]}</strong><br>${n} submittal${n === 1 ? '' : 's'} need a decision${n >= 5 ? ' — heavy week' : ''}</span>
      </div>`;
    }).join('');
    weeks.innerHTML = m.weeks.map(w => `<span>${w}</span>`).join('');
    monthLabel.textContent = m.label;
    $('[data-month="-1"]').disabled = month === 0;
    $('[data-month="1"]').disabled = month === MONTHS.length - 1;
  };
  renderMonth();
  $$('[data-month]').forEach(b => b.addEventListener('click', () => {
    month = Math.min(MONTHS.length - 1, Math.max(0, month + +b.dataset.month));
    bars.classList.remove('is-shown');
    setTimeout(() => { renderMonth(); requestAnimationFrame(() => bars.classList.add('is-shown')); }, reduceMotion ? 0 : 180);
  }));

  // ---------- reveal-on-scroll effects inside the demo ----------
  const countUp = el => {
    const end = +el.dataset.count;
    if (reduceMotion) { el.textContent = end; return; }
    const start = performance.now();
    const step = now => {
      const p = Math.min(1, (now - start) / 900);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      if (target.dataset.count) countUp(target);
      else if (target.classList.contains('sd-bars')) target.classList.add('is-shown');
      else if (target.dataset.w) target.style.width = `${target.dataset.w}%`;
      reveal.unobserve(target);
    });
  }, { root: scroller, threshold: 0.4 });
  $$('[data-count]').forEach(el => { el.textContent = '0'; });
  // Start the inner reveals only once the demo itself is on screen
  const onScreen = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    onScreen.disconnect();
    $$('[data-count]').forEach(el => reveal.observe(el));
    $$('.sd-progress i').forEach(el => reveal.observe(el));
    reveal.observe(bars);
  }, { threshold: 0.3 });
  onScreen.observe(app);
})();
