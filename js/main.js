/* ============================================================
   ADVENTUREBEACHES.COM — Main JavaScript
   Interactivity, animations, and mobile nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile Navigation ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const navMobileLinks = document.querySelectorAll('.nav-mobile a');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    navMobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Header scroll effect ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset;
      if (currentScroll > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ---------- FAQ Accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        // Close all others
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('active');
          var otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* ---------- Scroll reveal (Intersection Observer) ---------- */
  var fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---------- Parallax on hero (subtle) ---------- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scrolled * 0.25) + 'px)';
      }
    }, { passive: true });
  }

  /* ---------- Coastline horizontal scroll drag ---------- */
  var coastlineScroll = document.querySelector('.coastline-scroll');
  if (coastlineScroll) {
    var isDown = false;
    var startX;
    var scrollLeft;

    coastlineScroll.addEventListener('mousedown', function (e) {
      isDown = true;
      coastlineScroll.style.cursor = 'grabbing';
      startX = e.pageX - coastlineScroll.offsetLeft;
      scrollLeft = coastlineScroll.scrollLeft;
    });

    coastlineScroll.addEventListener('mouseleave', function () {
      isDown = false;
      coastlineScroll.style.cursor = 'grab';
    });

    coastlineScroll.addEventListener('mouseup', function () {
      isDown = false;
      coastlineScroll.style.cursor = 'grab';
    });

    coastlineScroll.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - coastlineScroll.offsetLeft;
      var walk = (x - startX) * 1.5;
      coastlineScroll.scrollLeft = scrollLeft - walk;
    });

    coastlineScroll.style.cursor = 'grab';
  }

  /* ---------- Newsletter form handling ---------- */
  var ctaForm = document.querySelector('.cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = ctaForm.querySelector('input[type="email"]');
      var submitBtn = ctaForm.querySelector('button');
      if (emailInput && emailInput.value) {
        submitBtn.textContent = 'Subscribed!';
        submitBtn.style.background = '#3dd68c';
        emailInput.value = '';
        setTimeout(function () {
          submitBtn.textContent = 'Join the Atlas';
          submitBtn.style.background = '';
        }, 3000);
      }
    });
  }

  /* ---------- Animate hero stats counter ---------- */
  function animateCounters() {
    var counters = document.querySelectorAll('.hero-stat-number[data-count]');
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-count'), 10);
      var suffix = counter.getAttribute('data-suffix') || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var current = Math.floor(easeOut(progress) * target);
        counter.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target + suffix;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Trigger counters when hero is visible
  var heroStats = document.querySelector('.hero-stats');
  if (heroStats && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(heroStats);
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  } else if (heroStats) {
    animateCounters();
  }

});
