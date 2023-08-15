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
}