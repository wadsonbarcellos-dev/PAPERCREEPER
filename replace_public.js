const fs = require('fs');

const files = [
  'src/pages/Home.tsx',
  'src/pages/Store.tsx',
  'src/pages/Profile.tsx',
  'src/components/Navbar.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Harmonize rounded corners unifying to rounded-3xl
  content = content.replace(/rounded-\[2\.5rem\]/g, 'rounded-3xl');
  content = content.replace(/rounded-\[2rem\]/g, 'rounded-3xl');
  content = content.replace(/rounded-\[1\.5rem\]/g, 'rounded-2xl');

  fs.writeFileSync(file, content);
}
