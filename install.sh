#!/bin/bash
echo "-----------------------------------------"
echo ""
echo "   Sprint FS Discover Installer 1.0.1 "
echo ""
echo "-----------------------------------------"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Do you want to install it? (y/n)"
    read -r INSTALL_NODE
    if [[ "$INSTALL_NODE" == "y" || "$INSTALL_NODE" == "Y" ]]; then
        echo 'Installing Node.js...'
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
        \. "$HOME/.nvm/nvm.sh"
        nvm install 23
        echo 'Node.js installed successfully.'
        echo 'Node.js version:'
        node -v 
        echo 'NVM version:'
        nvm current 
        echo 'NPM version:'
        npm -v
    else
        echo "Node.js is required to run this script. Exiting..."
        exit 1
    fi
fi

PARAM=${1:-null}

# Install project dependencies
if ! [ -f "package.json" ]; then
    echo "Failure: package.json not found... Failed to find project dependencies"
    exit 1
elif [ $PARAM == "--build" ]; then
    echo "Installing project dependencies..."
    npm install
    cd fe 
    echo "Building client..."
    npm run build
    if ! [ $? -eq 0 ]; then
        echo '!!! Installer Exited prematurely... Too many errors during build. Restart installer to try again'
        echo "Contact "
        exit 1
    fi
    cd ../
    rm -rf public/client
    echo ""
    echo "Copying build files..."
    mv fe/dist/ public/client
    echo "Build Succesfull"
else
    npm install
fi
if ! [ $? -eq 0 ]; then
   echo '!!! Installer Exited prematurely... Installer failed to install necessary dependencies'
   echo "Contact "
   exit 1
fi

# Define application directory
APP_DIR="$HOME/.local/share/fsdiscover"
mkdir -p "$APP_DIR"

# Copy project files to application directory
echo 'Copying files to application directory... This can take a while'
rsync -av --exclude='fe' --exclude='.git' ./ "$APP_DIR"

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
echo 'Use "fsdiscover --help" for details'
