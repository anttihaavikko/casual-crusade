import { drawCircle } from "./drawing";
import { Particle } from "./particle";
import { ZERO } from "./vector";

export class Pulse extends Particle {
    constructor(x: number, y: number, private radius: number, duration = 1, private ringWidth = 0, private alpha = 40) {
        super(x, y, radius, radius, (0.3 + Math.random() * 0.1) * duration, ZERO);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const mod = Math.max(0, Math.min(1 - this.ratio, 1));
        const alpha = Math.round(mod * this.alpha).toString(16).padStart(2, '0');
        const color = "#ffffff" + alpha;
        drawCircle(ctx, this.p, mod * this.radius, this.ringWidth > 0 ? "#ffffff00" : color);
        if(this.ringWidth > 0) {
            ctx.strokeStyle = color;
            ctx.lineWidth = this.ringWidth;
            ctx.stroke();
        }
    }
}