import { Card } from "./card";
import { Vector, distance } from "./engine/vector";
import { Tile } from "./tile";

export class Level {
    public board: Tile[];
    public starter: Card;
    public level = 0;

    constructor(private offset: Vector) {
        this.next();
    }

    public isFull(): boolean {
        return !this.board.some(tile => !tile.content);
    }

    public next(): void {
        this.level++;

        const extras = [
            new Tile(0, 0, this.offset),
            new Tile(2, 2, this.offset),
            new Tile(0, 2, this.offset),
            new Tile(2, 0, this.offset),
            new Tile(1, -1, this.offset),
            new Tile(1, 3, this.offset),
            new Tile(-1, 1, this.offset),
            new Tile(3, 1, this.offset)
        ];

        this.board = [
            new Tile(0, 1, this.offset),
            new Tile(1, 0, this.offset),
            new Tile(1, 1, this.offset),
            new Tile(1, 2, this.offset),
            new Tile(2, 1, this.offset),
            ...extras.sort(() => Math.random() < 0.5 ? 1 : -1).slice(0, (this.level - 1) * 2)
        ];

        if(this.starter) {
            this.board[2].content = this.starter;
        }

        const center = this.board[2].getPosition();
        const tiles = this.getPossibleRewardSpots().sort(() => Math.random() < 0.5 ? 1 : -1).sort((a, b) => {
            return distance(a.getPosition(), center) < distance(b.getPosition(), center) ? 1 : -1;
        });
        tiles.slice(0, this.level).forEach(tile => tile.reward = true);
    }

    private getPossibleRewardSpots(): Tile[] {
        return [...this.board.filter(tile => tile != this.board[2] && tile.getNeighbours(this.board).length < 4)];
    }
}