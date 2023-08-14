import { Card, CardData, Direction, Gem, TILE_WIDTH, randomCard } from "./card";
import { Dude } from "./dude";
import { Camera } from "./engine/camera";
import { Container } from "./engine/container";
import { Entity, sortByDepth } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector } from "./engine/vector";
import { Level } from "./level";
import { Tile } from "./tile";

export class Game extends Entity {
    public score = 0;
    public multi = 1;
    public handSize = 3;

    private cards: Card[] = [];
    private all: CardData[] = [
        { directions: [Direction.Up, Direction.Down], gem: Gem.None },
        { directions: [Direction.Up, Direction.Down], gem: Gem.None },
        { directions: [Direction.Left, Direction.Right], gem: Gem.None },
        { directions: [Direction.Left, Direction.Right], gem: Gem.None }
    ];
    private deck: CardData[] = [];

    constructor(private dude: Dude, public effects: Container, public camera: Camera, private level: Level) {
        super(360, 500, 0, 0);
        this.shuffle();
        this.fill();
    }

    public nextLevel(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        if(handCards.length == 0 || this.level.isFull() || !handCards.some(c => c.getPossibleSpots().length > 0))  {
            this.level.next();
            this.cards = [];
            this.dude.reset(this.level.board[2]);
            this.shuffle();
            this.add(randomCard(), true, true);
            this.add(randomCard(), true, true);
            this.fill();
        }
    }

    public shuffle(): void {
        this.deck = [...this.all].sort(() => Math.random() < 0.5 ? 1 : -1);
    }

    public fill(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        for(var i = 0; i < this.handSize - handCards.length; i++) {
            this.pull();
        }
        this.reposition();
    }

    public findPath(to: Tile, game: Game): void {
        this.dude.findPath(to, game);
    }

    public add(card: CardData, shuffles = true, permanent = false): void {
        if(permanent) this.all.push(card);
        this.deck.push(card);
        if(shuffles) this.deck = [...this.deck].sort(() => Math.random() < 0.5 ? 1 : -1);
    }

    public pull(): void {
        if(this.deck.length <= 0) return;
        const card = this.deck.pop();
        this.cards.push(new Card(this.position.x, this.position.y + 200, this.level, this, card));
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
        const card = handCards[Math.floor(Math.random() * handCards.length)];
        this.cards = this.cards.filter(c => c != card);
        this.add(card.data, true, false);
        this.fill();
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