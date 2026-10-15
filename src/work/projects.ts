export {};

type Category = "websites" | "analytics" | "automation" | "apps";
interface Project {
  id: string;
  title: string;
  summary: string;
  year: number;
  category: Category;
  stack: string[];
  roles: string[];
  highlights: string[];
  image: string;
  alt: string;
  gallery: string[];
  links: { live: string; repo: string; caseStudy: string };
}
const categoryNames: Record<Category, string> = {
  websites: "Business website",
  analytics: "Data & dashboards",
  automation: "Workflow automation",
  apps: "App & experiment",
};
function element<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing ${id}`);
  return node as T;
}
const grid = element("projects-grid"),
  count = element("result-count"),
  search = element<HTMLInputElement>("project-search"),
  sort = element<HTMLSelectElement>("sort-select"),
  empty = element("empty-state"),
  errorPanel = element("load-error"),
  dialog = element<HTMLDialogElement>("project-modal"),
  modalBody = element("modal-body");
let projects: Project[] = [],
  category = "all",
  opener: HTMLElement | null = null;
function string(value: unknown): string {
  return typeof value === "string" ? value : "";
}
function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
function safeURL(value: unknown): string {
  const raw = string(value);
  if (!raw) return "";
  try {
    const url = new URL(raw, location.href);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
function normalize(value: unknown): Project {
  const raw = record(value),
    cover = record(raw.coverImage),
    links = record(raw.links);
  const stack = strings(raw.stack),
    tags = strings(raw.tags);
  const hay = [...tags, ...stack].join(" ").toLowerCase();
  const explicit = string(raw.category);
  const valid: Category[] = ["websites", "analytics", "automation", "apps"];
  const category: Category = valid.includes(explicit as Category)
    ? (explicit as Category)
    : /analytics|dashboard|inventory|reporting/.test(hay)
      ? "analytics"
      : /automation|bot|label|pdf/.test(hay)
        ? "automation"
        : "apps";
  const image = safeURL(cover.src);
  return {
    id: string(raw.id),
    title: string(raw.title),
    summary: string(raw.summary),
    year: typeof raw.year === "number" ? raw.year : 0,
    category,
    stack,
    roles: strings(raw.role),
    highlights: strings(raw.highlights),
    image,
    alt: string(cover.alt) || string(raw.title),
    gallery: [
      ...new Set(
        [
          image,
          ...(Array.isArray(raw.gallery)
            ? raw.gallery.map((item) => safeURL(record(item).src))
            : []),
        ].filter(Boolean),
      ),
    ],
    links: {
      live: safeURL(links.live),
      repo: safeURL(links.repo),
      caseStudy: safeURL(links.caseStudy),
    },
  };
}
function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = "",
  text = "",
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
}
function link(label: string, url: string): HTMLAnchorElement {
  const el = node("a", "", label);
  el.href = url;
  if (new URL(url).origin !== location.origin) {
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  }
  const icon = node("i", "fas fa-arrow-up-right-from-square");
  icon.setAttribute("aria-hidden", "true");
  el.append(icon);
  return el;
}
function image(project: Project): HTMLElement {
  const el = node("img");
  el.src = project.image;
  el.alt = project.alt;
  el.width = 1440;
  el.height = 1000;
  el.loading = "lazy";
  el.decoding = "async";
  el.addEventListener(
    "error",
    () => el.replaceWith(node("span", "work-media-fallback", project.title)),
    { once: true },
  );
  return el;
}
function actions(project: Project): HTMLElement {
  const el = node("div", "work-actions");
  if (project.links.live)
    el.append(
      link(
        project.category === "websites" ? "Visit website" : "View live project",
        project.links.live,
      ),
    );
  if (project.links.caseStudy)
    el.append(link("Read case study", project.links.caseStudy));
  const button = node("button", "", "Project details");
  button.type = "button";
  button.setAttribute("aria-label", `Project details: ${project.title}`);
  button.onclick = () => openProject(project, button);
  el.append(button);
  return el;
}
function render(): void {
  const query = search.value.trim().toLocaleLowerCase();
  let list = projects.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      [p.title, p.summary, ...p.stack, ...p.roles]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
  );
  if (sort.value === "newest") list.sort((a, b) => b.year - a.year);
  if (sort.value === "title")
    list.sort((a, b) => a.title.localeCompare(b.title));
  const fragment = document.createDocumentFragment();
  list.forEach((project, index) => {
    const card = node(
      "article",
      `work-card${index === 0 && category === "all" && !query && sort.value === "featured" ? " work-featured" : ""}`,
    );
    const media = node("a", "work-media");
    media.href =
      project.links.caseStudy ||
      project.links.live ||
      project.links.repo ||
      "#";
    media.setAttribute(
      "aria-label",
      `${project.title}: ${project.links.caseStudy ? "read case study" : project.links.live ? "view live project" : "view source"}`,
    );
    if (
      media.href.startsWith("http") &&
      new URL(media.href).origin !== location.origin
    ) {
      media.target = "_blank";
      media.rel = "noopener noreferrer";
    }
    if (media.getAttribute("href") === "#") {
      media.onclick = (e) => {
        e.preventDefault();
        openProject(project, media);
      };
      media.setAttribute("aria-label", `${project.title}: project details`);
    }
    media.append(image(project));
    const info = node("div", "work-info"),
      meta = node("div", "work-meta");
    meta.append(
      node("span", "", categoryNames[project.category]),
      node("span", "", String(project.year)),
    );
    info.append(
      meta,
      node("h2", "work-title", project.title),
      node("p", "work-summary", project.summary),
    );
    const stack = node("div", "work-stack");
    project.stack.slice(0, 4).forEach((s) => stack.append(node("span", "", s)));
    info.append(stack, actions(project));
    card.append(media, info);
    fragment.append(card);
  });
  grid.replaceChildren(fragment);
  grid.setAttribute("aria-busy", "false");
  empty.hidden = list.length > 0;
  count.textContent = `${list.length} ${list.length === 1 ? "project" : "projects"}${category === "all" ? "" : " in " + (category === "websites" ? "Websites" : categoryNames[category as Category])}`;
  document
    .querySelectorAll<HTMLButtonElement>("[data-filter]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === category),
      ),
    );
}
function openProject(project: Project, trigger: HTMLElement): void {
  opener = trigger;
  element("modal-title").textContent = project.title;
  const body = node("div", "work-dialog-body");
  const main = image(project);
  main.classList.add("work-dialog-photo");
  body.append(main);
  if (project.gallery.length > 1) {
    const gallery = node("div", "work-gallery");
    project.gallery.forEach((src, index) => {
      const btn = node("button");
      btn.type = "button";
      btn.setAttribute(
        "aria-label",
        `View image ${index + 1} of ${project.gallery.length}`,
      );
      btn.setAttribute("aria-pressed", String(index === 0));
      const thumb = node("img");
      thumb.src = src;
      thumb.alt = "";
      thumb.loading = "lazy";
      btn.append(thumb);
      btn.onclick = () => {
        if (main instanceof HTMLImageElement) main.src = src;
        gallery
          .querySelectorAll("button")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      };
      gallery.append(btn);
    });
    body.append(gallery);
  }
  body.append(node("p", "", project.summary));
  if (project.roles.length)
    body.append(
      node("p", "work-role", `My role: ${project.roles.join(" · ")}`),
    );
  if (project.highlights.length) {
    body.append(node("h3", "", "What I built"));
    const ul = node("ul");
    project.highlights.forEach((s) => ul.append(node("li", "", s)));
    body.append(ul);
  }
  body.append(
    node("h3", "", "Technology"),
    node("p", "", project.stack.join(" · ")),
  );
  const urls = actions(project);
  urls.querySelector("button")?.remove();
  if (project.links.repo) urls.append(link("View source", project.links.repo));
  body.append(urls);
  modalBody.replaceChildren(body);
  dialog.showModal();
  dialog.scrollTop = 0;
  element("close-modal").focus();
  history.replaceState(null, "", `#project-${project.id}`);
}
function closeProject(): void {
  dialog.close();
}
element("close-modal").onclick = closeProject;
dialog.addEventListener("close", () => {
  history.replaceState(null, "", location.pathname + location.search);
  opener?.focus();
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      closeProject();
  }
});
document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach(
  (button) =>
    (button.onclick = () => {
      category = button.dataset.filter || "all";
      render();
    }),
);
search.addEventListener("input", render);
sort.addEventListener("change", render);
element("reset-filters").onclick = () => {
  category = "all";
  search.value = "";
  sort.value = "featured";
  render();
  search.focus();
};
async function load(): Promise<void> {
  grid.setAttribute("aria-busy", "true");
  errorPanel.hidden = true;
  count.textContent = "Loading projects…";
  try {
    const response = await fetch("projects.json?v=3");
    if (!response.ok) throw new Error("Project load failed");
    const raw: unknown = await response.json();
    if (!Array.isArray(raw)) throw new Error("Invalid project data");
    projects = raw.map(normalize).filter((p) => p.id && p.title);
    render();
    const id = location.hash.replace("#project-", "");
    const project = projects.find((p) => p.id === id);
    if (project) openProject(project, search);
  } catch {
    grid.replaceChildren();
    grid.setAttribute("aria-busy", "false");
    count.textContent = "";
    empty.hidden = true;
    errorPanel.hidden = false;
  }
}
element("retry-projects").onclick = () => {
  void load();
};
void load();
