import { execSync } from 'child_process';
try {
  execSync('npx tsx server.ts', { encoding: 'utf8' });
} catch (e) {
  console.log('STDERR:');
  console.log(e.stderr);
}
