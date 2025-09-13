#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Files to validate
const files = [
  'style.css',
  'about.css', 
  'contact.css',
  'case-studies/case-study.css'
];

console.log('Running CSS validation with filtered output...');

let hasErrors = false;

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`\nValidating ${file}...`);
    
    try {
      const output = execSync(`npx css-validator ${file}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Filter out CSS variables warnings
      const filteredOutput = output
        .split('\n')
        .filter(line => !line.includes('Due to their dynamic nature, CSS variables are currently not statically checked'))
        .join('\n');
      
      if (filteredOutput.trim()) {
        console.log(filteredOutput);
      } else {
        console.log('✅ No errors found');
      }
      
    } catch (error) {
      const output = error.stdout || error.message;
      
      // Filter out CSS variables warnings
      const filteredOutput = output
        .split('\n')
        .filter(line => !line.includes('Due to their dynamic nature, CSS variables are currently not statically checked'))
        .join('\n');
      
      if (filteredOutput.trim()) {
        console.log(filteredOutput);
        hasErrors = true;
      } else {
        console.log('✅ No errors found (CSS variables warnings filtered)');
      }
    }
  } else {
    console.log(`⚠️  File ${file} not found, skipping...`);
  }
});

if (hasErrors) {
  console.log('\n❌ CSS validation failed');
  process.exit(1);
} else {
  console.log('\n✅ All CSS files validated successfully');
  process.exit(0);
}
