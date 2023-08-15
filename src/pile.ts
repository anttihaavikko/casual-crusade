import { CARD_BORDER, CARD_GAP, TILE_HEIGHT, TILE_WIDTH } from "./card";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Tween } from "./engine/tween";
import { Vector } from "./engine/vector";

export class Pile extends Entity {
    public count = 1;

    private tween: Tween;
    
    constructor(x: number, y: number) {
        super(0, 0, 0, 0);
        super(x, y, TILE_WIDTH, TILE_HEIGHT);
        this.tween = new Tween(this);
        this.depth = -5;
    }

    public update(tick: number, mouse: Mouse): void {
        this.tween.update(tick);
    }

    public move(to: Vector, duration: number): void {
        this.tween.move(to, duration);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(this.count <= 0) return;

        ctx.fillStyle = "#000";
        ctx.fillRect(this.position.x + CARD_GAP, this.position.y + CARD_GAP, this.size.x - CARD_GAP * 2, this.size.y - CARD_GAP * 2);
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.position.x + CARD_BORDER + CARD_GAP, this.position.y + CARD_BORDER + CARD_GAP, this.size.x - CARD_BORDER * 2 - CARD_GAP * 2, this.size.y - CARD_BORDER * 2 - CARD_GAP * 2);

        ctx.font =`30px arial black`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText(this.count.toString(), this.position.x + this.size.x * 0.5, this.position.y + this.size.y * 0.5 + 10);
    }
}