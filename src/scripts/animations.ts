import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STORE = "__pfioMotion";

type Store = { revert?: () => void };

export function initAnimations(): void {
  const host = window as Window & { [STORE]?: Store };
  host[STORE]?.revert?.();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  const motion = gsap.matchMedia();
  host[STORE] = { revert: () => motion.revert() };

  motion.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.fromTo(
      ".hero-line-inner",
      { yPercent: 115 },
      { yPercent: 0, duration: 1.05, ease: "power4.out", stagger: 0.07 },
    );

    gsap.fromTo(
      ".hero-fade",
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out", stagger: 0.08, delay: 0.35 },
    );

    gsap.fromTo(
      ".hero-frame img",
      { scale: 1.12 },
      { scale: 1, duration: 1.5, ease: "power3.out" },
    );

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.05,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
      const amount = Number(el.dataset.parallax || "24");
      gsap.fromTo(
        el,
        { y: -amount },
        {
          y: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    });

    const line = document.querySelector(".timeline-line");
    if (line) {
      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 75%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        },
      );
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      window.removeEventListener("load", refresh);
    };
  });
}
