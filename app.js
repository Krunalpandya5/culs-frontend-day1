'use strict';
// Data-driven herb garden: the only source of herb text and images is JSON.
const $ = (selector, root = document) => root.querySelector(selector);
const grid = $('#herb-grid');
const modal = $('#modal');
const track = $('#slider-track');
const dots = $('#slide-dots');
const state = { herbs: [], current: null, slide: 0, previousFocus: null, closeTimer: null };
const node = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
};
function renderCards() {
  grid.replaceChildren();
  const query = $('#herb-search').value.trim().toLowerCase();
  const type = $('#herb-filter').value;
  const matches = state.herbs.filter(h => `${h.name} ${h.scientificName} ${h.summary}`.toLowerCase().includes(query) && (type === 'all' || h.lifeCycle.toLowerCase() === type));
  matches.sort((a,b) => $('#herb-sort').value === 'za' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
  $('#herb-count').textContent = `${matches.length} herb${matches.length === 1 ? '' : 's'} grow here.`;
  if (!matches.length) { grid.append(node('p', 'muted', 'No herbs match your search.')); return; }
  const fragment = document.createDocumentFragment();
  for (const herb of matches) {
    const card = node('button', 'herb-card'); card.type = 'button';
    card.setAttribute('aria-label', `View ${herb.name} details`);
    const thumb = node('img', 'card-image'); thumb.src = herb.cardImage || herb.images[0]; thumb.alt = `${herb.name} herb`; thumb.loading = 'lazy'; thumb.decoding = 'async'; thumb.referrerPolicy = 'no-referrer';
    const info = node('span', 'card-info');
    info.append(node('span', 'card-name', herb.name), node('span', 'scientific', herb.scientificName), node('span', 'card-summary', herb.summary), node('span', 'pill', herb.lifeCycle));
    card.append(thumb, info);
    card.addEventListener('click', () => openModal(herb)); fragment.append(card);
  }
  grid.append(fragment);
}
function addSection(title, content) {
  const section = node('section', 'detail-section'); section.append(node('h3', '', title));
  if (Array.isArray(content)) { const ul = node('ul'); content.forEach(item => ul.append(node('li', '', String(item)))); section.append(ul); }
  else section.append(node('p', '', String(content)));
  $('#modal-sections').append(section);
}
function renderSlider() {
  const herb = state.current; track.replaceChildren(); dots.replaceChildren();
  herb.images.forEach((path, i) => {
    const figure = node('figure', 'slide'); const img = node('img');
    img.src = path; img.decoding = 'async'; img.alt = `${herb.name} image ${i + 1}`; img.loading = i === 0 ? 'eager' : 'lazy';
    img.addEventListener('error', () => { img.alt = `${herb.name} image unavailable`; });
    figure.append(img); track.append(figure);
    const dot = node('button'); dot.type = 'button'; dot.setAttribute('aria-label', `Show image ${i + 1}`);
    dot.addEventListener('click', () => showSlide(i)); dots.append(dot);
  });
  $('#prev-slide').hidden = herb.images.length < 2;
  $('#next-slide').hidden = herb.images.length < 2;
  showSlide(0);
}
function showSlide(index) {
  if (!state.current?.images.length) return;
  state.slide = (index + state.current.images.length) % state.current.images.length;
  track.style.transform = `translateX(-${state.slide * 100}%)`;
  [...dots.children].forEach((dot, i) => { dot.classList.toggle('active', i === state.slide); dot.setAttribute('aria-pressed', String(i === state.slide)); });
  $('#slide-count').textContent = `${state.slide + 1} / ${state.current.images.length}`;
}
function openModal(herb) {
  clearTimeout(state.closeTimer); state.current = herb; state.previousFocus = document.activeElement;
  $('#modal-title').textContent = herb.name;
  $('#modal-scientific').textContent = herb.scientificName;
  $('#modal-cycle').textContent = herb.lifeCycle;
  $('#modal-description').textContent = herb.description;
  $('#modal-sections').replaceChildren();
  addSection('Useful information', herb.usefulInformation);
  addSection('Health benefits', herb.healthBenefits);
  addSection('Medicinal uses', herb.medicinalUses);
  Object.entries(herb.additionalInformation || {}).forEach(([key, value]) => addSection(key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()), value));
  renderSlider(); modal.classList.remove('is-closing'); modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-active'); $('#modal-close').focus();
}
function closeModal() {
  if (!modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open'); modal.classList.add('is-closing');
  modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-active');
  state.previousFocus?.focus();
  state.closeTimer = setTimeout(() => { modal.classList.remove('is-closing'); state.current = null; }, 260);
}
$('#modal-close').addEventListener('click', closeModal);
$('.modal-backdrop').addEventListener('click', closeModal);
$('#prev-slide').addEventListener('click', () => showSlide(state.slide - 1));
$('#next-slide').addEventListener('click', () => showSlide(state.slide + 1));
$('#herb-search').addEventListener('input', e => renderCards());
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') showSlide(state.slide - 1);
  if (e.key === 'ArrowRight') showSlide(state.slide + 1);
  if (e.key === 'Tab') {
    const focusables = [...modal.querySelectorAll('button:not([hidden])')];
    const first = focusables[0], last = focusables.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
// Touch swipe on the carousel, with a minimum distance to avoid accidental changes.
let touchX = null;
track.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
track.addEventListener('touchend', e => {
  if (touchX === null) return;
  const delta = e.changedTouches[0].screenX - touchX;
  if (Math.abs(delta) > 45) showSlide(state.slide + (delta < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });
async function loadHerbs() {
  try {
    const indexResponse = await fetch('data/index.json');
    if (!indexResponse.ok) throw new Error(`Index request failed (${indexResponse.status})`);
    const paths = await indexResponse.json();
    if (!Array.isArray(paths)) throw new Error('Invalid herb index');
    const herbs = await Promise.all(paths.map(async path => {
      if (!/^data\/[A-Za-z0-9_-]+\.json$/.test(path)) throw new Error('Invalid data path');
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Could not load ${path}`);
      const herb = await response.json();
      if (!herb.name || !herb.scientificName || !Array.isArray(herb.images) || !herb.images.length || herb.images.some(p => !/^image\/[a-z0-9-]+\.jpg$/.test(p))) throw new Error(`Invalid herb data: ${path}`);
      return herb;
    }));
    state.herbs = herbs; $('#status').textContent = ''; renderCards();
  } catch (error) {
    console.error('Herb data loading failed:', error);
    $('#status').textContent = 'Unable to load herbs. Run this project using a local web server (see README.md).';
    $('#herb-count').textContent = 'Herbs unavailable';
  }
}
$('#year').textContent = new Date().getFullYear();
loadHerbs();

// Single-page navigation and active section highlighting.
const nav = $('#site-nav');
$('#menu-toggle').addEventListener('click', () => { const opened = nav.classList.toggle('open'); $('#menu-toggle').setAttribute('aria-expanded', String(opened)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded', 'false'); }));
const sections = [...document.querySelectorAll('main section[id], footer[id]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`)); });
}, {rootMargin:'-120px 0px -55% 0px'});
sections.forEach(section => sectionObserver.observe(section));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
$('#herb-filter').addEventListener('change', renderCards);
$('#herb-sort').addEventListener('change', renderCards);
document.querySelectorAll('.footer-herb').forEach(button => button.addEventListener('click', () => {const herb=state.herbs.find(h=>h.name===button.dataset.herb);if(herb)openModal(herb);}));
// Gallery lightbox: all images are local, with keyboard and button navigation.
const lightbox = $('#lightbox'); const galleryImages = [...document.querySelectorAll('.gallery-item img')];
let galleryIndex = 0, galleryFocus = null;
function showGallery(i){galleryIndex=(i+galleryImages.length)%galleryImages.length;$('#lightbox-image').src=galleryImages[galleryIndex].src;$('#lightbox-image').alt=galleryImages[galleryIndex].alt;$('#lightbox-caption').textContent=galleryImages[galleryIndex].closest('.gallery-item')?.dataset.caption || `Garden view ${galleryIndex+1} of ${galleryImages.length}`;}
function openGallery(i){galleryFocus=document.activeElement;showGallery(i);lightbox.classList.add('is-open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('modal-active');$('#lightbox-close').focus();}
function closeGallery(){lightbox.classList.remove('is-open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('modal-active');galleryFocus?.focus();}
document.querySelectorAll('.gallery-item').forEach((b,i)=>b.addEventListener('click',()=>openGallery(i)));
$('#lightbox-close').addEventListener('click',closeGallery);
$('#lightbox-prev').addEventListener('click',()=>showGallery(galleryIndex-1));
$('#lightbox-next').addEventListener('click',()=>showGallery(galleryIndex+1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeGallery();});
document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('is-open'))return;if(e.key==='Escape')closeGallery();if(e.key==='ArrowLeft')showGallery(galleryIndex-1);if(e.key==='ArrowRight')showGallery(galleryIndex+1);if(e.key==='Tab'){const controls=[...lightbox.querySelectorAll('button')];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});

// Fall back to the bundled image if an external photographic source cannot load.
document.querySelectorAll('.gallery-item img').forEach(img => { img.addEventListener('error', () => { if (img.dataset.fallback && img.src !== new URL(img.dataset.fallback, document.baseURI).href) img.src = img.dataset.fallback; }); });
