import { Handle, Position } from "@xyflow/react";
import {
  AppWindow,
  BookOpenText,
  BracketsCurly,
  Code,
  Cube,
  FileMd,
  Package,
  PlugsConnected,
  Sparkle,
} from "@phosphor-icons/react";
import { kindMeta } from "../model.js";

const icons = {
  plugin: Package,
  skill: Sparkle,
  "skill-md": FileMd,
  script: Code,
  reference: BookOpenText,
  asset: Cube,
  mcp: PlugsConnected,
  app: AppWindow,
  "agent-config": BracketsCurly,
};

export function ArchitectureNode({ data, selected }) {
  const meta = kindMeta[data.kind] ?? kindMeta.skill;
  const Icon = icons[data.kind] ?? Sparkle;

  return (
    <div
      className={`architecture-node ${selected ? "is-selected" : ""}`}
      style={{ "--node-color": meta.color }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-icon">
        <Icon size={20} weight="duotone" />
      </div>
      <div className="node-copy">
        <span>{meta.title}</span>
        <strong>{data.label}</strong>
        <small>{data.path}</small>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
