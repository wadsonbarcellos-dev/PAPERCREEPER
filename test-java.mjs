import { execSync } from "child_process";
try {
  execSync("./bin/java_runtime/bin/java -version", { stdio: "inherit" });
} catch (e) {
  console.log("Error:", e.message);
}
