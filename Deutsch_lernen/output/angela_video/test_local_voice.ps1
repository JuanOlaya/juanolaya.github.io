$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Katja')
$synth.Rate = -1
$synth.SetOutputToWaveFile((Join-Path $PSScriptRoot 'prueba_katja.wav'))
$synth.Speak('Guten Tag. Ich möchte mich kurz vorstellen.')
$synth.Dispose()
Get-Item (Join-Path $PSScriptRoot 'prueba_katja.wav') | Select-Object Name,Length
