"use strict";

let snake = [
  { row: 5, col: 5 },
  { row: 5, col: 4 },
  { row: 5, col: 3 },
];

let food = generateFood();
let model = createInitialModel();
let gameRunning = true;
let gamePaused = false;
let lastDirection = null;
let score = 0;

function createInitialModel() {
  let m = Array(10)
    .fill(null)
    .map(() => Array(10).fill(0));
  snake.forEach((segment) => (m[segment.row][segment.col] = 1));
  m[food.row][food.col] = 2;
  return m;
}

function generateFood() {
  let row, col;
  do {
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
  } while (isCellOccupied(row, col));
  return { row, col };
}

function isCellOccupied(row, col) {
  return snake.some((segment) => segment.row === row && segment.col === col);
}

function start() {
  console.log("Javascript kører");
  initializeGrid();
  document.addEventListener("keydown", updateDirection);
  displayBoard();
  tick();
}

function initializeGrid() {
  const stage = document.querySelector(".stage");
  for (let i = 0; i < 100; i++) {
    let tile = document.createElement("div");
    tile.className = "tile";
    stage.appendChild(tile);
  }
}

function tick() {
  if (!gameRunning || gamePaused) return;

  setTimeout(tick, 250);
  if (lastDirection) {
    moveSnake();
    if (checkSelfCollision()) {
      gameRunning = false;
      alert("Game Over! Your score: " + score);
      return;
    }
    checkFoodCollision();
    updateModel();
    displayBoard();
  }
}

function checkSelfCollision() {
  const [head, ...body] = snake;
  return body.some(
    (segment) => segment.row === head.row && segment.col === head.col
  );
}

function moveSnake() {
  let newHead = getNewHead();

  snake.unshift(newHead);
  if (newHead.row === food.row && newHead.col === food.col) {
    updateScore(10);
    food = generateFood();
  } else {
    snake.pop();
  }
}

function checkFoodCollision() {
  if (snake[0].row === food.row && snake[0].col === food.col) {
    updateScore(10);
    let tail = snake[snake.length - 1];
    snake.push({ row: tail.row, col: tail.col });
    food = generateFood();
  }
}

function getNewHead() {
  let newHead = { ...snake[0] };
  switch (lastDirection) {
    case "ArrowLeft":
      newHead.col = (newHead.col - 1 + 10) % 10;
      break;
    case "ArrowRight":
      newHead.col = (newHead.col + 1) % 10;
      break;
    case "ArrowUp":
      newHead.row = (newHead.row - 1 + 10) % 10;
      break;
    case "ArrowDown":
      newHead.row = (newHead.row + 1) % 10;
      break;
  }
  return newHead;
}

function updateModel() {
  model.forEach((row) => row.fill(0));
  snake.forEach((segment) => (model[segment.row][segment.col] = 1));
  model[food.row][food.col] = 2;
}

function displayBoard() {
  const tiles = document.querySelectorAll(".stage .tile");
  tiles.forEach((tile) => (tile.className = "tile"));

  snake.forEach((segment, index) => {
    const position = segment.row * 10 + segment.col;
    if (index === 0) {
      tiles[position].classList.add("head");
    } else {
      tiles[position].classList.add("body");
    }
  });

  const foodPosition = food.row * 10 + food.col;
  tiles[foodPosition].classList.add("food");
}

function updateScore(value) {
  score += value;
  document.getElementById("score").textContent = score;
}

function togglePause() {
  gamePaused = !gamePaused;
  if (!gamePaused) tick();
}

function updateDirection(event) {
  if (event.key === " ") {
    togglePause();
    return;
  }

  const validKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
  if (
    validKeys.includes(event.key) &&
    !isOppositeDirection(event.key, lastDirection)
  ) {
    lastDirection = event.key;
  }
}

function isOppositeDirection(newDirection, lastDirection) {
  return (
    (newDirection === "ArrowLeft" && lastDirection === "ArrowRight") ||
    (newDirection === "ArrowRight" && lastDirection === "ArrowLeft") ||
    (newDirection === "ArrowUp" && lastDirection === "ArrowDown") ||
    (newDirection === "ArrowDown" && lastDirection === "ArrowUp")
  );
}

window.addEventListener("load", start);
