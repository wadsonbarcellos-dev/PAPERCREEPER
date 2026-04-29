import { spawn } from "child_process";
const p = spawn("./bin/playit", ["setup"]);
p.stdout.on("data", d => process.stdout.write(d));
p.stderr.on("data", d => process.stderr.write(d));
p.on("close", () => process.exit(0));
