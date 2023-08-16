import { Card, Direction, Gem, TILE_HEIGHT, TILE_WIDTH } from "./card";
import { Dude } from "./dude";
import { AudioManager } from "./engine/audio";
import { ButtonEntity } from "./engine/button";
import { Camera } from "./engine/camera";
import { Container } from "./engine/container";
import { Entity, sortByDepth } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector, ZERO } from "./engine/vector";
import { Game } from "./game";
import { Level } from "./level";
import { TextEntity } from "./text";

export const WIDTH = 800;
export const HEIGHT = 600;

const audio = new AudioManager();

const boardPos: Vector = {
  x: WIDTH * 0.5 - TILE_WIDTH * 1.5,
  y: HEIGHT * 0.5 - TILE_HEIGHT * 1.75
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
const game = new Game(dude, effects, camera, level, audio);

const p = level.board[2].getPosition();
const startButton = new ButtonEntity("PLAY", WIDTH * 0.5, HEIGHT * 0.5 + 150, 250, 75, true, () => {}, audio);

const entities: Entity[] = [
  game,
  lifeText,
  scoreText,
  startButton
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

document.onkeydown = (e: KeyboardEvent) => {
  audio.playMusic();
  if(e.key == 'n') {
    game.nextLevel();
  }
}

document.onmousedown = (e: MouseEvent) => {
  mouse.pressing = true;
  if(startButton.isInside(mouse)) {
    startButton.visible = false;
    game.started = true;
  }
  setTimeout(() => audio.playMusic(), 75);
};
document.onmouseup = (e: MouseEvent) => mouse.pressing = false;

function tick(t: number) {
  scoreText.content = game.score.toString();
  lifeText.content = `LIFE: ${game.life}/${game.maxLife}`;
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