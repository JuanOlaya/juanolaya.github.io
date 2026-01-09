
Add-Type -AssemblyName System.Drawing

$path = "$PSScriptRoot\app_icon.png"
if (-not (Test-Path $path)) {
    Write-Error "File not found"
    exit 1
}

$bmp = [System.Drawing.Bitmap]::FromFile($path)
$pixel = $bmp.GetPixel(0, 0)
$bmp.Dispose()

Write-Host "Top-Left Pixel: A=$($pixel.A) R=$($pixel.R) G=$($pixel.G) B=$($pixel.B)"

if ($pixel.A -eq 0) {
    Write-Host "Result: TRANSPARENT"
} else {
    Write-Host "Result: NOT TRANSPARENT (Background detected)"
}
