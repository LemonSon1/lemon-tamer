const bubbleContainer = document.getElementById("bubbles");

function createBubble(){

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    const size = Math.random()*8+3;

    bubble.style.width = size+"px";
    bubble.style.height = size+"px";

    bubble.style.left = Math.random()*100+"vw";

    bubble.style.animationDuration =
        (Math.random()*4+3)+"s";

    bubble.style.opacity = Math.random();

    bubbleContainer.appendChild(bubble);

    setTimeout(()=>{
        bubble.remove();
    },7000);

}

const bubbleInterval = setInterval(createBubble,120);

setTimeout(()=>{

    clearInterval(bubbleInterval);

    const loader=document.getElementById("loader");
    const content=document.getElementById("content");

    loader.style.transition="opacity .8s";
    loader.style.opacity="0";

    setTimeout(()=>{
        loader.remove();
        document.body.style.overflow="auto";
        content.style.opacity="1";
    },800);

},4000);
