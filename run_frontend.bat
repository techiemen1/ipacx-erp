@echo off
SETLOCAL
echo [IPACX] Starting Frontend...

:: Add Node to path blindly
set "PATH=%PATH%;C:\Program Files\nodejs"

:: Verify node (optional, just printing version)
echo Node Version:
node -v

cd frontend

:: Check if node_modules exists, if not, try install
if not exist "node_modules\" (
    echo [IPACX] Installing dependencies...
    call npm install
)

echo [IPACX] Launching server...
call npm run dev

ENDLOCAL
