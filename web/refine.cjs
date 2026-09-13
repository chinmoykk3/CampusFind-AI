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

            // 1. Fix broken contrast: bg-primary-600 + text-slate-900 -> bg-primary-600 + text-white
            if (content.includes('bg-primary-600') && content.includes('text-slate-900')) {
                const regex = /bg-primary-600([^>]*?)text-slate-900/g;
                content = content.replace(regex, 'bg-primary-600$1text-white');
                modified = true;
            }

            // Reverse direction if text-slate-900 came first
            if (content.includes('text-slate-900') && content.includes('bg-primary-600')) {
                const regex2 = /text-slate-900([^>]*?)bg-primary-600/g;
                content = content.replace(regex2, 'text-white$1bg-primary-600');
                modified = true;
            }

            // 2. Fix Home.jsx layout sprawl
            if (fullPath.endsWith('Home.jsx')) {
                content = content.replace('gap-24 sm:gap-32', 'gap-16 sm:gap-20');
                content = content.replace('pt-10 pb-20', 'pt-8 pb-16');
                content = content.replace('max-w-7xl mx-auto px-4', 'max-w-6xl mx-auto px-4');
                modified = true;
            }

            // 3. Fix Dashboard massive padding
            if (fullPath.endsWith('Dashboard.jsx')) {
                content = content.replace('max-w-7xl', 'max-w-5xl'); // Compact professional view
                content = content.replace('gap-8', 'gap-6');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    });
}

exploreAndFix(srcDir);
console.log('Refinement Complete');
