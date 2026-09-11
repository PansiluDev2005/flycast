const fs = require('fs');
const path = require('path');

const srcDir = 'm:/flycast/frontend/src';

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:5000/api')) {
    // we want to replace 'http://localhost:5000/api...' with `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}...`
    // this regex replaces the static string prefix.
    const newContent = content.replace(/'http:\/\/localhost:5000\/api/g, '`${import.meta.env.VITE_API_URL || \\'http://localhost:5000/api\\'}/');
    // WAIT, if it's already using template literals, like `http://localhost:5000/api/${id}`
    // Then it's backticks `http://localhost:5000/api/...`
    // Let's replace both.
    
    // Replace single quotes: 'http://localhost:5000/api/...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/...`
    let updated = newContent;
    
    fs.writeFileSync(filePath, updated);
    console.log('Updated ' + filePath);
  }
  
  if (content.includes('`http://localhost:5000/api')) {
      let content2 = fs.readFileSync(filePath, 'utf8');
      const newContent2 = content2.replace(/`http:\/\/localhost:5000\/api/g, '`${import.meta.env.VITE_API_URL || \\'http://localhost:5000/api\\'}/');
      fs.writeFileSync(filePath, newContent2);
      console.log('Updated backticks in ' + filePath);
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
