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
  let currentIndex = 0;

  // simple metadata for each tile (replace titles/descriptions as needed)
  const itemsMeta = gallery.map((el, idx) => {
    const img = el.querySelector("img");
    return {
      src: img.src,
      alt: img.alt || `Project ${idx + 1}`,
      title: el.querySelector(".meta")?.textContent || `Project ${idx + 1}`,
      desc:
        el.querySelector(".description")?.textContent ||
        "Short description of the project. Replace with your own text.",
    };
  });

  function openLightbox(index) {
    currentIndex = index;
    const meta = itemsMeta[index];
    lbImage.src = meta.src;
    lbImage.alt = meta.alt;
    lbTitle.textContent = meta.title;
    lbDesc.textContent = meta.desc;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    // trap focus:
    lightbox.focus();
  }
  function closeLightbox() {
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

  const first = "Where bytes meet beauty — building from the silicon upward.";
  const second = "Designing light, form, and function in motion.";
  const third =
    "Building experiences that feel native to Apple’s soul. Based in Cracow, Poland.";
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
})();
