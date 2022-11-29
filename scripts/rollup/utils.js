import path from "path";
import fs from "fs";

import ts from "rollup-plugin-typescript2";
import cjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

const pkgPath = path.resolve(__dirname, "../../packages");
const distPath = path.resolve(__dirname, "../../dist/node_modules");

export const resolvePkgPath = (pkgName, isDist) => {
  if (isDist) {
    return `${distPath}/${pkgName}`;
  } else {
    return `${pkgPath}/${pkgName}`;
  }
};

export const getPackageJSON = (pkgName) => {
  const path = `${resolvePkgPath(pkgName)}/package.json`;
  const str = fs.readFileSync(path, {
    encoding: "utf-8",
  });
  return JSON.parse(str);
};

/** commonJs 规范 ts 转化为 js */
export const getBaseRollupPlugin = ({
  alias = { __DEV__: true },
  typescript = {},
} = {}) => {
  return [replace(alias), cjs(), ts(typescript)];
};
