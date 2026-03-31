#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";

const logPath = process.env.RN_SKILLS_E2E_LOG_PATH;
if (!logPath) {
  throw new Error("RN_SKILLS_E2E_LOG_PATH is required");
}

const args = process.argv.slice(2);
const existing = JSON.parse(readFileSync(logPath, "utf8"));
existing.push(args);
writeFileSync(logPath, JSON.stringify(existing, null, 2) + "\n", "utf8");

if (args[0] === "-y" && args[1] === "skills" && args[2] === "list" && args[3] === "--json") {
  const installedSkillsJson = __INSTALLED_SKILLS_JSON__;
  process.stdout.write(installedSkillsJson + "\n");
  process.exit(0);
}

if (args[0] === "-y" && args[1] === "skills" && (args[2] === "add" || args[2] === "remove")) {
  process.exit(0);
}

throw new Error("Unexpected npx invocation: " + args.join(" "));
