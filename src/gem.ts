
export type GemColor = "n" | "b" | "p" | "r" | "y" | "o" | "g";

export interface Gem {
    type: GemColor;
    name: string;
    desc: string;
    color: string;
}

export const gems: Gem[] = [
    { type: "b", color: "#00BDE5", name: "FIBONACCI'S BOON", desc: "|Draw extra| card when |placed" },
    { type: "p", color: "#846AC1", name: "PENANCE", desc: "|Recycle |random card when |stepping| on" },
    { type: "r", color: "#E93988", name: "POPE'S BLESSING", desc: "|Heal| for one when |placed" },
    { type: "y", color: "#F3DC00", name: "INDULGENCE", desc: "|Score earned| for stepping on is |tenfold" },
    { type: "o", color: "#F89F00", name: "DYNASTY", desc: "|Doubles| move scores when |stepping| on" },
    { type: "g", color: "#B4D000", name: "KHAN'S LEGACY", desc: "Fill neighbours with |blank cards" }
];
