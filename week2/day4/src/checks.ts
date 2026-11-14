import { inspect } from "node:util";
import { isTodo, parseCommand } from "./todos.ts";

function printAligned(rows: [label: string, value: unknown][]): void {
  const width = Math.max(...rows.map(([label]) => label.length)) + 2;
  for (const [label, value] of rows) {
    console.log(`${label.padEnd(width)}→ ${inspect(value, { depth: null, breakLength: Infinity })}`);
  }
}

printAligned([
  ['parseCommand(["add", "Buy milk"])', parseCommand(["add", "Buy milk"])],
  ['parseCommand(["done", "2"])', parseCommand(["done", "2"])],
  ['parseCommand(["done", "abc"])', parseCommand(["done", "abc"])],
  ['parseCommand(["frobnicate"])', parseCommand(["frobnicate"])],
]);

printAligned([
  ['isTodo({ id: 1, text: "Buy milk", done: false })', isTodo({ id: 1, text: "Buy milk", done: false })],
  ['isTodo({ id: "1", text: "Buy milk" })', isTodo({ id: "1", text: "Buy milk" })],
]);
