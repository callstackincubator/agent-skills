import {afterEach, describe, expect, it} from 'bun:test';
import {chmod, mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';

const tempDirectories: string[] = [];
const testRoot = import.meta.dir;
const fixtureRoot = join(testRoot, 'fixtures');
const templatePath = join(testRoot, 'template', 'fake-npx.ts');

afterEach(async () => {
  while (tempDirectories.length > 0) {
    await rm(tempDirectories.pop()!, {recursive: true, force: true});
  }
});

describe('rn-skills e2e', () => {
  it('prints usage for --help', () => {
    const cliPath = resolve(testRoot, '..', 'src', 'index.ts');
    const processResult = Bun.spawnSync({
      cmd: ['bun', cliPath, '--help'],
      cwd: dirname(cliPath),
      stdout: 'pipe',
      stderr: 'pipe',
    });

    expect(processResult.exitCode).toBe(0);
    expect(new TextDecoder().decode(processResult.stdout)).toContain(
      'Usage: rn-skills',
    );
  });

  it('lists curated supported libraries and skills', () => {
    const cliPath = resolve(testRoot, '..', 'src', 'index.ts');
    const processResult = Bun.spawnSync({
      cmd: ['bun', cliPath, 'list-supported'],
      cwd: dirname(cliPath),
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const stdout = new TextDecoder().decode(processResult.stdout);

    expect(processResult.exitCode).toBe(0);
    expect(stdout).toContain('@testing-library/react-native');
    expect(stdout).toContain(
      'react-native-testing from React Native Testing Library Skills',
    );
    expect(stdout).toContain('react-native-reanimated');
  });

  it('defaults to auto when no command is passed', async () => {
    const result = await runAutoWithFixture({
      fixtureName: 'brownfield-app',
      installedSkills: [],
      expectedAdds: [
        [
          'callstackincubator/agent-skills',
          'react-native-brownfield-migration',
        ],
      ],
      expectedRemovals: [],
      command: [],
    });

    expect(result.exitCode).toBe(0);
  });

  it('adds the expected Callstack, Vercel, and testing skills for expo-app', async () => {
    const result = await runAutoWithFixture({
      fixtureName: 'expo-app',
      installedSkills: [],
      expectedAdds: [
        ['callstackincubator/agent-skills', 'react-native-best-practices'],
        ['callstack/react-native-testing-library', 'react-native-testing'],
        ['callstackincubator/agent-skills', 'upgrading-react-native'],
        ['vercel-labs/agent-skills', 'vercel-react-native-skills'],
      ],
      expectedRemovals: [],
      command: ['auto'],
    });

    expect(result.exitCode).toBe(0);
  });

  it('adds the brownfield migration skill for brownfield-app', async () => {
    const result = await runAutoWithFixture({
      fixtureName: 'brownfield-app',
      installedSkills: [],
      expectedAdds: [
        [
          'callstackincubator/agent-skills',
          'react-native-brownfield-migration',
        ],
      ],
      expectedRemovals: [],
      command: ['auto'],
    });

    expect(result.exitCode).toBe(0);
  });

  it('adds the Software Mansion skill for reanimated-app', async () => {
    const result = await runAutoWithFixture({
      fixtureName: 'reanimated-app',
      installedSkills: [],
      expectedAdds: [
        ['software-mansion-labs/skills', 'react-native-best-practices'],
      ],
      expectedRemovals: [],
      command: ['auto'],
    });

    expect(result.exitCode).toBe(0);
  });

  it('does not remove installed skills that are outside the RN lookup', async () => {
    const result = await runAutoWithFixture({
      fixtureName: 'brownfield-app',
      installedSkills: [
        {
          name: 'github',
          path: '/tmp/.agents/skills/github',
          scope: 'project',
          agents: ['Cursor'],
        },
        {
          name: 'validate-skills',
          path: '/tmp/.agents/skills/validate-skills',
          scope: 'project',
          agents: ['Claude Code'],
        },
      ],
      expectedAdds: [
        [
          'callstackincubator/agent-skills',
          'react-native-brownfield-migration',
        ],
      ],
      expectedRemovals: [],
      command: ['auto'],
    });

    expect(result.exitCode).toBe(0);
  });

  it('does not remove extra managed skills when --no-remove is passed', async () => {
    const result = await runAutoWithFixture({
      fixtureName: 'expo-app',
      installedSkills: [
        {
          name: 'react-native-brownfield-migration',
          path: '/tmp/.agents/skills/react-native-brownfield-migration',
          scope: 'project',
          agents: ['Cursor'],
        },
      ],
      expectedAdds: [
        ['callstackincubator/agent-skills', 'react-native-best-practices'],
        ['callstack/react-native-testing-library', 'react-native-testing'],
        ['callstackincubator/agent-skills', 'upgrading-react-native'],
        ['vercel-labs/agent-skills', 'vercel-react-native-skills'],
      ],
      expectedRemovals: [],
      command: ['auto', '--no-remove'],
    });

    expect(result.exitCode).toBe(0);
  });
});

async function runAutoWithFixture(options: {
  fixtureName: string;
  installedSkills: Array<{
    name: string;
    path: string;
    scope: string;
    agents: string[];
  }>;
  expectedAdds: Array<[string, string]>;
  expectedRemovals: string[];
  command: string[];
}) {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'rn-skills-e2e-'));
  tempDirectories.push(workspaceRoot);

  const fixturePath = join(fixtureRoot, options.fixtureName, 'package.json');
  const projectDirectory = join(workspaceRoot, 'project');
  const binDirectory = join(workspaceRoot, 'bin');
  const logPath = join(workspaceRoot, 'skills-log.json');

  await mkdir(projectDirectory, {recursive: true});
  await mkdir(binDirectory, {recursive: true});
  await writeFile(
    join(projectDirectory, 'package.json'),
    await readFile(fixturePath, 'utf8'),
    'utf8',
  );
  await writeFile(logPath, '[]\n', 'utf8');

  const fakeNpxPath = join(binDirectory, 'npx');
  const fakeNpxTemplate = await readFile(templatePath, 'utf8');
  await writeFile(
    fakeNpxPath,
    fakeNpxTemplate.replace(
      '__INSTALLED_SKILLS_JSON__',
      JSON.stringify(JSON.stringify(options.installedSkills)),
    ),
    'utf8',
  );
  await chmod(fakeNpxPath, 0o755);

  const cliPath = resolve(testRoot, '..', 'src', 'index.ts');
  const processResult = Bun.spawnSync({
    cmd: ['bun', cliPath, ...options.command, '--cwd', projectDirectory],
    cwd: dirname(cliPath),
    env: {
      ...process.env,
      PATH: `${binDirectory}:${process.env.PATH ?? ''}`,
      RN_SKILLS_E2E_LOG_PATH: logPath,
    },
    stdout: 'pipe',
    stderr: 'pipe',
  });

  const invocations = JSON.parse(await readFile(logPath, 'utf8')) as string[][];
  const addInvocations = invocations
    .filter(
      (args) => args[0] === '-y' && args[1] === 'skills' && args[2] === 'add',
    )
    .map((args) => [args[3], args[5]] as [string, string])
    .sort((left, right) => left.join(' ').localeCompare(right.join(' ')));
  const removeInvocations = invocations
    .filter(
      (args) =>
        args[0] === '-y' && args[1] === 'skills' && args[2] === 'remove',
    )
    .map((args) => args[3])
    .sort((left, right) => left.localeCompare(right));

  expect(addInvocations).toEqual(
    [...options.expectedAdds].sort((left, right) =>
      left.join(' ').localeCompare(right.join(' ')),
    ),
  );
  expect(removeInvocations).toEqual(
    [...options.expectedRemovals].sort((left, right) =>
      left.localeCompare(right),
    ),
  );

  return processResult;
}
