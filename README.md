# ✨ Polish

**Polish** is an *invisible, local-first CLI tool* that quietly improves your AI prompts  
— **but only when you ask it to**.

Think of it as autocorrect for prompts, not another chatbot to manage.

You write a rough prompt.  
You tack on one word: `polish`.  
Polish does its thing and gets out of your way.

---

## Why Polish Exists

We've all been there. You fire off a quick prompt to an AI tool, and... crickets. Or worse, it completely misunderstands you.

Most AI tools expect you to:
- become a "prompt engineering" expert
- write perfectly structured, unambiguous instructions
- completely change your workflow

Polish flips that script.

> **Write like you think. Add `polish` at the end. Keep moving.**

No new habits to build.  
No verbose explanations in your output.  
No vendor lock-in.

---

## Core Idea

Polish is a **stdin → stdout filter**. Simple as that.

It:
- reads your text
- optionally refines it (if you ask)
- outputs clean text

If you don't ask for refinement, Polish acts like it doesn't even exist. Zero interference.

---

## Usage

### Basic
```bash
polish "add jwt auth polish"
```

### Without keyword (no-op)

```bash
polish "add jwt auth"
```

Output passes through unchanged. Polish stays quiet.

---

### With pipes (recommended)

```bash
echo "add jwt auth polish" | polish
```

---

### Chaining with other tools

```bash
polish "add jwt auth polish" | opencode
```

Polish never clutters your output with explanations, headers, or logs —  
just the refined prompt, ready for the next tool in your pipeline.

---

## The `polish` Keyword (Important)

Polish activates **only if** `polish` is the **last word** of your input.

Examples:

| Input                 | Behavior  |
| --------------------- | --------- |
| `add jwt auth polish` | ✅ Refined |
| `polish add jwt auth` | ❌ Ignored |
| `add polish jwt auth` | ❌ Ignored |

This strict rule prevents accidental activation. No surprises.

---

## Design Philosophy

### 🫥 Invisibility First

Polish should **disappear from your awareness**.

* No interactive prompts
* No confirmations
* No banners or branding
* No emojis in output
* No explanatory text

If Polish fails for any reason, it **silently passes through** your original input. You keep working.

---

### 🔐 Safe by Default

Polish will never:
* Change your intent
* Add requirements you didn't ask for
* Execute commands
* Break your pipelines

It clarifies what you meant, but it won't second-guess you.

---

### 🧠 Editing, Not Generating

Polish **does not** try to "answer" your prompts or write code for you.

It's an editor, not a generator. It only:
* clarifies vague language
* adds scope when needed
* structures messy thoughts

You still own the prompt.

---

## AI Engine: Ollama (Local & Free)

Polish uses **Ollama**, a local LLM server. Why?

### Why Ollama?

* **100% free** — no usage limits, no credit cards
* **Runs locally** — your prompts never leave your machine
* **No API keys** — zero configuration hell
* **Works offline** — plane mode? No problem
* **Perfect for CLI tools** — fast, silent, reliable

Polish talks to Ollama via a simple HTTP API:

```
http://localhost:11434/api/generate
```

That's it. No SDKs, no auth, no complexity.

---

## Installing Ollama

### 1. Download

👉 [https://ollama.com/download](https://ollama.com/download)

(macOS, Linux, and Windows supported)

### 2. Pull a model

```bash
ollama pull llama3
```

You can use any model you like, but `llama3` is a solid choice for prompt refinement.

### 3. Verify it's running

```bash
ollama list
```

If you see your model, you're good to go.

---

## Installation (Development)

Clone and install:

```bash
git clone https://github.com/aliasgarsogiawala/polish.git
cd polish
npm install
```

---

## Running in Dev Mode

```bash
npm run dev -- "add jwt auth polish"
```

Or with stdin:

```bash
echo "add jwt auth polish" | npm run dev
```

---

## Installing as a Global CLI

### 1. Build

```bash
npm run build
```

### 2. Link globally

```bash
npm link
```

### 3. Test it

```bash
polish "add jwt auth polish"
```

Now `polish` is available everywhere in your terminal.

---

## Windows Notes (IMPORTANT)

Polish **works on Windows**, but you'll need to be a bit more deliberate with setup.

### Requirements

* **Node.js ≥ 18** (for native `fetch` support)
* Ollama installed and running
* `npm run build` completed
* `npm link` executed

### Common Windows Issues

#### `'polish' is not recognized`

You probably skipped `npm link` or closed your terminal too soon.

Fix:
* Run `npm link` in the project directory
* Restart your terminal
* Verify with:

```bash
where polish
```

You should see a path to the global npm bin folder.

---

#### CLI hangs or doesn't exit

This happens if stdin is read incorrectly. Polish already handles this properly (arguments first, stdin only when needed), but if you've modified the input logic, double-check it.

---

#### `fetch is not defined`

You're on Node < 18.

Fix:
* **Upgrade Node** (recommended), or
* Install a polyfill:

```bash
npm install node-fetch
```

Then import it at the top of `src/index.ts`:

```typescript
import fetch from 'node-fetch';
```

---

## Failure Behavior (By Design)

Polish follows a strict **fail-silent** policy:

| Scenario           | Result                  |
| ------------------ | ----------------------- |
| Ollama not running | Original input returned |
| Network error      | Original input returned |
| Model error        | Original input returned |
| No `polish` keyword | Original input returned |

**Polish never breaks your workflow.** If it can't help, it stays out of the way.

---

## Project Structure

```
polish/
├─ src/
│  └─ index.ts        # Main CLI logic
├─ dist/
│  └─ index.js        # Compiled output
├─ package.json       # Dependencies & scripts
├─ tsconfig.json      # TypeScript config
└─ README.md          # You are here
```

Clean and minimal. No bloat.

---

## Why No Flags? Why No Config?

Good question.

Flags add cognitive load. Every time you use a tool with flags, you have to remember:
* Which flags exist
* What they do
* What order they go in
* Whether you need them this time

Config files are worse — they break portability and add hidden state.

**Keywords are explicit and reversible.**  
If you typed `polish`, you meant it. If you didn't, it does nothing.

Simple.

---

## What Polish Is NOT

Let's be clear about what this tool **isn't**:

* ❌ **A chatbot** — Polish doesn't chat. It edits.
* ❌ **A command generator** — It won't write bash scripts for you.
* ❌ **A teaching tool** — It won't explain why your prompt was unclear.
* ❌ **A prompt library** — No templates, no examples, no "best practices" database.
* ❌ **A replacement for AI tools** — Polish works *with* your tools, not instead of them.

Polish is **middleware for thought**. It sits between your rough idea and the tool that executes it.

---

## Roadmap (Maybe)

Some ideas we're kicking around:

* **OpenCode wrapper** — interactive refinement loop
* **Timeout & caching** — faster repeat runs
* **Model selection** — let users pick their LLM
* **Multiline prompt handling** — better support for longer inputs
* **Optional cloud fallback** — if local fails, try remote (opt-in only)

No promises, but we're open to PRs if you want to help.

---

## License

MIT

Do whatever you want with this. Build on it, fork it, break it, fix it.

---

## One-line Summary

> **Polish quietly fixes your prompts — only when you ask it to.**

---

## Contributing

Found a bug? Have an idea? PRs and issues are welcome.

Just remember: **invisibility is a feature**. If your change makes Polish "chattier" or adds friction, we'll probably push back.

---

Built with ☕ by developers who are tired of prompt engineering.
