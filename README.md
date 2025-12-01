# Migrate IDE Extensions

A simple utility script to migrate your VS Code extensions to other IDEs like Cursor or Antigravity.

## Usage

You can run the script directly. It supports both interactive mode and command-line arguments.

### Prerequisites

Ensure you have `zsh` installed, as the script is designed to run in a zsh environment.

### Interactive Mode

Simply run the script without arguments:

```bash
./copy-extensions.sh
```

You will be prompted to select the target IDE.

### Command Line Arguments

You can specify the target IDE directly using flags:

```bash
# Migrate to Cursor
./copy-extensions.sh --cursor

# Migrate to Antigravity
./copy-extensions.sh --antigravity

# Show help
./copy-extensions.sh --help
```

## Features

- **Automatic Detection**: Locates your VS Code extensions folder.
- **Smart Copy**: Skips extensions that already exist in the target directory to save time.
- **Configuration**: Optionally copies `extensions.json` if found.

## TODO

- [ ] Upload this script as an npm package so it can be executed via `npx` without downloading the file manually.
