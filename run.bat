@echo off
setlocal EnableExtensions

title GreenCharge AI
cd /d "%~dp0"

:MENU
cls
echo ==================================================
echo                  GREENCHARGE AI
echo            React + Node.js Express Setup
echo ==================================================
echo.
echo   1. Setup Project (Install Dependencies)
echo   2. Start Project (Frontend + Backend)
echo   3. Build Project (Production Build)
echo   4. Start Frontend Only (React + Vite)
echo   5. Start Backend Only (Express API)
echo   6. Clean and Reinstall
echo   7. Exit
echo.
echo ==================================================
echo.

choice /C 1234567 /N /M "Choose an option [1-7]: "

if errorlevel 7 goto EXIT
if errorlevel 6 goto CLEAN
if errorlevel 5 goto BACKEND_ONLY
if errorlevel 4 goto FRONTEND_ONLY
if errorlevel 3 goto BUILD
if errorlevel 2 goto START
if errorlevel 1 goto SETUP

:: --------------------------------------------------
:: 1. SETUP PROJECT
:: --------------------------------------------------
:SETUP
cls
echo ==================================================
echo                PROJECT SETUP
echo ==================================================
echo.
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed.
    echo Please install Node.js (v18+) to continue.
    pause
    goto MENU
)

echo Node.js version:
node -v
echo npm version:
npm -v
echo.
echo Installing project dependencies...
echo.
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Installation failed.
    pause
    goto MENU
)
echo.
echo Project setup completed successfully!
echo.
pause
goto MENU

:: --------------------------------------------------
:: 2. START PROJECT (FULL SYSTEM)
:: --------------------------------------------------
:START
cls
echo ==================================================
echo               STARTING GREENCHARGE AI
echo ==================================================
echo.
if not exist "node_modules" (
    echo Dependencies not found. Installing first...
    call npm install
)

echo Starting Frontend (Port 5173) and Backend (Port 5000)...
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
:: 3. BUILD PROJECT
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
:: 4. START FRONTEND ONLY
:: --------------------------------------------------
:FRONTEND_ONLY
cls
echo Starting Vite Frontend...
start "GreenCharge AI Client" cmd /k "cd /d ""%~dp0"" && npm run client"
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173/"
pause
goto MENU

:: --------------------------------------------------
:: 5. START BACKEND ONLY
:: --------------------------------------------------
:BACKEND_ONLY
cls
echo Starting Express Backend...
start "GreenCharge AI Server" cmd /k "cd /d ""%~dp0"" && npm run server"
pause
goto MENU

:: --------------------------------------------------
:: 6. CLEAN AND REINSTALL
:: --------------------------------------------------
:CLEAN
cls
echo ==================================================
echo               CLEAN AND REINSTALL
echo ==================================================
echo.
echo This will delete node_modules and package-lock.json.
choice /C YN /N /M "Are you sure? [Y/N]: "
if errorlevel 2 goto MENU

echo.
echo Cleaning files...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del /f /q "package-lock.json"

echo Reinstalling dependencies...
call npm install
echo Done!
pause
goto MENU

:: --------------------------------------------------
:: 7. EXIT
:: --------------------------------------------------
:EXIT
cls
echo Goodbye!
timeout /t 1 /nobreak >nul
exit /b
