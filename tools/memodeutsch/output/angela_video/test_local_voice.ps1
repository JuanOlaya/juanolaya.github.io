# Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): $SiteDir is the data folder this script used to live in.
$SiteDir = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../../Deutsch_lernen/output/angela_video'))
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Katja')
$synth.Rate = -1
$synth.SetOutputToWaveFile((Join-Path $SiteDir 'prueba_katja.wav'))
$synth.Speak('Guten Tag. Ich möchte mich kurz vorstellen.')
$synth.Dispose()
Get-Item (Join-Path $SiteDir 'prueba_katja.wav') | Select-Object Name,Length
