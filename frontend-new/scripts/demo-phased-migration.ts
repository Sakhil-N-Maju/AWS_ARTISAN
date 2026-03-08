/**
 * Demonstration of phased migration support
 * 
 * This script demonstrates the key features:
 * - Phase tracking
 * - Dependency checking
 * - Preventing re-migration
 * - Progress tracking
 */

import * as path from 'path';
import * as fs from 'fs';
import { MigrationTool } from './migrate';

const sourceDir = path.join(__dirname, '../../frontend');
const destDir = path.join(__dirname, '..');
const backupDir = path.join(__dirname, '../.migration-backup');

async function demonstratePhasedMigration() {
  console.log('\n=== Phased Migration Support Demonstration ===\n');
  
  const migrationTool = new MigrationTool(true, sourceDir, destDir, backupDir);
  
  // 1. Show all phases
  console.log('1. All Migration Phases:');
  const phases = migrationTool.getPhases();
  console.log(`   Total phases: ${phases.length}`);
  phases.slice(0, 3).forEach(phase => {
    console.log(`   - ${phase.id}: ${phase.name} (${phase.tasks.length} tasks)`);
  });
  console.log(`   ... and ${phases.length - 3} more phases\n`);
  
  // 2. Show initial status
  console.log('2. Initial Migration Status:');
  let summary = migrationTool.getProgressSummary();
  console.log(`   Progress: ${summary.completed}/${summary.total} (${summary.percentComplete}%)`);
  console.log(`   Ready: ${summary.ready} | Blocked: ${summary.blocked}\n`);
  
  // 3. Execute Phase 1
  console.log('3. Executing Phase 1 (Foundation):');
  const phase1Result = await migrationTool.executePhase('phase-1');
  console.log(`   Success: ${phase1Result.success}`);
  console.log(`   Completed tasks: ${phase1Result.completedTasks.length}`);
  console.log(`   Phase marked as completed: ${migrationTool.isPhaseCompleted('phase-1')}\n`);
  
  // 4. Try to execute Phase 1 again (should be skipped)
  console.log('4. Attempting to re-execute Phase 1:');
  const phase1Retry = await migrationTool.executePhase('phase-1');
  console.log(`   Skipped: ${phase1Retry.skipped}`);
  console.log(`   Reason: ${phase1Retry.skipReason}\n`);
  
  // 5. Try to execute Phase 2 (should succeed - dependencies met)
  console.log('5. Executing Phase 2 (Context Providers):');
  const phase2Result = await migrationTool.executePhase('phase-2');
  console.log(`   Success: ${phase2Result.success}`);
  console.log(`   Skipped: ${phase2Result.skipped}`);
  console.log(`   Dependencies met: ${migrationTool.areDependenciesCompleted('phase-2')}\n`);
  
  // 6. Try to execute Phase 5 (should be blocked - dependencies not met)
  console.log('6. Attempting to execute Phase 5 (Basic Pages):');
  const phase5Result = await migrationTool.executePhase('phase-5');
  console.log(`   Success: ${phase5Result.success}`);
  console.log(`   Skipped: ${phase5Result.skipped}`);
  console.log(`   Reason: ${phase5Result.skipReason}`);
  if (phase5Result.errors.length > 0) {
    console.log(`   Error: ${phase5Result.errors[0]}\n`);
  }
  
  // 7. Show updated progress
  console.log('7. Updated Migration Status:');
  summary = migrationTool.getProgressSummary();
  console.log(`   Progress: ${summary.completed}/${summary.total} (${summary.percentComplete}%)`);
  console.log(`   Ready: ${summary.ready} | Blocked: ${summary.blocked}\n`);
  
  // 8. Show ready phases
  console.log('8. Phases Ready to Execute:');
  const ready = migrationTool.getReadyPhases();
  ready.slice(0, 3).forEach(phase => {
    console.log(`   - ${phase.id}: ${phase.name}`);
  });
  console.log();
  
  // 9. Show blocked phases
  console.log('9. Blocked Phases (sample):');
  const blocked = migrationTool.getBlockedPhases();
  blocked.slice(0, 3).forEach(phase => {
    const incompleteDeps = phase.dependencies?.filter(
      depId => !migrationTool.isPhaseCompleted(depId)
    ) || [];
    console.log(`   - ${phase.id}: ${phase.name} (needs: ${incompleteDeps.join(', ')})`);
  });
  console.log();
  
  // 10. Force execute Phase 5
  console.log('10. Force executing Phase 5 (ignoring dependencies):');
  const phase5Force = await migrationTool.executePhase('phase-5', true);
  console.log(`   Success: ${phase5Force.success}`);
  console.log(`   Skipped: ${phase5Force.skipped}`);
  console.log(`   Completed: ${migrationTool.isPhaseCompleted('phase-5')}\n`);
  
  // 11. Final summary
  console.log('11. Final Summary:');
  summary = migrationTool.getProgressSummary();
  console.log(`   Total phases: ${summary.total}`);
  console.log(`   Completed: ${summary.completed}`);
  console.log(`   Ready: ${summary.ready}`);
  console.log(`   Blocked: ${summary.blocked}`);
  console.log(`   Progress: ${summary.percentComplete}%\n`);
  
  console.log('=== Demonstration Complete ===\n');
  console.log('Key Features Demonstrated:');
  console.log('✓ Phase tracking with persistent storage');
  console.log('✓ Dependency checking before execution');
  console.log('✓ Prevention of re-migration (unless forced)');
  console.log('✓ Progress tracking and reporting');
  console.log('✓ Ready/blocked phase identification');
  console.log('✓ Force execution to override checks\n');
}

// Run demonstration
demonstratePhasedMigration().catch(console.error);
