console.log("main.js loaded");
gsap.registerPlugin(ScrollTrigger, Draggable);

/*FREE SplitText-like function (chars + words)*/
function splitText(el) {
    const text = el.textContent;
    el.textContent = "";
    const words = [];
    const chars = [];
    text.split(/(\s+)/).forEach(token => {
        if (/\s+/.test(token)) {
            el.appendChild(document.createTextNode(token));
        } else {
            const w = document.createElement("span");
            w.className = "word"; el.appendChild(w); words.push(w);
            token.split("").forEach(ch => {
                const c = document.createElement("span");
                c.className = "char"; c.textContent = ch; w.appendChild(c); chars.push(c);
            });
        }
    });
    return { words, chars };
}

/*HERO: CodePen-like text entrance*/
(function heroTextAnimation() {
    const target = document.querySelector(".headline.text-split");
    const { words, chars } = splitText(target);

    gsap.set([words, chars], { yPercent: 120, opacity: 0, rotateX: -30, transformOrigin: "50% 100%" });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "back.out(1.7)" } });
    tl.to(words, { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: { each: 0.06, from: "start" } })
        .to(chars, { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.5, stagger: { each: 0.012, from: "random" } }, "-=0.30");

    tl.play();
    ScrollTrigger.create({
        trigger: "#hero", start: "top 80%",
        onEnter: () => tl.restart(), onEnterBack: () => tl.restart()
    });
})();

/*Draggable colorizer (from CodePen JjQRzNy) - drag any .ditem over the SVG .color-logo to recolor gradient stops*/
(function colorLab() {
    const logo = document.querySelector(".color-logo");
    const stops = logo.querySelectorAll("#gsapGradient stop");
    const items = gsap.utils.toArray(".ditem");

    items.forEach((btn, i) => {
        Draggable.create(btn, {
            type: "x,y",
            onPress: () => {
                gsap.to(btn, { duration: 0.1, scale: 1.2, rotate: gsap.utils.random(-9, 9), zIndex: 100 });
                gsap.to(items, { duration: 0.1, opacity: t => (t === btn ? 1 : 0.35) });
            },
            onRelease: () => {
                gsap.to(btn, { duration: 0.4, x: 0, y: 0, rotate: 0, scale: 1, ease: "elastic.out(0.45)" });
                gsap.to(items, { duration: 0.2, opacity: 1, zIndex: 0 });
            },
            onDrag: function () {
                if (Draggable.hitTest(btn, logo, 12)) {
                    const c0 = btn.getAttribute("data-c0");
                    const c1 = btn.getAttribute("data-c1");
                    gsap.to(stops, { attr: { "stop-color": (n) => n === 0 ? c0 : c1 }, duration: 0.2, overwrite: true });
                }
            }
        });
    });
})();

/*Parallax decor (kept)*/
gsap.to(".orb-left", {
    yPercent: -15, xPercent: -4, rotate: 8,
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
});
gsap.to(".orb-right", {
    yPercent: 18, xPercent: 5, rotate: -10,
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
});
gsap.utils.toArray(".spark").forEach((el, i) => {
    el.style.left = gsap.utils.random(5, 95, 1) + "vw";
    el.style.top = gsap.utils.random(5, 95, 1) + "vh";
    gsap.to(el, {
        y: gsap.utils.random(-10, 10), x: gsap.utils.random(-6, 6),
        opacity: gsap.utils.random(0.4, 0.9),
        duration: gsap.utils.random(3, 6), repeat: -1, yoyo: true,
        ease: "sine.inOut", delay: i * 0.08
    });
});

/*Pinned progress section (kept)*/
const ring = document.querySelector(".ring");
const percentEl = document.querySelector(".percent");
const steps = gsap.utils.toArray(".step");

ScrollTrigger.create({
    trigger: "#progress",
    start: "top top",
    end: "+=1500",
    pin: true,
    onUpdate: (self) => {
        const p = self.progress;
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

/* Flyers in/out (kept)*/
gsap.utils.toArray(".flyer").forEach((el, i) => {
    const fromX = el.classList.contains("left") ? -120 : 120;
    const outX = el.classList.contains("left") ? -220 : 220;

    gsap.fromTo(el, { x: fromX, autoAlpha: 0 }, {
        x: 0, autoAlpha: 1, ease: "power2.out",
        scrollTrigger: { trigger: "#progress", start: `top+=${140 + i * 220} top`, end: `top+=${140 + i * 220 + 140} top`, scrub: true }
    });

    gsap.to(el, {
        x: outX, autoAlpha: 0, ease: "power2.in",
        scrollTrigger: { trigger: "#progress", start: `top+=${140 + i * 220 + 160} top`, end: `top+=${140 + i * 220 + 320} top`, scrub: true }
    });
});