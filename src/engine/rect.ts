import { Mouse } from "./mouse";
import { Particle } from "./particle";
import { Vector } from "./vector";

export class RectParticle extends Particle {
    constructor(x: number, y: number, width: number, height: number, life: number, velocity: Vector, private options?) {
        super(x, y, width, height, life, velocity);
        if(this.options?.depth) {
            this.d = this.options.depth;
        }
    }

    public update(tick: number, mouse: Mouse): void {
        if(this.options?.force) {
            this.velocity = {
                x: this.velocity.x + this.options.force.x,
                y: this.velocity.y + this.options.force.y
            }
        }
        super.update(tick, mouse);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.options?.color ?? "#fff";
        ctx.fillRect(this.p.x - this.s.x * 0.5, this.p.y - this.s.y * 0.5, this.s.x, this.s.y);
    }
}

export interface ParticleOptions {
    color?: string;
    force?: Vector;
    depth?: number;
};