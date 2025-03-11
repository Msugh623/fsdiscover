# Install project dependencies
if [ -f "package.json" ]; then
    npm install
else
    echo "Faliure: package.json not found... Failed to find project dependencies"
fi

# Print completion message
echo "Installation Finished."