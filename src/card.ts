import { Draggable } from "./engine/draggable";
import { drawCircle, roundRect } from "./engine/drawing";
import { Mouse } from "./engine/mouse";
import { Pulse } from "./engine/pulse";
import { random, randomCell } from "./engine/random";
import { Vector, distance, normalize, offset } from "./engine/vector";
import { Game } from "./game";
import { HEIGHT, WIDTH } from "./index";
import { Level } from "./level";
import { TextEntity } from "./text";
import { Tile } from "./tile";

export const TILE_WIDTH = 80;
export const TILE_HEIGHT = 60;

export const CARD_BORDER = 7;
export const CARD_GAP = 2;

export type Gem = "n" | "b" | "p" | "r" | "y" | "o" | "g";

export const gemColors = new Map([
    ["n", "#fff"],
    ["b", "#00BDE5"],
    ["p", "#846AC1"],
    ["r", "#E93988"],
    ["y", "#F3DC00"],
    ["o", "#F89F00"],
    ["g", "#B4D000"]
]);

export const gemNames = new Map([
    ["n", ""],
    ["b", "FIBONACCI'S BOON"],
    ["p", "PENANCE"],
    ["r", "POPE'S BLESSING"],
    ["y", "INDULGENCE"],
    ["o", "DYNASTY"],
    ["g", "KHAN'S LEGACY"]
]);

const gemDescriptions = new Map([
    ["n", ""],
    ["b", "|Draw extra| card when |placed"],
    ["p", "|Recycle |random card when |stepping| o"],
    ["r", "|Heal| for one when |placed"],
    ["y", "|Score earned| for stepping on is |tenfold"],
    ["o", "|Doubles| move scores when |stepping| on"],
    ["g", "Fill neighbours with |blank cards"]
]);

export type Direction = "u" | "r" | "d" | "l";

export const getRandomGem = () => {
    return 1 + Math.floor(Math.random() * 5);
}

export interface CardData {
    directions: Direction[];
    gem: Gem;
}

export function randomGem(): Gem {
    return randomCell(["b", "p", "r", "y", "o", "g"]);
}

export function randomCard(chance = 1, canHaveGem = true, dirs?: Direction[]): CardData {
    const count = Math.random() < 0.1 ? 4 : (1 + Math.floor(Math.random() * 3));
    const directions = dirs ?? ["u" as Direction, "r" as Direction, "d" as Direction, "l" as Direction].sort(() =>  Math.random() - 0.5).slice(0, count);
    const gemChance = directions.length == 1 ? 0.6 * chance : 0.2 * chance;
    return {
        directions,
        gem: canHaveGem && Math.random() < gemChance ? randomGem() : "n"
    }
}

export class Card extends Draggable {
    public visited: boolean;
    public selected: boolean;

    private tile: Tile;

    public constructor(x: number, y: number, private level: Level, private game: Game, public data: CardData) {
        super(x, y, TILE_WIDTH, TILE_HEIGHT);
    }

    public is(color: Gem): boolean {
        return this.data.gem != "n" && [this.data.gem, ...this.game.getWilds(this.data.gem)].includes(color);
    }

    public isLocked(): boolean {
        return this.locked;
    }

    public makeSelectable(): void {
        this.lock();
        this.selectable = true;
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.updateTile();
    }

    public updateTile(): void {
        const sorted = [...this.level.board]
            .filter(tile => !tile.content && tile.accepts(this, this.level.board) && distance(this.p, tile.getPosition()) < 100)
            .sort((a, b) => distance(this.p, a.getPosition()) - distance(this.p, b.getPosition()));

        if(sorted.length <= 0) return;

        const prev = this.tile;
        this.tile = sorted.length > 0 ? sorted[0]: null;
        if(this.tile && this.dragging) this.tile.hilite = true;
        if(prev && prev != this.tile) prev.hilite = false;
    }

    public move(to: Vector, duration: number): void {
        this.tween.move(to, duration);
    }

    public getMoveTarget(): Vector {
        return this.game.pile.getPosition();
    }
    
    public getPossibleSpots(): Tile[] {
        return this.level.board.filter(tile => !tile.content && tile.accepts(this, this.level.board))
    }

    protected click(): void {
        this.game.audio.pop();
        this.game.audio.swoosh();
        this.game.pick(this);
        this.game.tooltip.visible = false;
    }

    public pick(): void {
        this.start = {
            x: this.p.x,
            y: this.p.y
        };
        this.game.clearSelect();
        this.game.audio.click();
        this.getPossibleSpots().forEach(tile => tile.marked = true);
    }

    public drop(): void {
        this.level.board.forEach(tile => tile.marked = false);
        
        this.selected = false;
        this.game.audio.pong();
        this.level.board.filter(tile => tile.content === this).forEach(tile => tile.content = null);

        this.d = 100;
        setTimeout(() => this.d = 0, 100);

        if(this.game.picker.rewards > 0) {
            this.move(this.getStartPosition(), 0.1);
            return;
        }

        if(this.game.dude.isMoving) console.log('blocking...');

        if(this.tile && !this.game.dude.isMoving) {
            this.game.multi = 1;
            this.locked = true;
            this.p = this.tile.getPosition();
            this.tile.content = this;
            this.game.fill();
            this.game.findPath(this.tile, this.game);
            if(this.is("b")) {
                this.game.audio.discard();
                this.game.pull();
            }
            if(this.is("r")) {
                this.game.heal(1);
            }
            if(this.is("g")) {
                const neighbours = this.tile.getFreeNeighbours(this.level.board, true).filter(n => !n.content);
                neighbours.forEach(n => this.game.createBlank(n));
                if(neighbours.length > 0) {
                    this.game.audio.open();
                    this.game.audio.aja();
                    this.pulse();
                }
            }
            this.tile = null;
            return;
        }

        this.move(this.getStartPosition(), 0.1);
    }

    public exit(): void {
        if(this.data.gem != "n") {
            this.game.tooltip.visible = false;
        }
    }

    public hover(): void {
        if(this.data.gem != "n") {
            setTimeout(() => {
                const colors = this.data.gem != "n" ? [gemColors.get(this.data.gem)] : [];
                this.game.tooltip.show(gemNames.get(this.data.gem), gemDescriptions.get(this.data.gem), offset(this.getCenter(), 0, -50 * this.scale.y), colors);
            }, 5);
        }
        this.game.audio.thud();
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const c = this.getCenter();
        ctx.translate(c.x, c.y);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.translate(-c.x, -c.y);
        if(this.hovered && this.selectable) {
            ctx.translate(0, -10);
        }
        if(this.dragging) {
            ctx.fillStyle = "#00000022";
            const center =  { x: WIDTH * 0.5, y: 0 };
            const p = {
                x: this.p.x + CARD_GAP,
                y: this.p.y + CARD_GAP
            };
            const dir = normalize({ x: p.x - center.x, y: p.y - center.y });
            roundRect(ctx, p.x + dir.x * 12, p.y + dir.y * 24, this.s.x - CARD_GAP * 2, this.s.y - CARD_GAP * 2, 3);
            ctx.fill();
        }
        
        ctx.fillStyle = "#000";
        ctx.fillRect(this.p.x + CARD_GAP, this.p.y + CARD_GAP, this.s.x - CARD_GAP * 2, this.s.y - CARD_GAP * 2);
        ctx.fillStyle = this.hovered && (!this.locked || this.selectable) ? "#ffff66" : "#fff";
        if(this.visited) ctx.fillStyle = "#ffffaa";
        ctx.fillRect(this.p.x + CARD_BORDER + CARD_GAP, this.p.y + CARD_BORDER + CARD_GAP, this.s.x - CARD_BORDER * 2 - CARD_GAP * 2, this.s.y - CARD_BORDER * 2 - CARD_GAP * 2);

        if(this.data.directions.includes("u")) {
            this.lineTo(ctx, this.p.x + this.s.x * 0.5, this.p.y + CARD_BORDER + CARD_GAP);
        }
        if(this.data.directions.includes("r")) {
            this.lineTo(ctx, this.p.x + this.s.x - CARD_BORDER - CARD_GAP, this.p.y + this.s.y * 0.5);
        }
        if(this.data.directions.includes("d")) {
            this.lineTo(ctx, this.p.x + this.s.x * 0.5, this.p.y + this.s.y - CARD_BORDER - CARD_GAP);
        }
        if(this.data.directions.includes("l")) {
            this.lineTo(ctx, this.p.x + CARD_BORDER + CARD_GAP, this.p.y + this.s.y * 0.5);
        }

        const p = {
            x: this.p.x + this.s.x * 0.5,
            y: this.p.y + this.s.y * 0.5
        };

        if(this.data.directions.length > 0) {
            drawCircle(ctx, p, 8, "#000");
        }

        if(this.data.gem != "n") {
            drawCircle(ctx, p, 12, "#000");
            drawCircle(ctx, p, 6, gemColors.get(this.data.gem));
        }

        if(this.selected) {
            ctx.strokeStyle = "#fff";
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.scale(2, 2.5);
            ctx.translate(-c.x, -c.y);
            drawCorners(ctx, this.p.x, this.p.y, 4);
            ctx.restore();
        }

        ctx.restore();
    }

    public lock(): void {
        this.d = -50;
        this.locked = true;
    }

    public has(dir: Direction): boolean {
        return this.data.directions && this.data.directions.includes(dir);
    }

    public getConnections(): Tile[] {
        const index = this.level.board.find(tile => tile.content === this).index;
        return this.data.directions.map(d => {
            if(d == "u") return this.level.board.find(tile => tile.index.x === index.x && tile.index.y === index.y - 1 && tile.content && tile.content.has("d"));
            if(d == "d") return this.level.board.find(tile => tile.index.x === index.x && tile.index.y === index.y + 1 && tile.content && tile.content.has("u"));
            if(d == "l") return this.level.board.find(tile => tile.index.x === index.x - 1 && tile.index.y === index.y && tile.content && tile.content.has("r"));
            if(d == "r") return this.level.board.find(tile => tile.index.x === index.x + 1 && tile.index.y === index.y && tile.content && tile.content.has("l"));
        }).filter(tile => tile && tile.content);
    }

    public activate(): void {
        if(this.is("r") && this.game.healOnStep) {
            this.game.heal(1);
        }
        if(this.is("p")) {
            this.game.audio.discard();
            this.game.discard();
        }
        if(this.is("o")) {
            this.triggerMulti();
        }
        if(this.is("y")) {
            this.game.audio.score();
        }
    }

    public triggerMulti(): void {
        this.game.audio.multi();
        this.game.multi *= 2;
        this.popText(`x${this.game.multi}`, {
            x: this.p.x + this.s.x * 0.5,
            y: this.p.y + this.s.y * 0.5 - 50
        }, gemColors.get("o"));
    }

    public pop(amt: number): void {
        setTimeout(() => {
            this.game.camera.shake(3, 0.08);
            this.addScore(amt);
        }, 0.2);
    }

    private addScore(amt: number, ): void {
        const isYellow = this.is("y");
        const addition = this.getScore(amt);
        this.game.score += addition;
        const p = {
            x: this.p.x + this.s.x * 0.5,
            y: this.p.y + this.s.y * 0.5 - 20
        };
        this.pulse();
        this.popText(addition.toString(), p, isYellow ? gemColors.get("y") : "#fff");
    }

    public pulse(): void {
        const c = this.getCenter();
        this.game.effects.add(new Pulse(c.x, c.y, 40 + Math.random() * 30, 1, 10, 60));
    }

    private popText(content: string, p: Vector, color: string): void {
        this.game.effects.add(new TextEntity(
            content,
            40 + Math.random() * 10,
            p.x,
            p.y,
            0.5 + Math.random(),
            { x: 0, y: -1 - Math.random() },
            { shadow: 4, align: "center", scales: true, color, angle: random(-0.1, 0.1) }
        ));
    }

    private lineTo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 7;
        ctx.moveTo(this.p.x + this.s.x * 0.5, this.p.y + this.s.y * 0.5);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    public getScore(step: number): number {
        const mod = this.is("y") ? 10 : 1;
        return step * mod * this.game.multi * this.level.level;
    }
}

export function drawCorners(ctx: CanvasRenderingContext2D, x: number, y: number, width = 4): void {
    ctx.lineWidth = width;
    ctx.lineDashOffset = 5;
    ctx.setLineDash([10, 40, 10, 20, 10, 40, 10, 20]);
    ctx.strokeRect(x + 15, y + 15, TILE_WIDTH - 30, TILE_HEIGHT - 30);
    ctx.setLineDash([]);
}