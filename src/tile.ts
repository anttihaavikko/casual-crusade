import { Card, Direction, Gem, TILE_HEIGHT, TILE_WIDTH, gemColors } from "./card";
import { Container } from "./engine/container";
import { drawCircle, drawEllipse } from "./engine/drawing";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { RectParticle } from "./engine/rect";
import { Vector } from "./engine/vector";

export class Tile extends Entity {
    public content: Card;
    public marked: boolean;
    public hilite: boolean;
    public index: Vector;
    public reward: boolean;
    public looted: boolean;
    public hidden: boolean;

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

    public loot(): void {
        this.looted = true;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(this.hidden) return;
        
        const center = this.getCenter();

        if(!this.reward) {
            ctx.fillStyle = "#999";
            ctx.fillRect(this.position.x - 5, this.position.y - 5, this.size.x + 10, this.size.y + 10);
        }

        if(this.reward) {
            ctx.save();
            ctx.translate(0, 7);
            drawEllipse(ctx, this.getCenter(), 27, 12, "#00000033");
            ctx.fillStyle = "#000";
            ctx.fillRect(center.x - 20, center.y - 22, 40, 25);
            ctx.fillStyle = gemColors[Gem.Yellow];
            ctx.fillRect(center.x - 15, center.y - 17, 30, 15);
            ctx.fillStyle = "#000";
            ctx.fillRect(center.x - 12, center.y - 16, 24, 7);

            if(!this.looted) {
                ctx.fillStyle = "#000";
                ctx.fillRect(center.x - 22, center.y - 28, 44, 20);
                ctx.fillStyle = gemColors[Gem.Yellow];
                ctx.fillRect(center.x - 17, center.y - 23, 34, 10);
            }
            
            ctx.restore();
        }
        
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
        if(this.reward) return false;
        return board.some(tile => {
            if(tile.index.x == this.index.x && tile.index.y == this.index.y - 1 && tile.content && tile.content.has(Direction.Down) && card.has(Direction.Up)) return true;
            if(tile.index.x == this.index.x && tile.index.y == this.index.y + 1 && tile.content && tile.content.has(Direction.Up) && card.has(Direction.Down)) return true;
            if(tile.index.x == this.index.x + 1 && tile.index.y == this.index.y && tile.content && tile.content.has(Direction.Left) && card.has(Direction.Right)) return true;
            if(tile.index.x == this.index.x - 1 && tile.index.y == this.index.y && tile.content && tile.content.has(Direction.Right) && card.has(Direction.Left)) return true;
            return false;
        });
    }

    public getChests(board: Tile[]): Tile[] {
        return board.filter(tile => tile.reward && Math.abs(tile.index.x - this.index.x) + Math.abs(tile.index.y - this.index.y) == 1);
    }

    public getNeighbours(board: Tile[]): Tile[] {
        return board.filter(tile => tile.content && Math.abs(tile.index.x - this.index.x) + Math.abs(tile.index.y - this.index.y) == 1);
    }

    public getFreeNeighbours(board: Tile[], includeDiagonals: boolean): Tile[] {
        return includeDiagonals ?
            board.filter(tile => !tile.reward && !tile.content && tile != this && Math.abs(tile.index.x - this.index.x) <= 1 && Math.abs(tile.index.y - this.index.y) <= 1) :
            board.filter(tile => !tile.reward && !tile.content && Math.abs(tile.index.x - this.index.x) + Math.abs(tile.index.y - this.index.y) == 1);
    }
}