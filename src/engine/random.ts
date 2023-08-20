export const random = (min = 0, max = 1): number => {
    return min + Math.random() * max;
}

export const randomInt = (min: number, max: number): number => {
    return min + Math.floor(Math.random() * (max - min + 1));
}

export const randomChance = (): boolean => {
    return Math.random() < 0.5;
}

export const randomCell = <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const randomSorter = () => Math.random() < 0.5 ? 1 : -1;