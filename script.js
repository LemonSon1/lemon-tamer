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


    setTimeout(() => {

        bubble.remove();

    }, 12000);

}


setInterval(createBubble, 500);