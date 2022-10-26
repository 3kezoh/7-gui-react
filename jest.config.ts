export default {
  collectCoverage: true,
  coverageReporters: ["html"],
  testEnvironment: "jsdom",
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.css$": "jest-css-modules-transform",
  },
};
