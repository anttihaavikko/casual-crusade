import { tartan } from "./bg";
import { Card } from "./card";
import { Dude } from "./dude";
import { AudioManager } from "./engine/audio";
import { ButtonEntity } from "./engine/button";
import { Camera } from "./engine/camera";
import { Container } from "./engine/container";
import { Entity, sortByDepth } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { ZERO } from "./engine/vector";
import { Game } from "./game";
import { Level } from "./level";
import { TextEntity } from "./text";
import { transformToCenter } from "./engine/transformer";

export const WIDTH = 800;
export const HEIGHT = 600;

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

const level = new Level();

const dude = new Dude(level.board[2]);

const mouse: Mouse = { x: 0, y: 0 };
const game = new Game(dude, new Container(), new Camera(), level, new AudioManager(), mouse);

const startButton = new ButtonEntity("PLAY", WIDTH * 0.5, HEIGHT * 0.5 + 210, 250, 75, () => {}, game.audio);

const startUi: Entity[] = [
  startButton,
  new TextEntity("CASUAL CRUSADE", 70, WIDTH * 0.5, 95, -1, ZERO, { shadow: 7 }),
  new TextEntity("by Antti Haavikko", 35, WIDTH * 0.5, 140, -1, ZERO, { shadow: 4 }),
  new TextEntity("Made for js13k 2023", 20, WIDTH * 0.5, 170, -1, ZERO, { shadow: 2 }),
  new TextEntity("Press F for full screen", 18, WIDTH * 0.5, HEIGHT - 20, -1, ZERO, { shadow: 2 })
];

const ui: TextEntity[] = [
  new TextEntity("LIFE: 10", 30, 10, 35, -1, ZERO, { shadow: 3, align: "left" }),
  new TextEntity("0", 50, WIDTH - 15, 55, -1, ZERO, { shadow: 4, align: "right" }),
];

const p = dude.p;
level.starter = new Card(p.x, p.y, level, game, { directions: ["u", "r", "d", "l"] });
level.starter.lock();
level.board[2].content = level.starter;

canvas.id = "game";
canvas.width = WIDTH;
canvas.height = HEIGHT;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
document.body.appendChild(canvas);

let ratio = 1;
let x = 0;
let y = 0;

const resize = () => {
  ratio = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
  canvas.style.transformOrigin = "top left";
  x = (window.innerWidth - WIDTH * ratio) * 0.5;
  y = (window.innerHeight - HEIGHT * ratio) * 0.5;
  canvas.style.transform = `translate(${x}px,${y}px) scale(${ratio})`;
};

resize();
window.onresize = resize;

let isFull = false;
document.onfullscreenchange = () => isFull = !isFull;

document.onmousemove = (e: MouseEvent) => {
  mouse.x = isFull ? (e.x / window.innerWidth * WIDTH) : e.offsetX;
  mouse.y = isFull ? (e.y / window.innerHeight * HEIGHT) : e.offsetY;
};

document.onkeydown = (e: KeyboardEvent) => {
  game.audio.prepare();
  if(e.key == 'f') {
    canvas.requestFullscreen();
  }
  // if(e.key == 'd') {
  //   game.discard();
  // }
  // if(e.key == 'n') {Fix 
  //   game.nextLevel();
  //   // game.life += 100;
  // }
  // if(e.key == 'p') {
  //   level.level++;
  //   game.picker.create(1, 1);
  // }
  // if(e.key == 'c') {
  //   game.picker.rewards = 1;
  //   game.picker.create(1, 0);
  // }
}

document.ontouchstart = (e: TouchEvent) => {
  game.click((e.touches[0].clientX - x) / ratio, (e.touches[0].clientY - y) / ratio);
};

document.onmousedown = (e: MouseEvent) => {
  game.audio.play();
  mouse.pressing = true;
  if(startButton.isInside(mouse)) {
    startButton.visible = false;
    game.audio.pop();
    setTimeout(() => {
      if(!game.started) game.showIntro();
      game.started = true;
    }, 100);
  }
};

document.onmouseup = (e: MouseEvent) => mouse.pressing = false;

let zoom = 1.2;

const tick = (t: number) => {
  ui[0].content = `LIFE: ${game.life}/${game.maxLife}`;
  ui[1].content = game.score.toString()/*.replace(/\B(?=(\d{3})+(?!\d))/g, " ")*/;
  requestAnimationFrame(tick);
  ctx.resetTransform();
  transformToCenter(ctx, game.camera.rotation, zoom, zoom)
  ctx.translate(0, game.started ? 0 : 30);
  ctx.translate(game.camera.offset.x, game.camera.offset.y);
  ctx.fillStyle = "#74be75";
  ctx.fillRect(-100, -100, canvas.width + 200, canvas.height + 200);
  tartan(ctx);
  game.update(t, mouse);
  const all = [game, ...game.effects.getChildren(), ...level.board, level.starter];
  all.sort(sortByDepth);
  level.board.forEach(t => t.prePreDraw(ctx));
  level.board.forEach(t => t.preDraw(ctx));
  all.forEach(e => e.draw(ctx));
  if(!game.started) {
    ctx.resetTransform();
    startUi.forEach(e => {
      e.update(t, mouse);
      e.draw(ctx);
      game.blinders.draw(ctx);
    });
    return;
  }
  zoom = Math.max(1, zoom - 0.02);
  ui.forEach(e => e.draw(ctx));
  game.blinders.draw(ctx);
}

requestAnimationFrame(tick);