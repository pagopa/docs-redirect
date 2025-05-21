/* eslint.config.js */
const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  /* 1. Regole JS di base consigliate */
  js.configs.recommended,

  /* 2. Override per i sorgenti TypeScript */
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",   // usa le impostazioni del progetto
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      /* Disabilita le regole JS corrispondenti e sostituiscile con quelle TS */
      "no-unused-vars": "off",
      "no-undef": "off",

      /* Regole specifiche TypeScript */
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/consistent-type-imports": "warn",
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": [
        "error",
        { ignoreDeclarationMerge: true }
    ],
    "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^simpleHelper$" }
    ]
    }
  },

  /* 3. Piccolo “tweak” per gli output transpillati ES5 (facoltativo) */
  {
    files: ["build/**/*.js"],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script"
    },
    /* di solito non si lintea la cartella build/, ma se serve: */
    rules: {
      "no-unused-vars": "off",
      "no-undef": "warn"
    }
  }
];
