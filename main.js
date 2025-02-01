"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frame = 0;
let lines = [];
let gameState = {
    state: "START",
    creature: {
        x: -1,
        y: -1,
    },
    radarKey: -1,
    queuedActions: [],
    unqueuedActions: [],
};
function addQueuedAction(action) {
    gameState.queuedActions.push(action);
}
function addUnqueuedAction(action) {
    gameState.unqueuedActions.push(action);
}
function gameLoop() {
    // execute queued actions
    gameState.queuedActions = gameState.queuedActions.map((action) => {
        return Object.assign(Object.assign({}, action), { delay: action.delay - 1 });
    });
    gameState.queuedActions = gameState.queuedActions.filter((action) => {
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
    });
}
document.onkeydown = function (e) {
    // key code for space
    if (e.code === "Space") {
        addQueuedAction({
            type: "text",
            delay: 0,
            data: {
                text: "Hello world " + Math.floor(Math.random() * 100),
            },
        });
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
