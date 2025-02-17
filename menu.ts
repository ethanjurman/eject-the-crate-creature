export type Menu = {
  font: string;
};

const saved = {
  font: localStorage.getItem("font"),
  glow: localStorage.getItem("glow"),
  opening: localStorage.getItem("opening"),
  ttsVolume: localStorage.getItem("ttsVolume"),
  ttsSpeed: localStorage.getItem("ttsSpeed"),
  seVolume: localStorage.getItem("seVolume"),
  musicVolume: localStorage.getItem("musicVolume"),
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

// audio volume adjusters
const ttsVolumeInput = document.getElementById(
  "tts-volume-input"
) as HTMLInputElement;
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
fontSelection.value = saved.font || "monospace";
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
ttsForMenu.volume = Number(ttsVolumeInput.value);
ttsSpeedInput.value = saved.ttsSpeed || "1";
ttsForMenu.playbackRate = Number(ttsSpeedInput.value);
ttsForMenu.defaultPlaybackRate = Number(ttsSpeedInput.value);
gameVolumeInput.value = saved.seVolume || "0.5";
soundEffectsForMenu.setAttribute("data-volume-max", gameVolumeInput.value);
console.log(gameVolumeInput.value, soundEffectsForMenu.volume);
musicVolumeInput.value = saved.musicVolume || "0.5";
musicForMenu.volume = Number(musicVolumeInput.value);

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
