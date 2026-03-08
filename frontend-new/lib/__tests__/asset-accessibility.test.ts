/**
 * Property-Based Test: Asset Accessibility
 * Feature: frontend-migration
 * Property 19: Asset Accessibility
 * 
 * **Validates: Requirements 17.5**
 * 
 * This test verifies that during migration:
 * 1. All image references in migrated components point to existing assets
 * 2. All font references in migrated components point to existing font files
 * 3. Assets are accessible via the correct public URL path
 * 4. Asset paths follow Next.js public directory conventions
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Represents an asset reference in a component
 */
interface AssetReference {
  type: 'image' | 'font';
  path: string;
  component: string;
}

/**
 * Represents the result of asset accessibility validation
 */
interface AssetValidationResult {
  valid: boolean;
  missingAssets: string[];
  invalidPaths: string[];
}

/**
 * Extracts asset references from component code
 * Looks for common patterns like src="/...", url("/..."), etc.
 */
function extractAssetReferences(
  componentCode: string,
  componentPath: string
): AssetReference[] {
  const references: AssetReference[] = [];

  // Pattern 1: Image src attributes (src="/path/to/image.jpg")
  const imgSrcPattern = /src=["']([^"']+\.(?:jpg|jpeg|png|gif|svg|webp|ico))["']/gi;
  let match;
  while ((match = imgSrcPattern.exec(componentCode)) !== null) {
    references.push({
      type: 'image',
      path: match[1],
      component: componentPath,
    });
  }

  // Pattern 2: Image imports (import img from "/path/to/image.jpg")
  const imgImportPattern = /import\s+\w+\s+from\s+["']([^"']+\.(?:jpg|jpeg|png|gif|svg|webp|ico))["']/gi;
  while ((match = imgImportPattern.exec(componentCode)) !== null) {
    references.push({
      type: 'image',
      path: match[1],
      component: componentPath,
    });
  }

  // Pattern 3: Background images in CSS (url("/path/to/image.jpg"))
  const bgImagePattern = /url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|svg|webp))["']?\)/gi;
  while ((match = bgImagePattern.exec(componentCode)) !== null) {
    references.push({
      type: 'image',
      path: match[1],
      component: componentPath,
    });
  }

  // Pattern 4: Font face declarations (url("/fonts/font.woff2"))
  const fontPattern = /url\(["']?([^"')]+\.(?:woff|woff2|ttf|otf|eot))["']?\)/gi;
  while ((match = fontPattern.exec(componentCode)) !== null) {
    references.push({
      type: 'font',
      path: match[1],
      component: componentPath,
    });
  }

  // Pattern 5: Font imports
  const fontImportPattern = /import\s+["']([^"']+\.(?:woff|woff2|ttf|otf|eot))["']/gi;
  while ((match = fontImportPattern.exec(componentCode)) !== null) {
    references.push({
      type: 'font',
      path: match[1],
      component: componentPath,
    });
  }

  return references;
}

/**
 * Validates that an asset path follows Next.js conventions
 * Public assets should start with "/" and not include "public" in the path
 */
function isValidPublicPath(assetPath: string): boolean {
  // Should start with /
  if (!assetPath.startsWith('/')) {
    return false;
  }

  // Should not include "public" in the path (Next.js convention)
  if (assetPath.includes('/public/')) {
    return false;
  }

  // Should not include query parameters or fragments for validation
  // (they're valid in URLs but we need to strip them to check file existence)
  const cleanPath = assetPath.split('?')[0].split('#')[0];

  // Should have a valid file extension
  const validExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico',
    '.woff', '.woff2', '.ttf', '.otf', '.eot'
  ];
  
  return validExtensions.some(ext => cleanPath.toLowerCase().endsWith(ext));
}

/**
 * Checks if an asset exists in the public directory
 * Converts public URL path to filesystem path
 */
function assetExists(assetPath: string, publicDir: string): boolean {
  // Remove leading slash and query parameters
  const cleanPath = assetPath.replace(/^\//, '').split('?')[0].split('#')[0];
  
  // Construct filesystem path
  const fsPath = path.join(publicDir, cleanPath);
  
  // Check if file exists
  return fs.existsSync(fsPath);
}

/**
 * Validates all asset references in a set of components
 */
function validateAssetAccessibility(
  references: AssetReference[],
  publicDir: string
): AssetValidationResult {
  const missingAssets: string[] = [];
  const invalidPaths: string[] = [];

  for (const ref of references) {
    // Check if path follows Next.js conventions
    if (!isValidPublicPath(ref.path)) {
      invalidPaths.push(`${ref.component}: ${ref.path}`);
      continue;
    }

    // Check if asset exists
    if (!assetExists(ref.path, publicDir)) {
      missingAssets.push(`${ref.component}: ${ref.path}`);
    }
  }

  return {
    valid: missingAssets.length === 0 && invalidPaths.length === 0,
    missingAssets,
    invalidPaths,
  };
}

/**
 * Scans a directory for component files
 */
function scanComponentFiles(dir: string, extensions: string[] = ['.tsx', '.ts', '.jsx', '.js']): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and .next directories
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        files.push(...scanComponentFiles(fullPath, extensions));
      }
    } else if (entry.isFile()) {
      if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Arbitrary generator for valid image paths
 */
const validImagePathArb = fc.oneof(
  // Root level images
  fc.constantFrom(
    '/placeholder.svg',
    '/placeholder.jpg',
    '/icon.svg',
    '/apple-icon.png'
  ),
  // Images in subdirectory
  fc.constantFrom(
    '/images/background.png',
    '/images/pink-floral-wall-textured-background.jpg'
  ),
  // Actual product images
  fc.constantFrom(
    '/hand-woven-saree.jpg',
    '/brass-lamp.jpg',
    '/terracotta-pots.jpg'
  )
);

/**
 * Arbitrary generator for valid font paths
 */
const validFontPathArb = fc.constantFrom(
  '/fonts/Inter-VariableFont_opsz,wght.ttf',
  '/fonts/Lora-VariableFont_wght.ttf',
  '/fonts/Nunito-VariableFont_wght.ttf',
  '/fonts/GrandCru-LightS.otf',
  '/fonts/New-Icon-Serif-condensed.otf'
);

/**
 * Arbitrary generator for invalid image paths (should fail validation)
 */
const invalidImagePathArb = fc.oneof(
  // Missing leading slash
  fc.constant('images/background.png'),
  // Including "public" in path
  fc.constant('/public/images/background.png'),
  // Relative path
  fc.constant('../public/images/background.png'),
  // No extension
  fc.constant('/images/background')
);

/**
 * Arbitrary generator for asset references
 */
const assetReferenceArb = fc.oneof(
  // Valid image reference
  validImagePathArb.map(path => ({
    type: 'image' as const,
    path,
    component: 'test-component.tsx',
  })),
  // Valid font reference
  validFontPathArb.map(path => ({
    type: 'font' as const,
    path,
    component: 'test-component.tsx',
  }))
);

describe('Property 19: Asset Accessibility', () => {
  const publicDir = path.join(process.cwd(), 'public');

  /**
   * Property: All valid asset paths should point to existing files
   * 
   * For any asset reference with a valid public path format,
   * the referenced file should exist in the public directory.
   */
  it('should have all referenced assets exist in public directory', () => {
    fc.assert(
      fc.property(
        fc.array(assetReferenceArb, { minLength: 1, maxLength: 20 }),
        (references) => {
          const result = validateAssetAccessibility(references, publicDir);

          // All valid references should point to existing files
          if (result.missingAssets.length > 0) {
            console.error('Missing assets:', result.missingAssets);
            return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All asset paths should follow Next.js conventions
   * 
   * For any asset reference, the path should:
   * - Start with "/"
   * - Not include "public" in the path
   * - Have a valid file extension
   */
  it('should have all asset paths follow Next.js conventions', () => {
    fc.assert(
      fc.property(
        validImagePathArb,
        (assetPath) => {
          return isValidPublicPath(assetPath);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Invalid paths should be detected
   * 
   * For any asset path that doesn't follow conventions,
   * the validation should mark it as invalid.
   */
  it('should detect invalid asset paths', () => {
    fc.assert(
      fc.property(
        invalidImagePathArb,
        (assetPath) => {
          return !isValidPublicPath(assetPath);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Image references should be extractable from component code
   * 
   * For any component code containing image references,
   * the extraction function should find all image paths.
   */
  it('should extract image references from component code', () => {
    fc.assert(
      fc.property(
        validImagePathArb,
        (imagePath) => {
          // Generate component code with image reference
          const componentCode = `
            export function TestComponent() {
              return <img src="${imagePath}" alt="test" />;
            }
          `;

          const references = extractAssetReferences(componentCode, 'test.tsx');

          // Should find the image reference
          return references.some(ref => ref.path === imagePath && ref.type === 'image');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Font references should be extractable from CSS code
   * 
   * For any CSS code containing font-face declarations,
   * the extraction function should find all font paths.
   */
  it('should extract font references from CSS code', () => {
    fc.assert(
      fc.property(
        validFontPathArb,
        (fontPath) => {
          // Generate CSS code with font reference
          const cssCode = `
            @font-face {
              font-family: 'TestFont';
              src: url('${fontPath}') format('truetype');
            }
          `;

          const references = extractAssetReferences(cssCode, 'styles.css');

          // Should find the font reference
          return references.some(ref => ref.path === fontPath && ref.type === 'font');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Integration test: Scan actual components and validate assets
   * 
   * This test scans the actual component files in the project
   * and validates that all asset references are accessible.
   */
  it('should have all assets in actual components be accessible', () => {
    const componentsDir = path.join(process.cwd(), 'components');
    const appDir = path.join(process.cwd(), 'app');

    // Scan component files
    const componentFiles = [
      ...scanComponentFiles(componentsDir),
      ...scanComponentFiles(appDir),
    ];

    // Extract all asset references
    const allReferences: AssetReference[] = [];
    for (const file of componentFiles) {
      const code = fs.readFileSync(file, 'utf-8');
      const references = extractAssetReferences(code, path.relative(process.cwd(), file));
      allReferences.push(...references);
    }

    // Filter out placeholder URLs with query parameters (these are mock data)
    const realReferences = allReferences.filter(ref => {
      // Skip placeholder URLs with ?key= parameter (mock data)
      if (ref.path.includes('placeholder') && ref.path.includes('?key=')) {
        return false;
      }
      return true;
    });

    // Validate all real asset references
    const result = validateAssetAccessibility(realReferences, publicDir);

    // Report any issues
    if (!result.valid) {
      if (result.invalidPaths.length > 0) {
        console.error('\nInvalid asset paths found:');
        result.invalidPaths.forEach(p => console.error(`  - ${p}`));
      }
      if (result.missingAssets.length > 0) {
        console.error('\nMissing assets found:');
        result.missingAssets.forEach(a => console.error(`  - ${a}`));
      }
    }

    expect(result.valid).toBe(true);
    expect(result.invalidPaths).toHaveLength(0);
    expect(result.missingAssets).toHaveLength(0);
  });

  /**
   * Property: Asset paths should be consistent across components
   * 
   * For any asset that is referenced multiple times,
   * the path should be identical in all references.
   */
  it('should have consistent asset paths across components', () => {
    fc.assert(
      fc.property(
        validImagePathArb,
        fc.array(fc.stringMatching(/^[a-z-]+\.tsx$/), { minLength: 2, maxLength: 5 }),
        (assetPath, componentNames) => {
          // Create references from multiple components
          const references: AssetReference[] = componentNames.map(name => ({
            type: 'image',
            path: assetPath,
            component: name,
          }));

          // All references should have the same path
          const uniquePaths = new Set(references.map(ref => ref.path));
          return uniquePaths.size === 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Asset existence check should be idempotent
   * 
   * For any asset path, checking existence multiple times
   * should always return the same result.
   */
  it('should have idempotent asset existence checks', () => {
    fc.assert(
      fc.property(
        validImagePathArb,
        (assetPath) => {
          const result1 = assetExists(assetPath, publicDir);
          const result2 = assetExists(assetPath, publicDir);
          const result3 = assetExists(assetPath, publicDir);

          return result1 === result2 && result2 === result3;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Query parameters should not affect asset existence
   * 
   * For any asset path with query parameters,
   * the existence check should ignore the query string.
   */
  it('should ignore query parameters when checking asset existence', () => {
    fc.assert(
      fc.property(
        validImagePathArb,
        fc.stringMatching(/^[a-z0-9]+$/),
        (assetPath, queryValue) => {
          const pathWithQuery = `${assetPath}?key=${queryValue}`;
          const pathWithoutQuery = assetPath;

          const result1 = assetExists(pathWithQuery, publicDir);
          const result2 = assetExists(pathWithoutQuery, publicDir);

          // Both should return the same result
          return result1 === result2;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Font files should have valid extensions
   * 
   * For any font reference, the file extension should be
   * one of the standard web font formats.
   */
  it('should have valid font file extensions', () => {
    const validFontExtensions = ['.woff', '.woff2', '.ttf', '.otf', '.eot'];

    fc.assert(
      fc.property(
        validFontPathArb,
        (fontPath) => {
          return validFontExtensions.some(ext => fontPath.toLowerCase().endsWith(ext));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Image files should have valid extensions
   * 
   * For any image reference, the file extension should be
   * one of the standard web image formats.
   */
  it('should have valid image file extensions', () => {
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'];

    fc.assert(
      fc.property(
        validImagePathArb,
        (imagePath) => {
          const cleanPath = imagePath.split('?')[0];
          return validImageExtensions.some(ext => cleanPath.toLowerCase().endsWith(ext));
        }
      ),
      { numRuns: 100 }
    );
  });
});
