const fs = require('fs');
const content = fs.readFileSync('src/pages/Panel.tsx', 'utf8');

const lines = content.split('\n');
let stack = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  // naive strip strings
  line = line.replace(/`([^`\\]|\\.)*`/g, '``');
  line = line.replace(/"([^"\\]|\\.)*"/g, '""');
  line = line.replace(/'([^'\\]|\\.)*'/g, "''");
  
  if (line.includes('/>')) {
     line = line.replace(/<[A-Za-z0-9_\.]+(\s+[^>]*?)?\/>/g, ''); // strip self closing
  }

  // strip known self closing missing slash
  line = line.replace(/<(input|img|br|hr|CreeperPaper)[^>]*>/g, '');

  const tagRegex = /<\/?([a-zA-Z0-9_\.]+)[^>]*>/g;
  let m;
  while ((m = tagRegex.exec(line)) !== null) {
      if (m[0].endsWith('/>')) continue;

      const isClosing = m[0].startsWith('</');
      const tagName = m[1];

      if (isClosing) {
          if (stack.length === 0) {
              console.log(`Error at line ${i + 1}: extra closing tag </${tagName}>`);
              continue;
          }
          const top = stack.pop();
          if (top.tagName !== tagName) {
              console.log(`Error at line ${i + 1}: expected </${top.tagName}> but found </${tagName}>. Opened at line ${top.line}`);
          }
      } else {
          stack.push({ tagName, line: i + 1 });
      }
  }
}
if (stack.length > 0) {
    console.log("Unclosed tags:", stack);
}
