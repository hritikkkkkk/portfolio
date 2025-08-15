// Global variables
let scene, camera, renderer, particles, animationId;
let typingIndex = 0;
let currentTextIndex = 0;
let isDeleting = false;

// Typing animation texts
const typingTexts = [
    "AI Engineer",
    "Machine Learning Expert",
    "Deep Learning Specialist",
    "Python Developer",
    "Data Scientist",
    "Neural Network Architect"
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupNavigation();
    setupTypingAnimation();
    setupNeuralNetwork();
    setupBinaryRain();
    setupScrollAnimations();
    setupContactForm();
    setupResumeDownload();
    setupProjectCards();
    setupSmoothScrolling();
    
    // Initialize scroll-triggered animations
    window.addEventListener('scroll', handleScroll);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Initial scroll check
    handleScroll();
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Typing animation
function setupTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    
    function typeText() {
        const currentText = typingTexts[currentTextIndex];
        
        if (!isDeleting) {
            // Typing
            typingElement.textContent = currentText.substring(0, typingIndex + 1);
            typingIndex++;
            
            if (typingIndex === currentText.length) {
                // Finished typing, wait then start deleting
                setTimeout(() => {
                    isDeleting = true;
                }, 2000);
            }
        } else {
            // Deleting
            typingElement.textContent = currentText.substring(0, typingIndex - 1);
            typingIndex--;
            
            if (typingIndex === 0) {
                // Finished deleting, move to next text
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
            }
        }
        
        // Adjust typing speed
        const typeSpeed = isDeleting ? 50 : 100;
        setTimeout(typeText, typeSpeed);
    }
    
    typeText();
}

// 3D Neural Network Animation
function setupNeuralNetwork() {
    const canvas = document.getElementById('neural-network');
    const container = canvas.parentElement;
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    // Create neural network nodes
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8
    });

    const nodes = [];
    const connections = [];

    // Create nodes in layers
    const layers = [8, 12, 8, 4]; // Neural network architecture
    let nodeId = 0;

    layers.forEach((layerSize, layerIndex) => {
        const layerNodes = [];
        for (let i = 0; i < layerSize; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
            
            // Position nodes
            const x = (layerIndex - layers.length / 2) * 3;
            const y = (i - layerSize / 2) * 0.8;
            const z = (Math.random() - 0.5) * 2;
            
            node.position.set(x, y, z);
            node.userData = { id: nodeId++, layer: layerIndex, originalY: y };
            
            scene.add(node);
            nodes.push(node);
            layerNodes.push(node);
        }

        // Create connections to next layer
        if (layerIndex < layers.length - 1) {
            const nextLayerSize = layers[layerIndex + 1];
            layerNodes.forEach(node => {
                // Connect to random nodes in next layer (not all)
                const connectionsCount = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < connectionsCount; i++) {
                    const targetIndex = Math.floor(Math.random() * nextLayerSize);
                    const connection = {
                        from: node,
                        toIndex: layerIndex + 1,
                        targetNode: targetIndex,
                        opacity: Math.random() * 0.3 + 0.1
                    };
                    connections.push(connection);
                }
            });
        }
    });

    // Create connection lines
    connections.forEach(connection => {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ 
            color: 0x8a2be2,
            transparent: true,
            opacity: connection.opacity
        });
        
        const line = new THREE.Line(geometry, material);
        connection.line = line;
        scene.add(line);
    });

    camera.position.z = 8;
    camera.position.y = 0;

    // Animation loop
    function animateNeuralNetwork() {
        animationId = requestAnimationFrame(animateNeuralNetwork);

        const time = Date.now() * 0.001;

        // Animate nodes
        nodes.forEach((node, index) => {
            // Floating animation
            node.position.y = node.userData.originalY + Math.sin(time + index * 0.5) * 0.2;
            
            // Pulsing effect
            const scale = 1 + Math.sin(time * 2 + index) * 0.2;
            node.scale.setScalar(scale);
            
            // Color animation
            const hue = (time * 0.1 + index * 0.1) % 1;
            node.material.color.setHSL(0.55 + hue * 0.1, 1, 0.6);
        });

        // Update connections
        connections.forEach(connection => {
            const fromPos = connection.from.position;
            const toNode = nodes.find(n => 
                n.userData.layer === connection.toIndex && 
                nodes.filter(node => node.userData.layer === connection.toIndex).indexOf(n) === connection.targetNode
            );
            
            if (toNode) {
                const toPos = toNode.position;
                const positions = new Float32Array([
                    fromPos.x, fromPos.y, fromPos.z,
                    toPos.x, toPos.y, toPos.z
                ]);
                
                connection.line.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                // Animate connection opacity
                const opacity = connection.opacity + Math.sin(time * 3) * 0.1;
                connection.line.material.opacity = Math.max(0.1, opacity);
            }
        });

        // Rotate entire scene slowly
        scene.rotation.y = time * 0.1;
        scene.rotation.x = Math.sin(time * 0.05) * 0.1;

        renderer.render(scene, camera);
    }

    animateNeuralNetwork();
}

// Binary rain effect
function setupBinaryRain() {
    const binaryRain = document.getElementById('binary-rain');
    const columns = Math.floor(window.innerWidth / 20);
    const drops = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * window.innerHeight / 20);
    }

    function createBinaryRain() {
        binaryRain.innerHTML = '';
        
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.style.position = 'absolute';
            column.style.left = i * 20 + 'px';
            column.style.top = '0';
            column.style.width = '20px';
            column.style.height = '100%';
            column.style.overflow = 'hidden';
            
            for (let j = 0; j < Math.floor(window.innerHeight / 20); j++) {
                const char = document.createElement('div');
                char.textContent = Math.random() > 0.5 ? '1' : '0';
                char.style.height = '20px';
                char.style.lineHeight = '20px';
                char.style.textAlign = 'center';
                char.style.opacity = Math.random() * 0.5;
                column.appendChild(char);
            }
            
            binaryRain.appendChild(column);
        }
    }

    function animateBinaryRain() {
        const columns = binaryRain.children;
        
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const chars = column.children;
            
            // Move column down
            drops[i]++;
            
            if (drops[i] * 20 > window.innerHeight && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Update characters
            for (let j = 0; j < chars.length; j++) {
                const char = chars[j];
                if (j === drops[i]) {
                    char.style.opacity = '1';
                    char.style.color = '#00d4ff';
                } else if (j === drops[i] - 1) {
                    char.style.opacity = '0.7';
                    char.style.color = '#00ffff';
                } else if (j === drops[i] - 2) {
                    char.style.opacity = '0.4';
                    char.style.color = '#ffffff';
                } else {
                    char.style.opacity = '0.1';
                    char.style.color = '#00d4ff';
                }
                
                // Randomly change character
                if (Math.random() > 0.98) {
                    char.textContent = Math.random() > 0.5 ? '1' : '0';
                }
            }
        }
    }

    createBinaryRain();
    setInterval(animateBinaryRain, 100);
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .contact-item, .resume-card');
    animateElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Handle scroll events
function handleScroll() {
    // Parallax effect for hero section
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (hero && heroBackground) {
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
    }

    // Progress indicator (optional)
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled_percentage = (winScroll / height) * 100;
    
    // You can add a progress bar here if needed
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Resume download functionality
function setupResumeDownload() {
    const downloadButton = document.getElementById('download-resume');
    
    downloadButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create a sample PDF content (in a real scenario, you'd have an actual PDF file)
        const pdfContent = `
            Hritik Singh - AI Engineer
            
            EXPERIENCE:
            • Senior AI Engineer at TechCorp (2022-Present)
            • Machine Learning Engineer at DataSoft (2020-2022)
            • Junior Data Scientist at StartupXYZ (2019-2020)
            
            EDUCATION:
            • M.S. in Computer Science, IIT Mumbai (2019)
            • B.Tech in Computer Engineering, NIT Delhi (2017)
            
            SKILLS:
            • Python, TensorFlow, PyTorch, Scikit-learn
            • Deep Learning, Neural Networks, Computer Vision
            • AWS, Docker, Kubernetes, MLOps
            
            PROJECTS:
            • Neural Style Transfer System
            • Real-time Sentiment Analyzer
            • Advanced Object Detection Platform
            • AI-powered Recommendation Engine
        `;
        
        // Create and download a text file (in production, this would be a PDF)
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Hritik_Singh_AI_Engineer_Resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Resume downloaded successfully!', 'success');
    });
}

// Project cards interaction
function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove glow effect
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        });
        
        // Handle project card clicks
        card.addEventListener('click', function() {
            const projectName = this.dataset.project;
            showProjectDetails(projectName);
        });
    });
}

// Show project details (modal or redirect)
function showProjectDetails(projectName) {
    const projectDetails = {
        'neural-style-transfer': {
            title: 'Neural Style Transfer',
            description: 'A deep learning project that applies artistic styles to images using convolutional neural networks. Built with TensorFlow and VGG-19 architecture.',
            technologies: ['Python', 'TensorFlow', 'OpenCV', 'NumPy'],
            features: [
                'Real-time style transfer',
                'Multiple artistic styles',
                'Batch processing support',
                'Web interface for easy use'
            ],
            github: 'https://github.com/hritiksingh/neural-style-transfer',
            demo: 'https://neural-style-demo.herokuapp.com'
        },
        'sentiment-analyzer': {
            title: 'Real-time Sentiment Analyzer',
            description: 'NLP-powered sentiment analysis system that processes social media data in real-time using BERT and transformer models.',
            technologies: ['Python', 'BERT', 'Flask', 'MongoDB'],
            features: [
                'Real-time processing',
                'Multi-language support',
                'Emotion detection',
                'Analytics dashboard'
            ],
            github: 'https://github.com/hritiksingh/sentiment-analyzer',
            demo: 'https://sentiment-analyzer-demo.com'
        }
        // Add more project details as needed
    };
    
    const project = projectDetails[projectName];
    if (project) {
        // In a real implementation, you might open a modal or navigate to a detailed page
        showNotification(`Opening ${project.title} details...`, 'info');
        
        // For demo purposes, we'll just show a notification
        setTimeout(() => {
            showNotification(`${project.title}: ${project.description}`, 'info');
        }, 1000);
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Handle window resize
function handleResize() {
    if (renderer && camera) {
        const container = document.getElementById('neural-network').parentElement;
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
    
    // Recreate binary rain for new window size
    setupBinaryRain();
}

// Cleanup function
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
        renderer.dispose();
    }
}

// Handle page unload
window.addEventListener('beforeunload', cleanup);

// Additional utility functions
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll handler
window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps

// Console welcome message
console.log(`
🚀 Welcome to Hritik Singh's AI Engineer Portfolio!
🤖 Built with modern web technologies and AI-themed animations
💡 Interested in the code? Check out the source!
📧 Contact: hritik.singh@example.com
`);

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.toString() === konamiSequence.toString()) {
        showNotification('🎉 Easter egg activated! You found the secret code!', 'success');
        // Add some fun effect
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
