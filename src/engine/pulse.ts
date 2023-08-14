import { drawCircle } from "./drawing";
import { Particle } from "./particle";
import { ZERO } from "./vector";

export class Pulse extends Particle {
    constructor(x: number, y: number, private radius: number) {
        super(x, y, radius, radius, 0.2 + Math.random() * 0.1, ZERO);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const mod = Math.max(0, Math.min(1 - this.ratio, 1));
        const alpha = Math.round(mod * 40.1).toString(16).padStart(2, '0');
        drawCircle(ctx, this.position, mod * this.radius, "#ffffff" + alpha);
    }
}