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
