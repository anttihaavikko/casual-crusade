export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

export function clamp01(num: number): number {
    return clamp(num, 0, 1);
}