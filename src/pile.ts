import { CARD_BORDER, CARD_GAP, TILE_HEIGHT, TILE_WIDTH, drawCorners } from "./card";
import { font } from "./engine/constants";
import { Entity } from "./engine/entity";
import { Vector } from "./engine/vector";

export class Pile extends Entity {
    public count = 1;
    
    constructor(x: number, y: number) {
        super(0, 0, 0, 0);
        super(x, y, TILE_WIDTH, TILE_HEIGHT);
        this.d = -5;
    }

    public move(to: Vector, duration: number): void {
        this.tween.move(to, duration);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(this.count <= 0) return;

        const height = (Math.min(6, this.count) - 1) * 10;

        ctx.fillStyle = "#000";
        ctx.fillRect(this.p.x + CARD_GAP, this.p.y + CARD_GAP, this.s.x - CARD_GAP * 2, this.s.y - CARD_GAP * 2);
        ctx.fillStyle = "#ccc";
        ctx.fillRect(this.p.x + CARD_BORDER + CARD_GAP, this.p.y + CARD_BORDER + CARD_GAP, this.s.x - CARD_BORDER * 2 - CARD_GAP * 2, this.s.y - CARD_BORDER * 2 - CARD_GAP * 2);

        ctx.fillStyle = "#000";
        ctx.fillRect(this.p.x + CARD_GAP, this.p.y + CARD_GAP - height, this.s.x - CARD_GAP * 2, this.s.y - CARD_GAP * 2);
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.p.x + CARD_BORDER + CARD_GAP, this.p.y + CARD_BORDER + CARD_GAP - height, this.s.x - CARD_BORDER * 2 - CARD_GAP * 2, this.s.y - CARD_BORDER * 2 - CARD_GAP * 2);

        ctx.strokeStyle = "#00000022";
        drawCorners(ctx, this.p.x, this.p.y - height);

        ctx.font =`27px ${font}`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText(this.count.toString(), this.p.x + this.s.x * 0.5, this.p.y + this.s.y * 0.5 + 10 - height);
    }
}