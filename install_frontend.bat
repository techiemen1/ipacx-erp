@echo off
SETLOCAL
echo [IPACX] Starting Clean Frontend Installation...

:: 1. Force add Node.js to PATH
set "PATH=%PATH%;C:\Program Files\nodejs"

cd frontend

:: 2. Clean previous attempts
if exist "node_modules" (
    echo [INFO] Removing partial node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo [INFO] Removing package-lock.json...
    del package-lock.json
)

:: 3. Configure NPM registry (optional, helps with network issues)
echo [INFO] Setting registry to standard npm...
call npm config set registry https://registry.npmjs.org/

:: 4. Install
echo [INFO] Running npm install (This may take 2-5 minutes)...
echo [INFO] Please wait until you see 'Done' or an error message.
call npm install --loglevel=verbose

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed!
    echo Please check your internet connection or error messages above.
    pause
    EXIT /B 1
)

echo.
echo [SUCCESS] Dependencies installed!
echo You can now close this window and run 'run_frontend.bat'.
pause
ENDLOCAL
