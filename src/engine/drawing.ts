import { Vector } from "./vector";

export function drawCircle(ctx: CanvasRenderingContext2D, pos: Vector, radius: number, color: string): void {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.ellipse(pos.x, pos.y, radius, radius, 0, 0, Math.PI * 2);
    ctx.fill();
}