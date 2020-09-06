module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    worker: true
  },
  globals: {
    __static: "readonly"
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "prettier/prettier": "error",
    "semi": ["error", "never"]
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    },
    {
      env: {
        es6: true,
        node: true,
        worker: true
      },
      files: ["src/utilities/workers/**/*.{j,t}s?(x)"]
    }
  ]
};
