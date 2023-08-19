import { HEIGHT, WIDTH } from "../index";
import { Entity } from "./entity";

export class Blinders extends Entity {
    constructor() {
        super(0, 0, 0, 0);
        this.d = 500;
        this.open();
    }

    public open(after = () => {}): void {
        this.tween.scale({ x: 0, y: 0}, 0.5);
        setTimeout(after, 500);
    }

    public close(after = () => {}): void {
        this.tween.scale({ x: 1, y: 1}, 0.4);
        setTimeout(after, 500);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH * this.scale.x, HEIGHT);
        ctx.fillRect(WIDTH - WIDTH * this.scale.x, 0, WIDTH * this.scale.x, HEIGHT);
    }
}