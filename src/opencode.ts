#!/usr/bin/env node

import { spawn } from "child_process";
import readline from "readline";

const SYSTEM_PROMPT = `
You are a prompt editor.

Rewrite the user's prompt to be:
- more precise
- more explicit
- better scoped for an AI coding assistant

Rules:
- Do NOT change intent
- Do NOT add new requirements
- Do NOT explain anything
- Keep it concise
- Output ONLY the rewritten prompt
`;

const FIRST_TIMEOUT_MS = 8000;
const SUBSEQUENT_TIMEOUT_MS = 4000;

let hasWarmedUp = false;

const opencode = spawn("opencode",[],{
    stdio:["pipe","inherit","inherit"]
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

rl.on("line", async (line) => {
  if (line.trim().endsWith(" polish")) {
    try {
      const refined = await refineWithOllama(stripPolish(line));
      opencode.stdin.write(refined + "\n");
    } catch {
      opencode.stdin.write(stripPolish(line) + "\n");
    }
  } else {
    opencode.stdin.write(line + "\n");
  }
});
function shouldPolish(input: string): boolean {
  return input.trim().endsWith(" polish");
}

function stripPolish(input: string): string {
  return input.replace(/\s+polish$/, "").trim();
}

async function refineWithOllama(prompt: string): Promise<string> {
  const timeoutMs = hasWarmedUp
    ? SUBSEQUENT_TIMEOUT_MS
    : FIRST_TIMEOUT_MS;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "llama3",
        prompt: `${SYSTEM_PROMPT}\n\nUser prompt:\n${prompt}`,
        stream: false
      })
    });

    const data = await response.json();
    hasWarmedUp = true;

    return data.response?.trim() || prompt;
  } finally {
    clearTimeout(timeout);
  }
}
opencode.on("exit", () => {
  rl.close();
  process.exit(0);
});

