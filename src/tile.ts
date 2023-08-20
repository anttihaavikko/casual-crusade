import { Card, Direction, Gem, TILE_HEIGHT, TILE_WIDTH, gemColors } from "./card";
import { drawEllipse, roundRect } from "./engine/drawing";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector } from "./engine/vector";
import { Lid } from "./lid";

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
    private ballSize: number;
    private lid: Lid;
    
    public constructor(x: number, y: number, offset: Vector) {
        super(x * TILE_WIDTH + offset.x, y * TILE_HEIGHT + offset.y, TILE_WIDTH, TILE_HEIGHT);
        this.index = { x, y };
        this.d = -100;
        this.ballSize = 15 + Math.random() * 7;
        this.lid = new Lid(this.getCenter());
    }

    public getLid(): Lid {
        return this.lid;
    }

    public update(tick: number, mouse: Mouse): void {
        this.life = tick * 0.01 * (this.hilite ? 3 : -1);
        this.lid.update(tick, mouse);
    }

    public loot(): void {
        this.looted = true;
        this.lid.open();
    }

    public prePreDraw(ctx: CanvasRenderingContext2D): void {
        if(!this.reward && !this.hidden) {
            ctx.setLineDash([0, this.ballSize]);
            ctx.lineDashOffset = this.offset * 2;
            ctx.lineCap = "round";
            ctx.lineWidth = this.ballSize + 10;
            ctx.strokeStyle = "#5b7c5b";
            roundRect(ctx, this.p.x - 5, this.p.y - 5, this.s.x + 10, this.s.y + 10, 5);
            ctx.stroke();
        }
    }

    public preDraw(ctx: CanvasRenderingContext2D): void {
        if(!this.reward && !this.hidden) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#5b7c5b";
            ctx.beginPath();
            ctx.setLineDash([])
            roundRect(ctx, this.p.x - 5, this.p.y - 5, this.s.x + 10, this.s.y + 10, 15);
            ctx.stroke();

            ctx.setLineDash([0, this.ballSize]);
            ctx.lineDashOffset = this.offset * 2;
            ctx.lineCap = "round";
            ctx.lineWidth = this.ballSize;
            ctx.strokeStyle = "#afd594";
            roundRect(ctx, this.p.x - 5, this.p.y - 5, this.s.x + 10, this.s.y + 10, 5);
            ctx.stroke();
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(this.hidden) return;

        const center = this.getCenter();

        if(!this.reward) {
            ctx.fillStyle = "#afd594";
            ctx.beginPath();
            roundRect(ctx, this.p.x - 5, this.p.y - 5, this.s.x + 10, this.s.y + 10, 15);
            ctx.fill();
        }

        if(this.reward) {
            ctx.save();
            ctx.translate(0, 7);
            drawEllipse(ctx, this.getCenter(), 27, 12, "#00000033");
            ctx.fillStyle = "#000";
            ctx.fillRect(center.x - 20, center.y - 22, 40, 25);
            ctx.fillStyle = gemColors.y;
            ctx.fillRect(center.x - 15, center.y - 17, 30, 15);
            ctx.fillStyle = "#000";
            ctx.fillRect(center.x - 12, center.y - 16, 24, 7);
            this.lid.draw(ctx);
            ctx.restore();
        }
        
        if(this.marked || this.hilite) {
            ctx.strokeStyle = this.hilite ? "#ffffffff" : "#ffffff99";
            ctx.lineWidth = this.hilite ? 10 : 6;
            ctx.setLineDash([5, 15]);
            ctx.lineCap = "round";
            ctx.lineDashOffset = this.life + this.offset;
            ctx.beginPath();
            roundRect(ctx, this.p.x + 10, this.p.y + 10, this.s.x - 20, this.s.y - 20, 10);
            ctx.stroke();
        }

        ctx.setLineDash([]);
    }

    public isIn(snapped: Vector): boolean {
        return !this.content && this.p.x == snapped.x && this.p.y == snapped.y;
    }

    public accepts(card: Card, board: Tile[]): boolean {
        if(this.reward) return false;
        return board.some(tile => {
            if(tile.index.x == this.index.x && tile.index.y == this.index.y - 1 && tile.content && tile.content.has("d") && card.has("u")) return true;
            if(tile.index.x == this.index.x && tile.index.y == this.index.y + 1 && tile.content && tile.content.has("u") && card.has("d")) return true;
            if(tile.index.x == this.index.x + 1 && tile.index.y == this.index.y && tile.content && tile.content.has("l") && card.has("r")) return true;
            if(tile.index.x == this.index.x - 1 && tile.index.y == this.index.y && tile.content && tile.content.has("r") && card.has("l")) return true;
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