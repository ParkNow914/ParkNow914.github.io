// Servidor estático que se comporta como o GitHub Pages: pasta -> index.html,
// caminho sem extensão -> .html, e o resto -> 404.html com status 404.
//   node scripts/serve.mjs [pasta=out] [porta=3100]
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = resolve(process.argv[2] || "out");
const port = Number(process.argv[3] || 3100);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

const isFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const base = join(root, path);
  if (!base.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  // Pasta sem barra final: o Pages redireciona para a versão com barra.
  if (!path.endsWith("/") && !extname(path) && isFile(join(base, "index.html"))) {
    res.writeHead(301, { Location: `${path}/` }).end();
    return;
  }
  const hit = [base, join(base, "index.html"), `${base}.html`].find(isFile);
  const file = hit || join(root, "404.html");
  res.writeHead(hit ? 200 : 404, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  if (req.method === "HEAD") res.end();
  else createReadStream(file).pipe(res);
}).listen(port, () => console.log(`servindo ${root} em http://localhost:${port}/`));
