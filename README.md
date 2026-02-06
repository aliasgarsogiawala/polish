# idkbro

Invisible prompt refinement for CLI workflows.

Add `idkbro` to the end of your prompt. Get a better version back. That's it.

## Install

```bash
git clone https://github.com/aliasgarsogiawala/idkbro.git
cd idkbro
npm install
npm run build
npm link
```

## Usage

```bash
idkbro "add jwt auth idkbro"
```

Without the keyword:
```bash
idkbro "add jwt auth"  # passes through unchanged
```

With pipes:
```bash
echo "fix login bug idkbro" | idkbro | opencode
```

## How it works

`idkbro` must be the **last word**. Otherwise, input passes through.

| Input                 | Behavior  |
| --------------------- | --------- |
| `add jwt auth idkbro` | ✅ refined |
| `idkbro add jwt auth` | ❌ ignored |
| `add idkbro jwt auth` | ❌ ignored |

## Requirements

- **Node.js ≥ 18**
- **Ollama** running locally

Install Ollama:
```bash
# Download from https://ollama.com/download
ollama pull llama3
ollama list  # verify
```

idkbro talks to `http://localhost:11434/api/generate`.

## Failure behavior

If anything fails (Ollama down, network error, etc), idkbro returns your original input. No crashes.

## Why no flags/config?

Flags add friction. Keywords are explicit.

## Windows

Works fine. Just make sure:
- Node ≥ 18
- Ran `npm link`
- Restarted terminal

Check with `where idkbro`.

## Dev mode

```bash
npm run dev -- "your prompt idkbro"
```

## License

MIT
