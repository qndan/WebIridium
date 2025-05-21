import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import tsdoc from "eslint-plugin-tsdoc";
import jestDom from "eslint-plugin-jest-dom";
import testingLibrary from "eslint-plugin-testing-library";

export default tseslint.config(
  { ignores: ["dist", "public", "coverage"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      jestDom.configs["flat/recommended"],
      testingLibrary.configs["flat/react"],
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      tsdoc,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "tsdoc/syntax": "error",
      "@typescript-eslint/no-explicit-any": "off", // :(
      "@typescript-eslint/no-misused-promises": "off", // this rule sucks
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // custom stuff
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "func-style": ["error", "expression"],
      "@typescript-eslint/no-restricted-types": [
        "error",
        {
          types: {
            "React.FC": {
              message:
                "Do not use React.FC. Use explicit props typing instead: ({ prop }: Props) => JSX.Element",
            },
            "React.FunctionComponent": {
              message:
                "Do not use React.FunctionComponent. Use explicit props typing instead: ({ prop }: Props) => JSX.Element",
            },
          },
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["*.css", "!*.module.css"],
              message:
                'Use CSS modules instead: import styles from "abc.module.css"',
            },
          ],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
);
