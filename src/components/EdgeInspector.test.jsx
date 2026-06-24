import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EdgeInspector } from "./EdgeInspector.jsx";

const nodes = [
  { id: "a", data: { kind: "plugin", label: "Research Toolkit" } },
  { id: "b", data: { kind: "skill", label: "Research Assistant" } },
];

function setup(edgeOverrides = {}) {
  const edge = { id: "edge-1", source: "a", target: "b", data: {}, ...edgeOverrides };
  const handlers = {
    onToggleDashed: vi.fn(),
    onToggleAnimated: vi.fn(),
    onDelete: vi.fn(),
  };
  render(<EdgeInspector edge={edge} nodes={nodes} {...handlers} />);
  return handlers;
}

describe("EdgeInspector", () => {
  it("shows the connection endpoints and controls", () => {
    setup();

    expect(screen.getByText("Research Toolkit")).toBeInTheDocument();
    expect(screen.getByText("Research Assistant")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dashed line/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /animated flow/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete connection/i })).toBeInTheDocument();
  });

  it("reflects dashed and animated state via aria-pressed", () => {
    setup({ data: { dashed: true }, animated: true });

    expect(screen.getByRole("button", { name: /dashed line/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /animated flow/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("invokes callbacks when its controls are used", async () => {
    const user = userEvent.setup();
    const { onToggleDashed, onToggleAnimated, onDelete } = setup();

    await user.click(screen.getByRole("button", { name: /dashed line/i }));
    await user.click(screen.getByRole("button", { name: /animated flow/i }));
    await user.click(screen.getByRole("button", { name: /delete connection/i }));

    expect(onToggleDashed).toHaveBeenCalledTimes(1);
    expect(onToggleAnimated).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
