import { Card, CardData, Direction, Gem, TILE_HEIGHT, TILE_WIDTH, randomCard } from "./card";
import { Dude } from "./dude";
import { AudioManager } from "./engine/audio";
import { ButtonEntity } from "./engine/button";
import { Camera } from "./engine/camera";
import { Container } from "./engine/container";
import { Entity, sortByDepth } from "./engine/entity";
import { LineParticle } from "./engine/line";
import { Mouse } from "./engine/mouse";
import { Pulse } from "./engine/pulse";
import { RectParticle } from "./engine/rect";
import { Vector, ZERO, offset } from "./engine/vector";
import { HEIGHT, WIDTH } from "./index";
import { Level } from "./level";
import { Picker } from "./picker";
import { Pile } from "./pile";
import { RelicIcon } from "./relic";
import { TextEntity } from "./text";
import { Tile } from "./tile";
import { Tooltip } from "./tooltip";

export class Game extends Entity {
    public score = 0;
    public multi = 1;
    public handSize = 3;
    public life = 5;
    public maxLife: number;
    public picker: Picker;
    public pile: Pile;
    public started: boolean;
    public rewardOptions = 3;
    public rewardPicks = 1;
    public relics: string[] = [];
    public canRemoteOpen: boolean;
    public healOnStep: boolean;
    public stepScore = 1;
    public remoteMulti: boolean;
    public gemChance = 1;

    public tooltip = new Tooltip(WIDTH * 0.5, HEIGHT * 0.5, 500, 90);

    private again: ButtonEntity;
    private gameOver = new TextEntity("GAME OVER", 100, WIDTH * 0.5, 280, -1, ZERO, { shadow: 10, align: "center" });

    private cards: Card[] = [];
    private all: CardData[];
    private deck: CardData[] = [];

    private icons: RelicIcon[] = [];

    constructor(private dude: Dude, public effects: Container, public camera: Camera, private level: Level, public audio: AudioManager) {
        super(360, 500, 0, 0);
        this.pile = new Pile(this.p.x - 2 * TILE_WIDTH - 30, this.p.y);
        this.picker = new Picker(this.level, this);
        this.again = new ButtonEntity("TRY AGAIN?", WIDTH * 0.5, HEIGHT * 0.5 + 60, 300, 75, () => this.restart(), audio);
        this.again.visible = false;
        this.init();
    }

    public pick(card: Card): void {
        if(this.picker.rewards <= 0) return;
        this.add(card.data, true, true);
        this.picker.remove(card);
        this.fill();
    }

    public boost(amount: number): void {
        this.maxLife += amount;
        this.life += amount;
    }

    public addRelic(relic: RelicIcon): void {
        if(this.picker.rewards <= 0) return;
        const pos = this.icons.length;
        this.picker.remove(relic);
        this.relics.push(relic.data.name);
        this.icons.push(relic);
        
        setTimeout(() => {
            relic.icon = true;
            relic.scl = 0.8;
            relic.setPosition(pos * 30 - 15, 30);
        }, 200);
    }

    public heal(amount: number): void {
        this.life = Math.min(this.maxLife, this.life + amount);
        this.audio.heal();

        for(var i = 0; i < 50; i++) {
            const p = this.dude.getCenter();
            const x = p.x + Math.random() * 40 - 20;
            const y = p.y + Math.random() * 40 - 30;
            this.effects.add(new RectParticle(x, y, 2, 5, 0.1 + Math.random() * 0.6, { x: 0, y: -0.25 - Math.random() * 1.5 }, "#B4D000"));
        }
    }

    public nextLevel(): void {
        this.tooltip.visible = false;

        const hits = this.level.board.filter(tile => !tile.content && !tile.reward);
            const delay = 200;

            [...hits].sort(() => Math.random() < 0.5 ? 1 : -1).forEach((hit, i) => {
                const p = hit.getCenter();
                setTimeout(() => {
                    this.audio.explode();
                    this.camera.shake(15, 0.15);
                    this.effects.add(new Pulse(p.x, p.y, 40 + Math.random() * 40, 0.5, 80));
                    this.addBits(p);
                    const sky:Vector = { x: WIDTH * 0.5, y: -100 };
                    this.effects.add(new LineParticle(sky, p, 0.4, 10, "#ffffcc99", 10 + Math.random() * 20));
                    this.life--;
                    hit.hidden = true;
                    this.audio.boom();
                }, 100 + i * delay);
            })

            if(this.life - hits.length <= 0) {
                setTimeout(() => {
                    this.again.visible = true;
                    this.camera.shake(5, 0.3);
                    this.audio.lose();
                }, hits.length * delay + 800);
                return;
            }
            
            setTimeout(() => {
                this.level.next();
                this.cards = [];
                this.dude.reset(this.level.board[2]);
                this.shuffle();
                this.fill();
                this.audio.win();

                const sortedX = [...this.level.board].filter(t => !t.reward).map(t => t.index.x).sort((a, b) => a - b);
                const sortedY = [...this.level.board].filter(t => !t.reward).map(t => t.index.y).sort((a, b) => a - b);
                const x = -(sortedX[0] - 1 + sortedX[sortedX.length - 1] - 1) * 0.5 * TILE_WIDTH;
                const y = -(sortedY[0] - 1 + sortedY[sortedY.length - 1] - 1) * 0.5 * TILE_HEIGHT;
                this.level.board.forEach(t => {
                    this.moveEntity(t, x, y);
                    this.moveEntity(t.content, x, y);
                });
                const p = this.level.board[2].getPosition();
                this.dude.setPosition(p.x, p.y);
            }, hits.length * delay + 600);
    }

    public checkLevelEnd(): void {
        if(this.picker.rewards > 0) {
            setTimeout(() => this.checkLevelEnd(), 500);
            return;
        }
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
        this.dude.findPath(to, game, this.level);
    }

    public createBlank(tile: Tile): void {
        const p = tile.getPosition();
        const card = new Card(p.x, p.y, this.level, this, { directions: [], gem: Gem.None });
        card.lock();
        tile.content = card;
        this.cards.push(card);
        if(this.canRemoteOpen) {
            this.loot(tile);
        }
    }

    public add(card: CardData, shuffles = true, permanent = false): void {
        if(permanent) this.all.push(card);
        this.deck.push(card);
        if(shuffles) this.deck = [...this.deck].sort(() => Math.random() < 0.5 ? 1 : -1);
        this.reposition();
    }

    public pull(): void {
        if(this.deck.length <= 0) return;
        this.audio.swoosh();
        const card = this.deck.pop();
        const p = this.pile.getPosition();
        this.cards.push(new Card(p.x, p.y - 20, this.level, this, card));
        this.reposition();
    }

    public update(tick: number, mouse: Mouse): void {
        this.dude.update(tick, mouse);
        if(!this.started) return;
        this.cards.forEach(c => c.update(tick, mouse));
        this.pile.update(tick, mouse);
        this.level.board.forEach(tile => tile.update(tick, mouse));
        this.picker.update(tick, mouse);
        this.again.update(tick, mouse);
        this.icons.forEach(i => i.update(tick, mouse));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(!this.started) {
            this.dude.draw(ctx);
            return;
        }
        [...this.cards, this.dude, this.pile].sort(sortByDepth).forEach(c => c.draw(ctx));
        this.picker.draw(ctx);
        this.tooltip.draw(ctx);
        this.again.draw(ctx);
        this.icons.forEach(i => i.draw(ctx));
        if(this.again.visible) this.gameOver.draw(ctx);
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

    public addBits(p: Vector): void {
        for(let i = 0; i < 20; i++) {
            const size = 1 + Math.random() * 3;
            const opts = { force: { x: 0, y: 0.1 }, depth: 20 };
            this.effects.add(new RectParticle(p.x, p.y, size, size, 0.2 + Math.random() * 0.5, { x: -3 + Math.random() * 6, y: -7 * Math.random() }, opts));
        }
    }

    public loot(tile: Tile): void {
        const chests = tile.getChests(this.level.board).filter(n => n.reward && !n.looted);
        if(chests.length > 0) {
            setTimeout(() => {
                this.audio.frog();
                this.audio.open();
                chests.forEach(c => {
                    c.loot();
                    this.addBits(offset(c.getCenter(), 0, -5));
                    this.camera.shake(10, 0.3);
                    const p = offset(c.getCenter(), 0, -15);
                    const duration = 0.5;
                    const sky:Vector = { x: p.x, y: p.y - 20 };
                    this.effects.add(new LineParticle(p, offset(sky, 0, -10), duration, 10, "#ffffff55"));
                    this.effects.add(new LineParticle(offset(p, -5, 0), offset(sky, -10, 0), duration, 7, "#ffffff55"));
                    this.effects.add(new LineParticle(offset(p, 5, 0), offset(sky, 10, 0), duration, 7, "#ffffff55"));
                });
            }, 150);
            setTimeout(() => {
                this.audio.chest();
                this.picker.rewards += chests.length * this.rewardPicks;
                this.picker.create();
            }, 600);
        }
    }

    private reposition(): void {
        const handCards = this.cards.filter(c => !c.isLocked());
        this.pile.count = this.deck.length;
        handCards.forEach((c, i) => {
            const p: Vector = {
                x: this.p.x + (i - handCards.length * 0.5 + 0.5) * TILE_WIDTH,
                y: this.p.y
            };
            c.move(p, 0.15);
        });
        this.pile.move({
            x: this.p.x - (handCards.length * 0.5 + 1) * TILE_WIDTH,
            y: this.p.y
        }, 0.15);
    }

    private moveEntity(e: Entity, x: number, y: number): void {
        if(!e) return;
        const p = e.getPosition();
        e.setPosition(p.x + x, p.y + y);
    }

    private restart(): void {
        this.cards = [];
        this.score = 0;
        this.again.visible = false;
        this.level.restart();
        this.init();
        this.dude.reset(this.level.board[2]);
        this.icons = [];
        this.relics = [];
        this.canRemoteOpen = false;
        this.healOnStep = false;
        this.stepScore = 1;
        this.remoteMulti = false;
        this.gemChance = 1;
    }

    private init(): void {
        this.life = this.maxLife = 5;
        this.handSize = 3;
        this.rewardOptions = 3;
        this.rewardPicks = 1;
        this.all = [
            { directions: [Direction.Up, Direction.Down], gem: Gem.None },
            { directions: [Direction.Up, Direction.Down], gem: Gem.None },
            { directions: [Direction.Left, Direction.Right], gem: Gem.None },
            { directions: [Direction.Left, Direction.Right], gem: Gem.None },
            randomCard(1, true)
        ];
        this.shuffle();
        this.fill();
    }
}