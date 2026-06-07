# Stop-3Wi-SaaS.ps1 — kill all dev processes
Write-Host "Stopping 3Wi SaaS dev processes..." -ForegroundColor Yellow
Get-Process node, tsx -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1
foreach ($port in 4000, 5173) {
    $still = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($still) { Write-Host "  Port $port still listening — try again" -ForegroundColor Yellow }
    else        { Write-Host "  Port $port stopped" -ForegroundColor Green }
}
Start-Sleep -Seconds 2
