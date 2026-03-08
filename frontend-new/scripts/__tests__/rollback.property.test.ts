/**
 * Property-Based Tests for Migration Rollback Capability
 * 
 * Uses fast-check to verify universal properties across many generated inputs.
 * Minimum 100 iterations per property test.
 * 
 * Feature: frontend-migration
 * Property 27: Migration Rollback Capability
 * **Validates: Requirements 25.4**
 */

import * as fs from 'fs';
import * as path from 'path';
import * as fc from 'fast-check';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { MigrationTool } from '../migrate';

const TEST_DIR = path.join(__dirname, '../.test-pbt-rollback');
const TEST_SOURCE = path.join(TEST_DIR, 'source');
const TEST_DEST = path.join(TEST_DIR, 'dest');
const TEST_BACKUP = path.join(TEST_DIR, 'backups');

/**
 * Setup test environment with initial files
 */
function setupTestEnv(files: Array<{ path: string; content: string }>): void {
  // Clean up if exists
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }

  // Create test directories
  fs.mkdirSync(TEST_SOURCE, { recursive: true });
  fs.mkdirSync(TEST_DEST, { recursive: true });

  // Create initial files in destination
  for (const file of files) {
    const fullPath = path.join(TEST_DEST, file.path);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, file.content, 'utf-8');
  }
}

/**
 * Cleanup test environment
 */
function cleanupTestEnv(): void {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

/**
 * Get all files in a directory recursively
 */
function getAllFiles(dir: string, baseDir: string = dir): Array<{ path: string; content: string }> {
  const files: Array<{ path: string; content: string }> = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      files.push({ path: relativePath, content });
    }
  }
  
  return files;
}

/**
 * Property 27: Migration Rollback Capability
 * 
 * **Validates: Requirements 25.4**
 * 
 * For any migration phase that encounters errors or needs to be undone, the system
 * should support rolling back changes to restore the Frontend to its pre-migration
 * state for that phase.
 */
describe('Property 27: Migration Rollback Capability', () => {
  beforeEach(() => {
    // Basic cleanup before each test
    cleanupTestEnv();
  });

  afterEach(() => {
    cleanupTestEnv();
  });

  it('should restore all files to pre-migration state after rollback', async () => {
    // Arbitrary for generating initial file sets
    const fileArbitrary = fc.record({
      path: fc.constantFrom(
        'app/page.tsx',
        'components/nav.tsx',
        'lib/utils.ts',
        'app/products/page.tsx',
        'components/ui/button.tsx'
      ),
      content: fc.string({ minLength: 10, maxLength: 100 })
    });

    const fileSetArbitrary = fc.uniqueArray(fileArbitrary, {
      minLength: 1,
      maxLength: 5,
      selector: (file) => file.path
    });

    const phaseIdArbitrary = fc.constantFrom(
      'phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-10', 'phase-14'
    );

    await fc.assert(
      fc.asyncProperty(
        fileSetArbitrary,
        phaseIdArbitrary,
        async (initialFiles, phaseId) => {
          // Setup with initial files
          setupTestEnv(initialFiles);

          const tool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);

          // Create backup
          const backup = await tool.createBackup(phaseId);
          if (!backup) {
            console.error(`Failed to create backup for ${phaseId}`);
            return false;
          }

          // Verify backup contains all initial files
          if (backup.files.length !== initialFiles.length) {
            console.error(`Backup file count mismatch: ${backup.files.length} vs ${initialFiles.length}`);
            return false;
          }

          // Simulate migration by modifying files
          for (const file of initialFiles) {
            const fullPath = path.join(TEST_DEST, file.path);
            fs.writeFileSync(fullPath, file.content + '\n// MODIFIED', 'utf-8');
          }

          // Add a new file (simulating migration adding files)
          const newFilePath = path.join(TEST_DEST, 'new-file.tsx');
          fs.writeFileSync(newFilePath, 'new content', 'utf-8');

          // Rollback
          const rollbackResult = await tool.rollbackPhase(phaseId);
          
          if (!rollbackResult.success) {
            console.error(`Rollback failed for ${phaseId}:`, rollbackResult.errors);
            return false;
          }

          // Verify all original files are restored with original content
          for (const file of initialFiles) {
            const fullPath = path.join(TEST_DEST, file.path);
            
            if (!fs.existsSync(fullPath)) {
              console.error(`File ${file.path} not restored after rollback`);
              return false;
            }

            const restoredContent = fs.readFileSync(fullPath, 'utf-8');
            if (restoredContent !== file.content) {
              console.error(`File ${file.path} content not restored correctly`);
              return false;
            }
          }

          // Verify phase is marked as incomplete
          if (tool.isPhaseCompleted(phaseId)) {
            console.error(`Phase ${phaseId} still marked as completed after rollback`);
            return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve backup after rollback for potential re-rollback', async () => {
    const phaseIdArbitrary = fc.constantFrom(
      'phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-10', 'phase-14'
    );

    const fileSetArbitrary = fc.array(
      fc.record({
        path: fc.constantFrom('file1.ts', 'file2.ts', 'file3.ts'),
        content: fc.string({ minLength: 5, maxLength: 50 })
      }),
      { minLength: 1, maxLength: 3 }
    );

    await fc.assert(
      fc.asyncProperty(phaseIdArbitrary, fileSetArbitrary, async (phaseId, files) => {
        setupTestEnv(files);

        const tool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);

        // Create backup
        await tool.createBackup(phaseId);

        // Verify backup exists before rollback
        const backupBefore = tool.getBackup(phaseId);
        if (!backupBefore) {
          console.error(`Backup not found before rollback`);
          return false;
        }

        // Modify files
        for (const file of files) {
          const fullPath = path.join(TEST_DEST, file.path);
          fs.writeFileSync(fullPath, 'modified', 'utf-8');
        }

        // Rollback
        await tool.rollbackPhase(phaseId);

        // Verify backup still exists after rollback
        const backupAfter = tool.getBackup(phaseId);
        if (!backupAfter) {
          console.error(`Backup not preserved after rollback`);
          return false;
        }

        // Verify backup details are unchanged
        if (backupAfter.phaseId !== backupBefore.phaseId) {
          console.error('Backup phase ID changed');
          return false;
        }

        if (backupAfter.backupPath !== backupBefore.backupPath) {
          console.error('Backup path changed');
          return false;
        }

        // Verify backup directory still exists
        if (!fs.existsSync(backupAfter.backupPath)) {
          console.error('Backup directory deleted after rollback');
          return false;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle rollback when no backup exists', async () => {
    const phaseIdArbitrary = fc.constantFrom(
      'phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-10', 'phase-14'
    );

    await fc.assert(
      fc.asyncProperty(phaseIdArbitrary, async (phaseId) => {
        setupTestEnv([{ path: 'test.ts', content: 'test' }]);

        const tool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);

        // Try to rollback without creating backup
        const result = await tool.rollbackPhase(phaseId);

        // Verify rollback fails gracefully
        if (result.success) {
          console.error('Rollback succeeded without backup');
          return false;
        }

        // Verify error message indicates no backup
        if (result.errors.length === 0) {
          console.error('No error message for missing backup');
          return false;
        }

        const hasNoBackupError = result.errors.some(err => 
          err.includes('No backup found') || err.includes('not found')
        );

        if (!hasNoBackupError) {
          console.error('Error message does not indicate missing backup');
          return false;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should support multiple rollbacks for the same phase', async () => {
    const phaseIdArbitrary = fc.constantFrom('phase-1', 'phase-2', 'phase-3', 'phase-4');

    const modificationSequenceArbitrary = fc.array(
      fc.string({ minLength: 5, maxLength: 30 }),
      { minLength: 2, maxLength: 5 }
    );

    await fc.assert(
      fc.asyncProperty(
        phaseIdArbitrary,
        modificationSequenceArbitrary,
        async (phaseId, modifications) => {
          const initialContent = 'original content';
          setupTestEnv([{ path: 'test.ts', content: initialContent }]);

          const tool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);

          // Create backup
          await tool.createBackup(phaseId);

          // Perform multiple modifications and rollbacks
          for (const modification of modifications) {
            // Modify file
            const filePath = path.join(TEST_DEST, 'test.ts');
            fs.writeFileSync(filePath, modification, 'utf-8');

            // Verify modification
            const modifiedContent = fs.readFileSync(filePath, 'utf-8');
            if (modifiedContent !== modification) {
              console.error('Modification failed');
              return false;
            }

            // Rollback
            const result = await tool.rollbackPhase(phaseId);
            if (!result.success) {
              console.error('Rollback failed:', result.errors);
              return false;
            }

            // Verify restoration
            const restoredContent = fs.readFileSync(filePath, 'utf-8');
            if (restoredContent !== initialContent) {
              console.error('Content not restored to original');
              return false;
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should restore directory structure during rollback', async () => {
    const phaseIdArbitrary = fc.constantFrom('phase-1', 'phase-2', 'phase-3');

    const nestedFileArbitrary = fc.record({
      path: fc.constantFrom(
        'app/page.tsx',
        'app/products/page.tsx',
        'app/products/[id]/page.tsx',
        'components/ui/button.tsx',
        'lib/utils/helpers.ts'
      ),
      content: fc.string({ minLength: 10, maxLength: 50 })
    });

    const nestedFileSetArbitrary = fc.uniqueArray(nestedFileArbitrary, {
      minLength: 2,
      maxLength: 5,
      selector: (file) => file.path
    });

    await fc.assert(
      fc.asyncProperty(
        phaseIdArbitrary,
        nestedFileSetArbitrary,
        async (phaseId, files) => {
          setupTestEnv(files);

          const tool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);

          // Create backup
          await tool.createBackup(phaseId);

          // Remove some directories
          const dirsToRemove = ['app/products', 'components/ui'];
          for (const dir of dirsToRemove) {
            const fullPath = path.join(TEST_DEST, dir);
            if (fs.existsSync(fullPath)) {
              fs.rmSync(fullPath, { recursive: true, force: true });
            }
          }

          // Rollback
          const result = await tool.rollbackPhase(phaseId);
          if (!result.success) {
            console.error('Rollback failed:', result.errors);
            return false;
          }

          // Verify all files and directories are restored
          for (const file of files) {
            const fullPath = path.join(TEST_DEST, file.path);
            
            if (!fs.existsSync(fullPath)) {
              console.error(`File ${file.path} not restored`);
              return false;
            }

            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content !== file.content) {
              console.error(`File ${file.path} content incorrect`);
              return false;
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should mark phase as incomplete after rollback', async () => {
    const phaseIdArbitrary = fc.constantFrom(
      'phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-10', 'phase-14'
    );

    await fc.assert(
      fc.asyncProperty(phaseIdArbitrary, async (phaseId) => {
        setupTestEnv([{ path: 'test.ts', content: 'test' }]);

        const tool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);

        // Create backup
        await tool.createBackup(phaseId);

        // Mark phase as completed
        tool.markPhaseCompleted(phaseId);

        // Verify phase is completed
        if (!tool.isPhaseCompleted(phaseId)) {
          console.error('Phase not marked as completed');
          return false;
        }

        // Rollback
        const result = await tool.rollbackPhase(phaseId);
        if (!result.success) {
          console.error('Rollback failed:', result.errors);
          return false;
        }

        // Verify phase is now incomplete
        if (tool.isPhaseCompleted(phaseId)) {
          console.error('Phase still marked as completed after rollback');
          return false;
        }

        // Verify status persists across tool instances
        const newTool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);
        if (newTool.isPhaseCompleted(phaseId)) {
          console.error('Phase completion status not persisted after rollback');
          return false;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle rollback of phases with different file counts', async () => {
    const phaseIdArbitrary = fc.constantFrom('phase-1', 'phase-2', 'phase-3');

    const fileCountArbitrary = fc.integer({ min: 1, max: 10 });

    await fc.assert(
      fc.asyncProperty(
        phaseIdArbitrary,
        fileCountArbitrary,
        async (phaseId, fileCount) => {
          // Generate files
          const files = Array.from({ length: fileCount }, (_, i) => ({
            path: `file${i}.ts`,
            content: `content ${i}`
          }));

          setupTestEnv(files);

          const tool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);

          // Create backup
          const backup = await tool.createBackup(phaseId);

          // Verify backup file count
          if (backup.files.length !== fileCount) {
            console.error(`Backup file count mismatch: ${backup.files.length} vs ${fileCount}`);
            return false;
          }

          // Modify all files
          for (let i = 0; i < fileCount; i++) {
            const filePath = path.join(TEST_DEST, `file${i}.ts`);
            fs.writeFileSync(filePath, 'modified', 'utf-8');
          }

          // Rollback
          const result = await tool.rollbackPhase(phaseId);
          if (!result.success) {
            console.error('Rollback failed:', result.errors);
            return false;
          }

          // Verify all files restored
          if (result.restoredFiles.length !== fileCount) {
            console.error(`Restored file count mismatch: ${result.restoredFiles.length} vs ${fileCount}`);
            return false;
          }

          // Verify content
          for (let i = 0; i < fileCount; i++) {
            const filePath = path.join(TEST_DEST, `file${i}.ts`);
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content !== `content ${i}`) {
              console.error(`File ${i} content not restored`);
              return false;
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should support independent rollbacks of different phases', async () => {
    const phaseSetArbitrary = fc.uniqueArray(
      fc.constantFrom('phase-1', 'phase-2', 'phase-3', 'phase-4'),
      { minLength: 2, maxLength: 4 }
    );

    await fc.assert(
      fc.asyncProperty(phaseSetArbitrary, async (phases) => {
        // For each phase, create a separate backup at different states
        // This tests that backups are independent and can be rolled back separately
        
        const tool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);

        // Create initial state with files for first phase
        const phase1Files = [
          { path: 'file1.ts', content: 'phase1 content' },
          { path: 'file2.ts', content: 'phase1 content' }
        ];
        setupTestEnv(phase1Files);

        // Create backup for first phase
        await tool.createBackup(phases[0]);

        // Modify files (simulating phase 1 execution)
        for (const file of phase1Files) {
          const fullPath = path.join(TEST_DEST, file.path);
          fs.writeFileSync(fullPath, 'modified after phase1', 'utf-8');
        }

        // Create backup for second phase (if exists)
        if (phases.length > 1) {
          await tool.createBackup(phases[1]);
        }

        // Modify files again (simulating phase 2 execution)
        for (const file of phase1Files) {
          const fullPath = path.join(TEST_DEST, file.path);
          fs.writeFileSync(fullPath, 'modified after phase2', 'utf-8');
        }

        // Rollback the first phase
        const result = await tool.rollbackPhase(phases[0]);
        
        if (!result.success) {
          console.error(`Rollback failed for ${phases[0]}:`, result.errors);
          return false;
        }

        // Verify files are restored to phase 1 backup state
        for (const file of phase1Files) {
          const fullPath = path.join(TEST_DEST, file.path);
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content !== file.content) {
            console.error(`File ${file.path} not restored to phase1 state`);
            return false;
          }
        }

        // Verify backup for second phase still exists (if created)
        if (phases.length > 1) {
          const phase2Backup = tool.getBackup(phases[1]);
          if (!phase2Backup) {
            console.error(`Backup for ${phases[1]} was lost after rolling back ${phases[0]}`);
            return false;
          }
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle rollback with backup directory integrity', async () => {
    const phaseIdArbitrary = fc.constantFrom('phase-1', 'phase-2', 'phase-3');

    await fc.assert(
      fc.asyncProperty(phaseIdArbitrary, async (phaseId) => {
        setupTestEnv([
          { path: 'file1.ts', content: 'content1' },
          { path: 'file2.ts', content: 'content2' }
        ]);

        const tool = new MigrationTool(false, TEST_SOURCE, TEST_DEST, TEST_BACKUP);

        // Create backup
        const backup = await tool.createBackup(phaseId);

        // Verify backup directory exists and contains files
        if (!fs.existsSync(backup.backupPath)) {
          console.error('Backup directory not created');
          return false;
        }

        const backupFiles = getAllFiles(backup.backupPath);
        if (backupFiles.length === 0) {
          console.error('Backup directory is empty');
          return false;
        }

        // Verify backup files match original files
        const originalFiles = getAllFiles(TEST_DEST);
        
        // Filter out tracker and manifest files
        const filteredOriginal = originalFiles.filter(f => 
          !f.path.includes('.migration-tracker.json') &&
          !f.path.includes('.backup-manifest.json')
        );

        if (backupFiles.length !== filteredOriginal.length) {
          console.error(`Backup file count mismatch: ${backupFiles.length} vs ${filteredOriginal.length}`);
          return false;
        }

        // Modify files
        fs.writeFileSync(path.join(TEST_DEST, 'file1.ts'), 'modified1', 'utf-8');
        fs.writeFileSync(path.join(TEST_DEST, 'file2.ts'), 'modified2', 'utf-8');

        // Rollback
        const result = await tool.rollbackPhase(phaseId);
        if (!result.success) {
          console.error('Rollback failed:', result.errors);
          return false;
        }

        // Verify backup directory still intact
        if (!fs.existsSync(backup.backupPath)) {
          console.error('Backup directory removed after rollback');
          return false;
        }

        const backupFilesAfter = getAllFiles(backup.backupPath);
        if (backupFilesAfter.length !== backupFiles.length) {
          console.error('Backup files changed after rollback');
          return false;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
