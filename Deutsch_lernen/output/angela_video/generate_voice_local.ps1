$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.SpeechSynthesis.SpeechSynthesisStream, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null
$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$synth.Voice = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -eq 'Microsoft Katja' } | Select-Object -First 1
if (-not $synth.Voice) { throw 'Katja not found' }
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
$text = [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot 'texto_de.txt'), [System.Text.Encoding]::UTF8).Trim()
$sentences = [regex]::Split($text, '(?<=\.)\s+')
$clips = Join-Path $PSScriptRoot 'clips'
New-Item -ItemType Directory -Force -Path $clips | Out-Null
for ($i = 0; $i -lt $sentences.Count; $i++) {
    $escaped = [System.Security.SecurityElement]::Escape($sentences[$i])
    $ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="de-DE"><prosody rate="-12%">' + $escaped + '</prosody></speak>'
    $operation = $synth.SynthesizeSsmlToStreamAsync($ssml)
    $task = $asTask.MakeGenericMethod([Windows.Media.SpeechSynthesis.SpeechSynthesisStream]).Invoke($null, @($operation))
    $task.Wait()
    $stream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($task.Result)
    $file = [System.IO.File]::Create((Join-Path $clips ('{0:000}.wav' -f ($i+1))))
    $stream.CopyTo($file)
    $file.Dispose()
    $stream.Dispose()
    Write-Output ('Generated sentence {0}/{1}' -f ($i+1), $sentences.Count)
}
$synth.Dispose()
[System.IO.File]::WriteAllText((Join-Path $PSScriptRoot 'voice_used.json'), '{"name":"Microsoft Katja","engine":"Windows Speech Synthesis (local)","rate":"-12%","neural":false}', [System.Text.Encoding]::UTF8)
