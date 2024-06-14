const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const controls = document.getElementById('controls');
const leftBtn = document.getElementById('leftBtn');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const rightBtn = document.getElementById('rightBtn');

const box = 20;
let canvasWidth, canvasHeight, canvasSize;

let snake, direction, food, score, game;

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

startButton.addEventListener('click', startGame);
leftBtn.addEventListener('click', () => changeDirection('LEFT'));
upBtn.addEventListener('click', () => changeDirection('UP'));
downBtn.addEventListener('click', () => changeDirection('DOWN'));
rightBtn.addEventListener('click', () => changeDirection('RIGHT'));

function startGame() {
  snake = [{ x: Math.floor(canvasSize.width / 2), y: Math.floor(canvasSize.height / 2) }];
  direction = 'RIGHT';
  food = generateFood();
  score = 0;

  startButton.style.display = 'none';
  canvas.style.display = 'block';
  controls.style.display = 'flex';

  if (game) clearInterval(game);
  game = setInterval(draw, 160);
}

function changeDirection(newDirection) {
  if (newDirection === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT';
  else if (newDirection === 'UP' && direction !== 'DOWN') direction = 'UP';
  else if (newDirection === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT';
  else if (newDirection === 'DOWN' && direction !== 'UP') direction = 'DOWN';
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasSize.width * box, box);
  ctx.fillRect(0, 0, box, canvasSize.height * box);
  ctx.fillRect((canvasSize.width - 1) * box, 0, box, canvasSize.height * box);
  ctx.fillRect(0, (canvasSize.height - 1) * box, canvasSize.width * box, box);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i === 0) ? 'green' : 'white';
    ctx.fillRect(snake[i].x * box, snake[i].y * box, box, box);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(snake[i].x * box, snake[i].y * box, box, box);
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * box, food.y * box, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'LEFT') snakeX--;
  if (direction === 'UP') snakeY--;
  if (direction === 'RIGHT') snakeX++;
  if (direction === 'DOWN') snakeY++;

  if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize.width || snakeY >= canvasSize.height || collision({ x: snakeX, y: snakeY }, snake)) {
    clearInterval(game);
    alert('Game Over');
    startButton.style.display = 'block';
    canvas.style.display = 'none';
    controls.style.display = 'none';
    return;
  }

  snake.unshift({ x: snakeX, y: snakeY });

  if (snakeX === food.x && snakeY === food.y) {
    food = generateFood();
    score++;
  } else {
    snake.pop();
  }
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function generateFood() {
  let foodX, foodY;
  do {
    foodX = Math.floor(Math.random() * (canvasSize.width - 2)) + 1;
    foodY = Math.floor(Math.random() * (canvasSize.height - 2)) + 1;
  } while (collision({ x: foodX, y: foodY }, snake));
  return { x: foodX, y: foodY };
}

function resizeCanvas() {
  const container = document.querySelector('.container');
  const containerStyle = getComputedStyle(container);
  const containerWidth = parseFloat(containerStyle.width);
  const containerHeight = parseFloat(containerStyle.height);

  canvas.width = containerWidth * 0.8;
  canvas.height = containerHeight * 0.6;

  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  canvasSize = { width: Math.floor(canvasWidth / box), height: Math.floor(canvasHeight / box) };

  if (game) clearInterval(game);
  startGame();
}

document.addEventListener('DOMContentLoaded', () => {
  const busInfoElement = document.getElementById('bus-info');
  const imminentBuses = JSON.parse(sessionStorage.getItem('imminentBuses'));

  if (imminentBuses && imminentBuses.length > 0) {
    busInfoElement.textContent = `1분 이내 도착하는 버스: ${imminentBuses.join(', ')}`;
    busInfoElement.style.display = 'block';

    setTimeout(() => {
      busInfoElement.style.display = 'none';
    }, 5000);
  }
});
