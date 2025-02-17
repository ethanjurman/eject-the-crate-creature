export type Menu = {
  font: string;
};

const initMenuAudio = (
  audioElement: HTMLAudioElement,
  buttonElement: HTMLButtonElement,
  iconElement: HTMLImageElement,
  inputElement: HTMLInputElement,
  onChangeInput = (newVal: string) => {
    audioElement.volume = Number(newVal);
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
  document.documentElement.style.setProperty("--dynamic-font", this.value);
});

const fontGlowSelection = document.getElementById(
  "font-glow"
) as HTMLSelectElement;
fontGlowSelection.addEventListener("change", function () {
  document.documentElement.style.setProperty("--font-glow", this.value);
});

const inGameTextToSpeech = document.getElementById("in-game-text-to-speech");

// audio volume adjusters
const ttsVolumeInput = document.getElementById(
  "tts-volume-input"
) as HTMLInputElement;
const gameVolumeInput = document.getElementById(
  "game-volume-input"
) as HTMLInputElement;
const musicVolumeInput = document.getElementById(
  "music-volume-input"
) as HTMLInputElement;

// audio elements on page
const ttsForMenu = document.getElementById("voice") as HTMLAudioElement;
ttsForMenu.volume = 0.5;
ttsForMenu.addEventListener("ended", () => {
  ttsPlayIcon.src = "./icon-play.png";
});
const soundEffectsForMenu = document.getElementById("beep") as HTMLAudioElement;
soundEffectsForMenu.volume = 0.5;
const musicForMenu = document.getElementById("music") as HTMLAudioElement;
musicForMenu.volume = 0.5;

// test volume buttons
const testSpeechVolumeButton = document.getElementById(
  "test-audio-speech"
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
const soundEffectsPlayIcon = document.querySelector(
  "#test-audio-game > img"
) as HTMLImageElement;
const musicPlayIcon = document.querySelector(
  "#test-audio-music > img"
) as HTMLImageElement;

// init
initMenuAudio(ttsForMenu, testSpeechVolumeButton, ttsPlayIcon, ttsVolumeInput);

initMenuAudio(
  soundEffectsForMenu,
  testGameVolumeButton,
  soundEffectsPlayIcon,
  gameVolumeInput,
  (newVal) => {
    soundEffectsForMenu.setAttribute("data-volume-max", newVal);
    soundEffectsForMenu.volume = Number(newVal);
  }
);

initMenuAudio(
  musicForMenu,
  testMusicVolumeButton,
  musicPlayIcon,
  musicVolumeInput
);
