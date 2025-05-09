#!/bin/bash
V=$(cat ./version)
echo "-----------------------------------------"
echo ""
echo "   Sprint FS Discover Uninstaller $V"
echo ""
echo "-----------------------------------------"
echo ""

echo "Do you wish to Completely remove Fsdiscover from your system? (y/n)"
read -r OPT

if [ $OPT == 'y' ]; then
    echo "Preparing To remove..."
else
    echo "Uninstaller Terminated by user"
    exit 2
fi

APP_DIR="$HOME/.local/share/fsdiscover"
DESKTOP_DIR="$HOME/.local/share/applications/fsdiscover.desktop"
BIN_DIR="/usr/bin/fsdiscover"
UNAME=$(id -u)

if [ $UNAME -eq 0 ]; then
    rm -r $APP_DIR
    rm $DESKTOP_DIR
    rm $BIN_DIR
else
    echo "Uninstaller Needs Root access to remove files"
    sudo rm -r $APP_DIR
    sudo rm $DESKTOP_DIR
    sudo rm $BIN_DIR
fi

if [ $? -eq 0 ]; then
    echo "Uninstaller Succeeded... Goodbye"
    update-desktop-database "$HOME/.local/share/applications"
else
    echo "Something didn't go according to plan"
fi
