import { Card, Direction, Gem, TILE_HEIGHT, TILE_WIDTH } from "./card";
import { Dude } from "./dude";
import { Camera } from "./engine/camera";
import { Container } from "./engine/container";
import { Entity, sortByDepth } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector, ZERO } from "./engine/vector";
import { Game } from "./game";
import { Level } from "./level";
import { TextEntity } from "./text";

const WIDTH = 800;
const HEIGHT = 600;

const boardPos: Vector = {
  x: WIDTH * 0.5 - TILE_WIDTH * 1.5,
  y: HEIGHT * 0.5 - TILE_HEIGHT * 1.5
};

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")

const lifeText = new TextEntity("LIFE: 10", 30, 10, 35, -1, ZERO, { shadow: 4, align: "left" });
const scoreText = new TextEntity("0", 30, WIDTH - 10, 35, -1, ZERO, { shadow: 4, align: "right" });
const effects = new Container();
const camera = new Camera();
const level = new Level(boardPos);

const dude = new Dude(level.board[2]);

const mouse: Mouse = { x: 0, y: 0 };
const game = new Game(dude, effects, camera, level);

const p = level.board[2].getPosition();

const entities: Entity[] = [
  game,
  lifeText,
  scoreText
];

level.starter = new Card(p.x, p.y, level, game, { directions: [Direction.Up, Direction.Right, Direction.Down, Direction.Left], gem: Gem.None });
level.starter.lock();
level.board[2].content = level.starter;
entities.push(level.starter);

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
  scoreText.content = game.score.toString();
  lifeText.content = `LIFE: ${game.life}`;
  requestAnimationFrame(tick);
  ctx.resetTransform();
  camera.update();
  ctx.translate(camera.offset.x, camera.offset.y);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  entities.forEach(e => e.update(t, mouse));
  effects.update(t, mouse);
  const all = [...entities, ...effects.getChildren(), ...level.board];
  all.sort(sortByDepth);
  all.forEach(e => e.draw(ctx));
}

requestAnimationFrame(tick);