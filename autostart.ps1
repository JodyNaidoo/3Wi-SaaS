# =====================================================================
# 3Wi PMO SaaS - Auto-Start Launcher (v2 - delegates sync to OneDrive)
#
# Triggered by Windows Task Scheduler at user login.
# Calls sync.ps1 from OneDrive (always-latest), then starts API + Web hidden.
# =====================================================================

$ErrorActionPreference = 'SilentlyContinue'
$repoRoot  = 'C:\dev\3wi-pmo-saas'
$logDir    = "$repoRoot\logs"
$oneDrive  = 'C:\Users\User\3WI Pty Ltd\HempireEC\ECRDA EOI 2025\Command Centre\3Wi SAAS for Sunshine Project'

if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

$ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
"$ts  autostart fired" | Out-File "$logDir\autostart.log" -Append

# Kill any stale node processes (clears ports 4000 + 5173)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 750

# Delegate sync to OneDrive's sync.ps1 (always-latest version)
$syncScript = "$oneDrive\_autostart\sync.ps1"
if (Test-Path $syncScript) {
    try {
        & $syncScript
        $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        "$ts  sync completed (delegated to OneDrive sync.ps1)" | Out-File "$logDir\autostart.log" -Append
    } catch {
        $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        "$ts  WARN: sync.ps1 threw: $_" | Out-File "$logDir\autostart.log" -Append
    }
} else {
    $fallback = "$oneDrive\03_PMO_SaaS\apps\api\src\server.ts"
    if (Test-Path $fallback) {
        Copy-Item $fallback "$repoRoot\apps\api\src\server.ts" -Force
        $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        "$ts  WARN sync.ps1 missing - used fallback server.ts copy" | Out-File "$logDir\autostart.log" -Append
    } else {
        $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        "$ts  WARN sync.ps1 and fallback both missing - using last-known-good code" | Out-File "$logDir\autostart.log" -Append
    }
}

# Start API hidden
$apiCmd = "cd '$repoRoot\apps\api'; npm run dev *>&1 | Tee-Object -FilePath '$logDir\api.log'"
Start-Process powershell -WindowStyle Hidden -ArgumentList '-NoExit', '-Command', $apiCmd

# Wait for API to bind port 4000 before launching Web
Start-Sleep -Seconds 4

# Start Web hidden
$webCmd = "cd '$repoRoot\apps\web'; npm run dev *>&1 | Tee-Object -FilePath '$logDir\web.log'"
Start-Process powershell -WindowStyle Hidden -ArgumentList '-NoExit', '-Command', $webCmd

$ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
"$ts  API + Web launched (hidden)" | Out-File "$logDir\autostart.log" -Append
