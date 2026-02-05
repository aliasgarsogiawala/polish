import { stdin } from "process";

const chunks: Buffer[] = [];

function run(input: string) {
  console.log(input);
}

stdin.on("data", (chunk) => {
  chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
});

stdin.on("end", () => {
  const input = Buffer.concat(chunks).toString("utf8").trim();
  run(input);
});
