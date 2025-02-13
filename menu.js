"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fontSelection = document.getElementById("font-selection");
fontSelection.addEventListener("change", function () {
    document.documentElement.style.setProperty("--dynamic-font", this.value);
});
const fontGlowSelection = document.getElementById("font-glow");
fontGlowSelection.addEventListener("change", function () {
    document.documentElement.style.setProperty("--font-glow", this.value);
});
const inGameTextToSpeech = document.getElementById("in-game-text-to-speech");
const textToSpeechVolume = document.getElementById("tts-volume");
const gameVolume = document.getElementById("game-volume");
const musicVolume = document.getElementById("music-volume");
const testSpeechVolume = document.getElementById("test-audio-speech");
const testGameVolume = document.getElementById("test-audio-game");
const testMusicVolume = document.getElementById("test-audio-music");
