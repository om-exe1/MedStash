@echo off
title MedStash FastAPI Backend
echo Starting MedStash FastAPI Backend on http://127.0.0.1:8000 ...
cd /d "%~dp0backend"
call .venv\Scripts\python.exe run.py
pause
