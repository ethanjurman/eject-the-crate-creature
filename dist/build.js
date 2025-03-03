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
    audioVis.style.background = "#9de64e"; // neon green when active
    // Set the animation so the bar “grows” from 0 to full height in sync with the beep
    audioVis.style.animation = `${effectiveDuration}s infinite beep`;
    // to catch if the audio was paused after this was triggered
    setTimeout(() => {
        if (audioPlayer.paused) {
            audioVis.style.animation = "none";
            audioVis.style.background = "#10121c";
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
    audioVis.style.background = "#10121c";
});
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.angleTowards = angleTowards;
const PX_SIZE = 96;
const W = 9;
const H = 4;
let fps = 60;
const HEAVY_DAMAGE = 255 * 50;
const MAX_SCORE = 10000;
function angleTowards(A, B, deltaX, deltaY) {
    // Vector from B to A
    const vX = A.x - B.x;
    const vY = A.y - B.y;
    // Dot product
    const dot = vX * deltaX + vY * deltaY;
    // Magnitudes
    const magV = Math.sqrt(vX * vX + vY * vY);
    const magW = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // Guard against division by zero (if B isn't moving or A equals B)
    if (magV === 0 || magW === 0) {
        return null; // or 0, depending on your needs
    }
    // Compute angle in radians
    const angle = Math.acos(dot / (magV * magW));
    return angle; // in radians; multiply by 180/Math.PI for degrees if needed
}
const audio = document.getElementById("beep");
const music = document.getElementById("music");
const audioVoice = document.getElementById("voice");
const canvas = document.getElementById("canvas");
const gameStartButton = document.getElementById("game-start");
const gameContinueButton = document.getElementById("game-continue");
const gameResetButton = document.getElementById("reset");
const gameMenu = document.getElementById("menu");
const keysVisual = document.getElementById("keys");
const ctx = canvas.getContext("2d");
let dialog;
fetch("./audio/dialog.txt").then((res) => __awaiter(void 0, void 0, void 0, function* () {
    dialog = (yield res.text())
        .split("\n")
        .map((line) => line.split("|"))
        .reduce((acc, linePair) => {
        var _a;
        acc[linePair[0]] = (_a = linePair[1]) === null || _a === void 0 ? void 0 : _a.trim();
        // fetch(`./audio/en/${linePair[0]}.wav`);
        return acc;
    }, {});
}));
canvas.width = PX_SIZE * W;
canvas.height = PX_SIZE * H;
const QWERTY_CONTAINERS = [
    [
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Digit6",
        "Digit7",
        "Digit8",
        "Digit9",
    ],
    ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO"],
    ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL"],
    ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period"],
];
const AZERTY_CONTAINERS = [
    [
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Digit6",
        "Digit7",
        "Digit8",
        "Digit9",
    ],
    ["KeyA", "KeyZ", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO"],
    ["KeyQ", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL"],
    [
        "KeyW",
        "KeyX",
        "KeyC",
        "KeyV",
        "KeyB",
        "KeyN",
        "Comma",
        "Semicolon",
        "Colon",
    ],
];
const QWERTZ_CONTAINERS = [
    [
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Digit6",
        "Digit7",
        "Digit8",
        "Digit9",
    ],
    ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyZ", "KeyU", "KeyI", "KeyO"],
    ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL"],
    ["KeyY", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period"],
];
let containers = QWERTY_CONTAINERS;
let containersFlat = containers.reduce((acc, row) => {
    acc.push(...row);
    return acc;
}, []);
const keyboardOption = document.getElementById("keyboard-selection");
keyboardOption.addEventListener("change", function () {
    if (this.value === "QWERTY") {
        // change containers to QWERTY
        containers = QWERTY_CONTAINERS;
    }
    if (this.value === "AZERTY") {
        // change containers to AZERTY
        containers = AZERTY_CONTAINERS;
    }
    if (this.value === "QWERTZ") {
        // change containers to QWERTZ
        containers = QWERTZ_CONTAINERS;
    }
});
function getScore() {
    let score = 0;
    Object.values(gameState.cargo).forEach((cargo) => {
        if (cargo.ejected) {
            score += Math.floor(MAX_SCORE / 36 / 10) * 10;
        }
        else {
            score +=
                Math.floor(((cargo.damage / HEAVY_DAMAGE) * (MAX_SCORE / 36)) / 10) *
                    10;
        }
    });
    return Math.floor(score / 10) * 10;
}
function updateScore() {
    const scoreDiv = document.getElementById("score");
    const newScore = getScore();
    if (scoreDiv.innerText !== `-$${newScore}`) {
        scoreDiv.innerText = `-$${newScore}`;
    }
}
function getXYForContainerKey(key) {
    if (!containersFlat.includes(key)) {
        return null;
    }
    for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
            if (key === containers[y][x]) {
                return { x, y };
            }
        }
    }
}
function XYToContainerKey(x, y) {
    if (x > 8 || y > 3) {
        return "";
    }
    return containers[y][x];
}
function getCargoAtXY(x, y) {
    if (x >= W || y >= H) {
        return null;
    }
    if (x < 0 || y < 0) {
        return null;
    }
    const containerKey = containers[Math.floor(y)][Math.floor(x)];
    return gameState.cargo[containerKey]
        ? Object.assign(Object.assign({}, gameState.cargo[containerKey]), { containerKey }) : {
        damage: 0,
        ejected: false,
        containerKey,
    };
}
function checkForCreatureEjected() {
    var _a;
    const { x, y } = gameState.creature;
    if ((_a = getCargoAtXY(x, y)) === null || _a === void 0 ? void 0 : _a.ejected) {
        onGameEnd();
    }
}
let frame = 0;
const keysPressed = new Set();
let gameState = {
    state: "MENU_START",
    creature: {
        x: Math.floor(Math.random() * (W - 1)) + 0.5,
        y: Math.floor(Math.random() * (H - 1)) + 0.5,
        deltaX: 0,
        deltaY: 0,
        behavior: "ATTACK",
    },
    radarKey: "",
    queuedActions: [],
    unqueuedActions: [],
    cargo: {},
    showCreatureAndDamage: false,
};
function addQueuedAction(action) {
    gameState.queuedActions.push(action);
}
function addUnqueuedAction(action) {
    gameState.unqueuedActions.push(action);
}
function advanceQueuedAction() {
    var _a;
    if (((_a = gameState.queuedActions[0]) === null || _a === void 0 ? void 0 : _a.type) === "TEXT") {
        gameState.queuedActions[0] = Object.assign(Object.assign({}, gameState.queuedActions[0]), { delay: -1 });
    }
}
function updateCreatureDelta(newDeltaX, newDeltaY) {
    gameState.creature.deltaX = newDeltaX;
    gameState.creature.deltaY = newDeltaY;
}
function numberStrings(number) {
    let strings = [];
    const units = [
        { value: 1000, name: "thousand" },
        { value: 100, name: "hundred" },
    ];
    let numberRemaining = number;
    for (const unit of units) {
        const count = Math.floor(numberRemaining / unit.value);
        if (count > 0) {
            strings.push(String(count));
            strings.push(unit.name);
            numberRemaining -= count * unit.value;
        }
    }
    if (numberRemaining > 0) {
        if (number > 100) {
            strings.push("and");
        }
        strings.push(String(numberRemaining));
    }
    return strings;
}
function addTextAction(...texts) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < texts.length; index++) {
            const delay = gameState.queuedActions.filter((action) => action.type === "TEXT")
                .length === 0
                ? 0
                : 20000;
            const text = texts[index];
            if (typeof text === "object") {
                text.group.forEach((item, itemIndex) => {
                    addQueuedAction({
                        type: "TEXT",
                        data: {
                            text: text.text,
                            readoutKey: item,
                            id: Math.random(),
                            partOfPrevious: itemIndex !== 0,
                        },
                        delay: delay === 0 && itemIndex === 0 ? 0 : 20000,
                    });
                });
            }
            else {
                addQueuedAction({
                    type: "TEXT",
                    data: { text: dialog[text], id: Math.random() },
                    delay,
                });
            }
        }
    });
}
const executeAction = (action) => {
    var _a;
    if (action.delay > 0) {
        return true;
    }
    if (action.type === "GAME_STATE_UPDATE") {
        gameState.state = action.data.state;
    }
    if (action.type === "TEXT") {
        const linesContainer = document.getElementById("lines");
        if (!action.data.partOfPrevious) {
            const readLineDiv = document.getElementById("read-line");
            const newLine = document.createElement("p");
            newLine.setAttribute("data-crawl-text", action.data.text);
            readLineDiv.innerText = action.data.text;
            linesContainer.prepend(newLine);
            linesContainer.scrollTo(0, 0);
        }
        const dialogEntry = Object.entries(dialog).find(([key, value]) => {
            return value === action.data.text || key === action.data.readoutKey;
        });
        if ((dialogEntry === null || dialogEntry === void 0 ? void 0 : dialogEntry[0]) && !action.data.skipSpeaking) {
            console.log(frame, `./audio/en/${dialogEntry[0]}.wav`);
            audioVoice.src = `./audio/en/${dialogEntry[0]}.wav`;
            audioVoice.load();
            audioVoice.currentTime = 0;
            audioVoice.play().then(() => {
                // if part of previous was set, either false or true, then it's
                // part of a string (even if it's just the begging)
                // shorten it, as these tend to be longer
                if (action.data.partOfPrevious === false ||
                    action.data.partOfPrevious === true) {
                    const newDuration = ((audioVoice.duration - 0.3) / audioVoice.playbackRate) * 1000;
                    setTimeout(() => {
                        advanceQueuedAction();
                    }, newDuration);
                }
            });
        }
    }
    if (action.type === "CREATURE_RUN") {
        const creatureInfo = gameState.creature;
        gameState.creature.behavior = "RUN";
        const runDir = Math.floor(Math.random() * 4);
        [
            () => {
                gameState.creature.deltaX = 0.01;
                gameState.creature.deltaY = 0.0;
            },
            () => {
                gameState.creature.deltaX = 0.0;
                gameState.creature.deltaY = 0.01;
            },
            () => {
                gameState.creature.deltaX = -0.01;
                gameState.creature.deltaY = 0.0;
            },
            () => {
                gameState.creature.deltaX = 0.0;
                gameState.creature.deltaY = -0.01;
            },
        ][runDir]();
        const onCargoWithHeavyDamage = (((_a = getCargoAtXY(creatureInfo.x, creatureInfo.y)) === null || _a === void 0 ? void 0 : _a.damage) || 0) >=
            HEAVY_DAMAGE;
        if (action.data.count < 5 || onCargoWithHeavyDamage) {
            setTimeout(() => {
                const id = Math.random();
                const newCount = action.data.count + 1;
                console.log({ newCount });
                addUnqueuedAction({
                    type: "CREATURE_RUN",
                    delay: Math.min(1000 * action.data.count, 5000),
                    data: {
                        count: newCount,
                        id,
                    },
                });
            }, 0);
        }
        if (action.data.count >= 5) {
            setTimeout(() => addQueuedAction({
                type: "CREATURE_ATTACK",
                delay: 0,
                data: {
                    id: Math.random(),
                },
            }), 0);
        }
    }
    if (action.type === "CREATURE_ATTACK") {
        gameState.creature.behavior = "ATTACK";
    }
    return false;
};
function attemptToEject(code) {
    var _a;
    // clear out existing text
    gameState.queuedActions.forEach((action, index) => {
        action.delay = -1;
        if (action.type === "TEXT") {
            action.data.skipSpeaking = true;
        }
    });
    if (gameState.queuedActions.length > 0) {
        advanceQueuedAction();
    }
    // check for ejection
    if ((_a = gameState.cargo[code]) === null || _a === void 0 ? void 0 : _a.ejected) {
        addTextAction({
            text: `${dialog["containmentUnit"]} ${dialog[code]}`,
            group: ["containmentUnit", code],
        }, "ejectingFailedAlreadyEjected");
        return { result: false, reason: "ejected" };
    }
    gameState.cargo[code] = Object.assign(Object.assign({}, gameState.cargo[code]), { ejected: true });
    addTextAction({
        text: `${dialog["containmentUnit"]} ${dialog[code]}`,
        group: ["containmentUnit", code],
    }, "isEjected", "AnomalyStillActive");
    return { result: true };
}
function gameLoop() {
    updateScore();
    // TODO: update for GAME game state instead of READY
    if (gameState.state === "GAME") {
        updateCreature();
        playRadarSound();
        checkForCreatureEjected();
    }
    drawContainers();
    if (gameState.showCreatureAndDamage) {
        drawCreature();
    }
    // execute queued actions
    gameState.queuedActions = gameState.queuedActions.map((action, index) => {
        if (index === 0) {
            return Object.assign(Object.assign({}, action), { delay: action.delay - 1000 / fps });
        }
        return action;
    });
    gameState.unqueuedActions = gameState.unqueuedActions.map((action) => {
        return Object.assign(Object.assign({}, action), { delay: action.delay - 1000 / fps });
    });
    gameState.queuedActions = gameState.queuedActions.filter(executeAction);
    gameState.unqueuedActions = gameState.unqueuedActions.filter(executeAction);
}
document.onkeydown = function (e) {
    var _a;
    // debugger code
    if (e.code === "Slash") {
        if (localStorage.getItem("debugger") === "true") {
            gameState.showCreatureAndDamage = !gameState.showCreatureAndDamage;
        }
    }
    const isEjectingKeyPressedMenu = e.code.toLowerCase().includes("shift");
    // highlight menu key
    (_a = document
        .getElementById(`key-${e.code}`)) === null || _a === void 0 ? void 0 : _a.setAttribute("style", "color: #10121c; background: #9de64e;");
    if (isEjectingKeyPressedMenu) {
        Array.from(document.getElementsByClassName("key-Shift")).forEach((div) => div.setAttribute("style", "color: #10121c; background: #9de64e;"));
    }
    // game logic
    if (e.code === "Enter" && gameState.state === "READY") {
        gameState.state = "GAME";
        addTextAction("missionBegin");
    }
    if (e.code === "Enter" && gameState.state === "MENU_START") {
        startGame();
    }
    if (e.code === "Enter" && gameState.state === "MENU") {
        continueGame();
    }
    if (e.code === "Backspace" &&
        (gameState.state === "MENU" || gameState.state === "MENU_START")) {
        window.location.reload();
    }
    if (e.code === "Enter" && gameState.state === "END") {
        gameState.showCreatureAndDamage = true;
        const ejectedCargos = Object.entries(gameState.cargo)
            .filter(([__cargoKey, cargo]) => cargo.ejected)
            .map(([cargoKey]) => cargoKey);
        if (ejectedCargos.length > 1) {
            ejectedCargos.splice(ejectedCargos.length - 1, 0, "and");
        }
        if (ejectedCargos.length === 1) {
            addTextAction({
                text: `${dialog["containmentUnit"]} ${dialog[ejectedCargos[0]]}`,
                group: ["containmentUnit", ejectedCargos[0]],
            }, "wasEjectedSingular");
        }
        else if (ejectedCargos.length > 1) {
            addTextAction({
                text: `${dialog["containmentUnit"]} ${ejectedCargos
                    .map((k) => dialog[k])
                    .join(", ")}`,
                group: ["containmentUnit", ...ejectedCargos.map((k) => k)],
            }, "wasEjected");
        }
        const heavilyDamagedCargos = Object.entries(gameState.cargo)
            .filter(([__cargoKey, cargo]) => cargo.damage >= HEAVY_DAMAGE && !cargo.ejected)
            .map(([cargoKey]) => cargoKey);
        if (heavilyDamagedCargos.length > 1) {
            heavilyDamagedCargos.splice(heavilyDamagedCargos.length - 1, 0, "and");
        }
        if (heavilyDamagedCargos.length === 1) {
            addTextAction({
                text: `${dialog["containmentUnit"]} ${dialog[heavilyDamagedCargos[0]]}`,
                group: ["containmentUnit", heavilyDamagedCargos[0]],
            }, "wasHeavilyDamagedSingular");
        }
        if (heavilyDamagedCargos.length > 1) {
            addTextAction({
                text: `${dialog["containmentUnit"]} ${heavilyDamagedCargos
                    .map((k) => dialog[k])
                    .join(", ")}`,
                group: ["containmentUnit", ...heavilyDamagedCargos.map((k) => k)],
            }, "wasHeavilyDamaged");
        }
        Object.entries(gameState.cargo)
            .filter(([__cargoKey, cargo]) => cargo.damage < HEAVY_DAMAGE &&
            !cargo.ejected &&
            Math.floor(((cargo.damage / HEAVY_DAMAGE) * (MAX_SCORE / 36)) / 10) *
                10 >
                0)
            .reduce((acc, [cargoKey, cargo]) => {
            const damageCost = Math.floor(((cargo.damage / HEAVY_DAMAGE) * (MAX_SCORE / 36)) / 10) *
                10;
            if (acc[damageCost]) {
                acc[damageCost] = [...acc[damageCost], cargoKey];
            }
            else {
                acc[damageCost] = [cargoKey];
            }
            return acc;
        }, [])
            .forEach((keys, damage, fullArray) => {
            if (keys.length > 1) {
                keys.splice(keys.length - 1, 0, "and");
                addTextAction({
                    text: `${dialog["containmentUnit"]} ${keys
                        .map((k) => dialog[k])
                        .join(", ")}`,
                    group: ["containmentUnit", ...keys.map((k) => k)],
                }, "wereDamaged", { text: String(damage), group: numberStrings(damage) }, "credits", "forEach");
            }
            else {
                addTextAction({
                    text: `${dialog["containmentUnit"]} ${keys
                        .map((k) => dialog[k])
                        .join(", ")}`,
                    group: ["containmentUnit", ...keys.map((k) => k)],
                }, "wasDamaged", { text: String(damage), group: numberStrings(damage) }, "credits");
            }
        });
        addTextAction("thankYou");
    }
    if (e.code === "Escape") {
        gameState.state = "MENU";
        audioVoice.pause();
        gameMenu.setAttribute("style", "");
    }
    if (e.code === "Space") {
        advanceQueuedAction();
    }
    if (gameState.state === "GAME") {
        keysPressed.add(e.code);
        const isEjectingKeyPressed = Array.from(keysPressed).some((key) => key.toLowerCase().includes("shift"));
        if (containersFlat.includes(e.code)) {
            gameState.radarKey = e.code;
            const containerXY = getXYForContainerKey(gameState.radarKey);
            if (gameState.radarKey && containerXY) {
                const { x, y } = containerXY;
                const textToUse = `${gameState.radarKey} container unit at ${x}-${y} location`;
                if (keysVisual.getAttribute("aria-label") !== textToUse) {
                    keysVisual.textContent = "";
                    keysVisual.removeAttribute("aria-label");
                    keysVisual.setAttribute("data-crawl-text", textToUse);
                }
            }
        }
        if (isEjectingKeyPressed && gameState.radarKey) {
            attemptToEject(gameState.radarKey);
        }
    }
};
document.onkeyup = function (e) {
    var _a;
    const isEjectingKeyPressedMenu = e.code.toLowerCase().includes("shift");
    // unhighlight menu key
    (_a = document.getElementById(`key-${e.code}`)) === null || _a === void 0 ? void 0 : _a.setAttribute("style", "");
    if (isEjectingKeyPressedMenu) {
        Array.from(document.getElementsByClassName("key-Shift")).forEach((div) => div.setAttribute("style", ""));
    }
    // game logic
    if (gameState.state === "GAME") {
        keysPressed.delete(e.code);
        if (gameState.radarKey === e.code) {
            gameState.radarKey =
                [...keysPressed].find((key) => containersFlat.find((containerKey) => containerKey === key)) || "";
        }
        const containerXY = getXYForContainerKey(gameState.radarKey);
        // new radar key, read it out
        if (containerXY) {
            const { x, y } = containerXY;
            const textToUse = `${gameState.radarKey} container unit at ${x}-${y} location`;
            if (keysVisual.getAttribute("aria-label") !== textToUse) {
                keysVisual.textContent = "";
                keysVisual.removeAttribute("aria-label");
                keysVisual.setAttribute("data-crawl-text", textToUse);
            }
        }
        if (!gameState.radarKey) {
            keysVisual.textContent = ``;
        }
        // keysVisual.textContent = gameState.radarKey;
    }
};
function drawContainers() {
    var _a, _b;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgb(47, 255, 0)";
    ctx.beginPath();
    for (let row = 0; row < H; row++) {
        for (let col = 0; col < W; col++) {
            const cargoKey = XYToContainerKey(col, row);
            const cargoDamage = (_a = gameState.cargo[cargoKey]) === null || _a === void 0 ? void 0 : _a.damage;
            const width = PX_SIZE;
            const height = PX_SIZE;
            const x = PX_SIZE * col;
            const y = PX_SIZE * row;
            ctx.rect(x, y, width, height);
            if ((_b = gameState.cargo[cargoKey]) === null || _b === void 0 ? void 0 : _b.ejected) {
                ctx.fillStyle = `rgb(0,0,255)`;
                ctx.fillRect(x, y, width, height);
            }
            if (gameState.showCreatureAndDamage) {
                if (cargoDamage && !gameState.cargo[cargoKey].ejected) {
                    ctx.fillStyle = `rgb(${Math.min(cargoDamage / 50, 255)}, 0, 0)`;
                    ctx.fillRect(x, y, width, height);
                }
            }
            if (gameState.radarKey === containers[row][col]) {
                ctx.fillStyle = "rgb(47, 255, 0)";
                ctx.fillRect(x + 10, y + 10, width - 20, height - 20);
            }
        }
    }
    ctx.stroke();
    // draw dashes
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgb(47, 255, 0)";
    // draw F dash
    ctx.moveTo(PX_SIZE * 3.25, PX_SIZE * 2.9);
    ctx.lineTo(PX_SIZE * 3.75, PX_SIZE * 2.9);
    // draw J dash
    ctx.moveTo(PX_SIZE * 6.25, PX_SIZE * 2.9);
    ctx.lineTo(PX_SIZE * 6.75, PX_SIZE * 2.9);
    ctx.stroke();
}
function drawCreature() {
    const x = PX_SIZE * gameState.creature.x;
    const y = PX_SIZE * gameState.creature.y;
    ctx.beginPath();
    ctx.arc(x, y, PX_SIZE / 12, 0, 2 * Math.PI);
    ctx.fillStyle = "#ec273f";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.fill();
    ctx.stroke();
}
function updateCreature() {
    var _a;
    const { creature } = gameState;
    const targetCargo = getCargoAtXY(creature.x + creature.deltaX * (fps / 120), creature.y + creature.deltaY * (fps / 120));
    if (!targetCargo) {
        updateCreatureDelta(-creature.deltaX, -creature.deltaY);
    }
    else if (targetCargo === null || targetCargo === void 0 ? void 0 : targetCargo.ejected) {
        updateCreatureDelta(-creature.deltaX, -creature.deltaY);
    }
    if (creature.behavior === "ATTACK") {
        updateCreatureDelta(0, 0);
    }
    const damage = creature.behavior === "ATTACK" ? 30 : 5;
    const cargoKey = XYToContainerKey(Math.floor(creature.x), Math.floor(creature.y));
    if (!gameState.cargo[cargoKey]) {
        gameState.cargo[cargoKey] = {
            damage,
            ejected: false,
        };
    }
    else {
        gameState.cargo[cargoKey] = Object.assign(Object.assign({}, gameState.cargo[cargoKey]), { damage: Math.min(gameState.cargo[cargoKey].damage + damage, HEAVY_DAMAGE) });
    }
    // add run action if cargo is heavily damage
    const cargoDamage = (_a = gameState.cargo[cargoKey]) === null || _a === void 0 ? void 0 : _a.damage;
    if (cargoDamage >= HEAVY_DAMAGE && creature.behavior !== "RUN") {
        if (gameState.unqueuedActions.length === 0) {
            addUnqueuedAction({
                type: "CREATURE_RUN",
                delay: 60,
                data: {
                    count: 0,
                    id: Math.random(),
                },
            });
        }
    }
    const newCreatureState = {
        x: Math.max(Math.min(creature.x + creature.deltaX * (fps / 120), W), 0),
        y: Math.max(Math.min(creature.y + creature.deltaY * (fps / 120), H), 0),
        deltaX: creature.deltaX,
        deltaY: creature.deltaY,
        behavior: creature.behavior,
    };
    gameState.creature = newCreatureState;
}
function getKeyLocation() {
    for (let col = 0; col < W; col++) {
        for (let row = 0; row < H; row++) {
            if (gameState.radarKey === containers[row][col]) {
                return { x: col + 0.5, y: row + 0.5 };
            }
        }
    }
    return null;
}
function playRadarSound() {
    const keyLocation = getKeyLocation();
    const { creature } = gameState;
    if (gameState.radarKey && keyLocation) {
        const { x: x1, y: y1 } = keyLocation;
        const { x: x2, y: y2 } = creature;
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) / W + Math.pow(y2 - y1, 2) / H);
        const maxVol = Number(audio.getAttribute("data-volume-max"));
        audio.setAttribute("data-volume-set", String(keyLocation ? Math.min(Math.max(1 - distance, 0.1), 1) : 0));
        audio.volume =
            (keyLocation ? Math.min(Math.max(1 - distance, 0.1), 1) : 0) * maxVol;
        audio.playbackRate = Math.max(Math.min(1.5 - distance, 2), 0.2);
        if (audio.paused) {
            audio.play();
        }
    }
    if (!gameState.radarKey) {
        if (!audio.paused) {
            audio.pause();
        }
    }
}
function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 1;
    if (gameState.state !== "MENU" && gameState.state !== "MENU_START") {
        gameLoop();
    }
    // last call
    requestAnimationFrame(animate);
}
animate();
function startGame() {
    keyboardOption.setAttribute("disabled", "true");
    gameState.state = "OPENING";
    gameMenu.setAttribute("style", "display: none");
    gameStartButton.setAttribute("style", "display: none");
    gameContinueButton.setAttribute("style", "");
    music.play();
    const hasOpening = document.getElementById("opening-select").value ===
        "ON";
    if (hasOpening) {
        addTextAction("opening1", "opening2", "opening3", "opening4", "opening5", "opening6", "opening7", "opening8", "opening9", "opening10", "opening11", "opening12", "opening13");
    }
    else {
        addTextAction("opening13");
    }
    addQueuedAction({
        type: "GAME_STATE_UPDATE",
        delay: 100,
        data: { state: "READY", id: Math.random() },
    });
}
gameStartButton.onclick = () => {
    startGame();
};
function continueGame() {
    gameState.state = "GAME";
    audioVoice.play();
    gameMenu.setAttribute("style", "display: none");
}
gameContinueButton.onclick = () => {
    continueGame();
};
gameResetButton.onclick = () => {
    window.location.reload();
};
let lastFrameCount = 0;
setInterval(() => {
    fps = frame - lastFrameCount;
    lastFrameCount = frame;
}, 1000);
const onGameEnd = () => {
    music.pause();
    audio.pause();
    gameState.state = "END";
    gameState.radarKey = "";
    gameState.queuedActions = [];
    keysVisual.textContent = "";
    addTextAction("missionSuccess", "AnomalyNotActive", "totalFine", { text: String(getScore()), group: numberStrings(getScore()) }, "credits", "thankYou", "resetGame", "fullReadout");
};
audioVoice.addEventListener("ended", function () {
    advanceQueuedAction();
});
setInterval(() => {
    const elements = document.querySelectorAll("[data-crawl-text]");
    if (elements.length === 0) {
        return;
    }
    elements.forEach((element) => {
        const crawlText = element.getAttribute("data-crawl-text") || "";
        if (!element.getAttribute("aria-label")) {
            element.setAttribute("aria-label", crawlText);
        }
        if (crawlText.length === 0) {
            element.removeAttribute("data-crawl-text");
            return;
        }
        if (element.tagName === "P") {
            const word = crawlText.split(" ")[0];
            element.textContent = element.textContent + word + " ";
            element.setAttribute("data-crawl-text", crawlText.slice(word.length + 1));
        }
        else {
            element.textContent = element.textContent + crawlText[0];
            element.setAttribute("data-crawl-text", crawlText.slice(1));
        }
    });
}, 50);
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const updateKeyboard = (keyboard) => {
    const cargoTiny = document.getElementById("cargo-tiny");
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
    }
    else if (keyboard === "QWERTZ") {
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
    }
    else if (keyboard === "AZERTY") {
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
const keyboardSelection = document.getElementById("keyboard-selection");
keyboardSelection.addEventListener("change", function () {
    localStorage.setItem("keyboard", this.value);
    updateKeyboard(this.value);
});
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
keyboardSelection.value = saved.keyboard || "QWERTY";
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
updateKeyboard(saved.keyboard || "QWERTY");
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
