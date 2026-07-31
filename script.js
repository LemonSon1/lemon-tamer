// =========================
// Customizable loading text
// =========================

const loadingTexts = [
    "Initializing...",
    "Loading assets...",
    "Preparing interface...",
    "Optimizing experience...",
    "Almost ready..."
];

const fill = document.querySelector(".loader-fill");
const text = document.getElementById("loading-text");
const loaderScreen = document.getElementById("loader-screen");
const bubblesContainer = document.querySelector(".bubbles");

// =========================
// Smooth Fake Loader
// =========================

let progress = 0;
let targetProgress = 0;
let finished = false;

function load() {

    if (finished) return;

    // Accelerates gradually
    targetProgress +=
        (0.03 + Math.pow(targetProgress / 100, 2) * 0.85)
        + Math.random() * 0.04;

    targetProgress = Math.min(targetProgress, 100);

    // Smooth interpolation
    progress += (targetProgress - progress) * 0.08;

    fill.style.width = progress + "%";

    if (targetProgress >= 100 && progress >= 99.7) {

        progress = 100;
        fill.style.width = "100%";

        finished = true;

        finishLoader();

        return;
    }

    requestAnimationFrame(load);
}

requestAnimationFrame(load);

// =========================
// Loading Text Rotation
// =========================

let textIndex = 0;

const textInterval = setInterval(() => {

    if (finished) return;

    text.style.opacity = 0;

    setTimeout(() => {

        textIndex = (textIndex + 1) % loadingTexts.length;

        text.textContent = loadingTexts[textIndex];

        text.style.opacity = 1;

    }, 180);

}, 2500);

// =========================
// Finish Animation
// =========================

function finishLoader() {

    clearInterval(textInterval);

    setTimeout(() => {

        loaderScreen.classList.add("loader-exit");

        setTimeout(() => {

            loaderScreen.classList.add("loader-hidden");

            // To open another page instead:
            // window.location.href = "home.html";

        }, 700);

    }, 500);
}

// =========================
// Bubble Generator
// =========================

function createBubble() {

    if (finished) return;

    const bubble = document.createElement("span");
    bubble.className = "bubble";

    const size = Math.random() * 6 + 7;

    bubble.style.width = size + "px";
    bubble.style.height = size + "px";

    bubble.style.left = Math.random() * 100 + "%";

    bubble.style.animationDuration =
        (Math.random() * 5 + 7) + "s";

    bubblesContainer.appendChild(bubble);

    bubble.addEventListener("animationend", () => {
        bubble.remove();
    });

}

const bubbleInterval = setInterval(() => {

    if (finished) {
        clearInterval(bubbleInterval);
        return;
    }

    createBubble();

}, 500);