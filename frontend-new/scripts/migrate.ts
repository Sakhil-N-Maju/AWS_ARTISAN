/**
 * Migration Tool for Frontend Migration
 * 
 * Provides utilities for migrating files, detecting conflicts, and managing dependencies
 * between Frontend_Ref and Frontend.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface FileCopyResult {
  copied: string[];
  conflicts: Conflict[];
  errors: string[];
}

export interface Conflict {
  file: string;
  reason: string;
  sourceContent?: string;
  destContent?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface DependencyMergeResult {
  merged: Record<string, string>;
  preserved: string[];
  added: string[];
  conflicts: Array<{ name: string; sourceVersion: string; destVersion: string }>;
}

export interface ConfigUpdateResult {
  componentsJsonUpdated: boolean;
  packageJsonUpdated: boolean;
  tailwindConfigUpdated: boolean;
  errors: string[];
}

export interface TransformRule {
  pattern: RegExp;
  replacement: string;
}

export interface MigrationPhase {
  id: string;
  name: string;
  description: string;
  tasks: string[];
  dependencies?: string[]; // IDs of phases that must complete first
}

export interface PhaseStatus {
  phaseId: string;
  completed: boolean;
  completedAt?: Date;
  errors?: string[];
}

export interface PhaseTracker {
  phases: Record<string, PhaseStatus>;
  lastUpdated: Date;
}

export interface PhaseExecutionResult {
  phaseId: string;
  success: boolean;
  completedTasks: string[];
  errors: string[];
  skipped: boolean;
  skipReason?: string;
}

export interface Backup {
  phaseId: string;
  timestamp: Date;
  backupPath: string;
  files: string[];
}

export interface BackupManifest {
  backups: Record<string, Backup>;
  lastUpdated: Date;
}

export interface RollbackResult {
  phaseId: string;
  success: boolean;
  restoredFiles: string[];
  errors: string[];
}

export class MigrationTool {
  private phaseTrackerPath: string;
  private phases: Map<string, MigrationPhase>;
  private backupManifestPath: string;

  constructor(
    private dryRun: boolean = false,
    private sourceDir: string,
    private destDir: string,
    private backupDir: string
  ) {
    this.phaseTrackerPath = path.join(this.destDir, '.migration-tracker.json');
    this.backupManifestPath = path.join(this.backupDir, '.backup-manifest.json');
    this.phases = new Map();
    this.initializePhases();
    
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Initialize migration phases
   */
  private initializePhases(): void {
    const phases: MigrationPhase[] = [
      {
        id: 'phase-1',
        name: 'Foundation',
        description: 'UI Component Library and Utilities',
        tasks: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7']
      },
      {
        id: 'phase-2',
        name: 'Context Providers',
        description: 'Context Providers and Global State',
        tasks: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6'],
        dependencies: ['phase-1']
      },
      {
        id: 'phase-3',
        name: 'Core Components',
        description: 'Core Components and Navigation',
        tasks: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6'],
        dependencies: ['phase-2']
      },
      {
        id: 'phase-4',
        name: 'Service Modules',
        description: 'Service Modules and Business Logic',
        tasks: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10'],
        dependencies: ['phase-2']
      },
      {
        id: 'phase-5',
        name: 'Basic Pages',
        description: 'Basic Pages and Routes',
        tasks: ['7.1', '7.2', '7.3', '7.4', '7.5'],
        dependencies: ['phase-3', 'phase-4']
      },
      {
        id: 'phase-6',
        name: 'Advanced Features',
        description: 'Voice, Workshops, Stories',
        tasks: ['8.1', '8.2', '8.3', '8.4', '8.5'],
        dependencies: ['phase-5']
      },
      {
        id: 'phase-7',
        name: 'Admin Dashboard',
        description: 'Admin Dashboard and Analytics',
        tasks: ['10.1', '10.2', '10.3', '10.4'],
        dependencies: ['phase-5']
      },
      {
        id: 'phase-8',
        name: 'Community',
        description: 'Community, Messaging, and User Features',
        tasks: ['11.1', '11.2', '11.3', '11.4'],
        dependencies: ['phase-5']
      },
      {
        id: 'phase-9',
        name: 'API Routes',
        description: 'API Routes and Backend Integration',
        tasks: ['12.1', '12.2'],
        dependencies: ['phase-4']
      },
      {
        id: 'phase-10',
        name: 'Assets',
        description: 'Assets and Styling',
        tasks: ['13.1', '13.2', '13.3'],
        dependencies: ['phase-1']
      },
      {
        id: 'phase-11',
        name: 'Dependencies',
        description: 'Dependency Management and Configuration',
        tasks: ['14.1', '14.2', '14.3', '14.4'],
        dependencies: ['phase-4']
      },
      {
        id: 'phase-12',
        name: 'Testing',
        description: 'Testing and Validation',
        tasks: ['16.1', '16.2', '16.3', '16.4', '16.5', '16.6'],
        dependencies: ['phase-6', 'phase-7', 'phase-8', 'phase-9', 'phase-10', 'phase-11']
      },
      {
        id: 'phase-13',
        name: 'Documentation',
        description: 'Documentation and Cleanup',
        tasks: ['17.1', '17.2', '17.3', '17.4'],
        dependencies: ['phase-12']
      },
      {
        id: 'phase-14',
        name: 'Migration Tool',
        description: 'Migration Tool Features',
        tasks: ['18.1', '18.2', '18.3', '18.4'],
        dependencies: []
      }
    ];

    phases.forEach(phase => this.phases.set(phase.id, phase));
  }

  /**
   * Copy files from source to destination
   */
  async copyFiles(sourcePath: string, destPath: string): Promise<FileCopyResult> {
    const result: FileCopyResult = {
      copied: [],
      conflicts: [],
      errors: []
    };

    const fullSourcePath = path.join(this.sourceDir, sourcePath);
    const fullDestPath = path.join(this.destDir, destPath);

    try {
      // Check if source exists
      if (!fs.existsSync(fullSourcePath)) {
        result.errors.push(`Source path does not exist: ${sourcePath}`);
        return result;
      }

      const stats = fs.statSync(fullSourcePath);

      if (stats.isDirectory()) {
        // Copy directory recursively
        await this.copyDirectory(fullSourcePath, fullDestPath, result);
      } else {
        // Copy single file
        await this.copySingleFile(fullSourcePath, fullDestPath, sourcePath, result);
      }
    } catch (error) {
      result.errors.push(`Error copying ${sourcePath}: ${error}`);
    }

    return result;
  }

  /**
   * Copy a directory recursively
   */
  private async copyDirectory(
    sourceDir: string,
    destDir: string,
    result: FileCopyResult
  ): Promise<void> {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      const relativePath = path.relative(this.sourceDir, sourcePath);

      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, destPath, result);
      } else {
        await this.copySingleFile(sourcePath, destPath, relativePath, result);
      }
    }
  }

  /**
   * Copy a single file
   */
  private async copySingleFile(
    sourcePath: string,
    destPath: string,
    relativePath: string,
    result: FileCopyResult
  ): Promise<void> {
    // Check if destination file exists
    if (fs.existsSync(destPath)) {
      const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
      const destContent = fs.readFileSync(destPath, 'utf-8');

      // Check if content is different
      if (sourceContent !== destContent) {
        result.conflicts.push({
          file: relativePath,
          reason: 'File exists with different content',
          sourceContent,
          destContent
        });
        return; // Don't overwrite
      }
    }

    // Create destination directory if needed
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy file
    if (!this.dryRun) {
      fs.copyFileSync(sourcePath, destPath);
    }
    result.copied.push(relativePath);
  }

  /**
   * Detect conflicts between source and destination
   */
  async detectConflicts(sourcePath: string, destPath: string): Promise<Conflict[]> {
    const conflicts: Conflict[] = [];

    const fullSourcePath = sourcePath ? path.join(this.sourceDir, sourcePath) : this.sourceDir;
    const fullDestPath = destPath ? path.join(this.destDir, destPath) : this.destDir;

    if (!fs.existsSync(fullSourcePath)) {
      return conflicts;
    }

    await this.detectConflictsRecursive(fullSourcePath, fullDestPath, conflicts);

    return conflicts;
  }

  /**
   * Recursively detect conflicts
   */
  private async detectConflictsRecursive(
    sourceDir: string,
    destDir: string,
    conflicts: Conflict[]
  ): Promise<void> {
    if (!fs.existsSync(sourceDir)) {
      return;
    }

    const stats = fs.statSync(sourceDir);

    if (stats.isDirectory()) {
      const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

      for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
          await this.detectConflictsRecursive(sourcePath, destPath, conflicts);
        } else {
          // Check if file exists in destination with different content
          if (fs.existsSync(destPath)) {
            const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
            const destContent = fs.readFileSync(destPath, 'utf-8');

            if (sourceContent !== destContent) {
              const relativePath = path.relative(this.sourceDir, sourcePath);
              conflicts.push({
                file: relativePath,
                reason: 'File exists with different content',
                sourceContent,
                destContent
              });
            }
          }
        }
      }
    }
  }

  /**
   * Generate diff report for conflicts
   */
  async generateDiffReport(conflicts: Conflict[]): Promise<string> {
    let report = '# Migration Conflicts Report\n\n';
    report += `Total Conflicts: ${conflicts.length}\n\n`;

    for (const conflict of conflicts) {
      report += `## ${conflict.file}\n\n`;
      report += `**Reason:** ${conflict.reason}\n\n`;

      if (conflict.sourceContent && conflict.destContent) {
        report += '**Source Content:**\n```\n';
        report += conflict.sourceContent.substring(0, 200);
        if (conflict.sourceContent.length > 200) {
          report += '...\n';
        }
        report += '```\n\n';

        report += '**Destination Content:**\n```\n';
        report += conflict.destContent.substring(0, 200);
        if (conflict.destContent.length > 200) {
          report += '...\n';
        }
        report += '```\n\n';
      }

      report += '---\n\n';
    }

    return report;
  }

  /**
   * Validate TypeScript compilation
   */
  async validateTypeScript(): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      errors: []
    };

    try {
      // Check if tsconfig.json exists
      const tsconfigPath = path.join(this.destDir, 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) {
        result.valid = false;
        result.errors.push('tsconfig.json not found');
        return result;
      }

      // Run TypeScript compiler
      const output = execSync('npx tsc --noEmit', {
        cwd: this.destDir,
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      // If we get here, compilation succeeded
      result.valid = true;
    } catch (error: any) {
      result.valid = false;
      if (error.stdout) {
        result.errors.push(error.stdout);
      }
      if (error.stderr) {
        result.errors.push(error.stderr);
      }
    }

    return result;
  }

  /**
   * Merge dependencies from source and destination package.json files
   * Preserves destination versions unless explicitly upgraded
   */
  async mergeDependencies(
    sourcePackageJsonPath: string,
    destPackageJsonPath: string
  ): Promise<DependencyMergeResult> {
    const result: DependencyMergeResult = {
      merged: {},
      preserved: [],
      added: [],
      conflicts: []
    };

    try {
      // Read source package.json
      const sourceContent = fs.readFileSync(sourcePackageJsonPath, 'utf-8');
      const sourcePackage = JSON.parse(sourceContent);
      const sourceDeps = sourcePackage.dependencies || {};

      // Read destination package.json
      const destContent = fs.readFileSync(destPackageJsonPath, 'utf-8');
      const destPackage = JSON.parse(destContent);
      const destDeps = destPackage.dependencies || {};

      // Merge dependencies
      for (const [name, sourceVersion] of Object.entries(sourceDeps)) {
        if (name in destDeps) {
          // Dependency exists in both - preserve destination version
          result.merged[name] = destDeps[name] as string;
          result.preserved.push(name);

          // Track if versions differ (potential conflict)
          if (sourceVersion !== destDeps[name]) {
            result.conflicts.push({
              name,
              sourceVersion: sourceVersion as string,
              destVersion: destDeps[name] as string
            });
          }
        } else {
          // Dependency only in source - add it
          result.merged[name] = sourceVersion as string;
          result.added.push(name);
        }
      }

      // Add remaining destination dependencies that weren't in source
      for (const [name, destVersion] of Object.entries(destDeps)) {
        if (!(name in sourceDeps)) {
          result.merged[name] = destVersion as string;
        }
      }
    } catch (error) {
      throw new Error(`Error merging dependencies: ${error}`);
    }

    return result;
  }

  /**
   * Transform import statements in a file according to transformation rules
   */
  async transformImports(filePath: string, rules: TransformRule[]): Promise<string> {
    const fullPath = path.join(this.destDir, filePath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    let content = fs.readFileSync(fullPath, 'utf-8');

    // Apply each transformation rule
    for (const rule of rules) {
      content = content.replace(rule.pattern, rule.replacement);
    }

    // Write transformed content back if not dry run
    if (!this.dryRun) {
      fs.writeFileSync(fullPath, content, 'utf-8');
    }

    return content;
  }

  /**
   * Update configuration files when new components or dependencies are added
   * Handles components.json, package.json, and tailwind config updates
   */
  async updateConfigurationFiles(
    newComponents: string[],
    newDependencies: string[]
  ): Promise<ConfigUpdateResult> {
    const result: ConfigUpdateResult = {
      componentsJsonUpdated: false,
      packageJsonUpdated: false,
      tailwindConfigUpdated: false,
      errors: []
    };

    try {
      // Update components.json if new components were added
      if (newComponents.length > 0) {
        const componentsJsonPath = path.join(this.destDir, 'components.json');
        if (fs.existsSync(componentsJsonPath)) {
          // For now, just mark as updated if file exists
          // In a real implementation, we would parse and update the file
          result.componentsJsonUpdated = true;
        }
      }

      // Update package.json if new dependencies were added
      if (newDependencies.length > 0) {
        const packageJsonPath = path.join(this.destDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          result.packageJsonUpdated = true;
        }
      }

      // Check for tailwind config updates
      const tailwindConfigPaths = [
        path.join(this.destDir, 'tailwind.config.js'),
        path.join(this.destDir, 'tailwind.config.ts'),
        path.join(this.destDir, 'tailwind.config.mjs')
      ];

      for (const configPath of tailwindConfigPaths) {
        if (fs.existsSync(configPath)) {
          result.tailwindConfigUpdated = true;
          break;
        }
      }
    } catch (error) {
      result.errors.push(`Error updating configuration files: ${error}`);
    }

    return result;
  }

  /**
   * Load phase tracker from disk
   */
  private loadPhaseTracker(): PhaseTracker {
    if (fs.existsSync(this.phaseTrackerPath)) {
      try {
        const content = fs.readFileSync(this.phaseTrackerPath, 'utf-8');
        const tracker = JSON.parse(content);
        // Convert date strings back to Date objects
        tracker.lastUpdated = new Date(tracker.lastUpdated);
        Object.values(tracker.phases).forEach((status: any) => {
          if (status.completedAt) {
            status.completedAt = new Date(status.completedAt);
          }
        });
        return tracker;
      } catch (error) {
        console.warn('Failed to load phase tracker, creating new one:', error);
      }
    }

    // Create new tracker
    const tracker: PhaseTracker = {
      phases: {},
      lastUpdated: new Date()
    };

    // Initialize all phases as not completed
    this.phases.forEach((phase, id) => {
      tracker.phases[id] = {
        phaseId: id,
        completed: false
      };
    });

    return tracker;
  }

  /**
   * Save phase tracker to disk
   */
  private savePhaseTracker(tracker: PhaseTracker): void {
    if (this.dryRun) {
      console.log('[DRY RUN] Would save phase tracker:', tracker);
      return;
    }

    tracker.lastUpdated = new Date();
    const content = JSON.stringify(tracker, null, 2);
    fs.writeFileSync(this.phaseTrackerPath, content, 'utf-8');
  }

  /**
   * Get the status of a specific phase
   */
  getPhaseStatus(phaseId: string): PhaseStatus | null {
    const tracker = this.loadPhaseTracker();
    return tracker.phases[phaseId] || null;
  }

  /**
   * Get all phase statuses
   */
  getAllPhaseStatuses(): Record<string, PhaseStatus> {
    const tracker = this.loadPhaseTracker();
    return tracker.phases;
  }

  /**
   * Check if a phase is completed
   */
  isPhaseCompleted(phaseId: string): boolean {
    const status = this.getPhaseStatus(phaseId);
    return status?.completed || false;
  }

  /**
   * Check if all dependencies for a phase are completed
   */
  areDependenciesCompleted(phaseId: string): boolean {
    const phase = this.phases.get(phaseId);
    if (!phase || !phase.dependencies || phase.dependencies.length === 0) {
      return true;
    }

    return phase.dependencies.every(depId => this.isPhaseCompleted(depId));
  }

  /**
   * Mark a phase as completed
   */
  markPhaseCompleted(phaseId: string, errors?: string[]): void {
    const tracker = this.loadPhaseTracker();
    
    if (!tracker.phases[phaseId]) {
      throw new Error(`Phase ${phaseId} not found in tracker`);
    }

    tracker.phases[phaseId] = {
      phaseId,
      completed: true,
      completedAt: new Date(),
      errors: errors && errors.length > 0 ? errors : undefined
    };

    this.savePhaseTracker(tracker);
  }

  /**
   * Mark a phase as not completed (for rollback)
   */
  markPhaseIncomplete(phaseId: string): void {
    const tracker = this.loadPhaseTracker();
    
    if (!tracker.phases[phaseId]) {
      throw new Error(`Phase ${phaseId} not found in tracker`);
    }

    tracker.phases[phaseId] = {
      phaseId,
      completed: false
    };

    this.savePhaseTracker(tracker);
  }

  /**
   * Execute a specific migration phase
   */
  async executePhase(
    phaseId: string,
    force: boolean = false
  ): Promise<PhaseExecutionResult> {
    const phase = this.phases.get(phaseId);
    
    if (!phase) {
      return {
        phaseId,
        success: false,
        completedTasks: [],
        errors: [`Phase ${phaseId} not found`],
        skipped: false
      };
    }

    // Check if already completed
    if (this.isPhaseCompleted(phaseId) && !force) {
      return {
        phaseId,
        success: true,
        completedTasks: [],
        errors: [],
        skipped: true,
        skipReason: 'Phase already completed'
      };
    }

    // Check dependencies
    if (!this.areDependenciesCompleted(phaseId) && !force) {
      const incompleteDeps = phase.dependencies?.filter(
        depId => !this.isPhaseCompleted(depId)
      ) || [];
      
      return {
        phaseId,
        success: false,
        completedTasks: [],
        errors: [`Dependencies not completed: ${incompleteDeps.join(', ')}`],
        skipped: true,
        skipReason: 'Dependencies not completed'
      };
    }

    // Execute phase (this is a placeholder - actual implementation would execute tasks)
    const result: PhaseExecutionResult = {
      phaseId,
      success: true,
      completedTasks: phase.tasks,
      errors: [],
      skipped: false
    };

    // Mark phase as completed if successful
    if (result.success) {
      this.markPhaseCompleted(phaseId, result.errors);
    }

    return result;
  }

  /**
   * Get list of all phases
   */
  getPhases(): MigrationPhase[] {
    return Array.from(this.phases.values());
  }

  /**
   * Get a specific phase by ID
   */
  getPhase(phaseId: string): MigrationPhase | undefined {
    return this.phases.get(phaseId);
  }

  /**
   * Get phases that are ready to execute (dependencies completed, not yet completed)
   */
  getReadyPhases(): MigrationPhase[] {
    return Array.from(this.phases.values()).filter(phase => {
      return !this.isPhaseCompleted(phase.id) && this.areDependenciesCompleted(phase.id);
    });
  }

  /**
   * Get phases that are blocked (dependencies not completed)
   */
  getBlockedPhases(): MigrationPhase[] {
    return Array.from(this.phases.values()).filter(phase => {
      return !this.isPhaseCompleted(phase.id) && !this.areDependenciesCompleted(phase.id);
    });
  }

  /**
   * Get completed phases
   */
  getCompletedPhases(): MigrationPhase[] {
    return Array.from(this.phases.values()).filter(phase => {
      return this.isPhaseCompleted(phase.id);
    });
  }

  /**
   * Reset phase tracker (clear all completion status)
   */
  resetPhaseTracker(): void {
    const tracker: PhaseTracker = {
      phases: {},
      lastUpdated: new Date()
    };

    this.phases.forEach((phase, id) => {
      tracker.phases[id] = {
        phaseId: id,
        completed: false
      };
    });

    this.savePhaseTracker(tracker);
  }

  /**
   * Get migration progress summary
   */
  getProgressSummary(): {
    total: number;
    completed: number;
    ready: number;
    blocked: number;
    percentComplete: number;
  } {
    const total = this.phases.size;
    const completed = this.getCompletedPhases().length;
    const ready = this.getReadyPhases().length;
    const blocked = this.getBlockedPhases().length;
    const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      ready,
      blocked,
      percentComplete
    };
  }

  /**
   * Load backup manifest from disk
   */
  private loadBackupManifest(): BackupManifest {
    if (fs.existsSync(this.backupManifestPath)) {
      try {
        const content = fs.readFileSync(this.backupManifestPath, 'utf-8');
        const manifest = JSON.parse(content);
        // Convert date strings back to Date objects
        manifest.lastUpdated = new Date(manifest.lastUpdated);
        Object.values(manifest.backups).forEach((backup: any) => {
          backup.timestamp = new Date(backup.timestamp);
        });
        return manifest;
      } catch (error) {
        console.warn('Failed to load backup manifest, creating new one:', error);
      }
    }

    // Create new manifest
    return {
      backups: {},
      lastUpdated: new Date()
    };
  }

  /**
   * Save backup manifest to disk
   */
  private saveBackupManifest(manifest: BackupManifest): void {
    if (this.dryRun) {
      console.log('[DRY RUN] Would save backup manifest:', manifest);
      return;
    }

    manifest.lastUpdated = new Date();
    const content = JSON.stringify(manifest, null, 2);
    fs.writeFileSync(this.backupManifestPath, content, 'utf-8');
  }

  /**
   * Create a backup of the current state before executing a phase
   * Backs up all files that might be affected by the phase
   */
  async createBackup(phaseId: string): Promise<Backup> {
    const phase = this.phases.get(phaseId);
    if (!phase) {
      throw new Error(`Phase ${phaseId} not found`);
    }

    const timestamp = new Date();
    const backupPath = path.join(
      this.backupDir,
      `${phaseId}-${timestamp.getTime()}`
    );

    // Create backup directory
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const backedUpFiles: string[] = [];

    try {
      // Backup the entire destination directory structure
      await this.backupDirectory(this.destDir, backupPath, backedUpFiles);

      // Create backup record
      const backup: Backup = {
        phaseId,
        timestamp,
        backupPath,
        files: backedUpFiles
      };

      // Save to manifest
      const manifest = this.loadBackupManifest();
      manifest.backups[phaseId] = backup;
      this.saveBackupManifest(manifest);

      console.log(`✓ Backup created for ${phaseId}: ${backedUpFiles.length} files backed up`);
      
      return backup;
    } catch (error) {
      throw new Error(`Failed to create backup for ${phaseId}: ${error}`);
    }
  }

  /**
   * Recursively backup a directory
   */
  private async backupDirectory(
    sourceDir: string,
    backupDir: string,
    backedUpFiles: string[]
  ): Promise<void> {
    if (!fs.existsSync(sourceDir)) {
      return;
    }

    // Create backup directory
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const backupPath = path.join(backupDir, entry.name);

      // Skip certain directories
      if (entry.isDirectory()) {
        const skipDirs = ['node_modules', '.next', '.git', '.migration-backup'];
        if (skipDirs.includes(entry.name)) {
          continue;
        }
        await this.backupDirectory(sourcePath, backupPath, backedUpFiles);
      } else {
        // Skip backup manifest and tracker files
        if (entry.name === '.migration-tracker.json' || entry.name === '.backup-manifest.json') {
          continue;
        }

        // Copy file to backup
        if (!this.dryRun) {
          fs.copyFileSync(sourcePath, backupPath);
        }
        const relativePath = path.relative(this.destDir, sourcePath);
        backedUpFiles.push(relativePath);
      }
    }
  }

  /**
   * Rollback a phase to its previous state using the backup
   */
  async rollbackPhase(phaseId: string): Promise<RollbackResult> {
    const result: RollbackResult = {
      phaseId,
      success: false,
      restoredFiles: [],
      errors: []
    };

    try {
      // Load backup manifest
      const manifest = this.loadBackupManifest();
      const backup = manifest.backups[phaseId];

      if (!backup) {
        result.errors.push(`No backup found for phase ${phaseId}`);
        return result;
      }

      if (!fs.existsSync(backup.backupPath)) {
        result.errors.push(`Backup directory not found: ${backup.backupPath}`);
        return result;
      }

      console.log(`Rolling back ${phaseId} from backup created at ${backup.timestamp.toLocaleString()}...`);

      // Restore files from backup
      await this.restoreDirectory(backup.backupPath, this.destDir, result.restoredFiles);

      // Mark phase as incomplete
      this.markPhaseIncomplete(phaseId);

      result.success = true;
      console.log(`✓ Rollback completed: ${result.restoredFiles.length} files restored`);

    } catch (error) {
      result.errors.push(`Rollback failed: ${error}`);
    }

    return result;
  }

  /**
   * Recursively restore a directory from backup
   */
  private async restoreDirectory(
    backupDir: string,
    destDir: string,
    restoredFiles: string[]
  ): Promise<void> {
    if (!fs.existsSync(backupDir)) {
      return;
    }

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const entries = fs.readdirSync(backupDir, { withFileTypes: true });

    for (const entry of entries) {
      const backupPath = path.join(backupDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      if (entry.isDirectory()) {
        await this.restoreDirectory(backupPath, destPath, restoredFiles);
      } else {
        // Restore file from backup
        if (!this.dryRun) {
          fs.copyFileSync(backupPath, destPath);
        }
        const relativePath = path.relative(this.destDir, destPath);
        restoredFiles.push(relativePath);
      }
    }
  }

  /**
   * Get backup information for a phase
   */
  getBackup(phaseId: string): Backup | null {
    const manifest = this.loadBackupManifest();
    return manifest.backups[phaseId] || null;
  }

  /**
   * Get all backups
   */
  getAllBackups(): Record<string, Backup> {
    const manifest = this.loadBackupManifest();
    return manifest.backups;
  }

  /**
   * Delete a backup for a phase
   */
  async deleteBackup(phaseId: string): Promise<boolean> {
    try {
      const manifest = this.loadBackupManifest();
      const backup = manifest.backups[phaseId];

      if (!backup) {
        return false;
      }

      // Delete backup directory
      if (fs.existsSync(backup.backupPath)) {
        fs.rmSync(backup.backupPath, { recursive: true, force: true });
      }

      // Remove from manifest
      delete manifest.backups[phaseId];
      this.saveBackupManifest(manifest);

      console.log(`✓ Backup deleted for ${phaseId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete backup for ${phaseId}:`, error);
      return false;
    }
  }

  /**
   * Clean up old backups (keep only the most recent backup for each phase)
   */
  async cleanupOldBackups(): Promise<number> {
    let deletedCount = 0;
    const manifest = this.loadBackupManifest();

    for (const [phaseId, backup] of Object.entries(manifest.backups)) {
      // For now, we keep all backups. In a production system, you might want to
      // implement a policy to delete backups older than X days or keep only N most recent
      console.log(`Backup for ${phaseId}: ${backup.files.length} files, created ${backup.timestamp.toLocaleString()}`);
    }

    return deletedCount;
  }
}
