import { Card, TILE_WIDTH } from "./card";
import { Dude } from "./dude";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector } from "./engine/vector";
import { Tile } from "./tile";

export class Hand extends Entity {
    private cards: Card[] = [];

    constructor(private board: Tile[], private dude: Dude) {
        super(360, 500, 0, 0);
        this.add();
        this.add();
        this.add();
    }

    public findPath(to: Tile): void {
        this.dude.findPath(to, this.board);
    }

    public add(): void {
        this.cards.push(new Card(this.position.x, this.position.y + 200, this.board, this));
        this.reposition();
    }

    public update(tick: number, mouse: Mouse): void {
        this.cards.forEach(c => c.update(tick, mouse));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.cards.sort((a, b) => a.depth - b.depth).forEach(c => c.draw(ctx));
        this.dude.draw(ctx);
    }

    private reposition(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        handCards.forEach((c, i) => {
            const p: Vector = {
                x: this.position.x + (i - handCards.length * 0.5 + 0.5) * TILE_WIDTH,
                y: this.position.y
            };
            c.move(p, 0.15);
            // c.setPosition(p.x, p.y);
        });
    }
}