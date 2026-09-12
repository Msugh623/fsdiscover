@echo off
setlocal

pushd "%~dp0" >nul 2>&1
if errorlevel 1 (
    echo Failure: Unable to access the fsdiscover directory.
    exit /b 1
)

if not exist "fe\package.json" (
    echo Failure: fe\package.json was not found.
    popd
    exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo Failure: npm was not found on PATH.
    echo Install Node.js and try again.
    popd
    exit /b 1
)

echo Installing frontend dependencies...
pushd "fe" >nul 2>&1
if errorlevel 1 (
    echo Failure: Unable to enter the frontend directory.
    popd
    exit /b 1
)
call npm.cmd install --legacy-peer-deps
if errorlevel 1 (
    echo Failure: Frontend dependencies could not be installed.
    popd
    popd
    exit /b 1
)

echo Building frontend...
call npm.cmd run build
if errorlevel 1 (
    echo Failure: Frontend build failed.
    popd
    popd
    exit /b 1
)
popd

if exist "public\client\assets" rmdir /s /q "public\client\assets"
if errorlevel 1 (
    echo Failure: Unable to remove the previous client assets.
    popd
    exit /b 1
)

if not exist "fe\dist" (
    echo Failure: Frontend build did not create fe\dist.
    popd
    exit /b 1
)

if not exist "public\client" mkdir "public\client"
robocopy "fe\dist" "public\client" /E /MOVE /NFL /NDL /NJH /NJS /NC /NS /NP >nul
if errorlevel 8 (
    echo Failure: Unable to copy the frontend build to public\client.
    popd
    exit /b 1
)

popd
echo Frontend build completed successfully.
exit /b 0
