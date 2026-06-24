# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Skill Architecture Studio — a desktop-first, single-page web app for visually designing Agent Skills and Codex plugins as a node graph. Users compose a graph on a canvas, edit node metadata, see live validation, preview the project files the graph would generate, and export a JSON blueprint. There is no backend; all state is in-memory in the browser.

## Commands

Package manager is **pnpm** (a workspace; see `pnpm-workspace.yaml`). The `.npmrc` redirects the cache to a local `.npm-cache/`.

```bash
pnpm install              # install deps (CI uses --frozen-lockfile)
pnpm dev                  # Vite dev server on 127.0.0.1
pnpm build                # production build to dist/
pnpm preview              # serve the built dist/ on 127.0.0.1
pnpm test                 # run the full Vitest suite once (vitest run)

pnpm exec vitest run src/model.test.js     # run a single test file
pnpm exec vitest run -t "generates skill"  # run tests matching a name
pnpm exec vitest                           # watch mode
```

Per `AGENTS.md`: run the dev server and preview yourself rather than handing the user start instructions.

## Architecture

The central design decision is the split between a **pure model layer** (`src/model.js`) and the **React UI layer** (`src/App.jsx` + `src/components/`). The model knows nothing about React; the UI derives everything from it.

### `src/model.js` — the source of truth

- **`kindMeta`** is the registry of the nine node *kinds* (`plugin`, `skill`, `skill-md`, `script`, `reference`, `asset`, `mcp`, `app`, `agent-config`), each with a `title`, `color`, and `group`. Nearly everything visual keys off this: node rendering, the component library, the inspector, edge coloring, and the minimap.
- **`createNode(kind, position, sequence)`** + **`nodeDefaults`** — factory and per-kind default `data` for new nodes.
- **`initialNodes` / `initialEdges`** — the seed "Research Toolkit" plugin graph the app loads with.
- **`validateProject(nodes, edges)`** → array of `{ severity, message, nodeId? }`. Current rules: a plugin manifest must exist; plugin/skill slugs must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`; each skill must connect to a `skill-md` node; short skill descriptions warn; unconnected MCP nodes warn.
- **`generateProjectFiles(nodes, edges)`** → a `{ path: contents }` map (SKILL.md and `agents/openai.yaml` per skill, `plugin.json`, `.mcp.json`, `.app.json`, `marketplace.json`, `architecture.json`). This derives files from the graph; it is what File tree view and the file preview render.

### React layer

- **`App.jsx`** — the exported `App` wraps `Workspace` in `ReactFlowProvider`. `Workspace` owns **all** state: `useNodesState`/`useEdgesState` (React Flow) plus local UI state (`mode`, `selectedId`, `showFiles`, `showIssues`, `toast`). `issues` and `files` are `useMemo`-derived from nodes/edges, so they stay live as the graph changes. Three view `mode`s: `"mind"` (the React Flow canvas), `"tree"` (`FileTreeView`), `"runtime"` (`RuntimeView`).
- **`components/ArchitectureNode.jsx`** — the one custom React Flow node type, registered as `nodeTypes = { architecture }`. **Every node uses `type: "architecture"`**; the kind lives in `data.kind`.
- **`components/ComponentLibrary.jsx`** — left sidebar. Adds nodes by drag (sets a `application/skill-node` dataTransfer payload consumed by `App`'s `onDrop`) or by click.
- **`components/Inspector.jsx`** — right sidebar; edits the selected node's `data` fields via `updateSelected`.
- **`components/FilePreview.jsx`** — modal listing generated files with copy/export.
- **`components/RuntimeView.jsx`** — a static, educational view of the progressive-disclosure stages (no live data).

### Data flow

Add: ComponentLibrary → `addNode` (drag uses `reactFlow.screenToFlowPosition`; click uses a fallback position) → `createNode`. Edit: Inspector `onChange` → `updateSelected` patches `node.data`. Edges are recolored in `App` (`styledEdges`) by their source node's kind color. Export serializes `{ nodes, edges, files }` to a downloaded JSON file.

## Conventions and gotchas

- **Adding a new node kind touches several files in lockstep:** `nodeDefaults` and `kindMeta` (`model.js`), the `icons` map (`ArchitectureNode.jsx`), the `components` list (`ComponentLibrary.jsx`), the "Loaded when" copy (`Inspector.jsx`), and usually `generateProjectFiles`.
- React Flow's built-in delete is disabled (`deleteKeyCode={null}`); deletion happens only through the Inspector's delete button.
- Tests run in jsdom and depend on stubs in `src/test-setup.js` (`ResizeObserver`, `URL.createObjectURL`, `HTMLAnchorElement.prototype.click`) — React Flow and the export flow need them. Add similar stubs rather than mocking the components.
- **Deploy:** pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds with `GITHUB_PAGES=true` (sets Vite `base` to `/agent-skill-diagram/`) and publishes `dist/` to GitHub Pages.

## Design

This started as a prototype with a fixed visual target. `AGENTS.md` holds durable product/design decisions and names `design-reference/blueprint-canvas.png` as the source of visual truth; `design-qa.md` records the QA pass against it. When making substantial visual changes, treat that reference image as authoritative for layout, density, color, and typography, and record new durable design decisions back into `AGENTS.md`.
