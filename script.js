const nav = document.getElementById('nav');
const bar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  if (bar) bar.style.width = pct + '%';
});

const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

document.querySelectorAll('.exp-bullets li').forEach(li => {
  li.innerHTML = li.innerHTML.replace(/(\d[\d,]*\+?%|\d[\d,]*\+(?!\d))/g, '<span class="stat-num">$1</span>');
});

const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
});
