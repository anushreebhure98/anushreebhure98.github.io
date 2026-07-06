(function () {
  'use strict';

  // ---- theme toggle ----
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
  }
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) applyTheme(savedTheme);
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  // ---- about section persona tabs ----
  const tabSf = document.getElementById('tab-sf');
  const tabAi = document.getElementById('tab-ai');
  const panelSf = document.getElementById('panel-sf');
  const panelAi = document.getElementById('panel-ai');
  function showTab(tab) {
    const isSf = tab === 'sf';
    panelSf.style.display = isSf ? '' : 'none';
    panelAi.style.display = isSf ? 'none' : '';
    tabSf.style.color = isSf ? '#4ade80' : '#7a6a63';
    tabSf.style.borderBottomColor = isSf ? '#4ade80' : 'transparent';
    tabAi.style.color = isSf ? '#7a6a63' : '#ff7b6b';
    tabAi.style.borderBottomColor = isSf ? 'transparent' : '#ff7b6b';
  }
  tabSf.addEventListener('click', () => showTab('sf'));
  tabAi.addEventListener('click', () => showTab('ai'));

  // ---- drag-to-reveal dual-lens hero ----
  const hero = document.getElementById('hero-drag');
  const topLayer = document.getElementById('hero-top-layer');
  const handle = document.getElementById('hero-handle');
  let dragging = false;

  function setPos(clientX) {
    const rect = hero.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.round(Math.max(4, Math.min(96, pct)) * 100) / 100;
    const clip = `inset(0 ${100 - pct}% 0 0)`;
    topLayer.style.clipPath = clip;
    topLayer.style.webkitClipPath = clip;
    handle.style.left = `${pct}%`;
  }

  hero.addEventListener('pointerdown', (e) => { dragging = true; setPos(e.clientX); });
  window.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
  window.addEventListener('pointerup', () => { dragging = false; });
  hero.addEventListener('pointerleave', () => { dragging = false; });
})();
