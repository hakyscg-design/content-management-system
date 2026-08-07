import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "tests/bootstrap/**/*.test.ts",
      "tests/foundation/**/*.test.ts",
      "tests/integration/**/*.test.ts",
      "tests/local-tool/**/*.test.ts",
      "tests/services/**/*.test.ts"
    ],
    globals: true,
    coverage: {
      enabled: false
    }
  }
});
