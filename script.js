document.addEventListener('DOMContentLoaded', () => {
    // Add intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in');
            }
        });
    }, { threshold: 0.1 });

    // Observe all experience items
    document.querySelectorAll('.experience-item').forEach(item => {
        observer.observe(item);
    });

    // Add mouse tracking for project card glow effect
    document.querySelectorAll('.project-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
    // Typing effect for intro text
    const introText = document.getElementById('intro-text');
    const lines = introText.innerText.split('\n').map(line => line.trim());
    introText.innerHTML = '';

    let currentLine = 0;
    let currentChar = 0;
    let isTyping = true;

    function typeWriter() {
        if (currentLine < lines.length) {
            if (currentChar === 0) {
                introText.innerHTML += `<div class="line">${lines[currentLine].substring(0, currentChar)}<span class="cursor">█</span></div>`;
            }
            
            const currentLineElement = introText.children[currentLine];
            if (currentChar < lines[currentLine].length) {
                currentLineElement.innerHTML = lines[currentLine].substring(0, currentChar + 1) + '<span class="cursor">█</span>';
                currentChar++;
                setTimeout(typeWriter, 50);
            } else {
                currentLineElement.innerHTML = lines[currentLine];
                currentLine++;
                currentChar = 0;
                setTimeout(typeWriter, 500);
            }
        }
    }

    typeWriter();

    // Smooth scrolling for navigation
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

    // Terminal cursor effect
    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    cursor.textContent = '█';
    document.querySelector('.terminal-content').appendChild(cursor);

    // Add hover effect to project items
    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.borderColor = 'var(--terminal-text)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.borderColor = 'rgba(51, 255, 51, 0.1)';
        });
    });
});
