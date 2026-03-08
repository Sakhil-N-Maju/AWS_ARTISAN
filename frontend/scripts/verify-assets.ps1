# Asset Verification Script
# Verifies that all migrated assets are accessible

$ErrorActionPreference = "Stop"

$publicDir = "frontend/public"

Write-Host "Verifying asset migration..." -ForegroundColor Cyan

# Check if public directory exists
if (-not (Test-Path $publicDir)) {
    Write-Host "ERROR: Public directory not found!" -ForegroundColor Red
    exit 1
}

# Count files in each directory
$fontsCount = (Get-ChildItem -Path "$publicDir/fonts" -File -ErrorAction SilentlyContinue).Count
$imagesCount = (Get-ChildItem -Path "$publicDir/images" -File -ErrorAction SilentlyContinue).Count
$rootCount = (Get-ChildItem -Path $publicDir -File -ErrorAction SilentlyContinue).Count

Write-Host "`nAsset counts:" -ForegroundColor Cyan
Write-Host "  Fonts: $fontsCount" -ForegroundColor Green
Write-Host "  Images (subdirectory): $imagesCount" -ForegroundColor Green
Write-Host "  Root files: $rootCount" -ForegroundColor Green

# Verify critical assets exist
$criticalAssets = @(
    'icon.svg',
    'placeholder.svg',
    'hand-woven-saree.jpg',
    'kundan-necklace.jpg',
    'blue-pottery-bowl.jpg',
    'brass-lamp.jpg',
    'pashmina-shawl.jpg',
    'leather-mojari.jpg',
    'indian-handmade-textiles-fabric.jpg',
    'traditional-indian-pottery-ceramic.jpg',
    'indian-jewelry-gold-traditional.jpg',
    'wooden-handicraft-indian-carving.jpg',
    'indian-hand-painted-art.jpg',
    'professional-profile.jpg',
    'potter-making-clay-pots.jpg',
    'indian-woman-weaving.jpg',
    'carved-wood-art.jpg',
    'traditional-jewelry.png',
    'brass-copper-metalwork.jpg',
    'images/background.png'
)

Write-Host "`nVerifying critical assets..." -ForegroundColor Cyan
$missingAssets = @()

foreach ($asset in $criticalAssets) {
    $path = Join-Path $publicDir $asset
    if (Test-Path $path) {
        Write-Host "  OK: $asset" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $asset" -ForegroundColor Red
        $missingAssets += $asset
    }
}

# Verify fonts
$criticalFonts = @(
    'fonts/Inter-VariableFont_opsz,wght.ttf',
    'fonts/Lora-VariableFont_wght.ttf',
    'fonts/Nunito-VariableFont_wght.ttf'
)

Write-Host "`nVerifying critical fonts..." -ForegroundColor Cyan
foreach ($font in $criticalFonts) {
    $path = Join-Path $publicDir $font
    if (Test-Path $path) {
        Write-Host "  OK: $font" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $font" -ForegroundColor Red
        $missingAssets += $font
    }
}

# Summary
Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Cyan
if ($missingAssets.Count -eq 0) {
    Write-Host "All critical assets verified successfully!" -ForegroundColor Green
    Write-Host "Total assets: $($fontsCount + $imagesCount + $rootCount)" -ForegroundColor Green
    exit 0
} else {
    Write-Host "$($missingAssets.Count) critical assets are missing!" -ForegroundColor Red
    Write-Host "Missing assets:" -ForegroundColor Red
    foreach ($asset in $missingAssets) {
        Write-Host "  - $asset" -ForegroundColor Red
    }
    exit 1
}
