import { Vector } from "./vector";

export const drawCircle = (ctx: CanvasRenderingContext2D, pos: Vector, radius: number, color: string): void => {
    drawEllipse(ctx, pos, radius, radius, color);
}

export const drawEllipse = (ctx: CanvasRenderingContext2D, pos: Vector, x: number, y: number, color: string): void => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.ellipse(pos.x, pos.y, x, y, 0, 0, Math.PI * 2);
    ctx.fill();
}

export const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void => {
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

export const drawColoredText = (ctx: CanvasRenderingContext2D, content: string, x: number, y: number, baseColor: string, colors: string[]): void => {
    const parts = content.split('|');
    let color = false;
    let pos = 0;
    let n = 0;
    parts.forEach(part => {
        ctx.fillStyle = color ? colors[n] : baseColor;
        if (color) n = (n + 1) % colors.length;
        ctx.fillText(part, x + pos, y);
        color = !color;
        pos += ctx.measureText(part).width;
    });
}