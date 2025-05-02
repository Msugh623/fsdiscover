#!/bin/bash
echo "-----------------------------------------"
echo ""
echo "       Sprint FS Discover 1.0.1"
echo ""
echo "-----------------------------------------"

# Define application directory
APP_DIR="$HOME/.local/share/fsdiscover"

# Change to application directory
cd "$APP_DIR" || {
  echo "Failure: Unable to change to application directory $APP_DIR"
  exit 1
}

PARAM1=${1:-nil}
PARAM2=${2:-nil}

if ! [ $PARAM2 == "nil" ]; then
    echo "Too many arguments... fsdiscover must take only 1 argument. Use --help for details"
    exit 1
elif [ $PARAM1 == "--uninstall" ] || [ $PARAM1 == "-u" ]; then
    ./uninstall.sh
elif [ $PARAM1 == "--help" ] || [ $PARAM1 == "-h" ]; then
    echo "Usage: fsdiscover [option...]"
    echo ""
    echo "-u, --uninstall       Uninstall (remove) fsdiscover"
    echo "-h, --help            See Help"
    echo ""
    echo "This program only takes one argument at a time"
    echo "For more information, contact sprintetmail@gmail.com"
    exit 0
fi

# Check for node_modules and start the application
if [ -d node_modules ]; then
  node index.js
else
  echo "Failure: node_modules not found... Run 'install.sh' or 'npm install' on CLI to install dependencies"
fi

