@echo off
setlocal EnableExtensions

title GreenCharge AI
cd /d "%~dp0"

:MENU
cls
echo ==================================================
echo                  GREENCHARGE AI
echo        Full-Stack EV Charging Optimization
echo   React Frontend + Express Backend + Python CP-SAT
echo ==================================================
echo.
echo   1. Setup All Dependencies (Node.js + Python)
echo   2. Start Full Stack (Frontend + Backend + Python CP-SAT)
echo   3. Start Web App Only (React Frontend + Express API)
echo   4. Start Frontend Only (React + Vite)
echo   5. Start Backend Only (Express API)
echo   6. Start Python CP-SAT Optimizer Server Only
echo   7. Build React Frontend (Production Build)
echo   8. Clean and Reinstall Dependencies
echo   9. Exit
echo.
echo ==================================================
echo.

choice /C 123456789 /N /M "Choose an option [1-9]: "

if errorlevel 9 goto EXIT
if errorlevel 8 goto CLEAN
if errorlevel 7 goto BUILD
if errorlevel 6 goto START_PYTHON
if errorlevel 5 goto BACKEND_ONLY
if errorlevel 4 goto FRONTEND_ONLY
if errorlevel 3 goto START_WEB
if errorlevel 2 goto START_ALL
if errorlevel 1 goto SETUP

:: --------------------------------------------------
:: 1. SETUP ALL DEPENDENCIES
:: --------------------------------------------------
:SETUP
cls
echo ==================================================
echo                PROJECT SETUP
echo ==================================================
echo.

:: Step 1: Check Node.js & npm
echo [1/2] Checking Node.js and npm...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed.
    echo Please install Node.js [v18+] from https://nodejs.org/ to continue.
    pause
    goto MENU
)

echo   Node.js version:
node -v
echo   npm version:
npm -v
echo.
echo Installing Node.js dependencies (Frontend + Express Backend)...
echo.
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Node.js npm installation failed.
    pause
    goto MENU
)
echo.
echo Node.js dependencies installed successfully!
echo.

:: Step 2: Check Python & pip
echo [2/2] Checking Python environment...
call :DETECT_PYTHON
if errorlevel 1 (
    echo.
    echo WARNING: Python was not found in PATH or virtual environment.
    echo The React Frontend and Express Backend are installed and ready.
    echo To use the CP-SAT Optimizer microservice, please install Python [v3.9+]
    echo from https://www.python.org/ and rerun Setup.
) else (
    echo   Python executable: %PYTHON_CMD%
    echo   Python version:
    call %PYTHON_CMD% --version
    echo.
    echo Installing Python dependencies for CP-SAT Optimizer...
    if exist "cp_sat\requirements.txt" (
        call %PYTHON_CMD% -m pip install -r cp_sat\requirements.txt
    ) else (
        call %PYTHON_CMD% -m pip install fastapi "uvicorn[standard]" pydantic requests ortools
    )
    if errorlevel 1 (
        echo.
        echo WARNING: Some Python packages failed to install.
        echo Please ensure pip is upgraded: %PYTHON_CMD% -m pip install --upgrade pip
    ) else (
        echo Python dependencies installed successfully!
    )
)

echo.
echo ==================================================
echo Project setup completed!
echo ==================================================
echo.
pause
goto MENU

:: --------------------------------------------------
:: 2. START FULL SYSTEM (FRONTEND + BACKEND + PYTHON CP-SAT)
:: --------------------------------------------------
:START_ALL
cls
echo ==================================================
echo          STARTING FULL GREENCHARGE AI SYSTEM
echo ==================================================
echo.
if not exist "node_modules" (
    echo Node dependencies not found. Installing first...
    call npm install
)

call :DETECT_PYTHON
if errorlevel 1 (
    echo WARNING: Python not detected. Starting Frontend and Express Backend only...
    set "START_PY=0"
) else (
    set "START_PY=1"
)

echo Starting Frontend (Port 5173) and Express Backend (Port 5000)...
start "GreenCharge AI Web App (React + Express)" cmd /k "cd /d ""%~dp0"" && npm run dev"

if "%START_PY%"=="1" (
    echo Starting CP-SAT Optimization Microservice [Port 8000]...
    start "GreenCharge AI CP-SAT Optimizer [Python]" cmd /k "cd /d ""%~dp0cp_sat"" && %PYTHON_CMD% server.py"
)

echo Waiting for services to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173/ ...
start "" "http://localhost:5173/"

echo.
echo ==================================================
echo System started successfully!
echo ==================================================
echo - Frontend UI:        http://localhost:5173/
echo - Express Backend:    http://localhost:5000/api
if "%START_PY%"=="1" (
echo - CP-SAT Server:      http://localhost:8000/
echo - CP-SAT API Docs:    http://localhost:8000/docs
echo - CP-SAT WebSocket:   ws://localhost:8000/ws/schedule
) else (
echo - CP-SAT Server:      NOT RUNNING [Python not found]
)
echo ==================================================
echo.
pause
goto MENU

:: --------------------------------------------------
:: 3. START WEB APP ONLY (FRONTEND + BACKEND)
:: --------------------------------------------------
:START_WEB
cls
echo ==================================================
echo        STARTING FRONTEND + EXPRESS BACKEND
echo ==================================================
echo.
if not exist "node_modules" (
    echo Dependencies not found. Installing first...
    call npm install
)

echo Starting Frontend (Port 5173) and Express Backend (Port 5000)...
echo.
start "GreenCharge AI Dev Server" cmd /k "cd /d ""%~dp0"" && npm run dev"

echo Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173/ ...
start "" "http://localhost:5173/"

echo.
echo System started successfully!
echo - Frontend: http://localhost:5173/
echo - Backend:  http://localhost:5000/api
echo.
pause
goto MENU

:: --------------------------------------------------
:: 4. START FRONTEND ONLY
:: --------------------------------------------------
:FRONTEND_ONLY
cls
echo ==================================================
echo               STARTING FRONTEND ONLY
echo ==================================================
echo.
if not exist "node_modules" (
    echo Dependencies not found. Installing first...
    call npm install
)

echo Starting Vite Frontend (Port 5173)...
start "GreenCharge AI Client" cmd /k "cd /d ""%~dp0"" && npm run client"
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173/"
echo Frontend running at http://localhost:5173/
echo.
pause
goto MENU

:: --------------------------------------------------
:: 5. START BACKEND ONLY
:: --------------------------------------------------
:BACKEND_ONLY
cls
echo ==================================================
echo            STARTING EXPRESS BACKEND ONLY
echo ==================================================
echo.
if not exist "node_modules" (
    echo Dependencies not found. Installing first...
    call npm install
)

echo Starting Express Backend (Port 5000)...
start "GreenCharge AI Server" cmd /k "cd /d ""%~dp0"" && npm run server"
echo Backend running at http://localhost:5000/api
echo.
pause
goto MENU

:: --------------------------------------------------
:: 6. START PYTHON CP-SAT OPTIMIZER SERVER ONLY
:: --------------------------------------------------
:START_PYTHON
cls
echo ==================================================
echo       STARTING CP-SAT OPTIMIZER MICROSERVICE
echo ==================================================
echo.
call :DETECT_PYTHON
if errorlevel 1 (
    echo ERROR: Python is not installed or not found in PATH.
    echo Please install Python [v3.9+] to run the CP-SAT Optimizer.
    pause
    goto MENU
)

echo Starting CP-SAT Optimizer on http://localhost:8000 ...
start "GreenCharge AI CP-SAT Optimizer (Python)" cmd /k "cd /d ""%~dp0cp_sat"" && %PYTHON_CMD% server.py"

timeout /t 2 /nobreak >nul
echo Opening CP-SAT Microservice Dashboard...
start "" "http://localhost:8000/"

echo.
echo Python CP-SAT Microservice started:
echo - Interactive Dashboard: http://localhost:8000/
echo - Swagger API Docs:      http://localhost:8000/docs
echo - REST Optimize Endpoint: POST http://localhost:8000/api/v1/optimize
echo - Real-time WebSocket:   ws://localhost:8000/ws/schedule
echo.
pause
goto MENU

:: --------------------------------------------------
:: 7. BUILD PROJECT
:: --------------------------------------------------
:BUILD
cls
echo ==================================================
echo                 BUILD PROJECT
echo ==================================================
echo.
if not exist "node_modules" (
    echo Installing dependencies first...
    call npm install
)

echo Building production assets...
call npm run build
if errorlevel 1 (
    echo.
    echo Build failed!
    pause
    goto MENU
)

echo.
echo Build succeeded! Distribution files are in: dist/
echo.
pause
goto MENU

:: --------------------------------------------------
:: 8. CLEAN AND REINSTALL
:: --------------------------------------------------
:CLEAN
cls
echo ==================================================
echo               CLEAN AND REINSTALL
echo ==================================================
echo.
echo This will delete node_modules, package-lock.json, and cache files.
choice /C YN /N /M "Are you sure? [Y/N]: "
if errorlevel 2 goto MENU

echo.
echo Cleaning Node.js dependencies...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del /f /q "package-lock.json"
if exist "dist" rmdir /s /q "dist"

echo Cleaning Python __pycache__...
if exist "cp_sat\__pycache__" rmdir /s /q "cp_sat\__pycache__"

echo.
echo Reinstalling Node.js dependencies...
call npm install

call :DETECT_PYTHON
if not errorlevel 1 (
    echo Reinstalling Python dependencies...
    if exist "cp_sat\requirements.txt" (
        call %PYTHON_CMD% -m pip install -r cp_sat\requirements.txt
    ) else (
        call %PYTHON_CMD% -m pip install fastapi "uvicorn[standard]" pydantic requests ortools
    )
)

echo.
echo Done! All dependencies cleaned and reinstalled.
pause
goto MENU

:: --------------------------------------------------
:: 9. EXIT
:: --------------------------------------------------
:EXIT
cls
echo Goodbye!
timeout /t 1 /nobreak >nul
exit /b

:: --------------------------------------------------
:: HELPER: DETECT PYTHON EXECUTABLE
:: --------------------------------------------------
:DETECT_PYTHON
set "PYTHON_CMD="
if exist "%~dp0.venv\Scripts\python.exe" (
    set "PYTHON_CMD=%~dp0.venv\Scripts\python.exe"
    exit /b 0
)
if exist "%~dp0venv\Scripts\python.exe" (
    set "PYTHON_CMD=%~dp0venv\Scripts\python.exe"
    exit /b 0
)
if exist "%~dp0cp_sat\venv\Scripts\python.exe" (
    set "PYTHON_CMD=%~dp0cp_sat\venv\Scripts\python.exe"
    exit /b 0
)
where python >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_CMD=python"
    exit /b 0
)
where py >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_CMD=py"
    exit /b 0
)
exit /b 1
