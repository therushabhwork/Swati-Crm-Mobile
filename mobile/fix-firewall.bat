@echo off
:: Check for admin rights
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator rights confirmed. Adding firewall rule...
    powershell -Command "New-NetFirewallRule -DisplayName 'Expo Port 8081' -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow"
    echo Firewall rule added! You can now run npm start -- -c
    pause
) else (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
)
