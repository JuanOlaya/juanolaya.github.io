
Add-Type -AssemblyName System.Drawing

$inputPath = "$PSScriptRoot\app_icon.png"
$outputPath = "$PSScriptRoot\app_icon.png"

if (-not (Test-Path $inputPath)) {
    Write-Error "File not found: $inputPath"
    exit 1
}

$bitmap = [System.Drawing.Bitmap]::FromFile($inputPath)
# Create a new bitmap to avoid locking issues if saving to same file
$newBitmap = New-Object System.Drawing.Bitmap($bitmap.Width, $bitmap.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($newBitmap)
$graphics.DrawImage($bitmap, 0, 0)
$bitmap.Dispose() # Release original file lock

$width = $newBitmap.Width
$height = $newBitmap.Height
$bgColor = $newBitmap.GetPixel(0, 0)

# Flood fill algorithm
$queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()
$queue.Enqueue([System.Drawing.Point]::new(0, 0))

# Also enqueue other corners just in case
$queue.Enqueue([System.Drawing.Point]::new($width - 1, 0))
$queue.Enqueue([System.Drawing.Point]::new(0, $height - 1))
$queue.Enqueue([System.Drawing.Point]::new($width - 1, $height - 1))

# Keep track of visited to avoid loops
$visited = New-Object 'bool[,]' $width, $height

$tolerance = 30

function IsSimilar($c1, $c2) {
    if ($c1.A -eq 0 -and $c2.A -eq 0) { return $true }
    $diff = [Math]::Abs($c1.R - $c2.R) + [Math]::Abs($c1.G - $c2.G) + [Math]::Abs($c1.B - $c2.B)
    return $diff -lt ($tolerance * 3)
}

# Pre-mark corners as visited/queued
# Processing
while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    
    if ($pt.X -lt 0 -or $pt.X -ge $width -or $pt.Y -lt 0 -or $pt.Y -ge $height) { continue }
    if ($visited[$pt.X, $pt.Y]) { continue }
    
    $currentColor = $newBitmap.GetPixel($pt.X, $pt.Y)
    
    if (IsSimilar -c1 $currentColor -c2 $bgColor) {
        $newBitmap.SetPixel($pt.X, $pt.Y, [System.Drawing.Color]::Transparent)
        $visited[$pt.X, $pt.Y] = $true
        
        $queue.Enqueue([System.Drawing.Point]::new($pt.X + 1, $pt.Y))
        $queue.Enqueue([System.Drawing.Point]::new($pt.X - 1, $pt.Y))
        $queue.Enqueue([System.Drawing.Point]::new($pt.X, $pt.Y + 1))
        $queue.Enqueue([System.Drawing.Point]::new($pt.X, $pt.Y - 1))
    }
}

$newBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$newBitmap.Dispose()
$graphics.Dispose()

Write-Host "Background removed and saved to $outputPath"
