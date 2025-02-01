import { Action, GameState } from "./types";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 480;
canvas.height = 320;

let frame = 0;

const keysPressed = new Set<string>();

let gameState: GameState = {
  state: "READY",
  creature: {
    x: 4,
    y: 2,
    deltaX: 0.005,
    deltaY: 0.005,
    behavior: "RUN",
  },
  radarKey: "",
  queuedActions: [],
  unqueuedActions: [],
  cargo: [],
  showCargos: true,
};

function addQueuedAction(action: Action) {
  gameState.queuedActions.push(action);
}
function addUnqueuedAction(action: Action) {
  gameState.unqueuedActions.push(action);
}
function advanceQueuedAction() {
  gameState.queuedActions[0] = {
    ...gameState.queuedActions[0],
    delay: -1,
  };
}

function addTextAction(...texts: string[]) {
  texts.forEach((text, index) => {
    const prevText = texts[index - 1] || "";
    addQueuedAction({
      type: "text",
      delay: Math.max(prevText.split(" ").length * 50, 180),
      data: { text },
    });
  });
}

const executeAction = (action: Action) => {
  if (action.delay > 0) {
    return true;
  }
  if (action.type === "text") {
    const linesContainer = document.getElementById("lines") as HTMLElement;
    const newLine = document.createElement("div");
    newLine.innerText = action.data.text;
    linesContainer.appendChild(newLine);
    if (linesContainer.childElementCount > 4) {
      const targetChild =
        linesContainer.children[linesContainer.childElementCount - 5];
      targetChild.setAttribute("style", "display: none");
    }
  }
  return false;
};

function gameLoop() {
  // execute queued actions
  gameState.queuedActions = gameState.queuedActions.map((action, index) => {
    if (index !== 0) {
      return action;
    }
    return {
      ...action,
      delay: action.delay - 1,
    };
  });
  gameState.unqueuedActions = gameState.unqueuedActions.map((action) => {
    return {
      ...action,
      delay: action.delay - 1,
    };
  });
  gameState.queuedActions = gameState.queuedActions.filter(executeAction);
  gameState.unqueuedActions = gameState.unqueuedActions.filter(executeAction);
}

document.onkeydown = function (e) {
  // key code for space
  if (e.code === "Enter") {
    addTextAction(
      "BOOTING UP CARGO BAY COMPUTER INTELEGENCE...",
      "GOOD MORNING CAPTAIN.",
      "WE HAVE WOKEN YOU EARLY FROM CRYO SLEEP TO DEAL WITH AN ANOMOLY IN THE CARGO BAY.",
      "WE BELIEVE A CREATURE FROM CRATE X-7/2 WAS NOT PROPERLY CONTAINED IS NOW DESTROYING NEIGHBORING CARGO UNITS.",
      "THIS IS AN UNACCEPTABLE LOSS FOR THE CORPERATION.",
      "THERE ARE 36 CONTAINERS IN THE CARGO BAY. THEY ARE LABELED AND LOCATED BASED ON THE KEYBOARD CONFIGURATION IN FRONT OF YOU.",
      "1 THROUGH 9 TO Z THROUGH PERIOD ARE ALL VALID CARGO KEYS.",
      "PRESS ANY CARGO KEY ON YOUR KEYBOARD TO ACTIVATE ITS DOPPLER-RADAR FROM ITS RESPECTIVE LOCATION.",
      "PRESS SHIFT PLUS ANY CARGO KEY TO EJECT THE CONTAINER INTO SPACE.",
      "IDENTIFY THE CREATURES LOCATION.",
      "EJECT IT.",
      "DO NOT EJECT AN EXTRANIOUS CARGO, YOU WILL BE FINED FOR ANY UNECESSARY LOSSES.",
      "PRESS ENTER TO BEGIN."
    );
  }
  if (e.code === "Space") {
    advanceQueuedAction();
  }
  if (e.code === "Slash") {
    gameState.showCargos = !gameState.showCargos;
  }
  keysPressed.add(e.code);
  gameState.radarKey = e.code;
  console.log(gameState.radarKey);
};

document.onkeyup = function (e) {
  keysPressed.delete(e.code);
  if (gameState.radarKey === e.code) {
    gameState.radarKey = [...keysPressed][0] || "";
  }
};

function drawContainers() {
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

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgb(47, 255, 0)";

  ctx.beginPath();
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 9; col++) {
      const width = 20;
      const height = 20;
      const x = 10 + 48 * col;
      const y = 10 + 48 * row;
      ctx.rect(x, y, width, height);
      if (gameState.radarKey === containers[row][col]) {
        ctx.fillStyle = "rgb(47, 255, 0)";
        ctx.fillRect(x, y, width, height);
      }
    }
  }
  ctx.stroke();
}

function drawCreature() {
  const x = 10 + 48 * gameState.creature.x + 10;
  const y = 10 + 48 * gameState.creature.y + 10;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}

function updateCreature() {
  const { creature } = gameState;
  // invert delta if hitting a wall
  if (creature.x + creature.deltaX < 0 || creature.x + creature.deltaX > 8) {
    creature.deltaX = -creature.deltaX;
  }
  if (creature.y + creature.deltaY < 0 || creature.y + creature.deltaY > 3) {
    creature.deltaY = -creature.deltaY;
  }

  const newCreatureState: GameState["creature"] = {
    x: creature.x + creature.deltaX,
    y: creature.y + creature.deltaY,
    deltaX: creature.deltaX,
    deltaY: creature.deltaY,
    behavior: creature.behavior,
  };
  gameState.creature = newCreatureState;
}

function animate() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame += 1;

  if (gameState.state === "READY") {
    updateCreature();
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
