document.addEventListener("DOMContentLoaded", () => {
initGlobalComponents();
});

// --- 1. DYNAMIC COMPONENT LOADER (Navbar & Footer) ---
async function initGlobalComponents() {
try {
const [navRes, footerRes] = await Promise.all([
fetch('/assets/components/navbar.html'),
fetch('/assets/components/footer.html')
]);

const navHtml = await navRes.text();
const footerHtml = await footerRes.text();

document.getElementById('global-nav').innerHTML = navHtml;
document.getElementById('global-footer').innerHTML = footerHtml;

initCoreLogic(); // Init animations after DOM is fully loaded
} catch (error) {
console.error("Error loading components:", error);
initCoreLogic(); // Fallback
}
}

function initCoreLogic() {
    // --- 2. LENIS SMOOTH SCROLL ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    // --- 3. GLOBAL NAVBAR LOGIC ---
    initNavbar();

    // --- 4. ROUTER LOGIC (Run specific scripts based on page) ---
    const bodyClass = document.body.className;
    if (bodyClass.includes('page-home')) initHome();
    if (bodyClass.includes('page-story')) initStory();
    if (bodyClass.includes('page-menu')) initMenu();
    if (bodyClass.includes('page-locations')) initLocations();
}

function initNavbar() {
    const navWrapper = document.getElementById('nav-wrapper');
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(!navWrapper || !hamburger) return;

    // 1. Scroll Animation (Shrink & Glassmorphism with restored padding)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            // Scrolled State: Detach, shrink, apply glassmorphism and inner padding
            navWrapper.classList.remove('pt-6', 'px-4', 'md:px-12');
            navWrapper.classList.add('pt-4', 'px-4'); 
            
            navbar.classList.remove('max-w-7xl', 'bg-transparent', 'border-transparent', 'px-0', 'py-0');
            navbar.classList.add('max-w-3xl', 'bg-zinc-950/70', 'backdrop-blur-lg', 'border-white/10', 'px-8', 'py-3', 'shadow-[0_10px_40px_rgba(0,0,0,0.5)]');
        } else {
            // Top State: Flush with the edges, transparent, remove inner padding
            navWrapper.classList.add('pt-6', 'px-4', 'md:px-12');
            navWrapper.classList.remove('pt-4');
            
            navbar.classList.add('max-w-7xl', 'bg-transparent', 'border-transparent', 'px-0', 'py-0');
            navbar.classList.remove('max-w-3xl', 'bg-zinc-950/70', 'backdrop-blur-lg', 'border-white/10', 'px-8', 'py-3', 'shadow-[0_10px_40px_rgba(0,0,0,0.5)]');
        }
    });

    // 2. Mobile Menu Toggle Animation
    let isMenuOpen = false;
    hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        const lines = hamburger.querySelectorAll('span');
        
        if (isMenuOpen) {
            lines[0].style.transform = 'rotate(45deg)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg)';
            
            mobileMenu.classList.replace('opacity-0', 'opacity-100');
            mobileMenu.classList.replace('pointer-events-none', 'pointer-events-auto');
            
            // Re-added staggered mobile link animation
            gsap.fromTo('.mobile-link',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.2 }
            );
        } else {
            lines[0].style.transform = 'rotate(0)';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'rotate(0)';
            
            mobileMenu.classList.replace('opacity-100', 'opacity-0');
            mobileMenu.classList.replace('pointer-events-auto', 'pointer-events-none');
        }
    });

    // 3. Auto-Highlight Active Page
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.replace('text-white', 'text-brand-gold');
            link.classList.add('font-semibold');
            
            // Restored the active dot animation
            const dot = link.querySelector('.active-dot');
            if (dot) {
                dot.classList.replace('opacity-0', 'opacity-100');
                dot.classList.replace('translate-y-2', 'translate-y-0');
            }
        }
    });
}

function initHome() {
gsap.to('.hero-item', { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2 });
gsap.to('.hero-parallax-bg', {
yPercent: 20, ease: "none",
scrollTrigger: { trigger: '.hero-parallax-bg', start: "top top", end: "bottom top", scrub: true }
});

// Counters
document.querySelectorAll('.counter').forEach(counter => {
const target = +counter.getAttribute('data-target');
ScrollTrigger.create({
trigger: counter, start: "top 90%", once: true,
onEnter: () => gsap.to(counter, { innerText: target, duration: 2.5, snap: { innerText: 1 }, ease: "power2.out" })
});
});
}

function initStory() {
gsap.to('.story-hero-item', { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.3 });
gsap.to('.genesis-parallax', {
yPercent: 15, ease: "none",
scrollTrigger: { trigger: '.genesis-img-wrapper', start: "top bottom", end: "bottom top", scrub: true }
});
}

function initMenu() {
gsap.to('.menu-hero-item', { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2 });

// Dietary Filter
const dietRadios = document.querySelectorAll('.diet-radio');
const menuItems = document.querySelectorAll('.menu-row');
dietRadios.forEach(radio => {
radio.addEventListener('change', (e) => {
const selectedDiet = e.target.value;
menuItems.forEach(item => {
if (selectedDiet === 'all' || item.getAttribute('data-diet') === selectedDiet) {
item.style.display = 'flex';
gsap.to(item, { opacity: 1, duration: 0.3 });
} else {
item.style.display = 'none';
item.style.opacity = 0;
}
});
setTimeout(() => ScrollTrigger.refresh(), 100);
});
});
}

function initLocations() {
gsap.to('.loc-hero-item', { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.3 });
}

function initLocations() {
    // 1. Hero Reveal
    gsap.to('.loc-hero-item', { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.3 });

    // 2. The Interiors Grid Parallax (Dual-Directional)

    // Moves the outer columns up (SLOWER NOW)
    gsap.to('.grid-col-up', {
        yPercent: -10, // Changed from -20 to -10 to reduce speed
        ease: "none",
        scrollTrigger: {
            trigger: '.grid-col-wrapper',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Moves the center column down
    gsap.to('.grid-col-down', {
        yPercent: 20, // Left this at 20 so it still has a nice, distinct parallax contrast
        ease: "none",
        scrollTrigger: {
            trigger: '.grid-col-wrapper',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
    

    // 3. Private Dining & Events Reveal
    gsap.from('.private-dining-img', {
        scale: 0.8,
        rotation: -2,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
            trigger: '.private-dining-img',
            start: "top 80%"
        }
    });

    gsap.from('.private-dining-content > *', {
        x: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.private-dining-content',
            start: "top 80%"
        }
    });

    // 4. Custom GSAP Accordion (Guest Information)
    gsap.from('.accordion-header > *', {
        y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: '.accordion-header', start: "top 85%" }
    });

    const faqTriggers = document.querySelectorAll('.faq-trigger');
    
    faqTriggers.forEach(trigger => {
        // Remove existing listeners if any exist to prevent double-firing after Swup transition
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);

        newTrigger.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            const isOpen = this.classList.contains('active');

            // Close all other accordions first (Auto-collapsing)
            document.querySelectorAll('.faq-trigger').forEach(otherTrigger => {
                if (otherTrigger !== this && otherTrigger.classList.contains('active')) {
                    otherTrigger.classList.remove('active');
                    otherTrigger.querySelector('.faq-icon').innerText = '+';
                    gsap.to(otherTrigger.nextElementSibling, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
                }
            });

            // Toggle current accordion
            if (!isOpen) {
                this.classList.add('active');
                icon.innerText = '−'; // Minus sign
                // GSAP auto height animation
                gsap.to(content, { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" });
            } else {
                this.classList.remove('active');
                icon.innerText = '+'; // Plus sign
                gsap.to(content, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
            }
        });
    });
}


// --- 5. OUR STORY PAGE ANIMATIONS (story.html) ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.page-story')) {
        
        // 1. Story Hero Text Reveal
        gsap.to('.story-hero-item', { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            stagger: 0.2, 
            ease: "power4.out", 
            delay: 0.2 
        });

        // 2. Story Hero Parallax Background
        gsap.to('.story-parallax-bg', {
            yPercent: 20, 
            ease: "none",
            scrollTrigger: { 
                trigger: '.page-story', 
                start: "top top", 
                end: "80% top", 
                scrub: true 
            }
        });

        // 3. Genesis Image Parallax (Image moves slightly inside its container)
        gsap.to('.genesis-parallax', {
            yPercent: 15, 
            ease: "none",
            scrollTrigger: { trigger: '.genesis-img-wrapper', start: "top bottom", end: "bottom top", scrub: true }
        });
        
        gsap.from('.genesis-text > *', {
            y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: '.genesis-text', start: "top 80%" }
        });

        // 4. The Master Chef Image Reveal (Wipe effect)
        gsap.to('.chef-mask', {
            height: 0, duration: 1.5, ease: "expo.inOut",
            scrollTrigger: { trigger: '.chef-img-wrapper', start: "top 70%" }
        });

        gsap.from('.chef-profile > *', {
            x: -40, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: '.chef-profile', start: "top 75%" }
        });

        // 5. Interactive Vertical Timeline
        // Fills the vertical gold line as you scroll
        gsap.to('.timeline-progress', {
            height: "100%", ease: "none",
            scrollTrigger: { trigger: '.timeline-section', start: "top 50%", end: "bottom 80%", scrub: true }
        });

        // Pops out the dots and text
        const timelineItems = gsap.utils.toArray('.timeline-item');
        timelineItems.forEach(item => {
            gsap.from(item, {
                y: 50, opacity: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 80%" }
            });
            
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                gsap.to(dot, {
                    backgroundColor: '#D4AF37', 
                    borderColor: '#D4AF37',
                    duration: 0.4,
                    scrollTrigger: { trigger: item, start: "top 50%", toggleActions: "play none none reverse" }
                });
            }
        });

        // 6. The Core Philosophy (Pillar Cards Reveal)
        gsap.from('.pillar-card', {
            y: 80, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: '.pillar-card', start: "top 85%" }
        });

        // 7. The Meaning of Majlis (Text Fade)
        gsap.from('.majlis-text-block > *', {
            y: 50, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power4.out",
            scrollTrigger: { trigger: '.majlis-text-block', start: "top 80%" }
        });

        // 8. Floating Images Parallax (Moves upwards at different speeds based on data-speed)
        const floaters = document.querySelectorAll('.floating-img');
        floaters.forEach(img => {
            const speed = img.getAttribute('data-speed') || 1;
            gsap.to(img, {
                y: () => -100 * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: '.majlis-text-block',
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }
});




// Script for Menu Cards cursor hover
// Desktop-Only Menu Image Hover Reveal
    const menuRows = document.querySelectorAll('.menu-row');
    const hoverImgBox = document.getElementById('global-hover-img');

    // Only run this effect on devices with a physical mouse/trackpad (Desktop/Tablet)
    const isDesktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (isDesktopPointer && hoverImgBox) {
        menuRows.forEach(row => {
            
            // When mouse enters the row
            row.addEventListener('mouseenter', (e) => {
                const imgSrc = row.getAttribute('data-img'); // Grab the image path
                
                if (imgSrc) {
                    // Wrap the path in quotes to ensure paths with spaces don't break
                    hoverImgBox.style.backgroundImage = `url('${imgSrc}')`; 
                    
                    // Position the image right next to the cursor and pop it in
                    gsap.set(hoverImgBox, { x: e.clientX + 20, y: e.clientY - 120 });
                    gsap.to(hoverImgBox, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" });
                }
            });

            // When mouse leaves the row
            row.addEventListener('mouseleave', () => {
                gsap.to(hoverImgBox, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" });
            });

            // When mouse moves along the row
            row.addEventListener('mousemove', (e) => {
                // Make the image follow the cursor smoothly
                gsap.to(hoverImgBox, { x: e.clientX + 20, y: e.clientY - 120, duration: 0.4, ease: "power2.out" });
            });
        });
    }




    // Tinker Effect from Story Page
    // Timeline Card 3D Tilt (Tinker) Effect
    const timelineCards = document.querySelectorAll('.timeline-card');
    
    // Only run on desktop so we don't break mobile scrolling
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (isDesktop && timelineCards.length > 0) {
        timelineCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                // Get the exact dimensions and position of the hovered card
                const rect = card.getBoundingClientRect();
                
                // Calculate where the mouse is relative to the center of the card
                const x = e.clientX - rect.left; 
                const y = e.clientY - rect.top;  
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Map the position to a rotation (Max tilt is 8 degrees to keep it professional)
                const rotateX = ((y - centerY) / centerY) * -8; 
                const rotateY = ((x - centerX) / centerX) * 8;
                
                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    transformOrigin: "center center",
                    ease: "power2.out",
                    duration: 0.4,
                    force3D: true
                });
            });
            
            // When the mouse leaves, snap the card back into its flat position with a slight bounce
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    ease: "elastic.out(1, 0.5)",
                    duration: 0.8,
                    force3D: true
                });
            });
        });
    }