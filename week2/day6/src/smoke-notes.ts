// Smoke test for notesApp.ts.
// 1. Start the server:   npx tsx src/notesApp.ts
// 2. In another terminal: npx tsx src/smoke-notes.ts

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

let failures = 0;

function check(name: string, condition: boolean, detail?: unknown): void {
    if (condition) {
        console.log(`PASS  ${name}`);
    } else {
        failures++;
        console.log(`FAIL  ${name}`, detail ?? "");
    }
}

async function call(method: string, path: string, body?: unknown) {
    const init: RequestInit = { method };
    if (body !== undefined) {
        init.headers = { "content-type": "application/json" };
        init.body = JSON.stringify(body);
    }
    const res = await fetch(`${BASE}${path}`, init);
    const text = await res.text();
    const data: unknown = text ? JSON.parse(text) : undefined;
    return { status: res.status, data };
}

// GET /notes
const list = await call("GET", "/notes");
check("GET /notes -> 200 with an array", list.status === 200 && Array.isArray(list.data), list);

// POST /notes
const created = await call("POST", "/notes", { text: "smoke test note" });
const note = created.data as { id: number; text: string };
check("POST /notes -> 201 with new note", created.status === 201 && note?.text === "smoke test note", created);

const badCreate = await call("POST", "/notes", { text: "" });
check("POST /notes with empty text -> 400", badCreate.status === 400, badCreate);

// GET /notes/:id
const fetched = await call("GET", `/notes/${note.id}`);
check("GET /notes/:id -> 200 with the note", fetched.status === 200 && (fetched.data as typeof note)?.id === note.id, fetched);

const badId = await call("GET", "/notes/abc");
check("GET /notes/abc -> 400", badId.status === 400, badId);

// PUT /notes/:id
const updated = await call("PUT", `/notes/${note.id}`, { text: "updated text" });
check("PUT /notes/:id -> 200 with updated text", updated.status === 200 && (updated.data as typeof note)?.text === "updated text", updated);

const badUpdate = await call("PUT", `/notes/${note.id}`, {});
check("PUT /notes/:id with no text -> 400", badUpdate.status === 400, badUpdate);

// DELETE /notes/:id (also cleans up the note this script created)
const deleted = await call("DELETE", `/notes/${note.id}`);
check("DELETE /notes/:id -> 204", deleted.status === 204, deleted);

const gone = await call("GET", `/notes/${note.id}`);
check("GET deleted note -> 404", gone.status === 404, gone);

const deleteMissing = await call("DELETE", `/notes/${note.id}`);
check("DELETE missing note -> 404", deleteMissing.status === 404, deleteMissing);

const updateMissing = await call("PUT", `/notes/${note.id}`, { text: "x" });
check("PUT missing note -> 404", updateMissing.status === 404, updateMissing);

console.log(failures === 0 ? "\nAll smoke tests passed" : `\n${failures} smoke test(s) failed`);
process.exit(failures === 0 ? 0 : 1);
