import { CARD_BORDER, CARD_GAP, Gem, TILE_HEIGHT, TILE_WIDTH, gemColors } from "./card";
import { Draggable } from "./engine/draggable";
import { Mouse } from "./engine/mouse";
import { Tween } from "./engine/tween";
import { Vector, ZERO, offset } from "./engine/vector";
import { Game } from "./game";

interface Relic {
    name: string;
    description: string;
    color: string;
    bg: string;
    fill: string;
    repeatable?: boolean;
    pickup: (game: Game) => void;
}

export const relics: Relic[] = [
    { name: "BOOST", description: "Increase your LIFE by 1.", color: "#E93988", bg: "❤", fill: "1", repeatable: true, pickup: (g) => g.boost(1) },
    { name: "BOOSTER", description: "Increase your LIFE by 2.", color: "#E93988", bg: "❤", fill: "2", repeatable: true, pickup: (g) => g.boost(2) },
    { name: "BOOSTED", description: "Increase your LIFE by 3.", color: "#E93988", bg: "❤", fill: "3", pickup: (g) => g.boost(3) },
    { name: "CLAW", description: "Increase your MAX HAND SIZE by 1.", color: "#00BDE5", bg: "❚", fill: "+", repeatable: true, pickup: (g) => g.handSize++ },
    { name: "OPTIONS", description: "Increases the presented reward options.", color: "#F89F00", bg: "❖", fill: "", repeatable: true, pickup: (g) => g.rewardOptions++ },
    { name: "GREED", description: "Allows you to pick an extra reward.", color: "#F89F00", bg: "✸", fill: "+", pickup: (g) => g.rewardPicks++ }
]

export class RelicIcon extends Draggable {
    private tween: Tween;

    constructor(x: number, y: number, private game: Game, public data: Relic) {
        super(x, y, TILE_WIDTH, TILE_HEIGHT);
        this.selectable = true;
        this.locked = true;
        this.tween = new Tween(this);
    }

    public move(to: Vector, duration: number): void {
        this.tween.move(to, duration);
    }

    public makeSelectable(): void {
    }

    public getMoveTarget(): Vector {
        return { x: 10, y: 30 };
    }

    protected hover(): void {
        setTimeout(() => {
            this.game.tooltip.show(this.data.name, this.data.description, offset(this.getCenter(), 0, -50 * this.scale), this.data.color);
        }, 5);
    }

    public exit(): void {
        this.game.tooltip.visible = false;
    }

    protected pick(): void {
    }

    protected click(): void {
        this.game.audio.pop();
        this.game.audio.swoosh();
        this.game.addRelic(this);
        this.game.tooltip.visible = false;
        this.data.pickup(this.game);
    }

    protected drop(): void {
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.tween.update(tick);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const c = this.getCenter();
        ctx.translate(c.x, c.y);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-c.x, -c.y);
        if(this.hovered && this.selectable) {
            ctx.translate(0, -10);
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(this.position.x + CARD_GAP, this.position.y + CARD_GAP, this.size.x - CARD_GAP * 2, this.size.y - CARD_GAP * 2);
        ctx.fillStyle = this.hovered ? "#ffff66" : "#ddd";
        ctx.fillRect(this.position.x + CARD_BORDER + CARD_GAP, this.position.y + CARD_BORDER + CARD_GAP, this.size.x - CARD_BORDER * 2 - CARD_GAP * 2, this.size.y - CARD_BORDER * 2 - CARD_GAP * 2);

        ctx.font = "35px arial black";
        ctx.textAlign = "center";

        ctx.fillStyle = "#000";
        ctx.fillText(this.data.bg, c.x + 2 + 15 - 15, c.y + 2 + 12);
        ctx.fillStyle = this.data.color;
        ctx.fillText(this.data.bg, c.x + 15 - 15, c.y + 12);
        ctx.fillStyle = "#000";
        ctx.font = "10px arial black";
        ctx.fillText(this.data.fill, c.x + 1, c.y + 4);

        ctx.restore();
    }
}