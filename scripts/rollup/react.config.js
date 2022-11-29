import generatePackageJson from "rollup-plugin-generate-package-json";
import { getPackageJSON, resolvePkgPath, getBaseRollupPlugin } from "./utils";

const { name, module } = getPackageJSON("react");
const pkgPath = resolvePkgPath(name);
const distPath = resolvePkgPath(name, true);

export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${distPath}/index.js`,
      name: "index.js",
      format: "umd",
    },
    plugins: [
      ...getBaseRollupPlugin(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: distPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: "index.js",
        }),
      }),
    ],
  },
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${distPath}/jsx-runtime.js`,
        name: "jsx-runtime.js",
        format: "umd",
      },
      {
        file: `${distPath}/jsx-dev-runtime.js`,
        name: "jsx-dev-runtime.js",
        format: "umd",
      },
    ],
    plugins: getBaseRollupPlugin(),
  },
];
