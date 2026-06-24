import { describe, expect, it } from "vitest";
import {
  createNode,
  generateProjectFiles,
  initialEdges,
  initialNodes,
  validateProject,
} from "./model.js";

describe("project model", () => {
  it("creates a new canvas node with normalized defaults", () => {
    const node = createNode("script", { x: 120, y: 80 }, 9);

    expect(node.id).toBe("script-9");
    expect(node.type).toBe("architecture");
    expect(node.position).toEqual({ x: 120, y: 80 });
    expect(node.data.kind).toBe("script");
    expect(node.data.path).toBe("scripts/new-script.js");
  });

  it("reports invalid skill names and missing instruction files", () => {
    const nodes = [
      {
        ...initialNodes.find((node) => node.id === "skill-research"),
        data: {
          ...initialNodes.find((node) => node.id === "skill-research").data,
          slug: "Research Skill",
        },
      },
    ];

    const issues = validateProject(nodes, []);

    expect(issues.some((issue) => issue.message.includes("lowercase"))).toBe(true);
    expect(issues.some((issue) => issue.message.includes("SKILL.md"))).toBe(true);
  });

  it("generates skill and plugin files from the graph", () => {
    const files = generateProjectFiles(initialNodes, initialEdges);

    expect(files["skills/research-assistant/SKILL.md"]).toContain(
      "name: research-assistant",
    );
    expect(files[".codex-plugin/plugin.json"]).toContain(
      '"mcpServers": "./.mcp.json"',
    );
    expect(files[".mcp.json"]).toContain('"openai-docs"');
  });
});
