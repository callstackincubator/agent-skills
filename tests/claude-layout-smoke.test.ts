import { describe, expect, test } from "bun:test";
import { cpSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  createTempDir,
  cleanupTempDir,
  parseFrontmatter,
  readJsonFile,
  repoRoot
} from "./helpers/smoke-test-helpers";

type ClaudeMarketplacePlugin = {
  name: string;
  source: string;
  skills: string[];
};

type ClaudeMarketplaceManifest = {
  name: string;
  plugins: ClaudeMarketplacePlugin[];
};

function getClaudeMarketplace(): ClaudeMarketplaceManifest {
  return readJsonFile<ClaudeMarketplaceManifest>(
    join(repoRoot, ".claude-plugin", "marketplace.json")
  );
}

describe("claude layout smoke", () => {
  test("parses the Claude marketplace and resolves plugin skills under the plugin source", () => {
    const manifest = getClaudeMarketplace();

    expect(manifest.name).toBeString();
    expect(manifest.plugins.length).toBeGreaterThan(0);

    for (const plugin of manifest.plugins) {
      const pluginSourceRoot = resolve(repoRoot, plugin.source);

      expect(existsSync(pluginSourceRoot)).toBe(true);
      expect(plugin.skills.length).toBeGreaterThan(0);

      for (const skillPath of plugin.skills) {
        const absoluteSkillPath = resolve(pluginSourceRoot, skillPath);

        expect(absoluteSkillPath.startsWith(join(repoRoot, "skills"))).toBe(true);
        expect(existsSync(absoluteSkillPath)).toBe(true);
        expect(existsSync(join(absoluteSkillPath, "SKILL.md"))).toBe(true);

        const frontmatter = parseFrontmatter(
          readFileSync(join(absoluteSkillPath, "SKILL.md"), "utf8")
        );

        expect(frontmatter.name).toBeString();
        expect(frontmatter.name).toBe(plugin.name);
      }
    }
  });

  test("copies skills into the documented personal Claude layout", () => {
    const tempRoot = createTempDir("claude-personal-layout-smoke-");

    try {
      const manifest = getClaudeMarketplace();
      const personalSkillsRoot = join(tempRoot, ".claude", "skills");

      for (const plugin of manifest.plugins) {
        const sourceSkillRoot = resolve(repoRoot, plugin.skills[0]!);
        const targetSkillRoot = join(personalSkillsRoot, plugin.name);

        cpSync(sourceSkillRoot, targetSkillRoot, { recursive: true, dereference: true });

        expect(existsSync(join(targetSkillRoot, "SKILL.md"))).toBe(true);
        expect(
          readFileSync(join(targetSkillRoot, "SKILL.md"), "utf8")
        ).toContain(`name: ${plugin.name}`);
      }
    } finally {
      cleanupTempDir(tempRoot);
    }
  });

  test("copies skills into the documented project Claude layout", () => {
    const tempRoot = createTempDir("claude-project-layout-smoke-");

    try {
      const manifest = getClaudeMarketplace();
      const projectRoot = join(tempRoot, "project");
      const projectSkillsRoot = join(projectRoot, ".claude", "skills");

      for (const plugin of manifest.plugins) {
        const sourceSkillRoot = resolve(repoRoot, plugin.skills[0]!);
        const targetSkillRoot = join(projectSkillsRoot, plugin.name);

        cpSync(sourceSkillRoot, targetSkillRoot, { recursive: true, dereference: true });

        expect(existsSync(join(targetSkillRoot, "SKILL.md"))).toBe(true);
        expect(
          readFileSync(join(targetSkillRoot, "SKILL.md"), "utf8")
        ).toContain(`name: ${plugin.name}`);
      }
    } finally {
      cleanupTempDir(tempRoot);
    }
  });
});
