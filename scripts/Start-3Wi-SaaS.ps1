# ===================================================================
# Start-3Wi-SaaS.ps1 — one-click startup
# ===================================================================
$root = "C:\dev\3wi-pmo-saas"
Set-Location $root

Write-Host "`n==> Cleaning up old node processes..." -ForegroundColor Yellow
Get-Process node, tsx -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

Write-Host "==> Verifying .env files exist..." -ForegroundColor Yellow
$envOk = $true
foreach ($f in 'apps\api\.env', 'apps\web\.env') {
    if (-not (Test-Path (Join-Path $root $f))) {
        Write-Host "  MISSING: $f" -ForegroundColor Red
        $envOk = $false
    }
}
if (-not $envOk) {
    Write-Host "`nCannot start without .env files. See AFTER_RESTART_3Wi_SaaS.md on Desktop." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

Write-Host "==> Checking Prisma client is current..." -ForegroundColor Yellow
$schemaTime  = (Get-Item "$root\prisma\schema.prisma").LastWriteTime
$clientPath  = "$root\node_modules\.prisma\client\index.d.ts"
if ((-not (Test-Path $clientPath)) -or ((Get-Item $clientPath).LastWriteTime -lt $schemaTime)) {
    Write-Host "  Regenerating (schema newer than client)..." -ForegroundColor Cyan
    npm run prisma:generate
} else {
    Write-Host "  Prisma client up-to-date" -ForegroundColor Green
}

Write-Host "==> Starting API + Web (one combined window with colour-coded output)..." -ForegroundColor Yellow
Start-Process pwsh -WorkingDirectory $root -ArgumentList @(
    '-NoExit',
    '-Command',
    "`$Host.UI.RawUI.WindowTitle = '3Wi SaaS Dev (API+WEB)'; npm run dev"
)

Write-Host "==> Waiting up to 60s for both ports to be live..." -ForegroundColor Yellow
$elapsed = 0
while ($elapsed -lt 60) {
    $api = Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue
    $web = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
    if ($api -and $web) {
        Write-Host "  Both ports listening!" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 1
    $elapsed++
}

if ($elapsed -ge 60) {
    Write-Host "  Timeout — check the dev window for errors." -ForegroundColor Red
} else {
    Write-Host "==> Opening browser at /cc/director..." -ForegroundColor Yellow
    Start-Process "http://localhost:5173/cc/director"
}

Write-Host "`nDONE. Use 'Stop 3Wi SaaS' on the Desktop to stop everything later." -ForegroundColor Green
Start-Sleep -Seconds 3
