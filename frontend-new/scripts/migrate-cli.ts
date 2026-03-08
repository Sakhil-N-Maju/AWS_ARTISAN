#!/usr/bin/env node
/**
 * CLI tool for phased migration
 * 
 * Usage:
 *   npm run migrate:status              - Show migration status
 *   npm run migrate:list                - List all phases
 *   npm run migrate:execute <phase-id>  - Execute a specific phase
 *   npm run migrate:reset               - Reset all phase tracking
 */

import * as path from 'path';
import { MigrationTool } from './migrate';

const sourceDir = path.join(__dirname, '../../frontend');
const destDir = path.join(__dirname, '..');
const backupDir = path.join(__dirname, '../.migration-backup');

const migrationTool = new MigrationTool(false, sourceDir, destDir, backupDir);

function printPhaseStatus(phaseId: string): void {
  const phase = migrationTool.getPhase(phaseId);
  const status = migrationTool.getPhaseStatus(phaseId);
  
  if (!phase || !status) {
    console.log(`Phase ${phaseId} not found`);
    return;
  }

  const statusIcon = status.completed ? '✓' : '○';
  const statusText = status.completed ? 'Completed' : 'Not Started';
  
  console.log(`${statusIcon} ${phase.id}: ${phase.name}`);
  console.log(`   ${phase.description}`);
  console.log(`   Status: ${statusText}`);
  
  if (status.completed && status.completedAt) {
    console.log(`   Completed: ${status.completedAt.toLocaleString()}`);
  }
  
  if (status.errors && status.errors.length > 0) {
    console.log(`   Errors: ${status.errors.length}`);
  }
  
  if (phase.dependencies && phase.dependencies.length > 0) {
    console.log(`   Dependencies: ${phase.dependencies.join(', ')}`);
  }
  
  console.log(`   Tasks: ${phase.tasks.join(', ')}`);
  console.log();
}

function showStatus(): void {
  console.log('\n=== Migration Status ===\n');
  
  const summary = migrationTool.getProgressSummary();
  console.log(`Progress: ${summary.completed}/${summary.total} phases (${summary.percentComplete}%)`);
  console.log(`Ready: ${summary.ready} | Blocked: ${summary.blocked}\n`);
  
  console.log('Completed Phases:');
  const completed = migrationTool.getCompletedPhases();
  if (completed.length === 0) {
    console.log('  None\n');
  } else {
    completed.forEach(phase => {
      console.log(`  ✓ ${phase.id}: ${phase.name}`);
    });
    console.log();
  }
  
  console.log('Ready to Execute:');
  const ready = migrationTool.getReadyPhases();
  if (ready.length === 0) {
    console.log('  None\n');
  } else {
    ready.forEach(phase => {
      console.log(`  → ${phase.id}: ${phase.name}`);
    });
    console.log();
  }
  
  console.log('Blocked (waiting for dependencies):');
  const blocked = migrationTool.getBlockedPhases();
  if (blocked.length === 0) {
    console.log('  None\n');
  } else {
    blocked.forEach(phase => {
      const deps = phase.dependencies?.filter(
        depId => !migrationTool.isPhaseCompleted(depId)
      ) || [];
      console.log(`  ○ ${phase.id}: ${phase.name} (needs: ${deps.join(', ')})`);
    });
    console.log();
  }
}

function listPhases(): void {
  console.log('\n=== All Migration Phases ===\n');
  
  const phases = migrationTool.getPhases();
  phases.forEach(phase => {
    printPhaseStatus(phase.id);
  });
}

async function executePhase(phaseId: string, force: boolean = false): Promise<void> {
  console.log(`\n=== Executing Phase: ${phaseId} ===\n`);
  
  const phase = migrationTool.getPhase(phaseId);
  if (!phase) {
    console.error(`Error: Phase ${phaseId} not found`);
    process.exit(1);
  }
  
  console.log(`Phase: ${phase.name}`);
  console.log(`Description: ${phase.description}`);
  console.log(`Tasks: ${phase.tasks.join(', ')}\n`);
  
  // Check if already completed
  if (migrationTool.isPhaseCompleted(phaseId) && !force) {
    console.log('⚠️  Phase already completed. Use --force to re-execute.\n');
    return;
  }
  
  // Check dependencies
  if (!migrationTool.areDependenciesCompleted(phaseId) && !force) {
    const incompleteDeps = phase.dependencies?.filter(
      depId => !migrationTool.isPhaseCompleted(depId)
    ) || [];
    console.error(`❌ Cannot execute: Dependencies not completed: ${incompleteDeps.join(', ')}`);
    console.error('   Use --force to override dependency check.\n');
    process.exit(1);
  }
  
  console.log('Executing phase...\n');
  
  const result = await migrationTool.executePhase(phaseId, force);
  
  if (result.skipped) {
    console.log(`⚠️  Phase skipped: ${result.skipReason}\n`);
    return;
  }
  
  if (result.success) {
    console.log('✓ Phase completed successfully!\n');
    console.log(`Completed tasks: ${result.completedTasks.join(', ')}\n`);
  } else {
    console.error('❌ Phase execution failed!\n');
    if (result.errors.length > 0) {
      console.error('Errors:');
      result.errors.forEach(error => console.error(`  - ${error}`));
      console.error();
    }
    process.exit(1);
  }
}

function resetTracker(): void {
  console.log('\n=== Resetting Migration Tracker ===\n');
  console.log('⚠️  This will mark all phases as not completed.\n');
  
  migrationTool.resetPhaseTracker();
  console.log('✓ Migration tracker reset successfully!\n');
}

async function createBackup(phaseId: string): Promise<void> {
  console.log(`\n=== Creating Backup for Phase: ${phaseId} ===\n`);
  
  const phase = migrationTool.getPhase(phaseId);
  if (!phase) {
    console.error(`Error: Phase ${phaseId} not found`);
    process.exit(1);
  }
  
  try {
    const backup = await migrationTool.createBackup(phaseId);
    console.log(`\n✓ Backup created successfully!`);
    console.log(`  Phase: ${phase.name}`);
    console.log(`  Files backed up: ${backup.files.length}`);
    console.log(`  Backup location: ${backup.backupPath}\n`);
  } catch (error) {
    console.error(`\n❌ Failed to create backup: ${error}\n`);
    process.exit(1);
  }
}

async function rollbackPhase(phaseId: string): Promise<void> {
  console.log(`\n=== Rolling Back Phase: ${phaseId} ===\n`);
  
  const phase = migrationTool.getPhase(phaseId);
  if (!phase) {
    console.error(`Error: Phase ${phaseId} not found`);
    process.exit(1);
  }
  
  const backup = migrationTool.getBackup(phaseId);
  if (!backup) {
    console.error(`Error: No backup found for phase ${phaseId}`);
    console.error('Create a backup before executing the phase to enable rollback.\n');
    process.exit(1);
  }
  
  console.log(`Phase: ${phase.name}`);
  console.log(`Backup from: ${backup.timestamp.toLocaleString()}`);
  console.log(`Files to restore: ${backup.files.length}\n`);
  
  const result = await migrationTool.rollbackPhase(phaseId);
  
  if (result.success) {
    console.log(`\n✓ Rollback completed successfully!`);
    console.log(`  Restored files: ${result.restoredFiles.length}`);
    console.log(`  Phase ${phaseId} marked as incomplete\n`);
  } else {
    console.error(`\n❌ Rollback failed!`);
    if (result.errors.length > 0) {
      console.error('Errors:');
      result.errors.forEach(error => console.error(`  - ${error}`));
    }
    console.error();
    process.exit(1);
  }
}

function listBackups(): void {
  console.log('\n=== Backup Status ===\n');
  
  const backups = migrationTool.getAllBackups();
  const backupCount = Object.keys(backups).length;
  
  if (backupCount === 0) {
    console.log('No backups found.\n');
    return;
  }
  
  console.log(`Total backups: ${backupCount}\n`);
  
  for (const [phaseId, backup] of Object.entries(backups)) {
    const phase = migrationTool.getPhase(phaseId);
    console.log(`Phase: ${phaseId}${phase ? ` (${phase.name})` : ''}`);
    console.log(`  Created: ${backup.timestamp.toLocaleString()}`);
    console.log(`  Files: ${backup.files.length}`);
    console.log(`  Location: ${backup.backupPath}`);
    console.log();
  }
}

async function deleteBackup(phaseId: string): Promise<void> {
  console.log(`\n=== Deleting Backup for Phase: ${phaseId} ===\n`);
  
  const backup = migrationTool.getBackup(phaseId);
  if (!backup) {
    console.error(`Error: No backup found for phase ${phaseId}\n`);
    process.exit(1);
  }
  
  const success = await migrationTool.deleteBackup(phaseId);
  
  if (success) {
    console.log(`✓ Backup deleted successfully!\n`);
  } else {
    console.error(`❌ Failed to delete backup\n`);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

(async () => {
  try {
    switch (command) {
      case 'status':
        showStatus();
        break;
      
      case 'list':
        listPhases();
        break;
      
      case 'execute': {
        const phaseId = args[1];
        const force = args.includes('--force');
        
        if (!phaseId) {
          console.error('Error: Phase ID required');
          console.error('Usage: npm run migrate:execute <phase-id> [--force]');
          process.exit(1);
        }
        
        await executePhase(phaseId, force);
        break;
      }
      
      case 'reset':
        resetTracker();
        break;
      
      case 'backup': {
        const phaseId = args[1];
        
        if (!phaseId) {
          console.error('Error: Phase ID required');
          console.error('Usage: npm run migrate:backup <phase-id>');
          process.exit(1);
        }
        
        await createBackup(phaseId);
        break;
      }
      
      case 'rollback': {
        const phaseId = args[1];
        
        if (!phaseId) {
          console.error('Error: Phase ID required');
          console.error('Usage: npm run migrate:rollback <phase-id>');
          process.exit(1);
        }
        
        await rollbackPhase(phaseId);
        break;
      }
      
      case 'backups':
        listBackups();
        break;
      
      case 'delete-backup': {
        const phaseId = args[1];
        
        if (!phaseId) {
          console.error('Error: Phase ID required');
          console.error('Usage: npm run migrate:delete-backup <phase-id>');
          process.exit(1);
        }
        
        await deleteBackup(phaseId);
        break;
      }
      
      default:
        console.log('\nMigration CLI Tool\n');
        console.log('Usage:');
        console.log('  npm run migrate:status                  - Show migration status');
        console.log('  npm run migrate:list                    - List all phases');
        console.log('  npm run migrate:execute <phase-id>      - Execute a specific phase');
        console.log('  npm run migrate:execute <phase-id> --force - Force execute (ignore dependencies/completion)');
        console.log('  npm run migrate:reset                   - Reset all phase tracking');
        console.log('  npm run migrate:backup <phase-id>       - Create backup for a phase');
        console.log('  npm run migrate:rollback <phase-id>     - Rollback a phase to its backup');
        console.log('  npm run migrate:backups                 - List all backups');
        console.log('  npm run migrate:delete-backup <phase-id> - Delete backup for a phase\n');
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
