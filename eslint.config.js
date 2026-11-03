import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/node_modules/**", "dist/**", "src/routeTree.gen.ts"] },
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "as", objectLiteralTypeAssertions: "never" }],
      "no-restricted-syntax": ["error", { selector: "TSEnumDeclaration", message: "Use a const object + derived type instead of enum." }],
    },
  },
  // Module augmentation (router registration, Vite env typing) can only be written as `interface` declaration merges.
  { files: ["src/router.tsx", "src/vite-env.d.ts"], rules: { "@typescript-eslint/consistent-type-definitions": "off" } },
  { files: ["**/*.test.{ts,tsx}"], rules: { "@typescript-eslint/no-non-null-assertion": "off" } },
);
