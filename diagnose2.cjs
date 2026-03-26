const cp = require('child_process');
const fs = require('fs');
try {
  const result = cp.execSync('npx vite build', {encoding: 'utf8'});
  fs.writeFileSync('output.txt', result);
} catch(e) {
  fs.writeFileSync('output.txt', '---STDOUT---\n' + e.stdout + '\n---STDERR---\n' + e.stderr);
}
