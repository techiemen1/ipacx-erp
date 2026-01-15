@echo off
SETLOCAL

echo [IPACX ERP] Checking environment...

:: Check for Python
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not found in your PATH.
    echo.
    echo Please download and install Python 3.9+ from:
    echo https://www.python.org/downloads/
    echo.
    echo IMPORTANT: Check the box "Add Python to PATH" during installation.
    echo.
    pause
    EXIT /B 1
)

:: Install Dependencies
echo [IPACX ERP] Installing dependencies...
python -m pip install -r requirements.txt
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    EXIT /B 1
)

:: Run Migrations
echo [IPACX ERP] Applying database migrations...
python manage.py migrate
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to apply migrations.
    pause
    EXIT /B 1
)

:: Create Superuser (Optional - skip if interactive/automation issues)
:: python manage.py createsuperuser --noinput

:: Start Server
echo [IPACX ERP] Starting Server at http://localhost:8000 ...
python manage.py runserver 0.0.0.0:8000

ENDLOCAL
