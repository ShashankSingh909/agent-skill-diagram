# Skill Architecture Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive visual editor for Agent Skills, Codex plugins, and MCP dependencies.

**Architecture:** Keep graph semantics in pure functions and render them through React Flow. The app shell owns selection, mode, inspector, validation, and generated-file preview state.

**Tech Stack:** React 19, Vite 6, React Flow, Phosphor Icons, Vitest, Testing Library.

---

### Task 1: Graph model

**Files:**
- Create: `src/model.js`
- Test: `src/model.test.js`

- [ ] Implement `createNode(kind, position, sequence)` with kind-specific labels and paths.
- [ ] Implement `validateProject(nodes, edges)` for skill naming, required `SKILL.md`, plugin manifests, and disconnected MCP nodes.
- [ ] Implement `generateProjectFiles(nodes, edges)` for `SKILL.md`, `openai.yaml`, `plugin.json`, `.mcp.json`, and `marketplace.json`.
- [ ] Run `pnpm test src/model.test.js` and confirm all model tests pass.

### Task 2: Interactive canvas

**Files:**
- Create: `src/components/ArchitectureNode.jsx`
- Create: `src/components/ComponentLibrary.jsx`
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx`

- [ ] Register the architecture node type and render semantic handles.
- [ ] Add initial nodes and edges representing a research plugin with one skill and an external OpenAI Docs MCP dependency.
- [ ] Support drag-and-drop creation, node movement, new edges, node selection, and deletion.
- [ ] Run `pnpm test src/App.test.jsx` and confirm the workspace test passes.

### Task 3: Inspector, modes, validation, and export

**Files:**
- Create: `src/components/Inspector.jsx`
- Create: `src/components/FilePreview.jsx`
- Create: `src/components/FileTreeView.jsx`
- Create: `src/components/RuntimeView.jsx`
- Modify: `src/App.jsx`

- [ ] Bind inspector fields to the selected node's label, slug, description, and path.
- [ ] Add Mind map, File tree, and Runtime flow mode switching.
- [ ] Show validation counts and issue details.
- [ ] Add generated-file preview and JSON blueprint download.
- [ ] Run the complete test suite.

### Task 4: Blueprint Canvas styling

**Files:**
- Modify: `src/styles.css`

- [ ] Match the selected mock's three-column composition, density, typography, palette, and dotted canvas.
- [ ] Add responsive collapse behavior below 1100px.
- [ ] Add focus, hover, selected, invalid, and modal states.
- [ ] Run `pnpm build` and confirm the production build succeeds.

### Task 5: Browser verification and design QA

**Files:**
- Create: `design-qa.md`
- Create: `artifacts/prototype-desktop.png`
- Create: `artifacts/design-comparison.png`

- [ ] Run the local app and open it in the in-app browser.
- [ ] Verify mode switching, adding a node, selecting and editing it, previewing files, and export.
- [ ] Capture the implementation at 1440×1024.
- [ ] Compare it with `design-reference/blueprint-canvas.png`, fix P0-P2 findings, and record a passing QA report.
