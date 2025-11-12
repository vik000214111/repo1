# The Memory Archive

An interactive narrative experience with three distinct story paths, each leading to a unique ending.

## Overview

The Memory Archive is a web-based interactive story where players explore a mysterious library that holds forgotten memories. Through choices and interactions, players can experience three different narrative routes, each offering unique gameplay mechanics and endings.

## Three Routes

### 📘 Follow the Breathing Diary
- **Narrative**: Uncover the library's hidden truth and ancient records
- **Gameplay**: Puzzle-solving, page-turning, layered storytelling
- **Ending**: Become "The Librarian," keeper of all memories
- **Mechanics**: Swipe/navigate through pages, discover hidden text

### 🪶 Listen to the Whispering Walls
- **Narrative**: Enter others' memories and relive forgotten stories
- **Gameplay**: Emotional immersion, voice interaction
- **Ending**: Lose your own identity, merge with countless memories
- **Mechanics**: Tap memory bubbles to activate voices, experience the chorus

### ⚙️ Break the Machine
- **Narrative**: Rebel against the system and attempt to escape
- **Gameplay**: Tension, countdown, collapsing interface
- **Ending**: Escape or destroy the knowledge world — multiple interpretations
- **Mechanics**: Press buttons to destabilize the system, watch reality collapse

## Features

### Core Features
- **6 Interactive Screens**: Opening scene, choice menu, 3 unique routes, and ending display
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Support**: Swipe gestures for page turning on touch devices
- **Keyboard Shortcuts**: Arrow keys for navigation, ESC to return
- **Progress Tracking**: Your completed paths are saved locally
- **Archive System**: View all unlocked endings

### Enhanced Visual Effects
- **Ambient Atmosphere**:
  - 50+ floating dust particles with dynamic animations
  - Floating orbs with parallax effects
  - Interactive candles with flickering flames
  - Glowing light rays and ripple effects

- **Advanced Animations**:
  - Glitch text effects on titles
  - Page curl effects on book interface
  - Soundwave visualizations (7 bars)
  - Wire network with electric sparks
  - Screen shake effects (3 intensity levels)
  - Parchment-style interfaces with aged textures

### Enhanced Interactivity

#### Opening Scene Enhancements
- **Floating Mini-Books**: 4 interactive books that respond to mouse movement (parallax)
- **Interactive Candles**: Click to extinguish flames
- **Ripple Effect**: Click the main book to create expanding ripples
- **Mouse Tracking**: Elements respond to cursor position
- **Easter Egg**: Find and click all mini-books for a secret message

#### Choice Screen Enhancements
- **Live Previews**: Hover over each path to see animated preview of the route
- **Particle Effects**: 20 particles per choice card
- **Dynamic Glows**: Expanding glow effects on hover
- **Route-Specific Animations**:
  - Book: Page text reveal animation
  - Wall: Soundwave pulse with echoes
  - Machine: Circuit flow and countdown display

#### Book Route Interactive Elements
- **8 Hidden Secrets**: Click special words to reveal secrets
- **Secret Counter**: Track your discoveries (top-right)
- **Interactive Annotations**: 4 margin notes with hover popups
- **Magnifying Glass**: Follows your cursor over the text
- **Mini Puzzle**: Connect the dots to reveal hidden paths
- **Floating Symbols**: Moon and star symbols that drift
- **Dramatic Reveals**: Final page with revelation overlay
- **Page Curl Effect**: Dynamic corner that responds to hover

#### Wall Route Interactive Elements
- **Sub-Memories**: Each voice has 2 hidden memories that appear when activated
- **Voice Connections**: Visual lines connect activated memories
- **Voice Intensity Meter**: Shows collective voice power
- **Memory Fragments**: 5 floating text fragments drifting across the wall
- **Wall Faces**: Subtle silhouettes fading in/out
- **Enhanced Soundwaves**: 7-bar audio visualizer
- **Bubble Pulse Effects**: Animated ripples on each bubble
- **Memory Icons**: Unique icon for each voice (candle, moon, star, sparkle)

#### Machine Route Interactive Elements
- **Multiple Status Displays**:
  - System Stability (main)
  - Core Temperature (with warning states)
  - Memory Integrity (degrading with stability)
- **Interactive Controls**:
  - Emergency Override switch (toggle)
  - Power Level dial (rotatable)
  - 4 destruction buttons with icons
- **Visual Feedback**:
  - Wire network with pulsing electricity
  - Electric sparks at 4 corners
  - 4 warning lights (blinking in sequence)
  - Button glow effects on click
  - Progressive screen shake (3 levels)
- **Dynamic States**:
  - Normal → Warning → Critical temperature
  - Stable → Unstable → Failing → Destroyed
  - Color-coded status bars

## How to Play

### Getting Started
1. Open `index.html` in a modern web browser
2. **Explore the Opening Scene**:
   - Move your mouse to see parallax effects
   - Click floating mini-books (find all 4 for a secret!)
   - Click candles to extinguish them
   - Click the main glowing book to enter (watch for ripples!)

3. **Choose Your Path**:
   - Hover over each choice to see animated previews
   - Watch for particle effects and glowing animations
   - Read the experience descriptions carefully

### Playing Each Route

#### 📘 Book Route - "Follow the Breathing Diary"
- **Navigate pages** using arrow keys, next/previous buttons, or swipe gestures
- **Click highlighted words** to reveal hidden secrets (8 total!)
- **Hover over margin annotations** (※, ✎, ☆, ✦) to read notes
- **Watch for the magnifying glass** following your cursor
- **Solve the puzzle** by clicking the dots in sequence
- **Track your progress** with the secret counter (top-right)
- **Wait for text reveals** - some words glow or fade to reveal truth
- **Page 3**: Final dramatic revelation unlocks the ending

#### 🪶 Wall Route - "Listen to the Whispering Walls"
- **Click voice bubbles** to activate memories (4 total)
- **Discover sub-memories** - each voice has 2 hidden memories
- **Watch the voice meter** grow as you activate more voices
- **See connections form** - visual lines link activated voices
- **Read floating fragments** drifting across the wall
- **Find wall faces** hidden in the texture
- **Complete all 4 voices** to merge with the chorus

#### ⚙️ Machine Route - "Break the Machine"
- **Monitor status displays**:
  - System Stability (center)
  - Core Temperature (changes with actions)
  - Memory Integrity (degrades with stability)
- **Use interactive controls**:
  - Toggle Emergency Override switch
  - Rotate Power Level dial
  - Press destruction buttons (4 types, increasing damage)
- **Watch for warnings**:
  - Blinking warning lights
  - Electric sparks at corners
  - Screen shake intensifies
  - Wire network pulses
- **Bring stability to 0%** to trigger escape sequence

### Ending
5. View your unique ending with an archive card
6. **Replay** to experience other paths
7. **View Archives** to see all unlocked endings

## Visual Themes

The game features a cohesive aesthetic inspired by:
- Ancient library corridors with warm lighting
- Floating, glowing books and particles
- Surreal text emerging on walls
- Archive cards with aged paper textures
- Mechanical devices merged with paper and ink
- Dreamlike lighting and atmospheric effects

## Technical Details

- **Pure HTML/CSS/JavaScript**: No external dependencies required
- **Responsive Design**: Mobile and desktop friendly
- **LocalStorage**: Progress saving between sessions
- **Web Audio API**: Simple sound effects (optional)
- **CSS Animations**: Smooth transitions and effects
- **Touch Events**: Swipe support for mobile devices

## Browser Compatibility

Works best in modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Game logic and interactivity
└── README.md       # This file
```

## Customization

You can easily customize:
- **Story Content**: Edit the HTML text in `index.html`
- **Visual Style**: Modify colors, animations in `styles.css`
- **Game Logic**: Adjust endings, mechanics in `script.js`
- **Sound Effects**: Replace the placeholder sounds with actual audio files

## Credits

Created as an interactive fiction experience exploring themes of memory, identity, and choice.

## License

Free to use and modify for personal and educational purposes.

---

*"Every story has multiple endings. Which one will you choose?"*
