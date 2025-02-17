"use strict";
const audioPlayer = document.getElementById("beep");
const audioVis = document.getElementById("audio-visualizer");
function updateVisualizer() {
    // Make sure duration is available (after loadedmetadata)
    if (!audioPlayer.duration) {
        return;
    }
    // Calculate the effective sound duration
    const effectiveDuration = audioPlayer.duration / audioPlayer.playbackRate;
    // For example: 0.241 sec / 0.25 ≈ 0.964 sec
    // Calculate the visualizer's height (e.g., volume 1 → 360px)
    const volumeTarget = Number(audioPlayer.getAttribute("data-volume-set"));
    const visHeight = volumeTarget * 360;
    // Update the inline styles:
    audioVis.style.height = `${visHeight}px`;
    audioVis.style.background = "#2fff00"; // neon green when active
    // Set the animation so the bar “grows” from 0 to full height in sync with the beep
    audioVis.style.animation = `${effectiveDuration}s infinite beep`;
    // to catch if the audio was paused after this was triggered
    setTimeout(() => {
        if (audioPlayer.paused) {
            audioVis.style.animation = "none";
            audioVis.style.background = "black";
        }
    }, 0);
}
function throttle(fn, wait) {
    let isThrottled = false;
    let lastArgs = null;
    return function throttledFunction(...args) {
        if (!isThrottled) {
            fn(...args);
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
                if (lastArgs) {
                    fn(...lastArgs);
                    lastArgs = null;
                }
            }, wait);
        }
        else {
            lastArgs = args;
        }
    };
}
const throttledUpdateVisualizer = throttle(updateVisualizer, 250);
// When audio plays, update the visualizer
audioPlayer.addEventListener("play", updateVisualizer);
// Update if volume or playback rate changes
audioPlayer.addEventListener("volumechange", throttledUpdateVisualizer);
audioPlayer.addEventListener("ratechange", throttledUpdateVisualizer);
// Optionally, when pausing the audio, change the visual style:
audioPlayer.addEventListener("pause", () => {
    // Remove or pause the animation and revert the background to black
    audioVis.style.animation = "none";
    audioVis.style.background = "black";
});
