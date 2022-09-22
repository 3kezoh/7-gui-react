export default {
  collectCoverage: true,
  coverageReporters: ["html"],
  testEnvironment: "jsdom",
  preset: "ts-jest/presets/default-esm",
  moduleNameMapper: {
    "^.+\\.css$": "identity-obj-proxy",
  },
};
