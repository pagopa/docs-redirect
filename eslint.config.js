/* eslint.config.js */
const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  js.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      "no-redeclare": "off"
    }
  },

  {
    files: ["build/**/*.js"],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script"
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "warn"
    }
  }
];
