# =====================================================================
# apply-billing-calendar.ps1
# Applies the Unified Billing + Master Calendar build (migrations 0010-0011)
# Hempire palette: brown #3F1101  green #015807  yellow #FDF31C
# =====================================================================
# What it does:
#   1. Stops dev servers if they're running on 4000 / 5173
#   2. Copies router.CLEAN.tsx  -> router.tsx   (frontend route wiring)
#   3. Copies server.CLEAN.ts   -> server.ts    (backend route mounts)
#   4. Appends Prisma model snippets to schema.prisma if not present
#   5. Runs the SQL migrations (0010_billing + 0011_calendar) via psql
#   6. Runs `npx prisma generate`
#   7. Restarts API + Web
# =====================================================================
# Usage:   pwsh -File scripts\apply-billing-calendar.ps1
# Pre-req: DATABASE_URL set in apps/api/.env, psql in PATH (or use Supabase SQL editor manually)
# =====================================================================

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path "$PSScriptRoot\..").Path
Write-Host "==> Project root: $root" -ForegroundColor Cyan

# ---------- 1. Stop dev servers ----------
Write-Host "`n[1/7] Stopping dev servers (ports 4000, 5173)…" -ForegroundColor Yellow
foreach ($port in 4000, 5173) {
    $pids = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess | Sort-Object -Unique
    foreach ($p in $pids) {
        if ($p) {
            Write-Host "  killing PID $p on :$port"
            try { Stop-Process -Id $p -Force -ErrorAction Stop } catch {}
        }
    }
}

# ---------- 2. Apply router.CLEAN.tsx ----------
Write-Host "`n[2/7] Applying router.CLEAN.tsx -> router.tsx" -ForegroundColor Yellow
$routerClean = Join-Path $root 'apps\web\src\router.CLEAN.tsx'
$routerLive  = Join-Path $root 'apps\web\src\router.tsx'
if (-not (Test-Path $routerClean)) { throw "Missing $routerClean" }
Copy-Item $routerClean $routerLive -Force
Write-Host "  ✓ router.tsx updated ($((Get-Item $routerLive).Length) bytes)"

# ---------- 3. Apply server.CLEAN.ts ----------
Write-Host "`n[3/7] Applying server.CLEAN.ts -> server.ts" -ForegroundColor Yellow
$serverClean = Join-Path $root 'apps\api\src\server.CLEAN.ts'
$serverLive  = Join-Path $root 'apps\api\src\server.ts'
if (-not (Test-Path $serverClean)) { throw "Missing $serverClean" }
Copy-Item $serverClean $serverLive -Force
Write-Host "  ✓ server.ts updated"

# ---------- 4. Re-apply Prisma snippets (self-healing) ----------
# This step is IDEMPOTENT — it truncates from our marker comment to EOF,
# then re-appends the current billing_calendar_models.txt. That way an
# earlier bad append (with the duplicate `Invoice` model) gets cleaned up
# automatically and we end up with the canonical ar_-prefixed models.
Write-Host "`n[4/7] Refreshing Prisma billing/calendar snippet in schema.prisma…" -ForegroundColor Yellow
$schemaPath = Join-Path $root 'prisma\schema.prisma'
$snippetsPath = Join-Path $root 'prisma\billing_calendar_models.txt'
$marker = '// ===== Unified Billing + Master Calendar (0010-0011) ====='
if (-not (Test-Path $schemaPath)) {
    Write-Warning "schema.prisma not found at $schemaPath — skipping snippet refresh"
} elseif (-not (Test-Path $snippetsPath)) {
    Write-Warning "snippet file not found at $snippetsPath — skipping snippet refresh"
} else {
    # Back up the schema before mutating it
    $backup = "$schemaPath.bak-$(Get-Date -Format 'yyyyMMddHHmmss')"
    Copy-Item $schemaPath $backup
    Write-Host "  · backup written -> $backup"

    $lines = Get-Content $schemaPath
    # Find the marker (first occurrence) and truncate everything from it onward
    $markerIdx = -1
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -like "*Unified Billing + Master Calendar*") { $markerIdx = $i; break }
    }
    if ($markerIdx -ge 0) {
        Write-Host "  · truncating prior append (from line $($markerIdx+1) onward)"
        $kept = $lines[0..($markerIdx - 1)]
        Set-Content -Path $schemaPath -Value $kept -Encoding UTF8
    } else {
        Write-Host "  · no prior append found — first install"
    }
    # Re-append the canonical snippet
    $snippet = Get-Content $snippetsPath -Raw
    Add-Content -Path $schemaPath -Value "`n`n$marker`n$snippet"
    Write-Host "  ✓ schema.prisma now ends with the corrected ar_ models"
}

# ---------- 5. Run SQL migrations ----------
Write-Host "`n[5/7] Running SQL migrations 0010 + 0011…" -ForegroundColor Yellow
$envFile = Join-Path $root 'apps\api\.env'
$dbUrl = $null
if (Test-Path $envFile) {
    $line = Select-String -Path $envFile -Pattern '^DATABASE_URL=' | Select-Object -First 1
    if ($line) {
        $dbUrl = $line.ToString().Substring($line.ToString().IndexOf('=') + 1).Trim('"').Trim("'")
    }
}

$mig10 = Join-Path $root 'supabase\migrations\0010_billing.sql'
$mig11 = Join-Path $root 'supabase\migrations\0011_calendar.sql'

if ($dbUrl -and (Get-Command psql -ErrorAction SilentlyContinue)) {
    foreach ($m in $mig10, $mig11) {
        Write-Host "  psql < $([System.IO.Path]::GetFileName($m))"
        & psql $dbUrl -v ON_ERROR_STOP=1 -f $m
        if ($LASTEXITCODE -ne 0) { throw "Migration $m failed" }
    }
} else {
    Write-Warning "psql not found OR DATABASE_URL unset — run these in Supabase SQL editor manually:"
    Write-Host "    $mig10"
    Write-Host "    $mig11"
}

# ---------- 6. Prisma generate ----------
Write-Host "`n[6/7] Running 'npx prisma generate'…" -ForegroundColor Yellow
$schemaArg = "--schema=$schemaPath"
Push-Location $root
try {
    & npx prisma generate $schemaArg
    if ($LASTEXITCODE -ne 0) { Write-Warning "prisma generate failed — fix and re-run manually" }
} finally { Pop-Location }

# ---------- 7. Restart dev servers ----------
Write-Host "`n[7/7] Starting dev servers…" -ForegroundColor Yellow
$apiDir = Join-Path $root 'apps\api'
$webDir = Join-Path $root 'apps\web'
# IMPORTANT: use -WorkingDirectory rather than inline `cd "..."` — Start-Process -ArgumentList
# mangles quoted paths containing spaces (like "3Wi Pty Ltd"), so the cd inside the spawned
# window fails with "positional parameter cannot be found that accepts argument 'Pty'".
Start-Process -FilePath 'pwsh' -WorkingDirectory $apiDir -ArgumentList '-NoExit', '-Command', 'npm run dev'
Start-Process -FilePath 'pwsh' -WorkingDirectory $webDir -ArgumentList '-NoExit', '-Command', 'npm run dev'

Write-Host "`n=====================================================================" -ForegroundColor Green
Write-Host " ✓ Apply complete." -ForegroundColor Green
Write-Host "   API:  http://localhost:4000/health" -ForegroundColor Green
Write-Host "   Web:  http://localhost:5173/cc/billing" -ForegroundColor Green
Write-Host "         http://localhost:5173/cc/calendar" -ForegroundColor Green
Write-Host "=====================================================================`n" -ForegroundColor Green
