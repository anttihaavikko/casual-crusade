import { random } from "./random";
import { Vector, ZERO } from "./vector";

export class Camera {
    public offset: Vector = ZERO;
    public rotation: number;

    private shakeStrength = 0;
    private shakeRotation = 0;

    public shake(amount: number, duration: number, rotation = 0): void {
        this.shakeStrength = amount;
        this.shakeRotation = rotation / 360 * Math.PI;
        setTimeout(() => this.reset(), duration * 1000);
    }

    public update(): void {
        this.offset = {
            x: random(-this.shakeStrength, this.shakeStrength),
            y: random(-this.shakeStrength, this.shakeStrength)
        };
        this.rotation = random(-this.shakeRotation, this.shakeRotation);
    }

    private reset(): void {
        this.shakeStrength = 0;
        this.shakeRotation = 0;
    }
}