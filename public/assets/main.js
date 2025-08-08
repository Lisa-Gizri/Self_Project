console.log("main.js loaded");
gsap.registerPlugin(ScrollTrigger);

/* -------------------------
   HERO Entrance
------------------------- */
gsap.from([".eyebrow", ".headline", ".sub"], {
  y: 50, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12
});

/* -------------------------
   Side decor (parallax + rails + sparkles)
------------------------- */
gsap.to(".orb-left", {
  yPercent: -15, xPercent: -4, rotate: 8,
  scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
});
gsap.to(".orb-right", {
  yPercent: 18, xPercent: 5, rotate: -10,
  scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
});

const sparks = gsap.utils.toArray(".spark");
sparks.forEach((el, i) => {
  el.style.left = gsap.utils.random(5, 95, 1) + "vw";
  el.style.top  = gsap.utils.random(5, 95, 1) + "vh";
  gsap.to(el, {
    y: gsap.utils.random(-10, 10), x: gsap.utils.random(-6, 6), opacity: gsap.utils.random(0.4, 0.9),
    duration: gsap.utils.random(3, 6), repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.1
  });
});

/* -------------------------
   Pinned progress section
------------------------- */
const ring = document.querySelector(".ring");
const percentEl = document.querySelector(".percent");
const steps = gsap.utils.toArray(".step");

// Pin + drive UI
ScrollTrigger.create({
  trigger: "#progress",
  start: "top top",
  end: "+=1500",
  pin: true,
  markers: false,
  onUpdate: (self) => {
    const p = self.progress; // 0..1
    gsap.to(ring, { rotation: p * 360, ease: "none", overwrite: "auto", duration: 0.1 });
    gsap.to(".dot", { scale: 1 + 0.06 * Math.sin(p * Math.PI * 4), duration: 0.15, overwrite: "auto" });
    percentEl.textContent = Math.round(p * 100) + "%";
    steps.forEach((s, i) => {
      const min = i / steps.length, max = (i + 1) / steps.length;
      s.classList.toggle("active", p >= min && p < max);
    });
    gsap.set(".rail .rail-progress", { scaleY: p });
  }
});

// Rails scrub
gsap.fromTo(".rail .rail-progress", { scaleY: 0 }, {
  scaleY: 1, ease: "none",
  scrollTrigger: { trigger: "#progress", start: "top top", end: "+=1500", scrub: true }
});

/* -------------------------
   NEW: Side flyers that slide in and then disappear
------------------------- */
const flyers = gsap.utils.toArray(".flyer");

// Stagger their triggers along the pinned distance
flyers.forEach((el, i) => {
  const fromX = el.classList.contains("left") ? -120 : 120;
  const outX  = el.classList.contains("left") ? -220 : 220;

  // Enter
  gsap.fromTo(el,
    { x: fromX, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, ease: "power2.out",
      scrollTrigger: {
        trigger: "#progress",
        start: `top+=${140 + i * 220} top`,
        end:   `top+=${140 + i * 220 + 140} top`,
        scrub: true
      }
    }
  );

  // Exit
  gsap.to(el, {
    x: outX, autoAlpha: 0, ease: "power2.in",
    scrollTrigger: {
      trigger: "#progress",
      start: `top+=${140 + i * 220 + 160} top`,
      end:   `top+=${140 + i * 220 + 320} top`,
      scrub: true
    }
  });
});
