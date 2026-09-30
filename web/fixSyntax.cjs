const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Home.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Looking string: <div className="w-full pl-0 sm:pl-16 flex justify-between items-end>
content = content.replace('<div className="w-full pl-0 sm:pl-16 flex justify-between items-end>', '<div className="w-full pl-0 sm:pl-16 flex justify-between items-end">');

fs.writeFileSync(filePath, content);
console.log('Fixed syntax error!');
