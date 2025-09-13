#!/usr/bin/env node

const pa11y = require('pa11y');

// URLs to test
const urls = [
  'http://localhost:8000',
  'http://localhost:8000/about.html',
  'http://localhost:8000/portfolio.html',
  'http://localhost:8000/contact.html'
];

async function runPa11yTests() {
  console.log('Running Pa11y accessibility tests...');
  
  for (const url of urls) {
    console.log(`\nTesting ${url}...`);
    
    try {
      const result = await pa11y(url, {
        chromeLaunchArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 30000,
        wait: 1000
      });
      
      if (result.issues.length === 0) {
        console.log(`✅ ${url} - No accessibility issues found`);
      } else {
        console.log(`⚠️  ${url} - Found ${result.issues.length} issues:`);
        result.issues.forEach(issue => {
          console.log(`   - ${issue.message}`);
        });
      }
      
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`);
    }
  }
  
  console.log('\n✅ Pa11y accessibility tests completed');
}

runPa11yTests().catch(console.error);
