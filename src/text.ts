import { Particle } from "./engine/particle";
import { Vector } from "./engine/vector";

export class TextEntity extends Particle {
    constructor(public content: string, private fontSize: number, x: number, y: number, life: number, velocity: Vector, private options?: TextOptions) {
        super(x, y, 0, 0, life, velocity);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        // ctx.translate(this.fontSize, this.fontSize);
        ctx.rotate(this.options.angle ?? 0);
        // ctx.translate(-this.fontSize, -this.fontSize);
        const mod = this.options?.scales ? this.ratio : 1;
        ctx.font =`${this.fontSize * mod}px arial black`;
        ctx.textAlign = this.options?.align ?? "center";
        if(this.options?.shadow) {
            ctx.fillStyle = "#000";
            ctx.fillText(this.content, this.p.x + this.options.shadow, this.p.y + this.options.shadow);
        }
        ctx.fillStyle = this.options?.color ?? "#fff";
        ctx.fillText(this.content, this.p.x, this.p.y);
        ctx.restore();
    }
}

export interface TextOptions {
    color?: string;
    align?: CanvasTextAlign;
    shadow?: number;
    scales?: boolean;
    angle?: number;
}