if [ -d node_modules ]; then
  npm start
else
  echo "Faliure: node_modules not found... Run 'install.sh' or 'npm install' on CLI to install dependencies"
fi

