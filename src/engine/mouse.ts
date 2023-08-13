import { Vector } from "./vector";

export interface Mouse extends Vector {
    pressing?: boolean;
    dragging?: boolean;
}