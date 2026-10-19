// Click-to-enlarge: any <button class="zoom" data-full="…"> wrapping an <img> opens the full-size image.
// Clicking the enlarged image toggles between fit-to-screen and actual size (scrollable).
(() => {
  const triggers = document.querySelectorAll('button.zoom[data-full]');
  if (!triggers.length) return;

  const box = document.createElement('dialog');
  box.className = 'lightbox';
  box.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Close">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>
    <figure class="lightbox-stage">
      <img alt="">
      <figcaption></figcaption>
    </figure>`;
  document.body.append(box);

  const img = box.querySelector('img');
  const caption = box.querySelector('figcaption');

  const open = trigger => {
    const thumb = trigger.querySelector('img');
    const text = trigger.closest('figure')?.querySelector('figcaption')?.textContent.trim() || thumb.alt || trigger.dataset.caption || '';
    box.classList.remove('is-actual');
    img.src = trigger.dataset.full;
    img.alt = thumb.alt || trigger.dataset.caption || '';
    caption.textContent = text;
    box.showModal();
    document.documentElement.classList.add('lightbox-open');
  };

  box.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    img.removeAttribute('src');
  });
  box.querySelector('.lightbox-close').addEventListener('click', () => box.close());
  // Anything outside the image (the dark backdrop or the empty stage around it) closes it
  box.addEventListener('click', e => {
    if (e.target === box || e.target.classList.contains('lightbox-stage')) box.close();
  });
  img.addEventListener('click', () => box.classList.toggle('is-actual'));

  triggers.forEach(t => t.addEventListener('click', () => open(t)));
})();
