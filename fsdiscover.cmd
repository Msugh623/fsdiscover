@echo off
setlocal enabledelayedexpansion

REM Define application directory and version file path
set "APP_DIR=%LOCALAPPDATA%\fsdiscover"
set "VERSION_FILE=%APP_DIR%\version"
set "NODE_CMD="
where node.exe >nul 2>&1
if !errorlevel! equ 0 set "NODE_CMD=node.exe"
set "NODE_ARCH=x64"
if /I "%PROCESSOR_ARCHITECTURE%"=="ARM64" set "NODE_ARCH=arm64"
if /I "%PROCESSOR_ARCHITEW6432%"=="ARM64" set "NODE_ARCH=arm64"
if not defined NODE_CMD if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_CMD=%LOCALAPPDATA%\Programs\nodejs\node.exe"
if not defined NODE_CMD if exist "%LOCALAPPDATA%\fsdiscover-runtime\node-v22.17.1-win-%NODE_ARCH%\node.exe" set "NODE_CMD=%LOCALAPPDATA%\fsdiscover-runtime\node-v22.17.1-win-%NODE_ARCH%\node.exe"

REM Ensure version file exists
if not exist "%VERSION_FILE%" (
    echo Error: Version file not found at %VERSION_FILE%.
    exit /b 1
)

REM Read version
for /f "usebackq delims=" %%v in ("%VERSION_FILE%") do set "VERSION=%%v"

echo -----------------------------------------
echo.
echo        SprintET FSdiscover %VERSION%
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

if /I "%PARAM1%"=="--uninstall" (
    call "%APP_DIR%\uninstall.cmd"
    exit /b %errorlevel%
)

if /I "%PARAM1%"=="-u" (
    call "%APP_DIR%\uninstall.cmd"
    exit /b %errorlevel%
)

if /I "%PARAM1%"=="-version" (
    echo %VERSION%
    exit /b 0
)

if /I "%PARAM1%"=="--logs" (
    cd ".\logs"
    explorer .\
    exit /b 0
)

if /I "%PARAM1%"=="-l" (
    cd ".\logs"
    explorer .\
    exit /b 0
)

if /I "%PARAM1%"=="--config" (
    type "auth.config.json"
    exit /b 0
)

if /I "%PARAM1%"=="-c" (
    type "auth.config.json"
    exit /b 0
)

if /I "%PARAM1%"=="-v" (
    echo %VERSION%
    exit /b 0
)

if /I "%PARAM1%"=="-p" (
    if /I "%PARAM2%"=="no-default" (
        echo Initiator: Clearing saved preferred interface
        if exist __prefer del /f /q __prefer
        set "PARAMS="
    ) else (
        echo "Initiator: Prefered network interface set to: %PARAM2%"
        echo "Initiator: Prefered network interface will be ignored if not available"
        set "PARAMS=--prefer %PARAM2%"
        if defined PARAM2 if not "%PARAM2%"=="" <nul set /p="%PARAM2%" > __prefer
    )
)

if /I "%PARAM1%"=="--prefer" if /I not "%PARAM2%"=="" set "PARAM1=-prefer"
if /I "%PARAM1%"=="--prefer" if /I "%PARAM2%"=="no-default" set "PARAM1=-prefer"
if /I "%PARAM1%"=="-prefer" (
    if /I "%PARAM2%"=="no-default" (
        echo Initiator: Clearing saved preferred interface
        if exist __prefer del /f /q __prefer
        set "PARAMS="
    ) else (
        echo "Initiator: Prefered network interface set to: %PARAM2%"
        echo "Initiator: Prefered network interface will be ignored if not available"
        set "PARAMS=--prefer %PARAM2%"
        if defined PARAM2 if not "%PARAM2%"=="" <nul set /p="%PARAM2%" > __prefer
    )
)

if /I "%PARAM1%"=="-help" goto :show_help
if /I "%PARAM1%"=="-h" goto :show_help

REM If no known argument, assume default run

REM update.js stages updates beside the app directory, not inside it.
set "UPDATE_ROOT=%LOCALAPPDATA%\update"
set "UPDATE_DIR=%UPDATE_ROOT%\fsdiscover-main"
if exist "%UPDATE_DIR%" (
    if exist "%UPDATE_DIR%\package.json" (
        if not exist "%APP_DIR%\logs" mkdir "%APP_DIR%\logs" >nul 2>&1
        echo Initiator: Applying update in the background...

        REM logger.js sweeps/clears everything in APP_DIR\logs on startup,
        REM regardless of filename - so the live update log must NOT live
        REM there while it's open for writing. Keep it in TEMP during the
        REM run, then copy the finished log into logs\ once it's closed.
        set "UPDATE_LOG_TMP=%TEMP%\fsdiscover_update_%RANDOM%.log"
        set "RUNNER=%TEMP%\fsdiscover_update_%RANDOM%.cmd"
        > "!RUNNER!" (
            echo @echo off
            echo cd /d "%UPDATE_DIR%"
            echo call install.cmd ^> "!UPDATE_LOG_TMP!" 2^>^&1
            echo cd /d "%APP_DIR%"
            REM must cd OUT of UPDATE_DIR before deleting it, or rmdir fails silently
            echo rmdir /S /Q "%UPDATE_DIR%"
            REM log is closed now - safe to archive it into logs\
            echo copy /y "!UPDATE_LOG_TMP!" "%APP_DIR%\logs\update_install.log" ^>nul 2^>^&1
            echo del "!UPDATE_LOG_TMP!" ^>nul 2^>^&1
            echo del "%%~f0"
        )

        REM Launch fully hidden - no console window at all - via a tiny VBS
        REM wrapper. More reliable than "start /min", which still briefly
        REM flashes a window before minimizing.
        set "VBS=%TEMP%\fsdiscover_launch_%RANDOM%.vbs"
        > "!VBS!" (
            echo Set objShell = CreateObject^("WScript.Shell"^)
            echo objShell.Run """!RUNNER!""", 0, False
        )
        wscript.exe //B "!VBS!"
        del "!VBS!" >nul 2>&1

        echo Initiator: Update running in the background; FSdiscover will continue starting.
    ) else (
        echo Initiator: Update ignored because package.json was not found.
        rmdir /S /Q "%UPDATE_ROOT%" >nul 2>&1
    )
)

REM If no explicit prefer was provided, fall back to saved __prefer file
if not defined PARAMS (
    if exist __prefer (
        for /f "usebackq delims=" %%i in ("__prefer") do set "PREF=%%i"
        if defined PREF (
            echo Initiator: Using saved preferred interface: %PREF%
            set "PARAMS=--prefer %PREF%"
        )
    )
)

REM Check for node_modules before starting
if not exist node_modules goto :runtime_fail
if not defined NODE_CMD goto :runtime_fail
"%NODE_CMD%" index.js %PARAMS%
exit /b %errorlevel%

:runtime_fail
if not exist node_modules echo Failure: node_modules not found.
if not defined NODE_CMD echo Failure: Node.js runtime not found.
echo Run 'install.cmd' again or install Node.js LTS manually.
exit /b 1

:show_help
echo Usage: fsdiscover [option]
echo.
echo   -l, --logs            See logs
echo   -c, --config          See fsdiscover configuration file
echo   -p, --prefer          Supply a prefered network interface. e.g fsdiscover --prefer <interface_name>
echo                        This will be ignored if the interface is not available
echo   -u, --uninstall       Uninstall (remove) fsdiscover
echo   -v, --version         Show current version
echo   -h, --help            Display help message
echo.
echo For more information, contact: team@sprintet.com
exit /b 0