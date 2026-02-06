# idkbro

fix your prompt when you don't know what you're doing.

idkbro is a local-first CLI tool that rewrites rough prompts into clearer, more precise ones for AI coding assistants.

It only runs when you explicitly ask it to.

## Install

```bash
npm install -g idkbro
```

## Requirements

- Node.js ≥ 18
- Ollama installed and running
- Decent machine (local LLMs, no cloud)

This tool is not optimized for low-end systems.

## Setup (one time)

```bash
idkbro setup
```

This checks Ollama and pulls the required model if missing.

## Usage

Add `idkbro` at the end of your prompt.

```bash
idkbro "add jwt auth idkbro"
```

Without the keyword, nothing happens.

```bash
idkbro "add jwt auth"
```

## Pipes

```bash
echo "design rate limiter idkbro" | idkbro
```

## OpenCode

```bash
idkbro-opencode
```

Runs OpenCode with idkbro support inside the prompt input.

## Behavior

- Rewrites prompts only
- Does not change intent
- Does not add requirements
- Outputs text only
- If the model is slow or unavailable, input is returned unchanged

## Versioning

- 0.x releases
- Breaking changes allowed
- Built for power users

## License

MIT
