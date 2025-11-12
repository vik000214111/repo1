// Game State
const gameState = {
    currentScreen: 'opening-scene',
    currentRoute: null,
    currentPage: 1,
    totalPages: 3,
    completedRoutes: [],
    machineStability: 100,
    memoriesActivated: 0
};

// Endings Configuration
const endings = {
    book: {
        title: "The Librarian's Destiny",
        icon: "📘",
        description: "You have accepted your role as the eternal keeper of memories. Every story, every life, every forgotten moment now flows through you. You are no longer just a visitor—you ARE the Archive. Time has no meaning here. You will remember everything, forever.",
        pathName: "Follow the Breathing Diary",
        type: "Eternal Keeper"
    },
    wall: {
        title: "The Chorus of Souls",
        icon: "🪶",
        description: "Your voice joins the countless others in the walls. Individual identity fades as you merge with an ocean of memories and experiences. You are everyone and no one. The boundaries of self dissolve into something greater—a collective consciousness that whispers through eternity.",
        pathName: "Listen to the Whispering Walls",
        type: "Merged Consciousness"
    },
    machine: {
        title: "The Rebel's Freedom",
        icon: "⚙️",
        description: "In your final act of defiance, you shattered the machine that held countless memories prisoner. As reality collapses around you, a doorway of light appears. Whether you escaped to freedom or destroyed everything along with yourself remains uncertain. But you chose your own ending.",
        pathName: "Break the Machine",
        type: "Liberation or Destruction"
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    createParticles();
    loadProgress();
});

// Create particle system
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialize game events
function initializeGame() {
    // Opening scene - glowing book
    const glowingBook = document.querySelector('.glowing-book');
    if (glowingBook) {
        glowingBook.addEventListener('click', () => {
            playSound('book-open');
            switchScreen('choice-screen');
        });
    }

    // Choice cards
    const choiceCards = document.querySelectorAll('.choice-card');
    choiceCards.forEach(card => {
        card.addEventListener('click', () => {
            const route = card.dataset.route;
            playSound('choice-select');
            startRoute(route);
        });

        // Hover sound effect
        card.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });

    // Route A: Book navigation
    initializeBookRoute();

    // Route B: Wall interactions
    initializeWallRoute();

    // Route C: Machine controls
    initializeMachineRoute();

    // Ending screen
    initializeEndingScreen();
}

// Switch between screens
function switchScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
    }
}

// Start a specific route
function startRoute(route) {
    gameState.currentRoute = route;

    switch(route) {
        case 'book':
            switchScreen('route-book');
            gameState.currentPage = 1;
            updateBookPage();
            break;
        case 'wall':
            switchScreen('route-wall');
            gameState.memoriesActivated = 0;
            break;
        case 'machine':
            switchScreen('route-machine');
            gameState.machineStability = 100;
            startMachineSequence();
            break;
    }
}

// Route A: Book Route
function initializeBookRoute() {
    const prevBtn = document.querySelector('.page-nav.prev');
    const nextBtn = document.querySelector('.page-nav.next');
    const endBtn = document.querySelector('#route-book .route-end-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (gameState.currentPage > 1) {
                gameState.currentPage--;
                updateBookPage();
                playSound('page-turn');
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (gameState.currentPage < gameState.totalPages) {
                gameState.currentPage++;
                updateBookPage();
                playSound('page-turn');
            }
        });
    }

    if (endBtn) {
        endBtn.addEventListener('click', () => {
            playSound('ending');
            completeRoute('book');
        });
    }

    // Swipe support for touch devices
    let touchStartX = 0;
    const bookInterface = document.querySelector('.book-interface');
    if (bookInterface) {
        bookInterface.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        bookInterface.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && gameState.currentPage < gameState.totalPages) {
                    gameState.currentPage++;
                    updateBookPage();
                    playSound('page-turn');
                } else if (diff < 0 && gameState.currentPage > 1) {
                    gameState.currentPage--;
                    updateBookPage();
                    playSound('page-turn');
                }
            }
        });
    }
}

function updateBookPage() {
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, index) => {
        page.classList.remove('active');
        if (index + 1 === gameState.currentPage) {
            page.classList.add('active');
        }
    });

    // Update page indicator
    const indicator = document.querySelector('.page-indicator');
    if (indicator) {
        indicator.textContent = `Page ${gameState.currentPage} of ${gameState.totalPages}`;
    }

    // Update navigation buttons
    const prevBtn = document.querySelector('.page-nav.prev');
    const nextBtn = document.querySelector('.page-nav.next');

    if (prevBtn) prevBtn.disabled = gameState.currentPage === 1;
    if (nextBtn) nextBtn.disabled = gameState.currentPage === gameState.totalPages;

    // Reveal hidden text on page 1
    if (gameState.currentPage === 1) {
        setTimeout(() => {
            const hiddenText = document.querySelector('.page[data-page="1"] .hidden-text');
            if (hiddenText) hiddenText.style.animation = 'reveal-hidden 3s ease-in-out forwards';
        }, 6000);
    }

    // Reveal hidden text and show end button on final page
    if (gameState.currentPage === gameState.totalPages) {
        setTimeout(() => {
            const hiddenTexts = document.querySelectorAll('.page[data-page="3"] .hidden-text');
            hiddenTexts.forEach(text => {
                text.style.animation = 'reveal-hidden 3s ease-in-out forwards';
            });
        }, 6000);

        setTimeout(() => {
            const endBtn = document.querySelector('#route-book .route-end-btn');
            if (endBtn) {
                endBtn.style.display = 'block';
                endBtn.style.animation = 'breathe-in 1s ease-in-out forwards';
            }
        }, 9000);
    }
}

// Route B: Wall Route
function initializeWallRoute() {
    const bubbles = document.querySelectorAll('.bubble');
    const endBtn = document.querySelector('#route-wall .route-end-btn');
    const wallMessage = document.querySelector('.wall-message');

    bubbles.forEach((bubble, index) => {
        bubble.addEventListener('click', () => {
            if (!bubble.classList.contains('activated')) {
                bubble.classList.add('activated');
                playSound('whisper');
                gameState.memoriesActivated++;

                // Add terminal-like sound effect
                bubble.style.animation = 'none';
                setTimeout(() => {
                    bubble.style.animation = '';
                }, 10);

                // Show end button when all memories are activated
                if (gameState.memoriesActivated >= bubbles.length) {
                    if (wallMessage) wallMessage.style.display = 'none';
                    if (endBtn) {
                        setTimeout(() => {
                            endBtn.style.display = 'block';
                            endBtn.style.animation = 'breathe-in 1s ease-in-out forwards';
                        }, 1000);
                    }
                }
            }
        });
    });

    if (endBtn) {
        endBtn.addEventListener('click', () => {
            playSound('ending');
            completeRoute('wall');
        });
    }
}

// Route C: Machine Route
function initializeMachineRoute() {
    const controlButtons = document.querySelectorAll('.control-btn');
    const endBtn = document.querySelector('#route-machine .route-end-btn');
    const terminalOutput = document.querySelector('.terminal-output');
    const countdownValue = document.querySelector('.countdown-value');
    const glitchEffect = document.querySelector('.screen-glitch');

    controlButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            handleMachineAction(action, button, terminalOutput, countdownValue, glitchEffect);
            playSound('machine-beep');
        });
    });

    if (endBtn) {
        endBtn.addEventListener('click', () => {
            playSound('ending');
            completeRoute('machine');
        });
    }
}

function startMachineSequence() {
    const terminalOutput = document.querySelector('.terminal-output');

    // Add initial terminal messages
    setTimeout(() => addTerminalLine('> ANALYZING SYSTEM ARCHITECTURE...', 'terminal-line'), 1000);
    setTimeout(() => addTerminalLine('> VULNERABILITIES DETECTED', 'terminal-line'), 2000);
    setTimeout(() => addTerminalLine('> AWAITING USER INPUT', 'terminal-line'), 3000);
}

function handleMachineAction(action, button, terminalOutput, countdownValue, glitchEffect) {
    button.disabled = true;

    const messages = {
        override: {
            text: '> PROTOCOL OVERRIDE INITIATED...',
            damage: 15
        },
        disable: {
            text: '> SAFEGUARDS DISABLED - SYSTEM UNSTABLE',
            damage: 20
        },
        corrupt: {
            text: '> CORRUPTING MEMORY BANKS...',
            damage: 25
        },
        destroy: {
            text: '> CRITICAL SYSTEM FAILURE IMMINENT',
            damage: 40
        }
    };

    const actionData = messages[action];
    addTerminalLine(actionData.text, 'terminal-line warning');

    // Reduce stability
    gameState.machineStability -= actionData.damage;
    if (gameState.machineStability < 0) gameState.machineStability = 0;

    countdownValue.textContent = gameState.machineStability + '%';

    // Add visual effects based on stability
    if (gameState.machineStability < 50) {
        glitchEffect.classList.add('active');
        countdownValue.classList.add('critical');
    }

    if (gameState.machineStability < 30) {
        addTerminalLine('> ERROR: CONTAINMENT BREACH', 'terminal-line error');
    }

    // Show ending button when stability is low enough
    if (gameState.machineStability <= 0) {
        addTerminalLine('> SYSTEM DESTROYED - EXIT PORTAL OPENING', 'terminal-line error');
        const endBtn = document.querySelector('#route-machine .route-end-btn');
        if (endBtn) {
            setTimeout(() => {
                endBtn.style.display = 'block';
                endBtn.style.animation = 'breathe-in 1s ease-in-out forwards';
            }, 1000);
        }

        // Disable all remaining buttons
        document.querySelectorAll('.control-btn').forEach(btn => btn.disabled = true);
    }
}

function addTerminalLine(text, className) {
    const terminalOutput = document.querySelector('.terminal-output');
    if (terminalOutput) {
        const line = document.createElement('p');
        line.className = className;
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

// Complete a route and show ending
function completeRoute(route) {
    if (!gameState.completedRoutes.includes(route)) {
        gameState.completedRoutes.push(route);
        saveProgress();
    }

    showEnding(route);
}

function showEnding(route) {
    const ending = endings[route];

    // Update ending screen content
    document.getElementById('ending-title').textContent = ending.title;
    document.querySelector('.ending-icon').textContent = ending.icon;
    document.getElementById('ending-description').textContent = ending.description;
    document.getElementById('path-name').textContent = ending.pathName;
    document.getElementById('ending-type-label').textContent = ending.type;

    // Switch to ending screen
    switchScreen('ending-screen');
}

// Initialize ending screen buttons
function initializeEndingScreen() {
    const replayBtn = document.getElementById('replay-btn');
    const archivesBtn = document.getElementById('archives-btn');

    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            playSound('choice-select');
            resetGame();
            switchScreen('choice-screen');
        });
    }

    if (archivesBtn) {
        archivesBtn.addEventListener('click', () => {
            playSound('choice-select');
            showArchivesModal();
        });
    }

    // Archives modal
    const modal = document.getElementById('archives-modal');
    const closeModal = document.querySelector('.close-modal');

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

function showArchivesModal() {
    const modal = document.getElementById('archives-modal');
    const archivePaths = document.querySelectorAll('.archive-path');

    // Update unlock status
    archivePaths.forEach((path, index) => {
        const routes = ['book', 'wall', 'machine'];
        if (gameState.completedRoutes.includes(routes[index])) {
            path.dataset.unlocked = 'true';
        }
    });

    modal.classList.add('active');
}

// Reset game state
function resetGame() {
    gameState.currentPage = 1;
    gameState.currentRoute = null;
    gameState.machineStability = 100;
    gameState.memoriesActivated = 0;

    // Reset book pages
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, index) => {
        page.classList.remove('active');
        if (index === 0) page.classList.add('active');
    });

    // Reset wall bubbles
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => bubble.classList.remove('activated'));

    // Reset machine
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(button => button.disabled = false);

    const terminalOutput = document.querySelector('.terminal-output');
    if (terminalOutput) terminalOutput.innerHTML = '';

    const glitchEffect = document.querySelector('.screen-glitch');
    if (glitchEffect) glitchEffect.classList.remove('active');

    // Hide all end buttons
    document.querySelectorAll('.route-end-btn').forEach(btn => {
        btn.style.display = 'none';
    });
}

// Sound effects (placeholder function - can be enhanced with Web Audio API)
function playSound(soundType) {
    // This is a placeholder for sound effects
    // In a full implementation, you would use Web Audio API or audio files
    console.log(`Playing sound: ${soundType}`);

    // Optional: Add simple beep sounds using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Different frequencies for different sounds
        const frequencies = {
            'hover': 200,
            'choice-select': 440,
            'page-turn': 330,
            'whisper': 220,
            'machine-beep': 523,
            'ending': 880,
            'book-open': 392
        };

        oscillator.frequency.value = frequencies[soundType] || 440;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Audio not supported or blocked
    }
}

// Save and load progress
function saveProgress() {
    try {
        localStorage.setItem('memoryArchiveProgress', JSON.stringify({
            completedRoutes: gameState.completedRoutes
        }));
    } catch (e) {
        console.log('Could not save progress');
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('memoryArchiveProgress');
        if (saved) {
            const data = JSON.parse(saved);
            gameState.completedRoutes = data.completedRoutes || [];
        }
    } catch (e) {
        console.log('Could not load progress');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to go back
    if (e.key === 'Escape') {
        if (gameState.currentScreen.includes('route-')) {
            switchScreen('choice-screen');
        }
    }

    // Arrow keys for book navigation
    if (gameState.currentScreen === 'route-book') {
        if (e.key === 'ArrowLeft' && gameState.currentPage > 1) {
            gameState.currentPage--;
            updateBookPage();
            playSound('page-turn');
        } else if (e.key === 'ArrowRight' && gameState.currentPage < gameState.totalPages) {
            gameState.currentPage++;
            updateBookPage();
            playSound('page-turn');
        }
    }
});

// Prevent accidental page refresh
window.addEventListener('beforeunload', (e) => {
    if (gameState.currentScreen !== 'opening-scene') {
        e.preventDefault();
        e.returnValue = '';
    }
});

console.log('The Memory Archive - Interactive Story Initialized');
console.log('Created with love for storytelling and interactive fiction');

// ==========================================
// ENHANCED INTERACTIVE FEATURES - V2
// ==========================================

// Enhanced Game State
Object.assign(gameState, {
    secretsFound: 0,
    totalSecrets: 8,
    voiceIntensity: 0,
    puzzleSolved: false,
    mouseX: 0,
    mouseY: 0,
    coreTemp: 0,
    memoryIntegrity: 100
});

// Initialize Enhanced Features
function initializeEnhancedFeatures() {
    initializeOpeningSceneEnhancements();
    initializeChoiceScreenEnhancements();
    initializeBookEnhancements();
    initializeWallEnhancements();
    initializeMachineEnhancements();
}

// Call enhanced features after DOM load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeEnhancedFeatures();
    }, 100);
});

// ========== OPENING SCENE ENHANCEMENTS ==========

function initializeOpeningSceneEnhancements() {
    const corridor = document.querySelector('.corridor');
    const glowingBook = document.querySelector('.glowing-book');
    const hoverHint = document.querySelector('.hover-hint');
    const miniBooks = document.querySelectorAll('.mini-book');
    const candles = document.querySelectorAll('.candle');
    
    // Create floating orbs
    createFloatingOrbs();
    
    // Mouse tracking for magnifying glass effect and parallax
    if (corridor) {
        corridor.addEventListener('mousemove', (e) => {
            const rect = corridor.getBoundingClientRect();
            gameState.mouseX = e.clientX - rect.left;
            gameState.mouseY = e.clientY - rect.top;
            
            // Move mini books slightly with mouse (parallax)
            miniBooks.forEach((book, index) => {
                const speed = 0.02 + (index * 0.01);
                const x = (gameState.mouseX - rect.width / 2) * speed;
                const y = (gameState.mouseY - rect.height / 2) * speed;
                book.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    // Glowing book click with ripple effect
    if (glowingBook) {
        glowingBook.addEventListener('click', (e) => {
            const ripple = glowingBook.querySelector('.ripple-effect');
            if (ripple) {
                ripple.classList.remove('active');
                void ripple.offsetWidth; // Trigger reflow
                ripple.classList.add('active');
            }
        });
    }
    
    // Interactive mini books
    miniBooks.forEach(book => {
        book.addEventListener('click', (e) => {
            e.stopPropagation();
            book.style.animation = 'none';
            setTimeout(() => {
                book.style.animation = '';
            }, 10);
            playSound('book-open');
            
            // Easter egg: click all mini books
            book.dataset.clicked = 'true';
            const allClicked = Array.from(miniBooks).every(b => b.dataset.clicked === 'true');
            if (allClicked && hoverHint) {
                hoverHint.textContent = '✨ You found the hidden books! ✨';
                hoverHint.style.color = '#00ff00';
            }
        });
    });
    
    // Interactive candles - blow them out with click
    candles.forEach(candle => {
        const flame = candle.querySelector('.flame');
        candle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (flame) {
                flame.style.animation = 'flame-extinguish 0.5s ease forwards';
                setTimeout(() => {
                    flame.style.display = 'none';
                }, 500);
                playSound('whisper');
            }
        });
    });
}

function createFloatingOrbs() {
    const orbsContainer = document.querySelector('.floating-orbs');
    if (!orbsContainer) return;
    
    for (let i = 0; i < 10; i++) {
        const orb = document.createElement('div');
        orb.className = 'floating-orb';
        orb.style.left = Math.random() * 100 + '%';
        orb.style.top = Math.random() * 100 + '%';
        orb.style.animationDelay = Math.random() * 8 + 's';
        orb.style.animationDuration = (Math.random() * 5 + 8) + 's';
        orbsContainer.appendChild(orb);
    }
}

// ========== CHOICE SCREEN ENHANCEMENTS ==========

function initializeChoiceScreenEnhancements() {
    const choiceCards = document.querySelectorAll('.choice-card');
    const pathPreview = document.querySelector('.path-preview');
    
    choiceCards.forEach(card => {
        const cardParticles = card.querySelector('.card-particles');
        
        // Create card particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            cardParticles.appendChild(particle);
        }
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            const route = card.dataset.route;
            if (pathPreview) {
                const previews = {
                    book: '📖 Discover ancient secrets hidden in breathing pages...',
                    wall: '🌊 Listen to echoes of forgotten souls...',
                    machine: '⚡ Tear down the system from within...'
                };
                pathPreview.textContent = previews[route];
                pathPreview.style.color = '#ffd764';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (pathPreview) {
                pathPreview.textContent = 'Hover over a path to preview...';
                pathPreview.style.color = 'rgba(255, 215, 100, 0.6)';
            }
        });
    });
}

// ========== BOOK ROUTE ENHANCEMENTS ==========

function initializeBookEnhancements() {
    initializeClickableWords();
    initializeAnnotations();
    initializeMagnifyingGlass();
    initializePuzzle();
    updateSecretCounter();
}

function initializeClickableWords() {
    const clickableWords = document.querySelectorAll('.clickable-word');
    
    clickableWords.forEach(word => {
        word.addEventListener('click', () => {
            if (!word.classList.contains('revealed')) {
                word.classList.add('revealed');
                gameState.secretsFound++;
                updateSecretCounter();
                playSound('choice-select');
                
                // Show secret tooltip
                const secret = word.dataset.secret;
                showSecretTooltip(word, `Secret revealed: "${secret}"`);
            }
        });
    });
}

function initializeAnnotations() {
    const annotations = document.querySelectorAll('.annotation');
    
    annotations.forEach(annotation => {
        annotation.addEventListener('click', (e) => {
            e.stopPropagation();
            const popup = annotation.querySelector('.annotation-popup');
            if (popup) {
                popup.style.opacity = '1';
                popup.style.visibility = 'visible';
                setTimeout(() => {
                    popup.style.opacity = '0';
                    popup.style.visibility = 'hidden';
                }, 3000);
            }
            playSound('whisper');
        });
    });
}

function initializeMagnifyingGlass() {
    const bookInterface = document.querySelector('.book-interface');
    const magnifyingGlass = document.querySelector('.magnifying-glass');
    
    if (bookInterface && magnifyingGlass) {
        bookInterface.addEventListener('mousemove', (e) => {
            const rect = bookInterface.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            magnifyingGlass.style.left = (x - 40) + 'px';
            magnifyingGlass.style.top = (y - 40) + 'px';
        });
        
        bookInterface.addEventListener('mouseenter', () => {
            magnifyingGlass.style.opacity = '0.6';
        });
        
        bookInterface.addEventListener('mouseleave', () => {
            magnifyingGlass.style.opacity = '0';
        });
    }
}

function initializePuzzle() {
    const puzzleDots = document.querySelectorAll('.puzzle-dot');
    const puzzleLines = document.querySelector('.puzzle-lines');
    let selectedDots = [];
    
    puzzleDots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (!gameState.puzzleSolved) {
                dot.classList.add('connected');
                selectedDots.push(dot);
                
                if (selectedDots.length > 1) {
                    drawPuzzleLine(selectedDots[selectedDots.length - 2], dot, puzzleLines);
                }
                
                if (selectedDots.length === puzzleDots.length) {
                    gameState.puzzleSolved = true;
                    gameState.secretsFound++;
                    updateSecretCounter();
                    showSecretTooltip(puzzleLines, '✨ Puzzle solved! Hidden path revealed!');
                }
                
                playSound('choice-select');
            }
        });
    });
}

function drawPuzzleLine(dot1, dot2, svg) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const rect = svg.getBoundingClientRect();
    const rect1 = dot1.getBoundingClientRect();
    const rect2 = dot2.getBoundingClientRect();
    
    const x1 = rect1.left - rect.left + rect1.width / 2;
    const y1 = rect1.top - rect.top + rect1.height / 2;
    const x2 = rect2.left - rect.left + rect2.width / 2;
    const y2 = rect2.top - rect.top + rect2.height / 2;
    
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', 'puzzle-line');
    line.setAttribute('stroke-dasharray', '1000');
    line.setAttribute('stroke-dashoffset', '1000');
    
    svg.appendChild(line);
}

function updateSecretCounter() {
    const secretCount = document.getElementById('secret-count');
    if (secretCount) {
        secretCount.textContent = gameState.secretsFound;
        if (gameState.secretsFound === gameState.totalSecrets) {
            secretCount.parentElement.style.background = 'rgba(0, 255, 0, 0.2)';
            secretCount.parentElement.style.borderColor = '#00ff00';
        }
    }
}

function showSecretTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'secret-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 255, 0, 0.9);
        color: #000;
        padding: 8px 15px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        animation: tooltip-appear 2s ease forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 40) + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
        tooltip.remove();
    }, 2000);
}

// ========== WALL ROUTE ENHANCEMENTS ==========

function initializeWallEnhancements() {
    const bubbles = document.querySelectorAll('.bubble');
    const voiceMeter = document.querySelector('.meter-fill');
    const voiceConnections = document.querySelector('.voice-connections');
    
    bubbles.forEach((bubble, index) => {
        bubble.addEventListener('click', () => {
            if (!bubble.classList.contains('activated')) {
                bubble.classList.add('activated');
                gameState.memoriesActivated++;
                gameState.voiceIntensity += 25;
                
                // Update voice meter
                if (voiceMeter) {
                    voiceMeter.style.width = gameState.voiceIntensity + '%';
                }
                
                // Draw connection lines
                if (voiceConnections && index > 0) {
                    const prevBubble = bubbles[index - 1];
                    drawVoiceConnection(prevBubble, bubble, voiceConnections);
                }
                
                // Activate sub-memories
                setTimeout(() => {
                    const subMemories = bubble.querySelectorAll('.sub-memory');
                    subMemories.forEach(sub => {
                        sub.style.animation = 'sub-memory-appear 0.5s ease forwards';
                    });
                }, 500);
                
                playSound('whisper');
            }
        });
    });
    
    // Animate soundwaves
    animateSoundwaves();
}

function drawVoiceConnection(bubble1, bubble2, svg) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const svgRect = svg.getBoundingClientRect();
    const rect1 = bubble1.getBoundingClientRect();
    const rect2 = bubble2.getBoundingClientRect();
    
    const x1 = rect1.left - svgRect.left + rect1.width / 2;
    const y1 = rect1.top - svgRect.top + rect1.height / 2;
    const x2 = rect2.left - svgRect.left + rect2.width / 2;
    const y2 = rect2.top - svgRect.top + rect2.height / 2;
    
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', 'voice-line');
    line.setAttribute('filter', 'url(#glow)');
    
    svg.appendChild(line);
}

function animateSoundwaves() {
    const soundwaves = document.querySelectorAll('.soundwave');
    soundwaves.forEach((wave, index) => {
        wave.style.animationDelay = (index * 0.15) + 's';
    });
}

// ========== MACHINE ROUTE ENHANCEMENTS ==========

function initializeMachineEnhancements() {
    const emergencySwitch = document.getElementById('emergency-switch');
    const dial = document.querySelector('.dial');
    const controlButtons = document.querySelectorAll('.control-btn');
    
    // Emergency switch
    if (emergencySwitch) {
        emergencySwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                addTerminalLine('> EMERGENCY OVERRIDE ACTIVATED', 'terminal-line warning');
                gameState.coreTemp += 20;
                updateMachineStatus();
                playSound('machine-beep');
            }
        });
    }
    
    // Power dial
    if (dial) {
        let rotation = 0;
        dial.addEventListener('click', () => {
            rotation += 45;
            if (rotation > 180) rotation = 0;
            const indicator = dial.querySelector('.dial-indicator');
            if (indicator) {
                indicator.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
            }
            gameState.coreTemp = rotation / 2;
            updateMachineStatus();
            playSound('machine-beep');
        });
    }
    
    // Enhanced control buttons with visual feedback
    controlButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Trigger button glow effect
            const glow = button.querySelector('.btn-glow');
            if (glow) {
                glow.style.width = '200%';
                glow.style.height = '200%';
                setTimeout(() => {
                    glow.style.width = '0';
                    glow.style.height = '0';
                }, 500);
            }
            
            // Trigger sparks
            triggerSparks();
            
            // Update machine status
            updateMachineStatus();
        });
    });
    
    // Activate warning lights and wires
    animateWarningLights();
    animateWires();
}

function updateMachineStatus() {
    const tempValue = document.querySelector('.temp-value');
    const tempFill = document.querySelector('.temp-fill');
    const integrityValue = document.querySelector('.integrity-value');
    const integrityFill = document.querySelector('.integrity-fill');
    const shakeLevel = document.querySelector('.shake-level');
    const machineInterface = document.querySelector('.machine-interface');
    
    // Update temperature
    if (tempValue && tempFill) {
        const temp = gameState.coreTemp;
        if (temp < 50) {
            tempValue.textContent = 'NORMAL';
            tempFill.style.width = temp + '%';
            tempFill.classList.remove('warning', 'critical');
        } else if (temp < 80) {
            tempValue.textContent = 'WARNING';
            tempFill.style.width = temp + '%';
            tempFill.classList.add('warning');
            tempFill.classList.remove('critical');
        } else {
            tempValue.textContent = 'CRITICAL';
            tempFill.style.width = '100%';
            tempFill.classList.add('critical');
        }
    }
    
    // Update memory integrity
    const integrity = Math.max(0, gameState.memoryIntegrity - (100 - gameState.machineStability));
    if (integrityValue && integrityFill) {
        integrityValue.textContent = integrity + '%';
        integrityFill.style.width = integrity + '%';
        
        if (integrity < 50) {
            integrityFill.classList.add('degraded');
        }
        if (integrity < 30) {
            integrityFill.classList.add('critical');
        }
    }
    
    // Update screen shake
    if (shakeLevel && machineInterface) {
        machineInterface.classList.remove('shake-light', 'shake-medium', 'shake-heavy');
        
        if (gameState.machineStability > 50) {
            shakeLevel.textContent = 'STABLE';
            shakeLevel.classList.remove('warning', 'critical');
        } else if (gameState.machineStability > 25) {
            shakeLevel.textContent = 'UNSTABLE';
            shakeLevel.classList.add('warning');
            shakeLevel.classList.remove('critical');
            machineInterface.classList.add('shake-light');
        } else if (gameState.machineStability > 0) {
            shakeLevel.textContent = 'FAILING';
            shakeLevel.classList.add('critical');
            machineInterface.classList.add('shake-medium');
        } else {
            shakeLevel.textContent = 'DESTROYED';
            shakeLevel.classList.add('critical');
            machineInterface.classList.add('shake-heavy');
        }
    }
}

function triggerSparks() {
    const sparks = document.querySelectorAll('.spark');
    sparks.forEach(spark => {
        spark.style.animation = 'none';
        setTimeout(() => {
            spark.style.animation = 'spark-fly 2s infinite';
        }, 10);
    });
}

function animateWarningLights() {
    const lights = document.querySelectorAll('.warning-light');
    lights.forEach((light, index) => {
        setTimeout(() => {
            light.style.animation = 'warning-blink 1s infinite';
        }, index * 250);
    });
}

function animateWires() {
    const wires = document.querySelectorAll('.wire');
    wires.forEach((wire, index) => {
        wire.style.animationDelay = (index * 0.3) + 's';
    });
}

// ========== ADDITIONAL ANIMATIONS ==========

// Add CSS animation for tooltips
const style = document.createElement('style');
style.textContent = `
    @keyframes tooltip-appear {
        0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        10% { opacity: 1; transform: translateX(-50%) translateY(0); }
        90% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
    
    @keyframes flame-extinguish {
        to {
            transform: translateX(-50%) scaleY(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Enhanced Interactive Features Loaded! 🎮');
console.log('- Opening Scene: Floating orbs, interactive candles, mini-books');
console.log('- Choice Screen: Live previews, particle effects');
console.log('- Book Route: ' + gameState.totalSecrets + ' secrets to find, puzzles, annotations');
console.log('- Wall Route: Voice connections, sub-memories, intensity meter');
console.log('- Machine Route: Multiple status bars, switches, dials, screen shake');

