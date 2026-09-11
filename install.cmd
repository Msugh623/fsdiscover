@echo off
setlocal enabledelayedexpansion
title FSdiscover Setup
pushd "%~dp0" >nul 2>&1
if errorlevel 1 (
    call :fail "Could not access the installer directory." "Run the installer from a local, writable folder."
    goto :finish_fail
)

cls
echo.
echo   FSdiscover Setup
echo   ----------------------------------------
echo   Share files and control devices over your
echo   local network - no cloud, no accounts.
echo   This will only take a minute or two.
echo.

echo   Checking your files...
if not exist package.json (
    call :fail "Couldn't find FSdiscover's files here." "Make sure you're running this from inside the FSdiscover folder you downloaded, then try again."
    goto :finish_fail
)
echo   Looks good!

echo.
echo   Checking for Node.js, which FSdiscover needs to run...
set "NODE_CMD="
set "NPM_CMD="
set "NODE_VERSION=22.17.1"
set "NODE_ARCH=x64"
if /I "%PROCESSOR_ARCHITECTURE%"=="ARM64" set "NODE_ARCH=arm64"
if /I "%PROCESSOR_ARCHITEW6432%"=="ARM64" set "NODE_ARCH=arm64"
call :find_runtime
if not defined NODE_CMD call :install_runtime
if not defined NODE_CMD (
    call :fail "Node.js could not be prepared." "The installer tried PATH, standard folders, MSI installation, PowerShell download, curl, and a portable Node fallback. Check logs or install Node.js LTS manually."
    goto :finish_fail
)
echo   All set!

echo.
echo   Setting up your FSdiscover folder...
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"
if /I "%CD%"=="%APP_DIR%" (
    call :fail "This installer is running from inside its own install folder." "Move it somewhere else (like your Downloads folder) and run it again."
    goto :finish_fail
)
if not exist "%APP_DIR%" mkdir "%APP_DIR%" 2>nul
if not exist "%APP_DIR%" (
    call :fail "Couldn't create a folder to install into." "Check that you have permission to write to your AppData folder, then try again."
    goto :finish_fail
)

robocopy . "%APP_DIR%" /E /XD .git logs node_modules fe\node_modules /XF auth.config.json runtime.config.json pem.config.json neighborhood.config.json /NFL /NDL /NJH /NJS /NC /NS /NP >nul
if !errorlevel! geq 8 (
    call :fail "Ran into a problem copying files." "Close any programs that might be using files in that folder, then try again."
    goto :finish_fail
)
if not exist "%APP_DIR%\temp" mkdir "%APP_DIR%\temp"
if not exist "%APP_DIR%\logs" mkdir "%APP_DIR%\logs"
echo   Files copied.

echo.
echo   Installing FSdiscover dependencies - this can take a minute or two...
pushd "%APP_DIR%" >nul 2>&1
call :install_dependencies
set "NPM_STATUS=!errorlevel!"
popd >nul 2>&1
if not "!NPM_STATUS!"=="0" (
    call :fail "Dependencies could not be installed." "Check your internet connection and logs\npm_install.log for details."
    goto :finish_fail
)
echo   Done!

echo.
echo   Creating shortcuts on Desktop and in Start Menu...
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\FsDiscover"
set "TARGET_PATH=%APP_DIR%\fsdiscover.cmd"
set "ICON_PATH=%APP_DIR%\public\client\icon.png"
if not exist "%SHORTCUT_PATH%" mkdir "%SHORTCUT_PATH%" >nul 2>&1
if exist "%APP_DIR%\utils\makeico.js" (
    pushd "%APP_DIR%" >nul 2>&1
    "!NODE_CMD!" utils\makeico.js "%TARGET_PATH%" "%SHORTCUT_PATH%" "%ICON_PATH%" > "%APP_DIR%\logs\shortcut.log" 2>&1
    set "SHORTCUT_STATUS=!errorlevel!"
    popd >nul 2>&1
    if not "!SHORTCUT_STATUS!"=="0" echo   Warning: Start Menu shortcut could not be created. See "%APP_DIR%\logs\shortcut.log".
) else (
    echo   Warning: Shortcut helper is missing; continuing without shortcuts.
)

set "BIN_DIR=%USERPROFILE%\bin"
if not exist "%BIN_DIR%" mkdir "%BIN_DIR%" 2>nul
if not exist "%BIN_DIR%" (
    call :fail "Couldn't set up the fsdiscover command." "Check that you have permission to write to your user folder, then try again."
    goto :finish_fail
)
if exist "%BIN_DIR%\fsdiscover.cmd" del "%BIN_DIR%\fsdiscover.cmd" >nul 2>&1
copy /Y "%APP_DIR%\fsdiscover.cmd" "%BIN_DIR%\fsdiscover.cmd" >nul
if !errorlevel! neq 0 (
    call :fail "Couldn't finish setting up the fsdiscover command." "Try running this installer again."
    goto :finish_fail
)

for /f "tokens=2*" %%A in ('reg query HKCU\Environment /v Path 2^>nul') do set "USER_PATH=%%B"
echo "!USER_PATH!" | find /I "%BIN_DIR%" >nul
if !errorlevel! neq 0 (
    if defined USER_PATH (
        reg add HKCU\Environment /v Path /t REG_EXPAND_SZ /d "!USER_PATH!;%BIN_DIR%" /f >nul
    ) else (
        reg add HKCU\Environment /v Path /t REG_EXPAND_SZ /d "%BIN_DIR%" /f >nul
    )
    if !errorlevel! neq 0 echo   Warning: Could not update your user PATH. Run "%BIN_DIR%\fsdiscover.cmd" directly or add "%BIN_DIR%" to PATH manually.
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
goto :finish_ok

REM ===========================================================
:find_runtime
set "FOUND_NODE="
set "FOUND_NPM="
where node.exe >nul 2>&1
if !errorlevel! equ 0 set "FOUND_NODE=node.exe"
if not defined FOUND_NODE if exist "%ProgramFiles%\nodejs\node.exe" set "FOUND_NODE=%ProgramFiles%\nodejs\node.exe"
if not defined FOUND_NODE if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "FOUND_NODE=%ProgramFiles(x86)%\nodejs\node.exe"
if not defined FOUND_NODE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "FOUND_NODE=%LOCALAPPDATA%\Programs\nodejs\node.exe"
where npm.cmd >nul 2>&1
if !errorlevel! equ 0 set "FOUND_NPM=npm.cmd"
if not defined FOUND_NPM if exist "%ProgramFiles%\nodejs\npm.cmd" set "FOUND_NPM=%ProgramFiles%\nodejs\npm.cmd"
if not defined FOUND_NPM if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" set "FOUND_NPM=%ProgramFiles(x86)%\nodejs\npm.cmd"
if not defined FOUND_NPM if exist "%LOCALAPPDATA%\Programs\nodejs\npm.cmd" set "FOUND_NPM=%LOCALAPPDATA%\Programs\nodejs\npm.cmd"
if defined FOUND_NODE if defined FOUND_NPM (
    set "NODE_CMD=!FOUND_NODE!"
    set "NPM_CMD=!FOUND_NPM!"
)
exit /b 0

:install_runtime
echo   Node.js was not found. Trying a per-user portable runtime first...
set "NODE_ROOT=%LOCALAPPDATA%\fsdiscover-runtime\node-v!NODE_VERSION!-win-!NODE_ARCH!"
set "NODE_ZIP=%TEMP%\fsdiscover-node-!NODE_VERSION!-!NODE_ARCH!.zip"
call :download_file "https://nodejs.org/dist/!NODE_VERSION!/node-v!NODE_VERSION!-win-!NODE_ARCH!.zip" "!NODE_ZIP!"
if !errorlevel! equ 0 (
    if exist "!NODE_ROOT!" rmdir /s /q "!NODE_ROOT!" >nul 2>&1
    mkdir "!NODE_ROOT!" >nul 2>&1
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; Expand-Archive -LiteralPath '!NODE_ZIP!' -DestinationPath '%LOCALAPPDATA%\fsdiscover-runtime' -Force" >nul 2>&1
    if not exist "!NODE_ROOT!\node.exe" tar.exe -xf "!NODE_ZIP!" -C "%LOCALAPPDATA%\fsdiscover-runtime" >nul 2>&1
    del /q "!NODE_ZIP!" >nul 2>&1
)
if exist "!NODE_ROOT!\node.exe" if exist "!NODE_ROOT!\npm.cmd" (
    set "NODE_CMD=!NODE_ROOT!\node.exe"
    set "NPM_CMD=!NODE_ROOT!\npm.cmd"
    exit /b 0
)

echo   Portable Node was unavailable. Trying the Windows installer fallback...
set "NODE_MSI=%TEMP%\fsdiscover-node-!NODE_VERSION!-!NODE_ARCH!.msi"
call :download_file "https://nodejs.org/dist/!NODE_VERSION!/node-v!NODE_VERSION!-!NODE_ARCH!.msi" "!NODE_MSI!"
if !errorlevel! equ 0 (
    msiexec.exe /i "!NODE_MSI!" /qn /norestart
    call :find_runtime
)
del /q "!NODE_MSI!" >nul 2>&1
if defined NODE_CMD exit /b 0
exit /b 1

:download_file
set "DOWNLOAD_URL=%~1"
set "DOWNLOAD_FILE=%~2"
del /q "!DOWNLOAD_FILE!" >nul 2>&1
curl.exe --fail --location --retry 3 --retry-delay 2 --output "!DOWNLOAD_FILE!" "!DOWNLOAD_URL!" >nul 2>&1
if !errorlevel! equ 0 if exist "!DOWNLOAD_FILE!" exit /b 0
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest -UseBasicParsing -Uri '!DOWNLOAD_URL!' -OutFile '!DOWNLOAD_FILE!'" >nul 2>&1
if !errorlevel! equ 0 if exist "!DOWNLOAD_FILE!" exit /b 0
if exist "%SystemRoot%\System32\bitsadmin.exe" bitsadmin.exe /transfer fsdiscoverDownload /download /priority normal "!DOWNLOAD_URL!" "!DOWNLOAD_FILE!" >nul 2>&1
if !errorlevel! equ 0 if exist "!DOWNLOAD_FILE!" exit /b 0
exit /b 1

:install_dependencies
set "NPM_LOG=logs\npm_install.log"
del /q "!NPM_LOG!" >nul 2>&1
for /l %%T in (1,1,3) do (
    call "%NPM_CMD%" install --no-audit --no-fund --fetch-retries=5 --fetch-timeout=120000 >> "!NPM_LOG!" 2>&1
    if !errorlevel! equ 0 call "%NODE_CMD%" -e "require('express');require('socket.io')" >> "!NPM_LOG!" 2>&1
    if !errorlevel! equ 0 exit /b 0
    if %%T lss 3 timeout /t 3 /nobreak >nul
)
call "%NPM_CMD%" install --registry=https://registry.npmjs.org/ --legacy-peer-deps --no-audit --no-fund >> "!NPM_LOG!" 2>&1
if !errorlevel! equ 0 call "%NODE_CMD%" -e "require('express');require('socket.io')" >> "!NPM_LOG!" 2>&1
if !errorlevel! equ 0 exit /b 0
call "%NPM_CMD%" cache verify >> "!NPM_LOG!" 2>&1
call "%NPM_CMD%" install --prefer-offline --legacy-peer-deps --no-audit --no-fund >> "!NPM_LOG!" 2>&1
if !errorlevel! equ 0 call "%NODE_CMD%" -e "require('express');require('socket.io')" >> "!NPM_LOG!" 2>&1
if !errorlevel! equ 0 exit /b 0
call "%NPM_CMD%" cache clean --force >> "!NPM_LOG!" 2>&1
call "%NPM_CMD%" install --force --legacy-peer-deps --no-audit --no-fund >> "!NPM_LOG!" 2>&1
if !errorlevel! equ 0 call "%NODE_CMD%" -e "require('express');require('socket.io')" >> "!NPM_LOG!" 2>&1
if !errorlevel! equ 0 exit /b 0
echo   Warning: npm is retrying without lifecycle scripts; native optional features may need repair later.
call "%NPM_CMD%" install --ignore-scripts --legacy-peer-deps --no-audit --no-fund >> "!NPM_LOG!" 2>&1
if !errorlevel! equ 0 call "%NODE_CMD%" -e "require('express');require('socket.io')" >> "!NPM_LOG!" 2>&1
if !errorlevel! equ 0 exit /b 0
exit /b 1

:fail
set "FS_INSTALL_TITLE=FSdiscover installation failed"
set "FS_INSTALL_MESSAGE=%~1 - %~2"
echo.
echo   Hmm, something didn't work.
echo   I couldn't prepare FSdiscover.
echo.
if "%~1"=="" (
    echo   Reason: Unknown error occurred.
) else (
    echo   Reason: %~1
)
if "%~2"=="" (
    echo   Try this: Run the installer again or check your environment.
) else (
    echo   Try this: %~2
)
echo.
goto :eof

:show_result
set "FS_INSTALL_TITLE=%~1"
set "FS_INSTALL_MESSAGE=%~2"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show($env:FS_INSTALL_MESSAGE,$env:FS_INSTALL_TITLE,[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Information)" >nul 2>&1
if !errorlevel! equ 0 exit /b 0
echo.
echo   !FS_INSTALL_TITLE!
echo   !FS_INSTALL_MESSAGE!
echo.
pause
exit /b 1

:finish_fail
call :show_result "!FS_INSTALL_TITLE!" "!FS_INSTALL_MESSAGE!"
popd >nul 2>&1
exit /b 1

:finish_ok
call :show_result "FSdiscover installation succeeded" "FSdiscover is installed and ready to use. Open a new PowerShell or Command Prompt window, then run: fsdiscover"
popd >nul 2>&1
exit /b 0