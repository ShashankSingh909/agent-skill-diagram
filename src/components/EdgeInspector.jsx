import { ArrowRight, FlowArrow, LineSegment, Trash } from "@phosphor-icons/react";
import { kindMeta } from "../model.js";

export function EdgeInspector({ edge, nodes, onToggleDashed, onToggleAnimated, onDelete }) {
  const source = nodes.find((node) => node.id === edge.source) ?? null;
  const target = nodes.find((node) => node.id === edge.target) ?? null;
  const sourceColor = kindMeta[source?.data.kind]?.color ?? "#5a72a0";
  const targetColor = kindMeta[target?.data.kind]?.color ?? "#5a72a0";
  const dashed = Boolean(edge.data?.dashed);
  const animated = Boolean(edge.animated);

  return (
    <aside className="inspector-panel">
      <div className="inspector-title" style={{ "--node-color": sourceColor }}>
        <span className="inspector-glyph" />
        <div>
          <span className="eyebrow">Connection</span>
          <h2>Edit connection</h2>
          <code>{edge.id}</code>
        </div>
      </div>

      <div className="edge-route">
        <span className="edge-endpoint">
          <i className="edge-dot" style={{ background: sourceColor }} />
          {source?.data.label ?? "Unknown"}
        </span>
        <ArrowRight size={15} />
        <span className="edge-endpoint">
          <i className="edge-dot" style={{ background: targetColor }} />
          {target?.data.label ?? "Unknown"}
        </span>
      </div>

      <div className="edge-options">
        <span className="eyebrow">Line style</span>
        <button
          type="button"
          className={`edge-toggle ${dashed ? "active" : ""}`}
          onClick={onToggleDashed}
          aria-pressed={dashed}
        >
          <span className="edge-toggle-copy">
            <LineSegment size={17} weight="duotone" />
            <span>
              <strong>Dashed line</strong>
              <small>{dashed ? "Dotted connector" : "Solid connector"}</small>
            </span>
          </span>
          <span className={`switch ${dashed ? "on" : ""}`} />
        </button>
        <button
          type="button"
          className={`edge-toggle ${animated ? "active" : ""}`}
          onClick={onToggleAnimated}
          aria-pressed={animated}
        >
          <span className="edge-toggle-copy">
            <FlowArrow size={17} weight="duotone" />
            <span>
              <strong>Animated flow</strong>
              <small>{animated ? "Moving dashes" : "Static line"}</small>
            </span>
          </span>
          <span className={`switch ${animated ? "on" : ""}`} />
        </button>
      </div>

      <div className="inspector-note">
        <span className="eyebrow">Tip</span>
        <p>Click any connection to edit it. Press Delete or Backspace to remove the selected connection.</p>
      </div>

      <button type="button" className="delete-button" onClick={onDelete}>
        <Trash size={18} />
        Delete connection
      </button>
    </aside>
  );
}
