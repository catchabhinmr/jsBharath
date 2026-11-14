import { loadTodos, parseCommand, saveTodos, USAGE, type Command, type Result, type Todo } from "./todos.ts";

const FILE = "todos.json";

type Outcome = { todos: Todo[]; output: string[]; save: boolean };

function execute(command: Command, todos: Todo[]): Result<Outcome> {
  switch (command.kind) {
    case "add": {
      const id = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      const added: Todo = { id, text: command.text, done: false };
      return { ok: true, value: { todos: [...todos, added], output: [`Added #${id}: ${added.text}`], save: true } };
    }
    case "list": {
      const lines = todos.map((t) => `${t.done ? "[x]" : "[ ]"} ${t.id} ${t.text}`);
      return { ok: true, value: { todos, output: lines.length > 0 ? lines : ["No to-dos yet."], save: false } };
    }
    case "done": {
      const todo = todos.find((t) => t.id === command.id);
      if (!todo) return { ok: false, error: `No to-do with id ${command.id}` };
      return {
        ok: true,
        value: {
          todos: todos.map((t) => (t.id === command.id ? { ...t, done: true } : t)),
          output: [`Completed #${todo.id}: ${todo.text}`],
          save: true,
        },
      };
    }
    case "delete": {
      const todo = todos.find((t) => t.id === command.id);
      if (!todo) return { ok: false, error: `No to-do with id ${command.id}` };
      return {
        ok: true,
        value: { todos: todos.filter((t) => t.id !== command.id), output: [`Deleted #${todo.id}: ${todo.text}`], save: true },
      };
    }
    default: {
      // If a Command variant has no case above, `command` is not `never` here and tsc fails.
      const unhandled: never = command;
      return unhandled;
    }
  }
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main(): Promise<void> {
  const parsed = parseCommand(process.argv.slice(2));
  if (!parsed.ok) fail(`${parsed.error}\n${USAGE}`);

  const loaded = await loadTodos(FILE);
  if (!loaded.ok) fail(loaded.error);

  const result = execute(parsed.value, loaded.value);
  if (!result.ok) fail(result.error);

  if (result.value.save) await saveTodos(FILE, result.value.todos);
  for (const line of result.value.output) console.log(line);
}

await main();
