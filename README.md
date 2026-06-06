
# ☁️ Azure Agent Skills

> 🚀 **Agentic Skills for Azure Development**
>
> Supercharge your AI coding assistant with curated, production-ready skills for Microsoft Azure. Works seamlessly with:
>
> 🟣 **Claude Code** | 🔵 **Gemini CLI** | 🟢 **Codex CLI** | 🔴 **Antigravity IDE** | 🩵 **GitHub Copilot** | 🟠 **Cursor** | ⚪ **OpenCode** | 🌸 **AdaL CLI**

---


[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Open%20Standard-green)](https://agentskills.io/)
[![Copilot](https://img.shields.io/badge/GitHub%20Copilot-VSCode-lightblue)](https://github.com/features/copilot)

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Anthropic-purple)](https://claude.ai)
[![Gemini CLI](https://img.shields.io/badge/Gemini%20CLI-Google-blue)](https://github.com/google-gemini/gemini-cli)
[![Codex CLI](https://img.shields.io/badge/Codex%20CLI-OpenAI-green)](https://github.com/openai/codex)
[![Cursor](https://img.shields.io/badge/Cursor-AI%20IDE-orange)](https://cursor.sh)
[![OpenCode](https://img.shields.io/badge/OpenCode-CLI-gray)](https://github.com/opencode-ai/opencode)
[![Antigravity](https://img.shields.io/badge/Antigravity-DeepMind-red)](https://github.com/sickn33/antigravity-awesome-skills)
[![AdaL CLI](https://img.shields.io/badge/AdaL%20CLI-SylphAI-pink)](https://sylph.ai/)

Azure Agent Skills is a curated collection of **high-quality agentic skills** specifically designed for Azure cloud development. These skills follow the [Agent Skills open standard](https://agentskills.io/) and work seamlessly with modern AI coding assistants to provide expert-level guidance on Azure services.

---

## 📍 Table of Contents

- [🚀 New Here? Start Here!](#-new-here-start-here)
- [🔌 Compatibility & Invocation](#-compatibility--invocation)
- [📦 Features & Categories](#-features--categories)
- [🎁 Curated Collections (Bundles)](#-curated-collections-bundles)
- [📚 Browse All Skills](#-browse-all-skills)
- [🛠️ Installation](#️-installation)
- [🧠 How to Use](#-how-to-use)
- [📖 Agent Skills Documentation](#-agent-skills-documentation)
- [🤝 How to Contribute](#-how-to-contribute)
- [⚖️ License](#️-license)

---

## 🚀 New Here? Start Here!

### 1. 🐣 What is this?

AI Agents (like GitHub Copilot, Claude Code, or Cursor) are smart, but they lack specific, up-to-date knowledge about Azure services. **Skills** are folders containing markdown instructions, scripts, and resources that teach AI agents how to work with Azure services correctly, every time.

> 💡 Skills are reusable, filesystem-based resources that provide AI agents with domain-specific expertise. They load on-demand and eliminate the need to repeatedly provide the same guidance across conversations.

### 2. 📚 How These Skills Are Created

Microsoft Learn documentation already encodes **decisions, procedures, best practices, and constraints** — exactly what agents need to act effectively. Rather than relying on RAG to retrieve and summarize raw text every time, we **pre-compile this knowledge into structured, executable skills**.

**Documentation as Pre-Built Skills**: Many effective agent skills are not new inventions — they are structured patterns, workflows, and decision logic that already exist in documentation. Consider what Learn content contains:

- API patterns and usage guidance
- Service configuration procedures  
- Platform best practices and constraints
- Troubleshooting decision trees
- Security and compliance requirements

**Our approach:**

1. **Extract** high-value, task-oriented capabilities from Learn content
2. **Classify** by purpose (limits, troubleshooting, configuration, architecture, etc.)
3. **Reveal** only when relevant to the user's intent

The knowledge is **pre-compiled into actions, choices, and guardrails** the agent can use directly — not raw text that needs interpretation.

Each skill provides:
- 📚 Curated documentation links organized by topic
- 🔗 Direct access to Microsoft Learn content
- 🎯 Best practices and architecture patterns
- ⚠️ Troubleshooting guides and common pitfalls

### 3. ⚡️ Quick Start

A short path to getting started — full installation details are in the [🛠️ Installation](#️-installation) section below.

1. Clone the repo:
   ```bash
   git clone https://github.com/MicrosoftDocs/agent-skills.git
   ```

2. Copy the contents of the `skills/` folder to your AI assistant's skills path (see [🛠️ Installation](#️-installation) for the destination table and important notes).

3. VS Code users: enable `chat.agent.skills` in Settings so the editor will load skills.

4. Start coding — your AI assistant will automatically discover and use the installed skills.

### 4. 🧠 How Skills Work

Skills use **progressive disclosure** to efficiently load content only when needed:

1. **Level 1 - Discovery**: Agent reads skill `name` and `description` from YAML frontmatter
2. **Level 2 - Instructions**: When triggered, agent loads the full `SKILL.md` content
3. **Level 3 - Resources**: Agent accesses additional files (scripts, examples) as needed

Once installed, just ask your AI assistant naturally:

> "Help me set up Azure Functions with Durable Functions"
> 
> "What are the best practices for Azure Container Apps?"
> 
> "How do I configure Azure API Management?"

The skills will automatically provide context from official Microsoft documentation.

---

## 🔌 Compatibility & Invocation


These skills follow the [Agent Skills open standard](https://agentskills.io/) (`SKILL.md` format) and work with any AI coding assistant that supports agentic skills.

| AI Coding Assistant      | Type           | Skills Path / Location         | How to Invoke                      |
|-------------------------|----------------|-------------------------------|-------------------------------------|
| **Claude Code**         | Anthropic CLI  | `.claude/skills/`              | Natural language, `/skill-name`     |
| **Gemini CLI**          | Google DeepMind| `.gemini/skills/`              | Natural language                    |
| **Codex CLI**           | OpenAI         | `.codex/skills/`               | Natural language                    |
| **Antigravity IDE**     | DeepMind IDE   | `.agent/skills/`               | Agent mode, natural language        |
| **GitHub Copilot**      | VSCode Ext     | `.github/skills/`              | Natural language, `@workspace`      |
| **Cursor**              | AI-native IDE  | `.cursor/skills/`              | `@skill-name` in Chat               |
| **OpenCode**            | Open-source CLI| `.agent/skills/`               | `opencode run @skill-name`          |
| **AdaL CLI**            | SylphAI Agent  | `.adal/skills/`                | Auto-load, natural language         |

> 💡 **Path Note:** `~` refers to your home directory:
> - **macOS/Linux:** `~` = `/Users/yourname` or `/home/yourname`
> - **Windows:** `~` = `%USERPROFILE%` = `C:\Users\yourname` (use `$HOME` in PowerShell)

> 💡 **Tip:** Most modern tools support `.agent/skills/` as a universal path. For GitHub Copilot, `.github/skills/` is recommended per the [Agent Skills specification](https://agentskills.io/specification).

---

## 📦 Features & Categories

The repository is organized by Azure service domains:

| Category | Skills | Examples |
|----------|--------|----------|
| ☁️ **Compute** | 13 | Azure App Service, Azure Batch, Azure Cloud Services, Azure Cyclecloud, Azure Functions |
| 🔗 **Integration** | 16 | Azure API Center, Azure API Management, Azure Business Process Tracking, Azure Communication Services, Azure Data API Builder |
| 📊 **Data & Analytics** | 19 | Azure Analysis Services, Azure Cache Redis, Azure Cosmos Db, Azure Data Explorer, Azure Data Factory |
| 🤖 **AI & ML** | 23 | Azure AI Services, Azure AI Vision, Azure Anomaly Detector, Azure Bot Service, Azure Cognitive Search, Azure Foundry Classic, Azure Foundry Local, Microsoft Foundry |
| 🔒 **Security & Identity** | 19 | Azure Active Directory B2C, Azure Attestation, Azure Cloud Hsm, Azure Confidential Computing, Azure Confidential Ledger |
| 🌐 **Networking** | 23 | Azure Application Gateway, Azure Bastion, Azure DDoS Protection, Azure Dns, Azure Expressroute |
| 🏗️ **Infrastructure** | 52 | Azure Advisor, Azure AKS Edge Essentials, Azure API Management, Azure Arc, Azure Architecture, Azure Container Storage, Azure Elastic SAN |
| 💰 **Management** | 39 | Azure Advisor, Azure API Management, Azure Architecture, Azure Artifacts, Azure Automation |
| 🎮 **Specialized** | 26 | Azure AKS Edge Essentials, Azure API Management, Azure App Configuration, Azure App Service, Azure Communication Services |

**Total: 193 skills across 19 categories** ✓

---

## 🎁 Curated Collections (Bundles)

Not sure where to start? We've created role-based skill bundles to help you get productive quickly.

👉 **[View Curated Bundles (docs/BUNDLES.md)](docs/BUNDLES.md)**

| Bundle | Description |
|--------|-------------|
| **🚀 Quick Start** | Absolute essentials for any Azure developer — master these 7 core services first |
| **⭐ Popular** | Popular Azure services. The services that power most workloads |
| **🎯 Core** | Core Azure essentials. The foundation every developer needs before specializing |
| **🤖 AI/ML Developer** | For AI engineers and ML practitioners. Covers AI services, machine learning, and intelligent applications |
| **📊 Data Engineer** | For data engineers and analytics professionals. Covers data integration, warehousing, and streaming analytics |
| **🏗️ Infrastructure Pro** | For infrastructure engineers and cloud architects. Covers networking, backup, recovery, and resource management |
| **🔒 Security & Compliance** | Secure Azure workloads with RBAC, policy, key management, and compliance |
| **🌐 DevOps & Automation** | Automate deployments, monitoring, and infrastructure management |
| **🔗 Integration** | Connect Azure services with API Management, Event Grid, Logic Apps, and Service Bus |
| **☁️ Full-Stack Azure** | Complete coverage with architecture foundations |

> 💡 **Recommended Path:**
> 1. Start with **Quick Start Bundle**
> 2. Add **Popular Bundle** for broader coverage
> 3. Choose specialized bundles based on your role

---

## 📚 Browse All Skills

We've moved the complete skill registry to a dedicated catalog to keep this README clean.

👉 **[View the Complete Skill Catalog (docs/CATALOG.md)](docs/CATALOG.md)**

| Skill | Description |
|-------|-------------|
| **All Azure Skills** | Full list of all available Azure skills |
| **Skill Descriptions** | Skill descriptions and capabilities |
| **Skill Files** | Links to individual skill files |

### 📂 Repository Structure

| Directory | Purpose |
|-----------|---------|
| `skills/` | Production-ready skills for AI agents to consume |
| `products/` | Scan results, raw data, and reporting artifacts |

#### About the `products/` Directory

The `products/` folder stores **scan pipeline outputs** and is used for:

- **Raw Data**: Results from the latest documentation scan, including extracted nodes and metadata
- **Classification Reports**: Detailed records of why each node was classified as a skill (or excluded)
- **Incremental Tracking**: Historical scan data to support delta processing and change detection

> ⚠️ **Note:** The `products/` directory is for internal pipeline use and contributor reference. End users only need the `skills/` directory.

---

## 🛠️ Installation

Choose the installation path based on your preferred AI coding assistant.

> ⚠️ **Note:** This repository contains skills in the `skills/` subdirectory. Clone the repo first, then copy the skills to your target location.

### Step 1: Clone the Repository

First, clone this repository to a location on your machine (e.g., your home folder or a temp directory):

```bash
git clone https://github.com/MicrosoftDocs/agent-skills.git
```

### Step 2: Copy Skills to Your Destination

Copy the **contents** inside the `skills/` folder to your target location based on your AI assistant:

| AI Assistant | Project-level (in your repo) | Personal/Global (all projects) |
|--------------|------------------------------|--------------------------------|
| **GitHub Copilot** | `{your-project}/.github/skills/` | `~/.copilot/skills/` |
| **Claude Code** | `{your-project}/.claude/skills/` | `~/.claude/skills/` |
| **OpenAI Codex** | `{your-project}/.codex/skills/` | `~/.codex/skills/` |
| **Cursor** | `{your-project}/.cursor/skills/` | — |
| **Gemini CLI** | `{your-project}/.gemini/skills/` | — |
| **Antigravity IDE** | `{your-project}/.agent/skills/` | `~/.gemini/antigravity/skills/` |
| **OpenCode** | `{your-project}/.agent/skills/` | `~/.agent/skills/` |
| **AdaL CLI** | `{your-project}/.adal/skills/` | `~/.adal/skills/` |

> ⚠️ **Important:** Copy the folders **inside** `skills/` (e.g., `azure-functions/`, `azure-container-apps/`), NOT the `skills` folder itself.
>
> ✅ Correct: `.copilot/skills/azure-functions/SKILL.md`  
> ❌ Wrong: `.copilot/skills/skills/azure-functions/SKILL.md`

> 💡 **Path Note:** `~` = Home directory
> - **Windows:** `C:\Users\yourname` (use `$HOME` in PowerShell)
> - **macOS/Linux:** `/Users/yourname` or `/home/yourname`

**Enable Agent Skills in VS Code** (Required for VS Code users):

Agent Skills is currently an **experimental feature**. You must enable it manually:

1. Open VS Code Settings (`Ctrl`+`,` on Windows/Linux, `Cmd`+`,` on macOS)
2. Search for `chat.agent.skills`
3. Check the box for **"Chat: Use Agent Skills"**
   ![vs-code-use-agent-skills](docs/vs-code-use-agent-skills.png)

> ⚠️ **Important:** Without this setting enabled, VS Code will not load or use any skills!

---

### Step 3: Cleanup (Optional)

After copying, you can delete the cloned `agent-skills` repository if you no longer need it.

---

## 🧠 How to Use

### Prerequisites

Most skills require **network access** to fetch the latest documentation from Microsoft Learn.

**Option 1: Microsoft Learn MCP Server (Recommended)**
- Uses `mcp_microsoftdocs:microsoft_docs_fetch` to fetch complete documentation

**Option 2: Web Fetch Tool**
- Uses `fetch_webpage` to retrieve content from documentation URLs

### Example Workflow

1. **Ask about an Azure service:**
   ```
   How do I implement blue-green deployments in Azure Container Apps?
   ```

2. **The skill provides:**
   - Direct links to official Microsoft documentation
   - Best practices from Microsoft Learn
   - Architecture patterns and code examples

3. **AI fetches documentation:**
   - The AI assistant uses MCP tools to fetch the latest content
   - You get accurate, up-to-date guidance

---

## 📖 Agent Skills Documentation

Agent Skills is an **open standard** for giving AI agents new capabilities. Learn more about how each platform implements skills:

### Official Documentation

| Platform | Documentation | Description |
|----------|---------------|-------------|
| **Agent Skills Standard** | [agentskills.io](https://agentskills.io/) | The open specification for `SKILL.md` format |
| **GitHub Copilot** | [About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) | Skills for Copilot coding agent, CLI, and VS Code |
| **VS Code Copilot** | [Agent Skills in VS Code](https://code.visualstudio.com/docs/copilot/customization/agent-skills) | Using skills in VS Code with agent mode |
| **Claude Code** | [Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | Skills in Claude Code and Claude API |
| **OpenAI Codex** | [Agent Skills](https://developers.openai.com/codex/skills/) | Skills for Codex CLI and IDE extensions |

### Example Skill Repositories

| Repository | Description |
|------------|-------------|
| [anthropics/skills](https://github.com/anthropics/skills) | Official Anthropic skills (DOCX, PDF, PPTX, XLSX) |
| [openai/skills](https://github.com/openai/skills) | OpenAI Codex skills catalog |
| [github/awesome-copilot](https://github.com/github/awesome-copilot) | Community collection for GitHub Copilot |

### Skill Structure

Every skill requires a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: your-skill-name        # Lowercase, hyphens only, max 64 chars
description: What it does    # When to use it, max 1024 chars
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance for the AI agent]

## Examples
[Concrete examples of using this skill]
```

---


## 🙋 Frequently Asked Questions

### What is Azure Agent Skills?

Azure Agent Skills is a curated collection of **193 high-quality agentic skills** specifically designed for Azure cloud development. These skills follow the [Agent Skills open standard](https://agentskills.io/) and work seamlessly with modern AI coding assistants to provide expert-level guidance on Azure services.

| Category | Skills Count | Examples |
|----------|--------------|----------|
| ☁️ **Compute** | 13 | Azure App Service, Azure Functions, Azure Batch |
| 🔗 **Integration** | 16 | Azure API Management, Azure Logic Apps |
| 📊 **Data & Analytics** | 19 | Azure Cosmos DB, Azure Data Factory |
| 🤖 **AI & ML** | 23 | Azure AI Services, Azure Cognitive Search |
| 🔒 **Security & Identity** | 19 | Azure AD B2C, Azure Key Vault |
| 🌐 **Networking** | 23 | Azure Application Gateway, Azure ExpressRoute |
| 🏗️ **Infrastructure** | 52 | Azure Arc, Azure Kubernetes Service |
| 💰 **Management** | 39 | Azure Advisor, Azure Automation |
| 🎮 **Specialized** | 26 | Azure AKS Edge, Azure Communication Services |

**Total: 193 skills across 19 categories** for comprehensive Azure development coverage.

### Which AI assistants are supported?

These skills work with any AI coding assistant that supports the Agent Skills standard:

| Assistant | Skills Path | How to Invoke |
|-----------|-------------|---------------|
| **Claude Code** | `.claude/skills/` | Natural language, `/skill-name` |
| **Gemini CLI** | `.gemini/skills/` | Natural language |
| **Codex CLI** | `.codex/skills/` | Natural language |
| **GitHub Copilot** | `.github/skills/` | Natural language, `@workspace` |
| **Cursor** | `.cursor/skills/` | `@skill-name` in Chat |
| **OpenCode** | `.agent/skills/` | `opencode run @skill-name` |
| **Antigravity IDE** | `.agent/skills/` | Agent mode, natural language |
| **AdaL CLI** | `.adal/skills/` | Auto-load, natural language |

Most tools support `.agent/skills/` as a universal path.

### How do skills work?

Skills use **progressive disclosure** to efficiently load content only when needed:

1. **Level 1 - Discovery**: Agent reads skill `name` and `description` from YAML frontmatter
2. **Level 2 - Instructions**: When triggered, agent loads the full `SKILL.md` content
3. **Level 3 - Resources**: Agent accesses additional files (scripts, examples) as needed

Once installed, just ask naturally: *"Help me set up Azure Functions"* or *"What are best practices for Azure Container Apps?"*

### How do I install the skills?

**Quick Start (3 steps):**

```bash
# 1. Clone the repo
git clone https://github.com/MicrosoftDocs/Agent-Skills.git

# 2. Copy skills to your assistant's path
cp -r Agent-Skills/skills/ ~/.claude/skills/    # Claude Code
# OR: cp -r Agent-Skills/skills/ ~/.cursor/skills/    # Cursor
# OR: cp -r Agent-Skills/skills/ ~/.codex/skills/     # Codex CLI

# 3. For VS Code Copilot: enable chat.agent.skills in Settings
```

For full installation details, see [🛠️ Installation](#️-installation) section.

### What are curated bundles?

We've created **role-based skill bundles** to help you get productive quickly:

| Bundle | Description |
|--------|-------------|
| **🚀 Quick Start** | 7 core services for beginners |
| **⭐ Popular** | Most-used Azure services |
| **🤖 AI/ML Developer** | AI services + machine learning |
| **📊 Data Engineer** | Data integration + warehousing |
| **🏗️ Infrastructure Pro** | Networking + cloud architecture |
| **🔒 Security & Compliance** | RBAC + key management + policy |

👉 **Recommended path:** Quick Start → Popular → Role-specific bundle

### How are skills created?

Microsoft Learn documentation encodes **decisions, procedures, best practices, and constraints** — exactly what agents need. Our approach:

1. **Extract** high-value capabilities from Learn content
2. **Classify** by purpose (limits, troubleshooting, configuration)
3. **Reveal** only when relevant to the user's intent

Knowledge is **pre-compiled into actions, choices, and guardrails** the agent can use directly — not raw text requiring interpretation.

### Is this free to use?

**Yes!** Azure Agent Skills is **completely free** and open-source:

- **Dual License:** CC BY 4.0 (content) + MIT (code)
- **No API keys needed** — works with your existing AI assistant subscription
- **No hidden costs** — skills are markdown files, no backend services

### How can I contribute?

We welcome contributions! See [🤝 How to Contribute](#-how-to-contribute) section.

| Resource | Link |
|----------|------|
| **Contribution Guide** | [CONTRIBUTING.md](CONTRIBUTING.md) |
| **Skill Standards** | [agentskills.io](https://agentskills.io/) |
| **Microsoft Learn** | [learn.microsoft.com](https://learn.microsoft.com/) |
| **GitHub Issues** | [Report issues](https://github.com/MicrosoftDocs/Agent-Skills/issues) |

### Where can I get help?

| Channel | Link |
|---------|------|
| **Documentation** | [Agent Skills Docs](#-agent-skills-documentation) |
| **GitHub Issues** | [Create issue](https://github.com/MicrosoftDocs/Agent-Skills/issues) |
| **Skill Catalog** | [Browse all skills](docs/CATALOG.md) |
| **Bundles Guide** | [View bundles](docs/BUNDLES.md) |

---

## 🤝 How to Contribute

Thanks for your interest in contributing. Due to limited maintainer capacity right now, we do **not** accept contributions that manually create or edit any skills. Please update the relevant Microsoft Learn documentation, then create an issue to request a re-crawl, or wait for our automatic weekly crawl. We appreciate your understanding, and things may change in the future.

---

## ⚖️ License

This project uses a dual license:

- **Documentation content**: [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode) - See [LICENSE](LICENSE)
- **Code**: [MIT License](https://opensource.org/licenses/MIT) - See [LICENSE-CODE](LICENSE-CODE)

---

## 📚 Additional Resources

- [Agent Skills Specification](https://agentskills.io/specification) - The complete format specification
- [Microsoft Learn Documentation](https://learn.microsoft.com/)
- [Azure Architecture Center](https://learn.microsoft.com/azure/architecture/)
- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/)

---

## 🏷️ Topics

`azure` `azure-functions` `azure-container-apps` `agent-skills` `ai-coding` `github-copilot` `claude-code` `cursor` `openai-codex` `agentic-skills` `llm-tools` `microsoft-learn` `SKILL.md`

---
 

# Legal Notices

Microsoft and any contributors grant you a license to the Microsoft documentation and other content
in this repository under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode),
see the [LICENSE](LICENSE) file, and grant you a license to any code in the repository under the [MIT License](https://opensource.org/licenses/MIT), see the
[LICENSE-CODE](LICENSE-CODE) file.

Microsoft, Windows, Microsoft Azure and/or other Microsoft products and services referenced in the documentation
may be either trademarks or registered trademarks of Microsoft in the United States and/or other countries.
The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks.
You can find Microsoft general trademark guidelines at [Microsoft Trademark and Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks).

For privacy information, see [privacy at Microsoft](https://privacy.microsoft.com/).

Microsoft and any contributors reserve all other rights, whether under their respective copyrights, patents,
or trademarks, whether by implication, estoppel or otherwise.
