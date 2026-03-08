/**
 * Unit tests for rollback capability
 * Tests backup creation, rollback functionality, and backup management
 */

import * as fs from 'fs';
import * as path from 'path';
import { MigrationTool } from '../migrate';

describe('Rollback Capability', () => {
  const testDir = path.join(__dirname, 'test-rollback');
  const sourceDir = path.join(testDir, 'source');
  const destDir = path.join(testDir, 'dest');
  const backupDir = path.join(testDir, 'backup');
  
  let migrationTool: MigrationTool;

  beforeEach(() => {
    // Clean up test directories
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }

    // Create test directories
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(destDir, { recursive: true });
    fs.mkdirSync(backupDir, { recursive: true });

    // Create test files in destination
    fs.writeFileSync(path.join(destDir, 'file1.txt'), 'original content 1');
    fs.writeFileSync(path.join(destDir, 'file2.txt'), 'original content 2');
    fs.mkdirSync(path.join(destDir, 'subdir'), { recursive: true });
    fs.writeFileSync(path.join(destDir, 'subdir', 'file3.txt'), 'original content 3');

    // Initialize migration tool
    migrationTool = new MigrationTool(false, sourceDir, destDir, backupDir);
  });

  afterEach(() => {
    // Clean up test directories
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Backup Creation', () => {
    it('should create a backup for a phase', async () => {
      const backup = await migrationTool.createBackup('phase-1');

      expect(backup).toBeDefined();
      expect(backup.phaseId).toBe('phase-1');
      expect(backup.files.length).toBeGreaterThan(0);
      expect(fs.existsSync(backup.backupPath)).toBe(true);
    });

    it('should backup all files in destination directory', async () => {
      const backup = await migrationTool.createBackup('phase-1');

      // Check that all original files are backed up
      expect(backup.files).toContain('file1.txt');
      expect(backup.files).toContain('file2.txt');
      expect(backup.files).toContain(path.join('subdir', 'file3.txt'));
    });

    it('should save backup to manifest', async () => {
      await migrationTool.createBackup('phase-1');

      const backups = migrationTool.getAllBackups();
      expect(backups['phase-1']).toBeDefined();
      expect(backups['phase-1'].phaseId).toBe('phase-1');
    });

    it('should throw error for non-existent phase', async () => {
      await expect(migrationTool.createBackup('invalid-phase')).rejects.toThrow();
    });
  });

  describe('Rollback Functionality', () => {
    it('should rollback a phase to its backup state', async () => {
      // Create backup
      await migrationTool.createBackup('phase-1');

      // Modify files
      fs.writeFileSync(path.join(destDir, 'file1.txt'), 'modified content 1');
      fs.writeFileSync(path.join(destDir, 'file2.txt'), 'modified content 2');
      fs.writeFileSync(path.join(destDir, 'new-file.txt'), 'new content');

      // Rollback
      const result = await migrationTool.rollbackPhase('phase-1');

      expect(result.success).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.restoredFiles.length).toBeGreaterThan(0);

      // Verify files are restored
      const file1Content = fs.readFileSync(path.join(destDir, 'file1.txt'), 'utf-8');
      const file2Content = fs.readFileSync(path.join(destDir, 'file2.txt'), 'utf-8');
      
      expect(file1Content).toBe('original content 1');
      expect(file2Content).toBe('original content 2');
    });

    it('should mark phase as incomplete after rollback', async () => {
      // Create backup and mark phase as completed
      await migrationTool.createBackup('phase-1');
      migrationTool.markPhaseCompleted('phase-1');
      
      expect(migrationTool.isPhaseCompleted('phase-1')).toBe(true);

      // Rollback
      await migrationTool.rollbackPhase('phase-1');

      // Verify phase is marked as incomplete
      expect(migrationTool.isPhaseCompleted('phase-1')).toBe(false);
    });

    it('should return error when no backup exists', async () => {
      const result = await migrationTool.rollbackPhase('phase-1');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('No backup found');
    });

    it('should restore directory structure', async () => {
      // Create backup
      await migrationTool.createBackup('phase-1');

      // Remove subdirectory
      fs.rmSync(path.join(destDir, 'subdir'), { recursive: true, force: true });

      // Rollback
      const result = await migrationTool.rollbackPhase('phase-1');

      expect(result.success).toBe(true);
      expect(fs.existsSync(path.join(destDir, 'subdir'))).toBe(true);
      expect(fs.existsSync(path.join(destDir, 'subdir', 'file3.txt'))).toBe(true);
    });
  });

  describe('Backup Management', () => {
    it('should retrieve backup information', async () => {
      await migrationTool.createBackup('phase-1');

      const backup = migrationTool.getBackup('phase-1');

      expect(backup).toBeDefined();
      expect(backup?.phaseId).toBe('phase-1');
      expect(backup?.files.length).toBeGreaterThan(0);
    });

    it('should list all backups', async () => {
      await migrationTool.createBackup('phase-1');
      await migrationTool.createBackup('phase-2');

      const backups = migrationTool.getAllBackups();

      expect(Object.keys(backups).length).toBe(2);
      expect(backups['phase-1']).toBeDefined();
      expect(backups['phase-2']).toBeDefined();
    });

    it('should delete a backup', async () => {
      const backup = await migrationTool.createBackup('phase-1');
      
      expect(fs.existsSync(backup.backupPath)).toBe(true);

      const success = await migrationTool.deleteBackup('phase-1');

      expect(success).toBe(true);
      expect(fs.existsSync(backup.backupPath)).toBe(false);
      expect(migrationTool.getBackup('phase-1')).toBeNull();
    });

    it('should return false when deleting non-existent backup', async () => {
      const success = await migrationTool.deleteBackup('phase-1');

      expect(success).toBe(false);
    });
  });

  describe('Backup Exclusions', () => {
    it('should not backup node_modules directory', async () => {
      // Create node_modules directory
      fs.mkdirSync(path.join(destDir, 'node_modules'), { recursive: true });
      fs.writeFileSync(path.join(destDir, 'node_modules', 'package.json'), '{}');

      const backup = await migrationTool.createBackup('phase-1');

      // Verify node_modules is not in backup
      const hasNodeModules = backup.files.some(file => file.includes('node_modules'));
      expect(hasNodeModules).toBe(false);
    });

    it('should not backup .next directory', async () => {
      // Create .next directory
      fs.mkdirSync(path.join(destDir, '.next'), { recursive: true });
      fs.writeFileSync(path.join(destDir, '.next', 'build.json'), '{}');

      const backup = await migrationTool.createBackup('phase-1');

      // Verify .next is not in backup
      const hasNext = backup.files.some(file => file.includes('.next'));
      expect(hasNext).toBe(false);
    });

    it('should not backup .git directory', async () => {
      // Create .git directory
      fs.mkdirSync(path.join(destDir, '.git'), { recursive: true });
      fs.writeFileSync(path.join(destDir, '.git', 'config'), '');

      const backup = await migrationTool.createBackup('phase-1');

      // Verify .git is not in backup
      const hasGit = backup.files.some(file => file.includes('.git'));
      expect(hasGit).toBe(false);
    });
  });
});
