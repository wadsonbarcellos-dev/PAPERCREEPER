const fs = require('fs');
const content = fs.readFileSync('src/pages/Panel.tsx', 'utf8');

const emptyM = (content.match(/<motion\.[^>]*\/>/g) || []).length;
console.log('empty motion tags:', emptyM);
const emptyDiv = (content.match(/<div[^>]*\/>/g) || []).length;
console.log('empty div tags:', emptyDiv);
