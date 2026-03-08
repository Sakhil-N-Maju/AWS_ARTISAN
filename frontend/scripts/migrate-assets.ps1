# Asset Migration Script
# Migrates static assets from frontend-new to frontend
# Preserves existing assets (no overwrite)

$ErrorActionPreference = "Stop"

$sourceDir = "frontend-new/public"
$destDir = "frontend/public"

Write-Host "Starting asset migration..." -ForegroundColor Cyan

# Create destination directory if it doesn't exist
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Write-Host "Created directory: $destDir" -ForegroundColor Green
}

# Create fonts directory
$fontsDest = "$destDir/fonts"
if (-not (Test-Path $fontsDest)) {
    New-Item -ItemType Directory -Path $fontsDest -Force | Out-Null
    Write-Host "Created directory: $fontsDest" -ForegroundColor Green
}

# Create images directory
$imagesDest = "$destDir/images"
if (-not (Test-Path $imagesDest)) {
    New-Item -ItemType Directory -Path $imagesDest -Force | Out-Null
    Write-Host "Created directory: $imagesDest" -ForegroundColor Green
}

# Function to copy file if it doesn't exist
function Copy-IfNotExists {
    param(
        [string]$Source,
        [string]$Destination
    )
    
    if (Test-Path $Source) {
        if (-not (Test-Path $Destination)) {
            Copy-Item -Path $Source -Destination $Destination -Force
            Write-Host "  Copied: $(Split-Path $Source -Leaf)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  Skipped (exists): $(Split-Path $Source -Leaf)" -ForegroundColor Yellow
            return $false
        }
    }
    return $false
}

# Copy fonts
Write-Host "`nCopying fonts..." -ForegroundColor Cyan
$fontsSource = "$sourceDir/fonts"
$fontsCopied = 0
if (Test-Path $fontsSource) {
    Get-ChildItem -Path $fontsSource -File | ForEach-Object {
        if (Copy-IfNotExists -Source $_.FullName -Destination "$fontsDest/$($_.Name)") {
            $fontsCopied++
        }
    }
}
Write-Host "Fonts copied: $fontsCopied" -ForegroundColor Cyan

# Copy images from images subdirectory
Write-Host "`nCopying images from images/ subdirectory..." -ForegroundColor Cyan
$imagesSource = "$sourceDir/images"
$imagesCopied = 0
if (Test-Path $imagesSource) {
    Get-ChildItem -Path $imagesSource -File | ForEach-Object {
        if (Copy-IfNotExists -Source $_.FullName -Destination "$imagesDest/$($_.Name)") {
            $imagesCopied++
        }
    }
}
Write-Host "Images copied from images/: $imagesCopied" -ForegroundColor Cyan

# Copy all other files from public root (images, icons, etc.)
Write-Host "`nCopying files from public root..." -ForegroundColor Cyan
$rootFilesCopied = 0
Get-ChildItem -Path $sourceDir -File | ForEach-Object {
    if (Copy-IfNotExists -Source $_.FullName -Destination "$destDir/$($_.Name)") {
        $rootFilesCopied++
    }
}
Write-Host "Root files copied: $rootFilesCopied" -ForegroundColor Cyan

Write-Host "`nAsset migration complete!" -ForegroundColor Green
Write-Host "Total files copied: $($fontsCopied + $imagesCopied + $rootFilesCopied)" -ForegroundColor Green
