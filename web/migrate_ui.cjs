const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function exploreAndReplace(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            exploreAndReplace(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // Mass migrate brutalist dark theme tokens to crisp Enterprise Light Mode

            // Backgrounds
            content = content.replace(/bg-slate-900\/[0-9]+/g, 'bg-white');
            content = content.replace(/bg-slate-900/g, 'bg-white');
            content = content.replace(/bg-slate-800/g, 'bg-slate-50');

            // Borders
            content = content.replace(/border-white\/[0-9]+/g, 'border-slate-200');
            content = content.replace(/border-slate-700/g, 'border-slate-200');
            content = content.replace(/border-slate-800/g, 'border-slate-200');

            // Text Colors
            content = content.replace(/text-white/g, 'text-slate-900');
            content = content.replace(/text-slate-400/g, 'text-slate-500');
            content = content.replace(/text-slate-300/g, 'text-slate-600');
            content = content.replace(/text-primary-400/g, 'text-primary-600');

            // Buttons and Shadows
            content = content.replace(/hover:bg-slate-800/g, 'hover:bg-slate-100');
            content = content.replace(/shadow-indigo-500\/20/g, 'shadow-sm');

            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}

exploreAndReplace(directoryPath);
console.log('Migration complete!');
