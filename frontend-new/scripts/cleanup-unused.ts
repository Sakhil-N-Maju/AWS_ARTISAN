#!/usr/bin/env ts-node
/**
 * Script to remove unused imports and variables
 * This is a simple cleanup script for common patterns
 */

import * as fs from 'fs';
import * as path from 'path';

const filesToFix = [
  // Pages with setScrolled unused
  'app/about/page.tsx',
  'app/admin/page.tsx',
  'app/analytics/page.tsx',
  'app/artisans/[id]/page.tsx',
  'app/artisans/page.tsx',
  'app/artisans/products/page.tsx',
  'app/cart/page.tsx',
  'app/dashboard/page.tsx',
  'app/favorites/page.tsx',
  'app/features/page.tsx',
  'app/market/page.tsx',
  'app/onboarding/page.tsx',
  'app/profile/page.tsx',
  'app/roadmap/page.tsx',
  'app/shop/page.tsx',
  'app/stories/page.tsx',
  'app/story-hub/page.tsx',
  'app/workshops/[id]/page.tsx',
  'app/workshops/page.tsx',
];

function removeUnusedSetScrolled(content: string): string {
  // Remove setScrolled from useState destructuring
  return content.replace(
    /const \[scrolled, setScrolled\] = useState\(false\);/g,
    'const [scrolled] = useState(false);'
  );
}

function removeUnusedImports(content: string): string {
  let result = content;
  
  // Remove specific unused imports
  const unusedImports = [
    'setScrolled',
    'useCallback',
    'useEffect',
    'Package',
    'Heart',
    'Eye',
    'TrendingDown',
    'Share2',
    'Pause',
    'Calendar',
    'Loader2',
    'CardDescription',
    'CardHeader',
    'CardTitle',
    'ShoppingCart',
    'Volume2',
    'MapPin',
  ];
  
  // Remove from import statements
  unusedImports.forEach(imp => {
    // Remove from middle of import list
    result = result.replace(new RegExp(`,\\s*${imp}\\s*,`, 'g'), ',');
    // Remove from end of import list
    result = result.replace(new RegExp(`,\\s*${imp}\\s*}`, 'g'), ' }');
    // Remove from start of import list
    result = result.replace(new RegExp(`{\\s*${imp}\\s*,`, 'g'), '{ ');
    // Remove if only import
    result = result.replace(new RegExp(`import\\s+{\\s*${imp}\\s*}\\s+from\\s+[^;]+;\\s*`, 'g'), '');
  });
  
  return result;
}

function fixFile(filePath: string): void {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - file not found`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const original = content;
  
  content = removeUnusedSetScrolled(content);
  content = removeUnusedImports(content);
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✓ Fixed ${filePath}`);
  } else {
    console.log(`- No changes needed for ${filePath}`);
  }
}

console.log('Starting cleanup...\n');

filesToFix.forEach(fixFile);

console.log('\nCleanup complete!');
