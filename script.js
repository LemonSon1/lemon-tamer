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

let progress = 0;
let finished = false;

// =========================
// Smooth fake loader
// =========================

function load() {

    if (!finished) {

        // Starts faster and gradually slows down
        const remaining = 100 - progress;

        progress += Math.max(remaining * 0.006, 0.05) + Math.random() * 0.12;

        if (progress >= 100) {

            progress = 100;
            finished = true;

            fill.style.width = "100%";

            finishLoader();

        } else {

            fill.style.width = progress + "%";

            requestAnimationFrame(load);
        }
    }
}

requestAnimationFrame(load);

// =========================
// Rotate loading text
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
// Finish animation
// =========================

function finishLoader() {

    clearInterval(textInterval);

    // small pause at 100%
    setTimeout(() => {

        loaderScreen.classList.add("loader-exit");

        // remove loader after shrink animation
        setTimeout(() => {

            loaderScreen.classList.add("loader-hidden");

            // Optional:
            // window.location.href = "home.html";

        }, 700);

    }, 500);
}

// =========================
// Bubble generator
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

    document
        .querySelector(".bubbles")
        .appendChild(bubble);

    bubble.addEventListener("animationend", () => {
        bubble.remove();
    });

}

const bubbleInterval = setInterval(() => {

    if (!finished)
        createBubble();
    else
        clearInterval(bubbleInterval);

}, 500);