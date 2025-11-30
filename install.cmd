@echo off
setlocal enabledelayedexpansion

echo.
echo Fsdiscover is a tool that allows you to access your filesystem over your local HTTP network.
echo.

REM === Check if Node.js is installed ===
where node >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Node.js is not installed. Fsdiscover depends on the NodeJs runtime to function properly. Downloading and Installing NodeJs...
    node.msi || curl https://nodejs.org/dist/v22.17.1/node-v22.17.1-x64.msi > node.msi
    node.msi
    pause
)

where node >nul 2>&1
if errorlevel 1 (
    echo "NodeJs not found. Fsdiscover depends on the NodeJs runtime to function properly. visit https://nodejs.org/en/download to download it..."
    pause
    exit /b 1
)

REM === Install dependencies ===
if exist package.json (
    echo Installing required dependencies...
    if not exist logs mkdir logs
    call npm install || (
        echo [ERROR] Failed to install dependencies.
        exit /b 1
    )
) else (
    echo [ERROR] package.json not found... Is this FsDiscover?
    exit /b 1
)

REM === Setup installation directory ===
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"
if not exist "%APP_DIR%" (
    mkdir "%APP_DIR%" || (
        echo [ERROR] Failed to create %APP_DIR%
        exit /b 1
    )
)

REM === Prevent running from inside the install dir ===
if /I "%CD%"=="%APP_DIR%" (
    echo [ERROR] Please run this installer from outside the fsdiscover installation directory.
    exit /b 1
)

REM === Write exclusions to temp file ===
> exclude.txt (
    echo .git\
)

REM === Copy files ===
echo Copying files to %APP_DIR%...
xcopy /E /I /Y * "%APP_DIR%" /EXCLUDE:exclude.txt >nul
mkdir "%APP_DIR%\temp"
del exclude.txt
if errorlevel 1 (
    echo [ERROR] Failed to copy files.
    exit /b 1
)

REM === Create Start Menu shortcut ===
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\FsDiscover"
set "TARGET_PATH=%APP_DIR%\fsdiscover.cmd"
set "ICON_PATH=%APP_DIR%\public\icon.ICO"
dir "%SHORTCUT_PATH%" > "logs.log" || mkdir "%SHORTCUT_PATH%"
node utils/makeico.js "%TARGET_PATH%" "%SHORTCUT_PATH%" "%ICON_PATH%"

if not exist "%SHORTCUT_PATH%" (
  echo [WARNING] Failed to create Start Menu shortcut.
)

REM === Create CLI shortcut ===
set "BIN_DIR=%USERPROFILE%\bin"
if not exist "%BIN_DIR%" (
    mkdir "%BIN_DIR%" || (
        echo [ERROR] Failed to create %BIN_DIR%
        exit /b 1
    )
)

REM Overwrite any previous link
if exist "%BIN_DIR%\fsdiscover.cmd" del "%BIN_DIR%\fsdiscover.cmd"
copy /Y "%APP_DIR%\fsdiscover.cmd" "%BIN_DIR%\fsdiscover.cmd"

if errorlevel 1 (
    echo [ERROR] Failed to create CLI shortcut in %BIN_DIR%
    exit /b 1
    pause
)

REM === Add to PATH if missing ===
echo %PATH% | find /I "%USERPROFILE%\bin" >nul
if errorlevel 1 (
    echo Adding fsdiscover to your PATH...
    setx PATH "%PATH%;%USERPROFILE%\bin" >nul
) else (
    echo PATH already includes fsdiscover.
)

echo.
echo Installation complete
echo Shortcut created at:  %SHORTCUT_PATH%
echo.
echo "********************************"
echo.
echo "Default password is set to ```password```, please change it as soon as possible, if you already changed it then ignore this message, it will not be overwritten"
echo.
echo "The email requested at login is not tested against any value, use your own email as it doesn't matter which email you use to login"
echo.
echo "********************************"
echo.
echo You can now launch FSDiscover from the Start Menu or by running: fsdiscover
echo Use: fsdiscover /help
echo for options.
pause
exit /b 0
