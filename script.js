const nav = document.getElementById('nav');
const bar = document.getElementById('progress-bar');
const fades = document.querySelectorAll('.fade-up');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);

  if (bar) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = `${pct}%`;
  }
});

const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }),
  { threshold: 0.12 }
);

fades.forEach(el => observer.observe(el));
