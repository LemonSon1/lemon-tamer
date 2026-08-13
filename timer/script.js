const q = new URLSearchParams(location.search);

const num = (...keys) => {
    for (const k of keys) {
        const v = parseFloat(q.get(k));
        if (!isNaN(v) && v >= 0) return v;
    }
    return 0;
};

const total =
    Math.round(
        (num("h", "hours", "hour") * 3600 +
            num("m", "min", "mins", "minutes") * 60 +
            num("s", "sec", "secs", "seconds")) *
        1000
    ) || 5 * 60 * 1000;

const el = {
    base: document.getElementById("base"),
    over: document.getElementById("over"),
    label: document.getElementById("label"),
    toggle: document.getElementById("toggle"),
    reset: document.getElementById("reset"),
    hint: document.getElementById("hint")
};

let remaining = total; // ms left when paused
let endAt = 0; // wall-clock deadline when running
let running = false;
let finished = false;

const pad = (n) => String(n).padStart(2, "0");

function format(ms) {
    const t = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function describe(ms) {
    const t = Math.round(ms / 1000);
    const h = Math.floor(t / 3600);
    const m = Math.round((t % 3600) / 60);
    const parts = [];
    if (h) parts.push(`${h} hour${h > 1 ? "s" : ""}`);
    if (m) parts.push(`${m} minute${m > 1 ? "s" : ""}`);
    if (!parts.length) parts.push(`${t} second${t === 1 ? "" : "s"}`);
    return parts.join(" ") + " timer";
}

function paint() {
    const left = running ? endAt - Date.now() : remaining;
    const text = format(left);
    el.base.textContent = text;
    el.over.textContent = text;
    document.documentElement.style.setProperty(
        "--pct",
        (Math.max(0, Math.min(1, left / total)) * 100).toFixed(3) + "%"
    );
    document.title = finished ? "Time's up" : text;

    if (running && left <= 0) finish();
    if (running) requestAnimationFrame(paint);
}

function start() {
    if (finished) reset();
    endAt = Date.now() + remaining;
    running = true;
    el.toggle.textContent = "Pause";
    requestAnimationFrame(paint);
}

function pause() {
    remaining = Math.max(0, endAt - Date.now());
    running = false;
    el.toggle.textContent = "Resume";
    paint();
}

function reset() {
    running = false;
    finished = false;
    remaining = total;
    document.body.classList.remove("done");
    el.label.textContent = describe(total);
    el.toggle.textContent = "Start";
    paint();
}

function finish() {
    running = false;
    finished = true;
    remaining = 0;
    document.body.classList.add("done");
    el.label.textContent = "Time's up";
    el.toggle.textContent = "Start again";
    paint();
    chime();
}

function chime() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [0, 0.28, 0.56].forEach((offset) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = 880;
            osc.connect(gain).connect(ctx.destination);
            const t = ctx.currentTime + offset;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.25, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
            osc.start(t);
            osc.stop(t + 0.24);
        });
    } catch (e) {
        /* audio blocked — the colour change still reads */
    }
}

el.toggle.addEventListener("click", () => (running ? pause() : start()));
el.reset.addEventListener("click", reset);

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "BUTTON" && e.code === "Space") return;
    if (e.code === "Space") {
        e.preventDefault();
        running ? pause() : start();
    }
    if (e.key.toLowerCase() === "r") reset();
});

el.label.textContent = describe(total);
if (location.search) el.hint.hidden = true;
paint();

if (q.has("autostart")) start();
