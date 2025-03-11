#!/bin/bash
# Install project dependencies
if [ -f "package.json" ]; then
    npm install
else
    echo "Failure: package.json not found... Failed to find project dependencies"
    exit 1
fi

# Define application directory
APP_DIR="$HOME/.local/share/fsdiscover"
mkdir -p "$APP_DIR"

# Copy project files to application directory
cp -r ./* "$APP_DIR"

# Ensure fsdiscover script is executable
chmod +x "$APP_DIR/fsdiscover.sh"

# Create .desktop file
DESKTOP_FILE="[Desktop Entry]
Name=FSDiscover
Comment=File System Discoverer
Exec=$APP_DIR/fsdiscover.sh
Icon=$APP_DIR/public/icon.png
Terminal=true
Type=Application
Categories=Utility;"

# Write the .desktop file to the appropriate directory
DESKTOP_DIR="$HOME/.local/share/applications"
mkdir -p "$DESKTOP_DIR"
echo "$DESKTOP_FILE" > "$DESKTOP_DIR/fsdiscover.desktop"

# Refresh the application list
update-desktop-database "$HOME/.local/share/applications"

# Create a symbolic link to make the application accessible from the CLI
sudo ln -sf "$APP_DIR/fsdiscover.sh" "/bin/fsdiscover"

# Print completion message
echo "Installation Finished."
echo ".desktop file created at $DESKTOP_DIR/fsdiscover.desktop"
echo "Symbolic link created at /bin/fsdiscover"
echo "You can now run the application using the command 'fsdiscover'"
