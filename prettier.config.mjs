/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 80,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  tailwindFunctions: ["cn", "clsx", "cva"],
  tailwindStylesheet: "./app/globals.css",
  trailingComma: "all",
};

export default config;
