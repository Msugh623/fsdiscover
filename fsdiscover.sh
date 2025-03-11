if [ -d node_modules ]; then
  npm start
else
  echo "Faliure: node_modules not found... Run 'npm install' to install dependencies"
fi