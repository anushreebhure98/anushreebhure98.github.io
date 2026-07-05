(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const bar = document.getElementById('progress-bar');

  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    if (bar) {
      var pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = pct + '%';
    }
  }, { passive: true });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-up').forEach(function (el) {
    observer.observe(el);
  });

  document.querySelectorAll('.exp-bullets li').forEach(function (li) {
    li.innerHTML = li.innerHTML.replace(
      /(\d[\d,]*\+?%|\d[\d,]*\+(?!\d))/g,
      '<span class="stat-num">$1</span>'
    );
  });

  var orb1 = document.querySelector('.orb-1');
  var orb2 = document.querySelector('.orb-2');
  var ticking = false;
  document.addEventListener('mousemove', function (e) {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        var x = (e.clientX / window.innerWidth - 0.5) * 18;
        var y = (e.clientY / window.innerHeight - 0.5) * 18;
        if (orb1) orb1.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        if (orb2) orb2.style.transform = 'translate(' + (-x * 0.6) + 'px, ' + (-y * 0.6) + 'px)';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.proj-card[data-tags]');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        projectCards.forEach(function (card) {
          var tags = card.getAttribute('data-tags') || '';
          if (filter === 'all' || tags.indexOf(filter) !== -1) {
            card.classList.remove('proj-hidden');
          } else {
            card.classList.add('proj-hidden');
          }
        });
      });
    });
  }
})();
