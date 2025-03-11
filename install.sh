# Install project dependencies
if [ -f "package.json" ]; then
    npm install
fi

# Print completion message
echo "Installation Finished."