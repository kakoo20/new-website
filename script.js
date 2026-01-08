document.addEventListener('DOMContentLoaded', () => {
    // Ajoute la classe active aux liens de navigation lors du défilement
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    // Effet du bouton CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            ctaButton.style.boxShadow = '0 15px 30px rgba(0, 168, 204, 0.4)';
        });

        ctaButton.addEventListener('mouseleave', () => {
            ctaButton.style.boxShadow = '0 10px 20px rgba(0, 168, 204, 0.3)';
        });
    }
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2, // increased threshold
        rootMargin: "0px 0px -150px 0px" // increased bottom margin so it fades out earlier
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});