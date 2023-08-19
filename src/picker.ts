import { Card, TILE_WIDTH, randomCard } from "./card";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Tween } from "./engine/tween";
import { Vector, ZERO } from "./engine/vector";
import { Game } from "./game";
import { HEIGHT, WIDTH } from "./index";
import { Level } from "./level";
import { RelicIcon, relics } from "./relic";
import { TextEntity } from "./text";

const PICK_OFFSET = 40;

export class Picker extends Entity {
    public rewards = 0;

    private picks: (Card | RelicIcon)[] = [];
    private title = new TextEntity("", 55, WIDTH * 0.5, HEIGHT * 0.5 - 20, -1, ZERO, { shadow: 10 });
    private locked: boolean;
    private ready: boolean;
    
    constructor(private level: Level, private game: Game) {
        super(WIDTH * 0.5, HEIGHT * 0.5, 0, 0);
        this.scale = { x: 1, y: 0 };
    }

    public update(tick: number, mouse: Mouse): void {
        this.tween.update(tick);
        if(this.rewards <= 0 || this.picks.length <= 0 || !this.ready) return;
        this.picks.forEach(card => card.update(tick, mouse));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(WIDTH * 0.5, HEIGHT * 0.5);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.translate(-WIDTH * 0.5, -HEIGHT * 0.5);
        ctx.fillStyle = "#000000bb";
        ctx.fillRect(0, HEIGHT * 0.2, WIDTH, HEIGHT * 0.6);
        this.picks.forEach(card => card.draw(ctx));
        this.title.draw(ctx);
        ctx.restore();
    }

    public remove(reward: Card | RelicIcon): void {
        if(this.locked || !reward) return;

        reward.move(reward.getMoveTarget(), 0.2);
        this.locked = true;
        
        setTimeout(() => {
            if(this.rewards == 1 || this.picks.length == 1) {
                this.tween.scale({ x: 1, y: 0}, 0.1);
                this.ready = false;
            }
            this.picks = this.picks.filter(c => c != reward);
            this.reposition();
            this.rewards = Math.min(this.rewards - 1, this.picks.length);
            this.locked = false;
            this.game.tooltip.visible = false;

            if(this.rewards > 0) {
                this.title.content = `PICK ${this.rewards} MORE!`;
            }
        }, 200);
    }

    public create(relicChance = 0.25): void {
        this.tween.scale({ x: 1, y: 1}, 0.3);
        setTimeout(() => this.ready = true, 300);

        const amount = this.game.rewardOptions;
        this.picks = [];

        this.title.content = "PICK YOUR REWARD!";

        if(this.rewards > 1) {
            this.title.content = "PICK YOUR REWARDS!";
        } 

        const relic = Math.random() < relicChance && (relicChance > 0.9 || this.level.level > 1);

        const relicOptions = [...relics].filter(r => r.repeatable || !this.game.relics.includes(r.name)).sort(() => Math.random() < 0.5 ? 1 : -1);

        for(var i = 0; i < amount; i++) {
            if(!relicOptions[i]) break;
            const reward = relic ?
                new RelicIcon(this.p.x + 6 - TILE_WIDTH * 1.3 * 0.5 * amount + TILE_WIDTH * 1.3 * i, this.p.y + PICK_OFFSET, this.game, relicOptions[i]) :
                new Card(this.p.x + 6 - TILE_WIDTH * 1.3 * 0.5 * amount + TILE_WIDTH * 1.3 * i, this.p.y + PICK_OFFSET, this.level, this.game, randomCard(this.game.gemChance));
            reward.scale = { x: 1.3, y: 1.3 };
            this.picks.push(reward);
        }

        this.reposition();

        this.picks.forEach(card => card.makeSelectable());
    }

    private reposition(): void {
        this.picks.forEach((card, i) => {
            const p: Vector = {
                x: this.p.x + 6 - TILE_WIDTH * 1.3 * 0.5 + (i - this.picks.length * 0.5 + 0.5) * TILE_WIDTH * 1.3,
                y: this.p.y + PICK_OFFSET
            };
            card.move(p, 0.15);
        });
    }
}