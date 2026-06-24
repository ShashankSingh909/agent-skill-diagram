import { Trash } from "@phosphor-icons/react";
import { kindMeta } from "../model.js";

export function Inspector({ node, issues, onChange, onDelete }) {
  if (!node) {
    return (
      <aside className="inspector-panel empty-inspector">
        <div>
          <span className="eyebrow">Inspector</span>
          <h2>Select a node</h2>
          <p>Edit its name, description, path, and runtime settings here.</p>
        </div>
      </aside>
    );
  }

  const meta = kindMeta[node.data.kind] ?? kindMeta.skill;
  const nodeIssues = issues.filter((issue) => issue.nodeId === node.id);
  const update = (field) => (event) => onChange(field, event.target.value);

  return (
    <aside className="inspector-panel">
      <div className="inspector-title" style={{ "--node-color": meta.color }}>
        <span className="inspector-glyph" />
        <div>
          <span className="eyebrow">{meta.title}</span>
          <h2>{node.data.label}</h2>
          <code>{node.id}</code>
        </div>
      </div>

      {nodeIssues.length > 0 && (
        <div className="node-issues">
          {nodeIssues.map((issue) => (
            <p key={issue.message} className={issue.severity}>
              {issue.message}
            </p>
          ))}
        </div>
      )}

      <div className="field-stack">
        <label>
          <span>Name</span>
          <input value={node.data.label} onChange={update("label")} />
        </label>
        <label>
          <span>Slug / identifier</span>
          <input value={node.data.slug} onChange={update("slug")} />
        </label>
        <label>
          <span>Description</span>
          <textarea value={node.data.description} onChange={update("description")} rows={5} />
        </label>
        <label>
          <span>File or folder path</span>
          <input value={node.data.path} onChange={update("path")} />
        </label>
        {node.data.kind === "mcp" && (
          <label>
            <span>Server URL</span>
            <input value={node.data.url ?? ""} onChange={update("url")} />
          </label>
        )}
      </div>

      <div className="inspector-note">
        <span className="eyebrow">Loaded when</span>
        <p>
          {node.data.kind === "skill-md" && "The skill activates."}
          {node.data.kind === "reference" && "The instructions explicitly request this context."}
          {node.data.kind === "script" && "Deterministic or repetitive execution is required."}
          {node.data.kind === "asset" && "The output needs this template or resource."}
          {node.data.kind === "mcp" && "The workflow calls a live external tool."}
          {node.data.kind === "plugin" && "Codex discovers or installs the packaged workflow."}
          {node.data.kind === "skill" && "The task matches the skill description or the user invokes it."}
          {node.data.kind === "agent-config" && "Codex reads product metadata and dependencies."}
          {node.data.kind === "app" && "The workflow accesses an authenticated connected application."}
        </p>
      </div>

      <button type="button" className="delete-button" onClick={onDelete}>
        <Trash size={18} />
        Delete node
      </button>
    </aside>
  );
}
