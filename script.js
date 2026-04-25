document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Background
    initParticles();

    // 2. State Management (Persistence)
    const isUnlocked = sessionStorage.getItem('unlocked');
    if (isUnlocked === 'true') {
        // Skip loading and go straight to memories
        document.getElementById('loading-screen').classList.remove('active');
        transitionToScreen('memories-screen');
        setTimeout(startTypingEffect, 1000);
    } else {
        startLoading();
    }

    // 3. Unlock Logic
    setupUnlock();

    // 4. Action Buttons
    setupButtons();
});

// --- Particles Background ---
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(0, 210, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

// --- Loading Screen ---
function startLoading() {
    const progressBar = document.getElementById('progress-bar');
    const loaderText = document.getElementById('loader-text');
    const statusLine = document.getElementById('status-line');
    const glitchOverlay = document.getElementById('glitch-overlay');
    
    const messages = [
        "Initializing Memories...",
        "Decrypting Batch 2022–2026...",
        "Rendering Final Moments..."
    ];

    const statusUpdates = [
        "Fetching data packets...",
        "Connecting to neural network...",
        "Bypassing firewalls...",
        "Optimizing experience flow...",
        "Finalizing interface..."
    ];

    let progress = 0;
    let msgIndex = 0;
    let statusIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 2.5;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;

        // Subtle glitch flicker
        if (Math.random() > 0.95) {
            glitchOverlay.style.opacity = '0.2';
            setTimeout(() => glitchOverlay.style.opacity = '0', 50);
        }

        // Update main text
        if (progress > (msgIndex + 1) * 33 && msgIndex < messages.length - 1) {
            msgIndex++;
            loaderText.style.opacity = '0';
            setTimeout(() => {
                loaderText.innerText = messages[msgIndex];
                loaderText.style.opacity = '1';
            }, 200);
        }

        // Update status line
        if (progress > (statusIndex + 1) * 20 && statusIndex < statusUpdates.length - 1) {
            statusIndex++;
            statusLine.innerText = statusUpdates[statusIndex];
        }

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => transitionToScreen('unlock-screen'), 1000);
        }
    }, 120);
}

// --- Unlock Logic ---
function setupUnlock() {
    const input = document.getElementById('unlock-input');
    const feedback = document.getElementById('input-feedback');
    const validInputs = ["batch 22-26", "batch 2022-2026", "22-26", "farewell batch"];

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.toLowerCase().trim();
            if (validInputs.includes(val)) {
                handleSuccess();
            } else {
                handleError();
            }
        }
    });
}

function handleError() {
    const input = document.getElementById('unlock-input');
    const feedback = document.getElementById('input-feedback');
    
    input.classList.add('shake');
    feedback.innerText = "Access Denied 😅";
    feedback.classList.add('error');
    
    // Red flash
    const flash = document.getElementById('flash-overlay');
    flash.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    flash.style.opacity = '1';
    
    setTimeout(() => {
        input.classList.remove('shake');
        flash.style.opacity = '0';
        setTimeout(() => {
            feedback.innerText = "";
            feedback.classList.remove('error');
        }, 1500);
    }, 500);
}

function handleSuccess() {
    const flash = document.getElementById('flash-overlay');
    const glitch = document.getElementById('glitch-overlay');
    const feedback = document.getElementById('input-feedback');

    sessionStorage.setItem('unlocked', 'true'); // Save state
    feedback.innerText = "Access Granted 🎓";
    feedback.style.color = "#00d2ff";

    // Big moment effects
    glitch.style.opacity = '0.5';
    flash.style.backgroundColor = '#fff';
    flash.style.opacity = '1';

    setTimeout(() => {
        flash.style.opacity = '0';
        glitch.style.opacity = '0';
        transitionToScreen('memories-screen');
        
        // Start typing effect for creator credit after second page loads
        setTimeout(startTypingEffect, 1500);
    }, 800);
}

// --- Screen Transition ---
function transitionToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    const logoutBtn = document.getElementById('logout-btn');

    if (screenId === 'memories-screen') {
        document.body.style.overflowY = 'auto';
        logoutBtn.style.display = 'block';
    } else {
        document.body.style.overflowY = 'hidden';
        logoutBtn.style.display = 'none';
    }
}

// --- Logout ---
function handleLogout() {
    sessionStorage.removeItem('unlocked');

    const flash = document.getElementById('flash-overlay');
    flash.style.backgroundColor = 'rgba(0,0,0,0.8)';
    flash.style.transition = 'opacity 0.4s ease';
    flash.style.opacity = '1';

    setTimeout(() => {
        document.getElementById('logout-btn').style.display = 'none';
        transitionToScreen('unlock-screen');
        document.getElementById('unlock-input').value = '';
        document.getElementById('input-feedback').innerText = '';
        flash.style.opacity = '0';
        flash.style.backgroundColor = 'white'; // Reset for next use
    }, 400);
}

// --- Buttons & Animations ---
function setupButtons() {
    // Ripple Effect
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const circle = document.createElement('div');
            const d = Math.max(this.clientWidth, this.clientHeight);
            const rect = this.getBoundingClientRect();
            
            circle.style.width = circle.style.height = d + 'px';
            circle.style.left = e.clientX - rect.left - d/2 + 'px';
            circle.style.top = e.clientY - rect.top - d/2 + 'px';
            circle.classList.add('ripple-circle');
            
            this.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    });

    // Download Button Burst
    const downloadBtn = document.getElementById('download-btn');

    // When user comes back from Drive tab, show "Transfer Complete"
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && downloadBtn.dataset.opened === 'true') {
            // Ensure we stay on memories screen
            transitionToScreen('memories-screen');
            // Mark complete
            downloadBtn.dataset.opened = 'false';
            downloadBtn.dataset.complete = 'true';
            setTransferComplete();
        }
    });
}

function setTransferComplete() {
    const downloadBtn = document.getElementById('download-btn');
    const span = document.getElementById('download-btn-text');
    const sub = document.getElementById('download-btn-sub');

    span.innerText = '✅ TRANSFER COMPLETE';
    sub.innerText = 'Memories delivered';
    downloadBtn.classList.remove('loading');
    downloadBtn.style.pointerEvents = 'auto';
    downloadBtn.style.borderColor = 'var(--accent-blue)';
    downloadBtn.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.4)';

    // Cyan flash effect
    const flash = document.getElementById('flash-overlay');
    flash.style.backgroundColor = 'rgba(0, 210, 255, 0.15)';
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.opacity = '0'; }, 600);
}

function handleDriveClick(e) {
    const downloadBtn = document.getElementById('download-btn');

    // If already marked complete, just let the link open normally
    if (downloadBtn.dataset.complete === 'true') {
        return;
    }

    // Mark that we opened the tab so visibilitychange knows to react
    downloadBtn.dataset.opened = 'true';

    const span = document.getElementById('download-btn-text');
    const rect = downloadBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Particle burst
    for (let i = 0; i < 40; i++) {
        createParticleBurst(centerX, centerY);
    }

    // Sci-fi loading states (runs while Drive opens in new tab)
    downloadBtn.classList.add('loading');
    span.innerText = 'ESTABLISHING LINK...';
    downloadBtn.style.pointerEvents = 'none';

    const stream = document.createElement('div');
    stream.className = 'data-stream';
    document.body.appendChild(stream);

    setTimeout(() => {
        span.innerText = 'OPENING DRIVE...';
        setTimeout(() => {
            stream.remove();
            downloadBtn.style.pointerEvents = 'auto';
        }, 1500);
    }, 1000);
}

function createParticleBurst(x, y) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.width = '4px';
    p.style.height = '4px';
    p.style.backgroundColor = Math.random() > 0.5 ? '#00d2ff' : '#9d50bb';
    p.style.borderRadius = '50%';
    p.style.boxShadow = '0 0 10px ' + p.style.backgroundColor;
    
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 10 + 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    let op = 1;
    const anim = setInterval(() => {
        x += vx;
        y += vy;
        op -= 0.02;
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.opacity = op;

        if (op <= 0) {
            clearInterval(anim);
            p.remove();
        }
    }, 16);
}

// --- Creator Credit Typing ---
function startTypingEffect() {
    const credit = document.getElementById('creator-credit');
    const textSpan = credit.querySelector('.typing-text');
    
    // Ensure we don't type "undefined" or repeat if already typing
    if (textSpan.dataset.typing === "true") return;
    
    const fullText = "Edited the memories,engineered the experience —Mohamed Fazil";
    textSpan.innerText = "";
    textSpan.style.visibility = 'visible';
    credit.style.opacity = '1';
    textSpan.dataset.typing = "true";

    let i = 0;
    const type = setInterval(() => {
        if (fullText[i] === ' ') {
            textSpan.innerHTML += '&nbsp;'; 
        } else if (fullText[i] !== undefined) {
            textSpan.innerText += fullText[i];
        }
        i++;
        if (i >= fullText.length) {
            clearInterval(type);
            textSpan.dataset.typing = "false";
            setTimeout(() => {
                textSpan.style.borderRight = "none";
            }, 1000);
        }
    }, 40);
}
