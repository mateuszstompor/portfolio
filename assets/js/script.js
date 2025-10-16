
(function(){
    /* -------- Parallax -------- */
    const parallaxSections = Array.from(document.querySelectorAll('.parallax'));
    const isDisabled = () => window.innerWidth < 768;
    const items = parallaxSections.map(section => {
    const bg = section.querySelector('.bg');
    const speed = parseFloat(section.dataset.speed) || 0.5;
    return { section, bg, speed };
    });
    let ticking = false;
    function updateParallax(){
    ticking = false;
    if (isDisabled()){
        items.forEach(it => it.bg.style.transform = 'translate3d(0,0,0)');
        return;
    }
    for (const it of items){
        const rect = it.section.getBoundingClientRect();
        const y = rect.top * it.speed;
        it.bg.style.transform = `translate3d(0, ${y}px, 0)`;
    }
    }
    function onScroll(){ if(!ticking){requestAnimationFrame(updateParallax); ticking = true;} }
    updateParallax();
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll, {passive:true});

    /* -------- Lightbox/Gallery -------- */
    const gallery = Array.from(document.querySelectorAll('.gallery-grid .tile'));
    const lightbox = document.getElementById('lightbox');
    const lbImage = document.getElementById('lb-image');
    const lbTitle = document.getElementById('lb-title');
    const lbDesc = document.getElementById('lb-desc');
    let currentIndex = 0;

    // simple metadata for each tile (replace titles/descriptions as needed)
    const itemsMeta = gallery.map((el, idx) => {
    const img = el.querySelector('img');
    return {
        src: img.src,
        alt: img.alt || `Project ${idx+1}`,
        title: el.querySelector('.meta')?.textContent || `Project ${idx+1}`,
        desc: 'Short description of the project. Replace with your own text.'
    };
    });

    function openLightbox(index){
    currentIndex = index;
    const meta = itemsMeta[index];
    lbImage.src = meta.src;
    lbImage.alt = meta.alt;
    lbTitle.textContent = meta.title;
    lbDesc.textContent = meta.desc;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    // trap focus:
    lightbox.focus();
    }
    function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    lbImage.src = '';
    }
    function showNext(){
    currentIndex = (currentIndex + 1) % itemsMeta.length;
    openLightbox(currentIndex);
    }
    function showPrev(){
    currentIndex = (currentIndex - 1 + itemsMeta.length) % itemsMeta.length;
    openLightbox(currentIndex);
    }

    gallery.forEach((tile, i) => {
    tile.addEventListener('click', () => openLightbox(i));
    tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); } });
    });

    document.getElementById('close').addEventListener('click', closeLightbox);
    document.getElementById('next').addEventListener('click', showNext);
    document.getElementById('prev').addEventListener('click', showPrev);

    // Close when clicking backdrop
    lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    }
    });

    /* -------- Contact Form (mock) -------- */
    const form = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-msg');
    form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMsg.style.display = 'none';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
        showFormMessage('Please fill out all fields.', true);
        return;
    }
    if (!validateEmail(email)){
        showFormMessage('Please enter a valid email address.', true);
        return;
    }
    // Mock send: display success message. Replace with real API call if needed.
    showFormMessage('Thanks! Your message was sent (mock). I will get back to you soon.');
    form.reset();
    });
    function showFormMessage(text, isError){
    formMsg.style.display = 'block';
    formMsg.style.color = isError ? '#ff7b7b' : 'var(--accent)';
    formMsg.textContent = text;
    setTimeout(()=>{ formMsg.style.display = 'none'; }, 6000);
    }
    function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* -------- CV links: notify user to replace file if missing -------- */
    const cvLinks = [document.getElementById('download-cv'), document.getElementById('view-cv'), document.getElementById('cv-ref'), document.getElementById('cv-link')];
    cvLinks.forEach(a => {
    if (!a) return;
    // If the href is the demo resume path (resume.pdf) show tooltip hint or intercept
    const href = a.getAttribute('href') || '';
    if (href.includes('resume.pdf')) {
        a.addEventListener('click', (e) => {
        // allow actual navigation, but show a small notice
        // (You can remove this if you add a real resume file)
        console.info('Resume link clicked. Replace "resume.pdf" with your actual resume file.');
        });
    }
    });

    // small accessibility: focus lightbox on open
    lightbox.tabIndex = -1;

})();