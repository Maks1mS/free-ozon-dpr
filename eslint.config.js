import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    // files: ["src/**/*.js"],
    ignores: [
      "dist/**/*.js",
      "!scripts/**/*.js"
    ],
  },
  {    
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
];
