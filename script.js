// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const header = document.querySelector('.header');
const progressBars = document.querySelectorAll('.progress-bar');
const filterBtns = document.querySelectorAll('.filter-btn');
const navLinks = document.querySelectorAll('.nav-item a');

// Typing animation text options
const textOptions = ["Java Developer and Web Designer", "UI Designer", "3D Artist", "Creative Coder"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 150;

// Three.js variables
let scene, camera, renderer, cube;
let cubeGroup = new THREE.Group();

// On page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cursor tail effect
    initCursorTail();
    
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#00d4ff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#00d4ff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }
    
    // Initialize 3D Cube
    init3DCube();
    
    // Initialize Tilt effect
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });
    
    // Add pulse animation to name
    document.getElementById('name').classList.add('pulse');
    
    // Start typing animation
    setTimeout(typeAnimation, 1000);
    
    // Animate skill progress bars
    animateSkillBars();
    
    // Animate on scroll
    window.addEventListener('scroll', function() {
        // Sticky header
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        // Animate elements when they come into view
        animateOnScroll();
    });
    
    // Initialize navigation
    initNavigation();
    
    // Initialize portfolio filters
    initPortfolioFilters();
    
    // Form validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateForm();
        });
    }
    
    // GSAP animations for page elements
    gsap.from(".main-heading", {duration: 1, y: 50, opacity: 0, ease: "power3.out"});
    gsap.from(".typing-container", {duration: 1, y: 30, opacity: 0, ease: "power3.out", delay: 0.3});
    gsap.from(".hero-description", {duration: 1, y: 30, opacity: 0, ease: "power3.out", delay: 0.6});
    gsap.from(".cta-buttons", {duration: 1, y: 30, opacity: 0, ease: "power3.out", delay: 0.9});
    
    // Animation loop
    animate();
    
    // Add event listener for mouse movement
    document.addEventListener('mousemove', handleMouseParallax);
    
    // Enhance scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger initial animation on load
    animateOnScroll();
});

// Initialize 3D Cube
function init3DCube() {
    const container = document.getElementById('cube-container');
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create multiple cubes in a group
    const colors = [0x00d4ff, 0x3d5afe, 0x00a8ff, 0xff3d71];
    
    for (let i = 0; i < 6; i++) {
        const size = Math.random() * 0.5 + 0.5;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.8,
            wireframe: false,
            emissive: 0x3d5afe,
            emissiveIntensity: 0.2,
            shininess: 50
        });
        
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = (Math.random() - 0.5) * 4;
        cube.position.y = (Math.random() - 0.5) * 4;
        cube.position.z = (Math.random() - 0.5) * 4;
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        
        cubeGroup.add(cube);
    }
    
    scene.add(cubeGroup);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (cubeGroup) {
        cubeGroup.rotation.x += 0.005;
        cubeGroup.rotation.y += 0.005;
        
        // Animate individual cubes
        cubeGroup.children.forEach((cube, i) => {
            cube.rotation.x += 0.01 * (i % 3 + 1);
            cube.rotation.y += 0.01 * (i % 2 + 1);
        });
    }
    
    if (renderer) renderer.render(scene, camera);
}

// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Change icon
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Button animation on click
function animateButton(btn) {
    btn.classList.add('pulse');
    setTimeout(() => {
        btn.classList.remove('pulse');
    }, 1000);
    
    // Demo alert - replace with actual functionality
    setTimeout(() => {
        alert("Thanks for connecting!");
    }, 500);
}

// Typing animation function
function typeAnimation() {
    const dynamicText = document.querySelector('.dynamic-text');
    const currentText = textOptions[textIndex];
    
    if (isDeleting) {
        // Removing characters
        dynamicText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 100; // Faster when deleting
    } else {
        // Adding characters
        dynamicText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 150; // Normal speed when typing
    }
    
    // Transition between words
    if (!isDeleting && charIndex === currentText.length) {
        // Pause at the end of typing
        typingDelay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Move to next word
        isDeleting = false;
        textIndex = (textIndex + 1) % textOptions.length;
        typingDelay = 500; // Pause before starting new word
    }
    
    setTimeout(typeAnimation, typingDelay);
}

// Animate skill bars
function animateSkillBars() {
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Enhance animateOnScroll function to handle new reveal animations
function animateOnScroll() {
    // Get all elements with animation classes
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-rotate, .reveal-scale');
    
    // Get window height
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    
    // Update scroll progress bar
    const scrollProgress = document.querySelector('.scroll-progress');
    const totalHeight = document.body.scrollHeight - windowHeight;
    const progress = (scrollY / totalHeight) * 100;
    scrollProgress.style.width = progress + '%';
    
    // Animate elements when they come into view
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        } else {
            // Only reset animation when completely out of view for smoother experience
            if (elementTop > windowHeight) {
                element.classList.remove('active');
            }
        }
    });
    
    // Also handle the previous animation elements
    const scrollElements = document.querySelectorAll('.skill-box, .service-box, .portfolio-item');
    scrollElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
    
    // Handle 3D parallax effect
    handleParallax(scrollY);
}

// Add 3D parallax effect on scroll
function handleParallax(scrollY) {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    parallaxLayers.forEach(layer => {
        let speed = 0.5;
        let depth = 0;
        
        if (layer.classList.contains('depth-1')) {
            depth = 50;
            speed = 0.05;
        } else if (layer.classList.contains('depth-2')) {
            depth = 100;
            speed = 0.1;
        } else if (layer.classList.contains('depth-3')) {
            depth = 150;
            speed = 0.15;
        }
        
        const yOffset = scrollY * speed;
        const transform = `translateZ(${depth}px) translateY(${-yOffset}px)`;
        layer.style.transform = transform;
    });
    
    // 3D perspective effect on scroll for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const rotateX = Math.min(10, scrollY / 50); // Max 10deg rotation
        heroSection.style.transform = `perspective(1000px) rotateX(${rotateX}deg)`;
    }
}

// Update mouse move effect for 3D parallax
function handleMouseParallax(e) {
    const parallaxSections = document.querySelectorAll('.parallax-scroll');
    
    parallaxSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate mouse position relative to center of section
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Apply subtle rotation based on mouse position
        const rotateY = mouseX * 0.01; // Adjust sensitivity as needed
        const rotateX = -mouseY * 0.01; // Negative to make it feel natural
        
        section.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Apply parallax effect to layers inside this section
        const layers = section.querySelectorAll('.parallax-layer');
        layers.forEach(layer => {
            let depth = 0;
            
            if (layer.classList.contains('depth-1')) {
                depth = 0.05;
            } else if (layer.classList.contains('depth-2')) {
                depth = 0.1;
            } else if (layer.classList.contains('depth-3')) {
                depth = 0.15;
            }
            
            const translateX = mouseX * depth;
            const translateY = mouseY * depth;
            
            // Get the original translateZ value if it exists
            let originalTransform = layer.style.transform;
            let translateZ = '0px';
            
            if (originalTransform && originalTransform.includes('translateZ')) {
                const match = originalTransform.match(/translateZ\(([^)]+)\)/);
                if (match) {
                    translateZ = match[1];
                }
            }
            
            layer.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ})`;
        });
    });
}

// Initialize navigation
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for navigation links (internal links starting with #)
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(nav => {
                    nav.parentElement.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                // Scroll to section
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
            // Let external links (like social media) work normally
        });
    });
}

// Initialize portfolio filters
function initPortfolioFilters() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Set initial animation delays
    portfolioItems.forEach((item, index) => {
        item.style.setProperty('--i', index);
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter portfolio items
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach((item, index) => {
                // Reset animation delay for proper re-animation
                item.style.setProperty('--i', index);
                
                if (filterValue === 'all') {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    if (item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hide');
                        item.classList.add('show');
                    } else {
                        item.classList.add('hide');
                        item.classList.remove('show');
                    }
                }
            });
        });
    });
}

// Form validation
function validateForm() {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    let isValid = true;
        
    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.style.boxShadow = '0 0 0 2px red';
                
            input.addEventListener('input', function() {
                this.style.boxShadow = '';
            });
        } else {
            input.style.boxShadow = '';
        }
    });
    
    if (isValid) {
        alert('Form submitted successfully!');
        document.querySelector('.contact-form').reset();
    }
}

// Neon Cursor Tail Effect
function initCursorTail() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-tail';
    document.body.appendChild(cursor);
    
    const trails = [];
    const maxTrails = 15;
    let trailIndex = 0;
    
    // Create trail elements
    for (let i = 0; i < maxTrails; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        trails.push(trail);
    }
    
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let lastX = 0, lastY = 0;
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create new trail point
        const currentTrail = trails[trailIndex];
        currentTrail.style.left = mouseX + 'px';
        currentTrail.style.top = mouseY + 'px';
        currentTrail.classList.add('active');
        
        // Remove active class from previous trail with delay
        setTimeout(() => {
            currentTrail.classList.remove('active');
        }, 100);
        
        // Move to next trail
        trailIndex = (trailIndex + 1) % maxTrails;
    });
    
    // Animate main cursor
    function animateCursor() {
        // Smooth cursor movement
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;
        
        // Update main cursor
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hide cursor on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        trails.forEach(trail => trail.style.display = 'none');
    }
}
