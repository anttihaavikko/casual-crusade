import { CARD_BORDER, CARD_GAP, Gem, TILE_HEIGHT, TILE_WIDTH, gemColors, gemNames } from "./card";
import { Draggable } from "./engine/draggable";
import { Mouse } from "./engine/mouse";
import { Vector, offset } from "./engine/vector";
import { Game } from "./game";

interface Relic {
    name: string;
    description: string;
    color?: string;
    bg: string;
    fill: string;
    repeatable?: boolean;
    pickup: (game: Game) => void;
    gems?: Gem[];
}

export const WILD_NAME = "WILDCARD";

export const relics: Relic[] = [
    { name: "BENEVOLENT", description: "Increase your |LIFE| by |1|.", color: "#E93988", bg: "❤", fill: "1", repeatable: true, pickup: (g) => g.boost(1) },
    { name: "SAINTHOOD", description: "Increase your |LIFE| by |2|.", color: "#E93988", bg: "❤", fill: "2", repeatable: true, pickup: (g) => g.boost(2) },
    { name: "DEMIDEITY", description: "Increase your |LIFE| by |3|.", color: "#E93988", bg: "❤", fill: "3", pickup: (g) => g.boost(3) },
    { name: "MAGNA CARTA", description: "Increase your |MAX HAND SIZE| by |1|.", color: "#00BDE5", bg: "❚", fill: "+", repeatable: true, pickup: (g) => g.handSize++ },
    { name: "SACRAMENT", description: "Increases the presented |reward options|.", color: "#F89F00", bg: "❖", fill: "", repeatable: true, pickup: (g) => g.rewardOptions++ },
    { name: "MIRACLE", description: "Allows you to pick an |extra| reward.", color: "#F89F00", bg: "✸", fill: "+", pickup: (g) => g.rewardPicks++ },
    { name: "CAVALRY", description: "Your |empty cards| can open chests.", color: "#B4D000", bg: "✿", fill: "", pickup: (g) => g.canRemoteOpen = true },
    { name: "FAITH", description: "Stepping on |RED| also |HEALS|.", color: "#E93988", bg: "❤", fill: "❤", pickup: (g) => g.healOnStep = true },
    { name: "PILLAGE", description: "Double your step |SCORE|.", color: "#F3DC00", bg: "✱", fill: "x", repeatable: true, pickup: (g) => g.stepScore++ },
    { name: "LOOT", description: "Passing by |ORANGE| activates it.", color: "#F89F00", bg: "⇲", fill: "", pickup: (g) => g.remoteMulti = true },
    { name: "MANNA", description: "Get increased |GEM| chance.", color: "#F3DC00", bg: "◓", fill: "", repeatable: true, pickup: (g) => g.gemChance *= 1.3 },
    { name: "SIN", description: "Once per level, |redraw| your hand if |stuck|.", color: "#846AC1", bg: "✟", fill: "", pickup: (g) => g.canRedraw = true },
    { name: WILD_NAME, description: "|!1| ⇆ |!2|.", bg: "!", fill: "", pickup: (g) => {} }
];

export class RelicIcon extends Draggable {
    public icon: boolean;

    constructor(x: number, y: number, private game: Game, public data: Relic) {
        super(x, y, TILE_WIDTH, TILE_HEIGHT);
        this.selectable = true;
        this.locked = true;
        this.data.gems = [1, 2, 3, 4, 5, 6].sort(() => Math.random() < 0.5 ? 1 : -1);
        this.data.color = this.data.name == WILD_NAME ? gemColors[this.data.gems[0]] : this.data.color;
    }

    public isInside(point: Vector): boolean {
        if(!this.icon) return super.isInside(point);

        const c = this.getCenter();
        return point.x > c.x - this.s.x * 0.25 * this.scale.x && 
            point.x < c.x + this.s.x * 0.25 * this.scale.x &&
            point.y > c.y - this.s.y * 0.25 * this.scale.y &&
            point.y < c.y + this.s.y * 0.25 * this.scale.y;
    }

    public move(to: Vector, duration: number): void {
        this.tween.move(to, duration);
    }

    public makeSelectable(): void {
    }

    public getMoveTarget(): Vector {
        return { x: 30, y: 50 };
    }

    protected hover(): void {
        setTimeout(() => {
            const dx = this.icon ? 230 : 0;
            const dy = this.icon ? 110 : -50 * this.scale.y;
            const tt = this.data.description.replace("!1", gemNames[this.data.gems[0]]).replace("!2", gemNames[this.data.gems[1]]);
            this.game.tooltip.show(this.data.name, tt, offset(this.getCenter(), dx, dy), this.data.name == WILD_NAME ? this.data.gems.map(g => gemColors[g]) : [this.data.color]);
        }, 5);
        this.game.audio.thud();
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
        if(this.icon) return;
        this.tween.update(tick);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const c = this.getCenter();
        ctx.translate(c.x, c.y);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.translate(-c.x, -c.y);
        if(this.hovered && this.selectable && !this.icon) {
            ctx.translate(0, -10);
        }

        if(!this.icon) {
            ctx.fillStyle = "#000";
            ctx.fillRect(this.p.x + CARD_GAP, this.p.y + CARD_GAP, this.s.x - CARD_GAP * 2, this.s.y - CARD_GAP * 2);
            ctx.fillStyle = this.hovered ? "#ffff66" : "#ddd";
            ctx.fillRect(this.p.x + CARD_BORDER + CARD_GAP, this.p.y + CARD_BORDER + CARD_GAP, this.s.x - CARD_BORDER * 2 - CARD_GAP * 2, this.s.y - CARD_BORDER * 2 - CARD_GAP * 2);
        }

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