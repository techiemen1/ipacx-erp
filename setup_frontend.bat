@echo off
SETLOCAL

:: 1. Add Node.js to PATH temporarily for this session
echo [IPACX] Configuration Node.js path...
set "PATH=%PATH%;C:\Program Files\nodejs"

:: 2. Verify Node
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js still not found. Please restart your computer.
    pause
    EXIT /B 1
)

echo [IPACX] Node.js found. Initializing specific version...

:: 3. Create Vite Project (Non-interactive)
if exist "frontend" (
    echo [INFO] Frontend directory already exists. Skipping create.
) else (
    echo [IPACX] Creating React+TS project...
    call npm create vite@latest frontend -- --template react-ts
)

:: 4. Install Dependencies
cd frontend
echo [IPACX] Installing npm dependencies...
call npm install
call npm install -D tailwindcss postcss autoprefixer
call npm install @headlessui/react @heroicons/react axios react-router-dom

:: 5. Init Tailwind
if not exist "tailwind.config.js" (
    echo [IPACX] Initializing Tailwind...
    call npx tailwindcss init -p
)

echo.
echo [SUCCESS] Frontend setup complete.
echo.
echo To run the frontend:
echo    cd frontend
echo    npm run dev
echo.
pause
ENDLOCAL
