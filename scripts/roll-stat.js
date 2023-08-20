const { exec } = require("child_process");

let count = 0;

const func = () => {
    const out = exec("npm run roadroll", (err, out) => {
        const lines = out.slice(-100).split("\n");
        console.log(lines[lines.length - 2]);
        count++;
        if(count < 10) func();
    });
};

func();
