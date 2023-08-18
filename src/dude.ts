import { Card, Gem, TILE_HEIGHT, TILE_WIDTH } from "./card";
import { drawCircle, drawEllipse } from "./engine/drawing";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Tween } from "./engine/tween";
import { Game } from "./game";
import { Level } from "./level";
import { Tile } from "./tile";

export class Dude extends Entity {
    private tweener: Tween;
    private path: Tile[] = [];
    private phase = 0;

    constructor(private tile: Tile) {
        const p = tile.getPosition();
        super(p.x, p.y, TILE_WIDTH, TILE_HEIGHT);
        this.tweener = new Tween(this);
        this.d = 50;
    }

    public reset(tile: Tile): void {
        const p = tile.getPosition();
        this.tile = tile;
        this.p = { x: p.x, y: p.y };
    }

    public update(tick: number, mouse: Mouse): void {
        this.tweener.update(tick);
        this.phase = Math.abs(Math.sin(tick * 0.005));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const center = {
            x: this.p.x + this.s.x * 0.5, 
            y: this.p.y + this.s.y * 0.5
        };
        const head = {
            x: this.p.x + this.s.x * 0.5, 
            y: this.p.y + this.s.y * 0.5 - 30 - 5 * this.phase
        };
        drawEllipse(ctx, center, 24, 12, "#00000033");
        drawCircle(ctx, head, 14, "#000");
        ctx.beginPath();
        ctx.moveTo(center.x, this.p.y - 10 - 5 * this.phase);
        ctx.lineTo(center.x + 14, this.p.y + 32);
        ctx.lineTo(center.x, this.p.y + 34);
        ctx.lineTo(center.x - 14, this.p.y + 32);
        ctx.fill();
        drawCircle(ctx, head, 8, "#fff");
        ctx.beginPath();
        ctx.moveTo(center.x, this.p.y - 2 - 5 * this.phase);
        ctx.lineTo(center.x + 6, this.p.y + 26);
        ctx.lineTo(center.x, this.p.y + 28);
        ctx.lineTo(center.x - 6, this.p.y + 26);
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(head.x, head.y + 5);
        ctx.lineTo(head.x, head.y - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(head.x - 4, head.y - 2 * this.phase);
        ctx.lineTo(head.x + 4, head.y - 2 * this.phase);
        ctx.stroke();
    }

    public findPath(to: Tile, game: Game, level: Level): void {
        this.path = [];
        this.findNext(this.tile, to, [this.tile]);
        this.tile = this.path[this.path.length - 1];
        this.path.forEach((tile, index) => {
            setTimeout(() => {
                tile.content.visited = true;
                this.tweener.move(tile.getPosition(), 0.3);

                if(index > 0) {
                    setTimeout(() => game.audio.move(), 0.3, 100);
                    tile.content.activate();
                    tile.content.pop(index * game.stepScore);
                    game.loot(tile);

                    if(game.remoteMulti) {
                        const neighbours = tile.getNeighbours(level.board).filter(t => t.content && t.content.data.gem == Gem.Orange);
                        neighbours.forEach(n => n.content.activate());
                    }
                }
            }, index * 300);
        });
        setTimeout(() => this.path.forEach(p => p.content.visited = false), this.path.length * 300 + 300);
        setTimeout(() => game.checkLevelEnd(), this.path.length * 300 + 600);
    }

    private findNext(from: Tile, to: Tile, visited: Tile[]): void {
        const steps = from.content.getConnections().filter(tile => !visited.includes(tile));
        if(from == to) {
            if(this.path.length < visited.length) {
                this.path = [...visited];
            }
            return;
        }
        if(steps.length <= 0) return;
        steps.forEach(step => this.findNext(step, to, [...visited, step]));
    }
}