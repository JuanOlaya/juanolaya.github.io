param(
    [string]$IndexPath = "C:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\verbs_index.json",
    [string]$Timestamp = ""
)

if (-not (Test-Path $IndexPath)) {
    throw "verbs_index.json not found: $IndexPath"
}

if ([string]::IsNullOrWhiteSpace($Timestamp)) {
    $Timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.000Z")
}

$content = Get-Content $IndexPath -Raw -Encoding UTF8

if ($content -notmatch '"lastUpdated"\s*:') {
    throw "lastUpdated field not found in $IndexPath"
}

$updatedContent = [regex]::Replace(
    $content,
    '"lastUpdated"\s*:\s*"[^"]+"',
    ('"lastUpdated": "{0}"' -f $Timestamp),
    1
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($IndexPath, $updatedContent, $utf8NoBom)
Write-Host "Updated lastUpdated to $Timestamp"
