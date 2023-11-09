import "@testing-library/jest-dom/vitest";

// @see {@link https://github.com/testing-library/react-testing-library/issues/1197}
globalThis.jest = {
  ...globalThis.jest,
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};
