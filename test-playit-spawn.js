import { spawn } from "child_process";
const p = spawn("./bin/playit", ["-s"], { stdio: "pipe" });
p.stdout.on("data", d => process.stdout.write(d));
p.stderr.on("data", d => process.stderr.write(d));
setTimeout(() => {
    p.kill();
    process.exit(0);
}, 5000);
