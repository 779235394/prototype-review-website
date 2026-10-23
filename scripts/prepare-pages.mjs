import { access, cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../site.config.ts";

const projectDirectory = fileURLToPath(new URL("../", import.meta.url));
const clientDirectory = path.join(projectDirectory, "build/client");
const pageDirectory = path.join(clientDirectory, siteConfig.basePath.slice(1, -1));
const publishDirectory = path.join(projectDirectory, "build/pages");
const pageFiles = [
  ["index.html", "index.html"],
  ["guide/index.html", "guide/index.html"],
  ["deployment/index.html", "deployment/index.html"],
  ["404/index.html", "404.html"],
];
const publicFiles = ["favicon.svg"];

/** 仅复制约定的预渲染页面与公开资源，框架的单页入口不进入发布目录。 */
async function preparePages() {
  for (const [source] of pageFiles) {
    const sourcePath = path.join(pageDirectory, source);
    const sourceStat = await stat(sourcePath);
    if (!sourceStat.isFile()) {
      throw new Error(`约定的静态页面不是文件：${source}`);
    }
  }
  for (const file of publicFiles) {
    await access(path.join(clientDirectory, file));
  }
  const assetsDirectory = path.join(clientDirectory, "assets");
  const assetsStat = await stat(assetsDirectory);
  if (!assetsStat.isDirectory()) {
    throw new Error("约定的编译资源目录不存在。");
  }

  await rm(publishDirectory, { recursive: true, force: true });
  await mkdir(publishDirectory, { recursive: true });
  for (const [source, destination] of pageFiles) {
    const destinationPath = path.join(publishDirectory, destination);
    await mkdir(path.dirname(destinationPath), { recursive: true });
    await cp(path.join(pageDirectory, source), destinationPath, { errorOnExist: true, force: false });
  }
  await cp(assetsDirectory, path.join(publishDirectory, "assets"), { recursive: true, errorOnExist: true, force: false });
  for (const file of publicFiles) {
    await cp(path.join(clientDirectory, file), path.join(publishDirectory, file), { errorOnExist: true, force: false });
  }
  console.info("[原型评审台官网] 静态发布目录已生成：build/pages/");
}

try {
  await preparePages();
} catch (cause) {
  console.error("[原型评审台官网] 整理静态产物失败，停止构建。", cause);
  process.exitCode = 1;
}
