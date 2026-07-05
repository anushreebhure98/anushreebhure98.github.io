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
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.12 }
);

fades.forEach(el => observer.observe(el));

const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
const orb3 = document.querySelector('.orb-3');

document.addEventListener('mousemove', event => {
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;

  if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
  if (orb3) orb3.style.transform = `translate(${x * 0.35}px, ${-y * 0.35}px)`;
});
