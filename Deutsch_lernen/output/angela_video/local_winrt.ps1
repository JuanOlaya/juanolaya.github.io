$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.SpeechSynthesis.SpeechSynthesisStream, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null
$voiceList = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices
$voiceList | Select-Object DisplayName,Language,Gender | Format-Table
$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$synth.Voice = $voiceList | Where-Object { $_.DisplayName -eq 'Microsoft Katja' } | Select-Object -First 1
if (-not $synth.Voice) { throw 'Katja not found in Windows Runtime' }
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
$operation = $synth.SynthesizeTextToStreamAsync('Guten Tag. Ich möchte mich kurz vorstellen.')
$task = $asTask.MakeGenericMethod([Windows.Media.SpeechSynthesis.SpeechSynthesisStream]).Invoke($null, @($operation))
$task.Wait()
$stream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($task.Result)
$file = [System.IO.File]::Create((Join-Path $PSScriptRoot 'prueba_katja_winrt.wav'))
$stream.CopyTo($file)
$file.Dispose()
$stream.Dispose()
$synth.Dispose()
Get-Item (Join-Path $PSScriptRoot 'prueba_katja_winrt.wav') | Select-Object Name,Length
