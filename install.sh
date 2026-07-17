#!/usr/bin/env bash

V=$(cat version 2>/dev/null || echo "dev")
PARAM="$1"

echo
echo "FSDiscover Installer v$V"
echo "============================================"
echo "Fsdiscover is a tool that allows you to access your filesystem and control your computer over your local HTTP network."
echo

IS_MACOS=false
[ "$(uname -s)" = "Darwin" ] && IS_MACOS=true

retry() {
    local max=$1
    local delay=$2
    shift 2
    local count=0
    while [ $count -lt "$max" ]; do
        if eval "$@"; then return 0; fi
        count=$((count + 1))
        if [ $count -lt "$max" ]; then
            echo "[WARNING] Attempt $count failed. Retrying..."
            sleep "$delay"
        fi
    done
    echo "[ERROR] Failed after $max attempts."
    return 1
}


if [ "$PARAM" = "--auto" ]; then
    echo "[INFO] Running in FULLY AUTOMATIC mode."
    AUTO_YES=true
else
    echo "Tip: Run with --auto to skip all prompts (ideal for VPS/servers)"
    echo
    read -r -p "Proceed with installation? (y/n) " ACCEPT
    if [ "$ACCEPT" != "y" ] && [ "$ACCEPT" != "Y" ]; then
        echo "[INFO] Aborted by user."
        exit 2
    fi
fi


echo
echo "[INFO] Checking Node.js and npm..."

if ! command -v npm >/dev/null 2>&1; then
    echo "[INFO] npm not found. Installing Node.js automatically..."
    
    [ ! -d "$HOME/.nvm" ] && retry 3 2 "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash"

    [ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
    [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"

    retry 3 3 "nvm install --lts" || retry 2 3 "nvm install 20"
    nvm use --lts 2>/dev/null || nvm use 20 2>/dev/null || true
fi

echo "[INFO] Node: $(node -v 2>/dev/null || echo '?') | npm: $(npm -v 2>/dev/null || echo '?')"


if [ ! -f "package.json" ]; then
    echo "[ERROR] package.json not found."
    exit 1
fi

echo
echo "[INFO] Downloading and Installing dependencies..."
retry 3 3 "npm install" > .npm_install.log 2>&1 || {
    echo "[ERROR] Failed to install dependencies."
    exit 1
}


APP_DIR="$HOME/.local/share/fsdiscover"
echo
echo "[INFO] Installing to $APP_DIR..."
mkdir -p "$APP_DIR/temp" "$APP_DIR/logs"

copy_files() {
    if command -v rsync >/dev/null 2>&1; then
        rsync -a --exclude='.git' --exclude='auth.config.json' \
                  --exclude='runtime.config.json' --exclude='fe' ./ "$APP_DIR/" && return 0
    fi
    tar --exclude='.git' --exclude='auth.config.json' --exclude='runtime.config.json' \
        -cf - . 2>/dev/null | tar -xf - -C "$APP_DIR" 2>/dev/null && return 0
    return 1
}

retry 3 2 copy_files || { echo "[ERROR] File copy failed."; exit 1; }

chmod +x "$APP_DIR/fsdiscover.sh" 2>/dev/null
chmod 700 "$APP_DIR/temp" 2>/dev/null || true

if $IS_MACOS; then
    echo "[INFO] Creating macOS .app bundle..."
    APP_BUNDLE="/Applications/FSDiscover.app"
    mkdir -p "$APP_BUNDLE/Contents/MacOS" "$APP_BUNDLE/Contents/Resources"

    cat > "$APP_BUNDLE/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key><string>FSDiscover</string>
    <key>CFBundleExecutable</key><string>fsdiscover</string>
</dict>
</plist>
EOF

    cat > "$APP_BUNDLE/Contents/MacOS/fsdiscover" << 'EOF'
#!/usr/bin/env bash
exec "$HOME/.local/share/fsdiscover/fsdiscover.sh" "$@"
EOF
    chmod +x "$APP_BUNDLE/Contents/MacOS/fsdiscover"
    [ -f "$APP_DIR/public/icon.png" ] && cp "$APP_DIR/public/icon.png" "$APP_BUNDLE/Contents/Resources/icon.png" 2>/dev/null
fi

echo "[INFO] Creating global command..."
TARGETS="/usr/local/bin/fsdiscover"
$IS_MACOS && TARGETS="$TARGETS /opt/homebrew/bin/fsdiscover"

for target in $TARGETS; do
    mkdir -p "$(dirname "$target")" 2>/dev/null
    ln -sf "$APP_DIR/fsdiscover.sh" "$target" 2>/dev/null && echo "[SUCCESS] $target" && continue
    sudo ln -sf "$APP_DIR/fsdiscover.sh" "$target" 2>/dev/null && echo "[SUCCESS] $target (sudo)" && continue
done

mkdir -p "$HOME/.local/bin"
ln -sf "$APP_DIR/fsdiscover.sh" "$HOME/.local/bin/fsdiscover" 2>/dev/null


echo
echo "[SUCCESS] Installation completed!"
echo
printf "\033[43m********************************\033[49m\n"
printf '\033[33mDefault password is "password" - change it immediately!\033[39m\n'
printf '\033[33mIf you alread changed it, it wont be overwritten\033[39m\n'
printf "\033[43m********************************\033[49m\n"
echo

if $IS_MACOS; then
    echo "macOS App: /Applications/FSDiscover.app"
fi
echo "You can now run: fsdiscover"
echo


[ "$PARAM" != "--auto" ] && read -r -p "Press Enter to finish..."