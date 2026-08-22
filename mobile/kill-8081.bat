@echo off
:: Check for admin rights
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator rights confirmed.
    echo Scanning for processes using port 8081...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081') do (
        if not "%%a" == "0" (
            echo Found ghost process with PID: %%a
            taskkill /F /PID %%a
        )
    )
    echo Port 8081 has been forcefully cleared! You can now run npm start -- -c
    pause
) else (
    echo Requesting Administrator privileges to kill the process...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
)
