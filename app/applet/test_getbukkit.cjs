const { execSync } = require('child_process');
try {
  execSync('curl --http1.1 -sL -A "Mozilla/5.0" "https://cdn.getbukkit.org/spigot/spigot-1.21.1.jar" -o test.jar', {stdio: 'inherit'});
  const sz = require('fs').statSync('test.jar').size;
  console.log("Size", sz);
} catch(e) { console.error(e) }
