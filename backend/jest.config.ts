module.exports = {
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
      },
    },
    moduleFileExtensions: ["ts", "js", "json"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testMatch: ["**/test/**/*.test.(ts)"],
    testEnvironment: "node",
    collectCoverage: false,
    coverageDirectory: "coverage",
    verbose: true,
    testTimeout: 20000
  };