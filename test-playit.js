import { spawn } from "child_process";
import fs from "fs";

const p = spawn("./bin/playit", [], { stdio: ["ignore", "pipe", "pipe"] });
p.stdout.on("data", d => console.log("STDOUT:", d.toString()));
p.stderr.on("data", d => console.log("STDERR:", d.toString()));
p.on("error", e => console.log("ERROR:", e));
p.on("close", c => console.log("CLOSE:", c));

setTimeout(() => process.exit(0), 5000);
