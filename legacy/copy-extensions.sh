#!/usr/bin/env zsh

# Function to show usage
show_help() {
  echo "Usage: ./copy-exts.sh [OPTION]"
  echo "Copy VS Code extensions to another IDE."
  echo ""
  echo "Options:"
  echo "  --cursor       Copy extensions to ~/.cursor/extensions"
  echo "  --antigravity  Copy extensions to ~/.antigravity/extensions"
  echo "  --help         Show this help message"
}

# Check if an argument was provided; if not, ask the user interactively
if [ $# -eq 0 ]; then
  echo "No target specified. Please choose one:"
  select opt in "Cursor" "Antigravity" "Quit"; do
    case $opt in
      "Cursor") set -- "--cursor"; break ;;
      "Antigravity") set -- "--antigravity"; break ;;
      "Quit") exit 0 ;;
      *) echo "Invalid option $REPLY";;
    esac
  done
fi

# Determine the target directory based on the flag
TARGET_DIR=""

case "$1" in
  --cursor)
    TARGET_DIR="$HOME/.cursor/extensions"
    echo "🎯 Target set to: CURSOR"
    ;;
  --antigravity)
    TARGET_DIR="$HOME/.antigravity/extensions"
    echo "🎯 Target set to: ANTIGRAVITY"
    ;;
  --help)
    show_help
    exit 0
    ;;
  *)
    echo "Error: Invalid option '$1'"
    show_help
    exit 1
    ;;
esac

# Create the target directory if it doesn't exist
if [ ! -d "$TARGET_DIR" ]; then
  echo "Creating directory: $TARGET_DIR"
  mkdir -p "$TARGET_DIR"
fi

# Source directory (VS Code)
OS="$(uname -s)"

case "$OS" in
  Darwin)
    SOURCE_DIR="$HOME/Library/Application Support/Code/extensions"
    ;;
  Linux)
    SOURCE_DIR="$HOME/.vscode/extensions"
    ;;
  *)
    echo "Unsupported OS: $OS"
    exit 1
    ;;
esac

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: VS Code extensions folder not found at $SOURCE_DIR"
  exit 1
fi

# --- Handle extensions.json ---
JSON_FILE="$SOURCE_DIR/extensions.json"

if [ -f "$JSON_FILE" ]; then
  echo ""
  echo "Found extensions.json in VS Code folder."
  echo -n "❓ Do you want to overwrite extensions.json in the target folder? (y/N): "
  read -r response
  
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "  -> Copying extensions.json..."
    cp "$JSON_FILE" "$TARGET_DIR/"
  else
    echo "  -> Skipping extensions.json."
  fi
  echo ""
else
  # Optional: Let you know it wasn't found, just in case
  echo "No extensions.json found in source, skipping configuration copy."
fi
# -----------------------------------

# The Copy Loop
echo "🚀 Starting extension copy from VS Code to $TARGET_DIR..."

for ext in "$SOURCE_DIR"/*; do
  # Check if directory actually contains files (handles empty globs)
  [ -e "$ext" ] || continue
  
  # Skip extensions.json here so we don't try to copy it again as a folder
  if [[ "$ext" == *".json" ]]; then
    continue
  fi

  name=$(basename "$ext")
  
  if [ ! -d "$TARGET_DIR/$name" ]; then
    echo "  -> Copying $name"
    cp -r "$ext" "$TARGET_DIR/"
  else
    echo "  -> Skipping $name (already exists)"
  fi
done

echo "✅ Done!"