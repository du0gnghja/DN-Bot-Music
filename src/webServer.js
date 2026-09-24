const http = require("http");

const port = Number.parseInt(process.env.PORT || "10000", 10);
const host = process.env.HOST || "0.0.0.0";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

function createWebServer() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (request.method !== "GET" || !["/", "/healthz"].includes(url.pathname)) {
      response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ok: false, error: "Not found" }));
      return;
    }

    const body = url.pathname === "/healthz"
      ? { ok: true, service: "groove", uptime: Math.floor(process.uptime()) }
      : "Groove bot is running";

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": typeof body === "string"
        ? "text/plain; charset=utf-8"
        : "application/json; charset=utf-8",
    });
    response.end(typeof body === "string" ? body : JSON.stringify(body));
  });

  server.on("error", (error) => {
    console.error("[WebServer] Failed to start health server:", error);
    process.exitCode = 1;
  });

  return server;
}

function startWebServer() {
  const server = createWebServer();
  server.listen(port, host, () => {
    console.log(`[WebServer] Listening on http://${host}:${port}`);
  });
  return server;
}

module.exports = { startWebServer };
