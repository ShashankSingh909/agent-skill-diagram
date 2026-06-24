import { useCallback, useMemo, useRef, useState } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  BracketsCurly,
  CheckCircle,
  DownloadSimple,
  Export,
  FileCode,
  FlowArrow,
  FolderOpen,
  Graph,
  WarningCircle,
} from "@phosphor-icons/react";
import { ArchitectureNode } from "./components/ArchitectureNode.jsx";
import { ComponentLibrary } from "./components/ComponentLibrary.jsx";
import { FilePreview } from "./components/FilePreview.jsx";
import { FileTreeView } from "./components/FileTreeView.jsx";
import { Inspector } from "./components/Inspector.jsx";
import { RuntimeView } from "./components/RuntimeView.jsx";
import {
  createNode,
  generateProjectFiles,
  initialEdges,
  initialNodes,
  kindMeta,
  validateProject,
} from "./model.js";

const nodeTypes = { architecture: ArchitectureNode };

function Workspace() {
  const wrapperRef = useRef(null);
  const sequenceRef = useRef(20);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlow, setReactFlow] = useState(null);
  const [mode, setMode] = useState("mind");
  const [selectedId, setSelectedId] = useState("skill-research");
  const [showFiles, setShowFiles] = useState(false);
  const [showIssues, setShowIssues] = useState(false);
  const [toast, setToast] = useState("");

  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null;
  const issues = useMemo(() => validateProject(nodes, edges), [nodes, edges]);
  const files = useMemo(() => generateProjectFiles(nodes, edges), [nodes, edges]);
  const errors = issues.filter((issue) => issue.severity === "error").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
        const source = nodes.find((node) => node.id === edge.source);
        const color = kindMeta[source?.data.kind]?.color ?? "#5a72a0";
        return {
          ...edge,
          type: "smoothstep",
          style: { stroke: color, strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color },
        };
      }),
    [edges, nodes],
  );

  const onConnect = useCallback(
    (connection) => setEdges((current) => addEdge({ ...connection, id: crypto.randomUUID() }, current)),
    [setEdges],
  );

  const addNode = useCallback(
    (kind, position) => {
      const fallback = {
        x: 320 + (sequenceRef.current % 4) * 80,
        y: 180 + (sequenceRef.current % 5) * 65,
      };
      const next = createNode(kind, position ?? fallback, sequenceRef.current++);
      setNodes((current) => [...current, next]);
      setSelectedId(next.id);
      setMode("mind");
    },
    [setNodes],
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData("application/skill-node");
      if (!kind || !reactFlow || !wrapperRef.current) return;
      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = reactFlow.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      addNode(kind, position);
    },
    [addNode, reactFlow],
  );

  const updateSelected = (field, value) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === selectedId
          ? { ...node, data: { ...node.data, [field]: value } }
          : node,
      ),
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setNodes((current) => current.filter((node) => node.id !== selectedId));
    setEdges((current) =>
      current.filter((edge) => edge.source !== selectedId && edge.target !== selectedId),
    );
    setSelectedId(null);
  };

  const exportBlueprint = () => {
    const payload = JSON.stringify({ nodes, edges, files }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "skill-architecture-blueprint.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setToast("Blueprint exported");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Graph size={23} weight="duotone" /></div>
          <div>
            <strong>Skill Architecture Studio</strong>
            <span>Design Agent Skills and Codex plugins visually</span>
          </div>
        </div>
        <nav className="mode-switcher" aria-label="Workspace view">
          <button type="button" className={mode === "mind" ? "active" : ""} onClick={() => setMode("mind")}>
            <Graph size={18} /> Mind map
          </button>
          <button type="button" className={mode === "tree" ? "active" : ""} onClick={() => setMode("tree")}>
            <FolderOpen size={18} /> File tree
          </button>
          <button type="button" className={mode === "runtime" ? "active" : ""} onClick={() => setMode("runtime")}>
            <FlowArrow size={18} /> Runtime flow
          </button>
        </nav>
        <div className="top-actions">
          <button
            type="button"
            className={`validation-chip ${errors ? "has-errors" : ""}`}
            onClick={() => setShowIssues((value) => !value)}
          >
            {errors ? <WarningCircle size={19} weight="fill" /> : <CheckCircle size={19} weight="fill" />}
            <span>
              <strong>{errors ? `${errors} errors` : "Valid architecture"}</strong>
              <small>{warnings} warnings</small>
            </span>
          </button>
          <button type="button" className="secondary-button" onClick={() => setShowFiles(true)} aria-label="Preview files">
            <FileCode size={18} />
            Preview files
          </button>
          <button type="button" className="primary-button" onClick={exportBlueprint}>
            <Export size={18} />
            Export
          </button>
        </div>
      </header>

      <div className="workspace-grid">
        <ComponentLibrary onAdd={addNode} />
        <section className="canvas-region">
          <div className="canvas-toolbar">
            <div>
              <span className="eyebrow">Current project</span>
              <strong>Research Toolkit Plugin</strong>
            </div>
            <div className="canvas-summary">
              <span><i className="dot purple" /> {nodes.filter((node) => node.data.kind === "skill").length} skill</span>
              <span><i className="dot orange" /> {nodes.filter((node) => node.data.kind === "mcp").length} MCP</span>
              <span><i className="dot teal" /> {nodes.length} nodes</span>
            </div>
          </div>

          {showIssues && (
            <div className="issues-popover">
              <header>
                <strong>Validation</strong>
                <span>{issues.length || "No"} issues</span>
              </header>
              {issues.length === 0 ? (
                <p className="success-message"><CheckCircle size={17} weight="fill" /> Ready to export.</p>
              ) : (
                issues.map((issue) => (
                  <button
                    type="button"
                    key={issue.message}
                    onClick={() => issue.nodeId && setSelectedId(issue.nodeId)}
                    className={issue.severity}
                  >
                    {issue.message}
                  </button>
                ))
              )}
            </div>
          )}

          <div className="canvas-content" ref={wrapperRef}>
            {mode === "mind" && (
              <ReactFlow
                nodes={nodes}
                edges={styledEdges}
                nodeTypes={nodeTypes}
                onInit={setReactFlow}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_, node) => setSelectedId(node.id)}
                onPaneClick={() => setSelectedId(null)}
                onDrop={onDrop}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                fitView
                fitViewOptions={{ padding: 0.18 }}
                minZoom={0.35}
                maxZoom={1.8}
                deleteKeyCode={null}
              >
                <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="#273146" />
                <MiniMap
                  pannable
                  zoomable
                  nodeColor={(node) => kindMeta[node.data.kind]?.color ?? "#5a72a0"}
                  maskColor="rgba(5, 10, 18, .78)"
                />
                <Controls showInteractive={false} />
              </ReactFlow>
            )}
            {mode === "tree" && <FileTreeView files={files} />}
            {mode === "runtime" && <RuntimeView />}
          </div>
        </section>
        <Inspector
          node={selectedNode}
          issues={issues}
          onChange={updateSelected}
          onDelete={deleteSelected}
        />
      </div>

      <footer className="statusbar">
        <span><BracketsCurly size={16} /> Agent Skills spec</span>
        <span>Progressive disclosure: metadata → instructions → resources</span>
        <span className={errors ? "status-error" : "status-ok"}>
          {errors ? <WarningCircle size={15} weight="fill" /> : <CheckCircle size={15} weight="fill" />}
          {errors} errors · {warnings} warnings
        </span>
      </footer>

      {showFiles && (
        <FilePreview
          files={files}
          onClose={() => setShowFiles(false)}
          onExport={exportBlueprint}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle size={18} weight="fill" />
          {toast}
          <button type="button" onClick={() => setToast("")}>Dismiss</button>
        </div>
      )}
    </main>
  );
}

export function App() {
  return (
    <ReactFlowProvider>
      <Workspace />
    </ReactFlowProvider>
  );
}
