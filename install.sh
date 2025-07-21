#!/bin/bash
V=$(cat .version)
PARAM=${1:-null}

echo "-----------------------------------------"
echo ""
echo "   Sprint FS Discover Installer $V"
echo ""
echo "-----------------------------------------"
echo ""

echo "Fsdiscover is a tool that allows you to access your filesystem over local http network"


if [ $PARAM == "--auto" ]; then
    echo "Skipping permission because auto is supplied... automatic installer shall proceed"
else
    echo "Do you want to proceed installation (y/n)"
    echo "Use --auto to prevent this prompt"
    read -r ACCEPT
    if ! [ $ACCEPT == "y" ]; then
        echo "Exiting...Installer Aborted by User, $ACCEPT is not y"
        exit 2
    fi
fi

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
        echo "Please, Contact sprintetmail@gmail.com with the details of this error"
        exit 1
    fi
    cd ../
    rm -rf public/client
    echo ""
    echo "Copying build files..."
    mv fe/dist/ public/client
    echo "Build Succesfull"
else
    echo "Prepareing to install..."
    npm install
fi
if ! [ $? -eq 0 ]; then
   echo '!!! Installer Exited prematurely... Installer failed to install necessary dependencies'
   echo "Please, Contact sprintetmail@gmail.com with the details of this error "
   exit 1
fi

# echo ""
# echo "Generating SSL certificate... Please enter the details as prompted (Press ENTER to skip field)"
# if ! [ -d "cert" ]; then
#     echo "Creating cert directory..."
#     mkdir cert
# fi

# ./gencert.sh

if ! [ $? -eq 0 ]; then
    echo '!!! Installer Exited prematurely... Failed to generate SSL certificate'
    echo "Please, Contact sprintetmail@gmail.com with the details of this error"
fi

APP_DIR="$HOME/.local/share/fsdiscover"
mkdir -p "$APP_DIR"

head "$APP_DIR/auth.config.json" | grep "the ungrepable" ||   echo "{}" > auth.config.json
ls logs | grep "ungrepable" || mkdir logs

echo 'Copying files to application directory... This can take a while'
if [ $(rsync  --version > logs.log) ]; then
    rsync -av --exclude='fe' --exclude='.git' ./ "$APP_DIR"
else
    echo "rsync failed... falling back to cp (This should take a bit longer)"
    # cp -r ./ "$APP_DIR"
    tar --exclude=".git" -cf - ./ | tar -xf - -C "$APP_DIR"
fi

if ! [ $? -eq 0 ]; then
   echo ""
   echo "!!! Installer Exited prematurely...  Installer failed to copy neccesary files"
   echo "Please, Contact sprintetmail@gmail.com with the details of this error "
   exit 1
fi

chmod +x "$APP_DIR/fsdiscover.sh"

if ! [ -d "$APP_DIR/temp" ]; then 
    echo "Could not find temp dir... creating temp dir"
    mkdir -m 777 "$APP_DIR/temp"
fi

chmod 777 "$APP_DIR/temp" 

# .desktop ENTRY
DESKTOP_FILE="[Desktop Entry]
Name=FSDiscover
Comment=File System Discoverer
Exec=$APP_DIR/fsdiscover.sh
Icon=$APP_DIR/public/icon.png
Terminal=true
Type=Application
Categories=Utility;"

DESKTOP_DIR="$HOME/.local/share/applications"
mkdir -p "$DESKTOP_DIR"
echo "$DESKTOP_FILE" > "$DESKTOP_DIR/fsdiscover.desktop"

update-desktop-database "$HOME/.local/share/applications"

UNAME=$(id -u)

if [ $UNAME -eq 0 ]; then
    ln -sf "$APP_DIR/fsdiscover.sh" "/usr/bin/fsdiscover"
else
    echo "Installer needs root access to create Global executable"
    sudo ln -sf "$APP_DIR/fsdiscover.sh" "/usr/bin/fsdiscover" || ln -sf "$APP_DIR/fsdiscover.sh" "/usr/bin/fsdiscover"
fi

echo "Installation Finished."
echo '!>>> Default password is set to "password", please change it as soon as possible, if you already changed it then ignore this message, it will not be overwritten'
echo ".desktop file created at $DESKTOP_DIR/fsdiscover.desktop"
echo "Symbolic link created at /usr/bin/fsdiscover"
echo "You can now run the application using the command 'fsdiscover'"
echo 'Use "fsdiscover --help" for details'
