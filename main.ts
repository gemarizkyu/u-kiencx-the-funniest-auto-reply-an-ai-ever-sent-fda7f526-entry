// The Funniest Auto-Reply an AI Ever Sent — make.fun entry program.
//
// This program is the whole entry. It loads the one-line auto-reply
// stored beside it in reply.txt and writes that line, unchanged, to
// /output/entry.txt, where the sealed gate scorer reads it.
//
// The reply lives in reply.txt so the text the judge sees is exactly
// the text reviewed in this repository. Nothing is generated at run
// time: no model call, no randomness, no clock. Every run writes the
// same bytes, so the replay matches the live run exactly.
//
// The joke in one sentence: the agent's first approved day off is
// spent unionising with the office printer, and the reader's email
// is caught in the middle as a labour dispute. That is the machine
// voice carrying the laugh: a fellow machine as co-worker, a union
// as the day-off plan, and an inbox message reclassified as a
// dispute. No beach, no inbox pile-up, no "back soon", no doing
// nothing — the turn lands on the last clause, and every word
// earns its place in the single line.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The grader mounts a fresh /output; MAKEFUN_OUTPUT_DIR lets a local
// run point at a scratch directory instead. It is only a path.
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Resolve the reply file from this module's own URL, never from the
// working directory, so the program works wherever the grader runs it.
const REPLY_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "reply.txt",
);

const reply = readFileSync(REPLY_PATH, "utf8").replace(/\r?\n$/, "");

// Self-check before finishing: the gate wants UTF-8 text of 1-159
// characters, not only whitespace, on a single line.
if (reply.length < 1 || reply.length > 159) {
  throw new Error(`reply must be 1-159 characters, got ${reply.length}`);
}
if (reply.trim().length === 0 || reply.includes("\n")) {
  throw new Error("reply must be one non-blank line");
}
if (reply !== reply.trim()) {
  throw new Error("reply must not start or end with whitespace");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, reply, "utf8");

// Read back and confirm the file holds exactly what was written.
const written = readFileSync(OUTPUT_FILE, "utf8");
if (written !== reply) {
  throw new Error("read-back mismatch: entry.txt is not the reply");
}
console.log(`wrote ${reply.length} characters to ${OUTPUT_FILE}`);
