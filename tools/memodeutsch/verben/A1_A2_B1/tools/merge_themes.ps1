$groupsPath = "c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\groups"
$themesPath = "c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\themes"

Get-ChildItem -Path $groupsPath -Recurse -Filter "*_group_*.json" | ForEach-Object {
    $groupFile = $_
    $content = Get-Content $groupFile.FullName -Raw | ConvertFrom-Json
    
    # Extract Level and Group Number from filename or content
    # Filename format: Level_group_Number.json (e.g., A1_1_group_1.json)
    if ($groupFile.Name -match "^([A-Z0-9_]+)_group_(\d+)\.json$") {
        $levelStr = $matches[1] # e.g., A1_1
        $groupNum = $matches[2] # e.g., 1
        
        # Construct theme filename: Level_GroupNum_theme.json (e.g., A1_1_1_theme.json)
        $themeFileName = "${levelStr}_${groupNum}_theme.json"
        $themeFilePath = Join-Path $themesPath $themeFileName
        
        if (Test-Path $themeFilePath) {
            Write-Host "Merging $themeFileName into $($groupFile.Name)..."
            $themeContent = Get-Content $themeFilePath -Raw | ConvertFrom-Json
            
            # Merge fields
            $content | Add-Member -MemberType NoteProperty -Name "shortName" -Value $themeContent.shortName -Force
            $content | Add-Member -MemberType NoteProperty -Name "germanName" -Value $themeContent.germanName -Force
            $content | Add-Member -MemberType NoteProperty -Name "spanishName" -Value $themeContent.spanishName -Force
            $content | Add-Member -MemberType NoteProperty -Name "germanDescription" -Value $themeContent.germanDescription -Force
            $content | Add-Member -MemberType NoteProperty -Name "spanishDescription" -Value $themeContent.spanishDescription -Force
            $content | Add-Member -MemberType NoteProperty -Name "b1Rating" -Value $themeContent.b1Rating -Force
            $content | Add-Member -MemberType NoteProperty -Name "examContext" -Value $themeContent.examContext -Force
            $content | Add-Member -MemberType NoteProperty -Name "examContextEs" -Value $themeContent.examContextEs -Force
            
            # Save updated content (Forcing UTF8 without BOM)
            $jsonContent = $content | ConvertTo-Json -Depth 10
            $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
            [System.IO.File]::WriteAllText($groupFile.FullName, $jsonContent, $utf8NoBom)
        } else {
            Write-Warning "Theme file not found for $($groupFile.Name): $themeFilePath"
        }
    }
}
Write-Host "Merge complete."
