@echo off
echo This will uninstall FSDiscover from your system.
set /p "CONFIRM=Are you sure you want to continue? (Y/N): "
if /I not "%CONFIRM%"=="Y" (
    echo Uninstallation cancelled.
    exit /b 0
)

REM Define directories and paths
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\FSDiscover.lnk"
set "BIN_DIR=%USERPROFILE%\bin"
set "SYMLINK_PATH=%BIN_DIR%\fsdiscover.cmd"

REM Remove application directory
if exist "%APP_DIR%" (
    echo Removing application directory: %APP_DIR%
    rmdir /S /Q "%APP_DIR%"
)

REM Remove shortcut
if exist "%SHORTCUT_PATH%" (
    echo Removing Start Menu shortcut: %SHORTCUT_PATH%
    del "%SHORTCUT_PATH%"
)

REM Remove CLI symlink
if exist "%SYMLINK_PATH%" (
    echo Removing CLI symlink: %SYMLINK_PATH%
    del "%SYMLINK_PATH%"
)

REM Ask user if they want to remove fsdiscover's bin dir from PATH
echo.
echo FSDiscover may have added %USERPROFILE%\bin to your PATH.
set /p "REMOVE_BIN_PATH=Do you want to remove %USERPROFILE%\bin from your PATH? (Y/N): "
if /I "%REMOVE_BIN_PATH%"=="Y" (
    for /f "tokens=1,* delims==" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH 2^>nul') do (
        set "CUR_PATH=%%b"
    )
    call set "NEW_PATH=%%CUR_PATH:%USERPROFILE%\bin;=%%"
    setx PATH "%NEW_PATH%" /M
    echo Removed %USERPROFILE%\bin from system PATH.
)

REM Ask if user wants to uninstall fnm
echo.
where fnm >nul 2>&1
if not errorlevel 1 (
    set /p "REMOVE_FNM=Do you want to uninstall fnm as well? (Y/N): "
    if /I "%REMOVE_FNM%"=="Y" (
        winget uninstall Schniz.fnm
    )
)

echo.
echo FSDiscover has been uninstalled.
exit /b 0

