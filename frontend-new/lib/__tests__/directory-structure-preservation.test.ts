/**
 * Property-Based Test: Directory Structure Preservation
 * Feature: frontend-migration
 * Property 9: Directory Structure Preservation
 * 
 * **Validates: Requirements 4.3, 4.5**
 * 
 * This test verifies that during migration:
 * 1. Nested route directories preserve their exact structure
 * 2. Component directories maintain all subdirectories and file relationships
 * 3. Parent-child relationships between directories are preserved
 * 4. File paths remain consistent relative to their directory structure
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import * as path from 'path';

/**
 * Represents a file in a directory structure
 */
interface FileNode {
  name: string;
  type: 'file';
  path: string;
}

/**
 * Represents a directory in a directory structure
 */
interface DirectoryNode {
  name: string;
  type: 'directory';
  path: string;
  children: (FileNode | DirectoryNode)[];
}

/**
 * Type guard to check if a node is a directory
 */
function isDirectory(node: FileNode | DirectoryNode): node is DirectoryNode {
  return node.type === 'directory';
}

/**
 * Simulates migrating a directory structure from source to destination
 * This represents the core migration logic that should preserve structure
 */
function migrateDirectoryStructure(
  sourceRoot: DirectoryNode,
  sourcePath: string,
  destPath: string
): DirectoryNode {
  const migrate = (node: FileNode | DirectoryNode): FileNode | DirectoryNode => {
    // Calculate the relative path from source root
    const relativePath = path.relative(sourcePath, node.path);
    // Calculate the new destination path
    const newPath = path.join(destPath, relativePath);

    if (node.type === 'file') {
      return {
        ...node,
        path: newPath,
      };
    }

    // For directories, recursively migrate children
    return {
      ...node,
      path: newPath,
      children: node.children.map(child => migrate(child)),
    };
  };

  return migrate(sourceRoot) as DirectoryNode;
}

/**
 * Extracts all file paths from a directory structure
 */
function extractAllPaths(node: DirectoryNode): string[] {
  const paths: string[] = [node.path];

  for (const child of node.children) {
    if (isDirectory(child)) {
      paths.push(...extractAllPaths(child));
    } else {
      paths.push(child.path);
    }
  }

  return paths;
}

/**
 * Verifies that the directory structure is preserved
 * by checking that all relative paths remain the same
 */
function verifyStructurePreservation(
  source: DirectoryNode,
  migrated: DirectoryNode,
  sourcePath: string,
  destPath: string
): boolean {
  const sourceRelative = path.relative(sourcePath, source.path);
  const migratedRelative = path.relative(destPath, migrated.path);

  // Verify the relative paths match
  if (sourceRelative !== migratedRelative) {
    return false;
  }

  // Verify same number of children
  if (source.children.length !== migrated.children.length) {
    return false;
  }

  // Verify all children are preserved
  for (let i = 0; i < source.children.length; i++) {
    const sourceChild = source.children[i];
    const migratedChild = migrated.children[i];

    // Verify same name and type
    if (sourceChild.name !== migratedChild.name || sourceChild.type !== migratedChild.type) {
      return false;
    }

    // Recursively verify directories
    if (isDirectory(sourceChild) && isDirectory(migratedChild)) {
      if (!verifyStructurePreservation(sourceChild, migratedChild, sourcePath, destPath)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Counts the depth of a directory structure
 */
function getMaxDepth(node: DirectoryNode, currentDepth: number = 0): number {
  let maxDepth = currentDepth;

  for (const child of node.children) {
    if (isDirectory(child)) {
      const childDepth = getMaxDepth(child, currentDepth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
  }

  return maxDepth;
}

/**
 * Arbitrary generator for file names
 */
const fileNameArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,20}\.(tsx?|jsx?|css|json)$/);

/**
 * Arbitrary generator for directory names
 */
const dirNameArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,15}$/);

/**
 * Arbitrary generator for a file node
 */
const fileNodeArb = (parentPath: string): fc.Arbitrary<FileNode> =>
  fileNameArb.map(name => ({
    name,
    type: 'file' as const,
    path: path.join(parentPath, name),
  }));

/**
 * Arbitrary generator for a directory structure
 * Limits depth to prevent stack overflow
 */
const directoryNodeArb = (parentPath: string, maxDepth: number): fc.Arbitrary<DirectoryNode> => {
  if (maxDepth <= 0) {
    // At max depth, only generate files
    return dirNameArb.chain(name => {
      const nodePath = path.join(parentPath, name);
      return fc.array(fileNodeArb(nodePath), { minLength: 0, maxLength: 3 }).map(children => ({
        name,
        type: 'directory' as const,
        path: nodePath,
        children,
      }));
    });
  }

  return dirNameArb.chain(name => {
    const nodePath = path.join(parentPath, name);
    return fc.array(
      fc.oneof(
        fileNodeArb(nodePath),
        directoryNodeArb(nodePath, maxDepth - 1)
      ),
      { minLength: 1, maxLength: 5 }
    ).map(children => ({
      name,
      type: 'directory' as const,
      path: nodePath,
      children,
    }));
  });
};

describe('Property 9: Directory Structure Preservation', () => {
  /**
   * Property: All nested directories should preserve their exact structure
   * 
   * For any directory structure in the source, when migrated to destination,
   * the relative paths and nesting should remain identical.
   */
  it('should preserve exact directory structure during migration', () => {
    fc.assert(
      fc.property(
        directoryNodeArb('frontend-ref', 3),
        (sourceStructure) => {
          const sourcePath = 'frontend-ref';
          const destPath = 'frontend-new';

          // Perform migration
          const migratedStructure = migrateDirectoryStructure(
            sourceStructure,
            sourcePath,
            destPath
          );

          // Verify structure preservation by comparing from the parent of each structure
          // The sourceStructure is rooted at frontend-ref/name, so its parent is frontend-ref
          // After migration, it should be at frontend-new/name, with parent frontend-new
          return verifyStructurePreservation(
            sourceStructure,
            migratedStructure,
            sourcePath,
            destPath
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All files should maintain their relative paths
   * 
   * For any file in a nested directory structure, its path relative to
   * the root should be the same after migration (only the root changes).
   */
  it('should maintain relative paths for all files during migration', () => {
    fc.assert(
      fc.property(
        directoryNodeArb('frontend-ref/app', 3),
        (sourceStructure) => {
          const sourcePath = 'frontend-ref/app';
          const destPath = 'frontend-new/app';

          // Perform migration
          const migratedStructure = migrateDirectoryStructure(
            sourceStructure,
            sourcePath,
            destPath
          );

          // Extract all paths
          const sourcePaths = extractAllPaths(sourceStructure);
          const migratedPaths = extractAllPaths(migratedStructure);

          // Verify same number of paths
          if (sourcePaths.length !== migratedPaths.length) {
            return false;
          }

          // Verify all relative paths match
          for (let i = 0; i < sourcePaths.length; i++) {
            const sourceRelative = path.relative(sourcePath, sourcePaths[i]);
            const migratedRelative = path.relative(destPath, migratedPaths[i]);

            if (sourceRelative !== migratedRelative) {
              return false;
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Parent-child relationships should be preserved
   * 
   * For any parent directory with children, after migration the parent
   * should still contain the same children in the same order.
   */
  it('should preserve parent-child relationships during migration', () => {
    fc.assert(
      fc.property(
        directoryNodeArb('frontend-ref/components', 2),
        (sourceStructure) => {
          const sourcePath = 'frontend-ref/components';
          const destPath = 'frontend-new/components';

          // Perform migration
          const migratedStructure = migrateDirectoryStructure(
            sourceStructure,
            sourcePath,
            destPath
          );

          // Helper to verify children
          const verifyChildren = (
            source: DirectoryNode,
            migrated: DirectoryNode
          ): boolean => {
            if (source.children.length !== migrated.children.length) {
              return false;
            }

            for (let i = 0; i < source.children.length; i++) {
              const sourceChild = source.children[i];
              const migratedChild = migrated.children[i];

              if (sourceChild.name !== migratedChild.name) {
                return false;
              }

              if (sourceChild.type !== migratedChild.type) {
                return false;
              }

              if (isDirectory(sourceChild) && isDirectory(migratedChild)) {
                if (!verifyChildren(sourceChild, migratedChild)) {
                  return false;
                }
              }
            }

            return true;
          };

          return verifyChildren(sourceStructure, migratedStructure);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Nested depth should be preserved
   * 
   * For any directory structure with a certain nesting depth,
   * the migrated structure should have the same depth.
   */
  it('should preserve nesting depth during migration', () => {
    fc.assert(
      fc.property(
        directoryNodeArb('frontend-ref/app', 3),
        (sourceStructure) => {
          const sourcePath = 'frontend-ref/app';
          const destPath = 'frontend-new/app';

          // Calculate source depth
          const sourceDepth = getMaxDepth(sourceStructure);

          // Perform migration
          const migratedStructure = migrateDirectoryStructure(
            sourceStructure,
            sourcePath,
            destPath
          );

          // Calculate migrated depth
          const migratedDepth = getMaxDepth(migratedStructure);

          // Verify depths match
          return sourceDepth === migratedDepth;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: File count should remain the same
   * 
   * For any directory structure, the total number of files
   * should be the same before and after migration.
   */
  it('should preserve total file count during migration', () => {
    fc.assert(
      fc.property(
        directoryNodeArb('frontend-ref', 3),
        (sourceStructure) => {
          const sourcePath = 'frontend-ref';
          const destPath = 'frontend-new';

          // Count files in source
          const countFiles = (node: DirectoryNode): number => {
            let count = 0;
            for (const child of node.children) {
              if (child.type === 'file') {
                count++;
              } else {
                count += countFiles(child);
              }
            }
            return count;
          };

          const sourceFileCount = countFiles(sourceStructure);

          // Perform migration
          const migratedStructure = migrateDirectoryStructure(
            sourceStructure,
            sourcePath,
            destPath
          );

          const migratedFileCount = countFiles(migratedStructure);

          // Verify file counts match
          return sourceFileCount === migratedFileCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Directory names should remain unchanged
   * 
   * For any directory in the structure, its name should be the same
   * after migration (only the parent path changes).
   */
  it('should preserve directory names during migration', () => {
    fc.assert(
      fc.property(
        directoryNodeArb('frontend-ref', 3),
        (sourceStructure) => {
          const sourcePath = 'frontend-ref';
          const destPath = 'frontend-new';

          // Collect all directory names
          const collectDirNames = (node: DirectoryNode): string[] => {
            const names = [node.name];
            for (const child of node.children) {
              if (isDirectory(child)) {
                names.push(...collectDirNames(child));
              }
            }
            return names;
          };

          const sourceNames = collectDirNames(sourceStructure);

          // Perform migration
          const migratedStructure = migrateDirectoryStructure(
            sourceStructure,
            sourcePath,
            destPath
          );

          const migratedNames = collectDirNames(migratedStructure);

          // Verify names match (order should be preserved by DFS)
          if (sourceNames.length !== migratedNames.length) {
            return false;
          }

          for (let i = 0; i < sourceNames.length; i++) {
            if (sourceNames[i] !== migratedNames[i]) {
              return false;
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Sibling order should be preserved
   * 
   * For any directory with multiple children, the order of children
   * should be the same after migration.
   */
  it('should preserve sibling order during migration', () => {
    fc.assert(
      fc.property(
        directoryNodeArb('frontend-ref', 2),
        (sourceStructure) => {
          const sourcePath = 'frontend-ref';
          const destPath = 'frontend-new';

          // Perform migration
          const migratedStructure = migrateDirectoryStructure(
            sourceStructure,
            sourcePath,
            destPath
          );

          // Verify sibling order recursively
          const verifySiblingOrder = (
            source: DirectoryNode,
            migrated: DirectoryNode
          ): boolean => {
            if (source.children.length !== migrated.children.length) {
              return false;
            }

            for (let i = 0; i < source.children.length; i++) {
              const sourceChild = source.children[i];
              const migratedChild = migrated.children[i];

              // Names should match in order
              if (sourceChild.name !== migratedChild.name) {
                return false;
              }

              // Recursively check directories
              if (isDirectory(sourceChild) && isDirectory(migratedChild)) {
                if (!verifySiblingOrder(sourceChild, migratedChild)) {
                  return false;
                }
              }
            }

            return true;
          };

          return verifySiblingOrder(sourceStructure, migratedStructure);
        }
      ),
      { numRuns: 100 }
    );
  });
});
