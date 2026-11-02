import http from "node:http";

const notes = [
  { id: 1, text: "Buy milk" },
  { id: 2, text: "Call mom" },
  { id: 3, text: "Learn JS" },
];

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const { pathname } = url;

  // Only GET is supported; everything else is an unknown route
  if (req.method !== "GET") {
    return sendJson(res, 404, { error: "Route not found" });
  }

  // GET /health
  if (pathname === "/health") {
    return sendJson(res, 200, {
      status: "ok",
      uptimeSeconds: Math.floor(process.uptime()),
    });
  }

  // GET /notes  (with optional ?search=)
  if (pathname === "/notes") {
    const search = url.searchParams.get("search");
    const result = search
      ? notes.filter(n => n.text.toLowerCase().includes(search.toLowerCase()))
      : notes;
    return sendJson(res, 200, result);
  }

  // GET /notes/:id
  const match = pathname.match(/^\/notes\/([^/]+)$/);
  if (match) {
    const id = Number(match[1]);
    if (!Number.isInteger(id)) {
      return sendJson(res, 400, { error: "Note id must be a number" });
    }
    const note = notes.find(n => n.id === id);
    if (!note) {
      return sendJson(res, 404, { error: "Note not found" });
    }
    return sendJson(res, 200, note);
  }

  sendJson(res, 404, { error: "Route not found" });
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Listening on http://localhost:${port}`));