const bubbleContainer = document.getElementById("bubbles");

function createBubble(){

    const bubble = document.createElement("div");

    bubble.classList.add("bubble");

    // Bigger bubbles
    const size = Math.random() * 18 + 8;

    bubble.style.width = size + "px";
    bubble.style.height = size + "px";

    bubble.style.left = Math.random() * 100 + "vw";

    bubble.style.animationDuration =
        (Math.random() * 4 + 4) + "s";

    bubble.style.opacity = Math.random() * .5 + .5;

    bubbleContainer.appendChild(bubble);

    setTimeout(()=>{
        bubble.remove();
    },8000);

}

const bubbleInterval = setInterval(createBubble,90);

// End loading
setTimeout(()=>{

    clearInterval(bubbleInterval);

    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    loader.style.transition = "opacity .9s ease";
    loader.style.opacity = "0";

    setTimeout(()=>{

        loader.remove();

        document.body.style.overflow = "auto";

        content.style.opacity = "1";

    },900);

},4000);
