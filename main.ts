import { Action, GameState } from "./types";

const PX_SIZE = 96;
const W = 9;
const H = 4;
let fps = 60;

const HEAVY_DAMAGE = 255 * 50;

export function angleTowards(
  A: { x: number; y: number },
  B: { x: number; y: number },
  deltaX: number,
  deltaY: number
) {
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

const audio = document.getElementById("beep") as HTMLAudioElement;
const music = document.getElementById("music") as HTMLAudioElement;
const audioVoice = document.getElementById("voice") as HTMLAudioElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gameStartButton = document.getElementById(
  "game-start"
) as HTMLButtonElement;
const gameContinueButton = document.getElementById(
  "game-continue"
) as HTMLButtonElement;
const gameMenu = document.getElementById("menu") as HTMLDivElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let dialog: Record<string, string>;

fetch("./audio/dialog.txt").then(async (res) => {
  dialog = (await res.text())
    .split("\n")
    .map((line) => line.split("|"))
    .reduce<Record<string, string>>((acc, linePair) => {
      acc[linePair[0]] = linePair[1];
      // fetch(`./audio/en/${linePair[0]}.wav`);
      return acc;
    }, {});
});

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

function containerKeyToXY(key: string) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (containers[y][x] === key) {
        return { x, y };
      }
    }
  }
  return null;
}

function XYToContainerKey(x: number, y: number) {
  if (x > 8 || y > 3) {
    return "";
  }
  return containers[y][x];
}

function getCargoAtXY(x: number, y: number) {
  if (x > 8 || y > 3) {
    return null;
  }
  if (x < 0 || y < 0) {
    return null;
  }
  const containerKey = containers[Math.floor(y)][Math.floor(x)];
  return gameState.cargo[containerKey] || { damage: 0, ejected: false };
}

let frame = 0;

const keysPressed = new Set<string>();

let gameState: GameState = {
  state: "MENU",
  creature: {
    x: Math.random() * W,
    y: Math.random() * H,
    deltaX: 0.005,
    deltaY: 0.005,
    behavior: "ATTACK",
  },
  radarKey: "",
  queuedActions: [],
  unqueuedActions: [],
  cargo: {},
  showCreatureAndDamage: false,
  ejecting: false,
};

function addQueuedAction(action: Action) {
  gameState.queuedActions.push(action);
}
function addUnqueuedAction(action: Action) {
  gameState.unqueuedActions.push(action);
}
function advanceQueuedAction() {
  if (gameState.queuedActions[0]?.type === "TEXT") {
    gameState.queuedActions[0] = {
      ...gameState.queuedActions[0],
      delay: -1,
    };
  }
}

function updateCreatureDelta(newDeltaX: number, newDeltaY: number) {
  gameState.creature.deltaX = newDeltaX;
  gameState.creature.deltaY = newDeltaY;
}

async function getAudioDuration(url: string) {
  try {
    // Fetch the audio file as a Blob
    const response = await fetch(url);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);

    // Create an audio element
    const audio = new Audio();
    audio.src = objectURL;

    // Wait for metadata to load
    return new Promise((resolve, reject) => {
      audio.addEventListener("loadedmetadata", () => {
        return resolve(audio.duration);
      });

      audio.addEventListener("error", (e) => {
        reject("Failed to load audio metadata.");
      });
    });
  } catch (error) {
    console.error("Error fetching audio file:", error);
  }
}

async function addTextAction(...texts: string[]) {
  for (let index = 0; index < texts.length; index++) {
    const text = texts[index];
    const prevText = texts[index - 1] || "";
    if (prevText) {
      const audioDuration = await getAudioDuration(
        `./audio/en/${prevText}.wav`
      );
      addQueuedAction({
        type: "TEXT",
        delay: 1000 * (audioDuration as number),
        data: { text: dialog[text], id: Math.random() },
      });
    } else {
      addQueuedAction({
        type: "TEXT",
        delay: 0,
        data: { text: dialog[text], id: Math.random() },
      });
    }
  }
}

const executeAction = (action: Action) => {
  if (action.delay > 0) {
    return true;
  }
  if (action.type === "GAME_STATE_UPDATE") {
    gameState.state = action.data.state;
  }
  if (action.type === "TEXT") {
    const linesContainer = document.getElementById("lines") as HTMLElement;
    const newLine = document.createElement("div");
    newLine.innerText = action.data.text;
    linesContainer.appendChild(newLine);
    const dialogEntry = Object.entries(dialog).find(([__key, value]) => {
      return value === action.data.text;
    });
    if (dialogEntry?.[0]) {
      audioVoice.src = `./audio/en/${dialogEntry[0]}.wav`;
      audioVoice.load();
      audioVoice.currentTime = 0;
      audioVoice.play();
    }

    if (linesContainer.childElementCount > 4) {
      const targetChild =
        linesContainer.children[linesContainer.childElementCount - 5];
      targetChild.setAttribute("style", "display: none");
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

    const onCargoWithHeavyDamge =
      (getCargoAtXY(creatureInfo.x, creatureInfo.y)?.damage || 0) >=
      HEAVY_DAMAGE;
    if (action.data.count < 5 || onCargoWithHeavyDamge) {
      setTimeout(() => {
        const id = Math.random();
        const newCount = action.data.count + 1;
        addQueuedAction({
          type: "CREATURE_RUN",
          delay: 1000,
          data: {
            count: newCount,
            id,
          },
        });
      }, 0);
    }
    if (action.data.count >= 5) {
      setTimeout(
        () =>
          addQueuedAction({
            type: "CREATURE_ATTACK",
            delay: 0,
            data: {
              id: Math.random(),
            },
          }),
        0
      );
    }
  }
  if (action.type === "CREATURE_ATTACK") {
    gameState.creature.behavior = "ATTACK";
  }
  return false;
};

function attemptToEject(code: string) {
  if (gameState.cargo[code]?.ejected) {
    addTextAction(code, "ejectingFailedAlreadyEjected");
    return { result: false, reason: "ejected" };
  }
  if (gameState.cargo[code]?.damage > HEAVY_DAMAGE) {
    addTextAction(code, "ejectingFailedTooDamaged");
    return { result: false, reason: "damage" };
  }
  gameState.cargo[code] = {
    ...gameState.cargo[code],
    ejected: true,
  };
  addTextAction(code, "isEjected", "ejectingDisengaged");
  gameState.ejecting = false;
  return { result: true };
}

function gameLoop() {
  // TODO: update for GAME game state instead of READY
  if (gameState.state === "GAME") {
    updateCreature();
    playRadarSound();
  }

  drawContainers();
  if (gameState.showCreatureAndDamage) {
    drawCreature();
  }

  // execute queued actions
  gameState.queuedActions = gameState.queuedActions.map((action, index) => {
    if (index !== 0) {
      return action;
    }
    return {
      ...action,
      delay: action.delay - 1000 / fps,
    };
  });
  gameState.unqueuedActions = gameState.unqueuedActions.map((action) => {
    return {
      ...action,
      delay: action.delay - 1000 / fps,
    };
  });
  gameState.queuedActions = gameState.queuedActions.filter(executeAction);
  gameState.unqueuedActions = gameState.unqueuedActions.filter(executeAction);
}

document.onkeydown = function (e) {
  // key code for space
  if (e.code === "Enter" && gameState.state === "READY") {
    gameState.state = "GAME";
  }
  if (e.code === "Space") {
    advanceQueuedAction();
  }
  if (e.code === "Slash") {
    if (localStorage.getItem("debugger") === "true") {
      gameState.showCreatureAndDamage = !gameState.showCreatureAndDamage;
    }
  }
  if (e.code === "Escape") {
    gameState.state = "MENU";
    gameMenu.setAttribute("style", "");
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
    addTextAction("ejectingEngaged");
    gameState.ejecting = true;
    return;
  }
  if (e.code === "ShiftLeft" && gameState.ejecting) {
    addTextAction("ejectingDisengaged");
    gameState.ejecting = false;
    return;
  }
  if (gameState.radarKey === e.code) {
    gameState.radarKey = [...keysPressed][0] || "";
  }
};

function drawContainers() {
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgb(47, 255, 0)";

  ctx.beginPath();
  for (let row = 0; row < H; row++) {
    for (let col = 0; col < W; col++) {
      const cargoKey = XYToContainerKey(col, row);
      const cargoDamage = gameState.cargo[cargoKey]?.damage;
      const width = PX_SIZE;
      const height = PX_SIZE;
      const x = PX_SIZE * col;
      const y = PX_SIZE * row;
      ctx.rect(x, y, width, height);
      if (gameState.cargo[cargoKey]?.ejected) {
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
}

function drawCreature() {
  const x = PX_SIZE * gameState.creature.x;
  const y = PX_SIZE * gameState.creature.y;
  ctx.beginPath();
  ctx.arc(x, y, PX_SIZE / 12, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.stroke();
}

function updateCreature() {
  const { creature } = gameState;
  // invert delta if hitting a wall
  if (creature.x + creature.deltaX < 0 || creature.x + creature.deltaX > W) {
    updateCreatureDelta(-creature.deltaX, creature.deltaY);
  }
  if (creature.y + creature.deltaY < 0 || creature.y + creature.deltaY > H) {
    updateCreatureDelta(creature.deltaX, -creature.deltaY);
  }
  // invert delta if hitting a containment that's ejected
  if (
    gameState.cargo[
      XYToContainerKey(
        Math.floor(creature.x + creature.deltaX),
        Math.floor(creature.y)
      )
    ]?.ejected
  ) {
    updateCreatureDelta(-creature.deltaX, creature.deltaY);
  }
  if (
    gameState.cargo[
      XYToContainerKey(
        Math.floor(creature.x),
        Math.floor(creature.y + creature.deltaY)
      )
    ]?.ejected
  ) {
    updateCreatureDelta(creature.deltaX, -creature.deltaY);
  }

  if (creature.behavior === "ATTACK") {
    updateCreatureDelta((Math.random() - 0.5) / 50, (Math.random() - 0.5) / 50);
  }
  const damage = creature.behavior === "ATTACK" ? 30 : 5;
  const cargoKey = XYToContainerKey(
    Math.floor(creature.x),
    Math.floor(creature.y)
  );
  if (!gameState.cargo[cargoKey]) {
    gameState.cargo[cargoKey] = {
      damage,
      ejected: false,
    };
  } else {
    gameState.cargo[cargoKey] = {
      ...gameState.cargo[cargoKey],
      damage: gameState.cargo[cargoKey].damage + damage,
    };
  }
  // add run action if cargo is heavily damage
  // TODO add run action if ejection was just attempted and failed
  const cargoDamage = gameState.cargo[cargoKey]?.damage;
  if (cargoDamage > HEAVY_DAMAGE && creature.behavior !== "RUN") {
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

  const newCreatureState: GameState["creature"] = {
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
  if (gameState.radarKey && !gameState.ejecting && keyLocation) {
    const { x: x1, y: y1 } = keyLocation;
    const { x: x2, y: y2 } = creature;
    const distance = Math.sqrt(
      Math.pow(x2 - x1, 2) / W + Math.pow(y2 - y1, 2) / H
    );

    audio.volume = keyLocation ? Math.min(Math.max(1 - distance, 0.1), 1) : 0;

    const angle =
      angleTowards(keyLocation, creature, creature.deltaX, creature.deltaY) ||
      0;

    audio.playbackRate = Math.max(Math.min(1.5 - distance, 2), 0.2);

    // audio.playbackRate =
    //   creature.behavior === "RUN"
    //     ? Math.max(Math.PI / 2 - angle, 0.2)
    //     : Math.max(Math.min(1.5 - distance, 2), 0.2);

    if (audio.paused) {
      audio.play();
    }
  }
  if (!gameState.radarKey) {
    audio.volume = 0;
    if (!audio.paused) {
      audio.pause();
    }
  }
}

function animate() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame += 1;

  if (gameState.state !== "MENU") {
    gameLoop();
  }

  // last call
  requestAnimationFrame(animate);
}
animate();

gameStartButton.onclick = () => {
  gameState.state = "OPENING";
  gameMenu.setAttribute("style", "display: none");
  gameStartButton.setAttribute("style", "display: none");
  gameContinueButton.setAttribute("style", "");
  music.play();
  addTextAction(
    "opening1",
    "opening2",
    "opening3",
    "opening4",
    "opening5",
    "opening6",
    "opening7",
    "opening8",
    "opening9",
    "opening10",
    "opening11",
    "opening12",
    "opening13"
  );
  addQueuedAction({
    type: "GAME_STATE_UPDATE",
    delay: 0,
    data: { state: "READY", id: Math.random() },
  });
};

gameContinueButton.onclick = () => {
  gameState.state = "GAME";
  gameMenu.setAttribute("style", "display: none");
};

let lastFrameCount = 0;
setInterval(() => {
  fps = frame - lastFrameCount;
  lastFrameCount = frame;
}, 1000);
