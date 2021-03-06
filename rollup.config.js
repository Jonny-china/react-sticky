import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: {
    file: "lib/index.js",
    format: "cjs",
    plugins: [terser()],
  },
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
};
