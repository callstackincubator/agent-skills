#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import {cwd} from 'node:process';
import {cancel, intro, isCancel, multiselect, outro} from '@clack/prompts';
import {dim, italic} from 'colorette';

import {
  buildSkillPlan,
  getLookupTable,
  getSkillsCliArgs,
  scanProjectLibraries,
} from './core';
import type {InstalledSkill, Scope} from './core';
import {error, info, printBanner, section, success, warn} from './logger';

type Command = 'auto' | 'interactive' | 'report' | 'list-supported';

type CliOptions = {
  command: Command;
  scope: Scope;
  rootDirectory: string;
  help: boolean;
  remove: boolean;
};

function getUsage(): string {
  return 'Usage: rn-skills [report|interactive|auto|list-supported] [--global] [--cwd <path>] [--no-remove] [--help]';
}

function parseArgs(argv: string[]): CliOptions {
  if (argv.includes('--help') || argv.includes('-h')) {
    return {
      command: 'auto',
      scope: 'project',
      rootDirectory: cwd(),
      help: true,
      remove: true,
    };
  }

  const [firstArg, ...rest] = argv;
  let command: Command = 'auto';
  const input =
    firstArg === undefined
      ? []
      : firstArg === 'auto' ||
        firstArg === 'interactive' ||
        firstArg === 'report' ||
        firstArg === 'list-supported'
      ? [...rest]
      : firstArg.startsWith('--')
      ? [...argv]
      : (() => {
          throw new Error(getUsage());
        })();
  let scope: Scope = 'project';
  let rootDirectory = cwd();
  let remove = true;

  if (
    firstArg === 'auto' ||
    firstArg === 'interactive' ||
    firstArg === 'report' ||
    firstArg === 'list-supported'
  ) {
    command = firstArg;
  }

  while (input.length > 0) {
    const arg = input.shift()!;
    if (arg === '--global') {
      scope = 'global';
      continue;
    }
    if (arg === '--cwd') {
      const value = input.shift();
      if (!value) {
        throw new Error('Pass a directory after --cwd.');
      }

      rootDirectory = value;
      continue;
    }
    if (arg === '--no-remove') {
      remove = false;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    command,
    scope,
    rootDirectory,
    help: false,
    remove,
  };
}

async function getInstalledSkills(
  scope: Scope,
  rootDirectory: string,
): Promise<InstalledSkill[]> {
  const output = execFileSync(
    'npx',
    ['-y', 'skills', 'list', '--json', ...getSkillsCliArgs(scope)],
    {
      cwd: rootDirectory,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  return JSON.parse(output) as InstalledSkill[];
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    process.stdout.write(`${getUsage()}\n`);
    return;
  }

  printBanner();
  if (options.command === 'list-supported') {
    intro('Listing curated React Native library mappings');
    printSupportedMappings();
    outro('Listed supported libraries and skills.');
    return;
  }

  intro(`Inspecting ${options.rootDirectory}`);
  info(
    'Using the Vercel Skills CLI documented at https://vercel.com/docs/agent-resources/skills',
  );

  const scan = await scanProjectLibraries(options.rootDirectory);
  const installedSkills = await getInstalledSkills(
    options.scope,
    options.rootDirectory,
  );
  const plan = buildSkillPlan(scan, installedSkills);

  printPlan(plan, options.scope);

  if (options.command === 'report') {
    outro('Report complete. No changes applied.');
    return;
  }

  if (options.command === 'auto') {
    await applyChanges({
      rootDirectory: options.rootDirectory,
      scope: options.scope,
      installs: plan.missingSkills.map((skill) => skill.ref),
      removals: options.remove ? plan.extraInstalledSkills.map((skill) => skill.name) : [],
    });
    outro('Finished applying recommended skill changes.');
    return;
  }

  const installRefs = await askForInstalls(
    plan.missingSkills.map((skill) => skill.ref),
  );
  const removalNames = await askForRemovals(
    options.remove ? plan.extraInstalledSkills.map((skill) => skill.name) : [],
  );

  await applyChanges({
    rootDirectory: options.rootDirectory,
    scope: options.scope,
    installs: installRefs,
    removals: removalNames,
  });

  outro('Finished applying selected skill changes.');
}

function printSupportedMappings(): void {
  const lookup = getLookupTable();
  const sortedLibraries = Object.entries(lookup.libraries).sort(
    ([left], [right]) => left.localeCompare(right),
  );

  info(
    `The CLI provides the following ${sortedLibraries.length} curated library mappings.`,
  );

  for (const [libraryName, library] of sortedLibraries) {
    process.stdout.write(`- ${libraryName}\n`);

    for (const skillRef of library.skillRefs) {
      const [sourceRepo, skillName] = skillRef.split(':');
      const source = lookup.sources[sourceRepo];
      const skill = source?.skills.find(
        (candidate) => candidate.name === skillName,
      );
      const hint = source
        ? `\t· ${skillName} from ${source.displayName}`
        : skillRef;

      process.stdout.write(`  ${hint}\n`);
    }
  }
}

function printPlan(
  plan: ReturnType<typeof buildSkillPlan>,
  scope: Scope,
): void {
  section('Project Scan');
  info(
    `Found ${plan.packageJsonPaths.length} package.json file(s) and ${plan.libraries.length} dependency name(s).`,
  );
  info(`Comparing against ${scope} skills installed via \`npx skills\`.`);

  section('Recommended Skills');
  if (plan.recommendedSkills.length === 0) {
    warn('No recommended skills matched the detected libraries.');
  } else {
    for (const skill of plan.recommendedSkills) {
      process.stdout.write(
        `- ${skill.name} from ${skill.sourceRepo}\n` +
          `  matches: ${skill.matchedLibraries.join(', ')}\n` +
          `  reason: ${skill.description}\n`,
      );
    }
  }

  section('Missing Skills');
  if (plan.missingSkills.length === 0) {
    success('No missing skills.');
  } else {
    for (const skill of plan.missingSkills) {
      process.stdout.write(`- ${skill.name} from ${skill.sourceRepo}\n`);
    }
  }

  section('Installed But Not Needed');
  if (plan.extraInstalledSkills.length === 0) {
    success('No extra managed RN skills detected.');
  } else {
    for (const skill of plan.extraInstalledSkills) {
      process.stdout.write(`- ${skill.name}\n`);
    }
  }

  if (plan.ignoredInstalledSkills.length > 0) {
    section('Ignored Installed Skills');
    info(
      `Leaving ${
        plan.ignoredInstalledSkills.length
      } installed skill(s) alone because they are outside the RN lookup table: ${plan.ignoredInstalledSkills
        .map((skill) => skill.name)
        .join(', ')}`,
    );
  }
}

async function askForInstalls(skillRefs: string[]): Promise<string[]> {
  if (skillRefs.length === 0) {
    return [];
  }

  const lookup = getLookupTable();
  const selection = await multiselect<string>({
    message: 'Which missing skills should rn-skills install?',
    options: skillRefs.map((ref) => {
      const [sourceRepo, skillName] = ref.split(':');
      const source = lookup.sources[sourceRepo];

      return {
        value: ref,
        label: skillName,
        hint: source?.displayName ?? sourceRepo,
        selected: true,
      };
    }),
  });

  if (isCancel(selection)) {
    cancel('Interactive install selection cancelled.');
    process.exit(1);
  }

  return selection;
}

async function askForRemovals(skillNames: string[]): Promise<string[]> {
  if (skillNames.length === 0) {
    return [];
  }

  const selection = await multiselect<string>({
    message: 'Which extra skills should rn-skills remove?',
    options: skillNames.map((skillName) => ({
      value: skillName,
      label: skillName,
      selected: true,
    })),
  });

  if (isCancel(selection)) {
    cancel('Interactive removal selection cancelled.');
    process.exit(1);
  }

  return selection;
}

async function applyChanges(options: {
  rootDirectory: string;
  scope: Scope;
  installs: string[];
  removals: string[];
}): Promise<void> {
  if (options.installs.length === 0 && options.removals.length === 0) {
    info('Nothing to change.');
    return;
  }

  for (const ref of options.installs) {
    const [sourceRepo, skillName] = ref.split(':');
    info(
      `Installing ${skillName} from ${sourceRepo} using the Vercel Skills CLI (${dim(
        italic('npx skills add'),
      )})`,
    );
    execFileSync(
      'npx',
      [
        '-y',
        'skills',
        'add',
        sourceRepo,
        '--skill',
        skillName,
        '--yes',
        ...getSkillsCliArgs(options.scope),
      ],
      {
        cwd: options.rootDirectory,
        stdio: 'inherit',
      },
    );
  }

  for (const skillName of options.removals) {
    info(`Removing ${skillName}`);
    execFileSync(
      'npx',
      [
        '-y',
        'skills',
        'remove',
        skillName,
        '--yes',
        ...getSkillsCliArgs(options.scope),
      ],
      {
        cwd: options.rootDirectory,
        stdio: 'inherit',
      },
    );
  }

  success('Skill changes applied.');
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  error(message);
  process.exit(1);
});
