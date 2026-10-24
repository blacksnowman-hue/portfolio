import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STORE = "__pfioPreloaderDestroy";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForWindowLoad(): Promise<void> {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function waitForEagerImages(): Promise<void> {
  const images = [...document.querySelectorAll<HTMLImageElement>("img")].filter(
    (img) => img.loading !== "lazy" || img.closest(".hero-frame"),
  );

  if (images.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }),
    ),
  ).then(() => undefined);
}

async function runLoadSteps(onProgress: (value: number) => void): Promise<void> {
  onProgress(0);

  const fonts = document.fonts?.ready ?? Promise.resolve();
  await Promise.race([fonts, delay(8000)]);
  onProgress(0.25);

  await Promise.race([waitForEagerImages(), delay(8000)]);
  onProgress(0.55);

  await Promise.race([waitForWindowLoad(), delay(8000)]);
  onProgress(0.9);

  await delay(600);
  onProgress(1);
}

function waitGate(onProgress: (value: number) => void): Promise<void> {
  return Promise.race([runLoadSteps(onProgress), delay(8000).then(() => onProgress(1))]);
}

function cleanupPreloader(root: HTMLElement | null, flyer: HTMLElement | null): void {
  flyer?.remove();
  root?.remove();
  document.documentElement.classList.remove("is-preloading");
  document.body.removeAttribute("aria-busy");
}

export function initPreloader(): Promise<void> {
  const host = window as Window & { [STORE]?: () => void };
  host[STORE]?.();

  const root = document.getElementById("preloader");
  const source = document.getElementById("preloader-wordmark");
  const target = document.getElementById("site-wordmark-mark");

  if (!root || !source || !target) {
    document.documentElement.classList.remove("is-preloading");
    document.body.removeAttribute("aria-busy");
    return Promise.resolve();
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    cleanupPreloader(root, null);
    return Promise.resolve();
  }

  document.body.setAttribute("aria-busy", "true");

  const bar = root.querySelector<HTMLElement>(".preloader-bar-fill");
  const progressLabel = document.getElementById("preloader-progress");

  const setProgress = (value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    if (bar) {
      gsap.to(bar, {
        scaleX: clamped,
        duration: 0.2,
        ease: "power1.out",
        overwrite: true,
      });
    }
    if (progressLabel) {
      progressLabel.textContent = `${Math.round(clamped * 100)}%`;
    }
  };

  const run = async () => {
    setProgress(0);
    await waitGate(setProgress);

    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();

    const flyer = source.cloneNode(true) as HTMLElement;
    flyer.id = "preloader-flyer";
    flyer.classList.remove("preloader-mark");
    flyer.setAttribute("aria-hidden", "true");
    document.body.appendChild(flyer);

    gsap.set(source, { autoAlpha: 0 });
    gsap.set(flyer, {
      position: "fixed",
      left: from.left,
      top: from.top,
      width: from.width,
      height: from.height,
      margin: 0,
      autoAlpha: 1,
      zIndex: 201,
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    });
    flyer.classList.add("is-active");

    await new Promise<void>((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });

      tl.to(
        flyer,
        {
          left: to.left,
          top: to.top,
          width: to.width,
          height: to.height,
          duration: 0.85,
          ease: "power3.inOut",
        },
        0,
      );

      tl.to(root, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, 0.5);
    });

    cleanupPreloader(root, flyer);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const promise = run().catch((error) => {
    console.error(error);
    cleanupPreloader(root, document.getElementById("preloader-flyer"));
  });

  host[STORE] = () => {
    gsap.killTweensOf([root, bar, "#preloader-flyer"]);
    cleanupPreloader(root, document.getElementById("preloader-flyer"));
  };

  return promise;
}
