#!/usr/bin/env node

import { stdin } from "process";

const args = process.argv.slice(2).join(" ");

function run(input: string) {
  console.log(input);
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
