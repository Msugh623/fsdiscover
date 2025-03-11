@echo off

REM Define application directory
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"

REM Change to application directory
cd /d "%APP_DIR%"
if errorlevel 1 (
    echo Failure: Unable to change to application directory %APP_DIR%
    exit /b 1
)

REM Check for node_modules and start the application
if exist node_modules (
    npm start
) else (
    echo Failure: node_modules not found... Run 'install.cmd' or 'npm install' on CLI to install dependencies
)