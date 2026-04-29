import fs from "fs";
const stats = fs.statSync("./bin/playit");
console.log("Size:", stats.size);
