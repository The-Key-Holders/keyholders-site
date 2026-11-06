import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    env: {
      OPS_STORE: "memory",
      VITEST: "true",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // estimate.ts uses `import "server-only"` so Next never bundles the catalog
      // to the client. Vitest has no React Server graph, so shim it empty.
      "server-only": path.resolve(__dirname, "lib/cpe-fit/vitest-server-only.ts"),
    },
  },
});
