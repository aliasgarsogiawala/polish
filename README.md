# polish

Invisible prompt refinement for CLI workflows.

Add `polish` to the end of your prompt. Get a better version back. That's it.

## Install

```bash
git clone https://github.com/aliasgarsogiawala/polish.git
cd polish
npm install
npm run build
npm link
```

## Usage

```bash
polish "add jwt auth polish"
```

Without the keyword:
```bash
polish "add jwt auth"  # passes through unchanged
```

With pipes:
```bash
echo "fix login bug polish" | polish | opencode
```

## How it works

`polish` must be the **last word**. Otherwise, input passes through.

| Input                 | Behavior  |
| --------------------- | --------- |
| `add jwt auth polish` | ✅ refined |
| `polish add jwt auth` | ❌ ignored |
| `add polish jwt auth` | ❌ ignored |

## Requirements

- **Node.js ≥ 18**
- **Ollama** running locally

Install Ollama:
```bash
# Download from https://ollama.com/download
ollama pull llama3
ollama list  # verify
```

Polish talks to `http://localhost:11434/api/generate`.

## Failure behavior

If anything fails (Ollama down, network error, etc), Polish returns your original input. No crashes.

## Why no flags/config?

Flags add friction. Keywords are explicit.

## Windows

Works fine. Just make sure:
- Node ≥ 18
- Ran `npm link`
- Restarted terminal

Check with `where polish`.

## Dev mode

```bash
npm run dev -- "your prompt polish"
```

## License

MIT
