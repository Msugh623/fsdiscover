@echo off

REM Read version from the version file
set "VERSION_FILE=%LOCALAPPDATA%\fsdiscover\version"
for /f "delims=" %%v in (%VERSION_FILE%) do set "VERSION=%%v"

echo -----------------------------------------
echo.
echo        Sprint FS Discover %VERSION%
echo.
echo -----------------------------------------

REM Define application directory
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"

REM Change to application directory
cd /d "%APP_DIR%"
if errorlevel 1 (
    echo Failure: Unable to change to application directory %APP_DIR%
    exit /b 1
)

REM Handle arguments
set "PARAM1=%~1"
set "PARAM2=%~2"

if not "%PARAM2%"=="" (
    echo Too many arguments... fsdiscover must take only 1 argument. Use --help for details.
    exit /b 1
)

if /I "%PARAM1%"=="--uninstall" (
    call "%APP_DIR%\uninstall.cmd"
    exit /b %errorlevel%
) else if /I "%PARAM1%"=="-u" (
    call "%APP_DIR%\uninstall.cmd"
    exit /b %errorlevel%
) else if /I "%PARAM1%"=="--version" (
    exit /b 0
) else if /I "%PARAM1%"=="-v" (
    exit /b 0
) else if /I "%PARAM1%"=="--help" (
    echo Usage: fsdiscover [option...]
    echo.
    echo -u, --uninstall       Uninstall (remove) fsdiscover
    echo -v, --version         See current version
    echo -h, --help            See Help
    echo.
    echo This program only takes one argument at a time.
    echo For more information, contact sprintetmail@gmail.com
    exit /b 0
) else if /I "%PARAM1%"=="-h" (
    echo Usage: fsdiscover [option...]
    echo.
    echo -u, --uninstall       Uninstall (remove) fsdiscover
    echo -v, --version         See current version
    echo -h, --help            See Help
    echo.
    echo This program only takes one argument at a time.
    echo For more information, contact sprintetmail@gmail.com
    exit /b 0
)

REM Check for node_modules and start the application
if exist node_modules (
    node index.js
) else (
    echo Failure: node_modules not found... Run 'install.cmd' or 'npm install' on CLI to install dependencies.
    exit /b 1
)