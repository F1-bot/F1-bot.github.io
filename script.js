// --- Preloader Logic ---
window.onload = function() {
    const preloader = document.getElementById('preloader');
    const pageWrapper = document.querySelector('.page-wrapper');
    if (preloader) {
        preloader.classList.add('hidden');
        // Optional: completely remove from DOM after transition
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); // Should match CSS transition duration
    }

    if (pageWrapper) {
        // Add the 'loaded' class to smoothly reveal the content
        pageWrapper.classList.add('loaded');
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // --- Mobile navigation toggle ---
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = burgerMenu.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burgerMenu.querySelector('i').classList.add('fa-bars');
                    burgerMenu.querySelector('i').classList.remove('fa-times');
                }
            });
        });
    }


    // --- Email De-obfuscation ---
    const emailPlaceholder = document.getElementById('email-placeholder');
    if (emailPlaceholder) {
        const emailText = emailPlaceholder.textContent;
        const realEmail = emailText.replace(/\s*\[at\]\s*/g, '@').replace(/\s*\[dot\]\s*/g, '.');
        emailPlaceholder.innerHTML = `<a href="mailto:${realEmail}">${realEmail}</a>`;
    }

    // --- Copyright Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active navigation link highlighting on scroll ---
    const sectionsForNav = document.querySelectorAll('main section[id]');
    const navLi = document.querySelectorAll('header nav ul li a');
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 65;

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = pageYOffset + headerHeight + 50; // Add offset

        sectionsForNav.forEach(section => {
            if (section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                current = section.getAttribute('id');
            }
        });
        
        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
        // If no section is "current" (e.g., at the very top), make "Home" active
        if (!current && pageYOffset < sectionsForNav[0].offsetTop - headerHeight) {
            navLi.forEach(a => {
                if (a.getAttribute('href') === '#hero') {
                    a.classList.add('active');
                } else {
                    a.classList.remove('active');
                }
            });
        }
    });

    // --- Fade-in animation for elements on scroll ---
    const fadeInElements = document.querySelectorAll('.fade-in-element');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of item is visible
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Set initial state for animation right before adding 'is-visible'
                entry.target.classList.add('is-visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInElements.forEach(item => {
        // Initially hide elements that will be animated by JS
        observer.observe(item);
    });

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxLoader = lightbox.querySelector('.lightbox-loader');
        const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        const openLightbox = (e) => {
            const imgSrc = e.currentTarget.querySelector('img').src;
            
            lightbox.classList.add('active');
            lightboxLoader.style.display = 'block';
            lightboxImage.classList.remove('loaded');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling

            const img = new Image();
            img.onload = function() {
                // Once loaded, update the real image src and hide loader
                lightboxImage.src = this.src;
                lightboxLoader.style.display = 'none';
                lightboxImage.classList.add('loaded');
            };
            img.src = imgSrc; // Start loading
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
            // Reset for next open
            setTimeout(() => {
                lightboxImage.src = "";
                lightboxImage.classList.remove('loaded');
                lightboxLoader.style.display = 'block';
            }, 300); // Delay to allow fade-out
        };

        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', openLightbox);
        });

        lightboxClose.addEventListener('click', closeLightbox);

        // Close lightbox when clicking on the background
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

});
