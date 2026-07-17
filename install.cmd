@echo off
setlocal enabledelayedexpansion
title FSdiscover Setup

cls
echo.
echo   FSdiscover Setup
echo   ----------------------------------------
echo   Share files and control devices over your
echo   local network - no cloud, no accounts.
echo   This will only take a minute or two.
echo.

REM ===========================================================
REM  Make sure we're in the right folder
REM ===========================================================
echo   Checking your files...
if not exist package.json (
    call :fail "Couldn't find FSdiscover's files here." "Make sure you're running this from inside the FSdiscover folder you downloaded, then try again."
    exit /b 1
)
echo   Looks good!

REM ===========================================================
REM  Node.js
REM ===========================================================
echo.
echo   Checking for Node.js, which FSdiscover needs to run...
set "NODE_CMD="
where node >nul 2>&1
if !errorlevel! equ 0 (
    set "NODE_CMD=node"
) else if exist "%PROGRAMFILES%\nodejs\node.exe" (
    set "NODE_CMD=%PROGRAMFILES%\nodejs\node.exe"
)

if not defined NODE_CMD (
    echo   Don't have it yet - downloading it now, this needs internet...
    curl --progress-bar -L -o "%TEMP%\node-setup.msi" "https://nodejs.org/dist/v22.17.1/node-v22.17.1-x64.msi"
    if !errorlevel! neq 0 (
        call :fail "Couldn't download Node.js." "Check your internet connection, or install it yourself from nodejs.org and run this installer again."
        exit /b 1
    )
    echo   Installing it, please wait...
    msiexec /i "%TEMP%\node-setup.msi" /quiet /norestart
    if !errorlevel! neq 0 (
        call :fail "Node.js installation didn't finish properly." "Try installing it manually from nodejs.org, then run this installer again."
        exit /b 1
    )
    del "%TEMP%\node-setup.msi" >nul 2>&1

    where node >nul 2>&1
    if !errorlevel! equ 0 (
        set "NODE_CMD=node"
    ) else if exist "%PROGRAMFILES%\nodejs\node.exe" (
        set "NODE_CMD=%PROGRAMFILES%\nodejs\node.exe"
    ) else (
        call :fail "Node.js still isn't showing up after installing it." "Try closing this window and running the installer again - Windows sometimes needs a fresh start to notice new programs."
        exit /b 1
    )
)
echo   All set!

REM ===========================================================
REM  npm install
REM ===========================================================
echo.
echo   Installing FSdiscover - this can take a minute or two...
if not exist logs mkdir logs
call npm install > logs\npm_install.log 2>&1
if !errorlevel! neq 0 (
    if exist "%PROGRAMFILES%\nodejs\npm.cmd" (
        call "%PROGRAMFILES%\nodejs\npm.cmd" install > logs\npm_install.log 2>&1
    )
)
if !errorlevel! neq 0 (
    call :fail "That didn't finish successfully." "Check your internet connection and try again. If it keeps happening, the file logs\npm_install.log has the details."
    exit /b 1
)
echo   Done!

REM ===========================================================
REM  Copy files to the install directory
REM ===========================================================
echo.
echo   Setting up your FSdiscover folder...
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"
if /I "%CD%"=="%APP_DIR%" (
    call :fail "This installer is running from inside its own install folder." "Move it somewhere else (like your Downloads folder) and run it again."
    exit /b 1
)
if not exist "%APP_DIR%" mkdir "%APP_DIR%" 2>nul
if not exist "%APP_DIR%" (
    call :fail "couldn't create a folder to install into." "Check that you have permission to write to your AppData folder, then try again."
    exit /b 1
)

robocopy . "%APP_DIR%" /E /XD .git /XF auth.config.json runtime.config.json /NFL /NDL /NJH /NJS /NC /NS /NP >nul
if !errorlevel! geq 8 (
    call :fail "Ran into a problem copying files." "Close any programs that might be using files in that folder, then try again."
    exit /b 1
)
if not exist "%APP_DIR%\temp" mkdir "%APP_DIR%\temp"
echo   Done!

REM ===========================================================
REM  Shortcuts (Start Menu + CLI command)
REM ===========================================================
echo.
echo   Creating shortcuts on Desktop and in Start Menu...
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\FsDiscover"
set "TARGET_PATH=%APP_DIR%\fsdiscover.cmd"
set "ICON_PATH=%APP_DIR%\public\icon.ICO"
if not exist "%SHORTCUT_PATH%" mkdir "%SHORTCUT_PATH%" >nul 2>&1
"!NODE_CMD!" utils\makeico.js "%TARGET_PATH%" "%SHORTCUT_PATH%" "%ICON_PATH%" >nul 2>&1
if not exist "%SHORTCUT_PATH%" (
    echo   Couldn't create a Start Menu shortcut, but that's okay -
    echo   you can still open FSdiscover from a terminal.
)

set "BIN_DIR=%USERPROFILE%\bin"
if not exist "%BIN_DIR%" mkdir "%BIN_DIR%" 2>nul
if not exist "%BIN_DIR%" (
    call :fail "Couldn't set up the fsdiscover command." "Check that you have permission to write to your user folder, then try again."
    exit /b 1
)
if exist "%BIN_DIR%\fsdiscover.cmd" del "%BIN_DIR%\fsdiscover.cmd" >nul 2>&1
copy /Y "%APP_DIR%\fsdiscover.cmd" "%BIN_DIR%\fsdiscover.cmd" >nul
if !errorlevel! neq 0 (
    call :fail "Couldn't finish setting up the fsdiscover command." "Try running this installer again."
    exit /b 1
)

echo %PATH% | find /I "%BIN_DIR%" >nul
if !errorlevel! neq 0 (
    setx PATH "%PATH%;%BIN_DIR%" >nul
)
echo   Done!

echo.
echo   ========================================
echo     All set! FSdiscover is ready to go.
echo   ========================================
echo.
echo   Open it from the Start Menu, or open a new
echo   terminal window and type:  fsdiscover
echo   Need help? Type:  fsdiscover --help
echo.
echo   First time logging in:
echo     Password: password   (change this soon!)
echo     Email: anything works, it isn't checked
echo.
pause
exit /b 0

REM ===========================================================
:fail
echo.
echo   Hmm, something didn't work: %~1
echo   Try this: %~2
echo.
pause
goto :eof