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

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}