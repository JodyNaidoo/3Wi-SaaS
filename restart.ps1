Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500
Copy-Item "C:\Users\User\3WI Pty Ltd\HempireEC\ECRDA EOI 2025\Command Centre\3Wi SAAS for Sunshine Project\03_PMO_SaaS\apps\api\src\server.ts" "C:\dev\3wi-pmo-saas\apps\api\src\server.ts" -Force -ErrorAction SilentlyContinue
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\dev\3wi-pmo-saas\apps\api; npm run dev'
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\dev\3wi-pmo-saas\apps\web; npm run dev'
Write-Host "API + Web restarted. Use http://localhost:5173" -ForegroundColor Green
