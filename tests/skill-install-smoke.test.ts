import { describe, expect, setDefaultTimeout, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  cleanupTempDir,
  createSkillsFixtureRepo,
  createTempDir,
  repoRoot,
  writeGitUrlRewrite
} from "./helpers/smoke-test-helpers";

const repoRef = "callstackincubator/agent-skills";
const skillsCliPath = resolve(repoRoot, "node_modules", ".bin", "skills");
const useLatestSkillsCli = process.env.SMOKE_SKILLS_CLI_CHANNEL === "latest";

setDefaultTimeout(20_000);

function runSkillsAdd(
  source: string,
  args: string[],
  {
    cwd,
    homeDir
  }: {
    cwd: string;
    homeDir: string;
  }
): string {
  const command = useLatestSkillsCli ? "npx" : skillsCliPath;
  const commandArgs = useLatestSkillsCli
    ? ["-y", "skills@latest", "add", source, ...args]
    : ["add", source, ...args];

  return execFileSync(command, commandArgs, {
    cwd,
    env: {
      ...process.env,
      HOME: homeDir,
      FORCE_COLOR: "0",
      NO_COLOR: "1",
      npm_config_audit: "false",
      npm_config_fund: "false",
      npm_config_update_notifier: "false"
    },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

describe("skill install smoke", () => {
  test(`uses the expected skills CLI channel (${useLatestSkillsCli ? "latest" : "pinned"})`, () => {
    expect(useLatestSkillsCli ? "latest" : "pinned").toBe(
      process.env.SMOKE_SKILLS_CLI_CHANNEL === "latest" ? "latest" : "pinned"
    );
  });

  test("lists skills from a remote repository source without creating install output", () => {
    const tempRoot = createTempDir("skill-list-smoke-");
    const homeDir = createTempDir("skill-list-home-");

    try {
      const sourceRepoRoot = createSkillsFixtureRepo(tempRoot);
      writeGitUrlRewrite(homeDir, repoRef, sourceRepoRoot);

      const output = runSkillsAdd(repoRef, ["--list"], {
        cwd: tempRoot,
        homeDir
      });

      expect(output).toContain("github");
      expect(output).toContain("react-native-best-practices");
      expect(output).toContain("upgrading-react-native");

      expect(existsSync(join(tempRoot, ".claude"))).toBe(false);
      expect(existsSync(join(tempRoot, ".agents"))).toBe(false);
      expect(existsSync(join(tempRoot, "skills-lock.json"))).toBe(false);
    } finally {
      cleanupTempDir(tempRoot);
      cleanupTempDir(homeDir);
    }
  });

  test("installs a selected skill from a remote repository source into the project Codex layout", () => {
    const tempRoot = createTempDir("skill-project-codex-smoke-");
    const homeDir = createTempDir("skill-project-codex-home-");

    try {
      const sourceRepoRoot = createSkillsFixtureRepo(tempRoot);
      writeGitUrlRewrite(homeDir, repoRef, sourceRepoRoot);

      runSkillsAdd(repoRef, ["--skill", "github", "--agent", "codex", "-y", "--copy"], {
        cwd: tempRoot,
        homeDir
      });

      const installedSkillPath = join(tempRoot, ".agents", "skills", "github", "SKILL.md");

      expect(existsSync(installedSkillPath)).toBe(true);
      expect(existsSync(join(tempRoot, ".agents", "skills", "github", "agents", "openai.yaml"))).toBe(
        true
      );
      expect(existsSync(join(tempRoot, "skills-lock.json"))).toBe(true);
      expect(readFileSync(installedSkillPath, "utf8")).toContain("name: github");

      expect(existsSync(join(tempRoot, ".claude"))).toBe(false);
      expect(existsSync(join(homeDir, ".agents"))).toBe(false);
      expect(existsSync(join(homeDir, ".claude"))).toBe(false);
    } finally {
      cleanupTempDir(tempRoot);
      cleanupTempDir(homeDir);
    }
  });

  test("installs a selected skill from a remote repository source into the global Claude layout using fake HOME", () => {
    const tempRoot = createTempDir("skill-global-claude-smoke-");
    const homeDir = createTempDir("skill-global-claude-home-");

    try {
      const sourceRepoRoot = createSkillsFixtureRepo(tempRoot);
      writeGitUrlRewrite(homeDir, repoRef, sourceRepoRoot);

      runSkillsAdd(repoRef, ["--skill", "github", "--agent", "claude-code", "--global", "-y", "--copy"], {
        cwd: tempRoot,
        homeDir
      });

      const installedSkillPath = join(homeDir, ".claude", "skills", "github", "SKILL.md");

      expect(existsSync(installedSkillPath)).toBe(true);
      expect(
        existsSync(join(homeDir, ".claude", "skills", "github", "references", "stacked-pr-workflow.md"))
      ).toBe(true);
      expect(readFileSync(installedSkillPath, "utf8")).toContain("name: github");

      expect(existsSync(join(tempRoot, ".claude"))).toBe(false);
      expect(existsSync(join(tempRoot, ".agents"))).toBe(false);
      expect(existsSync(join(tempRoot, "skills-lock.json"))).toBe(false);
      expect(existsSync(join(homeDir, ".agents", "skills"))).toBe(false);
    } finally {
      cleanupTempDir(tempRoot);
      cleanupTempDir(homeDir);
    }
  });
});
