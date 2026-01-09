
Add-Type -AssemblyName System.Drawing

$inputPath = "$PSScriptRoot\app_icon.png"
$outputPath = "$PSScriptRoot\app_icon.png"

if (-not (Test-Path $inputPath)) {
    Write-Error "File not found: $inputPath"
    exit 1
}

$startBitmap = [System.Drawing.Bitmap]::FromFile($inputPath)
# Clone to avoid file lock
$bitmap = New-Object System.Drawing.Bitmap($startBitmap)
$startBitmap.Dispose()

$width = $bitmap.Width
$height = $bitmap.Height

$minX = $width
$minY = $height
$maxX = 0
$maxY = 0
$found = $false

# Scan for bounding box of non-transparent pixels
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $pixel = $bitmap.GetPixel($x, $y)
        if ($pixel.A -gt 0) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
            $found = $true
        }
    }
}

if (-not $found) {
    Write-Error "Image is completely transparent."
    exit 1
}

$contentWidth = $maxX - $minX + 1
$contentHeight = $maxY - $minY + 1
$maxDim = [Math]::Max($contentWidth, $contentHeight)

# Create new square bitmap based on max dimension (tight fit)
$newBitmap = New-Object System.Drawing.Bitmap($maxDim, $maxDim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($newBitmap)

# Calculate position to center the content
$destX = [Math]::Floor(($maxDim - $contentWidth) / 2)
$destY = [Math]::Floor(($maxDim - $contentHeight) / 2)

# Verify source rect is within bounds
if ($contentWidth -gt 0 -and $contentHeight -gt 0) {
    $srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $contentWidth, $contentHeight)
    $destRect = New-Object System.Drawing.Rectangle($destX, $destY, $contentWidth, $contentHeight)
    
    $graphics.DrawImage($bitmap, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
}

$newBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$newBitmap.Dispose()
$bitmap.Dispose()
$graphics.Dispose()

Write-Host "Icon cropped to bounding box: RECT[$minX, $minY, $maxX, $maxY] -> NEW SIZE[$maxDim x $maxDim]"
