import { song } from "../song";
import { CPlayer } from "./audio-player";
import { zzfx } from "./zzfx";

export class AudioManager {
    private started = false;

    public playMusic(): void {
        if(this.started) return;

        this.started = true;

        // const player = new CPlayer();
        // player.init(song);
        // player.generate();
        // let loaded = false;

        // setInterval(function () {
        //     if (loaded) return;
        //     loaded = player.generate() >= 1;
        //     if (loaded) {
        //         var wave = player.createWave();
        //         var audio = document.createElement("audio");
        //         audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
        //         audio.loop = true;
        //         audio.play();
        //     }
        // });
    }

    public move(): void {
        zzfx(...[,,759,.01,,.01,1,.97,15,,,,,,3.1,,,.76,.04]);
    }

    public chest(): void {
        zzfx(...[,,392,.06,.22,.5,1,1.85,-0.1,-0.9,61,.05,.07,,,.1,,.96,.12]);
    }

    public win(): void {
        zzfx(...[,,146,.04,.23,.46,,.56,,-3.7,658,.02,.15,.1,,,,.82,.13,.2]);
    }

    public explode(): void {
        zzfx(...[2.01,,785,.01,.1,.54,4,2.66,,,,,,.9,,.5,.38,.34,.11,.14]);
    }

    public open(): void {
        zzfx(...[,,22,.08,.22,.02,1,.52,-4.2,-9.8,,,.14,,-18,.2,,,.05]);
    }

    public lose(): void {
        zzfx(...[,,430,.02,.12,.5,,.89,,-3.6,-133,.07,.13,,,.1,,.83,.23,.26]);
    }

    public frog(): void {
        zzfx(...[,,160,.03,.03,.02,,1.52,-23,93,662,.02,,,,.1,,,.07,.01]);
    }

    public thud(): void {
        zzfx(...[,,1305,,,.03,1,.75,,23,694,.01,,,3.9,,,,.01]);
    }

    public click(): void {
        zzfx(...[,,158,.09,.18,.03,,2.53,11,-58,63,.02,.01,.5,,,,.16]);
    }

    public aja(): void {
        zzfx(...[1.01,,1496,.09,.09,.01,3,.14,,,-870,,,,3.2,.2,,.31,.02]);
    }

    public pop(): void {
        zzfx(...[,,1368,.09,,0,,1.11,-76,9.1,-490,,,,,,,.56]);
    }

    public pong(): void {
        zzfx(...[6.24,,205,,.02,0,,1.03,,,,,,,,,.12,.32]);
    }

    public swoosh(): void {
        zzfx(...[.25,,836,.11,,0,4,.91,13,,,,.09,.1,-39,,,.06,.07]);
    }

    public multi(): void {
        zzfx(...[1.04,,341,,.14,.23,1,1.01,.9,,-132,.03,,.1,,.1,,.52,.22]);
    }

    public score(): void {
        zzfx(...[1.01,,103,.04,.11,.43,1,.77,,,57,.19,.05,,,.1,,.68,.24]);
    }

    public discard(): void {
        zzfx(...[,,426,.01,,.05,,2.54,49,,9,.1,,,,,,.46,.15]);
    }

    public heal(): void {
        zzfx(...[1.22,,193,.04,.27,.42,1,1.71,2.8,4.9,,,.1,.2,,.1,,.55,.27,.47]);
    }
}