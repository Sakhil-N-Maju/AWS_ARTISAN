/**
 * Unit tests for phased migration support
 * Tests phase tracking, execution, and completion status
 */

import * as fs from 'fs';
import * as path from 'path';
import { MigrationTool } from '../migrate';

describe('Phased Migration Support', () => {
  let migrationTool: MigrationTool;
  const testDir = path.join(__dirname, 'test-migration');
  const sourceDir = path.join(testDir, 'source');
  const destDir = path.join(testDir, 'dest');
  const backupDir = path.join(testDir, 'backup');
  const trackerPath = path.join(destDir, '.migration-tracker.json');

  beforeEach(() => {
    // Create test directories
    [testDir, sourceDir, destDir, backupDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Clean up tracker file if it exists
    if (fs.existsSync(trackerPath)) {
      fs.unlinkSync(trackerPath);
    }

    migrationTool = new MigrationTool(false, sourceDir, destDir, backupDir);
  });

  afterEach(() => {
    // Clean up test directories
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Phase Initialization', () => {
    it('should initialize all migration phases', () => {
      const phases = migrationTool.getPhases();
      expect(phases.length).toBeGreaterThan(0);
      expect(phases.some(p => p.id === 'phase-1')).toBe(true);
      expect(phases.some(p => p.id === 'phase-14')).toBe(true);
    });

    it('should have correct phase structure', () => {
      const phase1 = migrationTool.getPhase('phase-1');
      expect(phase1).toBeDefined();
      expect(phase1?.name).toBe('Foundation');
      expect(phase1?.tasks).toContain('1.1');
      expect(phase1?.dependencies).toBeUndefined();
    });

    it('should have correct phase dependencies', () => {
      const phase2 = migrationTool.getPhase('phase-2');
      expect(phase2).toBeDefined();
      expect(phase2?.dependencies).toContain('phase-1');
    });
  });

  describe('Phase Status Tracking', () => {
    it('should initialize all phases as not completed', () => {
      const statuses = migrationTool.getAllPhaseStatuses();
      Object.values(statuses).forEach(status => {
        expect(status.completed).toBe(false);
      });
    });

    it('should mark a phase as completed', () => {
      migrationTool.markPhaseCompleted('phase-1');
      const status = migrationTool.getPhaseStatus('phase-1');
      expect(status?.completed).toBe(true);
      expect(status?.completedAt).toBeDefined();
    });

    it('should persist phase completion to disk', () => {
      migrationTool.markPhaseCompleted('phase-1');
      
      // Create new instance to verify persistence
      const newTool = new MigrationTool(false, sourceDir, destDir, backupDir);
      const status = newTool.getPhaseStatus('phase-1');
      expect(status?.completed).toBe(true);
    });

    it('should mark a phase as incomplete', () => {
      migrationTool.markPhaseCompleted('phase-1');
      expect(migrationTool.isPhaseCompleted('phase-1')).toBe(true);
      
      migrationTool.markPhaseIncomplete('phase-1');
      expect(migrationTool.isPhaseCompleted('phase-1')).toBe(false);
    });

    it('should store errors with phase completion', () => {
      const errors = ['Error 1', 'Error 2'];
      migrationTool.markPhaseCompleted('phase-1', errors);
      
      const status = migrationTool.getPhaseStatus('phase-1');
      expect(status?.errors).toEqual(errors);
    });
  });

  describe('Dependency Checking', () => {
    it('should return true for phases with no dependencies', () => {
      expect(migrationTool.areDependenciesCompleted('phase-1')).toBe(true);
      expect(migrationTool.areDependenciesCompleted('phase-14')).toBe(true);
    });

    it('should return false when dependencies are not completed', () => {
      expect(migrationTool.areDependenciesCompleted('phase-2')).toBe(false);
    });

    it('should return true when all dependencies are completed', () => {
      migrationTool.markPhaseCompleted('phase-1');
      expect(migrationTool.areDependenciesCompleted('phase-2')).toBe(true);
    });

    it('should handle multiple dependencies', () => {
      const phase12 = migrationTool.getPhase('phase-12');
      expect(phase12?.dependencies?.length).toBeGreaterThan(1);
      
      // None completed
      expect(migrationTool.areDependenciesCompleted('phase-12')).toBe(false);
      
      // Some completed
      migrationTool.markPhaseCompleted('phase-6');
      expect(migrationTool.areDependenciesCompleted('phase-12')).toBe(false);
      
      // All completed
      phase12?.dependencies?.forEach(depId => {
        migrationTool.markPhaseCompleted(depId);
      });
      expect(migrationTool.areDependenciesCompleted('phase-12')).toBe(true);
    });
  });

  describe('Phase Execution', () => {
    it('should skip already completed phases', async () => {
      migrationTool.markPhaseCompleted('phase-1');
      
      const result = await migrationTool.executePhase('phase-1');
      expect(result.skipped).toBe(true);
      expect(result.skipReason).toBe('Phase already completed');
    });

    it('should execute phase with force flag even if completed', async () => {
      migrationTool.markPhaseCompleted('phase-1');
      
      const result = await migrationTool.executePhase('phase-1', true);
      expect(result.skipped).toBe(false);
      expect(result.success).toBe(true);
    });

    it('should skip phases with incomplete dependencies', async () => {
      const result = await migrationTool.executePhase('phase-2');
      expect(result.skipped).toBe(true);
      expect(result.skipReason).toBe('Dependencies not completed');
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should execute phase when dependencies are completed', async () => {
      migrationTool.markPhaseCompleted('phase-1');
      
      const result = await migrationTool.executePhase('phase-2');
      expect(result.skipped).toBe(false);
      expect(result.success).toBe(true);
    });

    it('should execute phase with force flag even if dependencies incomplete', async () => {
      const result = await migrationTool.executePhase('phase-2', true);
      expect(result.skipped).toBe(false);
      expect(result.success).toBe(true);
    });

    it('should return error for non-existent phase', async () => {
      const result = await migrationTool.executePhase('phase-999');
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Phase phase-999 not found');
    });

    it('should mark phase as completed after successful execution', async () => {
      migrationTool.markPhaseCompleted('phase-1');
      
      expect(migrationTool.isPhaseCompleted('phase-2')).toBe(false);
      await migrationTool.executePhase('phase-2');
      expect(migrationTool.isPhaseCompleted('phase-2')).toBe(true);
    });
  });

  describe('Phase Queries', () => {
    beforeEach(() => {
      // Set up some completed phases
      migrationTool.markPhaseCompleted('phase-1');
      migrationTool.markPhaseCompleted('phase-2');
    });

    it('should get ready phases', () => {
      const ready = migrationTool.getReadyPhases();
      expect(ready.some(p => p.id === 'phase-3')).toBe(true);
      expect(ready.some(p => p.id === 'phase-4')).toBe(true);
      expect(ready.some(p => p.id === 'phase-10')).toBe(true);
      expect(ready.some(p => p.id === 'phase-14')).toBe(true);
    });

    it('should get blocked phases', () => {
      const blocked = migrationTool.getBlockedPhases();
      expect(blocked.some(p => p.id === 'phase-5')).toBe(true);
      expect(blocked.some(p => p.id === 'phase-12')).toBe(true);
    });

    it('should get completed phases', () => {
      const completed = migrationTool.getCompletedPhases();
      expect(completed.length).toBe(2);
      expect(completed.some(p => p.id === 'phase-1')).toBe(true);
      expect(completed.some(p => p.id === 'phase-2')).toBe(true);
    });

    it('should not include completed phases in ready list', () => {
      const ready = migrationTool.getReadyPhases();
      expect(ready.some(p => p.id === 'phase-1')).toBe(false);
      expect(ready.some(p => p.id === 'phase-2')).toBe(false);
    });
  });

  describe('Progress Summary', () => {
    it('should calculate progress correctly with no completed phases', () => {
      const summary = migrationTool.getProgressSummary();
      expect(summary.completed).toBe(0);
      expect(summary.percentComplete).toBe(0);
      expect(summary.total).toBeGreaterThan(0);
    });

    it('should calculate progress correctly with some completed phases', () => {
      migrationTool.markPhaseCompleted('phase-1');
      migrationTool.markPhaseCompleted('phase-2');
      
      const summary = migrationTool.getProgressSummary();
      expect(summary.completed).toBe(2);
      expect(summary.percentComplete).toBeGreaterThan(0);
      expect(summary.percentComplete).toBeLessThan(100);
    });

    it('should calculate progress correctly with all phases completed', () => {
      migrationTool.getPhases().forEach(phase => {
        migrationTool.markPhaseCompleted(phase.id);
      });
      
      const summary = migrationTool.getProgressSummary();
      expect(summary.completed).toBe(summary.total);
      expect(summary.percentComplete).toBe(100);
    });

    it('should count ready and blocked phases correctly', () => {
      migrationTool.markPhaseCompleted('phase-1');
      
      const summary = migrationTool.getProgressSummary();
      expect(summary.ready).toBeGreaterThan(0);
      expect(summary.blocked).toBeGreaterThan(0);
      expect(summary.completed + summary.ready + summary.blocked).toBe(summary.total);
    });
  });

  describe('Phase Tracker Reset', () => {
    it('should reset all phase statuses', () => {
      // Complete some phases
      migrationTool.markPhaseCompleted('phase-1');
      migrationTool.markPhaseCompleted('phase-2');
      expect(migrationTool.getCompletedPhases().length).toBe(2);
      
      // Reset
      migrationTool.resetPhaseTracker();
      expect(migrationTool.getCompletedPhases().length).toBe(0);
    });

    it('should persist reset to disk', () => {
      migrationTool.markPhaseCompleted('phase-1');
      migrationTool.resetPhaseTracker();
      
      // Create new instance to verify persistence
      const newTool = new MigrationTool(false, sourceDir, destDir, backupDir);
      expect(newTool.getCompletedPhases().length).toBe(0);
    });
  });

  describe('Prevent Re-migration', () => {
    it('should prevent re-migration of completed phases by default', async () => {
      migrationTool.markPhaseCompleted('phase-1');
      
      const result = await migrationTool.executePhase('phase-1');
      expect(result.skipped).toBe(true);
      expect(result.completedTasks.length).toBe(0);
    });

    it('should allow re-migration with force flag', async () => {
      migrationTool.markPhaseCompleted('phase-1');
      
      const result = await migrationTool.executePhase('phase-1', true);
      expect(result.skipped).toBe(false);
      expect(result.completedTasks.length).toBeGreaterThan(0);
    });
  });
});
