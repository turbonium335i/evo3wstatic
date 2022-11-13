// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements

const textInput = document.querySelector("#question");
const readBtn = document.querySelector("#read");

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== "undefined";

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach((voice) => {
    // Create option element
    const option = document.createElement("option");
    // Fill option with voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";

    // Set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
  });
};

//Line 35, 36 causes voice list duplication
getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//Fix for duplication, run code depending on the browser
if (isFirefox) {
  getVoices();
}
if (isChrome) {
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
  }
}

// Speak
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error("Already speaking...");
    return;
  }
  if (textInput.value !== "") {
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(cQuestion);

    // Speak end
    speakText.onend = (e) => {
      console.log("Done reading...");
    };

    // Speak error
    speakText.onerror = (e) => {
      console.error("Something went wrong");
    };

    // Speak
    synth.speak(speakText);
  }
};

// EVENT LISTENERS

// Text form submit
readBtn.addEventListener("click", (e) => {
  e.preventDefault();
  speak();
});
