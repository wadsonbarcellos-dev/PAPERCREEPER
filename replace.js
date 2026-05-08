const fs = require('fs');
let content = fs.readFileSync('src/pages/Panel.tsx', 'utf8');

// Container Styles
content = content.replace(/rounded-\[2\.5rem\]/g, 'rounded-3xl');
content = content.replace(/rounded-\[3rem\]/g, 'rounded-3xl');
content = content.replace(/border-2 border-emerald-900/g, 'border border-emerald-900/50');
content = content.replace(/border-2 border-emerald-500\/30/g, 'border border-emerald-500/30');
content = content.replace(/border-2 border-emerald-500/g, 'border border-emerald-500');
content = content.replace(/bg-\[#0b251a\]\/80/g, 'bg-black/40 backdrop-blur-md');
content = content.replace(/bg-\[#0b251a\]/g, 'bg-black/40 backdrop-blur-md');
content = content.replace(/bg-\[#1b4332\]/g, 'bg-emerald-950/80 backdrop-blur-md');
content = content.replace(/bg-amber-950 /g, 'bg-amber-950/80 backdrop-blur-md ');

// Reduce huge paddings on lg screens 
content = content.replace(/lg:p-8/g, 'lg:p-6');
content = content.replace(/lg:p-10/g, 'lg:p-6');
content = content.replace(/p-8 /g, 'p-6 ');
content = content.replace(/"p-8"/g, '"p-6"');
content = content.replace(/space-y-8/g, 'space-y-4');
content = content.replace(/mb-8/g, 'mb-4');
content = content.replace(/mb-6/g, 'mb-4');
content = content.replace(/gap-8/g, 'gap-4');
content = content.replace(/gap-6/g, 'gap-4');

// Header Sizes in tabs
content = content.replace(/text-2xl font-black text-white/g, 'text-base font-black text-white');
content = content.replace(/text-3xl font-black text-white/g, 'text-base font-black text-white');
content = content.replace(/text-4xl font-black text-white/g, 'text-lg font-black text-white');
content = content.replace(/<Server size={32}/g, '<Server size={24}');
content = content.replace(/<Bot size={32}/g, '<Bot size={24}');
content = content.replace(/<Map size={48}/g, '<Map size={24}');

// Sizes in UI elements
content = content.replace(/w-16 h-16/g, 'w-10 h-10');
content = content.replace(/w-12 h-12/g, 'w-8 h-8');
content = content.replace(/text-\[10px\]/g, 'text-[9px]');

// Map Editor Fixes
content = content.replace(/max-w-3xl/g, 'max-w-4xl');

fs.writeFileSync('src/pages/Panel.tsx', content);
