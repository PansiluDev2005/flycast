const fs = require('fs');
const path = require('path');
const srcDir = 'm:/flycast/frontend/src';

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Replace 'http://localhost:5000/api/...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/...`
  // We match the single quotes
  if (content.match(/'http:\/\/localhost:5000\/api\/[^']*'/g)) {
    content = content.replace(/'http:\/\/localhost:5000\/api\/([^']*)'/g, '`${import.meta.env.VITE_API_URL || \\'http://localhost:5000/api\\'}/$1`');
    updated = true;
  }
  
  // Replace `http://localhost:5000/api/...` -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/...`
  // We match the backticks
  if (content.match(/`http:\/\/localhost:5000\/api\/([^`]*)`/g)) {
    content = content.replace(/`http:\/\/localhost:5000\/api\/([^`]*)`/g, '`${import.meta.env.VITE_API_URL || \\'http://localhost:5000/api\\'}/$1`');
    updated = true;
  }

  // Replace 'http://localhost:5000/api' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`
  if (content.match(/'http:\/\/localhost:5000\/api'/g)) {
    content = content.replace(/'http:\/\/localhost:5000\/api'/g, '`${import.meta.env.VITE_API_URL || \\'http://localhost:5000/api\\'}`');
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  }
};

const walk = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  });
};

walk(srcDir);
