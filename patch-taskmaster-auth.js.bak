// This script helps locate and patch the Task Master authentication mechanism
// to correctly use the x-api-key header instead of Authorization: Bearer

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper function to recursively find files
function findFiles(dir, pattern) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search directories, but skip node_modules
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(findFiles(filePath, pattern));
      }
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Main execution
function main() {
  console.log('Searching for Task Master source files...');
  
  // Try to find the node_modules location of task-master if installed
  let taskMasterPath = '';
  try {
    taskMasterPath = path.dirname(require.resolve('claude-task-master'));
    console.log(`Found Task Master at: ${taskMasterPath}`);
  } catch (e) {
    // Not installed via npm, search in current directory
    console.log('Task Master not found in node_modules, searching in current directory...');
    
    // Find potential JavaScript files that might contain authentication code
    const jsFiles = findFiles('.', /\.(js|ts)$/);
    
    // Search for files that might contain Anthropic API calls
    const potentialFiles = [];
    
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('ANTHROPIC_API_KEY') || 
          content.includes('anthropic.com') || 
          content.includes('claude') ||
          content.includes('Authorization') && content.includes('Bearer')) {
        potentialFiles.push(file);
      }
    }
    
    if (potentialFiles.length === 0) {
      console.log('Could not find any Task Master source files. Make sure you run this script in the project root.');
      return;
    }
    
    console.log('Potential files that may contain authentication code:');
    potentialFiles.forEach((file, i) => console.log(`${i+1}. ${file}`));
    
    console.log('\nExamining files for authentication patterns...');
    
    // Look for specific authentication patterns
    let patchedFiles = 0;
    
    for (const file of potentialFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Look for Authorization: Bearer pattern
      if (content.includes('Authorization') && content.includes('Bearer') && content.includes('ANTHROPIC_API_KEY')) {
        console.log(`\nFound potential auth issue in ${file}`);
        
        // Create a backup
        fs.writeFileSync(`${file}.bak`, content);
        console.log(`Created backup at ${file}.bak`);
        
        // Replace Authorization: Bearer with x-api-key
        const newContent = content
          .replace(/['"]Authorization['"]:\s*['"]Bearer\s+[^'"]*['"]/g, '"x-api-key": apiKey')
          .replace(/['"]Authorization['"]:\s*[`]Bearer\s+\$\{[^}]*\}[`]/g, '"x-api-key": apiKey')
          .replace(/headers\s*:\s*\{\s*['"]Authorization['"]:\s*['"]Bearer\s+['"]\s*\+\s*apiKey/g, 'headers: { "x-api-key": apiKey');
        
        // Write updated file
        fs.writeFileSync(file, newContent);
        console.log(`Patched ${file} to use x-api-key header instead of Authorization: Bearer`);
        patchedFiles++;
      }
    }
    
    if (patchedFiles === 0) {
      console.log('\nNo files were patched. Could not find the exact authentication pattern.');
      console.log('You may need to manually inspect and update the files listed above.');
    } else {
      console.log(`\nSuccessfully patched ${patchedFiles} files.`);
    }
  }
}

// Run the script
main(); 