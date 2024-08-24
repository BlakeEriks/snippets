module.exports = {
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["react", "prettier"],
  extends: ["eslint:recommended", "plugin:react/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.js", "*.ts"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-confusing-arrow": "off",
    semi: ["error", "never"],
    quotes: ["error", "single", { avoidEscape: true }],
    indent: "off",
    "react-hooks/exhaustive-deps": "off",
    "testing-library/prefer-screen-queries": "off",
    "testing-library/no-node-access": "off",
    "react/jsx-key": "error",
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": 0,
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "no-extra-boolean-cast": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "react/no-unknown-property": "off",
    "no-unused-vars": "off",
    "no-unsafe-optional-chaining": "off",
    "comma-dangle": "off",
  },
};
