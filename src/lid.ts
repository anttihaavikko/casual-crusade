import { Gem, gemColors } from "./card";
import { drawEllipse } from "./engine/drawing";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Tween } from "./engine/tween";
import { Vector, offset } from "./engine/vector";
import { WIDTH } from "./index";

export class Lid extends Entity {
    private tween: Tween;
    private angle = 0;
    private direction = 1;

    constructor(pos: Vector) {
        super(pos.x, pos.y, 0, 0);
        this.tween = new Tween(this);
        this.direction = Math.sign(pos.x - WIDTH * 0.5);
        this.d = 75;
    }

    public update(tick: number, mouse: Mouse): void {
        this.tween.update(tick);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const center = this.getCenter();
        ctx.fillStyle = "#000";
        ctx.save();
        ctx.translate(0, Math.sin(-this.tween.time * Math.PI) * 25);
        ctx.translate(center.x, center.y);
        ctx.rotate(this.angle * this.tween.time);
        ctx.translate(-center.x, -center.y);
        ctx.fillRect(center.x - 22, center.y - 28, 44, 20);
        ctx.fillStyle = gemColors[Gem.Yellow];
        ctx.fillRect(center.x - 17, center.y - 23, 34, 10);
        drawEllipse(ctx, offset(center, 0, -17), 3, 2, "#000");
        ctx.restore();
    }

    public open(): void {
        this.tween.move(offset(this.getCenter(), 15 * this.direction, -5), 0.2);
        this.angle = Math.PI * 0.25 * this.direction;
    }
}