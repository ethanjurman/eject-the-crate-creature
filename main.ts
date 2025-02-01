const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let frame = 0;
let lines: string[] = [];

type TextAction = {
  delay: number;
  type: "text";
  data: {
    text: string;
  };
};

type NewLineAction = {
  delay: number;
  type: "new-line";
  data: {};
};

type Action = TextAction | NewLineAction;

type GameState = {
  state: "READY" | "START" | "GAME" | "END";
  creature: {
    x: number;
    y: number;
  };
  radarKey: string;
  // each queued action waits until the previous one is done
  queuedActions: Action[];
  // each unqueued action goes at the same time
  unqueuedActions: Action[];
  cargo: {
    key: string;
    damage: number;
    ejected: boolean;
  }[];
};

let gameState: GameState = {
  state: "READY",
  creature: {
    x: -1,
    y: -1,
  },
  radarKey: "",
  queuedActions: [],
  unqueuedActions: [],
  cargo: [],
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
      "WE BELIEVE A CREATURE FROM CRATE X72 WAS NOT PROPERLY CONTAINED IS NOW DESTROYING NEIGHBORING CARGO UNITS.",
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
};

function animate() {
  frame += 1;
  requestAnimationFrame(animate);

  gameLoop();

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
animate();
