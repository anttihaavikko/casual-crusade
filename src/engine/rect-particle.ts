import { Particle } from "./particle";
import { Vector } from "./vector";

export class RectParticle extends Particle {
    constructor(x: number, y: number, width: number, height: number, life: number, velocity: Vector, private color = "#fff") {
        super(x, y, width, height, life, velocity);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x - this.size.x * 0.5, this.position.y - this.size.y * 0.5, this.size.x, this.size.y);
    }
}