# Exports the Split Pay thumbnail at 4:3 (1600x1200) and 16:9 (1920x1080), rendered at 2x.
# Usage (dev server running on :3000):  powershell -ExecutionPolicy Bypass -File scripts\export-split-pay-thumbnail.ps1
param([string]$Base = "http://localhost:3000", [string]$Out = "docs\split-pay")

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Google\Chrome\Application\chrome.exe" }
$outAbs = (Resolve-Path $Out).Path
$profileDir = Join-Path $env:TEMP "splitpay-export-profile"

foreach ($size in @(@(1600, 1200, "4x3"), @(1920, 1080, "16x9"))) {
  $w, $h, $tag = $size
  $url = "$Base/split-pay/thumbnail?w=$w&h=$h"
  try { Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 120 | Out-Null } catch {}
  $file = Join-Path $outAbs "split-pay-thumbnail-$tag.png"
  & $edge --headless=new --disable-gpu --hide-scrollbars --no-first-run --user-data-dir="$profileDir" `
    --force-device-scale-factor=2 --window-size="$w,$h" --virtual-time-budget=6000 `
    --screenshot="$file" $url 2>$null | Out-Null
  if (Test-Path $file) { "{0,-34} {1,6} KB" -f (Split-Path $file -Leaf), [int]((Get-Item $file).Length / 1KB) } else { "$tag FAILED" }
}
