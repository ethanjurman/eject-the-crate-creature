export type Menu = {
  font: string;
};

const saved = {
  keyboard: localStorage.getItem("keyboard"),
  font: localStorage.getItem("font"),
  glow: localStorage.getItem("glow"),
  opening: localStorage.getItem("opening"),
  ttsVolume: localStorage.getItem("ttsVolume"),
  ttsSpeed: localStorage.getItem("ttsSpeed"),
  seVolume: localStorage.getItem("seVolume"),
  musicVolume: localStorage.getItem("musicVolume"),
};

const updateKeyboard = (keyboard: String) => {
  const cargoTiny = document.getElementById("cargo-tiny") as HTMLDivElement;
  if (keyboard === "QWERTY") {
    cargoTiny.innerHTML = `<div id="key-Digit1" aria-hidden="true">1</div>
            <div id="key-Digit2" aria-hidden="true">2</div>
            <div id="key-Digit3" aria-hidden="true">3</div>
            <div id="key-Digit4" aria-hidden="true">4</div>
            <div id="key-Digit5" aria-hidden="true">5</div>
            <div id="key-Digit6" aria-hidden="true">6</div>
            <div id="key-Digit7" aria-hidden="true">7</div>
            <div id="key-Digit8" aria-hidden="true">8</div>
            <div id="key-Digit9" aria-hidden="true">9</div>
            <div id="key-KeyQ" aria-hidden="true">Q</div>
            <div id="key-KeyW" aria-hidden="true">W</div>
            <div id="key-KeyE" aria-hidden="true">E</div>
            <div id="key-KeyR" aria-hidden="true">R</div>
            <div id="key-KeyT" aria-hidden="true">T</div>
            <div id="key-KeyY" aria-hidden="true">Y</div>
            <div id="key-KeyU" aria-hidden="true">U</div>
            <div id="key-KeyI" aria-hidden="true">I</div>
            <div id="key-KeyO" aria-hidden="true">O</div>
            <div id="key-KeyA" aria-hidden="true">A</div>
            <div id="key-KeyS" aria-hidden="true">S</div>
            <div id="key-KeyD" aria-hidden="true">D</div>
            <div id="key-KeyF" aria-hidden="true">F</div>
            <div id="key-KeyG" aria-hidden="true">G</div>
            <div id="key-KeyH" aria-hidden="true">H</div>
            <div id="key-KeyJ" aria-hidden="true">J</div>
            <div id="key-KeyK" aria-hidden="true">K</div>
            <div id="key-KeyL" aria-hidden="true">L</div>
            <div id="key-KeyZ" aria-hidden="true">Z</div>
            <div id="key-KeyX" aria-hidden="true">X</div>
            <div id="key-KeyC" aria-hidden="true">C</div>
            <div id="key-KeyV" aria-hidden="true">V</div>
            <div id="key-KeyB" aria-hidden="true">B</div>
            <div id="key-KeyN" aria-hidden="true">N</div>
            <div id="key-KeyM" aria-hidden="true">M</div>
            <div id="key-Comma" aria-hidden="true">,</div>
            <div id="key-Period" aria-hidden="true">.</div>`;
  } else if (keyboard === "QWERTZ") {
    cargoTiny.innerHTML = `<div id="key-Digit1" aria-hidden="true">1</div>
            <div id="key-Digit2" aria-hidden="true">2</div>
            <div id="key-Digit3" aria-hidden="true">3</div>
            <div id="key-Digit4" aria-hidden="true">4</div>
            <div id="key-Digit5" aria-hidden="true">5</div>
            <div id="key-Digit6" aria-hidden="true">6</div>
            <div id="key-Digit7" aria-hidden="true">7</div>
            <div id="key-Digit8" aria-hidden="true">8</div>
            <div id="key-Digit9" aria-hidden="true">9</div>
            <div id="key-KeyQ" aria-hidden="true">Q</div>
            <div id="key-KeyW" aria-hidden="true">W</div>
            <div id="key-KeyE" aria-hidden="true">E</div>
            <div id="key-KeyR" aria-hidden="true">R</div>
            <div id="key-KeyT" aria-hidden="true">T</div>
            <div id="key-KeyZ" aria-hidden="true">Z</div>
            <div id="key-KeyU" aria-hidden="true">U</div>
            <div id="key-KeyI" aria-hidden="true">I</div>
            <div id="key-KeyO" aria-hidden="true">O</div>
            <div id="key-KeyA" aria-hidden="true">A</div>
            <div id="key-KeyS" aria-hidden="true">S</div>
            <div id="key-KeyD" aria-hidden="true">D</div>
            <div id="key-KeyF" aria-hidden="true">F</div>
            <div id="key-KeyG" aria-hidden="true">G</div>
            <div id="key-KeyH" aria-hidden="true">H</div>
            <div id="key-KeyJ" aria-hidden="true">J</div>
            <div id="key-KeyK" aria-hidden="true">K</div>
            <div id="key-KeyL" aria-hidden="true">L</div>
            <div id="key-KeyY" aria-hidden="true">Y</div>
            <div id="key-KeyX" aria-hidden="true">X</div>
            <div id="key-KeyC" aria-hidden="true">C</div>
            <div id="key-KeyV" aria-hidden="true">V</div>
            <div id="key-KeyB" aria-hidden="true">B</div>
            <div id="key-KeyN" aria-hidden="true">N</div>
            <div id="key-KeyM" aria-hidden="true">M</div>
            <div id="key-Comma" aria-hidden="true">,</div>
            <div id="key-Period" aria-hidden="true">.</div>`;
  } else if (keyboard === "AZERTY") {
    cargoTiny.innerHTML = `<div id="key-Digit1" aria-hidden="true">1</div>
            <div id="key-Digit2" aria-hidden="true">2</div>
            <div id="key-Digit3" aria-hidden="true">3</div>
            <div id="key-Digit4" aria-hidden="true">4</div>
            <div id="key-Digit5" aria-hidden="true">5</div>
            <div id="key-Digit6" aria-hidden="true">6</div>
            <div id="key-Digit7" aria-hidden="true">7</div>
            <div id="key-Digit8" aria-hidden="true">8</div>
            <div id="key-Digit9" aria-hidden="true">9</div>
            <div id="key-KeyA" aria-hidden="true">A</div>
            <div id="key-KeyZ" aria-hidden="true">Z</div>
            <div id="key-KeyE" aria-hidden="true">E</div>
            <div id="key-KeyR" aria-hidden="true">R</div>
            <div id="key-KeyT" aria-hidden="true">T</div>
            <div id="key-KeyY" aria-hidden="true">Y</div>
            <div id="key-KeyU" aria-hidden="true">U</div>
            <div id="key-KeyI" aria-hidden="true">I</div>
            <div id="key-KeyO" aria-hidden="true">O</div>
            <div id="key-KeyQ" aria-hidden="true">Q</div>
            <div id="key-KeyS" aria-hidden="true">S</div>
            <div id="key-KeyD" aria-hidden="true">D</div>
            <div id="key-KeyF" aria-hidden="true">F</div>
            <div id="key-KeyG" aria-hidden="true">G</div>
            <div id="key-KeyH" aria-hidden="true">H</div>
            <div id="key-KeyJ" aria-hidden="true">J</div>
            <div id="key-KeyK" aria-hidden="true">K</div>
            <div id="key-KeyL" aria-hidden="true">L</div>
            <div id="key-KeyW" aria-hidden="true">W</div>
            <div id="key-KeyX" aria-hidden="true">X</div>
            <div id="key-KeyC" aria-hidden="true">C</div>
            <div id="key-KeyV" aria-hidden="true">V</div>
            <div id="key-KeyB" aria-hidden="true">B</div>
            <div id="key-KeyN" aria-hidden="true">N</div>
            <div id="key-Comma" aria-hidden="true">,</div>
            <div id="key-Semicolon" aria-hidden="true">;</div>
            <div id="key-Colon" aria-hidden="true">:</div>`;
  }
};

const initMenuAudio = (
  localStorageKey: string,
  audioElement: HTMLAudioElement,
  buttonElement: HTMLButtonElement,
  iconElement: HTMLImageElement,
  inputElement: HTMLInputElement,
  onChangeInput = (newVal: string) => {
    audioElement.volume = Number(newVal);
    localStorage.setItem(localStorageKey, newVal);
  }
) => {
  inputElement.addEventListener("input", () =>
    onChangeInput(inputElement.value)
  );

  buttonElement.onclick = () => {
    if (audioElement.paused) {
      iconElement.src = "./icon-stop.png";
      audioElement.play();
    } else {
      iconElement.src = "./icon-play.png";
      audioElement.pause();
    }
  };
};

const keyboardSelection = document.getElementById(
  "keyboard-selection"
) as HTMLSelectElement;
keyboardSelection.addEventListener("change", function () {
  localStorage.setItem("keyboard", this.value);
  updateKeyboard(this.value);
});

const fontSelection = document.getElementById(
  "font-selection"
) as HTMLSelectElement;
fontSelection.addEventListener("change", function () {
  localStorage.setItem("font", this.value);
  document.documentElement.style.setProperty("--dynamic-font", this.value);
});

const fontGlowSelection = document.getElementById(
  "font-glow"
) as HTMLSelectElement;
fontGlowSelection.addEventListener("change", function () {
  localStorage.setItem("glow", this.value);
  document.documentElement.style.setProperty("--font-glow", this.value);
});

const openingNarrationSelection = document.getElementById(
  "opening-select"
) as HTMLSelectElement;
openingNarrationSelection.addEventListener("change", function () {
  localStorage.setItem("opening", this.value);
});

const ttsSelection = document.getElementById("tts-toggle") as HTMLSelectElement;
ttsSelection.addEventListener("change", function () {
  const volInput = document.getElementById(
    "tts-volume-input"
  ) as HTMLInputElement;
  const newValue = this.value === "ON" ? "0.5" : "0";
  volInput.value = newValue;
  localStorage.setItem("ttsVolume", newValue);
  ttsForMenu.volume = Number(newValue);
});

// audio volume adjusters
const ttsVolumeInput = document.getElementById(
  "tts-volume-input"
) as HTMLInputElement;
ttsVolumeInput.addEventListener("input", function () {
  if (this.value !== "0") {
    ttsSelection.value = "ON";
  }
  if (this.value === "0") {
    ttsSelection.value = "OFF";
  }
});
const ttsSpeedInput = document.getElementById(
  "tts-speed-input"
) as HTMLInputElement;
const gameVolumeInput = document.getElementById(
  "game-volume-input"
) as HTMLInputElement;
const musicVolumeInput = document.getElementById(
  "music-volume-input"
) as HTMLInputElement;

// audio elements on page
const ttsForMenu = document.getElementById("voice") as HTMLAudioElement;
// ttsForMenu.volume = 0.5;
// ttsForMenu.defaultPlaybackRate = 1;
ttsForMenu.addEventListener("ended", () => {
  ttsPlayIcon.src = "./icon-play.png";
  ttsPlaySpeedIcon.src = "./icon-play.png";
});
const soundEffectsForMenu = document.getElementById("beep") as HTMLAudioElement;
// soundEffectsForMenu.volume = 0.5;
const musicForMenu = document.getElementById("music") as HTMLAudioElement;
// musicForMenu.volume = 0.5;

// test volume buttons
const testSpeechVolumeButton = document.getElementById(
  "test-audio-speech"
) as HTMLButtonElement;
const testSpeechSpeedButton = document.getElementById(
  "test-audio-speech-speed"
) as HTMLButtonElement;
const testGameVolumeButton = document.getElementById(
  "test-audio-game"
) as HTMLButtonElement;
const testMusicVolumeButton = document.getElementById(
  "test-audio-music"
) as HTMLButtonElement;

// icons for playing test audio
const ttsPlayIcon = document.querySelector(
  "#test-audio-speech > img"
) as HTMLImageElement;
const ttsPlaySpeedIcon = document.querySelector(
  "#test-audio-speech-speed > img"
) as HTMLImageElement;
const soundEffectsPlayIcon = document.querySelector(
  "#test-audio-game > img"
) as HTMLImageElement;
const musicPlayIcon = document.querySelector(
  "#test-audio-music > img"
) as HTMLImageElement;

// setValues based on localStorage
keyboardSelection.value = saved.keyboard || "QWERTY";
fontSelection.value = saved.font || "'Silkscreen'";
document.documentElement.style.setProperty(
  "--dynamic-font",
  fontSelection.value
);

fontGlowSelection.value = saved.glow || "4px";
document.documentElement.style.setProperty(
  "--font-glow",
  fontGlowSelection.value
);
openingNarrationSelection.value = saved.opening || "ON";
ttsVolumeInput.value = saved.ttsVolume || "0.5";
ttsSelection.value = Number(ttsVolumeInput.value) > 0 ? "ON" : "OFF";
ttsForMenu.volume = Number(ttsVolumeInput.value);
ttsSpeedInput.value = saved.ttsSpeed || "1";
ttsForMenu.playbackRate = Number(ttsSpeedInput.value);
ttsForMenu.defaultPlaybackRate = Number(ttsSpeedInput.value);
gameVolumeInput.value = saved.seVolume || "0.5";
soundEffectsForMenu.setAttribute("data-volume-max", gameVolumeInput.value);
musicVolumeInput.value = saved.musicVolume || "0.5";
musicForMenu.volume = Number(musicVolumeInput.value);
updateKeyboard(saved.keyboard || "QWERTY");

// init
initMenuAudio(
  "ttsVolume",
  ttsForMenu,
  testSpeechVolumeButton,
  ttsPlayIcon,
  ttsVolumeInput
);

initMenuAudio(
  "ttsSpeed",
  ttsForMenu,
  testSpeechSpeedButton,
  ttsPlaySpeedIcon,
  ttsSpeedInput,
  (newVal) => {
    localStorage.setItem("ttsSpeed", newVal);
    ttsForMenu.playbackRate = Number(newVal);
    ttsForMenu.defaultPlaybackRate = Number(newVal);
  }
);

initMenuAudio(
  "seVolume",
  soundEffectsForMenu,
  testGameVolumeButton,
  soundEffectsPlayIcon,
  gameVolumeInput,
  (newVal) => {
    localStorage.setItem("seVolume", newVal);
    soundEffectsForMenu.setAttribute("data-volume-max", newVal);
    soundEffectsForMenu.volume = Number(newVal);
  }
);

initMenuAudio(
  "musicVolume",
  musicForMenu,
  testMusicVolumeButton,
  musicPlayIcon,
  musicVolumeInput
);
