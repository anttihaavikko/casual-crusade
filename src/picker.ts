import { Card, TILE_WIDTH, randomCard } from "./card";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector, ZERO } from "./engine/vector";
import { Game } from "./game";
import { HEIGHT, WIDTH } from "./index";
import { Level } from "./level";
import { TextEntity } from "./text";

const PICK_OFFSET = 40;

export class Picker extends Entity {
    public rewards = 0;

    private picks: Card[] = [];
    private title = new TextEntity("PICK YOUR REWARD!", 55, WIDTH * 0.5, HEIGHT * 0.5 - 20, -1, ZERO, { shadow: 10 });
    private locked: boolean;
    
    constructor(private level: Level, private game: Game) {
        super(WIDTH * 0.5, HEIGHT * 0.5, 0, 0);
    }

    public update(tick: number, mouse: Mouse): void {
        if(this.rewards <= 0 || this.picks.length <= 0) return;
        this.picks.forEach(card => card.update(tick, mouse));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(this.rewards <= 0 || this.picks.length <= 0) return;
        ctx.fillStyle = "#000000bb";
        ctx.fillRect(0, HEIGHT * 0.2, WIDTH, HEIGHT * 0.6);
        this.picks.forEach(card => card.draw(ctx));
        this.title.draw(ctx);
    }

    public remove(card: Card): void {
        if(this.locked) return;

        card.move(this.game.pile.getPosition(), 0.2);
        this.locked = true;
        
        setTimeout(() => {
            this.picks = this.picks.filter(c => c != card);
            this.reposition();
            this.rewards = Math.min(this.rewards - 1, this.picks.length);
            this.locked = false;
        }, 200);
    }

    public create(): void {
        const amount = 3;
        this.picks = [];

        for(var i = 0; i < amount; i++) {
            const card = new Card(this.position.x - TILE_WIDTH * 1.3 * 0.5 * amount + TILE_WIDTH * 1.3 * i, this.position.y + PICK_OFFSET, this.level, this.game, randomCard());
            card.scale = 1.3;
            this.picks.push(card);
        }

        this.picks.forEach(card => card.makeSelectable());
    }

    private reposition(): void {
        this.picks.forEach((card, i) => {
            const p: Vector = {
                x: this.position.x - TILE_WIDTH * 1.3 * 0.5 + (i - this.picks.length * 0.5 + 0.5) * TILE_WIDTH * 1.3,
                y: this.position.y + PICK_OFFSET
            };
            card.move(p, 0.15);
        });
    }
}