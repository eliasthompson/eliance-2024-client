#Requires -RunAsAdministrator
# Installs the Roboto weights bundled in src/assets/fonts for all users so OBS text sources
# can use the same font as the browser source overlays. Restart OBS after running.

$fontsDir = Join-Path $PSScriptRoot '..\src\assets\fonts'
$registry = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts'

Get-ChildItem -Path $fontsDir -Filter 'Roboto-*.ttf' | ForEach-Object {
  $destination = Join-Path $env:WINDIR "Fonts\$($_.Name)"
  Copy-Item -Path $_.FullName -Destination $destination -Force
  $face = $_.BaseName -replace '-', ' '
  New-ItemProperty -Path $registry -Name "$face (TrueType)" -Value $_.Name -PropertyType String -Force | Out-Null
  Write-Host "Installed $face"
}
