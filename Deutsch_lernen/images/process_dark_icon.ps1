
Add-Type -AssemblyName System.Drawing

$inputPath = "$PSScriptRoot\app_icon_temp.png"
$outputPath = "$PSScriptRoot\app_icon_dark_mode.png"

# Load image
$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)

# Create new bitmap with transparency
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($newBmp)
$g.DrawImage($bmp, 0, 0)

# Flood fill transparency from corners (black/white background removal)
# Since the generator might produce a black or checkboard background, we need to be careful.
# Assuming standard generator output might have a solid background or just alpha.
# Let's check the top-left pixel.

$tl = $newBmp.GetPixel(0, 0)
$targetColor = $tl

# Re-use flood fill logic from previous script, adapted for variable
$tolerance = 30
$width = $newBmp.Width
$height = $newBmp.Height

# Queue-based flood fill
$queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()
$queue.Enqueue([System.Drawing.Point]::new(0, 0))
$queue.Enqueue([System.Drawing.Point]::new($width - 1, 0))
$queue.Enqueue([System.Drawing.Point]::new(0, $height - 1))
$queue.Enqueue([System.Drawing.Point]::new($width - 1, $height - 1))

$visited = New-Object 'bool[,]' $width, $height

while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    if ($pt.X -lt 0 -or $pt.X -ge $width -or $pt.Y -lt 0 -or $pt.Y -ge $height) { continue }
    if ($visited[$pt.X, $pt.Y]) { continue }
    
    $c = $newBmp.GetPixel($pt.X, $pt.Y)
    
    # Check similarity to target background color
    $diff = [Math]::Abs($c.R - $targetColor.R) + [Math]::Abs($c.G - $targetColor.G) + [Math]::Abs($c.B - $targetColor.B)
    
    if ($diff -lt ($tolerance * 3)) {
        $newBmp.SetPixel($pt.X, $pt.Y, [System.Drawing.Color]::Transparent)
        $visited[$pt.X, $pt.Y] = $true
        
        $queue.Enqueue([System.Drawing.Point]::new($pt.X + 1, $pt.Y))
        $queue.Enqueue([System.Drawing.Point]::new($pt.X - 1, $pt.Y))
        $queue.Enqueue([System.Drawing.Point]::new($pt.X, $pt.Y + 1))
        $queue.Enqueue([System.Drawing.Point]::new($pt.X, $pt.Y - 1))
    }
}

$bmp.Dispose()
$g.Dispose()

# Now Crop (Trim) logic integrated
$minX = $width
$minY = $height
$maxX = 0
$maxY = 0
$found = $false

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $pixel = $newBmp.GetPixel($x, $y)
        if ($pixel.A -gt 0) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
            $found = $true
        }
    }
}

if ($found) {
    $cW = $maxX - $minX + 1
    $cH = $maxY - $minY + 1
    $maxDim = [Math]::Max($cW, $cH)
    
    $finalBmp = New-Object System.Drawing.Bitmap($maxDim, $maxDim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gF = [System.Drawing.Graphics]::FromImage($finalBmp)
    
    $destX = [Math]::Floor(($maxDim - $cW) / 2)
    $destY = [Math]::Floor(($maxDim - $cH) / 2)
    
    $srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $cW, $cH)
    $destRect = New-Object System.Drawing.Rectangle($destX, $destY, $cW, $cH)
    
    $gF.DrawImage($newBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $finalBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $finalBmp.Dispose()
    $gF.Dispose()
    Write-Host "Processed Dark Mode Icon: BG Removed + Cropped to $maxDim x $maxDim"
} else {
    Write-Error "Image was empty after BG removal"
}

$newBmp.Dispose()
