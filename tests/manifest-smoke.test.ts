import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  parseFrontmatter,
  readJsonFile,
  repoRoot,
  type MarketplaceManifest
} from "./helpers/smoke-test-helpers";

type ClaudeMarketplaceManifest = {
  plugins: Array<{
    name: string;
    source: string;
    skills: string[];
  }>;
};

describe("manifest smoke", () => {
  test("parses SKILL.md frontmatter for shipped skills", () => {
    const skillsRoot = join(repoRoot, "skills");
    const skillDirectories = readdirSync(skillsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(skillDirectories.length).toBeGreaterThan(0);

    for (const skillDirectory of skillDirectories) {
      const skillPath = join(skillsRoot, skillDirectory, "SKILL.md");
      const frontmatter = parseFrontmatter(readFileSync(skillPath, "utf8"));

      expect(frontmatter.name).toBeString();
      expect(frontmatter.description).toBeString();
    }
  });

  test("every Claude marketplace skill path exists under skills", () => {
    const manifest = readJsonFile<ClaudeMarketplaceManifest>(
      join(repoRoot, ".claude-plugin", "marketplace.json")
    );

    for (const plugin of manifest.plugins) {
      expect(plugin.skills.length).toBeGreaterThan(0);

      for (const skillPath of plugin.skills) {
        const absoluteSkillPath = resolve(repoRoot, skillPath);
        expect(absoluteSkillPath.startsWith(join(repoRoot, "skills"))).toBe(true);
        expect(existsSync(absoluteSkillPath)).toBe(true);
        expect(existsSync(join(absoluteSkillPath, "SKILL.md"))).toBe(true);
      }
    }
  });

  test("every Codex marketplace plugin path exists under plugins", () => {
    const manifest = readJsonFile<MarketplaceManifest>(
      join(repoRoot, ".agents", "plugins", "marketplace.json")
    );

    for (const plugin of manifest.plugins) {
      const absolutePluginPath = resolve(repoRoot, plugin.source.path);
      expect(absolutePluginPath.startsWith(join(repoRoot, "plugins"))).toBe(true);
      expect(existsSync(absolutePluginPath)).toBe(true);
      expect(existsSync(join(absolutePluginPath, ".codex-plugin", "plugin.json"))).toBe(true);
    }
  });
});
