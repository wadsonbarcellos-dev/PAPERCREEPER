import fs from 'fs';
const content = fs.readFileSync('src/pages/Panel.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const count = (line.match(/`/g) || []).length;
  if (count % 2 !== 0) {
    console.log(`Line ${i + 1}: ${line}`);
  }
}
