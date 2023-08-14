import { Vector, ZERO } from "./vector";

export class Camera {
    public offset: Vector = ZERO;
    public rotation: number;

    private shakeStrength = 0;

    public shake(amount: number, duration: number): void {
        this.shakeStrength = amount;
        setTimeout(() => this.reset(), duration * 1000);
    }

    public update(): void {
        this.offset = {
            x: -this.shakeStrength + Math.random() * 2 * this.shakeStrength,
            y: -this.shakeStrength + Math.random() * 2 * this.shakeStrength
        }
    }

    private reset(): void {
        this.shakeStrength = 0;
    }
}