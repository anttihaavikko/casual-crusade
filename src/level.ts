import { Card, TILE_HEIGHT, TILE_WIDTH } from "./card";
import { Vector, ZERO, distance } from "./engine/vector";
import { HEIGHT, WIDTH } from "./index";
import { Tile } from "./tile";

export class Level {
    public board: Tile[];
    public starter: Card;
    public level = 0;
    public retried = false;

    private offset: Vector;

    constructor() {
        this.offset = {
            x: WIDTH * 0.5 - TILE_WIDTH * 1.5,
            y: HEIGHT * 0.5 - TILE_HEIGHT * 1.75
          };
        this.next();
    }

    public isFull(): boolean {
        return !this.board.some(tile => !tile.content);
    }

    public restart(): void {
        this.level = 0;
        this.next();
    }

    public next(): void {
        this.retried = false;
        this.level++;

        // console.log('Starting level', this.level);

        this.board = [
            new Tile(0, 1, this.offset),
            new Tile(1, 0, this.offset),
            new Tile(1, 1, this.offset),
            new Tile(1, 2, this.offset),
            new Tile(2, 1, this.offset)
        ];

        for(var i = 0; i < (this.level - 1) * 2; i++) {
            // const ys = this.board.map(t => t.index).map(p => p.y);
            // const minY = Math.min(...ys);
            // const maxY = Math.max(...ys);
            // const xs = this.board.map(t => t.index).map(p => p.x);
            // const minX = Math.min(...xs);
            // const maxX = Math.max(...xs);
            const spot = this.getFromAllEdgeTile(/*minX, maxX, minY, maxY*/);
            if(!spot) continue;
            this.board.push(new Tile(spot.x, spot.y, this.offset));
        }

        if(this.starter) {
            this.board[2].content = this.starter;
            this.board[2].content.setPosition(this.offset.x + TILE_WIDTH, this.offset.y + TILE_HEIGHT);
        }

        const center = this.board[2].getPosition();
        const tiles = this.getPossibleRewardSpots().sort(() => Math.random() < 0.5 ? 1 : -1).sort((a, b) => {
            return distance(a.getPosition(), center) < distance(b.getPosition(), center) ? 1 : -1;
        });
        tiles.slice(0, Math.max(0, this.level - Math.max(0, this.level - 10) * 3)).forEach(tile => {
            const edge = this.getEdgeTile(tile);
            if(!edge) return;
            const chest = new Tile(edge.x, edge.y, this.offset);
            chest.reward = true;
            this.board.push(chest);
        });
    }

    private isInRange(t: Tile/*, minX: number, maxX: number, minY: number, maxY: number*/): boolean {
        // return (t.index.x > minX && t.index.x < maxX || (maxX - minX) < 8) && (t.index.y > minY && t.index.y < maxY || (maxY - minY) < 5);
        return t.index.x > -3 && t.index.x < 5 && t.index.y > -2 && t.index.y < 4;
    }

    private getFromAllEdgeTile(/*minX: number, maxX: number, minY: number, maxY: number*/): Vector {
        const tiles = this.board.filter(tile => tile.getNeighbours(this.board).length < 4).filter(t => this.isInRange(t/*, minX, maxX, minY, maxY*/));
        const spots: Vector[] = [];
        tiles.forEach(tile => {
            spots.push(...[
                this.edgeOrZero(tile, { x: 1, y: 0 }),
                this.edgeOrZero(tile, { x: -1, y: 0 }),
                this.edgeOrZero(tile, { x: 0, y: 1 }),
                this.edgeOrZero(tile, { x: 0, y: -1 })
            ].filter(v => v != ZERO));
        });
        return spots[Math.floor(Math.random() * spots.length)];
    }

    private getEdgeTile(tile: Tile): Vector {
        const spots = [
            this.edgeOrZero(tile, { x: 1, y: 0 }),
            this.edgeOrZero(tile, { x: -1, y: 0 }),
            this.edgeOrZero(tile, { x: 0, y: 1 }),
            this.edgeOrZero(tile, { x: 0, y: -1 })
        ].filter(v => v != ZERO);
        return spots[Math.floor(Math.random() * spots.length)];
    }

    private getPossibleRewardSpots(): Tile[] {
        return [...this.board.filter(tile => tile != this.board[2] && tile.getNeighbours(this.board).length < 4)];
    }

    private edgeOrZero(tile: Tile, dir: Vector): Vector {
        return !this.board.some(t => t.index.x == tile.index.x + dir.x && t.index.y == tile.index.y + dir.y) ? {
            x: tile.index.x + dir.x,
            y: tile.index.y + dir.y
        } : ZERO;
    }
}