import js from "@eslint/js"
import globals from "globals"

export default [
  { ignores: ["dist/", "examples/", "node_modules/", "coverage/"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "webpack.config.js", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      // The library logs unused caught errors on purpose in the storage fallbacks
      "no-unused-vars": ["error", { caughtErrors: "none" }]
    }
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node, ...globals.jest }
    },
    rules: {
      "no-unused-vars": ["error", { caughtErrors: "none" }],
      // Tests replace the node localStorage shim with their own in-memory instance
      "no-global-assign": ["error", { exceptions: ["localStorage"] }]
    }
  }
]
