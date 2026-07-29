// -------------------------
// Customizable loading text
// -------------------------

const loadingTexts = [
    "Initializing...",
    "Loading assets...",
    "Preparing interface...",
    "Optimizing experience...",
    "Almost there..."
];

// Change text every x milliseconds
const TEXT_INTERVAL = 2500;

// Fake loading speed
const SPEED = 0.35;

// Maximum fill before resetting
const MAX_PROGRESS = 97;

const fill = document.querySelector(".loader-fill");
const loadingText = document.getElementById("loading-text");

let progress = 0;
let lastTime = performance.now();

// -------------------------
// Loader animation
// Uses requestAnimationFrame
// so it PAUSES automatically
// when browser tab is hidden.
// -------------------------

function animate(time) {

    const delta = time - lastTime;
    lastTime = time;

    progress += SPEED * delta / 16.67;

    if (progress >= MAX_PROGRESS) {
        progress = 0;
    }

    fill.style.width = progress + "%";

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// -------------------------
// Loading text rotation
// -------------------------

let textIndex = 0;

setInterval(() => {

    loadingText.style.opacity = 0;

    setTimeout(() => {

        textIndex = (textIndex + 1) % loadingTexts.length;
        loadingText.textContent = loadingTexts[textIndex];
        loadingText.style.opacity = 1;

    }, 180);

}, TEXT_INTERVAL);