const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;

const heroImage = document.querySelector('.hero-image');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('.reveal-section');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const typingTitle = document.getElementById('typing-title');

function setupMobileMenu() {
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupSectionReveal() {
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  sections.forEach((section) => observer.observe(section));
}

function setupHeroParallax() {
  if (!heroImage || prefersReducedMotion) return;

  const updateParallax = () => {
    const offset = Math.min(window.scrollY * 0.08, 36);
    heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.03)`;
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
}

function setupTypingTitle() {
  if (!typingTitle) return;

  const titleText = 'Selected Work';
  let index = 0;
  let started = false;

  const type = () => {
    if (index < titleText.length) {
      typingTitle.textContent += titleText.charAt(index);
      index += 1;
      window.setTimeout(type, 72);
    }
  };

  const portfolioSection = document.getElementById('portfolio');
  if (!portfolioSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        type();
      }
    });
  }, { threshold: 0.35 });

  observer.observe(portfolioSection);
}

function setupExpandablePanels() {
  document.querySelectorAll('.expand-arrow').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const panelId = button.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      panel.classList.toggle('expanded', !isExpanded);
    });
  });
}

function initCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const images = Array.from(carousel.querySelectorAll('img'));
  const prevButton = carousel.querySelector('.prev');
  const nextButton = carousel.querySelector('.next');
  if (!images.length) return;

  let currentIndex = 0;

  const showImage = (index) => {
    images.forEach((image, imageIndex) => {
      image.style.display = imageIndex === index ? 'block' : 'none';
    });
  };

  showImage(currentIndex);

  prevButton?.addEventListener('click', (event) => {
    event.preventDefault();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });

  nextButton?.addEventListener('click', (event) => {
    event.preventDefault();
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });
}

function setupCarousels() {
  ['modelling-carousel', 'sports-carousel', 'automotive-carousel', 'others-carousel'].forEach(initCarousel);
}

function setupVideoAvailability() {
  const video = document.getElementById('videography-video');
  const placeholder = document.getElementById('video-placeholder');
  const videoSource = video?.querySelector('source');
  if (!video || !placeholder || !videoSource) return;

  fetch(videoSource.src, { method: 'HEAD' })
    .then((response) => {
      const hasVideo = response.ok;
      video.style.display = hasVideo ? 'block' : 'none';
      placeholder.style.display = hasVideo ? 'none' : 'block';
    })
    .catch(() => {
      video.style.display = 'none';
      placeholder.style.display = 'block';
    });
}

function setupCursor() {
  if (!supportsFinePointer || prefersReducedMotion) return;

  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);
  document.body.classList.add('cursor-active');

  document.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-pressed');
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-pressed');
  });
}

function setupTiltCards() {
  if (!supportsFinePointer || prefersReducedMotion) return;

  const cards = document.querySelectorAll('[data-tilt-card]');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width;
      const offsetY = (event.clientY - rect.top) / rect.height;
      const rotateY = (offsetX - 0.5) * 8;
      const rotateX = (0.5 - offsetY) * 6;
      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -2px, 0)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function setupParticles() {
  if (prefersReducedMotion) return;

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    active: false
  };

  let particles = [];
  let animationFrame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const particleCount = window.innerWidth < 700 ? 22 : 38;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.8 + 0.8
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -10) particle.x = window.innerWidth + 10;
      if (particle.x > window.innerWidth + 10) particle.x = -10;
      if (particle.y < -10) particle.y = window.innerHeight + 10;
      if (particle.y > window.innerHeight + 10) particle.y = -10;

      if (pointer.active) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 160 && distance > 0) {
          particle.x -= (dx / distance) * 0.25;
          particle.y -= (dy / distance) * 0.25;
        }
      }

      context.beginPath();
      context.fillStyle = index % 3 === 0 ? 'rgba(255, 94, 58, 0.65)' : 'rgba(104, 215, 255, 0.55)';
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }, { passive: true });
  window.addEventListener('mouseleave', () => {
    pointer.active = false;
  });

  window.addEventListener('beforeunload', () => {
    window.cancelAnimationFrame(animationFrame);
  });
}

function setupLoader() {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.innerHTML = '<div class="loader-bg"></div><div class="loader-text">Loading...</div>';
  document.body.appendChild(loader);

  window.setTimeout(() => loader.classList.add('fade'), 900);
  window.setTimeout(() => loader.remove(), 1450);
}

function setupChat() {
  if (!chatMessages || !chatInput || !sendButton) return;

  const addMessage = (content, type) => {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = content;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const getApiBase = () => {
    const apiMeta = document.querySelector('meta[name="api-base-url"]');
    const configuredApiBase = apiMeta ? apiMeta.content.trim() : '';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8003';
    }
    return configuredApiBase;
  };

  const sendMessage = async () => {
    const query = chatInput.value.trim();
    if (!query) return;

    const apiBase = getApiBase();
    addMessage(query, 'user');
    chatInput.value = '';
    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';

    try {
      if (!apiBase) {
        throw new Error('Missing backend URL');
      }

      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      const payload = await response.json();
      addMessage(payload.answer, 'assistant');
    } catch (error) {
      console.error(error);
      addMessage('Sorry, I hit an error while answering. Please try again in a moment.', 'assistant');
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  };

  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  addMessage("Hello. I'm Moazzam's AI assistant. Ask about services, booking, photography, editing, or AI development.", 'assistant');
}

function init() {
  setupLoader();
  setupMobileMenu();
  setupSectionReveal();
  setupHeroParallax();
  setupTypingTitle();
  setupExpandablePanels();
  setupCarousels();
  setupVideoAvailability();
  setupCursor();
  setupTiltCards();
  setupParticles();
  setupChat();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}