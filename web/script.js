// Smooth scroll handled by CSS; use JS for header image parallax/fade, mobile menu toggle, and scroll animations

const heroImage = document.querySelector('.hero-image');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const height = window.innerHeight;
    // fade out and slightly move image with 3D effect
    const opacity = Math.max(1 - scrolled / (height * 0.7), 0);
    heroImage.style.opacity = opacity;
    heroImage.style.transform = `translateY(${scrolled * 0.2}px) translateZ(${scrolled * 0.1}px)`;

    // Change text color based on scroll
    const totalScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrolled / totalScroll;
    const colors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    const colorIndex = Math.floor(scrollPercent * (colors.length - 1));
    const color = colors[colorIndex];
    document.body.style.color = color;
});

// Intersection Observer for section animations
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

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
    }
});

// Add 3D hover effect to service blocks
const services = document.querySelectorAll('.service');
services.forEach(service => {
    service.addEventListener('mousemove', (e) => {
        const rect = service.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        service.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });

    service.addEventListener('mouseleave', () => {
        service.style.transform = '';
    });
});