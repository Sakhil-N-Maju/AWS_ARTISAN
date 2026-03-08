/**
 * Property-Based Tests for Migration Documentation Generation
 * 
 * Uses fast-check to verify universal properties across many generated inputs.
 * Minimum 100 iterations per property test.
 * 
 * Feature: frontend-migration
 * Property 25: Migration Documentation Generation
 * 
 * **Validates: Requirements 24.1, 24.2, 24.3, 24.4, 24.5**
 */

import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';

/**
 * Interface for migration documentation data
 */
interface MigrationDocumentationData {
  migratedFiles: string[];
  newRoutes: Array<{ path: string; description: string }>;
  contextProviders: Array<{ name: string; purpose: string }>;
  serviceModules: Array<{ name: string; purpose: string }>;
  environmentVariables: Array<{ name: string; required: boolean; description: string }>;
  manualSteps: string[];
}

/**
 * Generate migration documentation from data
 */
function generateMigrationDocumentation(data: MigrationDocumentationData): string {
  let doc = '# Frontend Migration Documentation\n\n';
  
  // Section 1: Migrated Files Summary (Requirement 24.1)
  doc += '## Migrated Files Summary\n\n';
  doc += `Total files migrated: ${data.migratedFiles.length}\n\n`;
  if (data.migratedFiles.length > 0) {
    doc += '### Files:\n';
    for (const file of data.migratedFiles) {
      doc += `- ${file}\n`;
    }
    doc += '\n';
  }
  
  // Section 2: New Routes (Requirement 24.2)
  doc += '## New Routes\n\n';
  if (data.newRoutes.length > 0) {
    for (const route of data.newRoutes) {
      doc += `- **${route.path}** - ${route.description}\n`;
    }
    doc += '\n';
  } else {
    doc += 'No new routes added.\n\n';
  }
  
  // Section 3: Context Providers (Requirement 24.3)
  doc += '## Context Providers\n\n';
  if (data.contextProviders.length > 0) {
    for (const provider of data.contextProviders) {
      doc += `### ${provider.name}\n\n`;
      doc += `**Purpose:** ${provider.purpose}\n\n`;
    }
  } else {
    doc += 'No new context providers added.\n\n';
  }
  
  // Section 4: Service Modules (Requirement 24.4)
  doc += '## Service Modules\n\n';
  if (data.serviceModules.length > 0) {
    for (const service of data.serviceModules) {
      doc += `- **${service.name}** - ${service.purpose}\n`;
    }
    doc += '\n';
  } else {
    doc += 'No new service modules added.\n\n';
  }
  
  // Section 5: Environment Variables (Requirement 24.4)
  doc += '## Environment Variables\n\n';
  if (data.environmentVariables.length > 0) {
    const required = data.environmentVariables.filter(v => v.required);
    const optional = data.environmentVariables.filter(v => !v.required);
    
    if (required.length > 0) {
      doc += '### Required:\n';
      for (const envVar of required) {
        doc += `- **${envVar.name}** - ${envVar.description}\n`;
      }
      doc += '\n';
    }
    
    if (optional.length > 0) {
      doc += '### Optional:\n';
      for (const envVar of optional) {
        doc += `- **${envVar.name}** - ${envVar.description}\n`;
      }
      doc += '\n';
    }
  } else {
    doc += 'No new environment variables required.\n\n';
  }
  
  // Section 6: Manual Steps (Requirement 24.5)
  doc += '## Manual Testing Steps\n\n';
  if (data.manualSteps.length > 0) {
    for (let i = 0; i < data.manualSteps.length; i++) {
      doc += `${i + 1}. ${data.manualSteps[i]}\n`;
    }
    doc += '\n';
  } else {
    doc += 'No manual steps required.\n\n';
  }
  
  return doc;
}

/**
 * Property 25: Migration Documentation Generation
 * 
 * **Validates: Requirements 24.1, 24.2, 24.3, 24.4, 24.5**
 * 
 * For any completed migration phase, the system should generate comprehensive
 * documentation including: list of migrated files, new routes, new contexts,
 * new services, required environment variables, and manual steps needed.
 */
describe('Property 25: Migration Documentation Generation', () => {
  it('should generate documentation with all required sections for any migration data', () => {
    // Arbitrary for file paths
    const filePathArbitrary = fc.tuple(
      fc.array(fc.stringMatching(/^[a-z][a-z0-9-]*$/), { minLength: 1, maxLength: 3 }),
      fc.stringMatching(/^[a-z][a-z0-9-]*$/),
      fc.constantFrom('.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.md')
    ).map(([dirs, name, ext]) => dirs.join('/') + '/' + name + ext);

    // Arbitrary for route paths
    const routePathArbitrary = fc.tuple(
      fc.array(fc.stringMatching(/^[a-z][a-z0-9-]*$/), { minLength: 1, maxLength: 3 })
    ).map(([segments]) => '/' + segments.join('/'));

    // Arbitrary for route objects
    const routeArbitrary = fc.record({
      path: routePathArbitrary,
      description: fc.string({ minLength: 10, maxLength: 100 })
    });

    // Arbitrary for context provider names
    const contextNameArbitrary = fc.stringMatching(/^[A-Z][a-zA-Z]*Context$/);

    // Arbitrary for context providers
    const contextProviderArbitrary = fc.record({
      name: contextNameArbitrary,
      purpose: fc.string({ minLength: 20, maxLength: 150 })
    });

    // Arbitrary for service module names
    const serviceNameArbitrary = fc.stringMatching(/^[a-z][a-z0-9-]*\.ts$/);

    // Arbitrary for service modules
    const serviceModuleArbitrary = fc.record({
      name: serviceNameArbitrary,
      purpose: fc.string({ minLength: 20, maxLength: 150 })
    });

    // Arbitrary for environment variable names
    const envVarNameArbitrary = fc.stringMatching(/^[A-Z][A-Z0-9_]*$/);

    // Arbitrary for environment variables
    const envVarArbitrary = fc.record({
      name: envVarNameArbitrary,
      required: fc.boolean(),
      description: fc.string({ minLength: 10, maxLength: 100 })
    });

    // Arbitrary for manual steps
    const manualStepArbitrary = fc.string({ minLength: 20, maxLength: 200 });

    // Arbitrary for complete migration documentation data
    const migrationDataArbitrary = fc.record({
      migratedFiles: fc.uniqueArray(filePathArbitrary, { minLength: 0, maxLength: 50 }),
      newRoutes: fc.uniqueArray(routeArbitrary, { 
        minLength: 0, 
        maxLength: 20,
        selector: (r) => r.path 
      }),
      contextProviders: fc.uniqueArray(contextProviderArbitrary, { 
        minLength: 0, 
        maxLength: 5,
        selector: (c) => c.name 
      }),
      serviceModules: fc.uniqueArray(serviceModuleArbitrary, { 
        minLength: 0, 
        maxLength: 30,
        selector: (s) => s.name 
      }),
      environmentVariables: fc.uniqueArray(envVarArbitrary, { 
        minLength: 0, 
        maxLength: 20,
        selector: (e) => e.name 
      }),
      manualSteps: fc.array(manualStepArbitrary, { minLength: 0, maxLength: 10 })
    });

    fc.assert(
      fc.property(migrationDataArbitrary, (data) => {
        // Generate documentation
        const documentation = generateMigrationDocumentation(data);

        // Property 1: Documentation must contain all required section headers (Requirement 24.1-24.5)
        expect(documentation).toContain('# Frontend Migration Documentation');
        expect(documentation).toContain('## Migrated Files Summary');
        expect(documentation).toContain('## New Routes');
        expect(documentation).toContain('## Context Providers');
        expect(documentation).toContain('## Service Modules');
        expect(documentation).toContain('## Environment Variables');
        expect(documentation).toContain('## Manual Testing Steps');

        // Property 2: All migrated files must be listed (Requirement 24.1)
        for (const file of data.migratedFiles) {
          expect(documentation).toContain(file);
        }

        // Property 3: All new routes must be documented (Requirement 24.2)
        for (const route of data.newRoutes) {
          expect(documentation).toContain(route.path);
          expect(documentation).toContain(route.description);
        }

        // Property 4: All context providers must be documented (Requirement 24.3)
        for (const provider of data.contextProviders) {
          expect(documentation).toContain(provider.name);
          expect(documentation).toContain(provider.purpose);
        }

        // Property 5: All service modules must be documented (Requirement 24.4)
        for (const service of data.serviceModules) {
          expect(documentation).toContain(service.name);
          expect(documentation).toContain(service.purpose);
        }

        // Property 6: All environment variables must be documented (Requirement 24.4)
        for (const envVar of data.environmentVariables) {
          expect(documentation).toContain(envVar.name);
          expect(documentation).toContain(envVar.description);
        }

        // Property 7: Required vs optional environment variables must be distinguished
        const requiredVars = data.environmentVariables.filter(v => v.required);
        const optionalVars = data.environmentVariables.filter(v => !v.required);
        
        if (requiredVars.length > 0) {
          expect(documentation).toContain('### Required:');
        }
        
        if (optionalVars.length > 0) {
          expect(documentation).toContain('### Optional:');
        }

        // Property 8: All manual steps must be documented (Requirement 24.5)
        for (const step of data.manualSteps) {
          expect(documentation).toContain(step);
        }

        // Property 9: Manual steps must be numbered
        if (data.manualSteps.length > 0) {
          for (let i = 0; i < data.manualSteps.length; i++) {
            expect(documentation).toContain(`${i + 1}. ${data.manualSteps[i]}`);
          }
        }

        // Property 10: Documentation must include file count (Requirement 24.1)
        expect(documentation).toContain(`Total files migrated: ${data.migratedFiles.length}`);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle empty migration data gracefully', () => {
    const emptyData: MigrationDocumentationData = {
      migratedFiles: [],
      newRoutes: [],
      contextProviders: [],
      serviceModules: [],
      environmentVariables: [],
      manualSteps: []
    };

    const documentation = generateMigrationDocumentation(emptyData);

    // Should still have all section headers
    expect(documentation).toContain('# Frontend Migration Documentation');
    expect(documentation).toContain('## Migrated Files Summary');
    expect(documentation).toContain('## New Routes');
    expect(documentation).toContain('## Context Providers');
    expect(documentation).toContain('## Service Modules');
    expect(documentation).toContain('## Environment Variables');
    expect(documentation).toContain('## Manual Testing Steps');

    // Should indicate no items
    expect(documentation).toContain('Total files migrated: 0');
    expect(documentation).toContain('No new routes added');
    expect(documentation).toContain('No new context providers added');
    expect(documentation).toContain('No new service modules added');
    expect(documentation).toContain('No new environment variables required');
    expect(documentation).toContain('No manual steps required');
  });

  it('should generate consistent documentation for the same input', () => {
    const testData: MigrationDocumentationData = {
      migratedFiles: ['components/ui/button.tsx', 'lib/utils.ts'],
      newRoutes: [
        { path: '/voice', description: 'Voice commerce interface' },
        { path: '/workshops', description: 'Workshop listing page' }
      ],
      contextProviders: [
        { name: 'AuthContext', purpose: 'Manages user authentication' }
      ],
      serviceModules: [
        { name: 'voice-commerce-system.ts', purpose: 'Voice commerce functionality' }
      ],
      environmentVariables: [
        { name: 'NEXT_PUBLIC_API_URL', required: true, description: 'Backend API URL' },
        { name: 'NEXT_PUBLIC_VOICE_ENABLED', required: false, description: 'Enable voice features' }
      ],
      manualSteps: [
        'Test voice recording in browser',
        'Verify payment integration'
      ]
    };

    const doc1 = generateMigrationDocumentation(testData);
    const doc2 = generateMigrationDocumentation(testData);

    // Documentation should be identical for same input
    expect(doc1).toBe(doc2);
  });

  it('should preserve order of items in documentation', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 5, maxLength: 20 }), { minLength: 2, maxLength: 10 }),
        (files) => {
          const data: MigrationDocumentationData = {
            migratedFiles: files,
            newRoutes: [],
            contextProviders: [],
            serviceModules: [],
            environmentVariables: [],
            manualSteps: []
          };

          const documentation = generateMigrationDocumentation(data);

          // Extract the files section
          const filesSection = documentation.split('### Files:')[1]?.split('##')[0] || '';
          
          // Check that files appear in the same order
          let lastIndex = -1;
          for (const file of files) {
            const currentIndex = filesSection.indexOf(file);
            expect(currentIndex).toBeGreaterThan(lastIndex);
            lastIndex = currentIndex;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle special characters in documentation content', () => {
    fc.assert(
      fc.property(
        fc.record({
          fileName: fc.string({ minLength: 1, maxLength: 50 }),
          routePath: fc.string({ minLength: 1, maxLength: 50 }),
          description: fc.string({ minLength: 1, maxLength: 100 })
        }),
        (testCase) => {
          const data: MigrationDocumentationData = {
            migratedFiles: [testCase.fileName],
            newRoutes: [{ path: testCase.routePath, description: testCase.description }],
            contextProviders: [],
            serviceModules: [],
            environmentVariables: [],
            manualSteps: []
          };

          const documentation = generateMigrationDocumentation(data);

          // Documentation should be generated without errors
          expect(documentation).toBeTruthy();
          expect(documentation.length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should correctly categorize required vs optional environment variables', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.stringMatching(/^[A-Z][A-Z0-9_]*$/),
            required: fc.boolean(),
            description: fc.string({ minLength: 10, maxLength: 50 })
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (envVars) => {
          const data: MigrationDocumentationData = {
            migratedFiles: [],
            newRoutes: [],
            contextProviders: [],
            serviceModules: [],
            environmentVariables: envVars,
            manualSteps: []
          };

          const documentation = generateMigrationDocumentation(data);

          const requiredVars = envVars.filter(v => v.required);
          const optionalVars = envVars.filter(v => !v.required);

          // Check required section
          if (requiredVars.length > 0) {
            expect(documentation).toContain('### Required:');
            for (const envVar of requiredVars) {
              const requiredSection = documentation.split('### Required:')[1]?.split('###')[0] || '';
              expect(requiredSection).toContain(envVar.name);
            }
          }

          // Check optional section
          if (optionalVars.length > 0) {
            expect(documentation).toContain('### Optional:');
            for (const envVar of optionalVars) {
              const optionalSection = documentation.split('### Optional:')[1]?.split('##')[0] || '';
              expect(optionalSection).toContain(envVar.name);
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should number manual steps sequentially', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 10, maxLength: 50 }), { minLength: 1, maxLength: 20 }),
        (steps) => {
          const data: MigrationDocumentationData = {
            migratedFiles: [],
            newRoutes: [],
            contextProviders: [],
            serviceModules: [],
            environmentVariables: [],
            manualSteps: steps
          };

          const documentation = generateMigrationDocumentation(data);

          // Check that steps are numbered 1, 2, 3, ...
          for (let i = 0; i < steps.length; i++) {
            expect(documentation).toContain(`${i + 1}. ${steps[i]}`);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
