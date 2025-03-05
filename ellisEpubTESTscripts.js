let speech = new SpeechSynthesisUtterance();
let isPaused = false;

function getReadableText() {
    let elements = document.body.querySelectorAll("*:not(.skipTTS):not(.skipTTS *)");
    let textContent = "";
    elements.forEach(el => {
        if (!el.closest(".skipTTS") && el.nodeType === Node.ELEMENT_NODE && el.tagName !== "BUTTON") {
            textContent += el.innerText.trim() + " ";
        }
    });
    return textContent.trim();
}

document.getElementById("readButton").addEventListener("click", function () {
    if (speechSynthesis.speaking && !speechSynthesis.paused) return;
    speech.text = getReadableText();
    speech.lang = "en-US";
    speech.rate = 1.0;
    speech.onend = () => (isPaused = false);
    speechSynthesis.speak(speech);
});

document.getElementById("pauseButton").addEventListener("click", function () {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        isPaused = true;
    }
});

document.getElementById("resumeButton").addEventListener("click", function () {
    if (isPaused) {
        speechSynthesis.resume();
        isPaused = false;
    }
});

document.getElementById("stopButton").addEventListener("click", function () {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        isPaused = false;
    }
});