import { transformToCenter } from "./engine/transformer";

export const tartan = (ctx: CanvasRenderingContext2D): void => {
    ctx.save();
    transformToCenter(ctx, -Math.PI * 0.25, 1.5, 1.5)
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
    transformToCenter(ctx, -Math.PI * 0.5);
    for(let i = 0; i < 5; i++) {
        ctx.fillRect(200 * i, 0, 100, 999);
        ctx.fillRect(200 * i - 70, 0, 5, 999);
        ctx.fillRect(200 * i - 35, 0, 5, 999);
        ctx.fillRect(200 * i + 50, 0, 5, 999);
    }
    ctx.restore();
    ctx.restore();
}