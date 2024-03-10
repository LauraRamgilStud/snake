"use-strict";
/* ############## CIRCULAR BUFFER ################ */
class CircularBuffer {
  constructor(capacity) {
    this.array = new Array(capacity);
    this.readIndex = 0;
    this.writeIndex = 0;
    this.size = 0;
    this.capacity = capacity;
  }

  add(element) {
    if (this.isFull()) {
      throw new Error("Buffer is full");
    }
    this.array[this.writeIndex] = element;
    this.writeIndex = (this.writeIndex + 1) % this.capacity;
    this.size++;
  }

  remove() {
    if (this.isEmpty()) {
      throw new Error("Buffer is empty");
    }
    const element = this.array[this.readIndex];
    this.array[this.readIndex] = undefined; // Clear the slot
    this.readIndex = (this.readIndex + 1) % this.capacity;
    this.size--;
    return element;
  }

  isEmpty() {
    return this.size === 0;
  }

  isFull() {
    return this.size === this.capacity;
  }
}

/*GLOBAL VARIABLES*/
const GRID_WIDTH = 30;
const GRID_HEIGHT = 20;
const TICK_RATE = 200; // milliseconds

let model = createModel();
let snake = [{ row: 5, col: 5 }];
let direction;
let gameInterval;

let food = generateFood();

window.addEventListener("load", load);

/* ############## CONTROLLER ################ */

function load() {
  document.addEventListener("keydown", handleKeyDown);
  gameInterval = setInterval(tick, TICK_RATE);
}

function handleKeyDown(evt) {
  const key = evt.key;
  if (key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (key === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (key === "ArrowRight" && direction !== "left") {
    direction = "right";
  }
}

/* ############## VIEW ################ */
function draw() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);
    }
  }

  snake.forEach((segment) => {
    const snakeCell = document.createElement("div");
    snakeCell.classList.add("snake");
    const cell = grid.children[segment.row * GRID_WIDTH + segment.col];
    cell.appendChild(snakeCell);
  });

  const foodCell = document.createElement("div");
  foodCell.classList.add("food");
  const cell = grid.children[food.row * GRID_WIDTH + food.col];
  cell.appendChild(foodCell);
}

/* ############## MODEL ################ */
function createModel() {
  return new CircularBuffer(GRID_WIDTH * GRID_HEIGHT);
}

function tick() {
  moveSnake();
  checkCollision();
  draw();
}

function moveSnake() {
  let newHead = { ...snake[0] };
  if (direction === "up") {
    newHead.row--;
  } else if (direction === "down") {
    newHead.row++;
  } else if (direction === "left") {
    newHead.col--;
  } else if (direction === "right") {
    newHead.col++;
  }

  snake.unshift(newHead);
  if (newHead.row === food.row && newHead.col === food.col) {
    model.add(food);
    food = generateFood();
  } else {
    model.remove();
  }
}

function checkCollision() {
  const head = snake[0];
  if (
    head.row < 0 ||
    head.row >= GRID_HEIGHT ||
    head.col < 0 ||
    head.col >= GRID_WIDTH
  ) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.row === snake[i].row && head.col === snake[i].col) {
      gameOver();
    }
  }
}

function gameOver() {
  clearInterval(gameInterval);
  alert("Game Over!");
}

function generateFood() {
  let foodPosition;
  do {
    foodPosition = {
      row: Math.floor(Math.random() * GRID_HEIGHT),
      col: Math.floor(Math.random() * GRID_WIDTH),
    };
  } while (isFoodOnSnake(foodPosition));

  return foodPosition;
}

function isFoodOnSnake(foodPosition) {
  return snake.some(
    (segment) =>
      segment.row === foodPosition.row && segment.col === foodPosition.col
  );
}
