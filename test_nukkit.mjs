import { execSync } from 'child_process';
try {
  execSync('curl --http1.1 -sL -A "Mozilla/5.0" "https://ci.opencollab.dev/job/NukkitX/job/Nukkit/job/master/lastSuccessfulBuild/artifact/target/nukkit-1.0-SNAPSHOT.jar" -o test.jar', {stdio: 'inherit'});
  import('fs').then(fs => console.log("Size", fs.statSync('test.jar').size));
} catch(e) { console.error(e) }
