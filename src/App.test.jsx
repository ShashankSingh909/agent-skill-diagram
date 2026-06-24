import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App.jsx";

describe("Skill Architecture Studio", () => {
  it("renders the architecture workspace and primary tools", () => {
    render(<App />);

    expect(screen.getByText("Skill Architecture Studio")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mind map/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /file tree/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /runtime flow/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });

  it("switches modes and opens the generated file preview", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /file tree/i }));
    expect(screen.getByText("Generated structure")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /preview files/i }));
    expect(screen.getByRole("dialog", { name: /generated project files/i })).toBeInTheDocument();
  });

  it("confirms when a blueprint export is created", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Export" }));

    expect(screen.getByText("Blueprint exported")).toBeInTheDocument();
  });
});
