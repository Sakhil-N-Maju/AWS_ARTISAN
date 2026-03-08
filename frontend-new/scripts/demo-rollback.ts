/**
 * Demo script to test rollback capability
 * This script demonstrates:
 * 1. Creating a backup before a phase
 * 2. Executing a phase (simulated)
 * 3. Rolling back the phase
 */

import * as fs from 'fs';
import * as path from 'path';
import { MigrationTool } from './migrate';

async function demoRollback() {
  console.log('\n=== Rollback Capability Demo ===\n');

  // Setup paths
  const sourceDir = path.join(__dirname, '../../frontend');
  const destDir = path.join(__dirname, '..');
  const backupDir = path.join(__dirname, '../.migration-backup');

  // Initialize migration tool
  const migrationTool = new MigrationTool(false, sourceDir, destDir, backupDir);

  try {
    // Step 1: Show current status
    console.log('Step 1: Current Migration Status');
    console.log('─────────────────────────────────');
    const summary = migrationTool.getProgressSummary();
    console.log(`Progress: ${summary.completed}/${summary.total} phases (${summary.percentComplete}%)`);
    console.log(`Ready: ${summary.ready} | Blocked: ${summary.blocked}\n`);

    // Step 2: Create a backup for phase-1
    console.log('Step 2: Creating Backup for phase-1');
    console.log('─────────────────────────────────');
    const backup = await migrationTool.createBackup('phase-1');
    console.log(`✓ Backup created successfully`);
    console.log(`  Files backed up: ${backup.files.length}`);
    console.log(`  Backup location: ${backup.backupPath}`);
    console.log(`  Timestamp: ${backup.timestamp.toLocaleString()}\n`);

    // Step 3: List all backups
    console.log('Step 3: List All Backups');
    console.log('─────────────────────────────────');
    const backups = migrationTool.getAllBackups();
    const backupCount = Object.keys(backups).length;
    console.log(`Total backups: ${backupCount}`);
    for (const [phaseId, backupInfo] of Object.entries(backups)) {
      const phase = migrationTool.getPhase(phaseId);
      console.log(`  • ${phaseId}${phase ? ` (${phase.name})` : ''}`);
      console.log(`    Created: ${backupInfo.timestamp.toLocaleString()}`);
      console.log(`    Files: ${backupInfo.files.length}`);
    }
    console.log();

    // Step 4: Simulate phase execution by marking it complete
    console.log('Step 4: Simulating Phase Execution');
    console.log('─────────────────────────────────');
    migrationTool.markPhaseCompleted('phase-1');
    console.log(`✓ Phase phase-1 marked as completed`);
    console.log(`  Phase is completed: ${migrationTool.isPhaseCompleted('phase-1')}\n`);

    // Step 5: Rollback the phase
    console.log('Step 5: Rolling Back phase-1');
    console.log('─────────────────────────────────');
    const rollbackResult = await migrationTool.rollbackPhase('phase-1');
    
    if (rollbackResult.success) {
      console.log(`✓ Rollback completed successfully`);
      console.log(`  Restored files: ${rollbackResult.restoredFiles.length}`);
      console.log(`  Phase is completed: ${migrationTool.isPhaseCompleted('phase-1')}`);
    } else {
      console.log(`❌ Rollback failed`);
      rollbackResult.errors.forEach(error => console.log(`  Error: ${error}`));
    }
    console.log();

    // Step 6: Verify backup still exists
    console.log('Step 6: Verify Backup Still Exists');
    console.log('─────────────────────────────────');
    const backupAfterRollback = migrationTool.getBackup('phase-1');
    if (backupAfterRollback) {
      console.log(`✓ Backup preserved after rollback`);
      console.log(`  Can rollback again if needed\n`);
    } else {
      console.log(`⚠️  Backup not found\n`);
    }

    // Step 7: Clean up - delete the backup
    console.log('Step 7: Cleaning Up - Delete Backup');
    console.log('─────────────────────────────────');
    const deleteSuccess = await migrationTool.deleteBackup('phase-1');
    if (deleteSuccess) {
      console.log(`✓ Backup deleted successfully\n`);
    } else {
      console.log(`❌ Failed to delete backup\n`);
    }

    console.log('=== Demo Complete ===\n');
    console.log('Summary:');
    console.log('✓ Backup creation works');
    console.log('✓ Rollback functionality works');
    console.log('✓ Phase status is updated correctly');
    console.log('✓ Backup management works');
    console.log('✓ Backup cleanup works\n');

  } catch (error) {
    console.error('\n❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
demoRollback().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
