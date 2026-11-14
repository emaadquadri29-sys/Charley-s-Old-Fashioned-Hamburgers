/* Charley's Old Fashioned Hamburgers — demo site behaviour */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Footer year */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  const toggle = $('#navToggle');
  const links = $('#navLinks');

  function setMenu(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => {
    if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });

  /* ---------- Header shadow + back-to-top ---------- */
  const header = $('#header');
  const toTop = $('#toTop');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link while scrolling ---------- */
  const navAnchors = $$('.nav-links a:not(.btn)');
  const sections = navAnchors.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const setActive = id => navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Menu category tabs ---------- */
  const tabs = $$('.tab');
  const dishes = $$('.dish');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
    });
    dishes.forEach(d => {
      const show = filter === 'all' || d.dataset.cat === filter;
      d.classList.toggle('hide', !show);
      if (show) d.classList.add('in');
    });
  }));

  /* ---------- Gallery lightbox ---------- */
  const items = $$('.g-item');
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  let current = 0;
  let lastFocus = null;

  function show(i) {
    current = (i + items.length) % items.length;
    const item = items[current];
    lbImg.src = item.dataset.full;
    lbImg.alt = $('img', item).alt;
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = '';
    lbImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }
  items.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', () => show(current - 1));
  $('#lbNext').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* ---------- Placeholder social links: don't jump to top ---------- */
  $$('.social-ph').forEach(a => a.addEventListener('click', e => e.preventDefault()));
})();
