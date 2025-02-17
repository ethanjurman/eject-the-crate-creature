"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initMenuAudio = (audioElement, buttonElement, iconElement, inputElement, onChangeInput = (newVal) => {
    audioElement.volume = Number(newVal);
}) => {
    inputElement.addEventListener("input", () => onChangeInput(inputElement.value));
    buttonElement.onclick = () => {
        if (audioElement.paused) {
            iconElement.src = "./icon-stop.png";
            audioElement.play();
        }
        else {
            iconElement.src = "./icon-play.png";
            audioElement.pause();
        }
    };
};
const fontSelection = document.getElementById("font-selection");
fontSelection.addEventListener("change", function () {
    document.documentElement.style.setProperty("--dynamic-font", this.value);
});
const fontGlowSelection = document.getElementById("font-glow");
fontGlowSelection.addEventListener("change", function () {
    document.documentElement.style.setProperty("--font-glow", this.value);
});
const inGameTextToSpeech = document.getElementById("in-game-text-to-speech");
// audio volume adjusters
const ttsVolumeInput = document.getElementById("tts-volume-input");
const gameVolumeInput = document.getElementById("game-volume-input");
const musicVolumeInput = document.getElementById("music-volume-input");
// audio elements on page
const ttsForMenu = document.getElementById("voice");
ttsForMenu.volume = 0.5;
ttsForMenu.addEventListener("ended", () => {
    ttsPlayIcon.src = "./icon-play.png";
});
const soundEffectsForMenu = document.getElementById("beep");
soundEffectsForMenu.volume = 0.5;
const musicForMenu = document.getElementById("music");
musicForMenu.volume = 0.5;
// test volume buttons
const testSpeechVolumeButton = document.getElementById("test-audio-speech");
const testGameVolumeButton = document.getElementById("test-audio-game");
const testMusicVolumeButton = document.getElementById("test-audio-music");
// icons for playing test audio
const ttsPlayIcon = document.querySelector("#test-audio-speech > img");
const soundEffectsPlayIcon = document.querySelector("#test-audio-game > img");
const musicPlayIcon = document.querySelector("#test-audio-music > img");
// init
initMenuAudio(ttsForMenu, testSpeechVolumeButton, ttsPlayIcon, ttsVolumeInput);
initMenuAudio(soundEffectsForMenu, testGameVolumeButton, soundEffectsPlayIcon, gameVolumeInput, (newVal) => {
    soundEffectsForMenu.setAttribute("data-volume-max", newVal);
    soundEffectsForMenu.volume = Number(newVal);
});
initMenuAudio(musicForMenu, testMusicVolumeButton, musicPlayIcon, musicVolumeInput);
