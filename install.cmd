@echo off
REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/en/download and try again.
    echo FSDiscover depends on Node.js... Proceed to install fnm and Node.js? (Y/N)
    set /p "USER_CONFIRM=Enter Y to continue or N to cancel: "
    if /I not "%USER_CONFIRM%"=="Y" (
        echo Installation canceled by user.
        exit /b 1
    )

    REM Install fnm (Fast Node Manager)
    winget install Schniz.fnm

    REM Install Node.js version 22 using fnm
    fnm install 22

    REM Re-check Node.js installation
    call fnm use 22
    node -v
    npm -v
)

REM Install project dependencies
if exist package.json (
    npm install
) else (
    echo Failure: package.json not found... Failed to find project dependencies
    exit /b 1
)

REM Define application directory
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"
if not exist "%APP_DIR%" (
    mkdir "%APP_DIR%"
)

REM Create an exclusion file for xcopy
> exclude.txt (
    echo .git\
    echo fe\
)

REM Copy project files to application directory
xcopy /E /I * "%APP_DIR%" /EXCLUDE:exclude.txt
del exclude.txt

REM Ensure fsdiscover.cmd script exists
if not exist "%APP_DIR%\fsdiscover.cmd" (
    echo Error: fsdiscover.cmd not found in %APP_DIR%.
    exit /b 1
)

REM Create Start Menu shortcut
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\FSDiscover.lnk"
set "TARGET_PATH=%APP_DIR%\fsdiscover.cmd"
set "ICON_PATH=%APP_DIR%\public\icon.png"

REM Create the shortcut using PowerShell
powershell -NoProfile -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); ^
   $s.TargetPath = '%TARGET_PATH%'; ^
   if (Test-Path '%ICON_PATH%') { $s.IconLocation = '%ICON_PATH%' }; ^
   $s.Save()"

REM Create CLI symlink
set "BIN_DIR=%USERPROFILE%\bin"
if not exist "%BIN_DIR%" (
    mkdir "%BIN_DIR%"
)
mklink "%BIN_DIR%\fsdiscover.cmd" "%APP_DIR%\fsdiscover.cmd"

REM Ensure %USERPROFILE%\bin is in the PATH
setx PATH "%PATH%;%USERPROFILE%\bin" /M

REM Final messages
echo Installation Finished.
echo Shortcut created at %SHORTCUT_PATH%
echo Bin name set to 'fsdiscover'
echo Run 'fsdiscover' on the CLI to start the application.
echo Use 'fsdiscover --help' for more information.
