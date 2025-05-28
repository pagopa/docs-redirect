const fs = require('fs');
const path = require('path');

function cleanJavaScript(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Rimuove Object.defineProperty(exports, "__esModule", { value: true });
  content = content.replace(/Object\.defineProperty\(exports,\s*"__esModule",\s*\{\s*value:\s*true\s*\}\);\s*\n?/g, '');
  
  // Rimuove exports.__esModule = true;
  content = content.replace(/exports\.__esModule\s*=\s*true;\s*\n?/g, '');
  
  // Rimuove linee vuote multiple
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`Cleaned: ${filePath}`);
}

// Trova tutti i file .js nella cartella dist
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js')) {
      cleanJavaScript(fullPath);
    }
  });
}

// Esegue la pulizia
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  processDirectory(distPath);
  console.log('Post-processing completed!');
} else {
  console.log('Dist directory not found');
}