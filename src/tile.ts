import { Card, Direction, TILE_HEIGHT, TILE_WIDTH } from "./card";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector } from "./engine/vector";

export class Tile extends Entity {
    public content: Card;
    public marked: boolean;
    public hilite: boolean;
    public index: Vector;

    private life = 0;
    private offset = Math.random() * 100;
    
    public constructor(x: number, y: number, offset: Vector) {
        super(x * TILE_WIDTH + offset.x, y * TILE_HEIGHT + offset.y, 80, 60);
        this.index = { x, y };
        this.depth = -100;
    }

    public update(tick: number, mouse: Mouse): void {
        this.life = tick * 0.01 * (this.hilite ? 3 : -1);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#999";
        ctx.fillRect(this.position.x - 5, this.position.y - 5, this.size.x + 10, this.size.y + 10);
        
        if(this.marked || this.hilite) {
            ctx.strokeStyle = this.hilite ? "#ddd" : "#bbb";
            ctx.lineWidth = this.hilite ? 7 : 5;
            ctx.setLineDash([5, 10]);
            ctx.lineCap = "round";
            ctx.lineDashOffset = this.life + this.offset;
            ctx.strokeRect(this.position.x + 10, this.position.y + 10, this.size.x - 20, this.size.y - 20);
        }

        ctx.setLineDash([]);
    }

    public isIn(snapped: Vector): boolean {
        return !this.content && this.position.x == snapped.x && this.position.y == snapped.y;
    }

    public accepts(card: Card, board: Tile[]): boolean {
        return board.some(tile => {
            if(tile.index.x == this.index.x && tile.index.y == this.index.y - 1 && tile.content && tile.content.has(Direction.Down) && card.has(Direction.Up)) return true;
            if(tile.index.x == this.index.x && tile.index.y == this.index.y + 1 && tile.content && tile.content.has(Direction.Up) && card.has(Direction.Down)) return true;
            if(tile.index.x == this.index.x + 1 && tile.index.y == this.index.y && tile.content && tile.content.has(Direction.Left) && card.has(Direction.Right)) return true;
            if(tile.index.x == this.index.x - 1 && tile.index.y == this.index.y && tile.content && tile.content.has(Direction.Right) && card.has(Direction.Left)) return true;
            return false;
        });
    }

    public getNeighbours(board: Tile[]): Tile[] {
        return board.filter(tile => tile.content && Math.abs(tile.index.x - this.index.x) + Math.abs(tile.index.y - this.index.y) == 1);
    }
}