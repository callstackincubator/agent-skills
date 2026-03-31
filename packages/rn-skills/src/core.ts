import {Dirent} from 'node:fs';
import {
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import lookupTableJson from './lookup-table.json';

export type Scope = 'project' | 'global';

export type LookupSkill = {
  name: string;
  description: string;
};

export type LookupSource = {
  repo: string;
  displayName: string;
  skills: LookupSkill[];
};

export type LookupLibrary = {
  skillRefs: string[];
};

export type LookupTable = {
  catalogVersion: number;
  lastSyncedAt: string;
  sources: Record<string, LookupSource>;
  libraries: Record<string, LookupLibrary>;
};

export type InstalledSkill = {
  name: string;
  path: string;
  scope: string;
  agents: string[];
};

export type RecommendedSkill = {
  ref: string;
  sourceRepo: string;
  sourceDisplayName: string;
  name: string;
  description: string;
  matchedLibraries: string[];
};

export type ProjectScan = {
  packageJsonPaths: string[];
  libraries: string[];
};

export type SkillPlan = {
  packageJsonPaths: string[];
  libraries: string[];
  recommendedSkills: RecommendedSkill[];
  missingSkills: RecommendedSkill[];
  extraInstalledSkills: InstalledSkill[];
  ignoredInstalledSkills: InstalledSkill[];
};

type PackageManifest = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

const lookupTable = lookupTableJson as LookupTable;

const IGNORE_DIRECTORY_NAMES = new Set([
  '.git',
  '.hg',
  '.next',
  '.turbo',
  '.yarn',
  'android',
  'build',
  'coverage',
  'dist',
  'ios',
  'node_modules',
  'Pods',
]);

export function getLookupTable(): LookupTable {
  return lookupTable;
}

export async function discoverPackageJsonPaths(
  rootDirectory: string,
): Promise<string[]> {
  const results: string[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory, {withFileTypes: true});

    for (const entry of entries) {
      if (shouldSkipEntry(entry)) {
        continue;
      }

      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name === 'package.json') {
        results.push(fullPath);
      }
    }
  }

  await walk(rootDirectory);
  return results.sort();
}

function shouldSkipEntry(entry: Dirent): boolean {
  if (!entry.isDirectory()) {
    return false;
  }

  return IGNORE_DIRECTORY_NAMES.has(entry.name);
}

export async function scanProjectLibraries(
  rootDirectory: string,
): Promise<ProjectScan> {
  const packageJsonPaths = await discoverPackageJsonPaths(rootDirectory);
  const libraries = new Set<string>();

  for (const packageJsonPath of packageJsonPaths) {
    const manifest = await readJsonFile<PackageManifest>(packageJsonPath);
    for (const dependencyGroup of [
      manifest.dependencies,
      manifest.devDependencies,
      manifest.peerDependencies,
      manifest.optionalDependencies,
    ]) {
      if (!dependencyGroup) {
        continue;
      }

      for (const libraryName of Object.keys(dependencyGroup)) {
        libraries.add(libraryName);
      }
    }
  }

  return {
    packageJsonPaths,
    libraries: Array.from(libraries).sort(),
  };
}

export function buildSkillPlan(
  scan: ProjectScan,
  installedSkills: InstalledSkill[],
): SkillPlan {
  const catalog = getLookupTable();
  const matchedByRef = new Map<string, Set<string>>();

  for (const libraryName of scan.libraries) {
    const lookupEntry = catalog.libraries[libraryName];
    if (!lookupEntry) {
      continue;
    }

    for (const skillRef of lookupEntry.skillRefs) {
      if (!matchedByRef.has(skillRef)) {
        matchedByRef.set(skillRef, new Set());
      }

      matchedByRef.get(skillRef)!.add(libraryName);
    }
  }

  const recommendedSkills = Array.from(matchedByRef.entries())
    .map(([ref, matchedLibraries]) =>
      getRecommendedSkill(ref, matchedLibraries),
    )
    .sort(
      (left, right) =>
        left.name.localeCompare(right.name) ||
        left.sourceRepo.localeCompare(right.sourceRepo),
    );

  const recommendedNames = new Set(
    recommendedSkills.map((skill) => skill.name),
  );
  const managedSkillNames = new Set(
    Object.values(catalog.libraries)
      .flatMap((library) => library.skillRefs)
      .map((ref) => ref.split(':')[1])
      .filter((name): name is string => Boolean(name)),
  );

  const missingSkills = recommendedSkills.filter(
    (skill) =>
      !installedSkills.some((installed) => installed.name === skill.name),
  );
  const extraInstalledSkills = installedSkills
    .filter(
      (installed) =>
        managedSkillNames.has(installed.name) &&
        !recommendedNames.has(installed.name),
    )
    .sort((left, right) => left.name.localeCompare(right.name));
  const ignoredInstalledSkills = installedSkills
    .filter((installed) => !managedSkillNames.has(installed.name))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    packageJsonPaths: scan.packageJsonPaths,
    libraries: scan.libraries,
    recommendedSkills,
    missingSkills,
    extraInstalledSkills,
    ignoredInstalledSkills,
  };
}

export async function createTempProject(
  packageJsonFiles: Record<string, object>,
): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'rn-skills-'));

  for (const [relativePath, contents] of Object.entries(packageJsonFiles)) {
    const absolutePath = join(directory, relativePath);
    await mkdir(dirname(absolutePath), {recursive: true});
    await writeFile(
      absolutePath,
      `${JSON.stringify(contents, null, 2)}\n`,
      'utf8',
    );
  }

  return directory;
}

export async function removeTempProject(directory: string): Promise<void> {
  await rm(directory, {recursive: true, force: true});
}

function getRecommendedSkill(
  ref: string,
  matchedLibraries: Set<string>,
): RecommendedSkill {
  const [sourceRepo, skillName] = ref.split(':');
  if (!sourceRepo || !skillName) {
    throw new Error(`Invalid skill reference: ${ref}`);
  }

  const source = lookupTable.sources[sourceRepo];
  if (!source) {
    throw new Error(`Unknown source repository in lookup table: ${sourceRepo}`);
  }

  const skill = source.skills.find((candidate) => candidate.name === skillName);
  if (!skill) {
    throw new Error(`Unknown skill "${skillName}" for source "${sourceRepo}"`);
  }

  return {
    ref,
    sourceRepo,
    sourceDisplayName: source.displayName,
    name: skill.name,
    description: skill.description,
    matchedLibraries: Array.from(matchedLibraries).sort(),
  };
}

async function readJsonFile<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

export function getSkillsCliArgs(scope: Scope): string[] {
  return scope === 'global' ? ['-g'] : [];
}
