// ============================================
// INITIALIZATION & LOGGING
// ============================================
console.log('Script loaded successfully');

// ============================================
// HERO IMAGE PARALLAX & FADE
// ============================================
const heroImage = document.querySelector('.hero-image');
if (heroImage) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const height = window.innerHeight;
    const opacity = Math.max(1 - scrolled / (height * 0.7), 0);
    heroImage.style.opacity = opacity;
    heroImage.style.transform = `translateY(${scrolled * 0.2}px) scale(${1 + scrolled * 0.0005})`;
  });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
    }
  });
}

// ============================================
// SECTION ANIMATIONS (INTERSECTION OBSERVER)
// ============================================
const sections = document.querySelectorAll('.section');
if (sections.length > 0) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

// ============================================
// AI ASSISTANT CHAT
// ============================================
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

if (chatMessages && chatInput && sendButton) {
  function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatInput.value = '';
    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';

    try {
      // Use meta-configured backend URL in production, localhost in local dev.
      const apiMeta = document.querySelector('meta[name="api-base-url"]');
      const configuredApiBase = apiMeta ? apiMeta.content.trim() : '';
      const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:8003'
        : configuredApiBase;

      if (!API_BASE) {
        throw new Error('Backend URL is missing. Set meta[name="api-base-url"] in index.html');
      }
      
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      addMessage(data.answer, 'assistant');
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('Sorry, I encountered an error. Please try again later.', 'assistant');
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  }

  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  addMessage("Hello! I'm Moazzam's AI assistant. Ask me anything about his services, portfolio, or feel free to chat!", 'assistant');
}

// ============================================
// TYPING EFFECT FOR PORTFOLIO TITLE
// ============================================
const typingTitle = document.getElementById('typing-title');
if (typingTitle) {
  const text = 'Portfolio';
  let index = 0;

  function typeWriter() {
    if (index < text.length) {
      typingTitle.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWriter, 150);
    }
  }

  const portfolioSection = document.getElementById('portfolio');
  if (portfolioSection) {
    const portfolioObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !typingTitle.innerHTML) {
          typeWriter();
        }
      });
    }, { threshold: 0.5 });
    portfolioObserver.observe(portfolioSection);
  }
}

// ============================================
// EXPAND/COLLAPSE SERVICE PANELS
// ============================================
function setupExpandablePanels() {
  document.querySelectorAll('.expand-arrow').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const panelId = this.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      
      if (!panel) {
        console.error('Panel not found:', panelId);
        return;
      }
      
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      panel.classList.toggle('expanded');
      
      console.log('Panel toggled:', panelId, 'Now expanded:', !expanded);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupExpandablePanels);
} else {
  setupExpandablePanels();
}

// ============================================
// PHOTO CAROUSELS - SIMPLE IMAGE DISPLAY
// ============================================
function initCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const images = carousel.querySelectorAll('img');
  if (images.length === 0) return;

  let currentIndex = 0;
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');

  function showImage(index) {
    images.forEach((img, i) => {
      img.style.display = i === index ? 'block' : 'none';
    });
  }

  showImage(currentIndex);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCarousel('modelling-carousel');
    initCarousel('sports-carousel');
    initCarousel('automotive-carousel');
    initCarousel('others-carousel');
  });
} else {
  initCarousel('modelling-carousel');
  initCarousel('sports-carousel');
  initCarousel('automotive-carousel');
  initCarousel('others-carousel');
}

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.innerHTML = '<div class="loader-bg"></div><div class="loader-text">Loading...</div>';
  document.body.appendChild(loader);
  
  setTimeout(() => loader.classList.add('fade'), 1200);
  setTimeout(() => {
    if (loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }, 1800);
});

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ============================================
// HOVER EFFECTS ON SERVICE CARDS
// ============================================
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });

  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

  // Auto-detect if video file exists
  const video = document.getElementById('videography-video');
  const videoContainer = document.getElementById('video-container');
  const videoPlaceholder = document.getElementById('video-placeholder');
  
  if (video && videoContainer && videoPlaceholder) {
    const videoSource = video.querySelector('source');
    if (videoSource) {
      const videoPath = videoSource.src;
      fetch(videoPath, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            video.style.display = 'block';
            videoPlaceholder.style.display = 'none';
          }
        })
        .catch(() => {
          video.style.display = 'none';
          videoPlaceholder.style.display = 'block';
        });
    }
  }

console.log('All scripts initialized successfully');