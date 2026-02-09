import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  basePath: __dirname,
});

const eslintConfig = [
  // 使用 compat.extends 来正确加载 Next.js 的配置
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",      // 允许使用 any
      "@typescript-eslint/no-unused-vars": "warn",     // 未使用变量仅警告，不报错
      "react/no-unescaped-entities": "off",            // 允许不转义的特殊字符 (如单引号)
      "@typescript-eslint/no-unused-expressions": "off", // 允许未使用的表达式
      "react-hooks/exhaustive-deps": "off",            // 忽略 Hook 依赖检查
      "@next/next/no-img-element": "off",
    },
    // 这里放置你原本的 ignores 配置
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;