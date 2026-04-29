import { spawn } from "child_process";
const p = spawn("./bin/playit", ["-h"]);
p.stdout.on("data", d => process.stdout.write(d));
p.stderr.on("data", d => process.stderr.write(d));
