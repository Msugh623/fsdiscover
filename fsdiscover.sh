#!/bin/bash
echo "-----------------------------------------"
echo ""
echo "       Sprint FS Discover 1.0.0"
echo ""
echo "-----------------------------------------"

# Define application directory
APP_DIR="$HOME/.local/share/fsdiscover"

# Change to application directory
cd "$APP_DIR" || {
  echo "Failure: Unable to change to application directory $APP_DIR"
  exit 1
}

# Check for node_modules and start the application
if [ -d node_modules ]; then
  node index.js
else
  echo "Failure: node_modules not found... Run 'install.sh' or 'npm install' on CLI to install dependencies"
fi
