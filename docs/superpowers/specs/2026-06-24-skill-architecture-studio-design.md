# Skill Architecture Studio Design

## Product

Build a desktop-first visual architecture editor for designing Agent Skills and Codex plugins. The user can compose a graph, understand progressive disclosure, inspect generated files, and distinguish a skill's internal resources from plugin packaging and external MCP dependencies.

## Primary workflow

1. Drag a component from the left library onto the canvas.
2. Connect it to a compatible parent or dependency.
3. Select the node and edit its metadata in the inspector.
4. Switch between Mind map, File tree, and Runtime flow views.
5. Review live validation and generated files.
6. Export the generated project as a downloadable JSON blueprint.

## Visual direction

Use the selected Blueprint Canvas mock as source truth: dark graphite surfaces, cyan/violet/green/orange semantic node colors, restrained borders, a dotted canvas, compact technical typography, and a three-column workspace.

## Architecture

- React and Vite for the frontend shell.
- React Flow for draggable nodes, handles, connections, zoom, pan, and minimap.
- Pure model functions for node creation, validation, and generated file content.
- Local component state only; no backend or persistence is required for this prototype.

## Success criteria

- Every visible primary control works.
- Nodes can be created, moved, selected, edited, connected, and deleted.
- Generated files respond to graph changes.
- Validation exposes naming and structural errors.
- The layout remains usable at common desktop widths.
