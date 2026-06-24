# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Selected visual target: `design-reference/blueprint-canvas.png`.

Product decisions:

- Desktop-first, dark graphite technical workspace.
- The canvas is the primary surface; sidebars support it rather than compete with it.
- Visually distinguish skill internals, plugin packaging, and external MCP dependencies.
- Core interactions must work: add nodes, drag nodes, connect nodes, edit node metadata, switch views, validate, preview generated files, and export.
