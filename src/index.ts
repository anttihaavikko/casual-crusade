import croissantImage from "../assets/croissant.png";
import { clamp } from "./math";

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const MOVING_SPEED = 2;
const width = 320;
const height = 240;

canvas.id = "game";
canvas.width = width;
canvas.height = height;
const div = document.createElement("div");
div.appendChild(canvas);
document.body.appendChild(canvas);

const image = new Image();
image.src = croissantImage;

const player: pos = {
  x: width / 2,
  y: height / 2,
};

const inputState: InputState = {
  left: false,
  right: false,
  up: false,
  down: false,
};

function tick(t: number) {
  requestAnimationFrame(tick);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (inputState.left) player.x -= MOVING_SPEED;
  if (inputState.right) player.x += MOVING_SPEED;
  if (inputState.up) player.y -= MOVING_SPEED;
  if (inputState.down) player.y += MOVING_SPEED;
  player.x = clamp(player.x, 0, canvas.width - 16);
  player.y = clamp(player.y, 0, canvas.height - 16);

  ctx.drawImage(image, player.x, player.y);
}

requestAnimationFrame(tick);

window.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.key) {
    case "ArrowLeft":
      inputState.left = true;
      break;
    case "ArrowRight":
      inputState.right = true;
      break;
    case "ArrowUp":
      inputState.up = true;
      break;
    case "ArrowDown":
      inputState.down = true;
      break;
  }
});

window.addEventListener("keyup", (e: KeyboardEvent) => {
  switch (e.key) {
    case "ArrowLeft":
      inputState.left = false;
      break;
    case "ArrowRight":
      inputState.right = false;
      break;
    case "ArrowUp":
      inputState.up = false;
      break;
    case "ArrowDown":
      inputState.down = false;
      break;
  }
});

interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

interface pos {
  x: number;
  y: number;
}
