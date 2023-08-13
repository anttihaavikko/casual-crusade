import { TILE_HEIGHT, TILE_WIDTH, Card, Direction } from "./card";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector } from "./engine/vector";
import { Hand } from "./hand";
import { clamp } from "./math";
import { Tile } from "./tile";

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const WIDTH = 800;
const HEIGHT = 600;

const board: Tile[] = [
  new Tile(0, 0),
  new Tile(0, 1),
  new Tile(0, 2),
  new Tile(1, 0),
  new Tile(1, 1),
  new Tile(1, 2),
  new Tile(2, 0),
  new Tile(2, 1),
  new Tile(2, 2),
];

const mouse: Mouse = { x: 0, y: 0 };
const hand = new Hand(board);

const entities: Entity[] = [
  hand
];

const starter = new Card(TILE_WIDTH, TILE_HEIGHT, board, hand, [Direction.Up, Direction.Right, Direction.Down, Direction.Left]);
starter.lock();
entities.push(starter);
board[4].content = starter;

board.forEach(tile => entities.push(tile));

canvas.id = "game";
canvas.width = WIDTH;
canvas.height = HEIGHT;
const div = document.createElement("div");
div.appendChild(canvas);
document.body.appendChild(canvas);

canvas.onmousemove = (e: MouseEvent) => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
};

document.onmousedown = (e: MouseEvent) => mouse.pressing = true;
document.onmouseup = (e: MouseEvent) => mouse.pressing = false;

function tick(t: number) {
  requestAnimationFrame(tick);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  entities.sort((a, b) => a.depth - b.depth);
  entities.forEach(e => e.update(t, mouse));
  entities.forEach(e => e.draw(ctx));
}

requestAnimationFrame(tick);