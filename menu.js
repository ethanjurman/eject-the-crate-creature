"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const saved = {
    font: localStorage.getItem("font"),
    glow: localStorage.getItem("glow"),
    opening: localStorage.getItem("opening"),
    ttsVolume: localStorage.getItem("ttsVolume"),
    ttsSpeed: localStorage.getItem("ttsSpeed"),
    seVolume: localStorage.getItem("seVolume"),
    musicVolume: localStorage.getItem("musicVolume"),
};
const initMenuAudio = (localStorageKey, audioElement, buttonElement, iconElement, inputElement, onChangeInput = (newVal) => {
    audioElement.volume = Number(newVal);
    localStorage.setItem(localStorageKey, newVal);
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
    localStorage.setItem("font", this.value);
    document.documentElement.style.setProperty("--dynamic-font", this.value);
});
const fontGlowSelection = document.getElementById("font-glow");
fontGlowSelection.addEventListener("change", function () {
    localStorage.setItem("glow", this.value);
    document.documentElement.style.setProperty("--font-glow", this.value);
});
const openingNarrationSelection = document.getElementById("opening-select");
openingNarrationSelection.addEventListener("change", function () {
    localStorage.setItem("opening", this.value);
});
const ttsSelection = document.getElementById("tts-toggle");
ttsSelection.addEventListener("change", function () {
    const volInput = document.getElementById("tts-volume-input");
    const newValue = this.value === "ON" ? "0.5" : "0";
    volInput.value = newValue;
    localStorage.setItem("ttsVolume", newValue);
    ttsForMenu.volume = Number(newValue);
});
// audio volume adjusters
const ttsVolumeInput = document.getElementById("tts-volume-input");
ttsVolumeInput.addEventListener("input", function () {
    if (this.value !== "0") {
        ttsSelection.value = "ON";
    }
    if (this.value === "0") {
        ttsSelection.value = "OFF";
    }
});
const ttsSpeedInput = document.getElementById("tts-speed-input");
const gameVolumeInput = document.getElementById("game-volume-input");
const musicVolumeInput = document.getElementById("music-volume-input");
// audio elements on page
const ttsForMenu = document.getElementById("voice");
// ttsForMenu.volume = 0.5;
// ttsForMenu.defaultPlaybackRate = 1;
ttsForMenu.addEventListener("ended", () => {
    ttsPlayIcon.src = "./icon-play.png";
    ttsPlaySpeedIcon.src = "./icon-play.png";
});
const soundEffectsForMenu = document.getElementById("beep");
// soundEffectsForMenu.volume = 0.5;
const musicForMenu = document.getElementById("music");
// musicForMenu.volume = 0.5;
// test volume buttons
const testSpeechVolumeButton = document.getElementById("test-audio-speech");
const testSpeechSpeedButton = document.getElementById("test-audio-speech-speed");
const testGameVolumeButton = document.getElementById("test-audio-game");
const testMusicVolumeButton = document.getElementById("test-audio-music");
// icons for playing test audio
const ttsPlayIcon = document.querySelector("#test-audio-speech > img");
const ttsPlaySpeedIcon = document.querySelector("#test-audio-speech-speed > img");
const soundEffectsPlayIcon = document.querySelector("#test-audio-game > img");
const musicPlayIcon = document.querySelector("#test-audio-music > img");
// setValues based on localStorage
fontSelection.value = saved.font || "'Silkscreen'";
document.documentElement.style.setProperty("--dynamic-font", fontSelection.value);
fontGlowSelection.value = saved.glow || "4px";
document.documentElement.style.setProperty("--font-glow", fontGlowSelection.value);
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
// init
initMenuAudio("ttsVolume", ttsForMenu, testSpeechVolumeButton, ttsPlayIcon, ttsVolumeInput);
initMenuAudio("ttsSpeed", ttsForMenu, testSpeechSpeedButton, ttsPlaySpeedIcon, ttsSpeedInput, (newVal) => {
    localStorage.setItem("ttsSpeed", newVal);
    ttsForMenu.playbackRate = Number(newVal);
    ttsForMenu.defaultPlaybackRate = Number(newVal);
});
initMenuAudio("seVolume", soundEffectsForMenu, testGameVolumeButton, soundEffectsPlayIcon, gameVolumeInput, (newVal) => {
    localStorage.setItem("seVolume", newVal);
    soundEffectsForMenu.setAttribute("data-volume-max", newVal);
    soundEffectsForMenu.volume = Number(newVal);
});
initMenuAudio("musicVolume", musicForMenu, testMusicVolumeButton, musicPlayIcon, musicVolumeInput);
