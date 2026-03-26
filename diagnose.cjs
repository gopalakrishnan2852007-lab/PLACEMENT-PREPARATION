const cp = require('child_process');
try {
  console.log(cp.execSync('npx vite build', {encoding: 'utf8'}));
} catch(e) {
  console.log('---STDOUT---');
  console.log(e.stdout);
  console.log('---STDERR---');
  console.log(e.stderr);
}
