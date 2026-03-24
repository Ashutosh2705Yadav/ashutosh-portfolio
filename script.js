// Scroll section - Highlight active nav link based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll behavior for navbar links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(e.target.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll to top button visibility
const scrollToTopBtn = document.querySelector('.scroll-to-top a');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show-scroll');
    } else {
        scrollToTopBtn.classList.remove('show-scroll');
    }
});

// GSAP Animations for sections - Slightly slower and visible when scrolled into view
gsap.registerPlugin(ScrollTrigger);

// Animate header immediately on page load
gsap.from(".header", {
    duration: 1.0,
    y: -50,
    opacity: 0,
    ease: "power3.out"
});

// Immediate home content animation without parallax
gsap.from(".home-content", {
    duration: 1.0,
    opacity: 0,
    y: 20,
    ease: "power3.out",
    onStart: () => {
        document.querySelector('.home-content').style.opacity = 1;
    }
});

// Projects section animation
gsap.from(".projects-row", {
    opacity: 0,
    y: 30,
    duration: 1.0,
    stagger: 0.2,
    scrollTrigger: {
        trigger: ".projects-row",
        start: "top 80%",
        toggleActions: "play none none reverse"
    }
});

// Footer section animation
gsap.from(".footer-container", {
    opacity: 0,
    y: 20,
    duration: 1.2,
    scrollTrigger: {
        trigger: ".footer",
        start: "top 90%",
        toggleActions: "play none none reverse"
    }
});

// Navbar links animation on scroll
gsap.from(".navbar a", {
    opacity: 0,
    y: -15,
    duration: 0.8,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".navbar",
        start: "top 95%",
        toggleActions: "play none none reverse"
    }
});

// Make About section immediately visible when scrolled into view
gsap.fromTo(".about-content", 
    { opacity: 0, y: 50 },  // Starting point
    { opacity: 1, y: 0, duration: 0.3, ease: "power2.out",  // Fast duration for immediate visibility
      scrollTrigger: {
        trigger: ".about",
        start: "top 90%",  // Trigger the animation as soon as the section is in the viewport
        toggleActions: "play none none none"
    }}
);

// Skills section animation
gsap.from(".skills-column", {
    opacity: 0,
    y: 20,
    duration: 1.0,
    stagger: 0.2,
    scrollTrigger: {
        trigger: ".skills",
        start: "top 85%",
        toggleActions: "play none none reverse"
    }
});

// Footer final animation
gsap.from(".footer-container", {
    opacity: 0,
    scale: 0.8,
    duration: 1.5,
    scrollTrigger: {
        trigger: ".footer",
        start: "top 90%",
        end: "bottom 80%",
        toggleActions: "play none none reverse"
    }
});
// Form submission handler with enhanced validation
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Clear previous error messages
    clearErrors();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Name validation
    if (name === '') {
        showError('nameError', 'Full Name is required.');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters.');
        isValid = false;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email === '') {
        showError('emailError', 'Email Address is required.');
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError('emailError', 'Please enter a valid Email Address.');
        isValid = false;
    }

    // Phone validation (optional but if provided, must be valid)
    if (phone !== '') {
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phone)) {
            showError('phoneError', 'Phone Number must be 10 digits.');
            isValid = false;
        }
    }

    // Message validation
    if (message === '') {
        showError('messageError', 'Please enter your message.');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters.');
        isValid = false;
    }

    // If all fields are valid, submit the form
    if (isValid) {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Form submission via Web3Forms
        const formData = new FormData(this);

        fetch(this.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Show the Thank You popup
                document.getElementById('thankYouPopup').style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling

                // Reset form
                this.reset();

                // Reload the page after 5 seconds
                setTimeout(() => {
                    location.reload();
                }, 5000);
            } else {
                alert('There was an error submitting your message. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your message. Please try again.');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
});

// Close popup function
function closePopup() {
    document.getElementById('thankYouPopup').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    location.reload(); // Reload the page when the popup is closed
}

// Close popup when clicking outside
document.getElementById('thankYouPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('thankYouPopup').style.display === 'flex') {
        closePopup();
    }
});
// Rotating text animation
const roles = ['Full Stack Developer', 'MERN Stack Developer', 'Backend Developer'];
let index = 0;
const rotateText = document.getElementById('rotate-text');

function rotateRole() {
    rotateText.textContent = roles[index];
    index = (index + 1) % roles.length;
}

setInterval(rotateRole, 3000);  // Changes every 3 seconds
// Toggle Navbar on Mobile
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');
const logo = document.querySelector('.logo');

// When clicking on the menu icon, toggle the navbar visibility
menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Also toggle the navbar when clicking on the logo (mobile version)
logo.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        navbar.classList.toggle('active');
    }
});

// Ensure the navbar hides when resizing the screen back to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navbar.classList.remove('active');
    }
});


// Form submission handler with enhanced validation
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Clear previous error messages
    clearErrors();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Name validation
    if (name === '') {
        showError('nameError', 'Full Name is required.');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters.');
        isValid = false;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email === '') {
        showError('emailError', 'Email Address is required.');
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError('emailError', 'Please enter a valid Email Address.');
        isValid = false;
    }

    // Phone validation (optional but if provided, must be valid)
    if (phone !== '') {
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phone)) {
            showError('phoneError', 'Phone Number must be 10 digits.');
            isValid = false;
        }
    }

    // Message validation
    if (message === '') {
        showError('messageError', 'Please enter your message.');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters.');
        isValid = false;
    }

    // If all fields are valid, submit the form
    if (isValid) {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Form submission via Web3Forms
        const formData = new FormData(this);

        fetch(this.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Show the Thank You popup
                document.getElementById('thankYouPopup').style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling

                // Reset form
                this.reset();

                // Reload the page after 5 seconds
                setTimeout(() => {
                    location.reload();
                }, 5000);
            } else {
                alert('There was an error submitting your message. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your message. Please try again.');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
});

// Close popup function
function closePopup() {
    document.getElementById('thankYouPopup').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    location.reload(); // Reload the page when the popup is closed
}

// Close popup when clicking outside
document.getElementById('thankYouPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('thankYouPopup').style.display === 'flex') {
        closePopup();
    }
});

// Function to show error message
function showError(fieldId, errorMessage) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    }
}

// Function to clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(error => error.style.display = 'none');
}

// Add this to your existing JavaScript

// Tilt effect for project cards
VanillaTilt.init(document.querySelectorAll(".project-card"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
});

// Intersection Observer for project cards
const projectCards = document.querySelectorAll('.project-card');
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            projectObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

projectCards.forEach(card => {
    projectObserver.observe(card);
});

// Hover effect for tech stack items
document.querySelectorAll('.tech-stack span').forEach(span => {
    span.addEventListener('mouseenter', () => {
        span.style.transform = 'scale(1.1) rotate(5deg)';
    });
    span.addEventListener('mouseleave', () => {
        span.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Toggle Additional Projects
function toggleAdditionalProjects() {
    const additionalProjects = document.getElementById('additionalProjects');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    
    if (additionalProjects.classList.contains('hidden')) {
        additionalProjects.classList.remove('hidden');
        viewMoreBtn.innerHTML = 'Show Less Projects <i class="bx bx-chevron-up"></i>';
        // Smooth scroll to the additional projects
        setTimeout(() => {
            additionalProjects.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        additionalProjects.classList.add('hidden');
        viewMoreBtn.innerHTML = 'View More Projects <i class="bx bx-chevron-right"></i>';
    }
}
