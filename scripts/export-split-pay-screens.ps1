# Exports every Split Pay concept screen as a 3x PNG (1170x2532).
# Usage (dev server running on :3000):  powershell -ExecutionPolicy Bypass -File scripts\export-split-pay-screens.ps1
param(
  [string]$Base = "http://localhost:3000",
  [string]$Out = "docs\split-pay\screens"
)

$ids = "c0-today","s1-seats","s2-split","s3-status","s4-confirmed","f1-invite","f2-upi","f3-ticket","e1-expiring","e2-expired","e3-failed","e4-dropout","e5-pending","e6-offer","e7-late-link","e8-show-soon","e9-edit-group"
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Google\Chrome\Application\chrome.exe" }

New-Item -ItemType Directory -Force $Out | Out-Null
$outAbs = (Resolve-Path $Out).Path
$profileDir = Join-Path $env:TEMP "splitpay-export-profile"

$i = 0
foreach ($id in $ids) {
  $i++
  $url = "$Base/split-pay/screens/$id"
  try { Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 120 | Out-Null } catch { Write-Host "warm-up failed for $id" }
  $file = Join-Path $outAbs ("{0:D2}-{1}.png" -f $i, $id)
  & $edge --headless=new --disable-gpu --hide-scrollbars --no-first-run --user-data-dir="$profileDir" `
    --force-device-scale-factor=3 --window-size=390,844 --virtual-time-budget=6000 `
    --screenshot="$file" $url 2>$null | Out-Null
  if (Test-Path $file) { "{0,-14} {1,6} KB" -f $id, [int]((Get-Item $file).Length / 1KB) } else { "$id FAILED" }
}
