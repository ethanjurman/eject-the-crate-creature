export type Menu = {
  font: string;
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
