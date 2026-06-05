param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$Port = "3000"
)

$ErrorActionPreference = "Stop"

$logDir = Join-Path $env:LOCALAPPDATA "application-pass-rate-tracker"
$logFile = Join-Path $logDir "server.log"
$serverLogFile = Join-Path $logDir "next-server.log"

New-Item -ItemType Directory -Force -Path $logDir | Out-Null
Add-Content -Path $logFile -Value "$(Get-Date -Format s) Startup launcher began. ProjectRoot=$ProjectRoot Port=$Port"

for ($attempt = 1; $attempt -le 60; $attempt += 1) {
  if ((Test-Path (Join-Path $ProjectRoot "package.json")) -and (Test-Path (Join-Path $ProjectRoot "node_modules\.bin\next.cmd"))) {
    break
  }

  Add-Content -Path $logFile -Value "$(Get-Date -Format s) Project is not ready yet. Attempt $attempt/60."
  Start-Sleep -Seconds 2
}

if (!(Test-Path (Join-Path $ProjectRoot "package.json"))) {
  Add-Content -Path $logFile -Value "$(Get-Date -Format s) Startup failed: package.json was not available."
  exit 1
}

if (!(Test-Path (Join-Path $ProjectRoot "node_modules\.bin\next.cmd"))) {
  Add-Content -Path $logFile -Value "$(Get-Date -Format s) Startup failed: Next.js executable was not available."
  exit 1
}

$listener = Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort ([int]$Port) -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  Add-Content -Path $logFile -Value "$(Get-Date -Format s) Port $Port is already listening. Startup skipped."
  exit 0
}

if (!(Test-Path (Join-Path $ProjectRoot ".next\BUILD_ID"))) {
  Add-Content -Path $logFile -Value "$(Get-Date -Format s) Production build is missing. Running next build."
  Push-Location $ProjectRoot
  try {
    npm.cmd run build *> $serverLogFile
  } finally {
    Pop-Location
  }

  if (!(Test-Path (Join-Path $ProjectRoot ".next\BUILD_ID"))) {
    Add-Content -Path $logFile -Value "$(Get-Date -Format s) Startup failed: next build did not create .next\BUILD_ID."
    exit 1
  }
}

$command = "/d /c npm.cmd run start >> `"$serverLogFile`" 2>>&1"
$process = Start-Process `
  -FilePath "cmd.exe" `
  -ArgumentList $command `
  -WorkingDirectory $ProjectRoot `
  -WindowStyle Hidden `
  -PassThru

Add-Content -Path $logFile -Value "$(Get-Date -Format s) Started detached Next.js server process. Pid=$($process.Id)"

for ($attempt = 1; $attempt -le 30; $attempt += 1) {
  Start-Sleep -Seconds 1
  $listener = Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort ([int]$Port) -State Listen -ErrorAction SilentlyContinue
  if ($listener) {
    Add-Content -Path $logFile -Value "$(Get-Date -Format s) Server is listening at http://127.0.0.1:$Port"
    exit 0
  }
}

Add-Content -Path $logFile -Value "$(Get-Date -Format s) Startup failed: server did not listen on port $Port within 30 seconds."
exit 1
