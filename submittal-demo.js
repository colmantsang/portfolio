// Interactive rebuild of the GovGig "Submittal Register — Summary" screen (Figma: Summary Design 4).
// Mounts into <div data-submittal-demo>. Sample data only.
(() => {
  const root = document.querySelector('[data-submittal-demo]');
  if (!root) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- icons: exact vectors from the Figma frame (submittal-demo-icons.js) ----------
  const FIGMA = window.SD_ICONS || {};
  const ALIAS = {
    back: 'back', arrow: 'arrowR', chevD: 'chevDown', chevU: 'chevUp', collapse: 'collapse', swap: 'swap',
    exit: 'exit', gear: 'gear', grid: 'summary', list: 'list', board: 'board', cal: 'calendar', plus: 'plus',
    sign: 'signatures', chat: 'chat', bell: 'bell', spark: 'spark', ask: 'ask', dash: 'dashboard',
    info: 'projectInfo', stories: 'stories', users: 'contacts', docs: 'sourceDocs', table: 'register',
    sched: 'schedule', edit: 'createDoc', book: 'library', lib: 'library2', logo: 'logo',
    search: 'search', filter: 'filter', sort: 'sort', play: 'play', stop: 'stop', retry: 'retry', rowChev: 'rowChev',
  };
  const icon = (name, cls = '') => {
    if (name === 'check') return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>`;
    const f = FIGMA[ALIAS[name]];
    return f ? `<svg class="ico ${cls}" viewBox="${f.vb}" fill="none" aria-hidden="true">${f.svg}</svg>` : '';
  };

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

  const tone = n => (n === 0 ? 'n' : null);
  const fmtHours = h => (h < 24 ? `${h}h` : `${Math.floor(h / 24)}d ${h % 24}h`);
  const rateTone = (v, good, bad, higherIsBetter) =>
    higherIsBetter ? (v >= good ? 't-green' : v >= bad ? 't-amber' : 't-red')
                   : (v <= good ? 't-green' : v <= bad ? 't-amber' : 't-red');

  const NAV = [
    [null, [['dash', 'Dashboard'], ['info', 'Project Info'], ['stories', 'Stories'], ['users', 'Contact list']]],
    ['Configuration', [['docs', 'Source Docs'], ['table', 'Submittal Register', true], ['sched', 'Schedule']]],
    ['Documentation', [['edit', 'Create Document'], ['book', 'Library'], ['lib', 'Reports']]],
  ];

  root.innerHTML = `
  <div class="sd" role="region" aria-label="Interactive GovGig Submittal Register demo">
    <aside class="sd-side">
      <div class="sd-brand">
        <svg class="sd-logo" viewBox="${FIGMA.logo ? FIGMA.logo.vb : '0 0 162 48'}" role="img" aria-label="GovGig">${FIGMA.logo ? FIGMA.logo.svg : ''}</svg>
        <button type="button" class="sd-icon-btn sd-collapse" aria-label="Collapse sidebar" aria-expanded="true">${icon('collapse')}</button>
      </div>
      <div class="sd-project">
        <div class="sd-banner" aria-hidden="true"></div>
        <div class="sd-project-card">
          <div style="min-width:0"><strong>Kitsap Naval Base Repair</strong><span class="sd-status">Post-Award</span></div>
          <span class="sd-swap">${icon('swap')}</span>
        </div>
        <div class="sd-project-actions">
          <button type="button" class="sd-btn" data-toast="Leaving project… (demo)">${icon('exit')}Exit project</button>
          <button type="button" class="sd-btn" data-toast="Project settings (demo)">${icon('gear')}Settings</button>
        </div>
      </div>
      <div class="sd-rule"></div>
      <nav class="sd-nav" aria-label="Project">
        ${NAV.map(([head, items], g) => `
          ${head ? `<h4><span class="sd-label">${head}</span><button type="button" aria-expanded="true" aria-controls="sd-group-${g}" aria-label="Toggle ${head}">${icon('chevU')}</button></h4>` : ''}
          <div class="sd-nav-group" id="sd-group-${g}">
          ${items.map(([ic, label, active]) => `<a href="#" class="${active ? 'is-active' : ''}" title="${label}">${icon(ic)}<span class="sd-label">${label}</span></a>`).join('')}
          </div>`).join('')}
      </nav>
      <div class="sd-user"><span class="sd-avatar">M</span><div><b>Marcus Webb</b><small>Advanced Technology Construction</small></div></div>
    </aside>

    <div class="sd-main">
      <header class="sd-top">
        <button type="button" class="sd-back" data-toast="Back to projects (demo)">${icon('back')}Back</button>
        <span class="sd-title">Kitsap Naval Base Repair</span>
        <div class="sd-top-actions">
          <div class="sd-menu-wrap sd-hide-sm">
            <button type="button" class="sd-btn sd-sign" aria-haspopup="true" aria-expanded="false">${icon('sign')}Signatures <span class="sd-count">3</span>${icon('chevD', 'chev')}</button>
            <div class="sd-menu" role="menu">
              <p>Waiting on you</p>
              <button type="button" role="menuitem" data-sign>SR-003 Fire suppression <small>Due today</small></button>
              <button type="button" role="menuitem" data-sign>SR-012 Door hardware <small>May 15</small></button>
              <button type="button" role="menuitem" data-sign>SR-016 Generator <small>May 24</small></button>
            </div>
          </div>
          <button type="button" class="sd-btn sd-ask" data-toast="Ask GovGig: “What’s blocking SR-008?”">${icon('ask')}Ask GovGig</button>
          <button type="button" class="sd-icon-btn sd-hide-sm" aria-label="Messages" data-toast="No new messages">${icon('chat')}</button>
          <button type="button" class="sd-icon-btn" aria-label="Notifications" data-toast="2 submittals returned by NAVFAC">${icon('bell')}</button>
        </div>
      </header>

      <div class="sd-scroll" tabindex="0" aria-label="Submittal summary (scrollable)">
        <div class="sd-toolbar">
          <div class="sd-tabs" role="tablist" aria-label="View">
            <span class="sd-tab-pill" aria-hidden="true"></span>
            <button type="button" role="tab" aria-selected="true" data-view="summary">${icon('grid')}<span class="sd-label">Summary</span></button>
            <button type="button" role="tab" aria-selected="false" data-view="list">${icon('list')}<span class="sd-label">List</span></button>
            <button type="button" role="tab" aria-selected="false" data-view="board">${icon('board')}<span class="sd-label">Board</span></button>
            <button type="button" role="tab" aria-selected="false" data-view="calendar">${icon('cal')}<span class="sd-label">Calendar</span></button>
          </div>
          <button type="button" class="sd-btn sd-btn--primary sd-add" data-toast="New submittal item (demo)">${icon('plus')}<span class="sd-label">Add item</span></button>
        </div>

        <section class="sd-view" data-view-panel="summary">
          <div class="sd-welcome">
            <span class="sd-spark">${icon('spark')}</span>
            <div>
              <strong>Welcome back to your submittal</strong>
              <p>Approve critical submittals by July 12th and upload updated project documents to keep the NAVFAC project on track!</p>
              <div class="sd-actions">
                <button type="button" class="sd-btn" data-toast="Opening SR-003…">Review Submittal Item SR-003 <span class="arrow">${icon('arrow')}</span></button>
                <button type="button" class="sd-btn" data-toast="Schedule updated">Update Schedule <span class="arrow">${icon('arrow')}</span></button>
              </div>
            </div>
          </div>

          <div class="sd-card sd-kpi-card">
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

          <div class="sd-card sd-chart-card">
            <div class="sd-chart-head"><h3>Approval Deadlines - Monthly</h3><p class="sd-sub">Items = submittals needing internal decision that week</p></div>
            <hr>
            <div class="sd-bars"></div>
            <div class="sd-weeks"></div>
            <div class="sd-month">
              <button type="button" class="sd-btn" data-month="-1" aria-label="Previous month">${icon('back')}</button>
              <span aria-live="polite"></span>
              <button type="button" class="sd-btn" data-month="1" aria-label="Next month">${icon('arrow')}</button>
            </div>
          </div>
        </section>

        <section class="sd-view" data-view-panel="list" hidden>
          <div class="sl" data-list></div>
        </section>
        <section class="sd-view" data-view-panel="board" hidden>
          <div class="sd-empty">${icon('board')}<strong>Board view</strong>not part of this demo.</div>
        </section>
        <section class="sd-view" data-view-panel="calendar" hidden>
          <div class="sd-empty">${icon('cal')}<strong>Calendar view</strong>not part of this demo.</div>
        </section>
      </div>
      <div class="sd-toast" role="status" aria-live="polite">${icon('check')}<span></span></div>
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

  // ---------- collapsible nav sections ----------
  $$('.sd-nav h4 button').forEach(btn => {
    const group = root.querySelector('#' + btn.getAttribute('aria-controls'));
    group.style.maxHeight = `${group.scrollHeight}px`;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.parentElement.classList.toggle('is-closed', !open);
      group.style.maxHeight = open ? `${group.scrollHeight}px` : '0px';
    });
  });

  // ---------- fit the 1440px design into the box; stack it on narrow screens ----------
  const fit = () => {
    const w = root.clientWidth;
    const compact = w < 760;
    app.classList.toggle('is-compact', compact);
    app.style.zoom = compact ? '' : String(Math.min(1, w / 1440));
    movePill();
  };
  new ResizeObserver(fit).observe(root);

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
    if (!pill) return;
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


  // ---------- List view (Figma: "Submittal Register - Filled") ----------
  const SUBMITTALS = [
    { id: 1020, gov: 'A', tr: '001', sd: 'SD-03', spec: '03 30 00', para: '3.6.1', ai: 'idle', docs: 2, item: 'Composite Samples (11.5.1.12) - Soil and aggregate testing for foundation stability', ga: 'G', submit: '10/01/2026', approve: '10/01/2026', who: ['JD', 'John Doe'], status: 'Published', due: '06/07/2026' },
    { id: 1021, gov: 'F', tr: '034', sd: 'SD-15', spec: '01 10 30', para: '2.5.0', ai: 'running', docs: 4, done: 3, item: 'Composite Samples (11.5.1.32) - Concrete mix verification for structural integrity', ga: '-', submit: '10/01/2026', approve: '10/01/2026', who: null, status: 'Draft', due: '04/16/2027' },
    { id: 1022, gov: 'A', tr: '035', sd: 'SD-08', spec: '80 03 13', para: '2.7.0', ai: 'passed', docs: 2, item: 'Composite Samples (11.5.1.11) - Asphalt blend analysis for pavement durability', ga: 'G', submit: '11/15/2026', approve: '11/15/2026', who: null, status: 'Draft', due: '11/18/2026' },
    { id: 1023, gov: 'B', tr: '036', sd: 'SD-09', spec: '81 04 14', para: '2.8.1', ai: 'failed', docs: 1, item: 'Paint and coating consistency check for corrosion resistance', ga: 'G', submit: '12/01/2026', approve: '12/01/2026', who: ['MS', 'Mary Smith'], status: 'Assigned', due: '12/05/2026' },
    { id: 1024, gov: 'C', tr: '037', sd: 'SD-10', spec: '82 05 15', para: '3.0.0', ai: 'idle', docs: 3, item: 'Insulation material quality assessment for thermal efficiency', ga: 'A/E', submit: '01/10/2027', approve: '01/10/2027', who: ['RL', 'Robert Lee'], status: 'Ready to publish', due: '01/15/2027' },
    { id: 1025, gov: 'D', tr: '038', sd: 'SD-11', spec: '83 06 16', para: '3.1.2', ai: 'idle', docs: 2, item: 'Steel reinforcement tensile strength evaluation', ga: '-', submit: '02/20/2027', approve: '02/20/2027', who: null, status: 'Draft', due: '02/25/2027' },
    { id: 1026, gov: 'E', tr: '039', sd: 'SD-12', spec: '84 07 17', para: '3.2.5', ai: 'idle', docs: 3, item: 'Waterproofing membrane adhesion testing', ga: '-', submit: '03/30/2027', approve: '03/30/2027', who: ['BW', 'Brian White'], status: 'Assigned', due: '04/04/2027' },
    { id: 1027, gov: 'F', tr: '040', sd: 'SD-13', spec: '85 08 18', para: '3.3.7', ai: 'idle', docs: 2, item: 'Electrical conduit material compliance verification', ga: '-', submit: '05/15/2027', approve: '05/15/2027', who: ['CL', 'Catherine Lee'], status: 'In review', due: '05/20/2027' },
    { id: 1028, gov: 'G', tr: '041', sd: 'SD-14', spec: '86 09 19', para: '3.4.9', ai: 'idle', docs: 4, item: 'HVAC ductwork insulation performance review', ga: '-', submit: '06/25/2027', approve: '06/25/2027', who: ['DS', 'David Smith'], status: 'Published', due: '06/30/2027' },
  ];
  const COLS = [
    ['id', 'Activity #'], ['gov', 'Gov-Action-Code'], ['tr', 'Transmittal #'], ['sd', 'SD #'], ['spec', 'Spec Section'],
    ['para', 'Paragraph #'], ['ai', 'AI Review Status'], ['desc', 'Description', false], ['item', 'Item'], ['ga', 'G or A/E'],
    ['submit', 'Submit Date'], ['approve', 'Approve Date'], ['who', 'Assigned'], ['status', 'Internal Status'],
  ];
  const STATUS_TONE = { Published: 'g', Draft: 'n', Assigned: 'b', 'Ready to publish': 'a', 'In review': 'a' };
  const AI_RANK = { running: 0, failed: 1, idle: 2, passed: 3 };
  const toDate = v => { const [m, d, y] = v.split('/'); return `${y}${m}${d}`; };
  const sortValue = (r, key) => key === 'ai' ? AI_RANK[r.ai] : key === 'who' ? (r.who ? r.who[1] : '~') :
    key === 'submit' || key === 'approve' ? toDate(r[key]) : String(r[key]);

  const listRoot = $('[data-list]');
  const listState = { q: '', sort: null, dir: 1, open: new Set(), selected: new Set(), statuses: new Set() };
  const timers = new Map();

  listRoot.innerHTML = `
    <div class="sl-stats">
      <div class="sl-stat"><span>With Gov</span><b>14</b></div>
      <div class="sl-stat"><span>Overdue</span><b>3 <em class="sl-urgent">Urgent</em></b></div>
      <div class="sl-stat"><span>Critical Item</span><b>22</b></div>
    </div>
    <div class="sl-tools">
      <label class="sl-search">
        <input type="search" placeholder="Search..." aria-label="Search submittals">
        ${icon('search')}
      </label>
      <div class="sd-menu-wrap">
        <button type="button" class="sd-btn sl-filter" aria-haspopup="true" aria-expanded="false">${icon('filter')}Filter<span class="sd-count" hidden>0</span></button>
        <div class="sd-menu sl-filter-menu" role="menu">
          <p>Internal status</p>
          ${['Draft', 'Assigned', 'In review', 'Ready to publish', 'Published'].map(st => `<label class="sl-check"><input type="checkbox" value="${st}"><span class="chip ${STATUS_TONE[st]}">${st}</span></label>`).join('')}
        </div>
      </div>
    </div>
    <div class="sl-selbar" hidden><span></span><button type="button" class="sd-btn" data-bulk="Publish">Publish</button><button type="button" class="sd-btn" data-bulk="Run AI review">Run AI review</button><button type="button" class="sl-clear">Clear</button></div>
    <div class="sl-table-wrap">
      <div class="sl-scroll" tabindex="0" aria-label="Submittal list (scroll sideways for more columns)">
        <table class="sl-table">
          <thead><tr>${COLS.map(([key, label, sortable], i) => `<th class="c-${key}">${i === 0 ? '<span class="sl-cb"><input type="checkbox" aria-label="Select all"></span>' : ''}${sortable === false ? `<span class="sl-th">${label}</span>` : `<button type="button" class="sl-th" data-sort="${key}">${label}${icon('sort', 'sl-sort')}</button>`}</th>`).join('')}</tr></thead>
          <tbody></tbody>
        </table>
      </div>
    </div>`;

  const tbody = listRoot.querySelector('tbody');
  const aiCell = r => {
    if (r.ai === 'running') return `<div class="sl-ai is-running"><button type="button" class="sl-ai-btn stop" data-ai="stop" aria-label="Stop AI review">${icon('stop')}</button><div><span class="chip run">Running...</span><small>Parsing ${r.done}/${r.docs} documents..</small></div><i class="sl-progress" style="--p:${(r.done / r.docs) * 100}%"></i></div>`;
    if (r.ai === 'passed') return `<div class="sl-ai"><button type="button" class="sl-ai-btn" data-ai="run" aria-label="Re-run AI review">${icon('retry')}</button><div><span class="chip g">Finished - Success</span><small>${r.docs} doc passed</small></div></div>`;
    if (r.ai === 'failed') return `<div class="sl-ai"><button type="button" class="sl-ai-btn" data-ai="run" aria-label="Re-run AI review">${icon('retry')}</button><div><span class="chip r">Finished - Failed</span><small>1 doc failed</small></div></div>`;
    return `<div class="sl-ai"><button type="button" class="sl-ai-btn" data-ai="run" aria-label="Run AI review">${icon('play')}</button><div><span class="chip n">Not started</span><small>Not run yet</small></div></div>`;
  };
  const rowHtml = r => {
    const open = listState.open.has(r.id), sel = listState.selected.has(r.id);
    return `<tr class="${sel ? 'is-selected' : ''}" data-id="${r.id}">
      <td class="c-id"><span class="sl-cb"><input type="checkbox" ${sel ? 'checked' : ''} aria-label="Select ${r.id}"></span><button type="button" class="sl-expand" aria-expanded="${open}" aria-label="Show details for ${r.id}">${icon('rowChev')}</button>${r.id}</td>
      <td>${r.gov}</td><td>${r.tr}</td><td>${r.sd}</td><td>${r.spec}</td><td>${r.para}</td>
      <td class="c-ai">${aiCell(r)}</td>
      <td class="c-desc"><span>Decking Material Options</span><button type="button" class="sl-open" data-open>Open</button></td>
      <td class="c-item"><span>${r.item}</span></td>
      <td>${r.ga === '-' ? '<span class="sl-dash">-</span>' : `<span class="chip ga">${r.ga}</span>`}</td>
      <td>${r.submit}</td><td>${r.approve}</td>
      <td class="c-who">${r.who ? `<span class="sl-avatar">${r.who[0]}</span>${r.who[1]}` : '<span class="sl-avatar empty">-</span><span class="sl-muted">Unassigned</span>'}</td>
      <td class="c-status"><span class="chip ${STATUS_TONE[r.status]}">${r.status}</span><small>Due ${r.due}</small></td>
    </tr>${open ? `<tr class="sl-detail" data-detail="${r.id}"><td colspan="${COLS.length}"><div class="sl-detail-in">
      <div><p class="sl-label">Item</p><p>${r.item}</p></div>
      <div><p class="sl-label">Spec reference</p><p>Section ${r.spec}, paragraph ${r.para}</p></div>
      <div><p class="sl-label">Documents</p><p>${r.docs} attached</p></div>
      <div class="sl-detail-actions"><button type="button" class="sd-btn" data-open>View documents</button><button type="button" class="sd-btn sd-btn--primary" data-ai="run">Run AI review</button></div>
    </div></td></tr>` : ''}`;
  };
  const renderList = () => {
    const q = listState.q.trim().toLowerCase();
    let rows = SUBMITTALS.filter(r => (!q || [r.id, r.gov, r.tr, r.sd, r.spec, r.para, r.item, r.status, r.who ? r.who[1] : 'unassigned'].join(' ').toLowerCase().includes(q))
      && (!listState.statuses.size || listState.statuses.has(r.status)));
    if (listState.sort) rows = [...rows].sort((a, b) => sortValue(a, listState.sort) < sortValue(b, listState.sort) ? -listState.dir : sortValue(a, listState.sort) > sortValue(b, listState.sort) ? listState.dir : 0);
    tbody.innerHTML = rows.length ? rows.map(rowHtml).join('') : `<tr class="sl-none"><td colspan="${COLS.length}">No submittals match “${listState.q || 'these filters'}”</td></tr>`;
    // header: sort arrows + select-all state
    listRoot.querySelectorAll('[data-sort]').forEach(b => {
      const on = b.dataset.sort === listState.sort;
      b.dataset.dir = on ? (listState.dir === 1 ? 'asc' : 'desc') : '';
      b.closest('th').setAttribute('aria-sort', on ? (listState.dir === 1 ? 'ascending' : 'descending') : 'none');
    });
    const all = listRoot.querySelector('thead input');
    const visible = rows.map(r => r.id);
    const n = visible.filter(id => listState.selected.has(id)).length;
    all.checked = n > 0 && n === visible.length;
    all.indeterminate = n > 0 && n < visible.length;
    const bar = listRoot.querySelector('.sl-selbar');
    bar.hidden = listState.selected.size === 0;
    bar.querySelector('span').textContent = `${listState.selected.size} selected`;
  };

  // Redraw just one row's AI cell so ticking progress never swallows a click elsewhere
  const updateAi = r => {
    const cell = tbody.querySelector(`tr[data-id="${r.id}"] td.c-ai`);
    if (cell) cell.innerHTML = aiCell(r);
  };
  const runAi = r => {
    clearInterval(timers.get(r.id));
    Object.assign(r, { ai: 'running', done: 0 });
    renderList();
    const t = setInterval(() => {
      r.done += 1;
      if (r.done >= r.docs) {
        clearInterval(t);
        r.ai = r.id % 4 === 3 ? 'failed' : 'passed';
        toast(`AI review finished for ${r.id}`);
      }
      updateAi(r);
    }, reduceMotion ? 300 : 900);
    timers.set(r.id, t);
  };

  listRoot.addEventListener('input', e => {
    if (e.target.matches('.sl-search input')) { listState.q = e.target.value; renderList(); }
  });
  listRoot.addEventListener('change', e => {
    const t = e.target;
    if (t.closest('.sl-filter-menu')) {
      t.checked ? listState.statuses.add(t.value) : listState.statuses.delete(t.value);
      const c = listRoot.querySelector('.sl-filter .sd-count');
      c.hidden = !listState.statuses.size; c.textContent = listState.statuses.size;
    } else if (t.closest('thead')) {
      const ids = [...tbody.querySelectorAll('tr[data-id]')].map(tr => +tr.dataset.id);
      ids.forEach(id => t.checked ? listState.selected.add(id) : listState.selected.delete(id));
    } else if (t.closest('.sl-cb')) {
      const id = +t.closest('tr').dataset.id;
      t.checked ? listState.selected.add(id) : listState.selected.delete(id);
    }
    renderList();
  });
  listRoot.addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) return;
    const tr = t.closest('tr[data-id], tr[data-detail]');
    const r = tr && SUBMITTALS.find(x => x.id === +(tr.dataset.id || tr.dataset.detail));
    if (t.dataset.sort) {
      listState.dir = listState.sort === t.dataset.sort ? -listState.dir : 1;
      listState.sort = t.dataset.sort;
      renderList();
    } else if (t.classList.contains('sl-expand')) {
      listState.open.has(r.id) ? listState.open.delete(r.id) : listState.open.add(r.id);
      renderList();
    } else if (t.dataset.ai === 'run') {
      runAi(r);
    } else if (t.dataset.ai === 'stop') {
      clearInterval(timers.get(r.id));
      r.ai = 'idle';
      renderList();
      toast(`AI review stopped for ${r.id}`);
    } else if (t.hasAttribute('data-open')) {
      toast(`Opening ${r.id} documents… (demo)`);
    } else if (t.classList.contains('sl-filter')) {
      e.stopPropagation();
      const m = listRoot.querySelector('.sl-filter-menu');
      const open = !m.classList.contains('is-open');
      m.classList.toggle('is-open', open);
      t.setAttribute('aria-expanded', String(open));
    } else if (t.classList.contains('sl-clear')) {
      listState.selected.clear();
      renderList();
    } else if (t.dataset.bulk) {
      const ids = [...listState.selected];
      if (t.dataset.bulk === 'Run AI review') ids.forEach(id => runAi(SUBMITTALS.find(x => x.id === id)));
      else ids.forEach(id => { SUBMITTALS.find(x => x.id === id).status = 'Published'; });
      listState.selected.clear();
      renderList();
      toast(`${t.dataset.bulk}: ${ids.length} submittal${ids.length === 1 ? '' : 's'}`);
    }
  });
  document.addEventListener('click', e => {
    const m = listRoot.querySelector('.sl-filter-menu');
    if (!e.target.closest('.sl-filter-menu') && !e.target.closest('.sl-filter')) {
      m.classList.remove('is-open');
      listRoot.querySelector('.sl-filter').setAttribute('aria-expanded', 'false');
    }
  });
  // Fade on the right edge while more columns are hidden
  const hscroll = listRoot.querySelector('.sl-scroll');
  const edge = () => listRoot.querySelector('.sl-table-wrap').classList.toggle('at-end', hscroll.scrollLeft + hscroll.clientWidth >= hscroll.scrollWidth - 2);
  hscroll.addEventListener('scroll', edge, { passive: true });
  new ResizeObserver(edge).observe(hscroll);
  renderList();
  edge();
  // the running sample keeps "parsing" so the state is always visible
  const live = SUBMITTALS.find(r => r.ai === 'running');
  setInterval(() => { if (live.ai === 'running' && !timers.has(live.id)) { live.done = live.done % live.docs + 1 === live.docs ? 1 : live.done + 1; updateAi(live); } }, 2400);

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
