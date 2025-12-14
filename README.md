# Migrate IDE Extensions

A simple Node.js utility to migrate your VS Code extensions to other IDEs like Cursor or Antigravity.

## Installation

### Global Installation (Recommended)

Install globally to use the command anywhere:

```bash
npm install -g migrate-ide-extensions
```

### One-time Use with npx

Run without installing:

```bash
npx migrate-ide-extensions
```

## Usage

### Interactive Mode

Simply run the command without arguments and you'll be prompted to select your target IDE:

```bash
migrate-ide-extensions
```

You'll see:

```
Select migration target:
  1) Cursor
  2) Antigravity

Enter your choice (1 or 2):
```

### Command Line Arguments

Specify the target IDE directly using flags for automated scripts:

```bash
# Migrate to Cursor
migrate-ide-extensions --cursor

# Migrate to Antigravity
migrate-ide-extensions --antigravity
```

## Features

- ✨ **Interactive Mode**: User-friendly prompts for selecting the target IDE
- 🔍 **Automatic Detection**: Locates your VS Code extensions folder across different platforms
- 🚀 **Smart Copy**: Skips extensions that already exist in the target directory
- 💻 **Cross-Platform**: Supports macOS, Linux, and Windows
- 📦 **Zero Dependencies**: Uses only Node.js built-in modules

## Supported Platforms

- **macOS**: Checks multiple VS Code installation locations
- **Linux**: Supports standard VS Code and Insiders editions
- **Windows**: Works with default VS Code installation paths

## How It Works

1. Scans your VS Code extensions directory
2. Identifies which extensions are not yet in the target IDE
3. Shows you a summary and asks for confirmation
4. Copies only the missing extensions to save time

## Requirements

- Node.js 14.0.0 or higher

## Example Output

```
Source: /Users/pablo/.vscode/extensions
Target: /Users/pablo/.cursor/extensions (cursor)

Found 42 extensions
→ 15 will be copied
→ 27 already exist

  + dbaeumer.vscode-eslint
  + esbenp.prettier-vscode
  + github.copilot
  ...

Proceed? (y/N): y

→ Copying dbaeumer.vscode-eslint
→ Copying esbenp.prettier-vscode
→ Copying github.copilot
...

✅ Done!
```

## Legacy Shell Script

If you prefer using a shell script, check out the [legacy version](https://github.com/pablo-aviles-prieto/migrate-ide-extensions/blob/main/legacy/copy-extensions.sh) in the repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Pablo Avilés Prieto

## Repository

[https://github.com/pablo-aviles-prieto/migrate-ide-extensions](https://github.com/pablo-aviles-prieto/migrate-ide-extensions)
