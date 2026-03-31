#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");
const lookupPath = path.join(packageRoot, "src", "lookup-table.json");
const vendoredRoot = path.join(repoRoot, "plugins", "vendored");

const remoteSources = [
  {
    repo: "callstackincubator/agent-skills",
    displayName: "Callstack Agent Skills"
  },
  {
    repo: "software-mansion-labs/skills",
    displayName: "Software Mansion Skills"
  }
];

const vendoredDisplayNameOverrides = {
  "callstack/react-native-testing-library": "React Native Testing Library Skills",
  "vercel-labs/agent-skills": "Vercel Agent Skills"
};

async function main() {
  const lookup = JSON.parse(await readFile(lookupPath, "utf8"));
  const nextSources = {};

  for (const source of remoteSources) {
    nextSources[source.repo] = {
      repo: source.repo,
      displayName: source.displayName,
      skills: preserveExistingDescriptions(lookup, source.repo, await fetchRemoteSkills(source.repo))
    };
  }

  for (const source of await discoverVendoredSources()) {
    nextSources[source.repo] = {
      repo: source.repo,
      displayName: source.displayName,
      skills: preserveExistingDescriptions(lookup, source.repo, await readVendoredSkills(source.skills))
    };
  }

  lookup.lastSyncedAt = new Date().toISOString();
  lookup.sources = nextSources;
  await writeFile(lookupPath, `${JSON.stringify(lookup, null, 2)}\n`, "utf8");

  process.stdout.write(`Synced rn-skills lookup table: ${lookupPath}\n`);
}

async function discoverVendoredSources() {
  const lockfilePath = path.join(vendoredRoot, "skills-lock.json");
  const vendoredSkillsRoot = path.join(vendoredRoot, ".agents", "skills");
  const lockfile = JSON.parse(await readFile(lockfilePath, "utf8"));
  const availableSkillNames = new Set(await readdir(vendoredSkillsRoot));
  const skillsBySource = new Map();

  for (const [skillName, skillInfo] of Object.entries(lockfile.skills)) {
    if (skillInfo.sourceType !== "github" || !availableSkillNames.has(skillName)) {
      continue;
    }

    if (!skillsBySource.has(skillInfo.source)) {
      skillsBySource.set(skillInfo.source, []);
    }

    skillsBySource.get(skillInfo.source).push(skillName);
  }

  return Array.from(skillsBySource.entries())
    .map(([repo, skills]) => ({
      repo,
      displayName: vendoredDisplayNameOverrides[repo] ?? formatRepoDisplayName(repo),
      skills: skills.sort()
    }))
    .sort((left, right) => left.repo.localeCompare(right.repo));
}

async function fetchRemoteSkills(repo) {
  const directoryResponse = await fetch(`https://api.github.com/repos/${repo}/contents/skills`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "rn-skills-sync"
    }
  });

  if (!directoryResponse.ok) {
    throw new Error(`Failed to list skills for ${repo}: ${directoryResponse.status} ${directoryResponse.statusText}`);
  }

  const entries = await directoryResponse.json();
  const directories = entries.filter((entry) => entry.type === "dir").map((entry) => entry.name).sort();
  const skills = [];

  for (const directory of directories) {
    const rawSkillUrl = `https://raw.githubusercontent.com/${repo}/main/skills/${directory}/SKILL.md`;
    const response = await fetch(rawSkillUrl, {
      headers: {
        "User-Agent": "rn-skills-sync"
      }
    });

    if (!response.ok) {
      continue;
    }

    const skillMarkdown = await response.text();
    skills.push({
      name: directory,
      description: extractDescription(skillMarkdown)
    });
  }

  return skills;
}

async function readVendoredSkills(skillNames) {
  const skills = [];

  for (const skillName of skillNames) {
    const skillPath = path.join(vendoredRoot, ".agents", "skills", skillName, "SKILL.md");
    const skillMarkdown = await readFile(skillPath, "utf8");
    skills.push({
      name: skillName,
      description: extractDescription(skillMarkdown)
    });
  }

  return skills;
}

function formatRepoDisplayName(repo) {
  const repoName = repo.split("/")[1] ?? repo;
  return repoName
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function preserveExistingDescriptions(lookup, repo, skills) {
  const existingDescriptionsBySkillName = new Map(
    (lookup.sources?.[repo]?.skills ?? []).map((skill) => [skill.name, skill.description])
  );

  return skills.map((skill) => ({
    ...skill,
    description: existingDescriptionsBySkillName.get(skill.name) ?? skill.description
  }));
}

function extractDescription(skillMarkdown) {
  const frontmatterMatch = skillMarkdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return "";
  }

  const frontmatterLines = frontmatterMatch[1].split("\n");

  for (let index = 0; index < frontmatterLines.length; index += 1) {
    const line = frontmatterLines[index];
    const descriptionMatch = line.match(/^description:\s*(.*)$/);
    if (!descriptionMatch) {
      continue;
    }

    const inlineValue = descriptionMatch[1].trim();
    if (inlineValue && inlineValue !== ">" && inlineValue !== "|" && inlineValue !== ">-" && inlineValue !== "|-") {
      return inlineValue;
    }

    const descriptionLines = [];
    for (let nextIndex = index + 1; nextIndex < frontmatterLines.length; nextIndex += 1) {
      const nextLine = frontmatterLines[nextIndex];
      if (/^\S/.test(nextLine)) {
        break;
      }

      descriptionLines.push(nextLine.replace(/^\s+/, ""));
    }

    return descriptionLines.join(" ").replace(/\s+/g, " ").trim();
  }

  return "";
}

await main();
