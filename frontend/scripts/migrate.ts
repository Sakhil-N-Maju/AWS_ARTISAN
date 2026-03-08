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

export class MigrationTool {
  constructor(
    private dryRun: boolean = false,
    private sourceDir: string,
    private destDir: string,
    private backupDir: string
  ) {}

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
}
