import { HEIGHT, WIDTH } from "./index";

export function tartan(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(WIDTH * 0.5, HEIGHT * 0.5);
    ctx.rotate(-Math.PI * 0.25);
    ctx.scale(1.5, 1.5);
    ctx.translate(-WIDTH * 0.75, -HEIGHT * 0.75);
    ctx.fillStyle = "#ffffff22";
    for(let i = 0; i < 5; i++) {
        ctx.fillRect(200 * i, 0, 100, 999);
        ctx.fillRect(200 * i - 70, 0, 5, 999);
        ctx.fillRect(200 * i - 35, 0, 5, 999);
        ctx.fillRect(200 * i + 50, 0, 5, 999);
        // ctx.fillRect(0, 200 * i, 999, 100);
        // ctx.fillRect(0, 200 * i - 70, 999, 5);
        // ctx.fillRect(0, 200 * i - 35, 999, 5);
        // ctx.fillRect(0, 200 * i + 50, 999, 5);
    }
    ctx.save();
    ctx.translate(WIDTH * 0.5, HEIGHT * 0.5);
    ctx.rotate(-Math.PI * 0.5);
    ctx.translate(-WIDTH * 0.5, -HEIGHT * 0.75);
    for(let i = 0; i < 5; i++) {
    ctx.fillRect(200 * i, 0, 100, 999);
    ctx.fillRect(200 * i - 70, 0, 5, 999);
    ctx.fillRect(200 * i - 35, 0, 5, 999);
    ctx.fillRect(200 * i + 50, 0, 5, 999);
    }
    ctx.restore();
    ctx.restore();
}