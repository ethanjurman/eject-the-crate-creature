"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.angleTowards = angleTowards;
const PX_SIZE = 96;
const W = 9;
const H = 4;
const HEAVY_DAMAGE = 255 * 50;
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
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = PX_SIZE * W;
canvas.height = PX_SIZE * H;
const containers = [
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
function containerKeyToXY(key) {
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if (containers[y][x] === key) {
                return { x, y };
            }
        }
    }
    return null;
}
function XYToContainerKey(x, y) {
    if (x > 8 || y > 3) {
        return "";
    }
    return containers[y][x];
}
let frame = 0;
const keysPressed = new Set();
let gameState = {
    state: "READY",
    creature: {
        x: 4,
        y: 2,
        deltaX: 0.005,
        deltaY: 0.005,
        behavior: "ATTACK",
    },
    radarKey: "",
    queuedActions: [],
    unqueuedActions: [],
    cargo: {},
    showCargos: true,
    ejecting: false,
};
function addQueuedAction(action) {
    gameState.queuedActions.push(action);
}
function addUnqueuedAction(action) {
    gameState.unqueuedActions.push(action);
}
function advanceQueuedAction() {
    gameState.queuedActions[0] = Object.assign(Object.assign({}, gameState.queuedActions[0]), { delay: -1 });
}
function addTextAction(...texts) {
    texts.forEach((text, index) => {
        const prevText = texts[index - 1] || "";
        addQueuedAction({
            type: "text",
            delay: Math.max(prevText.split(" ").length * 50, 180),
            data: { text },
        });
    });
}
const executeAction = (action) => {
    if (action.delay > 0) {
        return true;
    }
    if (action.type === "text") {
        const linesContainer = document.getElementById("lines");
        const newLine = document.createElement("div");
        newLine.innerText = action.data.text;
        linesContainer.appendChild(newLine);
        if (linesContainer.childElementCount > 4) {
            const targetChild = linesContainer.children[linesContainer.childElementCount - 5];
            targetChild.setAttribute("style", "display: none");
        }
    }
    return false;
};
function attemptToEject(code) {
    var _a, _b;
    if ((_a = gameState.cargo[code]) === null || _a === void 0 ? void 0 : _a.ejected) {
        return { result: false, reason: "ejected" };
    }
    if (((_b = gameState.cargo[code]) === null || _b === void 0 ? void 0 : _b.damage) > HEAVY_DAMAGE) {
        return { result: false, reason: "damage" };
    }
    gameState.cargo[code] = Object.assign(Object.assign({}, gameState.cargo[code]), { ejected: true });
    gameState.ejecting = false;
    addUnqueuedAction({
        type: "text",
        delay: 0,
        data: {
            text: "EJECTING MODE DISENGAGED",
        },
    });
    return { result: true };
}
function gameLoop() {
    // execute queued actions
    gameState.queuedActions = gameState.queuedActions.map((action, index) => {
        if (index !== 0) {
            return action;
        }
        return Object.assign(Object.assign({}, action), { delay: action.delay - 1 });
    });
    gameState.unqueuedActions = gameState.unqueuedActions.map((action) => {
        return Object.assign(Object.assign({}, action), { delay: action.delay - 1 });
    });
    gameState.queuedActions = gameState.queuedActions.filter(executeAction);
    gameState.unqueuedActions = gameState.unqueuedActions.filter(executeAction);
}
document.onkeydown = function (e) {
    // key code for space
    if (e.code === "Enter") {
        addTextAction("BOOTING UP CARGO BAY COMPUTER INTELEGENCE...", "GOOD MORNING CAPTAIN.", "WE HAVE WOKEN YOU EARLY FROM CRYO SLEEP TO DEAL WITH AN ANOMOLY IN THE CARGO BAY.", "WE BELIEVE A CREATURE FROM CRATE X-7/2 WAS NOT PROPERLY CONTAINED IS NOW DESTROYING NEIGHBORING CARGO UNITS.", "THIS IS AN UNACCEPTABLE LOSS FOR THE CORPERATION.", "THERE ARE 36 CONTAINERS IN THE CARGO BAY. THEY ARE LABELED AND LOCATED BASED ON THE KEYBOARD CONFIGURATION IN FRONT OF YOU.", "'1' THROUGH '9' TO 'Z' THROUGH 'PERIOD' ARE ALL VALID CARGO KEYS.", "PRESS ANY CARGO KEY ON YOUR KEYBOARD TO ACTIVATE ITS DOPPLER-RADAR FROM ITS RESPECTIVE LOCATION.", "PRESS SHIFT PLUS ANY CARGO KEY TO EJECT THE CONTAINER INTO SPACE.", "IDENTIFY THE CREATURES LOCATION.", "EJECT IT.", "DO NOT EJECT AN EXTRANIOUS CARGO, YOU WILL BE FINED FOR ANY UNECESSARY LOSSES.", "PRESS ENTER TO BEGIN.");
    }
    if (e.code === "Space") {
        advanceQueuedAction();
    }
    if (e.code === "Slash") {
        gameState.showCargos = !gameState.showCargos;
    }
    if (e.code === "Backslash") {
        if (gameState.creature.behavior === "RUN") {
            gameState.creature.behavior = "ATTACK";
        }
        else {
            gameState.creature.behavior = "RUN";
        }
    }
    keysPressed.add(e.code);
    gameState.radarKey = e.code;
    if (gameState.ejecting) {
        attemptToEject(e.code);
    }
};
document.onkeyup = function (e) {
    keysPressed.delete(e.code);
    if (e.code === "ShiftLeft" && !gameState.ejecting) {
        addUnqueuedAction({
            type: "text",
            data: { text: "EJECTING MODE ENGAGED" },
            delay: 0,
        });
        gameState.ejecting = true;
        return;
    }
    if (e.code === "ShiftLeft" && gameState.ejecting) {
        addUnqueuedAction({
            type: "text",
            data: { text: "EJECTING MODE DISENGAGED" },
            delay: 0,
        });
        gameState.ejecting = false;
        return;
    }
    if (gameState.radarKey === e.code) {
        gameState.radarKey = [...keysPressed][0] || "";
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
            if (cargoDamage && !gameState.cargo[cargoKey].ejected) {
                ctx.fillStyle = `rgb(${Math.min(cargoDamage / 50, 255)}, 0, 0)`;
                ctx.fillRect(x, y, width, height);
            }
            if (gameState.radarKey === containers[row][col]) {
                ctx.fillStyle = "rgb(47, 255, 0)";
                ctx.fillRect(x + 10, y + 10, width - 20, height - 20);
            }
        }
    }
    ctx.stroke();
}
function drawCreature() {
    const x = PX_SIZE * gameState.creature.x;
    const y = PX_SIZE * gameState.creature.y;
    ctx.beginPath();
    ctx.arc(x, y, PX_SIZE / 12, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}
function updateCreature() {
    const { creature } = gameState;
    // invert delta if hitting a wall
    if (creature.x + creature.deltaX < 0 || creature.x + creature.deltaX > W) {
        creature.deltaX = -creature.deltaX;
    }
    if (creature.y + creature.deltaY < 0 || creature.y + creature.deltaY > H) {
        creature.deltaY = -creature.deltaY;
    }
    if (creature.behavior === "ATTACK") {
        creature.deltaY = (Math.random() - 0.5) / 50;
        creature.deltaX = (Math.random() - 0.5) / 50;
    }
    const damage = creature.behavior === "ATTACK" ? 10 : 5;
    const cargoKey = XYToContainerKey(Math.floor(creature.x), Math.floor(creature.y));
    if (!gameState.cargo[cargoKey]) {
        gameState.cargo[cargoKey] = {
            damage,
            ejected: false,
        };
    }
    else {
        gameState.cargo[cargoKey] = Object.assign(Object.assign({}, gameState.cargo[cargoKey]), { damage: gameState.cargo[cargoKey].damage + damage });
    }
    const newCreatureState = {
        x: Math.max(Math.min(creature.x + creature.deltaX, W), 0),
        y: Math.max(Math.min(creature.y + creature.deltaY, H), 0),
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
    if (gameState.radarKey && gameState.ejecting && keyLocation) {
        const { x: x1, y: y1 } = keyLocation;
        const { x: x2, y: y2 } = creature;
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) / W + Math.pow(y2 - y1, 2) / H);
        audio.volume = keyLocation ? Math.min(Math.max(1 - distance, 0.1), 1) : 0;
        const angle = angleTowards(keyLocation, creature, creature.deltaX, creature.deltaY) ||
            0;
        audio.playbackRate =
            creature.behavior === "RUN"
                ? Math.max(Math.PI / 2 - angle, 0.2)
                : Math.max(Math.min(1.5 - distance, 2), 0.2);
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
    // TODO: update for GAME game state instead of READY
    if (gameState.state === "READY") {
        updateCreature();
        playRadarSound();
    }
    if (gameState.showCargos) {
        drawContainers();
        drawCreature();
    }
    gameLoop();
    // last call
    requestAnimationFrame(animate);
}
animate();
