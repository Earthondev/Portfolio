(() => {
  /* ============================================================
     Portfolio Animations
     - Lenis smooth scroll
     - GSAP text reveal (line-by-line, cinematic)
     - Custom circular cursor
     - Magnetic buttons / headings
     ============================================================ */

  /* ── 1. Lenis smooth scroll ─────────────────────────────── */
  function initLenis() {
    if (typeof Lenis === "undefined") return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== "undefined" && gsap.ticker) {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    window._lenis = lenis;
    return lenis;
  }

  /* ── 2. GSAP Text Reveal ────────────────────────────────── */
  function splitLines(element) {
    // Walk only TEXT nodes so child elements (e.g. span.lux-underline) are preserved
    const wordInners = [];

    function walkNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (part.trim()) {
            const wrap = document.createElement("span");
            wrap.className = "word-wrap";
            wrap.style.cssText =
              "overflow:hidden;display:inline-block;vertical-align:bottom;";
            const inner = document.createElement("span");
            inner.className = "word-inner";
            inner.style.cssText = "display:inline-block;";
            inner.textContent = part;
            wrap.appendChild(inner);
            frag.appendChild(wrap);
            wordInners.push(inner);
          } else if (part) {
            frag.appendChild(document.createTextNode(part));
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recurse into child elements (e.g. span.lux-underline)
        Array.from(node.childNodes).forEach(walkNode);
      }
    }

    Array.from(element.childNodes).forEach(walkNode);
    return wordInners;
  }

  function initTextReveal() {
    if (typeof gsap === "undefined") return;

    // [data-reveal] elements — animate on scroll
    const revealEls = document.querySelectorAll("[data-reveal]");
    revealEls.forEach((el) => {
      const words = splitLines(el);
      const delay = parseFloat(el.dataset.revealDelay || 0);

      gsap.set(words, { y: "110%", opacity: 0 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            gsap.to(words, {
              y: "0%",
              opacity: 1,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.045,
              delay,
            });
            observer.unobserve(el);
          });
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
    });

    // [data-reveal-hero] — split + hide only. Animation fires via triggerHeroReveal()
    // (called from each page's curtain onStart). Fallback at 3.5s if curtain never fires.
    const heroEls = document.querySelectorAll("[data-reveal-hero]");
    heroEls.forEach((el) => {
      const words = splitLines(el);
      gsap.set(words, { y: "110%", opacity: 0 });
      el._heroWords = Array.from(words);
      el._heroAnimated = false;
    });

    // Fade-up blocks [data-fade]
    const fadeEls = document.querySelectorAll("[data-fade]");
    fadeEls.forEach((el) => {
      const delay = parseFloat(el.dataset.fadeDelay || 0);
      gsap.set(el, { opacity: 0, y: 28 });
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
              delay,
            });
            observer.unobserve(el);
          });
        },
        { threshold: 0.12 },
      );
      observer.observe(el);
    });
  }

  /* ── 3. Custom Cursor ───────────────────────────────────── */
  function initCursor() {
    // Skip on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const cursor = document.createElement("div");
    cursor.id = "lux-cursor";
    cursor.innerHTML = '<div class="lux-cursor-dot"></div>';
    document.body.appendChild(cursor);

    const follower = document.createElement("div");
    follower.id = "lux-cursor-ring";
    document.body.appendChild(follower);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = "1";
        follower.style.opacity = "1";
      }
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      follower.style.opacity = "0";
      isVisible = false;
    });

    // Lerp ring to mouse
    function lerp(a, b, n) {
      return (1 - n) * a + n * b;
    }

    function loop() {
      ringX = lerp(ringX, mouseX, 0.18);
      ringY = lerp(ringY, mouseY, 0.18);

      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      follower.style.transform = `translate(${ringX}px, ${ringY}px)`;

      requestAnimationFrame(loop);
    }
    loop();

    // State changes
    const clickTargets =
      'a, button, [data-magnetic], input, textarea, select, label, [role="button"], [type="submit"]';

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(clickTargets)) {
        cursor.classList.add("is-hovering");
        follower.classList.add("is-hovering");
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(clickTargets)) {
        cursor.classList.remove("is-hovering");
        follower.classList.remove("is-hovering");
      }
    });

    document.addEventListener("mousedown", (e) => {
      cursor.classList.add("is-clicking");
      follower.classList.add("is-clicking");
    });
    document.addEventListener("mouseup", () => {
      cursor.classList.remove("is-clicking");
      follower.classList.remove("is-clicking");
    });
  }

  /* ── 4. Magnetic Effect ─────────────────────────────────── */
  function initMagnetic() {
    if (window.matchMedia("(hover: none)").matches) return;

    const targets = document.querySelectorAll("[data-magnetic]");
    targets.forEach((el) => {
      const strength = parseFloat(el.dataset.magneticStrength || 0.35);

      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.transition = "transform 0.15s ease";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
        el.style.transition = "transform 0.55s cubic-bezier(0.19,1,0.22,1)";
      });
    });
  }

  /* ── 5. Page transition overlay ────────────────────────── */
  function initPageTransitions() {
    const overlay = document.createElement("div");
    overlay.id = "page-transition-overlay";
    document.body.appendChild(overlay);

    // Reveal on load — double rAF ensures browser paints overlay first, then transitions it away
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add("is-leaving");
      });
    });

    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("http") ||
        link.target === "_blank"
      )
        return;

      link.addEventListener("click", (e) => {
        e.preventDefault();
        overlay.classList.remove("is-leaving");
        overlay.classList.add("is-entering");

        setTimeout(() => {
          window.location.href = href;
        }, 420);
      });
    });
  }

  /* ── 6. Nav link rolling hover (Jasmine-style) ──────────── */
  function initNavHover() {
    if (window.matchMedia("(hover: none)").matches) return;

    // Target all desktop nav links (not logo, not CTA button)
    const navLinks = document.querySelectorAll(
      "nav .hidden.md\\:flex a, nav #nav-right a",
    );

    navLinks.forEach((link) => {
      const original = link.textContent.trim();
      if (!original) return;

      // Wrap each char in two spans: visible + hover clone
      link.innerHTML = `<span class="nav-roll-inner" aria-hidden="true">${original
        .split("")
        .map(
          (c) =>
            `<span class="nav-roll-char"><span class="nav-roll-top">${c === " " ? "&nbsp;" : c}</span><span class="nav-roll-btm">${c === " " ? "&nbsp;" : c}</span></span>`,
        )
        .join("")}</span><span class="sr-only">${original}</span>`;

      // Stagger each char on enter/leave
      const chars = link.querySelectorAll(".nav-roll-char");

      link.addEventListener("mouseenter", () => {
        chars.forEach((ch, i) => {
          ch.style.transitionDelay = `${i * 22}ms`;
          ch.classList.add("nav-roll-active");
        });
      });

      link.addEventListener("mouseleave", () => {
        chars.forEach((ch, i) => {
          ch.style.transitionDelay = `${i * 16}ms`;
          ch.classList.remove("nav-roll-active");
        });
      });
    });
  }

  /* ── 7. Split-text vertical hover (Jasmine hero style) ───── */
  function initSplitHover() {
    if (window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll("[data-split-hover]").forEach((el) => {
      const original = el.textContent.trim();
      const dur = parseInt(el.dataset.splitDuration || 420);
      const ease = el.dataset.splitEase || "cubic-bezier(0.22,1,0.36,1)";

      el.innerHTML = `<span class="sh-inner" aria-hidden="true">${original
        .split("")
        .map((c) => {
          const ch = c === " " ? "&nbsp;" : c;
          return `<span class="sh-char"><span class="sh-top">${ch}</span><span class="sh-btm">${ch}</span></span>`;
        })
        .join("")}</span><span class="sr-only">${original}</span>`;

      el.querySelectorAll(".sh-char").forEach((ch) => {
        const top = ch.querySelector(".sh-top");
        const btm = ch.querySelector(".sh-btm");
        const t = `transform ${dur}ms ${ease}`;
        top.style.transition = t;
        btm.style.transition = t;

        ch.addEventListener("mouseenter", () => {
          top.style.transitionDelay = "0ms";
          btm.style.transitionDelay = "0ms";
          ch.classList.add("sh-active");
        });
        ch.addEventListener("mouseleave", () => {
          top.style.transitionDelay = "0ms";
          btm.style.transitionDelay = "0ms";
          ch.classList.remove("sh-active");
        });
      });
    });
  }

  /* ── 6b. Text Scramble on hover ─────────────────────────── */
  function scrambleText(el) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";
    const original = el.dataset.scrambleText || el.textContent.trim();
    el.dataset.scrambleText = original;

    let frame = 0;
    let raf;
    const totalFrames = 20;

    function tick() {
      const progress = frame / totalFrames;
      el.textContent = original
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < Math.floor(progress * original.length)) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      frame++;
      if (frame <= totalFrames) {
        raf = requestAnimationFrame(tick);
      } else {
        el.textContent = original;
      }
    }

    cancelAnimationFrame(raf);
    frame = 0;
    tick();
  }

  function initScramble() {
    document
      .querySelectorAll("a.group span.font-heading, [data-scramble]")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => scrambleText(el));
      });
  }

  /* ── 8. triggerHeroReveal — called from each page's curtain onStart ─── */
  function triggerHeroReveal() {
    if (typeof gsap === "undefined") return;
    window._heroRevealFired = true;

    // 1. Animate [data-reveal-hero] word spans
    document.querySelectorAll("[data-reveal-hero]").forEach((el, i) => {
      if (el._heroAnimated) return;
      el._heroAnimated = true;
      const words =
        el._heroWords || Array.from(el.querySelectorAll(".word-inner"));
      if (!words.length) return;
      const delay = parseFloat(el.dataset.revealDelay || i * 0.1);
      gsap.to(words, {
        y: "0%",
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.04,
        delay,
      });
    });

    // 2. hero-stagger children (home page hero column)
    const stagger = document.querySelector(".hero-stagger");
    if (stagger) {
      const children = Array.from(stagger.children);
      children.forEach((child) => {
        child.style.animation = "none";
      });
      gsap.set(children, { opacity: 0, y: 28 });
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.05,
        clearProps: "transform",
      });
    }
  }

  /* ── 9. Mobile-specific enhancements ───────────────────── */
  function initMobileFX() {
    if (!("ontouchstart" in window)) return;
    if (typeof gsap === "undefined") return;

    // Ripple effect on press for interactive cards
    const rippleTargets =
      'a.contact-action, .premium-cta, button[type="submit"]';
    document.querySelectorAll(rippleTargets).forEach((el) => {
      el.addEventListener(
        "touchstart",
        (e) => {
          const touch = e.touches[0];
          const rect = el.getBoundingClientRect();
          const ripple = document.createElement("span");
          const size = Math.max(rect.width, rect.height) * 2;
          ripple.style.cssText = [
            `position:absolute`,
            `border-radius:50%`,
            `background:rgba(255,255,255,0.18)`,
            `width:${size}px`,
            `height:${size}px`,
            `left:${touch.clientX - rect.left - size / 2}px`,
            `top:${touch.clientY - rect.top - size / 2}px`,
            `pointer-events:none`,
            `transform:scale(0)`,
            `opacity:1`,
            `transition:transform 0.5s ease, opacity 0.4s ease`,
          ].join(";");
          // Ensure parent has relative positioning
          if (getComputedStyle(el).position === "static")
            el.style.position = "relative";
          el.style.overflow = "hidden";
          el.appendChild(ripple);
          requestAnimationFrame(() => {
            ripple.style.transform = "scale(1)";
            ripple.style.opacity = "0";
          });
          setTimeout(() => ripple.remove(), 600);
        },
        { passive: true },
      );
    });

    // Add subtle entrance animation to cert/project cards on mobile
    // (enhances the default fade-up to also scale in)
    const cards = document.querySelectorAll(".cert-card, .project-row");
    if (cards.length) {
      const cardObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el._mobileEntered) return;
            el._mobileEntered = true;
            gsap.fromTo(
              el,
              { scale: 0.96, opacity: 0, y: 18 },
              { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            );
            cardObs.unobserve(el);
          });
        },
        { threshold: 0.1 },
      );

      cards.forEach((card) => {
        // Only if not already animated by another system
        if (!card.classList.contains("fade-up")) {
          gsap.set(card, { opacity: 0, y: 18, scale: 0.96 });
          cardObs.observe(card);
        }
      });
    }
  }

  /* ── Init all ───────────────────────────────────────────── */
  function init() {
    initLenis();
    initCursor();
    initMagnetic();
    initTextReveal();
    initPageTransitions();
    initScramble();
    initNavHover();
    initSplitHover();
    initMobileFX();

    // Safety fallback: if curtain never fires triggerHeroReveal, auto-reveal at 3.5s
    if (typeof gsap !== "undefined") {
      gsap.delayedCall(3.5, () => {
        if (!window._heroRevealFired) triggerHeroReveal();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.PortfolioAnimations = {
    initTextReveal,
    initMagnetic,
    initCursor,
    scrambleText,
    initScramble,
    initNavHover,
    initSplitHover,
    triggerHeroReveal,
  };
})();
