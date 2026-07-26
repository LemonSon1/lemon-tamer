// Cursor glow
const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (e) => {
    if (!glow) return;

    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

// Back to top button
const topButton = document.getElementById("topButton");

window.addEventListener("scroll", () => {

    if (topButton) {

        if (window.scrollY > 300) {

            topButton.style.display = "block";

        } else {

            topButton.style.display = "none";

        }

    }

    revealElements();

});

// Back to top action
if (topButton) {

    topButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    });

}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", (event) => {

        const target = document.querySelector(link.getAttribute("href"));

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({

            behavior: "smooth"

        });

    });

});

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

}, {

    threshold: 0.15

});

function revealElements() {

    document.querySelectorAll(

        ".card, .friend-card, h2, .section-text"

    ).forEach(element => {

        if (element.dataset.loaded) return;

        element.dataset.loaded = "true";

        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        observer.observe(element);

    });

}

revealElements();

// Hero animation
const hero = document.querySelector(".hero-content");

if (hero) {

    hero.animate(

        [

            {

                opacity: 0,
                transform: "translateY(40px)"

            },

            {

                opacity: 1,
                transform: "translateY(0)"

            }

        ],

        {

            duration: 900,
            easing: "ease-out",
            fill: "forwards"

        }

    );

}

// Navbar shadow
const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 30) {

        header.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.35)";

    } else {

        header.style.boxShadow = "none";

    }

});

// Fade in page
window.addEventListener("load", () => {

    document.body.style.opacity = "1";

});
