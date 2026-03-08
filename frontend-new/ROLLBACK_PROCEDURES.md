# Rollback Procedures

This document describes the rollback capability for the frontend migration tool. The rollback feature allows you to safely revert changes made during a migration phase if something goes wrong.

## Overview

The migration tool provides automatic backup and rollback capabilities for each migration phase. Before executing a phase, you can create a backup of the current state. If the phase encounters issues or produces unexpected results, you can rollback to the backup state.

## Key Features

- **Automatic Backup Creation**: Create a complete backup of the destination directory before executing a phase
- **Phase-Specific Rollback**: Rollback individual phases without affecting other completed phases
- **Backup Management**: List, view, and delete backups as needed
- **Smart Exclusions**: Automatically excludes `node_modules`, `.next`, `.git`, and other build artifacts from backups
- **State Tracking**: Automatically marks phases as incomplete after rollback

## Backup Creation

### Creating a Backup Before Phase Execution

Before executing a migration phase, create a backup:

```bash
npm run migrate:backup <phase-id>
```

**Example:**
```bash
npm run migrate:backup phase-1
```

This will:
1. Create a timestamped backup directory in `.migration-backup/`
2. Copy all relevant files from the destination directory
3. Record the backup in the backup manifest
4. Display the number of files backed up

### What Gets Backed Up

The backup includes:
- All source files (`.ts`, `.tsx`, `.js`, `.jsx`, etc.)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Style files (`.css`, `.scss`, etc.)
- Public assets (images, fonts, etc.)
- All subdirectories and their contents

### What Gets Excluded

The following are automatically excluded from backups:
- `node_modules/` - Dependencies (can be reinstalled)
- `.next/` - Build output (regenerated on build)
- `.git/` - Version control (managed separately)
- `.migration-backup/` - Backup directory itself
- `.migration-tracker.json` - Phase tracking file
- `.backup-manifest.json` - Backup manifest file

## Rollback Process

### Rolling Back a Phase

If a phase execution fails or produces unexpected results, rollback to the backup:

```bash
npm run migrate:rollback <phase-id>
```

**Example:**
```bash
npm run migrate:rollback phase-1
```

This will:
1. Verify that a backup exists for the phase
2. Restore all files from the backup
3. Mark the phase as incomplete in the phase tracker
4. Display the number of files restored

### Rollback Behavior

When you rollback a phase:
- **Files are restored**: All files in the backup are copied back to the destination directory
- **Phase status is reset**: The phase is marked as incomplete, allowing you to re-execute it
- **Backup is preserved**: The backup remains available for future rollbacks if needed
- **Other phases are unaffected**: Only the specified phase is rolled back

### Verification After Rollback

After rolling back, verify the state:

```bash
# Check migration status
npm run migrate:status

# Verify TypeScript compilation
npm run build

# Run tests
npm test
```

## Backup Management

### Listing All Backups

View all available backups:

```bash
npm run migrate:backups
```

This displays:
- Phase ID and name
- Backup creation timestamp
- Number of files in backup
- Backup location on disk

### Viewing Backup Details

Get detailed information about a specific backup:

```bash
npm run migrate:backup <phase-id>
```

### Deleting a Backup

Remove a backup when it's no longer needed:

```bash
npm run migrate:delete-backup <phase-id>
```

**Warning**: This permanently deletes the backup. You won't be able to rollback to this state after deletion.

## Best Practices

### 1. Always Create Backups Before Risky Operations

Create a backup before executing any phase, especially:
- Phases that modify many files
- Phases with complex transformations
- Phases that update critical configuration files

```bash
# Recommended workflow
npm run migrate:backup phase-1
npm run migrate:execute phase-1
```

### 2. Test After Each Phase

After executing a phase, test thoroughly before proceeding:

```bash
# Execute phase
npm run migrate:execute phase-1

# Test the changes
npm run build
npm test
npm run dev  # Manual testing

# If issues found, rollback
npm run migrate:rollback phase-1
```

### 3. Keep Backups Until Migration is Complete

Don't delete backups until you're confident the migration is successful:
- Keep backups for all phases until the entire migration is complete
- Test the application thoroughly before cleaning up backups
- Consider keeping backups for critical phases even after migration

### 4. Document Issues Before Rollback

Before rolling back, document:
- What went wrong
- Error messages or unexpected behavior
- Steps to reproduce the issue
- Any manual changes made

This helps when re-attempting the phase.

### 5. Clean Up After Successful Migration

Once the migration is complete and tested:

```bash
# List all backups
npm run migrate:backups

# Delete backups for completed phases
npm run migrate:delete-backup phase-1
npm run migrate:delete-backup phase-2
# ... etc
```

## Common Scenarios

### Scenario 1: Phase Execution Fails

```bash
# Create backup
npm run migrate:backup phase-3

# Execute phase
npm run migrate:execute phase-3
# ❌ Phase execution failed!

# Rollback to backup
npm run migrate:rollback phase-3
# ✓ Rollback completed successfully!

# Fix the issue, then retry
npm run migrate:execute phase-3
```

### Scenario 2: Unexpected Results After Phase

```bash
# Phase completed but results are wrong
npm run migrate:execute phase-5
# ✓ Phase completed successfully!

# Test and discover issues
npm run build
# ❌ TypeScript errors!

# Rollback to previous state
npm run migrate:rollback phase-5
# ✓ Rollback completed successfully!

# Investigate and fix the issue
```

### Scenario 3: Multiple Phase Rollback

```bash
# Rollback multiple phases in reverse order
npm run migrate:rollback phase-8
npm run migrate:rollback phase-7
npm run migrate:rollback phase-6

# Verify state
npm run migrate:status
```

### Scenario 4: Recovering from Accidental Execution

```bash
# Accidentally executed wrong phase
npm run migrate:execute phase-10
# Oops! Should have done phase-9 first

# Rollback the wrong phase
npm run migrate:rollback phase-10

# Execute the correct phase
npm run migrate:execute phase-9
```

## Troubleshooting

### Backup Creation Fails

**Problem**: Backup creation fails with permission errors

**Solution**:
- Check file permissions in the destination directory
- Ensure you have write access to the `.migration-backup/` directory
- Try running with elevated permissions if necessary

### Rollback Fails

**Problem**: Rollback fails with "No backup found" error

**Solution**:
- Verify backup exists: `npm run migrate:backups`
- Check if backup was accidentally deleted
- If no backup exists, you'll need to manually restore files from version control

### Backup Directory Too Large

**Problem**: Backup directory is consuming too much disk space

**Solution**:
- Backups exclude `node_modules`, `.next`, and `.git` by default
- Delete old backups: `npm run migrate:delete-backup <phase-id>`
- Consider using version control (git) as an additional backup mechanism

### Partial Rollback

**Problem**: Rollback completed but some files seem incorrect

**Solution**:
- Check if files were manually modified after backup creation
- Verify backup integrity: check backup directory contents
- Consider using version control to verify file states
- Re-run the rollback if needed

## Technical Details

### Backup Storage

Backups are stored in `.migration-backup/` directory:

```
.migration-backup/
├── phase-1-1234567890/     # Timestamped backup directory
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── phase-2-1234567891/
└── .backup-manifest.json   # Backup metadata
```

### Backup Manifest

The backup manifest (`.backup-manifest.json`) contains:

```json
{
  "backups": {
    "phase-1": {
      "phaseId": "phase-1",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "backupPath": ".migration-backup/phase-1-1234567890",
      "files": ["app/page.tsx", "components/nav.tsx", ...]
    }
  },
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

### Rollback Process

The rollback process:
1. Loads backup manifest
2. Verifies backup exists
3. Recursively copies files from backup to destination
4. Updates phase tracker to mark phase as incomplete
5. Reports success or errors

## Integration with Version Control

The rollback feature complements but doesn't replace version control:

### Use Rollback For:
- Quick recovery during active migration
- Testing different approaches
- Reverting recent changes within a session

### Use Version Control (Git) For:
- Long-term backup and history
- Collaboration with team members
- Tracking changes across multiple sessions
- Recovering from catastrophic failures

### Recommended Workflow:

```bash
# 1. Commit current state to git
git add .
git commit -m "Before phase-1 migration"

# 2. Create migration backup
npm run migrate:backup phase-1

# 3. Execute phase
npm run migrate:execute phase-1

# 4. Test changes
npm run build && npm test

# 5. If successful, commit to git
git add .
git commit -m "Completed phase-1 migration"

# 6. If issues, rollback and try again
npm run migrate:rollback phase-1
# Fix issues, then retry
```

## Summary

The rollback capability provides a safety net for the migration process:

- ✅ Create backups before executing phases
- ✅ Rollback quickly if issues occur
- ✅ Manage backups throughout the migration
- ✅ Clean up backups after successful migration
- ✅ Use in combination with version control for maximum safety

For questions or issues, refer to the main migration documentation or contact the development team.
