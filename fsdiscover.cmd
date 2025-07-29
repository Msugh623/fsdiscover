@echo off
setlocal enabledelayedexpansion

REM Define application directory and version file path
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"
set "VERSION_FILE=%APP_DIR%\version"

REM Ensure version file exists
if not exist "%VERSION_FILE%" (
    echo Error: Version file not found at %VERSION_FILE%.
    exit /b 1
)

REM Read version
for /f "usebackq delims=" %%v in ("%VERSION_FILE%") do set "VERSION=%%v"

echo -----------------------------------------
echo.
echo        Sprint FS Discover %VERSION%
echo.
echo -----------------------------------------

REM Change to application directory
cd /d "%APP_DIR%" 2>nul
if errorlevel 1 (
    echo Failure: Unable to change to application directory %APP_DIR%.
    exit /b 1
)

REM Parse arguments
set "PARAM1=%~1"
set "PARAM2=%~2"

@REM if not "%PARAM2%"=="" (
@REM     echo Too many arguments... fsdiscover only accepts one argument. Use /help for details.
@REM     exit /b 1
@REM )

if /I "%PARAM1%"=="/uninstall" (
    call "%APP_DIR%\uninstall.cmd"
    exit /b %errorlevel%
)

if /I "%PARAM1%"=="/u" (
    call "%APP_DIR%\uninstall.cmd"
    exit /b %errorlevel%
)

if /I "%PARAM1%"=="/version" (
    echo %VERSION%
    exit /b 0
)

if /I "%PARAM1%"=="/logs" (
    cd "%APP_DIR%\logs"
    explorer ./
    exit /b 0
)

if /I "%PARAM1%"=="/l" (
    cd "%APP_DIR%\logs"
    explorer ./
    exit /b 0
)


if /I "%PARAM1%"=="/v" (
    echo %VERSION%
    exit /b 0
)

if /I "%PARAM1%"=="/p" (
    echo "Initiator: Prefered network interface set to: %PARAM2%"
    echo "Initiator: Prefered network interface will be ignored if not available"
    PARAMS="--prefer %PARAM2%"
)

if /I "%PARAM1%"=="/prefer" (
    echo "Initiator: Prefered network interface set to: %PARAM2%"
    echo "Initiator: Prefered network interface will be ignored if not available"
    set PARAMS="--prefer %PARAM2%"
)

if /I "%PARAM1%"=="/help" goto :show_help
if /I "%PARAM1%"=="/h" goto :show_help

REM If no known argument, assume default run

if exist ..\update\fsdiscover-main (
  echo "Initiator: Implementing Updates..."
  if exist ..\update\fsdiscover-main\package.json (
    cd ..\update\fsdiscover-main
    echo "Initiator: Installing Updates..."
    call install.cmd
    cd ..\..\
    rmdir /S /Q update\fsdiscover-main
    fsdiscover
    echo "Initiator: Updates Installed Succesfully... fsdiscover shall proceed"
  ) else (
    echo "Initiator: Updates not Implemented... failed to locate package.json in update directory... fsdiscover shall proceed"
    rmdir /S /Q ..\update
  )
) 

REM Check for node_modules before starting
if exist node_modules (
    node index.js
) else (
    echo Failure: node_modules not found.
    echo Run 'install.cmd' or 'npm install' to install dependencies.
    exit /b 1
)
exit /b 0

:show_help
echo Usage: fsdiscover [option]
echo.
echo   /l, /logs            See logs
echo   /p, /prefer          Supply a prefered network interface. e.g fsdiscover --prefer <interface_name>
echo                        This will be ignored if the interface is not available
echo   /u, /uninstall       Uninstall (remove) fsdiscover
echo   /v, /version         Show current version
echo   /h, /help            Display help message
echo.
echo For more information, contact: sprintetmail@gmail.com
exit /b 0
