@echo off
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

REM Copy project files to application directory
xcopy /E /I * "%APP_DIR%"

REM Create shortcut file
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\FSDiscover.lnk"
set "TARGET_PATH=%APP_DIR%\fsdiscover.cmd"
set "ICON_PATH=%APP_DIR%\public\icon.ico"

REM Create the shortcut using PowerShell
powershell -command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%TARGET_PATH%'; $s.IconLocation = '%ICON_PATH%'; $s.Save()"

REM Print completion message
echo Installation Finished.
echo Shortcut created at %SHORTCUT_PATH%