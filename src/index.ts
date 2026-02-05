#!/usr/bin/env node

import { stdin } from "process";

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


const args = process.argv.slice(2).join(" ");

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



async function run(input: string) {
  if (!shouldPolish(input)) {
    console.log(input);
    return;
  }

  const clean = stripPolish(input);

  try {
    const refined = await refineWithOllama(clean);
    console.log(refined);
  } catch {
    console.log(clean);
  }
}



if (args) {
  run(args);
} 
else {
  const chunks: Buffer[] = [];

  stdin.on("data", (chunk) => {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  });

  stdin.on("end", () => {
    const input = Buffer.concat(chunks).toString("utf8").trim();
    run(input);
  });
}
