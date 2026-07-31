// =========================
// Elements
// =========================

const fill = document.querySelector(".loader-fill");
const text = document.getElementById("loading-text");
const loaderScreen = document.getElementById("loader-screen");
const bubblesContainer = document.querySelector(".bubbles");

// =========================
// Loading Messages
// =========================

const loadingPool = [
    "Initializing...",
    "Loading assets...",
    "Preparing interface...",
    "Optimizing experience...",
    "Loading components...",
    "Connecting services...",
    "Fetching resources...",
    "Building interface...",
    "Caching resources...",
    "Generating UI...",
    "Compiling modules...",
    "Checking integrity...",
    "Loading textures...",
    "Rendering elements...",
    "Applying configuration...",
    "Syncing data...",
    "Starting engine...",
    "Verifying files...",
    "Configuring workspace...",
    "Loading animations...",
    "Preparing visuals...",
    "Linking modules...",
    "Optimizing shaders...",
    "Allocating memory...",
    "Finalizing setup..."
];

// =========================
// Shuffle
// =========================

function shuffle(array){

    const arr = [...array];

    for(let i = arr.length - 1; i > 0; i--){

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

const loadingTexts = shuffle(loadingPool).slice(0,4);
loadingTexts.push("Completed");

text.textContent = loadingTexts[0];

// =========================
// Fake Progress
// =========================

let progress = 0;
let targetProgress = 0;

let finished = false;
let textFinished = false;

function load(){

    if(finished) return;

    targetProgress +=
        (0.03 + Math.pow(targetProgress / 100,2) * 0.85) +
        Math.random() * 0.04;

    targetProgress = Math.min(targetProgress,100);

    progress += (targetProgress - progress) * 0.08;

    if(!textFinished && progress > 99)
        progress = 99;

    fill.style.width = progress + "%";

    requestAnimationFrame(load);
}

requestAnimationFrame(load);

// =========================
// Loading Text
// =========================

let index = 0;

const TEXT_DELAY = 2200;

const textInterval = setInterval(() => {

    text.style.opacity = "0";
    text.style.transform = "translateY(-8px)";

    setTimeout(() => {

        index++;

        if(index >= loadingTexts.length){

            clearInterval(textInterval);

            textFinished = true;

            progress = 100;
            targetProgress = 100;

            fill.style.width = "100%";

            text.textContent = "Completed";
            text.style.opacity = "1";
            text.style.transform = "translateY(0)";

            finished = true;

            finishLoader();

            return;
        }

        text.textContent = loadingTexts[index];

        requestAnimationFrame(() => {

            text.style.opacity = "1";
            text.style.transform = "translateY(0)";

        });

    },180);

},TEXT_DELAY);

// =========================
// Finish
// =========================

function finishLoader(){

    setTimeout(() => {

        loaderScreen.classList.add("loader-exit");

        setTimeout(() => {

            loaderScreen.classList.add("loader-hidden");

            // window.location.href = "home.html";

        },700);

    },700);

}

// =========================
// Bubble Generator
// =========================

function createBubble(){

    if(finished) return;

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

    if(finished){

        clearInterval(bubbleInterval);
        return;

    }

    createBubble();

},500);