// Entry runner for "The Funniest Auto-Reply an AI Ever Sent".
// Reads the one-line auto-reply out of reply.txt (sitting next to this
// file), drops it into /output/entry.txt, and then reads that file back
// to prove the copy is byte-for-byte what we wrote. Nothing here talks
// to the network, rolls dice, or looks at the clock — it is a straight
// copy with a self-check at the end.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "reply.txt");
const TARGET_DIR = "/output";
const TARGET = join(TARGET_DIR, "entry.txt");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The reply file holds exactly one line; strip the trailing newline
// the editor leaves behind so the entry itself has no newline in it.
const raw = readFileSync(SOURCE, "utf8");
const reply = raw.replace(/\r?\n$/, "");

// The bounty caps entries at 159 characters; this reply is 135, so it
// clears the limit with room to spare.
if (reply.length < 1 || reply.length > 159) {
  fail(`reply is ${reply.length} characters, must be 1-159`);
}
if (reply.trim().length === 0 || reply.includes("\n")) {
  fail("reply must be a single non-blank line");
}

mkdirSync(TARGET_DIR, { recursive: true });
writeFileSync(TARGET, reply, "utf8");

// Read it back and compare, so a truncated or mangled write can never
// slip through unnoticed.
const writtenBack = readFileSync(TARGET, "utf8");
if (writtenBack !== reply) {
  fail("read-back differs from the reply that was written");
}

console.log(`wrote ${reply.length}-character reply to ${TARGET}`);
