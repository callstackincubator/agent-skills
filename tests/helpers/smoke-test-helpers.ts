import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";

export type MarketplacePluginEntry = {
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

export type MarketplaceManifest = {
  name: string;
  interface: {
    displayName: string;
  };
  plugins: MarketplacePluginEntry[];
};

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function createTempDir(prefix: string): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

export function cleanupTempDir(path: string): void {
  rmSync(path, { recursive: true, force: true });
}

export function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

export function readJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function parseFrontmatter(content: string): Record<string, unknown> {
  if (!matter.test(content)) {
    throw new Error("Missing YAML frontmatter block.");
  }

  const { data } = matter(content);

  return data as Record<string, unknown>;
}

export function getSourceCodexMarketplace(): MarketplaceManifest {
  return readJsonFile<MarketplaceManifest>(
    join(repoRoot, ".agents", "plugins", "marketplace.json")
  );
}

export function createCodexPluginFixtureRepo(tempRoot: string): {
  sourceRepoRoot: string;
  sourceManifest: MarketplaceManifest;
} {
  const sourceManifest = getSourceCodexMarketplace();
  const sourceRepoRoot = join(tempRoot, "source-repo");

  ensureDir(join(sourceRepoRoot, ".agents", "plugins"));
  writeFileSync(
    join(sourceRepoRoot, ".agents", "plugins", "marketplace.json"),
    `${JSON.stringify(sourceManifest, null, 2)}\n`,
    "utf8"
  );

  for (const plugin of sourceManifest.plugins) {
    const sourcePluginDir = resolve(repoRoot, plugin.source.path);
    const targetPluginDir = join(sourceRepoRoot, "plugins", plugin.name);
    cpSync(sourcePluginDir, targetPluginDir, { recursive: true, dereference: true });
  }

  execFileSync("git", ["init"], { cwd: sourceRepoRoot, stdio: "pipe" });
  execFileSync("git", ["config", "user.name", "Smoke Tests"], {
    cwd: sourceRepoRoot,
    stdio: "pipe"
  });
  execFileSync("git", ["config", "user.email", "smoke-tests@example.com"], {
    cwd: sourceRepoRoot,
    stdio: "pipe"
  });
  execFileSync("git", ["add", "."], { cwd: sourceRepoRoot, stdio: "pipe" });
  execFileSync("git", ["commit", "-m", "fixture"], { cwd: sourceRepoRoot, stdio: "pipe" });

  return { sourceRepoRoot, sourceManifest };
}

export function createSkillsFixtureRepo(tempRoot: string): string {
  const sourceRepoRoot = join(tempRoot, "skills-source-repo");
  const entriesToCopy = [
    ".agents",
    ".claude",
    ".claude-plugin",
    "skills"
  ];

  for (const entry of entriesToCopy) {
    cpSync(join(repoRoot, entry), join(sourceRepoRoot, entry), {
      recursive: true,
      dereference: true
    });
  }

  execFileSync("git", ["init"], { cwd: sourceRepoRoot, stdio: "pipe" });
  execFileSync("git", ["config", "user.name", "Smoke Tests"], {
    cwd: sourceRepoRoot,
    stdio: "pipe"
  });
  execFileSync("git", ["config", "user.email", "smoke-tests@example.com"], {
    cwd: sourceRepoRoot,
    stdio: "pipe"
  });
  execFileSync("git", ["add", "."], { cwd: sourceRepoRoot, stdio: "pipe" });
  execFileSync("git", ["commit", "-m", "fixture"], { cwd: sourceRepoRoot, stdio: "pipe" });

  return sourceRepoRoot;
}

export function writeGitUrlRewrite(homeDir: string, repoRef: string, sourceRepoRoot: string): void {
  ensureDir(homeDir);
  writeFileSync(
    join(homeDir, ".gitconfig"),
    [
      `[url "${pathToFileURL(sourceRepoRoot).href}"]`,
      `    insteadOf = https://github.com/${repoRef}.git`,
      ""
    ].join("\n"),
    "utf8"
  );
}

export function ensureBuiltCodexPluginCli(): string {
  const packageRoot = join(repoRoot, "packages", "codex-plugin");
  const cliPath = join(packageRoot, "dist", "index.js");

  execFileSync("bun", ["run", "build"], {
    cwd: packageRoot,
    stdio: "pipe"
  });

  return cliPath;
}

export function runCodexPluginInstaller({
  cliPath,
  cwd,
  homeDir,
  repoRef,
  scope
}: {
  cliPath: string;
  cwd: string;
  homeDir: string;
  repoRef: string;
  scope: "global" | "project";
}): void {
  execFileSync(
    "bun",
    [cliPath, "add", repoRef, `--${scope}`, "--yes"],
    {
      cwd,
      env: {
        ...process.env,
        HOME: homeDir
      },
      stdio: "pipe"
    }
  );
}
