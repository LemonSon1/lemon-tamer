const loadingTexts = [
    "Initializing...",
    "Loading assets...",
    "Preparing interface...",
    "Optimizing experience...",
    "Almost ready..."
];

const fill = document.querySelector(".loader-fill");
const text = document.getElementById("loading-text");


// -----------------------
// Smooth non-linear loader
// -----------------------

let progress = 0;
let finished = false;

function load(){

    if(!finished){

        progress += (Math.random() * 0.18) + 0.03;

        if(progress >= 100){

            progress = 100;
            finished = true;

            text.textContent = "Complete";
        }

        fill.style.width = progress + "%";
    }

    requestAnimationFrame(load);
}

requestAnimationFrame(load);


// -----------------------
// Text changing
// -----------------------

let index = 0;

setInterval(()=>{

    if(finished) return;

    text.style.opacity = 0;

    setTimeout(()=>{

        index++;

        if(index >= loadingTexts.length)
            index = 0;

        text.textContent = loadingTexts[index];

        text.style.opacity = 1;

    },200);

},2500);



// -----------------------
// Bubble generator
// -----------------------

function createBubble(){

    const bubble = document.createElement("span");

    bubble.className = "bubble";


    const size = Math.random() * 6 + 7;

    bubble.style.width = size + "px";
    bubble.style.height = size + "px";


    bubble.style.left =
        Math.random() * 100 + "%";


    bubble.style.animationDuration =
        (Math.random() * 5 + 7) + "s";


    document
        .querySelector(".bubbles")
        .appendChild(bubble);


    setTimeout(()=>{
        bubble.remove();
    },12000);

}


setInterval(createBubble,500);
