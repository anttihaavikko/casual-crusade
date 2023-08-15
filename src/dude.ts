import { Card, TILE_HEIGHT, TILE_WIDTH } from "./card";
import { drawCircle, drawEllipse } from "./engine/drawing";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Tween } from "./engine/tween";
import { Game } from "./game";
import { Tile } from "./tile";

export class Dude extends Entity {
    private tweener: Tween;
    private path: Tile[] = [];
    private phase = 0;

    constructor(private tile: Tile) {
        const p = tile.getPosition();
        super(p.x, p.y, TILE_WIDTH, TILE_HEIGHT);
        this.tweener = new Tween(this);
        this.depth = 50;
    }

    public reset(tile: Tile): void {
        const p = tile.getPosition();
        this.tile = tile;
        this.position = { x: p.x, y: p.y };
    }

    public update(tick: number, mouse: Mouse): void {
        this.tweener.update(tick);
        this.phase = Math.abs(Math.sin(tick * 0.005));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const center = {
            x: this.position.x + this.size.x * 0.5, 
            y: this.position.y + this.size.y * 0.5
        };
        const head = {
            x: this.position.x + this.size.x * 0.5, 
            y: this.position.y + this.size.y * 0.5 - 30 - 5 * this.phase
        };
        drawEllipse(ctx, center, 24, 12, "#00000033");
        drawCircle(ctx, head, 14, "#000");
        ctx.beginPath();
        ctx.moveTo(center.x, this.position.y - 10 - 5 * this.phase);
        ctx.lineTo(center.x + 14, this.position.y + 32);
        ctx.lineTo(center.x, this.position.y + 34);
        ctx.lineTo(center.x - 14, this.position.y + 32);
        ctx.fill();
        drawCircle(ctx, head, 8, "#fff");
        ctx.beginPath();
        ctx.moveTo(center.x, this.position.y - 2 - 5 * this.phase);
        ctx.lineTo(center.x + 6, this.position.y + 26);
        ctx.lineTo(center.x, this.position.y + 28);
        ctx.lineTo(center.x - 6, this.position.y + 26);
        ctx.fill();
    }

    public findPath(to: Tile, game: Game): void {
        this.path = [];
        this.findNext(this.tile, to, [this.tile]);
        this.tile = this.path[this.path.length - 1];
        this.path.forEach((tile, index) => {
            setTimeout(() => {
                tile.content.visited = true;
                this.tweener.move(tile.getPosition(), 0.3);

                if(index > 0) {
                    setTimeout(() => game.audio.move(), 0.3, 100);
                    tile.content.pop(index);

                    if(tile.reward) {
                        setTimeout(() => {
                            game.audio.chest();
                            tile.reward = false;
                            game.picker.rewards++;
                            game.picker.create();
                        }, 300);
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