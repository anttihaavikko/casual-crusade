import { Card, TILE_WIDTH } from "./card";
import { Dude } from "./dude";
import { Camera } from "./engine/camera";
import { Container } from "./engine/container";
import { Entity, sortByDepth } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector } from "./engine/vector";
import { Tile } from "./tile";

export class Hand extends Entity {
    public score = 0;
    public multi = 1;
    private cards: Card[] = [];

    constructor(private board: Tile[], private dude: Dude, public effects: Container, public camera: Camera) {
        super(360, 500, 0, 0);
        this.add();
        this.add();
        this.add();
    }

    public findPath(to: Tile): void {
        this.dude.findPath(to);
    }

    public add(): void {
        this.cards.push(new Card(this.position.x, this.position.y + 200, this.board, this, true));
        this.reposition();
    }

    public update(tick: number, mouse: Mouse): void {
        this.dude.update(tick, mouse);
        this.cards.forEach(c => c.update(tick, mouse));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        [...this.cards, this.dude].sort(sortByDepth).forEach(c => c.draw(ctx));
    }

    public discard(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
    }

    private reposition(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        handCards.forEach((c, i) => {
            const p: Vector = {
                x: this.position.x + (i - handCards.length * 0.5 + 0.5) * TILE_WIDTH,
                y: this.position.y
            };
            c.move(p, 0.15);
        });
    }
}