#!/usr/bin/env node

import { stdin } from "process";

const args = process.argv.slice(2).join(" ");

function shouldPolish(input: string): boolean {
  return input.trim().endsWith(" polish");
}

function stripPolish(input: string): string {
  return input.replace(/\s+polish$/, "").trim();
}


function run(input: string) {
  if (!shouldPolish(input)) {
    console.log(input);
    return;
  }

  const clean = stripPolish(input);

  console.log(clean);
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
