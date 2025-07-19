@echo off
setlocal enabledelayedexpansion

echo This will uninstall FSDiscover from your system.
set /p "CONFIRM=Are you sure you want to continue? (Y/N): "
if /I not "%CONFIRM%"=="Y" (
    echo Uninstallation cancelled.
    exit /b 0
)

REM === Define paths ===
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"
set "PARENT_DIR=%LOCALAPPDATA%"
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\FsDiscover\FSDiscover.lnk"
set "DESKTOP_SHORTCUT=%USERPROFILE%\Desktop\FSDiscover.lnk"
set "BIN_DIR=%USERPROFILE%\bin"
set "SYMLINK_PATH=%BIN_DIR%\fsdiscover.cmd"

REM === Remove Start Menu shortcut ===
if exist "%SHORTCUT_PATH%" (
    echo Removing Start Menu shortcut...
    del "%SHORTCUT_PATH%" >nul
)

REM === Remove Desktop shortcut ===
if exist "%DESKTOP_SHORTCUT%" (
    echo Removing Desktop shortcut...
    del "%DESKTOP_SHORTCUT%" >nul
)

REM === Remove CLI shortcut ===
if exist "%SYMLINK_PATH%" (
    echo Removing CLI shortcut...
    del "%SYMLINK_PATH%" >nul
)

REM === Remove app directory ===
if exist "%APP_DIR%" (
    echo Removing application directory: %APP_DIR%
    rmdir /S /Q "%APP_DIR%"
)

REM === Try to remove parent if empty ===
pushd "%PARENT_DIR%" >nul
if not exist "%APP_DIR%" (
    rd fsdiscover >nul 2>&1
)
popd >nul

REM === Ask to remove bin from PATH ===
echo.
echo FSDiscover may have added %USERPROFILE%\bin to your PATH.
set /p "REMOVE_BIN_PATH=Do you want to remove %USERPROFILE%\bin from your PATH? (Y/N): "
if /I "%REMOVE_BIN_PATH%"=="Y" (
    for /f "tokens=2*" %%A in ('reg query HKCU\Environment /v PATH 2^>nul') do (
        set "CUR_PATH=%%B"
    )
    call set "NEW_PATH=%%CUR_PATH:%USERPROFILE%\bin;=%%"
    setx PATH "!NEW_PATH!" >nul
    echo Removed %USERPROFILE%\bin from user PATH.
)

echo.
echo FSDiscover has been fully uninstalled.
exit /b 0
