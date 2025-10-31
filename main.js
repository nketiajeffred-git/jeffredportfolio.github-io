// Main interactivity: theme toggle, mobile menu, AOS init, Swiper, scrollspy, modal
(function(){
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const yearEl = document.getElementById('year');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle (cycles: light -> dark -> color -> light)
  function setTheme(mode){
    html.classList.remove('dark', 'color-mode');
    if (mode === 'dark') html.classList.add('dark');
    else if (mode === 'color') html.classList.add('color-mode');
    localStorage.setItem('theme', mode);
    updateThemeIcon(mode);
  }
  
  function updateThemeIcon(mode) {
    if (!themeToggle) return;
    const iconSpan = document.getElementById('themeIcon');
    const labelSpan = document.getElementById('themeLabel');
    const iconHtml = mode === 'dark'
      ? '<i class="fa-solid fa-palette"></i>'
      : mode === 'color'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    const labelText = mode === 'dark' ? 'Dark' : mode === 'color' ? 'Color' : 'Light';
    if (iconSpan) iconSpan.innerHTML = iconHtml;
    else themeToggle.innerHTML = iconHtml; // Fallback
    if (labelSpan) labelSpan.textContent = labelText;
    themeToggle.title = `Theme: ${labelText}`;
    themeToggle.setAttribute('aria-label', `Toggle theme (current: ${labelText})`);
  }
  
  if (themeToggle){
    // Initialize icon based on current theme (prefer class on html set by init script)
    const hasDark = html.classList.contains('dark');
    const hasColor = html.classList.contains('color-mode');
    const initialTheme = hasDark ? 'dark' : hasColor ? 'color' : (localStorage.getItem('theme') || 'light');
    updateThemeIcon(initialTheme);
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = localStorage.getItem('theme') || 'light';
      const nextTheme = currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'color' : 'light';
      setTheme(nextTheme);
    });
  }

  // Mobile menu
  if (menuToggle && mobileMenu){
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));
  }

  // AOS
  if (window.AOS) AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

  // Swiper (testimonials)
  if (window.Swiper){
    new Swiper('.swiper', {
      loop: true,
      spaceBetween: 24,
      slidesPerView: 1,
      autoplay: { delay: 3500 },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
  }

  // Scrollspy: highlight current nav link
  const sections = ['about','skills','projects','experience','testimonials','contact'];
  const options = { root: null, rootMargin: '0px', threshold: 0.5 };
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('text-brand-600', l.getAttribute('href') === '#' + id));
      }
    })
  }, options);
  sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });

  // Project modal demo
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const projectTitle = document.getElementById('projectTitle');
  const projectDesc = document.getElementById('projectDesc');
  const projectTags = document.getElementById('projectTags');

  function openModal(title, desc, tags){
    if (!modal) return;
    projectTitle.textContent = title;
    projectDesc.textContent = desc;
    projectTags.innerHTML = '';
    (tags||[]).forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      projectTags.appendChild(span);
    })
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  function closeModal(){ if (!modal) return; modal.classList.add('hidden'); modal.classList.remove('flex'); }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.querySelectorAll('[data-project]')?.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project');
      const data = {
        p1: { title: 'Student Resource Connect (SRC)', desc: 'Comprehensive mobile application designed to connect students with academic resources, events, and campus services. Successfully scaled and adopted by Kumasi Technical University for institutional use. Features include resource sharing, event management, and student networking capabilities.', tags: ['Mobile Dev','Product Management','UI/UX','React Native'] },
        p2: { title: 'ML for Malicious URL Detection', desc: 'Undergraduate research project implementing machine learning algorithms to detect and classify malicious URLs in cybersecurity contexts. Developed predictive models using Python and scikit-learn, achieving high accuracy in identifying phishing and malware distribution sites. Case study conducted at KSTU.', tags: ['Python','Machine Learning','Cybersecurity','Data Science'] },
        p3: { title: 'Hotel Booking System', desc: 'Full-stack web application developed for White House Hostel providing comprehensive booking management, room availability tracking, payment processing, and customer management features. Delivered as a customized digital solution meeting specific client requirements.', tags: ['Web Dev','Database','Full Stack','PHP/MySQL'] },
        p4: { title: 'QR Code Attendance Tracker', desc: 'Real-time digital attendance management system utilizing QR code technology. Successfully deployed for the KSTU-GSDF Sustainable Environment Campaign 2025, tracking participation of over 50 attendees with automated check-in, reporting, and analytics features.', tags: ['QR Technology','Web App','Real-time','JavaScript'] },
        p5: { title: 'SEL Academic Performance Prediction', desc: 'Research project predicting the impact of Social and Emotional Learning (SEL) on student academic performance using statistical analysis and predictive modeling. Applied data science techniques to identify key factors influencing educational outcomes.', tags: ['Data Science','Predictive Analytics','Research','Statistical Analysis'] }
      };
      const item = data[id] || { title: 'Project', desc: 'Details coming soon.', tags: [] };
      openModal(item.title, item.desc, item.tags);
    });
  });
})();
