const fs = require('fs');
const content = fs.readFileSync('src/pages/Panel.tsx', 'utf8');
const lines = content.split('\n');

let brackets = 0;
let parens = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Simple heuristic, removing strings/comments is hard, but let's try a quick pass.
}
