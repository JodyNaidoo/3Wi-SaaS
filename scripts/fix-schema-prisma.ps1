# =====================================================================
# fix-schema-prisma.ps1
# Recovers schema.prisma after the failed apply-billing-calendar run.
# =====================================================================
# What this fixes (two independent problems in one shot):
#
#  1. The old broken billing snippet appended to schema.prisma during
#     the first failed run (had a duplicate `model Invoice`).
#  2. A pre-existing latent bug from migration 0008: OfftakerAttachment
#     references model `OfftakerSubmission` but that model was never
#     added to schema.prisma when the SQL migration was created.
#     Prisma generate has been silently broken on this schema since
#     May 30 — this is the first time we noticed because we re-ran
#     prisma generate from scratch.
#
# Sequence:
#   1. Restore schema.prisma from latest .bak
#   2. Truncate from '// ===== Unified Billing' marker to EOF
#   3. Append missing OfftakerSubmission model + OfftakerStatus enum
#   4. Append corrected ar_ snippet from prisma\billing_calendar_models.txt
#   5. Run npx prisma generate
# =====================================================================
# Usage:   pwsh -File scripts\fix-schema-prisma.ps1
# =====================================================================

$ErrorActionPreference = 'Stop'
$root        = (Resolve-Path "$PSScriptRoot\..").Path
$schemaPath  = Join-Path $root 'prisma\schema.prisma'
$snippetPath = Join-Path $root 'prisma\billing_calendar_models.txt'

Write-Host "==> Project root: $root" -ForegroundColor Cyan

# ---------- 1. Restore from the most recent backup ----------
$backup = Get-ChildItem -Path (Join-Path $root 'prisma') -Filter 'schema.prisma.bak-*' |
          Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $backup) {
    Write-Warning "No .bak file found — working with current schema.prisma in place."
} else {
    Write-Host "`n[1/5] Restoring schema.prisma from $($backup.Name)" -ForegroundColor Yellow
    Copy-Item $backup.FullName $schemaPath -Force
    Write-Host "      ✓ restored ($((Get-Item $schemaPath).Length) bytes)"
}

# ---------- 2. Truncate the old broken append ----------
Write-Host "`n[2/5] Removing prior billing/calendar append from schema.prisma" -ForegroundColor Yellow
$lines = Get-Content $schemaPath
$markerIdx = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -like "*Unified Billing + Master Calendar*") { $markerIdx = $i; break }
}
if ($markerIdx -ge 0) {
    $kept = $lines[0..($markerIdx - 1)]
    Set-Content -Path $schemaPath -Value $kept -Encoding UTF8
    Write-Host "      ✓ truncated from line $($markerIdx + 1) onward"
} else {
    Write-Host "      · no prior append found — nothing to truncate"
}

# ---------- 3. Append the missing OfftakerSubmission model + enum ----------
Write-Host "`n[3/5] Appending OfftakerSubmission Prisma model (fixing 0008 bug)" -ForegroundColor Yellow
$offtakerModel = @'

// ===== Recovery: missing OfftakerSubmission model for migration 0008 =====
enum OfftakerStatus {
  draft
  submitted
  screening
  tna
  verification
  recommendation
  approved
  approved_conditional
  declined
  deferred
  withdrawn
}

model OfftakerSubmission {
  id                      String          @id @default(uuid()) @db.Uuid
  tenantId                String          @map("tenant_id") @db.Uuid
  legalName               String          @map("legal_name")
  tradingName             String?         @map("trading_name")
  registrationNumber      String?         @map("registration_number")
  legalEntityType         String?         @map("legal_entity_type")
  primaryContactName      String?         @map("primary_contact_name")
  primaryContactEmail     String          @map("primary_contact_email")
  primaryContactPhone     String?         @map("primary_contact_phone")
  bbbeeLevel              String?         @map("bbbee_level")
  offtakerCategory        String?         @map("offtaker_category")
  targetDistricts         String[]        @map("target_districts")
  productCategories       String[]        @map("product_categories")
  preferredFarmerTypes    String[]        @map("preferred_farmer_types")
  totalHectaresCapacity   Decimal?        @map("total_hectares_capacity") @db.Decimal
  estimatedFarmers        Int?            @map("estimated_farmers")
  formPayload             Json            @map("form_payload")
  status                  OfftakerStatus  @default(submitted)
  screeningScorecard      Json?           @map("screening_scorecard")
  tnaSummary              String?         @map("tna_summary")
  verificationNotes       String?         @map("verification_notes")
  recommendation          String?
  recommendationNotes     String?         @map("recommendation_notes")
  conditions              String?
  reviewerName            String?         @map("reviewer_name")
  reviewerDate            DateTime?       @map("reviewer_date") @db.Date
  programmeManagerName    String?         @map("programme_manager_name")
  programmeManagerDate    DateTime?       @map("programme_manager_date") @db.Date
  sectorHeadName          String?         @map("sector_head_name")
  sectorHeadDate          DateTime?       @map("sector_head_date") @db.Date
  ipmExecutiveName        String?         @map("ipm_executive_name")
  ipmExecutiveDate        DateTime?       @map("ipm_executive_date") @db.Date
  ceoName                 String?         @map("ceo_name")
  ceoDate                 DateTime?       @map("ceo_date") @db.Date
  submissionRef           String?         @map("submission_ref")
  submittedAt             DateTime        @default(now()) @map("submitted_at") @db.Timestamptz(6)
  decidedAt               DateTime?       @map("decided_at") @db.Timestamptz(6)
  createdByUserId         String?         @map("created_by_user_id") @db.Uuid
  createdAt               DateTime        @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt               DateTime        @default(now()) @map("updated_at") @db.Timestamptz(6)

  attachments             OfftakerAttachment[]

  @@index([tenantId, status])
  @@index([tenantId, offtakerCategory])
  @@index([tenantId, bbbeeLevel])
  @@map("offtaker_submissions")
}
'@
Add-Content -Path $schemaPath -Value $offtakerModel -Encoding UTF8
Write-Host "      ✓ OfftakerSubmission model + OfftakerStatus enum added"

# ---------- 4. Append the corrected ar_ snippet ----------
Write-Host "`n[4/5] Appending the corrected ar_-prefixed billing snippet" -ForegroundColor Yellow
if (-not (Test-Path $snippetPath)) {
    throw "Missing snippet file: $snippetPath"
}
$snippet = Get-Content $snippetPath -Raw
Add-Content -Path $schemaPath -Value "`n`n// ===== Unified Billing + Master Calendar (0010-0011) =====`n$snippet" -Encoding UTF8
Write-Host "      ✓ snippet appended ($($snippet.Length) chars)"

# ---------- 5. Run prisma generate ----------
Write-Host "`n[5/5] Running 'npx prisma generate'" -ForegroundColor Yellow
Push-Location $root
try {
    & npx prisma generate "--schema=$schemaPath"
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "prisma generate exited with code $LASTEXITCODE — investigate the error above"
    } else {
        Write-Host "      ✓ Prisma client regenerated"
    }
} finally { Pop-Location }

Write-Host "`n====================================================================="  -ForegroundColor Green
Write-Host " ✓ Schema repair complete."                                                -ForegroundColor Green
Write-Host "   Next: re-run apply-billing-calendar.ps1 (skip step 4 — already done)" -ForegroundColor Green
Write-Host "   or just start the dev servers manually:"                                -ForegroundColor Green
Write-Host "     Start-Process pwsh -WorkingDirectory '$root\apps\api' -ArgumentList '-NoExit','-Command','npm run dev'" -ForegroundColor Green
Write-Host "     Start-Process pwsh -WorkingDirectory '$root\apps\web' -ArgumentList '-NoExit','-Command','npm run dev'" -ForegroundColor Green
Write-Host "====================================================================="    -ForegroundColor Green
