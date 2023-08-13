import { Card, TILE_WIDTH } from "./card";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Tile } from "./tile";

export class Hand extends Entity {
    private cards: Card[] = [];

    constructor(private board: Tile[]) {
        super(360, 500, 0, 0);
        this.add();
        this.add();
        this.add();
    }

    public add(): void {
        this.cards.push(new Card(this.position.x + TILE_WIDTH * this.cards.filter(c => !c.isLocked()).length, this.position.y, this.board, this));
        this.reposition();
    }

    public update(tick: number, mouse: Mouse): void {
        this.cards.forEach(c => c.update(tick, mouse));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.cards.sort((a, b) => a.depth - b.depth).forEach(c => c.draw(ctx));
    }

    private reposition(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        handCards.forEach((c, i) => c.setPosition(this.position.x + (i - handCards.length * 0.5 + 0.5) * TILE_WIDTH, this.position.y));
    }
}