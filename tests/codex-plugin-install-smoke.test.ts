import { beforeAll, describe, expect, setDefaultTimeout, test } from "bun:test";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  cleanupTempDir,
  createCodexPluginFixtureRepo,
  createTempDir,
  ensureBuiltCodexPluginCli,
  ensureDir,
  readJsonFile,
  runCodexPluginInstaller,
  writeGitUrlRewrite,
  type MarketplaceManifest
} from "./helpers/smoke-test-helpers";

const repoRef = "callstackincubator/agent-skills";

let cliPath = "";

setDefaultTimeout(20_000);

beforeAll(() => {
  cliPath = ensureBuiltCodexPluginCli();
});

describe("codex-plugin install smoke", () => {
  test("installs project marketplace into the working directory", () => {
    const tempRoot = createTempDir("codex-plugin-project-smoke-");

    try {
      const { sourceRepoRoot, sourceManifest } = createCodexPluginFixtureRepo(tempRoot);
      const workspaceRoot = join(tempRoot, "workspace");
      const homeDir = join(tempRoot, "home");

      ensureDir(workspaceRoot);
      writeGitUrlRewrite(homeDir, repoRef, sourceRepoRoot);

      runCodexPluginInstaller({
        cliPath,
        cwd: workspaceRoot,
        homeDir,
        repoRef,
        scope: "project"
      });

      const marketplacePath = join(workspaceRoot, ".agents", "plugins", "marketplace.json");
      const installedMarketplace = readJsonFile<MarketplaceManifest>(marketplacePath);

      expect(installedMarketplace.plugins.map((plugin) => plugin.name).sort()).toEqual(
        sourceManifest.plugins.map((plugin) => plugin.name).sort()
      );

      for (const plugin of sourceManifest.plugins) {
        const installedPluginRoot = join(workspaceRoot, ".codex", "plugins", plugin.name);
        const installedPluginEntry = installedMarketplace.plugins.find(
          (entry) => entry.name === plugin.name
        );

        expect(existsSync(installedPluginRoot)).toBe(true);
        expect(existsSync(join(installedPluginRoot, ".codex-plugin", "plugin.json"))).toBe(true);
        expect(existsSync(join(installedPluginRoot, "README.md"))).toBe(true);
        expect(installedPluginEntry?.source.path).toBe(`./.codex/plugins/${plugin.name}`);
      }

      expect(existsSync(join(homeDir, ".agents", "plugins", "marketplace.json"))).toBe(false);
      expect(existsSync(join(homeDir, ".codex", "plugins"))).toBe(false);
    } finally {
      cleanupTempDir(tempRoot);
    }
  });

  test("installs global marketplace into a fake HOME without touching the workspace", () => {
    const tempRoot = createTempDir("codex-plugin-global-smoke-");

    try {
      const { sourceRepoRoot, sourceManifest } = createCodexPluginFixtureRepo(tempRoot);
      const workspaceRoot = join(tempRoot, "workspace");
      const homeDir = join(tempRoot, "home");

      ensureDir(workspaceRoot);
      writeGitUrlRewrite(homeDir, repoRef, sourceRepoRoot);

      runCodexPluginInstaller({
        cliPath,
        cwd: workspaceRoot,
        homeDir,
        repoRef,
        scope: "global"
      });

      const marketplacePath = join(homeDir, ".agents", "plugins", "marketplace.json");
      const installedMarketplace = readJsonFile<MarketplaceManifest>(marketplacePath);

      expect(installedMarketplace.plugins.map((plugin) => plugin.name).sort()).toEqual(
        sourceManifest.plugins.map((plugin) => plugin.name).sort()
      );

      for (const plugin of sourceManifest.plugins) {
        const installedPluginRoot = join(homeDir, ".codex", "plugins", plugin.name);
        const installedPluginEntry = installedMarketplace.plugins.find(
          (entry) => entry.name === plugin.name
        );

        expect(existsSync(installedPluginRoot)).toBe(true);
        expect(existsSync(join(installedPluginRoot, ".codex-plugin", "plugin.json"))).toBe(true);
        expect(installedPluginEntry?.source.path).toBe(`./.codex/plugins/${plugin.name}`);
      }

      expect(existsSync(join(workspaceRoot, ".agents"))).toBe(false);
      expect(existsSync(join(workspaceRoot, ".codex"))).toBe(false);
    } finally {
      cleanupTempDir(tempRoot);
    }
  });

  test("merges into an existing marketplace and stays stable across duplicate installs", () => {
    const tempRoot = createTempDir("codex-plugin-merge-smoke-");

    try {
      const { sourceRepoRoot, sourceManifest } = createCodexPluginFixtureRepo(tempRoot);
      const workspaceRoot = join(tempRoot, "workspace");
      const homeDir = join(tempRoot, "home");
      const marketplacePath = join(workspaceRoot, ".agents", "plugins", "marketplace.json");

      ensureDir(join(workspaceRoot, ".agents", "plugins"));
      writeGitUrlRewrite(homeDir, repoRef, sourceRepoRoot);

      writeFileSync(
        marketplacePath,
        `${JSON.stringify(
          {
            name: "custom-marketplace",
            interface: {
              displayName: "Existing Marketplace"
            },
            plugins: [
              {
                name: "existing-plugin",
                source: {
                  source: "local",
                  path: "./.codex/plugins/existing-plugin"
                },
                policy: {
                  installation: "AVAILABLE",
                  authentication: "ON_INSTALL"
                },
                category: "Utility"
              },
              {
                name: sourceManifest.plugins[0]!.name,
                source: {
                  source: "local",
                  path: "./.codex/plugins/stale-copy"
                },
                policy: {
                  installation: "AVAILABLE",
                  authentication: "ON_INSTALL"
                },
                category: "Stale"
              }
            ]
          },
          null,
          2
        )}\n`,
        "utf8"
      );

      runCodexPluginInstaller({
        cliPath,
        cwd: workspaceRoot,
        homeDir,
        repoRef,
        scope: "project"
      });
      runCodexPluginInstaller({
        cliPath,
        cwd: workspaceRoot,
        homeDir,
        repoRef,
        scope: "project"
      });

      const mergedMarketplace = readJsonFile<MarketplaceManifest>(marketplacePath);
      const mergedNames = mergedMarketplace.plugins.map((plugin) => plugin.name);

      expect(mergedMarketplace.name).toBe("custom-marketplace");
      expect(mergedMarketplace.interface.displayName).toBe("Existing Marketplace");
      expect(mergedNames.filter((name) => name === "existing-plugin")).toHaveLength(1);
      expect(mergedNames.filter((name) => name === sourceManifest.plugins[0]!.name)).toHaveLength(1);
      expect(mergedNames.sort()).toEqual(
        ["existing-plugin", ...sourceManifest.plugins.map((plugin) => plugin.name)].sort()
      );

      for (const plugin of sourceManifest.plugins) {
        const installedPluginEntry = mergedMarketplace.plugins.find(
          (entry) => entry.name === plugin.name
        );

        expect(installedPluginEntry?.source.path).toBe(`./.codex/plugins/${plugin.name}`);
      }
    } finally {
      cleanupTempDir(tempRoot);
    }
  });
});
