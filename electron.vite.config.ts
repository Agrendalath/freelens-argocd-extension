import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import pluginExternal from "vite-plugin-external";
import sassDts from "vite-plugin-sass-dts";

export default defineConfig({
  // main process has full access to Node.js APIs
  main: {
    build: {
      lib: {
        entry: resolve(__dirname, "src/main/index.ts"),
        // The v2 host accepts a CommonJS main-process entry.
        formats: ["cjs"],
      },
      rollupOptions: {
        output: {
          // silence warning about using `chunk.default` to access the default export
          exports: "named",
          // prefer separate files for each module
          preserveModules: process.env.VITE_PRESERVE_MODULES === "true",
          preserveModulesRoot: "src/main",
        },
      },
      sourcemap: true,
    },
    plugins: [
      react({
        jsxRuntime: "automatic",
      }),
      externalizeDepsPlugin({
        // do not bundle modules provided by the host app
        include: ["electron", "mobx"],
        // bundle proxy agent into the extension (not provided by Freelens runtime)
        exclude: ["hpagent"],
      }),
      pluginExternal({
        // the modules are provided by the host app as a global variable
        externals: {
          electron: "commonjs electron",
          mobx: "globalThis.FreelensExtensionApi.Mobx",
        },
      }),
    ],
  },
  // renderer process in Freelens can use Node.js modules then it is configured
  // with settings for preload script
  preload: {
    build: {
      lib: {
        entry: resolve(__dirname, "src/renderer/index.tsx"),
        // The v2 host loads renderer extensions as ES modules from a URL.
        formats: ["es"],
      },
      outDir: "out/renderer",
      rollupOptions: {
        output: {
          // silence warning about using `chunk.default` to access the default export
          exports: "named",
          // prefer separate files for each module
          preserveModules: process.env.VITE_PRESERVE_MODULES === "true",
          preserveModulesRoot: "src/renderer",
        },
      },
      sourcemap: true,
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
    plugins: [
      sassDts({
        enabledMode: ["development", "production"],
      }),
      react({
        babel: {
          plugins: [
            [
              "@babel/plugin-proposal-decorators",
              {
                version: "2023-05",
              },
            ],
          ],
        },
      }),
      externalizeDepsPlugin({
        // do not bundle modules provided by the host app
        include: [
          "mobx",
          "mobx-react",
          "react",
          "react-dom",
        ],
        // bundle all other modules (incl. hpagent for Argo CD API proxy)
        exclude: ["hpagent"],
      }),
      pluginExternal({
        // the modules are provided by the host app as a global variable
        externals: {
          mobx: "globalThis.FreelensExtensionApi.Mobx",
          "mobx-react": "globalThis.FreelensExtensionApi.MobxReact",
          react: "globalThis.FreelensExtensionApi.React",
          "react-dom": "globalThis.FreelensExtensionApi.ReactDom",
          "react/jsx-runtime": "globalThis.FreelensExtensionApi.ReactJsxRuntime",
        },
      }),
    ],
  },
});
