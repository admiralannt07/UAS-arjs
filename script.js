// Welcome screen and main page transition
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainPage = document.getElementById('mainPage');
    const navbar = document.getElementById('navbar');

    // Show welcome screen for 2 seconds, then transition to main page
    setTimeout(() => {
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            mainPage.style.opacity = '1';
        }, 500);
    }, 2000);

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-slate-900/95', 'backdrop-blur-custom', 'shadow-lg');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-slate-900/95', 'backdrop-blur-custom', 'shadow-lg');
            navbar.classList.add('bg-transparent');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button, a[class*="bg-gradient"]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Floating orbs animation enhancement
    const orbs = document.querySelectorAll('.floating-orb');
    orbs.forEach((orb, index) => {
        orb.style.animationDelay = `-${index * 2}s`;
        orb.style.animationDuration = `${8 + index * 2}s`;
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-orb');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Add typing effect to hero text (optional enhancement)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Enhanced button click effects
    document.querySelectorAll('.shine-effect').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Additional utility functions
function addGlowEffect(element) {
    element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
    setTimeout(() => {
        element.style.boxShadow = '';
    }, 2000);
}

// Performance optimization for animations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Scroll-based animations can be added here
}, 10);