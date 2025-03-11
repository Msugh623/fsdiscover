@echo off
if exist node_modules (
    npm start
) else (
    echo Failure: node_modules not found... Run 'npm install' to install dependencies
)
