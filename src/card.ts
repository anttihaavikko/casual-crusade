import { Draggable } from "./engine/draggable";
import { drawCircle } from "./engine/drawing";
import { Mouse } from "./engine/mouse";
import { Pulse } from "./engine/pulse";
import { Tween } from "./engine/tween";
import { Vector, distance, lerp, normalize, offset } from "./engine/vector";
import { Game } from "./game";
import { HEIGHT, WIDTH } from "./index";
import { Level } from "./level";
import { TextEntity } from "./text";
import { Tile } from "./tile";

export const TILE_WIDTH = 80;
export const TILE_HEIGHT = 60;

export const CARD_BORDER = 7;
export const CARD_GAP = 2;

export const gemColors = [
    "#fff",
    "#00BDE5",
    "#846AC1",
    "#E93988",
    "#F3DC00",
    "#F89F00",
    "#B4D000"
];

const gemNames = [
    null,
    "Blue",
    "Purple",
    "Red",
    "Yellow",
    "Orange",
    "Green"
];

const gemDescriptions = [
    null,
    "Draw extra card when placed.",
    "Recycle random card when stepping on.",
    "Heal one when placed.",
    "Score earned for stepping on is tenfold.",
    "Double your score multiplier.",
    "Fill neighbours with blank cards."
];

export enum Direction {
    Up,
    Right,
    Down,
    Left
};

export enum Gem {
    None,
    Blue,
    Purple,
    Red,
    Yellow,
    Orange,
    Green
};

export interface CardData {
    directions: Direction[];
    gem: Gem;
}

export function randomCard(canHaveGem = true, dirs?: Direction[]): CardData {
    const count = Math.random() < 0.1 ? 4 : (1 + Math.floor(Math.random() * 3));
    const directions = dirs ?? [Direction.Up, Direction.Right, Direction.Down, Direction.Left].sort(() =>  Math.random() - 0.5).slice(0, count);
    const gemChance = directions.length == 1 ? 0.6 : 0.2;
    return {
        directions,
        gem: canHaveGem && Math.random() < gemChance ? 1 + Math.floor(Math.random() * 6): Gem.None
    }
}

export class Card extends Draggable {
    public visited: boolean;

    private tile: Tile;
    private tween: Tween;

    public constructor(x: number, y: number, private level: Level, private game: Game, public data: CardData) {
        super(x, y, TILE_WIDTH, TILE_HEIGHT);
        this.tween = new Tween(this);
    }

    public isLocked(): boolean {
        return this.locked;
    }

    public makeSelectable(): void {
        this.lock();
        this.selectable = true;
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.tween.update(tick);
        const sorted = [...this.level.board]
            .filter(tile => !tile.content && tile.accepts(this, this.level.board) && distance(this.position, tile.getPosition()) < 100)
            .sort((a, b) => distance(this.position, a.getPosition()) - distance(this.position, b.getPosition()));

        const prev = this.tile;
        this.tile = sorted.length > 0 ? sorted[0]: null;
        if(this.tile && this.dragging) this.tile.hilite = true;
        if(prev && prev != this.tile) prev.hilite = false;
    }

    public move(to: Vector, duration: number): void {
        this.tween.move(to, duration);
    }

    public getMoveTarget(): Vector {
        return this.game.pile.getPosition();
    }
    
    public getPossibleSpots(): Tile[] {
        return this.level.board.filter(tile => !tile.content && tile.accepts(this, this.level.board))
    }

    protected click(): void {
        this.game.audio.pop();
        this.game.audio.swoosh();
        this.game.pick(this);
        this.game.tooltip.visible = false;
    }

    protected pick(): void {
        this.game.audio.click();
        this.getPossibleSpots().forEach(tile => tile.marked = true);
    }

    protected drop(): void {
        this.game.audio.pong();
        this.level.board.forEach(tile => tile.marked = false);
        this.level.board.filter(tile => tile.content === this).forEach(tile => tile.content = null);

        if(this.game.picker.rewards > 0) {
            this.move(this.getStartPosition(), 0.1);
            return;
        }

        if(this.tile) {
            this.game.multi = 1;
            this.locked = true;
            this.position = this.tile.getPosition();
            this.tile.content = this;
            this.game.fill();
            this.game.findPath(this.tile, this.game);
            if(this.data.gem == Gem.Blue) {
                this.game.audio.discard();
                this.game.pull();
            }
            if(this.data.gem == Gem.Red) {
                this.game.heal(1);
            }
            if(this.data.gem == Gem.Green) {
                const neighbours = this.tile.getFreeNeighbours(this.level.board, true).filter(n => !n.content);
                neighbours.forEach(n => this.game.createBlank(n));
            }
            return;
        }

        this.move(this.getStartPosition(), 0.1);
    }

    public exit(): void {
        if(this.data.gem) {
            this.game.tooltip.visible = false;
        }
    }

    public hover(): void {
        if(this.data.gem) {
            setTimeout(() => {
                this.game.tooltip.show(gemNames[this.data.gem], gemDescriptions[this.data.gem], offset(this.getCenter(), 0, -50 * this.scale), gemColors[this.data.gem]);
            }, 5);
        }
        this.game.audio.thud();
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const c = this.getCenter();
        ctx.translate(c.x, c.y);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-c.x, -c.y);
        if(this.hovered && this.selectable) {
            ctx.translate(0, -10);
        }
        if(this.dragging) {
            ctx.fillStyle = "#00000022";
            const center =  { x: WIDTH * 0.5, y: HEIGHT * 0.5 };
            const p = {
                x: this.position.x + CARD_GAP,
                y: this.position.y + CARD_GAP
            };
            const dir = normalize({ x: p.x - center.x, y: p.y - center.y });
            ctx.fillRect(p.x + dir.x * 12, p.y + dir.y * 24, this.size.x - CARD_GAP * 2, this.size.y - CARD_GAP * 2);
        }
        
        ctx.fillStyle = "#000";
        ctx.fillRect(this.position.x + CARD_GAP, this.position.y + CARD_GAP, this.size.x - CARD_GAP * 2, this.size.y - CARD_GAP * 2);
        ctx.fillStyle = this.hovered && (!this.locked || this.selectable) ? "#ffff66" : "#ddd";
        if(this.visited) ctx.fillStyle = "#ffffcc";
        ctx.fillRect(this.position.x + CARD_BORDER + CARD_GAP, this.position.y + CARD_BORDER + CARD_GAP, this.size.x - CARD_BORDER * 2 - CARD_GAP * 2, this.size.y - CARD_BORDER * 2 - CARD_GAP * 2);

        if(this.data.directions.includes(Direction.Up)) {
            this.lineTo(ctx, this.position.x + this.size.x * 0.5, this.position.y + CARD_BORDER + CARD_GAP);
        }
        if(this.data.directions.includes(Direction.Right)) {
            this.lineTo(ctx, this.position.x + this.size.x - CARD_BORDER - CARD_GAP, this.position.y + this.size.y * 0.5);
        }
        if(this.data.directions.includes(Direction.Down)) {
            this.lineTo(ctx, this.position.x + this.size.x * 0.5, this.position.y + this.size.y - CARD_BORDER - CARD_GAP);
        }
        if(this.data.directions.includes(Direction.Left)) {
            this.lineTo(ctx, this.position.x + CARD_BORDER + CARD_GAP, this.position.y + this.size.y * 0.5);
        }

        const p = {
            x: this.position.x + this.size.x * 0.5,
            y: this.position.y + this.size.y * 0.5
        };

        if(this.data.directions.length > 0) {
            drawCircle(ctx, p, 8, "#000");
        }

        if(this.data.gem) {
            drawCircle(ctx, p, 12, "#000");
            drawCircle(ctx, p, 6, gemColors[this.data.gem]);
        }

        ctx.restore();
    }

    public lock(): void {
        this.depth = -50;
        this.locked = true;
    }

    public has(dir: Direction): boolean {
        return this.data.directions && this.data.directions.includes(dir);
    }

    public getConnections(): Tile[] {
        const index = this.level.board.find(tile => tile.content === this).index;
        return this.data.directions.map(d => {
            if(d == Direction.Up) return this.level.board.find(tile => tile.index.x === index.x && tile.index.y === index.y - 1 && tile.content && tile.content.has(Direction.Down));
            if(d == Direction.Down) return this.level.board.find(tile => tile.index.x === index.x && tile.index.y === index.y + 1 && tile.content && tile.content.has(Direction.Up));
            if(d == Direction.Left) return this.level.board.find(tile => tile.index.x === index.x - 1 && tile.index.y === index.y && tile.content && tile.content.has(Direction.Right));
            if(d == Direction.Right) return this.level.board.find(tile => tile.index.x === index.x + 1 && tile.index.y === index.y && tile.content && tile.content.has(Direction.Left));
        }).filter(tile => tile && tile.content);
    }

    public activate(): void {
        if(this.data.gem == Gem.Purple) {
            this.game.audio.discard();
            this.game.discard();
        }
        if(this.data.gem == Gem.Orange) {
            this.game.audio.multi();
            this.game.multi *= 2;
            this.popText(`x${this.game.multi}`, {
                x: this.position.x + this.size.x * 0.5,
                y: this.position.y + this.size.y * 0.5 - 50
            }, gemColors[Gem.Orange]);
        }
        if(this.data.gem == Gem.Yellow) {
            this.game.audio.score();
        }
    }

    public pop(amt: number): void {
        setTimeout(() => {
            this.activate();
            this.game.camera.shake(3, 0.08);
            this.addScore(amt);
        }, 0.2);
    }

    private addScore(amt: number, ): void {
        const isYellow = this.data.gem == Gem.Yellow;
        const mod = isYellow ? 10 : 1;
        const addition = amt * mod * this.game.multi * this.level.level;
        this.game.score += addition;
        const p = {
            x: this.position.x + this.size.x * 0.5,
            y: this.position.y + this.size.y * 0.5 - 20
        };
        const c = this.getCenter();
        this.game.effects.add(new Pulse(c.x, c.y, 40 + Math.random() * 40));
        this.popText(addition.toString(), p, isYellow ? gemColors[Gem.Yellow] : "#fff");
    }

    private popText(content: string, p: Vector, color: string): void {
        this.game.effects.add(new TextEntity(
            content,
            40 + Math.random() * 10,
            p.x,
            p.y,
            0.5 + Math.random(),
            { x: 0, y: -1 - Math.random() },
            { shadow: 4, align: "center", scales: true, color }
        ));
    }

    private lineTo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 7;
        ctx.moveTo(this.position.x + this.size.x * 0.5, this.position.y + this.size.y * 0.5);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}