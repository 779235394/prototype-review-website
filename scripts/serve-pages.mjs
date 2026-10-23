import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../site.config.ts";

const publishDirectory = fileURLToPath(new URL("../build/pages/", import.meta.url));
const hostname = "127.0.0.1";
const port = 4173;
const origin = `http://${hostname}:${port}`;
const mediaTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".data", "text/plain; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff2", "font/woff2"],
]);

/** 对未知站内地址返回独立不存在页面，保留真实的不存在状态。 */
async function sendNotFound(request, response) {
  const contents = await readFile(path.join(publishDirectory, "404.html"));
  response.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  response.end(contents);
}

/** 只提供当前官网的已构建静态文件，不提供接口、目录列表或首页重写。 */
async function serveRequest(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  const url = new URL(request.url, origin);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("地址编码无效。");
    return;
  }
  if (!pathname.startsWith(siteConfig.basePath)) {
    await sendNotFound(request, response);
    return;
  }
  const relativePath = pathname.slice(siteConfig.basePath.length);
  let requestedPath = path.resolve(publishDirectory, relativePath);
  const relativeToPublish = path.relative(publishDirectory, requestedPath);
  if (relativeToPublish.startsWith("..") || path.isAbsolute(relativeToPublish)) {
    await sendNotFound(request, response);
    return;
  }

  let fileStat;
  try {
    fileStat = await stat(requestedPath);
    if (fileStat.isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(308, { Location: `${url.pathname}/${url.search}` });
        response.end();
        return;
      }
      requestedPath = path.join(requestedPath, "index.html");
      fileStat = await stat(requestedPath);
    }
  } catch (cause) {
    if (cause.code === "ENOENT" || cause.code === "ENOTDIR") {
      await sendNotFound(request, response);
      return;
    }
    throw cause;
  }
  if (!fileStat.isFile()) {
    await sendNotFound(request, response);
    return;
  }
  const contentType = mediaTypes.get(path.extname(requestedPath));
  if (contentType === undefined) {
    throw new Error(`未配置该公开文件的媒体类型：${path.extname(requestedPath)}`);
  }
  const contents = await readFile(requestedPath);
  response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  response.end(contents);
}

await stat(path.join(publishDirectory, "index.html"));
await stat(path.join(publishDirectory, "404.html"));

/** 统一报告本地静态服务异常，不把读取失败伪装成首页成功响应。 */
async function handleRequest(request, response) {
  try {
    await serveRequest(request, response);
  } catch (cause) {
    console.error("[原型评审台官网] 本地静态文件读取失败。", cause);
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    response.end("静态文件读取失败，请查看本地命令输出。");
  }
}

const server = createServer(handleRequest);

/** 端口不可用时明确退出，不擅自改用其他端口。 */
server.on("error", function reportServerError(cause) {
  console.error("[原型评审台官网] 本地静态服务无法启动。", cause);
  process.exitCode = 1;
});

/** 输出含仓库前缀的真实本地访问地址。 */
server.listen(port, hostname, function reportPreviewAddress() {
  console.info(`[原型评审台官网] 本地静态预览：${origin}${siteConfig.basePath}`);
});
