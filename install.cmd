@echo off
REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/en/download and try again.
    exit /b 1
)

REM Install project dependencies
if exist package.json (
    npm install
) else (
    echo Failure: package.json not found... Failed to find project dependencies
    REM Prompt user to acknowledge before proceeding
    echo This script will download and install fnm and Node.js. Do you want to continue? (Y/N)
    set /p "USER_CONFIRM=Enter Y to continue or N to cancel: "
    if /I not "%USER_CONFIRM%"=="Y" (
        echo Installation canceled by user.
        exit /b 1
    )

    REM Download and install fnm:
    winget install Schniz.fnm

    REM Download and install Node.js:
    fnm install 22

    REM Verify the Node.js version:
    node -v

    REM Verify npm version:
    npm -v
)

REM Define application directory
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"
if not exist "%APP_DIR%" (
    mkdir "%APP_DIR%"
)

REM Copy project files to application directory, excluding .git and ./fe
REM Create an exclusion file for xcopy
echo .git\ > exclude.txt
echo fe\ >> exclude.txt

REM Copy project files to application directory, excluding specified patterns
xcopy /E /I * "%APP_DIR%" /EXCLUDE:exclude.txt

REM Clean up the exclusion file
del exclude.txt

REM Ensure fsdiscover.cmd script is executable
REM Ensure fsdiscover.cmd script exists
if not exist "%APP_DIR%\fsdiscover.cmd" (
    echo Error: fsdiscover.cmd not found in %APP_DIR%.
    exit /b 1
)

REM Create shortcut file
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\FSDiscover.lnk"
set "TARGET_PATH=%APP_DIR%\fsdiscover.cmd"
set "ICON_PATH=%APP_DIR%\public\icon.png"

REM Check if the icon file exists
if not exist "%ICON_PATH%" (
    echo Warning: Icon file not found at %ICON_PATH%. The shortcut will not have an icon.
    set "ICON_PATH="
)

REM Create the shortcut using PowerShell
powershell -NoProfile -Command "& { $ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%TARGET_PATH%'; if ('%ICON_PATH%' -ne '') { $s.IconLocation = '%ICON_PATH%' }; $s.Save() }"

REM Create a symbolic link to make the application accessible from the CLI
set "BIN_DIR=%USERPROFILE%\bin"
if not exist "%BIN_DIR%" (
    mkdir "%BIN_DIR%"
)
mklink "%BIN_DIR%\fsdiscover.cmd" "%APP_DIR%\fsdiscover.cmd"

REM Ensure %USERPROFILE%\bin is in the PATH
setx PATH "%PATH%;%USERPROFILE%\bin" /M

REM Print completion message
echo Installation Finished.
echo Shortcut created at %SHORTCUT_PATH%
echo Bin name set to 'fsdiscover'
echo Run 'fsdiscover' on the CLI to start the application.
