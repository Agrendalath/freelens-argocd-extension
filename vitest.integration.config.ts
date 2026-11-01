import { defineConfig } from "vitest/config";

// The integration tests launch a packaged Freelens with Playwright and install
// the extension into it, so they are not part of vitest.config.ts and run only
// via `pnpm test:integration`. They skip unless FREELENS_EXECUTABLE_PATH (or
// FREELENS_PATH / FREELENS_BINARY) and EXTENSION_PATH are set.
export default defineConfig({
  test: {
    name: "integration",
    environment: "node",
    include: ["integration/__tests__/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 5 * 60 * 1000,
    hookTimeout: 120_000,
  },
});
