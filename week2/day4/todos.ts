import { readFile, writeFile } from "node:fs/promises";

// ---------- Types ----------

export type Command =
  | { kind: "add"; text: string }
  | { kind: "list" }
  | { kind: "done"; id: number }
  | { kind: "delete"; id: number };

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export type Todo = { id: number; text: string; done: boolean };

export const USAGE = 'Usage: npx tsx src/todo.ts add "<text>" | list | done <id> | delete <id>';

// ---------- Parsing the command line ----------

function parseId(command: string, raw: string | undefined): Result<number> {
  const id = Number(raw);
  if (raw === undefined || raw.trim() === "" || !Number.isInteger(id) || id < 1) {
    return { ok: false, error: `${command} needs a numeric id` };
  }
  return { ok: true, value: id };
}

export function parseCommand(args: string[]): Result<Command> {
  const [name, arg] = args;
  switch (name) {
    case undefined:
      return { ok: false, error: "No command given" };
    case "add":
      if (arg === undefined || arg.trim() === "") {
        return { ok: false, error: "add needs the to-do text" };
      }
      return { ok: true, value: { kind: "add", text: arg } };
    case "list":
      return { ok: true, value: { kind: "list" } };
    case "done":
    case "delete": {
      const id = parseId(name, arg);
      if (!id.ok) return id; // pass the error value straight through
      return { ok: true, value: { kind: name, id: id.value } };
    }
    default:
      return { ok: false, error: `Unknown command: ${name}` };
  }
}

// ---------- Validating todos.json ----------

export function isTodo(x: unknown): x is Todo {
  return (
    typeof x === "object" &&
    x !== null &&
    "id" in x && typeof x.id === "number" && Number.isInteger(x.id) &&
    "text" in x && typeof x.text === "string" &&
    "done" in x && typeof x.done === "boolean"
  );
}

/**
 * Reads and parses a JSON file, returning `fallback` if the file is missing or empty.
 * JSON.parse cannot check the shape, so call it as `readJson<unknown>(...)`
 * and validate the result before trusting it.
 */
export async function readJson<T>(path: string, fallback: T): Promise<T> {
  let text: string;
  try {
    text = await readFile(path, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return fallback;
    throw error;
  }
  return text.trim() === "" ? fallback : JSON.parse(text);
}

export function parseTodos(path: string, data: unknown): Result<Todo[]> {
  if (!Array.isArray(data)) {
    return { ok: false, error: `${path} is corrupted: expected a list of to-dos` };
  }
  const items: unknown[] = data;
  const todos: Todo[] = [];
  for (const [index, item] of items.entries()) {
    if (!isTodo(item)) {
      return { ok: false, error: `${path} is corrupted: item ${index} is not a valid to-do` };
    }
    todos.push(item);
  }
  return { ok: true, value: todos };
}

export async function loadTodos(path: string): Promise<Result<Todo[]>> {
  let data: unknown;
  try {
    data = await readJson<unknown>(path, []);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `${path} could not be read: ${reason}` };
  }
  return parseTodos(path, data);
}

export async function saveTodos(path: string, todos: Todo[]): Promise<void> {
  await writeFile(path, JSON.stringify(todos, null, 2) + "\n");
}