// About modal: one copy of the markup, opened from any nav "About" link (or #about in the URL)
(() => {
  const RESUME = 'https://drive.google.com/file/d/1KyfU4cFnLQObUV00UWLE0s9fNRQ7kGn_/view?usp=sharing';

  const dialog = document.createElement('dialog');
  dialog.className = 'about';
  dialog.setAttribute('aria-labelledby', 'about-title');
  dialog.innerHTML = `
  <div class="about-panel">
    <div class="about-head">
      <h2 id="about-title">About</h2>
      <button type="button" class="about-close" aria-label="Close">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </div>

    <div class="about-body">
      <div class="about-side">
        <img class="about-portrait" src="assets/about/portrait.jpg" alt="Colman smiling in a cap and sunglasses on a sunny day" width="300" height="200">
        <h3>Reach out!</h3>
        <dl class="about-contact">
          <dt>Email</dt>
          <dd><a href="mailto:kolmantsang@gmail.com">kolmantsang@gmail.com</a></dd>
          <dt>LinkedIn</dt>
          <dd><a class="underline" href="https://www.linkedin.com/in/colman-tsang/" target="_blank" rel="noopener">/in/colman-tsang</a></dd>
          <dt>Résumé</dt>
          <dd><a class="accent" href="${RESUME}" target="_blank" rel="noopener">Download here</a></dd>
        </dl>
      </div>

      <div class="about-bio">
        <p><strong>Howdy 👋! My name is Colman and I'm a senior product designer with 4+ years of experience</strong> across various industries and verticals. Recently I've been building <a class="underline" href="govgig.html">GovGig</a>, a construction management platform for federal contractors.</p>
        <p>Since childhood, I've been fascinated by small details. From mismatched paint on Hot Wheels to mismatched fonts on Lego blocks. My early eye for precision naturally evolved into a passion for design and building: taking ideas and snapping them together from vision to launch.</p>
        <p>In my free time, I love staying active whether it's golf, skiing, or travelling!</p>
      </div>
    </div>

    <div class="about-collage" aria-hidden="true">
      <img class="c-forest" src="assets/about/collage-forest.jpg" alt="">
      <img class="c-tennis" src="assets/about/collage-tennis.jpg" alt="">
      <img class="c-snow" src="assets/about/collage-snow.jpg" alt="">
      <img class="c-fishing" src="assets/about/collage-fishing.jpg" alt="">
      <img class="c-zipline" src="assets/about/collage-zipline.jpg" alt="">
    </div>
  </div>`;
  document.body.append(dialog);

  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    document.documentElement.classList.add('about-open');
  };
  const close = () => dialog.close();

  // Show the scrollbar only while scrolling, fading out shortly after it stops
  let scrollTimer;
  dialog.addEventListener('scroll', () => {
    dialog.classList.add('is-scrolling');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => dialog.classList.remove('is-scrolling'), 800);
  }, { passive: true });

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('about-open');
    if (location.hash === '#about') history.replaceState(null, '', location.pathname + location.search);
  });
  dialog.querySelector('.about-close').addEventListener('click', close);
  // The panel fills the dialog, so a click that lands on the dialog itself is on the tinted backdrop
  dialog.addEventListener('click', e => {
    if (e.target === dialog) close();
  });

  document.querySelectorAll('[data-about]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      open();
    });
  });

  if (location.hash === '#about') open();
})();
