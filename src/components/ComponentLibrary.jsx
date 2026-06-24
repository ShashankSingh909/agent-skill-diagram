import { useMemo, useState } from "react";
import {
  AppWindow,
  BookOpenText,
  BracketsCurly,
  Code,
  Cube,
  FileMd,
  MagnifyingGlass,
  Package,
  PlugsConnected,
  Sparkle,
} from "@phosphor-icons/react";
import { kindMeta } from "../model.js";

const components = [
  { kind: "skill", icon: Sparkle, description: "Reusable capability" },
  { kind: "skill-md", icon: FileMd, description: "Metadata + instructions" },
  { kind: "script", icon: Code, description: "Deterministic execution" },
  { kind: "reference", icon: BookOpenText, description: "On-demand context" },
  { kind: "asset", icon: Cube, description: "Output resource" },
  { kind: "agent-config", icon: BracketsCurly, description: "UI + dependencies" },
  { kind: "mcp", icon: PlugsConnected, description: "External tool server" },
  { kind: "app", icon: AppWindow, description: "Connected application" },
  { kind: "plugin", icon: Package, description: "Distribution manifest" },
];

export function ComponentLibrary({ onAdd }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      components.filter((item) =>
        `${kindMeta[item.kind].title} ${item.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <aside className="library-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Components</span>
          <h2>Build the architecture</h2>
        </div>
      </div>
      <label className="search-field">
        <MagnifyingGlass size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components"
        />
      </label>
      <p className="panel-hint">Drag onto the canvas or click to add.</p>
      <div className="component-list">
        {visible.map(({ kind, icon: Icon, description }) => (
          <button
            type="button"
            className="component-item"
            key={kind}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/skill-node", kind);
              event.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => onAdd(kind)}
            style={{ "--node-color": kindMeta[kind].color }}
          >
            <span className="component-icon">
              <Icon size={20} weight="duotone" />
            </span>
            <span>
              <strong>{kindMeta[kind].title}</strong>
              <small>{description}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="mental-model">
        <span className="eyebrow">Mental model</span>
        <div><i className="dot purple" /> Skill instructions live in the skill.</div>
        <div><i className="dot orange" /> MCP tools are runtime dependencies.</div>
        <div><i className="dot teal" /> Plugins package and distribute both.</div>
      </div>
    </aside>
  );
}
