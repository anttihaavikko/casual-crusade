import { Card, CardData, Direction, Gem, TILE_HEIGHT, TILE_WIDTH, randomCard } from "./card";
import { Dude } from "./dude";
import { AudioManager } from "./engine/audio";
import { Camera } from "./engine/camera";
import { Container } from "./engine/container";
import { Entity, sortByDepth } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Pulse } from "./engine/pulse";
import { Vector } from "./engine/vector";
import { Level } from "./level";
import { Picker } from "./picker";
import { Pile } from "./pile";
import { Tile } from "./tile";

export class Game extends Entity {
    public score = 0;
    public multi = 1;
    public handSize = 3;
    public life = 5;
    public maxLife: number;
    public picker: Picker;
    public pile: Pile;

    private cards: Card[] = [];
    private all: CardData[] = [
        { directions: [Direction.Up, Direction.Down], gem: Gem.None },
        { directions: [Direction.Up, Direction.Down], gem: Gem.None },
        { directions: [Direction.Left, Direction.Right], gem: Gem.None },
        { directions: [Direction.Left, Direction.Right], gem: Gem.None },
        randomCard(true)
    ];
    private deck: CardData[] = [];

    constructor(private dude: Dude, public effects: Container, public camera: Camera, private level: Level, public audio: AudioManager) {
        super(360, 500, 0, 0);
        this.pile = new Pile(this.position.x - 2 * TILE_WIDTH - 30, this.position.y);
        this.maxLife = this.life;
        this.shuffle();
        this.fill();
        this.picker = new Picker(this.level, this);
    }

    public pick(card: Card): void {
        if(this.picker.rewards <= 0) return;
        this.add(card.data, true, true);
        this.picker.remove(card);
    }

    public heal(amount: number): void {
        this.life = Math.min(this.maxLife, this.life + amount);
    }

    public nextLevel(): void {
        const hits = this.level.board.filter(tile => !tile.content);
            const delay = 200;

            hits.forEach((hit, i) => {
                const p = hit.getPosition();
                setTimeout(() => {
                    this.audio.explode();
                    this.camera.shake(15, 0.15);
                    this.effects.add(new Pulse(p.x + TILE_WIDTH * 0.5, p.y + TILE_HEIGHT * 0.5, 40 + Math.random() * 40));
                    this.life--;
                }, 100 + i * delay);
            })

            if(this.life - hits.length <= 0) return;
            
            setTimeout(() => {
                this.level.next();
                this.cards = [];
                this.dude.reset(this.level.board[2]);
                this.shuffle();
                this.fill();
                this.audio.win();

                const sorted = [...this.level.board].map(t => t.index.y).sort((a, b) => a - b);
                const first = sorted[0] - 1;
                const last = sorted[sorted.length - 1] - 1;
                const amt = -(first + last) * 0.5 * TILE_HEIGHT;
                this.level.board.forEach(t => {
                    this.moveUp(t, amt);
                    this.moveUp(t.content, amt);
                });
                const p = this.level.board[2].getPosition();
                this.dude.setPosition(p.x, p.y);
            }, hits.length * delay + 600);
    }

    public checkLevelEnd(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        if(handCards.length == 0 || this.level.isFull() || !handCards.some(c => c.getPossibleSpots().length > 0))  {
            this.nextLevel();
        }
    }

    public shuffle(): void {
        this.deck = [...this.all].sort(() => Math.random() < 0.5 ? 1 : -1);
    }

    public fill(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        for(var i = 0; i < this.handSize - handCards.length; i++) {
            setTimeout(() => {
                this.pull();
                this.reposition();
            }, 50 * i)
        }
        this.reposition();
    }

    public findPath(to: Tile, game: Game): void {
        this.dude.findPath(to, game);
    }

    public createBlank(tile: Tile): void {
        const p = tile.getPosition();
        const card = new Card(p.x, p.y, this.level, this, { directions: [], gem: Gem.None });
        card.lock();
        tile.content = card;
        this.cards.push(card);
    }

    public add(card: CardData, shuffles = true, permanent = false): void {
        if(permanent) this.all.push(card);
        this.deck.push(card);
        if(shuffles) this.deck = [...this.deck].sort(() => Math.random() < 0.5 ? 1 : -1);
        this.reposition();
    }

    public pull(): void {
        if(this.deck.length <= 0) return;
        const card = this.deck.pop();
        const p = this.pile.getPosition();
        this.cards.push(new Card(p.x, p.y - 20, this.level, this, card));
        this.reposition();
    }

    public update(tick: number, mouse: Mouse): void {
        this.dude.update(tick, mouse);
        this.cards.forEach(c => c.update(tick, mouse));
        this.pile.update(tick, mouse);
        this.level.board.forEach(tile => tile.update(tick, mouse));
        this.picker.update(tick, mouse);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        [...this.cards, this.dude, this.pile].sort(sortByDepth).forEach(c => c.draw(ctx));
        this.picker.draw(ctx);
    }

    public discard(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        const card = handCards[Math.floor(Math.random() * handCards.length)];
        card.move(this.pile.getPosition(), 0.3);
        setTimeout(() => {
            this.cards = this.cards.filter(c => c != card);
            this.add(card.data, true, false);
            this.fill();
        }, 300);
    }

    private reposition(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        this.pile.count = this.deck.length;
        handCards.forEach((c, i) => {
            const p: Vector = {
                x: this.position.x + (i - handCards.length * 0.5 + 0.5) * TILE_WIDTH,
                y: this.position.y
            };
            c.move(p, 0.15);
        });
        this.pile.move({
            x: this.position.x - (handCards.length * 0.5 + 1) * TILE_WIDTH,
            y: this.position.y
        }, 0.15);
    }

    private moveUp(e: Entity, amount: number): void {
        if(!e) return;
        const p = e.getPosition();
        e.setPosition(p.x, p.y + amount);
    }
}