@echo off
if exist node_modules (
    npm start
) else (
    echo Failure: node_modules not found... Run 'install.cmd' or 'npm install' on CLI to install dependencies
)
