import { Vector } from "./vector";

export function drawCircle(ctx: CanvasRenderingContext2D, pos: Vector, radius: number, color: string): void {
    drawEllipse(ctx, pos, radius, radius, color);
}

export function drawEllipse(ctx: CanvasRenderingContext2D, pos: Vector, x: number, y: number, color: string): void {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.ellipse(pos.x, pos.y, x, y, 0, 0, Math.PI * 2);
    ctx.fill();
}