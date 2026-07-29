const bubbleContainer = document.getElementById("bubbles");
const progress = document.querySelector(".loader-progress");

let progressValue = 0;

function createBubble() {

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    const size = Math.random() * 18 + 8;

    bubble.style.width = size + "px";
    bubble.style.height = size + "px";

    bubble.style.left = Math.random() * 100 + "vw";

    bubble.style.animationDuration =
        (Math.random() * 4 + 4) + "s";

    bubbleContainer.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, 8000);
}

const bubbleInterval = setInterval(createBubble, 90);

// Remove the CSS animation because JS controls it now
progress.style.animation = "none";

function updateLoader() {

    if (progressValue < 15) {
        progressValue += Math.random() * 2.5;
    }
    else if (progressValue < 35) {
        progressValue += Math.random() * 0.8;
    }
    else if (progressValue < 55) {
        progressValue += Math.random() * 2;
    }
    else if (progressValue < 75) {
        progressValue += Math.random() * 0.6;
    }
    else if (progressValue < 90) {
        progressValue += Math.random() * 1.2;
    }
    else if (progressValue < 99) {
        progressValue += Math.random() * 0.25;
    }
    else {
        progressValue = 100;
    }

    progress.style.width = progressValue + "%";

    if (progressValue >= 100) {

        clearInterval(loaderInterval);
        clearInterval(bubbleInterval);

        const loader = document.getElementById("loader");
        const content = document.getElementById("content");

        loader.style.transition = "opacity .8s ease";
        loader.style.opacity = "0";

        setTimeout(() => {

            loader.remove();

            document.body.style.overflow = "auto";

            content.style.opacity = "1";

        }, 800);

    }

}

const loaderInterval = setInterval(updateLoader, 80);
