import { Queue } from "/utils.js";
("use-strict");

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 16;
const TICK_RATE = 200; // Milliseconds per tick

let snakeQueue;
let apple;
let direction = { x: 1, y: 0 };
let gameInterval;

const board = document.getElementById("board");

window.addEventListener("load", start);

function start() {
  buildBoard();
  initSnake();
  generateApple();
  gameInterval = setInterval(moveSnake, TICK_RATE);
}

function buildBoard() {
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${x}-${y}`;
      board.appendChild(cell);
    }
  }
}

function initSnake() {
  snakeQueue = new Queue();
  snakeQueue.enqueue({ x: 10, y: 10 });
  const snakeHead = document.getElementById(
    `${snakeQueue.front().x}-${snakeQueue.front().y}`
  );
  snakeHead.classList.add("snake");
}

function moveSnake() {
  const head = {
    x: snakeQueue.front().x + direction.x,
    y: snakeQueue.front().y + direction.y,
  };
  if (
    head.x < 0 ||
    head.x >= BOARD_WIDTH ||
    head.y < 0 ||
    head.y >= BOARD_HEIGHT ||
    snakeQueue.contains(head)
  ) {
    clearInterval(gameInterval);
    alert("Game over!");
    return;
  }

  snakeQueue.enqueue(head);
  const cell = document.getElementById(`${head.x}-${head.y}`);
  cell.classList.add("snake");

  if (head.x === apple.x && head.y === apple.y) {
    generateApple();
  } else {
    const tail = snakeQueue.dequeue();
    const tailCell = document.getElementById(`${tail.x}-${tail.y}`);
    tailCell.classList.remove("snake");
  }
}

function generateApple() {
  let x, y;
  do {
    x = Math.floor(Math.random() * BOARD_WIDTH);
    y = Math.floor(Math.random() * BOARD_HEIGHT);
  } while (snakeQueue.contains({ x, y }));
  apple = { x, y };
  const appleCell = document.getElementById(`${apple.x}-${apple.y}`);
  appleCell.classList.add("apple");
}

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y !== 1) {
        direction = { x: 0, y: -1 };
      }
      break;
    case "ArrowDown":
      if (direction.y !== -1) {
        direction = { x: 0, y: 1 };
      }
      break;
    case "ArrowLeft":
      if (direction.x !== 1) {
        direction = { x: -1, y: 0 };
      }
      break;
    case "ArrowRight":
      if (direction.x !== -1) {
        direction = { x: 1, y: 0 };
      }
      break;
  }
});
