/**
 * Mercy Olufunke Adekunle — Video Production Studio
 * Responsive, Cross-Device Optimized Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initComparisonSlider();
  initPortfolioSlider();
  initVideoModal();
  initContactForm();
  initToast();
  initFramerAnimations();
});

/* ==========================================================================
   1. Clean Navigation & Mobile Drawer with Accessibility
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle') || document.querySelector('.mobile-toggle');
  const navLinks = document.getElementById('primaryNav') || document.querySelector('.nav-links');
  const navOverlay = document.getElementById('navOverlay');
  const navItems = document.querySelectorAll('.nav-link, .nav-drawer-actions a');

  // Elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  const closeMenu = () => {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  };

  const openMenu = () => {
    if (!navLinks) return;
    navLinks.classList.add('open');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.classList.add('menu-open');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'true');
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-xmark';
    }
  };

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when tapping outside on overlay
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }

    // Close on link click
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });

    // Auto-close if screen resized above mobile breakpoint (1024px)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && navLinks.classList.contains('open')) {
        closeMenu();
      }
    }, { passive: true });
  }

  // Active section indicator
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
}

/* ==========================================================================
   2. Interactive Color Grading Before & After Slider (Touch & Pointer)
   ========================================================================== */
function initComparisonSlider() {
  const container = document.querySelector('.comparison-container');
  const beforeWrapper = document.querySelector('.img-before-wrapper');
  const handle = document.querySelector('.slider-handle');

  if (!container || !beforeWrapper || !handle) return;

  let isDragging = false;

  const setSliderPosition = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    beforeWrapper.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Events for Mobile & Tablet
  container.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      setSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Portfolio Video Slider (Touch, Drag, Navigation & Hover Preview)
   ========================================================================== */
function initPortfolioSlider() {
  const slider = document.getElementById('portfolioSlider');
  const prevBtn = document.getElementById('portfolioPrev');
  const nextBtn = document.getElementById('portfolioNext');
  const dotsContainer = document.getElementById('sliderDots');

  if (!slider) return;

  const slides = slider.querySelectorAll('.portfolio-slide');
  if (!slides.length) return;

  // Generate pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to video slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        slides[idx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Update active dot and arrow states on scroll
  const updateSliderState = () => {
    const scrollLeft = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      let activeIndex = 0;
      let minDistance = Infinity;

      slides.forEach((slide, idx) => {
        const slideOffset = slide.offsetLeft - slider.offsetLeft;
        const dist = Math.abs(slideOffset - scrollLeft);
        if (dist < minDistance) {
          minDistance = dist;
          activeIndex = idx;
        }
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
    }

    // Update arrows
    if (prevBtn) prevBtn.disabled = scrollLeft <= 10;
    if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 10;
  };

  slider.addEventListener('scroll', updateSliderState, { passive: true });
  updateSliderState();

  // Arrow buttons click
  const getScrollStep = () => {
    const firstSlide = slides[0];
    return firstSlide ? (firstSlide.offsetWidth + 24) : 320;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });
  }

  // Mouse Drag to Scroll (Desktop)
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let hasDragged = false;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    hasDragged = false;
    slider.classList.add('is-dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollStart = slider.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove('is-dragging');
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDragged = true;
    }
    slider.scrollLeft = scrollStart - walk;
  });

  // Prevent accidental modal open when dragging
  slides.forEach(slide => {
    slide.addEventListener('click', (e) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  });

  // Desktop Hover Video Preview (Muted)
  slides.forEach(slide => {
    const video = slide.querySelector('video');
    if (!video) return;

    slide.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    });

    slide.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) {
        video.pause();
        video.currentTime = 0;
      }
    });
  });
}

/* ==========================================================================
   4. Video Modal Player (Mobile-Responsive & Scroll-Locking)
   ========================================================================== */
const projectData = {
  reel1: {
    title: "Featured Video Production & Editing Showcase",
    tools: "CapCut Pro • DaVinci Resolve • Premiere Pro",
    desc: "A high-impact video production and editing showcase highlighting dynamic pacing, color grading, and viral retention storytelling.",
    videoSrc: "1101.mp4",
    poster: "",
    isVertical: true
  },
  video1: {
    title: "Featured Motion & Dynamic Rhythm Cut",
    tools: "CapCut Pro • DaVinci Resolve",
    desc: "High-retention vertical visual edit featuring kinetic pacing, auto-caption typography, and beat-synced rhythm.",
    videoSrc: "1101.mp4",
    poster: "",
    isVertical: true
  },
  video2: {
    title: "Cinematic 4K Visual Narrative",
    tools: "4K Ultra HD • Color Grade",
    desc: "Ultra HD portrait production showcasing seamless transitions, advanced color correction, and narrative pacing.",
    videoSrc: "1020(1).MP4",
    poster: "",
    isVertical: true
  },
  video3: {
    title: "Creative Social Campaign & Visual Hook",
    tools: "Social Edit • Hook Optimization",
    desc: "Punchy short-form storytelling engineered with rapid hook pacing, audio synchronization, and high-energy transitions.",
    videoSrc: "WhatsApp Video 2026-11-01 at 2.13.29 PM.mp4",
    poster: "",
    isVertical: true
  },
  video4: {
    title: "Widescreen Commercial & Brand Cut",
    tools: "16:9 Widescreen • Commercial Master",
    desc: "16:9 widescreen commercial edit showcasing balanced contrast, audio mastering, and scene pacing.",
    videoSrc: "WhatsApp Video 2026-11-01 at 2.17.15 PM.mp4",
    poster: "",
    isVertical: false
  },
  video5: {
    title: "Vertical Short-Form & Sound Design Edit",
    tools: "Sound FX Layering • Velocity Sync",
    desc: "Dynamic mobile-first edit engineered with layered sound effects, velocity ramping, and retention hooks.",
    videoSrc: "WhatsApp Video 2026-11-01 at 2.58.59 PM.mp4",
    poster: "",
    isVertical: true
  },
  video6: {
    title: "Fast-Paced Motion & Rhythm Cut",
    tools: "Match Cuts • Motion Pacing",
    desc: "High-tempo vertical edit with split-second match cuts, audio beat snapping, and visual styling.",
    videoSrc: "WhatsApp Video 2026-11-01 at 2.59.39 PM.mp4",
    poster: "",
    isVertical: true
  }
};

function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const videoElem = document.getElementById('modalVideo');
  const titleElem = document.getElementById('modalTitle');
  const metaElem = document.getElementById('modalMeta');
  const container = document.querySelector('.modal-video-container');

  if (!modal || !videoElem) return;

  // Open modal
  document.querySelectorAll('[data-video-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-video-id');
      const project = projectData[id] || projectData.reel1;

      if (titleElem) titleElem.textContent = project.title;
      if (metaElem) metaElem.textContent = project.tools || "";
      
      videoElem.src = project.videoSrc;
      if (project.poster) {
        videoElem.poster = project.poster;
      } else {
        videoElem.removeAttribute('poster');
      }
      
      if (container) {
        if (project.isVertical) {
          container.classList.add('vertical');
        } else {
          container.classList.remove('vertical');
        }
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
      videoElem.play().catch(() => {});
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    videoElem.pause();
    videoElem.src = "";
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. Contact Form & Clipboard Copy
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = `<span>Sending Enquiry...</span>`;
      submitBtn.disabled = true;

      // Simulate sending enquiry
      setTimeout(() => {
        submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Enquiry Received</span>`;
        submitBtn.style.backgroundColor = "#171717";
        
        showToast("Thank you for your enquiry. We will respond within a few hours.");
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = "";
        }, 4000);
      }, 900);
    });
  }

  // Copy Email Button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = "mercyolufunkeadekunle@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast("Email address copied to clipboard: " + email);
      }).catch(() => {
        showToast("Email: " + email);
      });
    });
  }
}

/* ==========================================================================
   6. Toast Notification Utility
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;

  const msgSpan = toast.querySelector('.toast-message');
  if (msgSpan) msgSpan.textContent = message;

  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function initToast() {
  // Ready
}

/* ==========================================================================
   7. Framer-Grade Scroll Reveal Animation System
   ========================================================================== */
function initFramerAnimations() {
  const animatedElements = document.querySelectorAll('[data-framer]');
  if (!animatedElements.length) return;

  // Stagger delays calculation for child cards & pillars
  document.querySelectorAll('[data-framer="stagger"]').forEach(container => {
    Array.from(container.children).forEach((child, index) => {
      child.style.transitionDelay = `${(index * 0.1) + 0.05}s`;
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('framer-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // Trigger hero elements immediately on load for instant fluid feel
  setTimeout(() => {
    document.querySelectorAll('#home [data-framer]').forEach(el => {
      el.classList.add('framer-visible');
    });
  }, 60);
}
