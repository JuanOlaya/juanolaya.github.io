
Add-Type -AssemblyName System.Drawing

$inputPath = "$PSScriptRoot\app_icon_dark_mode.png"

if (-not (Test-Path $inputPath)) {
    Write-Error "File not found: $inputPath"
    exit 1
}

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$w = $bmp.Width
$h = $bmp.Height

$minX = $w; $maxX = 0
$minY = $h; $maxY = 0
$found = $false

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.A -gt 0) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
            $found = $true
        }
    }
}

$bmp.Dispose()

if (-not $found) {
    Write-Host "Image is fully transparent"
} else {
    Write-Host "Image Size: $w x $h"
    Write-Host "Content Bounds: X[$minX..$maxX] Y[$minY..$maxY]"
    Write-Host "Margins: Left=$minX, Right=$($w - 1 - $maxX), Top=$minY, Bottom=$($h - 1 - $maxY)"
}
