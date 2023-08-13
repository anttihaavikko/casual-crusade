import { Draggable } from "./engine/draggable";
import { Mouse } from "./engine/mouse";
import { Vector, distance } from "./engine/vector";
import { Hand } from "./hand";
import { Tile } from "./tile";

export const TILE_WIDTH = 80;
export const TILE_HEIGHT = 60;

const BORDER = 7;
const GAP = 2;


export enum Direction {
    Up,
    Right,
    Down,
    Left
}

export class Card extends Draggable {
    private tile: Tile;

    public constructor(x: number, y: number, private board: Tile[], private hand: Hand, private directions?: Direction[]) {
        super(x, y, TILE_WIDTH, TILE_HEIGHT);
        if(!this.directions) {
            const count = 1 + Math.floor(Math.random() * 4);
            this.directions = [Direction.Up, Direction.Right, Direction.Down, Direction.Left].sort(() =>  Math.random() - 0.5).slice(0, count);
        }
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        const sorted = [...this.board]
            .filter(tile => !tile.content && tile.accepts(this, this.board) && distance(this.position, tile.getPosition()) < 100)
            .sort((a, b) => distance(this.position, a.getPosition()) - distance(this.position, b.getPosition()));
        this.tile = sorted.length > 0 ? sorted[0]: null;
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
            return;
        }

        this.cancel();
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

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.ellipse(this.position.x + this.size.x * 0.5, this.position.y + this.size.y * 0.5, 8, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    public lock(): void {
        this.depth = -50;
        this.locked = true;
    }

    public has(dir: Direction): boolean {
        return this.directions && this.directions.includes(dir);
    }

    private lineTo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 7;
        ctx.moveTo(this.position.x + this.size.x * 0.5, this.position.y + this.size.y * 0.5);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    private snap(value: number, grid: number): number {
        return Math.round(value / grid) * grid;
    }

    private getSnapPosition(): Vector {
        return {
            x: this.snap(this.position.x, TILE_WIDTH),
            y: this.snap(this.position.y, TILE_HEIGHT)
        };
    }
}