// Utilidades
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Ano automático no footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Menu mobile toggle
const toggle = $('.nav__toggle');
const menu = $('#menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('is-open');
  });

  // Fechar ao clicar em um link
  $$('#menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Header sticky
const header = $('.header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (!header) return;
  if (y > 10 && !header.classList.contains('is-sticky')) header.classList.add('is-sticky');
  if (y <= 10 && header.classList.contains('is-sticky')) header.classList.remove('is-sticky');
  lastScroll = y;
}, { passive: true });

// Scroll suave (fallback para navegadores sem CSS smooth)
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 68; // compensar header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// Reveal on scroll com IntersectionObserver + stagger
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      // Stagger baseado no índice dentro do container
      const parent = el.parentElement;
      const siblings = $$('.reveal', parent);
      const index = siblings.indexOf(el);
      el.style.transitionDelay = `${Math.min(index * 0.12, 0.6)}s`;
      el.classList.add('is-visible');

      // Caso seja item de galeria, sinalizar o figure
      if (el.classList.contains('gallery__item')) {
        el.classList.add('is-visible');
      }

      observer.unobserve(el);
    }
  });
}, { threshold: 0.15 });

$$('.reveal').forEach(el => observer.observe(el));

// Pequena atenção ao desempenho: cancelar animações se reduzir movimento
const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaReduced.matches) {
  document.documentElement.style.scrollBehavior = 'auto';
  // Remove animações do hero e reveals
  $$('.hero__bg, .scroll-dot').forEach(el => el.style.animation = 'none');
  $$('.reveal').forEach(el => {
    el.style.transition = 'none';
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}
