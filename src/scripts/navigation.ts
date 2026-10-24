const STORE = "__pfioNavDestroy";

export function initNavigation(): void {
  const host = window as Window & { [STORE]?: () => void };
  host[STORE]?.();

  const button = document.querySelector<HTMLButtonElement>(".menu-toggle");
  const menu = document.querySelector<HTMLElement>("#mobile-menu");
  const label = button?.querySelector(".menu-toggle-label");
  if (!button || !menu || !label) return;

  const cleanups: Array<() => void> = [];
  const on = (target: EventTarget, type: string, fn: EventListener) => {
    target.addEventListener(type, fn);
    cleanups.push(() => target.removeEventListener(type, fn));
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  const focusable = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const setOpen = (open: boolean) => {
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close" : "Menu";
    document.body.classList.toggle("menu-open", open);
    main?.toggleAttribute("inert", open);
    footer?.toggleAttribute("inert", open);
    if (open) menu.querySelector<HTMLElement>("a")?.focus();
  };

  on(button, "click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  on(document, "keydown", (event) => {
    const keyEvent = event as KeyboardEvent;
    const open = button.getAttribute("aria-expanded") === "true";
    if (keyEvent.key === "Escape" && open) {
      setOpen(false);
      button.focus();
      return;
    }
    if (keyEvent.key !== "Tab" || menu.hidden) return;

    const nodes = [
      ...document.querySelectorAll<HTMLElement>(".wordmark, .menu-toggle, #mobile-menu a"),
    ];
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (!first || !last) return;

    if (keyEvent.shiftKey && document.activeElement === first) {
      keyEvent.preventDefault();
      last.focus();
    } else if (!keyEvent.shiftKey && document.activeElement === last) {
      keyEvent.preventDefault();
      first.focus();
    }
  });

  on(document, "click", (event) => {
    const target = event.target as HTMLElement | null;
    const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (!id || id.length < 2) return;
    const dest = document.querySelector<HTMLElement>(id);
    if (!dest) return;

    event.preventDefault();
    if (link.closest("#mobile-menu")) setOpen(false);
    dest.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", id);
    if (id !== "#top") {
      dest.setAttribute("tabindex", "-1");
      dest.focus({ preventScroll: true });
    }
  });

  const navLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-nav]")];
  const sections = navLinks
    .map((link) => document.querySelector<HTMLElement>(link.getAttribute("href") || ""))
    .filter((section, index, list): section is HTMLElement => {
      return Boolean(section) && list.indexOf(section) === index;
    });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = `#${visible.target.id}`;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === id;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: [0.1, 0.35, 0.6] },
  );

  sections.forEach((section) => observer.observe(section));
  cleanups.push(() => observer.disconnect());

  const desktop = window.matchMedia("(min-width: 861px)");
  const closeOnDesktop = () => {
    if (desktop.matches) setOpen(false);
  };
  on(desktop, "change", closeOnDesktop);

  on(window, "popstate", () => {
    const id = window.location.hash;
    if (!id) return;
    document.querySelector<HTMLElement>(id)?.scrollIntoView({ behavior: "auto", block: "start" });
  });

  host[STORE] = () => {
    cleanups.forEach((fn) => fn());
    document.body.classList.remove("menu-open");
    main?.removeAttribute("inert");
    footer?.removeAttribute("inert");
  };
}
