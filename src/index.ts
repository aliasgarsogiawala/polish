#!/usr/bin/env node

import { stdin } from "process";
import { execSync, spawn} from "child_process";


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
if (args === "setup") {
  setupOllama();
  process.exit(0);
}


function isOllamaInstalled(): boolean {
  try {
    if (process.platform === "win32") {
      execSync("where ollama", { stdio: "ignore" });
    } else {
      execSync("which ollama", { stdio: "ignore" });
    }
    return true;
  } catch {
    return false;
  }
}

function isOllamaRunning(): boolean {
  try {
    execSync("ollama list", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function isModelAvailable(model: string): boolean {
  try {
    const output = execSync("ollama list", { encoding: "utf8" });
    return output.includes(model);
  } catch {
    return false;
  }
}

function startModelPull(model: string) {
  spawn("ollama", ["pull", model], {
    stdio: "ignore",
    shell: true,
    detached: true
  });
}

async function waitForModel(model: string): Promise<void> {
  console.log(`📦 Downloading model '${model}' (this may take a while)...`);

  while (true) {
    await new Promise(res => setTimeout(res, 3000));

    if (isModelAvailable(model)) {
      console.log(`\n✅ Model '${model}' is ready`);
      return;
    }

    console.log("⏳ Still downloading...");
  }
}



async function setupOllama() {
  console.log("🔧 Polish setup starting...\n");

  if (!isOllamaInstalled()) {
    console.log("❌ Ollama is not found in PATH");
    console.log("👉 Install from: https://ollama.com/download");
    console.log("👉 Restart your terminal after installation");
    return;
  }

  console.log("✅ Ollama is installed");

  if (!isOllamaRunning()) {
    console.log("❌ Ollama is installed but not running");
    console.log("👉 Start Ollama, then re-run: polish setup");
    return;
  }

  console.log("✅ Ollama is running\n");

  if (isModelAvailable("llama3")) {
    console.log("✅ Model 'llama3' is already available");
    console.log("🎉 Polish setup complete!");
    console.log("🚀 Try:");
    console.log('   polish "add jwt auth polish"\n');
    return;
  }

  startModelPull("llama3");
  await waitForModel("llama3");

  console.log("🎉 Polish setup complete!");
  console.log("🚀 Try:");
  console.log('   polish "add jwt auth polish"\n');
}



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
