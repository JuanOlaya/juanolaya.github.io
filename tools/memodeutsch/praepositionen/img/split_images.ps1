
# Load System.Drawing assembly
Add-Type -AssemblyName System.Drawing

# Path to the source image
$sourcePath = "c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\praepositionen\img\wechsel_praepositionen.png"
$destDir = "c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\praepositionen\img"

# Verify source exists
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source image not found at $sourcePath"
    exit
}

# Load the image
$image = [System.Drawing.Bitmap]::FromFile($sourcePath)

# Grid dimensions (3x3)
$rows = 3
$cols = 3
$width = [int]($image.Width / $cols)
$height = [int]($image.Height / $rows)

# Names corresponding to the grid order (assuming left-to-right, top-to-bottom)
# Based on the typical order of recitation or alphabet, but looking at the prompt:
# an, auf, hinter, in, neben, über, unter, vor, zwischen
$names = @("an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen")

$counter = 0

for ($r = 0; $r -lt $rows; $r++) {
    for ($c = 0; $c -lt $cols; $c++) {
        if ($counter -ge $names.Count) { break }
        
        $name = $names[$counter]
        $rect = New-Object System.Drawing.Rectangle ($c * $width), ($r * $height), $width, $height
        $cropped = $image.Clone($rect, $image.PixelFormat)
        
        $destPath = Join-Path $destDir "$name.png"
        $cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        Write-Host "Saved $name.png"
        $cropped.Dispose()
        $counter++
    }
}

$image.Dispose()
Write-Host "Done splitting images."
