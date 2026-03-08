console.log('Portfolio script loaded');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      navLinks.classList.remove('open');
    }
  });
}

function setupRevealSections() {
  const sections = document.querySelectorAll('.reveal-section');
  if (!sections.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });

  sections.forEach((section) => observer.observe(section));
}

function setupTypingTitle() {
  const typingTitle = document.getElementById('typing-title');
  if (!typingTitle) {
    return;
  }

  const text = 'Portfolio';
  if (prefersReducedMotion) {
    typingTitle.textContent = text;
    return;
  }

  let index = 0;
  const section = document.getElementById('portfolio');
  if (!section) {
    typingTitle.textContent = text;
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || typingTitle.textContent) {
        return;
      }

      const typeNext = () => {
        typingTitle.textContent += text.charAt(index);
        index += 1;
        if (index < text.length) {
          window.setTimeout(typeNext, 85);
        }
      };

      typeNext();
      observer.disconnect();
    });
  }, { threshold: 0.4 });

  observer.observe(section);
}

function setupHeroParallax() {
  const heroVisual = document.querySelector('.hero-image-panel');
  if (!heroVisual || prefersReducedMotion) {
    return;
  }

  const updateParallax = () => {
    const offset = Math.min(window.scrollY * 0.045, 18);
    heroVisual.style.transform = `translateY(${offset}px)`;
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
}

function setupExpandablePanels() {
  const buttons = document.querySelectorAll('.expand-arrow');
  if (!buttons.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const panelId = button.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (!panel) {
        return;
      }

      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      panel.classList.toggle('expanded', !isExpanded);
    });
  });
}

function initCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) {
    return;
  }

  const images = Array.from(carousel.querySelectorAll('img'));
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  if (!images.length || !prev || !next) {
    return;
  }

  let index = 0;

  const render = () => {
    images.forEach((image, imageIndex) => {
      image.hidden = imageIndex !== index;
    });
  };

  prev.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    index = (index - 1 + images.length) % images.length;
    render();
  });

  next.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    index = (index + 1) % images.length;
    render();
  });

  render();
}

function setupCarousels() {
  ['modelling-carousel', 'sports-carousel', 'automotive-carousel', 'others-carousel'].forEach(initCarousel);
}

function setupChat() {
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');

  if (!chatMessages || !chatInput || !sendButton) {
    return;
  }

  const addMessage = (content, type) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const sendMessage = async () => {
    const message = chatInput.value.trim();
    if (!message) {
      return;
    }

    addMessage(message, 'user');
    chatInput.value = '';
    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';

    try {
      const apiMeta = document.querySelector('meta[name="api-base-url"]');
      const configuredApiBase = apiMeta ? apiMeta.content.trim() : '';
      const apiBase = window.location.hostname === 'localhost'
        ? 'http://localhost:8003'
        : configuredApiBase;

      if (!apiBase) {
        throw new Error('Backend URL is missing. Set meta[name="api-base-url"] in index.html');
      }

      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      addMessage(data.answer, 'assistant');
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('Sorry, I hit a connection issue. Please try again in a moment.', 'assistant');
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  };

  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  addMessage('Hello. Ask about services, pricing, Karachi availability, or project workflow.', 'assistant');
}

function setupVideoFallback() {
  const video = document.getElementById('videography-video');
  const placeholder = document.getElementById('video-placeholder');
  if (!video || !placeholder) {
    return;
  }

  const source = video.querySelector('source');
  if (!source) {
    return;
  }

  fetch(source.src, { method: 'HEAD' })
    .then((response) => {
      if (response.ok) {
        video.style.display = 'block';
        placeholder.style.display = 'none';
      }
    })
    .catch(() => {
      video.style.display = 'none';
      placeholder.style.display = 'grid';
    });
}

function setupTilt() {
  const tiltItems = document.querySelectorAll('.tilt-shell');
  if (!tiltItems.length || prefersReducedMotion) {
    return;
  }

  tiltItems.forEach((item) => {
    const intensity = Number(item.dataset.tiltIntensity || 2.4);

    item.addEventListener('mousemove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * intensity;
      const rotateY = (x - 0.5) * intensity;
      item.classList.add('is-touching');
      item.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-1px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('is-touching');
      item.style.transform = '';
    });
  });
}

function setupParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas || prefersReducedMotion) {
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const particles = [];
  const particleCount = window.innerWidth < 700 ? 28 : 50;
  let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createParticle = () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.7 + 0.6,
    speedX: (Math.random() - 0.5) * 0.22,
    speedY: (Math.random() - 0.5) * 0.22,
    depth: Math.random() * 0.6 + 0.4
  });

  resize();
  for (let index = 0; index < particleCount; index += 1) {
    particles.push(createParticle());
  }

  const render = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.hypot(dx, dy);
      const force = distance < 140 ? (140 - distance) / 1400 : 0;

      particle.x += particle.speedX - dx * force * 0.03 * particle.depth;
      particle.y += particle.speedY - dy * force * 0.03 * particle.depth;

      if (particle.x < -10) particle.x = canvas.width + 10;
      if (particle.x > canvas.width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = canvas.height + 10;
      if (particle.y > canvas.height + 10) particle.y = -10;

      context.beginPath();
      context.fillStyle = 'rgba(255, 255, 255, 0.55)';
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
        const first = particles[firstIndex];
        const second = particles[secondIndex];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        if (distance < 110) {
          context.beginPath();
          context.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 110) * 0.09})`;
          context.lineWidth = 1;
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }
    }

    window.requestAnimationFrame(render);
  };

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  render();
}

function init() {
  setupNavigation();
  setupRevealSections();
  setupTypingTitle();
  setupHeroParallax();
  setupExpandablePanels();
  setupCarousels();
  setupChat();
  setupVideoFallback();
  setupTilt();
  setupParticles();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
