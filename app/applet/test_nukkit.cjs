const { execSync } = require('child_process');
try {
  execSync('curl --http1.1 -sL -A "Mozilla/5.0" "https://ci.opencollab.dev/job/NukkitX/job/Nukkit/job/master/lastSuccessfulBuild/artifact/target/nukkit-1.0-SNAPSHOT.jar" -o test.jar', {stdio: 'inherit'});
  const sz = require('fs').statSync('test.jar').size;
  console.log("Size", sz);
} catch(e) { console.error(e) }
