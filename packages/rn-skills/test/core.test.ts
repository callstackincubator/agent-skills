import {afterEach, describe, expect, it} from 'bun:test';
import {
  buildSkillPlan,
  createTempProject,
  discoverPackageJsonPaths,
  getBundledLookupTable,
  getLookupTableWithOptions,
  removeTempProject,
  scanProjectLibraries,
} from '../src/core';

const tempDirectories: string[] = [];

afterEach(async () => {
  while (tempDirectories.length > 0) {
    await removeTempProject(tempDirectories.pop()!);
  }
});

describe('discoverPackageJsonPaths', () => {
  it('finds package.json files across a monorepo', async () => {
    const root = await createTempProject({
      'package.json': {
        private: true,
      },
      'apps/mobile/package.json': {
        dependencies: {
          expo: '^54.0.0',
        },
      },
      'packages/ui/package.json': {
        peerDependencies: {
          'react-native-svg': '^15.0.0',
        },
      },
      'node_modules/ignored/package.json': {
        dependencies: {
          react: '^19.0.0',
        },
      },
    });

    tempDirectories.push(root);

    const packageJsonPaths = await discoverPackageJsonPaths(root);
    expect(packageJsonPaths).toHaveLength(3);
    expect(
      packageJsonPaths.some((entry) => entry.includes('node_modules')),
    ).toBeFalse();
  });
});

describe('scanProjectLibraries', () => {
  it('merges dependency names across all dependency sections', async () => {
    const root = await createTempProject({
      'apps/mobile/package.json': {
        dependencies: {
          'react-native': '0.82.0',
          'react-native-reanimated': '^4.0.0',
        },
        devDependencies: {
          '@testing-library/react-native': '^13.0.0',
        },
        peerDependencies: {
          expo: '^54.0.0',
        },
      },
    });

    tempDirectories.push(root);

    const scan = await scanProjectLibraries(root);
    expect(scan.libraries).toEqual([
      '@testing-library/react-native',
      'expo',
      'react-native',
      'react-native-reanimated',
    ]);
  });
});

describe('buildSkillPlan', () => {
  it('detects missing and extra RN skills', () => {
    const plan = buildSkillPlan(
      {
        packageJsonPaths: ['/repo/package.json'],
        libraries: [
          '@testing-library/react-native',
          'react-native',
          'react-native-reanimated',
        ],
      },
      [
        {
          name: 'github',
          path: '/repo/.agents/skills/github',
          scope: 'project',
          agents: ['Cursor'],
        },
        {
          name: 'react-native-best-practices',
          path: '/repo/.agents/skills/react-native-best-practices',
          scope: 'project',
          agents: ['Cursor'],
        },
      ],
    );

    expect(plan.missingSkills.map((skill) => skill.name)).toEqual([
      'react-native-testing',
      'upgrading-react-native',
    ]);
    expect(plan.extraInstalledSkills.map((skill) => skill.name)).toEqual([]);
    expect(plan.ignoredInstalledSkills.map((skill) => skill.name)).toEqual([
      'github',
    ]);
  });

  it('marks managed but unmatched installed skills as extra', () => {
    const plan = buildSkillPlan(
      {
        packageJsonPaths: ['/repo/package.json'],
        libraries: ['@testing-library/react-native'],
      },
      [
        {
          name: 'react-native-brownfield-migration',
          path: '/repo/.agents/skills/react-native-brownfield-migration',
          scope: 'project',
          agents: ['Cursor'],
        },
        {
          name: 'github',
          path: '/repo/.agents/skills/github',
          scope: 'project',
          agents: ['Cursor'],
        },
      ],
    );

    expect(plan.missingSkills.map((skill) => skill.name)).toEqual([
      'react-native-testing',
    ]);
    expect(plan.extraInstalledSkills.map((skill) => skill.name)).toEqual([
      'react-native-brownfield-migration',
    ]);
    expect(plan.ignoredInstalledSkills.map((skill) => skill.name)).toEqual([
      'github',
    ]);
  });
});

describe('getLookupTableWithOptions', () => {
  it('does not attempt a remote fetch when disableRemoteLookup is true', async () => {
    const originalFetch = globalThis.fetch;
    const fetchCalls: unknown[][] = [];

    globalThis.fetch = (async (...args: unknown[]) => {
      fetchCalls.push(args);
      throw new Error('fetch should not be called');
    }) as unknown as typeof fetch;

    try {
      const lookup = await getLookupTableWithOptions({
        disableRemoteLookup: true,
      });
      expect(lookup).toEqual(getBundledLookupTable());
      expect(fetchCalls).toHaveLength(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
