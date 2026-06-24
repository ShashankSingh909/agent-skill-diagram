const nodeDefaults = {
  plugin: {
    label: "New Plugin",
    slug: "new-plugin",
    description: "Installable bundle for reusable agent workflows.",
    path: ".codex-plugin/plugin.json",
  },
  skill: {
    label: "New Skill",
    slug: "new-skill",
    description: "Reusable capability with focused instructions.",
    path: "skills/new-skill",
  },
  "skill-md": {
    label: "SKILL.md",
    slug: "skill-md",
    description: "Metadata and instructions loaded when the skill activates.",
    path: "skills/new-skill/SKILL.md",
  },
  script: {
    label: "New Script",
    slug: "new-script",
    description: "Deterministic executable helper.",
    path: "scripts/new-script.js",
  },
  reference: {
    label: "New Reference",
    slug: "new-reference",
    description: "Documentation loaded into context only when needed.",
    path: "references/new-reference.md",
  },
  asset: {
    label: "New Asset",
    slug: "new-asset",
    description: "Template or resource used in generated output.",
    path: "assets/new-asset",
  },
  mcp: {
    label: "MCP Server",
    slug: "mcp-server",
    description: "External tools and context available at runtime.",
    path: ".mcp.json",
    url: "https://example.com/mcp",
  },
  app: {
    label: "Connected App",
    slug: "connected-app",
    description: "Authenticated application integration.",
    path: ".app.json",
  },
  "agent-config": {
    label: "openai.yaml",
    slug: "openai-yaml",
    description: "UI metadata, policy, and MCP tool dependencies.",
    path: "agents/openai.yaml",
  },
};

export const kindMeta = {
  plugin: { title: "Plugin Manifest", color: "#a66cff", group: "Distribution" },
  skill: { title: "Skill", color: "#8b5cf6", group: "Capability" },
  "skill-md": { title: "SKILL.md", color: "#a66cff", group: "Instructions" },
  script: { title: "Script", color: "#3b9cff", group: "Execution" },
  reference: { title: "Reference", color: "#57a6ff", group: "Context" },
  asset: { title: "Asset", color: "#39c983", group: "Output" },
  mcp: { title: "MCP Server", color: "#f5a524", group: "Runtime" },
  app: { title: "App", color: "#22c7b8", group: "Runtime" },
  "agent-config": { title: "Agent Config", color: "#d070ff", group: "Metadata" },
};

export function createNode(kind, position, sequence = Date.now()) {
  const defaults = nodeDefaults[kind] ?? nodeDefaults.skill;
  return {
    id: `${kind}-${sequence}`,
    type: "architecture",
    position,
    data: {
      kind,
      ...defaults,
    },
  };
}

export const initialNodes = [
  {
    id: "plugin-research",
    type: "architecture",
    position: { x: 410, y: 34 },
    data: {
      kind: "plugin",
      label: "Research Toolkit",
      slug: "research-toolkit",
      description: "A distributable research workflow with live documentation tools.",
      path: ".codex-plugin/plugin.json",
    },
  },
  {
    id: "skill-research",
    type: "architecture",
    position: { x: 330, y: 220 },
    data: {
      kind: "skill",
      label: "Research Assistant",
      slug: "research-assistant",
      description: "Researches a topic, checks primary sources, and produces a cited brief.",
      path: "skills/research-assistant",
    },
  },
  {
    id: "skill-md-research",
    type: "architecture",
    position: { x: 42, y: 438 },
    data: {
      kind: "skill-md",
      label: "SKILL.md",
      slug: "skill-md",
      description: "Trigger metadata and the core research workflow.",
      path: "skills/research-assistant/SKILL.md",
    },
  },
  {
    id: "reference-sources",
    type: "architecture",
    position: { x: 245, y: 470 },
    data: {
      kind: "reference",
      label: "Source Policy",
      slug: "source-policy",
      description: "Rules for primary sources, citations, and uncertainty.",
      path: "skills/research-assistant/references/source-policy.md",
    },
  },
  {
    id: "script-brief",
    type: "architecture",
    position: { x: 470, y: 470 },
    data: {
      kind: "script",
      label: "Build Brief",
      slug: "build-brief",
      description: "Normalizes research notes into a repeatable brief.",
      path: "skills/research-assistant/scripts/build-brief.js",
    },
  },
  {
    id: "asset-template",
    type: "architecture",
    position: { x: 690, y: 470 },
    data: {
      kind: "asset",
      label: "Report Template",
      slug: "report-template",
      description: "Markdown template copied into the final output.",
      path: "skills/research-assistant/assets/report-template.md",
    },
  },
  {
    id: "agent-config",
    type: "architecture",
    position: { x: 662, y: 230 },
    data: {
      kind: "agent-config",
      label: "openai.yaml",
      slug: "openai-yaml",
      description: "Declares UI metadata and the OpenAI Docs dependency.",
      path: "skills/research-assistant/agents/openai.yaml",
    },
  },
  {
    id: "mcp-openai-docs",
    type: "architecture",
    position: { x: 890, y: 250 },
    data: {
      kind: "mcp",
      label: "OpenAI Docs",
      slug: "openai-docs",
      description: "External documentation search and retrieval tools.",
      path: ".mcp.json",
      url: "https://developers.openai.com/mcp",
    },
  },
];

export const initialEdges = [
  { id: "plugin-skill", source: "plugin-research", target: "skill-research", animated: true },
  { id: "plugin-config", source: "plugin-research", target: "agent-config" },
  { id: "skill-md", source: "skill-research", target: "skill-md-research" },
  { id: "skill-reference", source: "skill-research", target: "reference-sources" },
  { id: "skill-script", source: "skill-research", target: "script-brief" },
  { id: "skill-asset", source: "skill-research", target: "asset-template" },
  { id: "config-mcp", source: "agent-config", target: "mcp-openai-docs", animated: true },
];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateProject(nodes, edges) {
  const issues = [];
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const plugins = nodes.filter((node) => node.data.kind === "plugin");
  const skills = nodes.filter((node) => node.data.kind === "skill");

  if (plugins.length === 0) {
    issues.push({ severity: "error", message: "Add a plugin manifest before export." });
  }

  for (const node of [...plugins, ...skills]) {
    if (!slugPattern.test(node.data.slug ?? "")) {
      issues.push({
        severity: "error",
        nodeId: node.id,
        message: `${node.data.label} must use lowercase letters, numbers, and hyphens.`,
      });
    }
  }

  for (const skill of skills) {
    const children = edges
      .filter((edge) => edge.source === skill.id)
      .map((edge) => nodeById.get(edge.target))
      .filter(Boolean);
    if (!children.some((node) => node.data.kind === "skill-md")) {
      issues.push({
        severity: "error",
        nodeId: skill.id,
        message: `${skill.data.label} needs a connected SKILL.md node.`,
      });
    }
    if ((skill.data.description ?? "").length < 36) {
      issues.push({
        severity: "warning",
        nodeId: skill.id,
        message: `${skill.data.label} needs a more specific trigger description.`,
      });
    }
  }

  for (const node of nodes.filter((item) => item.data.kind === "mcp")) {
    const connected = edges.some(
      (edge) => edge.source === node.id || edge.target === node.id,
    );
    if (!connected) {
      issues.push({
        severity: "warning",
        nodeId: node.id,
        message: `${node.data.label} is not connected to a skill or plugin config.`,
      });
    }
  }

  return issues;
}

function yamlString(value) {
  return String(value ?? "").replaceAll('"', '\\"');
}

export function generateProjectFiles(nodes, edges) {
  const files = {};
  const plugin = nodes.find((node) => node.data.kind === "plugin");
  const skills = nodes.filter((node) => node.data.kind === "skill");
  const mcpNodes = nodes.filter((node) => node.data.kind === "mcp");
  const hasApps = nodes.some((node) => node.data.kind === "app");

  for (const skill of skills) {
    const skillRoot = `skills/${skill.data.slug}`;
    files[`${skillRoot}/SKILL.md`] = `---
name: ${skill.data.slug}
description: ${skill.data.description}
---

# ${skill.data.label}

Follow the connected workflow resources only when the current task requires them.

## Workflow

1. Clarify the requested outcome and constraints.
2. Load connected references only when their subject is relevant.
3. Run connected scripts when deterministic processing is required.
4. Use connected assets as output templates or resources.
5. Validate the final result before handoff.
`;

    const dependency = mcpNodes[0];
    files[`${skillRoot}/agents/openai.yaml`] = `interface:
  display_name: "${yamlString(skill.data.label)}"
  short_description: "${yamlString(skill.data.description.slice(0, 64))}"
  default_prompt: "Use $${skill.data.slug} to complete this workflow."
policy:
  allow_implicit_invocation: true${
    dependency
      ? `
dependencies:
  tools:
    - type: "mcp"
      value: "${dependency.data.slug}"
      description: "${yamlString(dependency.data.description)}"
      transport: "streamable_http"
      url: "${dependency.data.url ?? "https://example.com/mcp"}"`
      : ""
  }
`;
  }

  const pluginJson = {
    name: plugin?.data.slug ?? "untitled-plugin",
    version: "1.0.0",
    description: plugin?.data.description ?? "Generated agent workflow plugin.",
    skills: "./skills/",
    ...(mcpNodes.length ? { mcpServers: "./.mcp.json" } : {}),
    ...(hasApps ? { apps: "./.app.json" } : {}),
  };
  files[".codex-plugin/plugin.json"] = `${JSON.stringify(pluginJson, null, 2)}\n`;

  if (mcpNodes.length) {
    files[".mcp.json"] = `${JSON.stringify(
      {
        mcpServers: Object.fromEntries(
          mcpNodes.map((node) => [
            node.data.slug,
            {
              type: "http",
              url: node.data.url ?? "https://example.com/mcp",
            },
          ]),
        ),
      },
      null,
      2,
    )}\n`;
  }

  if (hasApps) {
    files[".app.json"] = `${JSON.stringify({ apps: {} }, null, 2)}\n`;
  }

  files["marketplace.json"] = `${JSON.stringify(
    {
      name: "personal",
      interface: { displayName: "Personal" },
      plugins: [
        {
          name: pluginJson.name,
          source: { source: "local", path: `./plugins/${pluginJson.name}` },
          policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
          category: "Productivity",
        },
      ],
    },
    null,
    2,
  )}\n`;

  files["architecture.json"] = `${JSON.stringify({ nodes, edges }, null, 2)}\n`;
  return files;
}
