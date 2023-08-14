import { Draggable } from "./engine/draggable";
import { drawCircle } from "./engine/drawing";
import { Mouse } from "./engine/mouse";
import { Pulse } from "./engine/pulse";
import { Tween } from "./engine/tween";
import { Vector, distance } from "./engine/vector";
import { Hand } from "./hand";
import { TextEntity } from "./text";
import { Tile } from "./tile";

export const TILE_WIDTH = 80;
export const TILE_HEIGHT = 60;

const BORDER = 7;
const GAP = 2;

const gemColors = [
    "#fff",
    "blue",
    "purple",
    "red",
    "yellow",
    "orange",
    "green"
];

export enum Direction {
    Up,
    Right,
    Down,
    Left
}

export enum Gem {
    None,
    Blue,
    Purple,
    Red,
    Yellow,
    Orange,
    Green
};

export class Card extends Draggable {
    private tile: Tile;
    private tween: Tween;
    private gem: Gem;

    public constructor(x: number, y: number, private board: Tile[], private hand: Hand, private directions?: Direction[]) {
        super(x, y, TILE_WIDTH, TILE_HEIGHT);
        this.tween = new Tween(this);
        if(!this.directions) {
            const count = 1 + Math.floor(Math.random() * 4);
            this.directions = [Direction.Up, Direction.Right, Direction.Down, Direction.Left].sort(() =>  Math.random() - 0.5).slice(0, count);
        }
        if(Math.random() < 0.2) {
            this.gem = 1 + Math.floor(Math.random() * 6);
        }
    }

    public isLocked(): boolean {
        return this.locked;
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.tween.update(tick);
        const sorted = [...this.board]
            .filter(tile => !tile.content && tile.accepts(this, this.board) && distance(this.position, tile.getPosition()) < 100)
            .sort((a, b) => distance(this.position, a.getPosition()) - distance(this.position, b.getPosition()));
        this.tile = sorted.length > 0 ? sorted[0]: null;
    }

    public move(to: Vector, duration: number): void {
        this.tween.move(to, duration);
    }

    protected pick(): void {
        const available = this.board.filter(tile => !tile.content && tile.accepts(this, this.board));
        available.forEach(tile => tile.marked = true);
    }

    protected drop(): void {
        this.board.forEach(tile => tile.marked = false);
        this.board.filter(tile => tile.content === this).forEach(tile => tile.content = null);

        if(this.tile) {
            this.locked = true;
            this.position = this.tile.getPosition();
            this.tile.content = this;
            this.hand.add();
            this.hand.findPath(this.tile);
            return;
        }

        this.move(this.getStartPosition(), 0.1);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(this.dragging && this.tile) {
            ctx.strokeStyle = "#ddd";
            ctx.lineWidth = 7;
            const tilePos = this.tile.getPosition();
            ctx.strokeRect(
                tilePos.x + BORDER + GAP, 
                tilePos.y + BORDER + GAP,
                this.size.x - BORDER * 2 - GAP * 2,
                this.size.y - BORDER * 2 - GAP * 2
            );
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(this.position.x + GAP, this.position.y + GAP, this.size.x - GAP * 2, this.size.y - GAP * 2);
        ctx.fillStyle = this.hovered ? "#ff9999" : "#fff";
        ctx.fillRect(this.position.x + BORDER + GAP, this.position.y + BORDER + GAP, this.size.x - BORDER * 2 - GAP * 2, this.size.y - BORDER * 2 - GAP * 2);

        if(this.directions.includes(Direction.Up)) {
            this.lineTo(ctx, this.position.x + this.size.x * 0.5, this.position.y + BORDER + GAP);
        }
        if(this.directions.includes(Direction.Right)) {
            this.lineTo(ctx, this.position.x + this.size.x - BORDER - GAP, this.position.y + this.size.y * 0.5);
        }
        if(this.directions.includes(Direction.Down)) {
            this.lineTo(ctx, this.position.x + this.size.x * 0.5, this.position.y + this.size.y - BORDER - GAP);
        }
        if(this.directions.includes(Direction.Left)) {
            this.lineTo(ctx, this.position.x + BORDER + GAP, this.position.y + this.size.y * 0.5);
        }

        const p = {
            x: this.position.x + this.size.x * 0.5,
            y: this.position.y + this.size.y * 0.5
        };
        drawCircle(ctx, p, 8, "#000");

        if(this.gem) {
            drawCircle(ctx, p, 12, "#000");
            drawCircle(ctx, p, 6, gemColors[this.gem]);
        }
    }

    public lock(): void {
        this.depth = -50;
        this.locked = true;
    }

    public has(dir: Direction): boolean {
        return this.directions && this.directions.includes(dir);
    }

    public getConnections(): Tile[] {
        const index = this.board.find(tile => tile.content === this).index;
        return this.directions.map(d => {
            if(d == Direction.Up) return this.board.find(tile => tile.index.x === index.x && tile.index.y === index.y - 1 && tile.content && tile.content.has(Direction.Down));
            if(d == Direction.Down) return this.board.find(tile => tile.index.x === index.x && tile.index.y === index.y + 1 && tile.content && tile.content.has(Direction.Up));
            if(d == Direction.Left) return this.board.find(tile => tile.index.x === index.x - 1 && tile.index.y === index.y && tile.content && tile.content.has(Direction.Right));
            if(d == Direction.Right) return this.board.find(tile => tile.index.x === index.x + 1 && tile.index.y === index.y && tile.content && tile.content.has(Direction.Left));
        }).filter(tile => tile && tile.content);
    }

    public pop(amt: number): void {
        setTimeout(() => {
            this.hand.camera.shake(3, 0.08);
            this.hand.score += amt;
            const p = {
                x: this.position.x + this.size.x * 0.5,
                y: this.position.y + this.size.y * 0.5 + 5
            };
            this.hand.effects.add(new Pulse(p.x, p.y - 10, 40 + Math.random() * 40));
            this.hand.effects.add(new TextEntity(
                amt.toString(),
                40 + Math.random() * 10,
                p.x,
                p.y,
                0.5 + Math.random(),
                { x: 0, y: -1 - Math.random() },
                { shadow: 4, align: "center", scales: true }
            ));
        }, 0.2);
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