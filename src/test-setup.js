import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserver;
globalThis.URL.createObjectURL = () => "blob:test-blueprint";
globalThis.URL.revokeObjectURL = () => {};
HTMLAnchorElement.prototype.click = () => {};
