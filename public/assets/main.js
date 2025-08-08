// ---------- UTIL: split headline into spans (no plugin required)
function splitText(el){
  const text = el.innerText;
  el.innerHTML = '';
  text.split('').forEach(ch=>{
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
  });
  return el.querySelectorAll('.char');
}

// Set current year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for fonts/layout for accurate measurements
window.addEventListener('load', () => {
  // ---------- HERO INTRO ----------
  const headline = document.querySelector('[data-split]');
  const chars = headline ? splitText(headline) : [];

  const intro = gsap.timeline({ defaults:{ ease:'power3.out' }});
  intro
    .from('.logo-mark', { scale:0, rotate:-90, duration:.6 })
    .from('.logo span:last-child', { opacity:0, x:-10, duration:.4 }, '<+.15')
    .from('.eyebrow', { y:10, opacity:0, duration:.5 }, '<')
    .to(chars, { opacity:1, y:0, rotate:0, stagger:{ each:.02, from:'edges' }, duration:.6 }, '<+.1')
    .from('.sub', { opacity:0, y:10, duration:.5 }, '<+.1')
    .from('.cta-row .btn', { opacity:0, y:10, stagger:.08, duration:.4 }, '<+.05')
    .from('.hero-card', { opacity:0, y:20, duration:.5 }, '<+.05');

  // Floating blobs
  gsap.to('.blob.one', { y:25, duration:4, repeat:-1, yoyo:true, ease:'sine.inOut' });
  gsap.to('.blob.two', { y:-20, x:8, duration:5, repeat:-1, yoyo:true, ease:'sine.inOut' });

  // ---------- HERO PARALLAX ----------
  if (document.querySelector('.hero')) {
    gsap.to('.hero-card', {
      y: 30, opacity: 0.95,
      scrollTrigger: { trigger: '.hero', start:'top top', end:'bottom top', scrub:true }
    });

    if (chars.length){
      gsap.to(chars, {
        y: (i)=> (i % 2 ? -6 : 6),
        rotation: (i)=> (i % 3 ? -1.5 : 1.5),
        scrollTrigger: { trigger: '.hero', start:'top top', end:'bottom top', scrub:true }
      });
    }
  }

  // ---------- PIN "Selected Work" HEADER ----------
  const workSection = document.querySelector('#work');
  if (workSection) {
    const head = workSection.querySelector('.section-head');
    if (head) {
      ScrollTrigger.create({
        trigger: workSection,
        start: 'top top+=60',   // account for sticky header
        end: '+=80%',
        pin: head,
        pinSpacing: true
      });

      gsap.to('.section-head .tag', {
        opacity: 0.25,
        scrollTrigger: { trigger: workSection, start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  // ---------- CARD REVEALS ----------
  gsap.utils.toArray('.card').forEach((card, i)=>{
    gsap.fromTo(card,
      { y:40, opacity:0 },
      {
        y:0, opacity:1, duration:.7, ease:'power2.out', delay: i * .06,
        scrollTrigger: { trigger: card, start: 'top 80%' }
      }
    );

    // Subtle parallax on the thumbnail
    const thumbEl = card.querySelector('.thumb');
    if (thumbEl){
      gsap.to(thumbEl, {
        backgroundPosition: '60% 40%',
        scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 20%', scrub: true }
      });
    }
  });

  // ---------- SKILL METERS ----------
  gsap.utils.toArray('.bar').forEach(bar=>{
    const target = +bar.dataset.target || 70;
    gsap.to(bar, {
      width: target + '%', duration: 1.2, ease:'power3.out',
      scrollTrigger: { trigger: bar, start: 'top 85%' }
    });
  });

  // ---------- TOP SCROLL PROGRESS ----------
  const progressEl = document.querySelector('.scroll-progress');
  if (progressEl) {
    ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: self => { progressEl.style.width = (self.progress * 100).toFixed(2) + '%'; }
    });
  }

  // ---------- SMOOTH IN-PAGE SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior:'smooth', block:'start' });
        }
      }
    });
  });
});
