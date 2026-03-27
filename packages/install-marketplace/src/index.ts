#!/usr/bin/env bun

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
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
  yes: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const [command, ...rest] = argv;
  if (command !== "add") {
    throw new Error("Usage: marketplace add <org/repo> [--project|--global] [--yes]");
  }

  let repoRef = "";
  let scope: InstallScope | undefined;
  let yes = false;

  for (const arg of rest) {
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
    if (arg.startsWith("--")) {
      throw new Error(`Unknown flag: ${arg}`);
    }
    if (repoRef) {
      throw new Error("Pass exactly one repository argument in the form org/repo.");
    }
    repoRef = arg;
  }

  if (!repoRef || !/^[^/\s]+\/[^/\s]+$/.test(repoRef)) {
    throw new Error("Usage: marketplace add <org/repo> [--project|--global] [--yes]");
  }

  return { command: "add", repoRef, scope, yes };
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

function cloneRepo(repoUrl: string): string {
  const cloneRoot = join(tmpdir(), `callstack-marketplace-${Date.now()}`);
  execFileSync("git", ["clone", "--depth", "1", repoUrl, cloneRoot], {
    stdio: "inherit"
  });
  return cloneRoot;
}

function getPaths(scope: InstallScope, cwd: string, repoRef: string) {
  const home = process.env.HOME;
  if (!home) {
    throw new Error("HOME is not set.");
  }

  if (scope === "global") {
    return {
      marketplacePath: join(home, ".agents", "plugins", "marketplace.json"),
      pluginRepoRoot: join(home, ".codex", "plugins", repoRef)
    };
  }

  return {
    marketplacePath: join(cwd, ".agents", "plugins", "marketplace.json"),
    pluginRepoRoot: join(cwd, ".codex", "plugins", repoRef)
  };
}

function loadJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function resolveSourceRepoRoot(clonedRepoRoot: string): string {
  const clonedManifestPath = join(clonedRepoRoot, "plugins", "manifest.json");
  if (existsSync(clonedManifestPath)) {
    return clonedRepoRoot;
  }

  throw new Error(
    "Remote clone does not contain plugins/manifest.json. Push the marketplace files before using this installer."
  );
}

function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

function copyPluginsPayload(clonedRepoRoot: string, pluginRepoRoot: string): void {
  const sourcePluginsDir = join(clonedRepoRoot, "plugins");
  const targetPluginsDir = join(pluginRepoRoot, "plugins");

  rmSync(pluginRepoRoot, { recursive: true, force: true });
  ensureDir(pluginRepoRoot);
  cpSync(sourcePluginsDir, targetPluginsDir, { recursive: true, dereference: false });
}

function rewriteEntries(
  manifest: MarketplaceManifest,
  marketplacePath: string,
  repoRef: string
): MarketplacePluginEntry[] {
  const marketplaceRoot = dirname(marketplacePath);

  return manifest.plugins.map((plugin) => {
    const absolutePluginPath = join(
      marketplaceRoot,
      "..",
      "..",
      ".codex",
      "plugins",
      repoRef,
      "plugins",
      plugin.name
    );

    return {
      ...plugin,
      source: {
        source: "local",
        path: relative(marketplaceRoot, absolutePluginPath)
      }
    };
  });
}

function mergeMarketplace(
  marketplacePath: string,
  sourceManifest: MarketplaceManifest,
  rewrittenPlugins: MarketplacePluginEntry[]
): MarketplaceManifest {
  const existing = existsSync(marketplacePath)
    ? loadJsonFile<MarketplaceManifest>(marketplacePath)
    : {
        name: sourceManifest.name,
        interface: sourceManifest.interface,
        plugins: []
      };

  const mergedByName = new Map<string, MarketplacePluginEntry>();

  for (const plugin of existing.plugins) {
    mergedByName.set(plugin.name, plugin);
  }
  for (const plugin of rewrittenPlugins) {
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
  yes: boolean
): Promise<void> {
  if (yes) {
    return;
  }

  const message = [
    `Install marketplace from ${repoRef}?`,
    `Scope: ${scope}`,
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
  const clonedRepoRoot = cloneRepo(repoUrl);

  try {
    const sourceRepoRoot = resolveSourceRepoRoot(clonedRepoRoot);
    const sourceManifest = loadJsonFile<MarketplaceManifest>(
      join(sourceRepoRoot, "plugins", "manifest.json")
    );
    const pluginNames = sourceManifest.plugins.map((plugin) => plugin.name);
    await confirmInstall(options.repoRef, scope, pluginNames, options.yes);

    const { marketplacePath, pluginRepoRoot } = getPaths(scope, process.cwd(), options.repoRef);

    copyPluginsPayload(sourceRepoRoot, pluginRepoRoot);

    const rewrittenPlugins = rewriteEntries(sourceManifest, marketplacePath, options.repoRef);
    const mergedMarketplace = mergeMarketplace(
      marketplacePath,
      sourceManifest,
      rewrittenPlugins
    );

    saveMarketplace(marketplacePath, mergedMarketplace);

    outro(
      [
        `Installed marketplace to ${marketplacePath}`,
        `Copied plugin payload to ${join(pluginRepoRoot, "plugins")}`,
        "Restart Codex to pick up the updated marketplace."
      ].join("\n")
    );
  } finally {
    rmSync(clonedRepoRoot, { recursive: true, force: true });
  }
}

await main();
