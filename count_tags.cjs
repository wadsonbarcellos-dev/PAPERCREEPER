const fs = require('fs');
const content = fs.readFileSync('src/pages/Panel.tsx', 'utf8');
const openM = (content.match(/<motion\./g) || []).length;
const closeM = (content.match(/<\/motion\./g) || []).length;
console.log('motion count:', openM, closeM);

const openDiv = (content.match(/<div/g) || []).length;
const closeDiv = (content.match(/<\/div/g) || []).length;
console.log('div count:', openDiv, closeDiv);

const openSec = (content.match(/<section/g) || []).length;
const closeSec = (content.match(/<\/section/g) || []).length;
console.log('section count:', openSec, closeSec);

const openAuth = (content.match(/<Auth/g) || []).length;
const closeAuth = (content.match(/<\/Auth/g) || []).length;
console.log('Auth count:', openAuth, closeAuth);
