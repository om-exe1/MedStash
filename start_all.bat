@echo off
title MedStash Full-Stack Launcher
echo ========================================================
echo       Starting MedStash Full-Stack Application
echo ========================================================
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "MedStash Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .venv\Scripts\python.exe run.py"

timeout /t 2 /nobreak >nul

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "MedStash Frontend (Vite)" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting up!
echo - API Docs: http://127.0.0.1:8000/docs
echo - Web App:  http://localhost:5173
echo.
pause
