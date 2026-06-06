# =====================================================================
# 3Wi PMO SaaS — Clean Shutdown
# Stops both API (4000) and Web (5173). Database in Supabase is unaffected.
# =====================================================================

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
"$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  stopped manually" | Out-File 'C:\dev\3wi-pmo-saas\logs\autostart.log' -Append
Write-Host '3Wi PMO SaaS stopped.' -ForegroundColor Yellow
Write-Host 'Run autostart.ps1 (or restart your PC) to bring it back up.' -ForegroundColor Cyan
