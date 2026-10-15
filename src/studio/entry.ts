const host = document.querySelector<HTMLElement>("[data-scroll-studio]");
if (host) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const chapters = [
    ...host.querySelectorAll<HTMLElement>("[data-studio-chapter]"),
  ];
  const buttons = [
    ...host.querySelectorAll<HTMLButtonElement>("[data-studio-jump]"),
  ];
  const progressLine = host.querySelector<HTMLElement>("[data-studio-line]");
  const clients = [
    ...host.querySelectorAll<HTMLElement>("[data-studio-client]"),
  ];
  let control: { update: (value: number) => void; dispose: () => void } | null =
    null;
  let frame = 0;
  function progress(): number {
    if (!host) return 0;
    const rect = host.getBoundingClientRect();
    const top =
      parseFloat(getComputedStyle(host).getPropertyValue("--studio-top")) || 78;
    return Math.min(
      1,
      Math.max(
        0,
        (top - rect.top) / Math.max(1, rect.height - innerHeight + top),
      ),
    );
  }
  function update(): void {
    frame = 0;
    if (!host) return;
    const value = progress();
    control?.update(value);
    const chapter = value < 0.44 ? 0 : value < 0.7 ? 1 : value < 0.9 ? 2 : 3;
    const staticMode = reduced.matches;
    chapters.forEach((el, index) => {
      el.hidden = !staticMode && chapter !== index;
    });
    buttons.forEach((b, i) => {
      if (i === chapter) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
    });
    const client = value < 0.145 ? 0 : value < 0.29 ? 1 : 2;
    clients.forEach((el, i) => (el.hidden = i !== client));
    if (progressLine) progressLine.style.transform = `scaleX(${value})`;
    host.dataset.studioChapter = String(chapter);
  }
  function schedule(): void {
    if (!frame) frame = requestAnimationFrame(update);
  }
  async function load(): Promise<void> {
    if (!host) return;
    if (reduced.matches) {
      host.dataset.studioState = "static";
      update();
      return;
    }
    host.dataset.studioState = "loading";
    try {
      const { mountStudio } = await import("./scene");
      if (reduced.matches) {
        host.dataset.studioState = "static";
        return;
      }
      control = await mountStudio(host);
      update();
    } catch {
      host.dataset.studioState = "fallback";
      update();
    }
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        void load();
      }
    },
    { rootMargin: "450px" },
  );
  observer.observe(host);
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      if (!host) return;
      const value = Number(button.dataset.studioJump) || 0;
      const rect = host.getBoundingClientRect();
      const top =
        parseFloat(getComputedStyle(host).getPropertyValue("--studio-top")) ||
        78;
      const y =
        scrollY +
        rect.top -
        top +
        value * Math.max(1, rect.height - innerHeight + top);
      window.scrollTo({ top: y, behavior: "instant" });
    }),
  );
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  reduced.addEventListener("change", () => {
    control?.dispose();
    control = null;
    void load();
  });
  host
    .querySelector("canvas")
    ?.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      control?.dispose();
      control = null;
      host.dataset.studioState = "fallback";
    });
  window.addEventListener(
    "pagehide",
    () => {
      if (frame) cancelAnimationFrame(frame);
    },
    { once: true },
  );
  update();
}
export {};
