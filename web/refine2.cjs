const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function exploreAndFix(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            exploreAndFix(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Remove legacy Neo-Brutalist or Semantic broken colors like 'accent-mint'
            if (content.includes('accent-mint')) {
                // Success items usually use green/emerald in shadcn/ui
                content = content.replace(/bg-accent-mint-light\/[0-9]+/g, 'bg-emerald-50');
                content = content.replace(/bg-accent-mint-light/g, 'bg-emerald-50');
                content = content.replace(/bg-accent-mint/g, 'bg-zinc-900 border border-zinc-200 text-white'); // Sometimes it was a button
                content = content.replace(/text-accent-mint/g, 'text-emerald-600');
                content = content.replace(/border-accent-mint\/[0-9]+/g, 'border-emerald-200');
                content = content.replace(/border-accent-mint/g, 'border-emerald-200');
                modified = true;
            }

            // Fix Dashboard / Matches specific broken classes pointing to bad UI logic
            if (content.includes('bg-primary-600 text-slate-900 overflow-hidden')) {
                // Announcement Ticker was illegible
                content = content.replace('bg-primary-600 text-slate-900', 'bg-zinc-900 text-white');
                modified = true;
            }

            if (content.includes('text-blue-100')) {
                content = content.replace(/text-blue-100/g, 'text-zinc-400');
                modified = true;
            }

            // Revert strange Dashboard component stat box that inherited global bg-primary-600 
            // and became Pitch Black in the new format but retained white typography logic
            if (fullPath.endsWith('Dashboard.jsx')) {
                content = content.replace('group bg-primary-600 text-white shadow-sm', 'group bg-zinc-900 text-white shadow-sm');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    });
}

exploreAndFix(srcDir);
console.log('Deep Component Cleanup Complete');
