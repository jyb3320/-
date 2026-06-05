$ErrorActionPreference = "Stop"

$taskName = "ApplicationPassRateTrackerDevServer"
$projectRoot = Split-Path -Parent $PSScriptRoot
$installDir = Join-Path $env:LOCALAPPDATA "application-pass-rate-tracker"
$scriptPath = Join-Path $installDir "start-dev.ps1"

New-Item -ItemType Directory -Force -Path $installDir | Out-Null
Copy-Item -Force -Path (Join-Path $PSScriptRoot "start-dev.ps1") -Destination $scriptPath

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`" -ProjectRoot `"$projectRoot`" -Port 3000"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -ExecutionTimeLimit (New-TimeSpan -Hours 0)

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Starts the application pass rate tracker Next.js dev server after login." `
  -Force | Out-Null

Write-Host "Registered startup task: $taskName"
Write-Host "The app will start at http://127.0.0.1:3000 after Windows login."
Write-Host "Startup launcher installed at: $scriptPath"
