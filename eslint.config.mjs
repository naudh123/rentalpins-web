import next from "eslint-config-next/core-web-vitals";

// eslint-config-next 16 ships a native flat config (this entry already bundles
// the TypeScript config and default ignores). Using it directly avoids the
// FlatCompat circular-structure crash on ESLint 9.
/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...next,
  {
    // eslint-plugin-react-hooks 7 ships new "react-compiler"-aligned rules as
    // errors. They flag many long-standing, intentional patterns in this
    // codebase (e.g. ref-sync during render to keep the map camera stable).
    // Keep them visible as warnings rather than blocking the lint gate; the
    // genuinely actionable ones are tracked and fixed in the relevant modules.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
    },
  },
];

export default eslintConfig;
