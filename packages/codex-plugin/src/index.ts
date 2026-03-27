import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { cancel, confirm, intro, isCancel, outro, select } from "@clack/prompts";

type InstallScope = "global" | "project";

type MarketplaceManifest = {
  name: string;
  interface: {
    displayName: string;
  };
  plugins: MarketplacePluginEntry[];
};

type MarketplacePluginEntry = {
  name: string;
  source: {
    source: "local";
    path: string;
  };
  policy: {
    installation: "AVAILABLE" | "NOT_AVAILABLE" | "INSTALLED_BY_DEFAULT";
    authentication: "ON_INSTALL" | "ON_USE";
  };
  category: string;
};

type CliOptions = {
  command: "add";
  repoRef: string;
  scope?: InstallScope;
  gitRef?: string;
  yes: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const [command, ...rest] = argv;
  if (command !== "add") {
    throw new Error(
      "Usage: codex-plugin add <org/repo> [--project|--global] [--ref <branch-or-tag>] [--yes]"
    );
  }

  const input = [...rest];
  let repoRef = "";
  let scope: InstallScope | undefined;
  let gitRef: string | undefined;
  let yes = false;

  while (input.length > 0) {
    const arg = input.shift()!;
    if (arg === "--project") {
      if (scope) {
        throw new Error("Use only one of --project or --global.");
      }
      scope = "project";
      continue;
    }
    if (arg === "--global") {
      if (scope) {
        throw new Error("Use only one of --project or --global.");
      }
      scope = "global";
      continue;
    }
    if (arg === "--yes") {
      yes = true;
      continue;
    }
    if (arg === "--ref") {
      const value = input.shift()?.trim();
      if (!value) {
        throw new Error("Pass a branch, tag, or commit after --ref.");
      }
      gitRef = value;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`Unknown flag: ${arg}`);
    }
    if (repoRef) {
      throw new Error("Pass exactly one repository argument in the form org/repo.");
    }
    repoRef = arg;
  }

  if (!repoRef || !/^[^/\s]+\/[^/\s]+$/.test(repoRef)) {
    throw new Error(
      "Usage: codex-plugin add <org/repo> [--project|--global] [--ref <branch-or-tag>] [--yes]"
    );
  }

  return { command: "add", repoRef, scope, gitRef, yes };
}

async function chooseScope(providedScope?: InstallScope): Promise<InstallScope> {
  if (providedScope) {
    return providedScope;
  }

  const result = await select<InstallScope>({
    message: "Install marketplace where?",
    options: [
      {
        value: "global",
        label: "Global",
        hint: "~/.agents/plugins/marketplace.json + ~/.codex/plugins"
      },
      {
        value: "project",
        label: "Project",
        hint: "./.agents/plugins/marketplace.json + ./.codex/plugins"
      }
    ]
  });

  if (isCancel(result)) {
    cancel("Installation cancelled.");
    process.exit(1);
  }

  return result;
}

function getRepoUrl(repoRef: string): string {
  return `https://github.com/${repoRef}.git`;
}

function cloneRepo(repoUrl: string, gitRef?: string): string {
  const cloneRoot = join(tmpdir(), `callstack-marketplace-${Date.now()}`);
  const args = ["clone", "--depth", "1"];
  if (gitRef) {
    args.push("--branch", gitRef);
  }
  args.push(repoUrl, cloneRoot);
  execFileSync("git", args, {
    stdio: "inherit"
  });
  return cloneRoot;
}

function getPaths(scope: InstallScope, cwd: string) {
  const home = process.env.HOME;
  if (!home) {
    throw new Error("HOME is not set.");
  }

  if (scope === "global") {
    return {
      marketplacePath: join(home, ".agents", "plugins", "marketplace.json"),
      pluginRepoRoot: join(home, ".codex", "plugins")
    };
  }

  return {
    marketplacePath: join(cwd, ".agents", "plugins", "marketplace.json"),
    pluginRepoRoot: join(cwd, ".codex", "plugins")
  };
}

function loadJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function resolveSourceRepoRoot(clonedRepoRoot: string): string {
  const clonedManifestPath = join(clonedRepoRoot, ".agents", "plugins", "marketplace.json");
  if (existsSync(clonedManifestPath)) {
    return clonedRepoRoot;
  }

  throw new Error(
    "Remote clone does not contain .agents/plugins/marketplace.json. Push the marketplace files before using this installer."
  );
}

function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

function copyPluginsPayload(
  clonedRepoRoot: string,
  pluginRoot: string,
  manifest: MarketplaceManifest
): void {
  ensureDir(pluginRoot);

  for (const plugin of manifest.plugins) {
    const sourcePluginDir = join(clonedRepoRoot, "plugins", plugin.name);
    const targetPluginDir = join(pluginRoot, plugin.name);
    rmSync(targetPluginDir, { recursive: true, force: true });
    cpSync(sourcePluginDir, targetPluginDir, { recursive: true, dereference: true });
  }
}

function rewriteEntriesForScope(manifest: MarketplaceManifest): MarketplacePluginEntry[] {
  return manifest.plugins.map((plugin) => {
    return {
      ...plugin,
      source: {
        source: "local",
        path: `./.codex/plugins/${plugin.name}`
      }
    };
  });
}

function mergeMarketplace(
  marketplacePath: string,
  sourceManifest: MarketplaceManifest,
  pluginsToMerge: MarketplacePluginEntry[]
): MarketplaceManifest {
  const existing = existsSync(marketplacePath)
    ? loadJsonFile<MarketplaceManifest>(marketplacePath)
    : {
        name: "user-personal-marketplace",
        interface: {
          displayName: "User Personal Makretplace"
        },
        plugins: []
      };

  const mergedByName = new Map<string, MarketplacePluginEntry>();

  for (const plugin of existing.plugins) {
    mergedByName.set(plugin.name, plugin);
  }
  for (const plugin of pluginsToMerge) {
    mergedByName.set(plugin.name, plugin);
  }

  return {
    name: existing.name ?? sourceManifest.name,
    interface: existing.interface ?? sourceManifest.interface,
    plugins: Array.from(mergedByName.values())
  };
}

function saveMarketplace(path: string, manifest: MarketplaceManifest): void {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function confirmInstall(
  repoRef: string,
  scope: InstallScope,
  pluginNames: string[],
  gitRef: string | undefined,
  yes: boolean
): Promise<void> {
  if (yes) {
    return;
  }

  const message = [
    `Install marketplace from ${repoRef}?`,
    `Scope: ${scope}`,
    gitRef ? `Ref: ${gitRef}` : "Ref: default branch",
    "Plugins:",
    ...pluginNames.map((name) => `- ${name}`)
  ].join("\n");

  const approved = await confirm({
    message
  });

  if (isCancel(approved) || !approved) {
    cancel("Installation cancelled.");
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  intro("Marketplace");

  const scope = await chooseScope(options.scope);
  const repoUrl = getRepoUrl(options.repoRef);
  const clonedRepoRoot = cloneRepo(repoUrl, options.gitRef);

  try {
    const sourceRepoRoot = resolveSourceRepoRoot(clonedRepoRoot);
    const sourceManifest = loadJsonFile<MarketplaceManifest>(
      join(sourceRepoRoot, ".agents", "plugins", "marketplace.json")
    );
    const pluginNames = sourceManifest.plugins.map((plugin) => plugin.name);
    await confirmInstall(options.repoRef, scope, pluginNames, options.gitRef, options.yes);

    const { marketplacePath, pluginRepoRoot } = getPaths(scope, process.cwd());

    copyPluginsPayload(sourceRepoRoot, pluginRepoRoot, sourceManifest);
    const pluginsToMerge = rewriteEntriesForScope(sourceManifest);

    const mergedMarketplace = mergeMarketplace(
      marketplacePath,
      sourceManifest,
      pluginsToMerge
    );

    saveMarketplace(marketplacePath, mergedMarketplace);

    outro(
      [
        `Installed marketplace to ${marketplacePath}`,
        `Copied plugins to ${pluginRepoRoot}`,
        "Restart Codex to pick up the updated marketplace."
      ].join("\n")
    );
  } finally {
    rmSync(clonedRepoRoot, { recursive: true, force: true });
  }
}

await main();
