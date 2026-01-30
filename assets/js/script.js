(function () {
  /* -------- Parallax -------- */
  const parallaxSections = Array.from(document.querySelectorAll(".parallax"));
  const isDisabled = () => window.innerWidth < 768;
  const items = parallaxSections.map((section) => {
    const bg = section.querySelector(".bg");
    const speed = parseFloat(section.dataset.speed) || 0.5;
    return { section, bg, speed };
  });
  let ticking = false;
  function updateParallax() {
    ticking = false;
    if (isDisabled()) {
      items.forEach((it) => (it.bg.style.transform = "translate3d(0,0,0)"));
      return;
    }
    for (const it of items) {
      const rect = it.section.getBoundingClientRect();
      const y = rect.top * it.speed;
      it.bg.style.transform = `translate3d(0, ${y}px, 0)`;
    }
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* -------- Lightbox/Gallery -------- */
  const gallery = Array.from(document.querySelectorAll(".gallery-grid .tile"));
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lb-image");
  const lbTitle = document.getElementById("lb-title");
  const lbDesc = document.getElementById("lb-desc");
  const lbCounter = document.getElementById("lb-counter");
  const lbTags = document.getElementById("lb-tags");
  const lbRepo = document.getElementById("lb-repo");
  let currentIndex = 0;

  const itemsMeta = gallery.map((el, idx) => {
    const img = el.querySelector("img");
    return {
      src: img.src,
      alt: img.alt || `Project ${idx + 1}`,
      title: el.querySelector(".meta")?.textContent || `Project ${idx + 1}`,
      desc:
        el.querySelector(".description")?.textContent ||
        "Short description of the project. Replace with your own text.",
      repo: el.dataset.repo || "",
      tags: el.dataset.tags ? el.dataset.tags.split(",") : [],
    };
  });

  function openLightbox(index) {
    currentIndex = index;
    const meta = itemsMeta[index];
    lbImage.src = meta.src;
    lbImage.alt = meta.alt;
    lbTitle.textContent = meta.title;
    lbDesc.textContent = meta.desc;
    lbCounter.textContent = `${index + 1} / ${itemsMeta.length}`;
    lbTags.innerHTML = meta.tags
      .map((t) => `<span class="skill">${t}</span>`)
      .join("");
    if (meta.repo) {
      lbRepo.href = meta.repo;
      lbRepo.style.display = "inline-flex";
    } else {
      lbRepo.style.display = "none";
    }
    document.body.classList.add("lb-open");
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    lightbox.focus();
  }
  function closeLightbox() {
    document.body.classList.remove("lb-open");
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lbImage.src = "";
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % itemsMeta.length;
    openLightbox(currentIndex);
  }
  function showPrev() {
    currentIndex = (currentIndex - 1 + itemsMeta.length) % itemsMeta.length;
    openLightbox(currentIndex);
  }

  gallery.forEach((tile, i) => {
    tile.addEventListener("click", () => openLightbox(i));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  document.getElementById("close").addEventListener("click", closeLightbox);
  document.getElementById("next").addEventListener("click", showNext);
  document.getElementById("prev").addEventListener("click", showPrev);

  // Close when clicking backdrop
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("open")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
  });

  // small accessibility: focus lightbox on open
  lightbox.tabIndex = -1;

  const textEl = document.getElementById("text");
  const cursor = document.getElementById("cursor");
  const thinking = document.getElementById("thinking");

  const first =
    "GPU shaders, 3D engines, and video tools — built from scratch.";
  const second = "From IBM's data warehouses to MotionVFX's creative pipeline.";
  const third =
    "Red Hat Certified Architect. M.Sc. Computer Science. Based in Cracow, Poland.";
  const TYPING_SPEED = 70;

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function setCursor(state) {
    cursor.classList.remove("active", "delete", "idle");
    if (state) cursor.classList.add(state);
  }

  async function typeText(text) {
    setCursor("active");
    for (const ch of text) {
      const span = document.createElement("span");
      span.textContent = ch;
      span.className = "char new";
      textEl.appendChild(span);
      requestAnimationFrame(() => span.classList.remove("new"));
      await wait(TYPING_SPEED + Math.random() * 60);
    }
    setCursor("idle");
  }

  async function backspace(count) {
    setCursor("delete");
    for (let i = 0; i < count; i++) {
      const last = textEl.lastChild;
      if (last) {
        last.style.opacity = "0";
        last.style.transform = "scale(0.6)";
        await wait(80);
        last.remove();
      }
    }
    setCursor("idle");
  }

  async function animate() {
    await typeText(first);
    await wait(500);
    thinking.style.visibility = "visible";
    await wait(1000);
    thinking.style.visibility = "hidden";
    await backspace(first.length);
    await wait(400);
    await typeText(second);
    thinking.style.visibility = "visible";
    await wait(1000);
    thinking.style.visibility = "hidden";
    await backspace(first.length);
    await wait(400);
    await typeText(third);
  }

  animate();

  /* -------- Scroll-triggered reveal -------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(".reveal, .reveal-group")
    .forEach((el) => revealObserver.observe(el));

  /* -------- Header scroll behavior -------- */
  const header = document.querySelector("header");
  let lastScrollY = 0;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 40);

      if (window.innerWidth < 768) {
        if (y > lastScrollY && y > 80) {
          header.classList.add("nav-hidden");
        } else {
          header.classList.remove("nav-hidden");
        }
      } else {
        header.classList.remove("nav-hidden");
      }
      lastScrollY = y;
    },
    { passive: true },
  );

  /* -------- Scroll-spy for nav -------- */
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = Array.from(navLinks).map((link) => ({
    link,
    target: document.querySelector(link.getAttribute("href")),
  }));

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const match = sections.find((s) => s.target === entry.target);
        if (match) {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active"));
            match.link.classList.add("active");
          }
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach((s) => {
    if (s.target) spyObserver.observe(s.target);
  });

  /* -------- Konami Code Easter Egg -------- */
  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiIndex = 0;
  window.addEventListener("keydown", (e) => {
    if (e.key === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        document.body.classList.add("konami");
        setTimeout(() => document.body.classList.remove("konami"), 5000);
      }
    } else {
      konamiIndex = e.key === konamiSequence[0] ? 1 : 0;
    }
  });

  /* -------- Hover Tilt on Project Tiles -------- */
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("mouseenter", () => {
      tile.style.transition = "transform 0.15s ease-out";
    });
    tile.addEventListener("mousemove", (e) => {
      const rect = tile.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tile.style.transition = "none";
      tile.style.transform = `perspective(600px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateY(-4px) scale(1.02)`;
    });
    tile.addEventListener("mouseleave", () => {
      tile.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      tile.style.transform = "none";
    });
  });

  /* -------- Text Scramble on Section Headings -------- */
  const scrambleChars = "!@#$%^&*()_+-=[]{}|;:,./<>?";
  const scrambleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scrambleObserver.unobserve(entry.target);
          const el = entry.target;
          const original = el.textContent;
          let iteration = 0;
          const totalIterations = 14;
          function scrambleFrame() {
            el.textContent = original
              .split("")
              .map((ch, i) => {
                if (i < (iteration / totalIterations) * original.length)
                  return ch;
                return scrambleChars[
                  Math.floor(Math.random() * scrambleChars.length)
                ];
              })
              .join("");
            iteration++;
            if (iteration <= totalIterations) {
              setTimeout(scrambleFrame, 30);
            } else {
              el.textContent = original;
            }
          }
          scrambleFrame();
        }
      });
    },
    { threshold: 0.15 },
  );
  document
    .querySelectorAll("h2.reveal")
    .forEach((el) => scrambleObserver.observe(el));

  /* -------- Interactive Skill Tags -------- */
  document.querySelectorAll(".skill").forEach((tag) => {
    tag.addEventListener("click", () => {
      tag.classList.remove("pulse");
      void tag.offsetWidth;
      tag.classList.add("pulse");
      tag.addEventListener(
        "animationend",
        () => tag.classList.remove("pulse"),
        { once: true },
      );
    });
  });

  /* -------- ASCII Art in Console -------- */
  console.log(
    "%c" +
      "    _    ____   ____ _____ ___ ____\n" +
      "   / \\  |  _ \\ / ___|_   _|_ _/ ___|\n" +
      "  / _ \\ | |_) | |     | |  | | |    \n" +
      " / ___ \\|  _ <| |___  | |  | | |___ \n" +
      "/_/   \\_\\_| \\_\\\\____| |_| |___\\____|\n\n" +
      "  arctic.codes — built from scratch\n",
    "color: #5eead4; font-size: 12px; font-family: monospace;",
  );
})();
