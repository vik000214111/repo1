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
