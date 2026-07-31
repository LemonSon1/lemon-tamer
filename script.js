const loaderScreen = document.getElementById("loader-screen");
const loaderFill = document.querySelector(".loader-fill");
const loadingText = document.getElementById("loading-text");
const bubblesContainer = document.querySelector(".bubbles");

const loadingMessages = [
    "Initializing...",
    "Loading assets...",
    "Preparing interface...",
    "Optimizing experience...",
    "Almost ready..."
];

let progress = 0;
let messageIndex = 0;

// -----------------------------
// Bubble Generator
// -----------------------------
function createBubble() {
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    const size = Math.random() * 14 + 6;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    bubble.style.left = `${Math.random() * 100}%`;

    bubble.style.animationDuration = `${Math.random() * 4 + 4}s`;
    bubble.style.animationDelay = `${Math.random() * 0.5}s`;

    bubblesContainer.appendChild(bubble);

    bubble.addEventListener("animationend", () => {
        bubble.remove();
    });
}

const bubbleInterval = setInterval(createBubble, 180);

// -----------------------------
// Loading Progress
// -----------------------------
function updateLoading() {

    progress += Math.random() * 6 + 1;

    if (progress > 100) progress = 100;

    loaderFill.style.width = `${progress}%`;

    const targetIndex = Math.min(
        Math.floor(progress / 25),
        loadingMessages.length - 1
    );

    if (targetIndex !== messageIndex) {
        messageIndex = targetIndex;
        loadingText.textContent = loadingMessages[messageIndex];
    }

    if (progress >= 100) {

        clearInterval(progressInterval);
        clearInterval(bubbleInterval);

        loadingText.textContent = "Welcome";

        loaderScreen.classList.add("loader-exit");

        setTimeout(() => {
            loaderScreen.classList.add("loader-hidden");
        }, 650);
    }
}

const progressInterval = setInterval(updateLoading, 120);

// Create initial bubbles
for (let i = 0; i < 20; i++) {
    setTimeout(createBubble, i * 80);
}