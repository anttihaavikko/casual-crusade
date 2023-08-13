import { Card, TILE_HEIGHT, TILE_WIDTH } from "./card";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Tween } from "./engine/tween";
import { Tile } from "./tile";

export class Dude extends Entity {
    private tweener: Tween;
    private path: Tile[] = [];

    constructor(private tile: Tile) {
        const p = tile.getPosition();
        super(p.x, p.y, TILE_WIDTH, TILE_HEIGHT);
        this.tweener = new Tween(this);
    }

    public update(tick: number, mouse: Mouse): void {
        this.tweener.update(tick);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(this.position.x + this.size.x * 0.5 - 10, this.position.y + this.size.y * 0.5 - 10, 20, 20);
    }

    public findPath(to: Tile, board: Tile[]): void {
        this.path = [];
        this.findNext(this.tile, to, [this.tile]);
        this.tile = this.path[this.path.length - 1];
        this.path.forEach((tile, index) => {
            setTimeout(() => this.tweener.move(tile.getPosition(), 0.3), index * 300);
        });
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