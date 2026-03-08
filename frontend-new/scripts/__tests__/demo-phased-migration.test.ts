/**
 * Test that runs the phased migration demonstration
 */

import { execSync } from 'child_process';
import * as path from 'path';

describe('Phased Migration Demonstration', () => {
  it('should run the demonstration without errors', () => {
    const scriptPath = path.join(__dirname, '../demo-phased-migration.ts');
    
    // Run the demonstration script
    const output = execSync(`npx ts-node ${scriptPath}`, {
      encoding: 'utf-8',
      cwd: path.join(__dirname, '../..')
    });
    
    // Verify key outputs
    expect(output).toContain('Phased Migration Support Demonstration');
    expect(output).toContain('All Migration Phases');
    expect(output).toContain('Phase tracking with persistent storage');
    expect(output).toContain('Dependency checking before execution');
    expect(output).toContain('Prevention of re-migration');
    expect(output).toContain('Progress tracking and reporting');
  });
});
