$ErrorActionPreference = 'Stop'
# Explicit operator setup only: builds never download an executable or choose a host fallback.
$version = '154.0.8037.92'
$expectedHash = '3AC2561F02D9D87AADC0399D00B9002D718A4C365624FA67DB9E7BFAF6B1A568'
$workspace = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$destination = [IO.Path]::GetFullPath((Join-Path $workspace ".runtime/browser/$version"))
if (-not $destination.StartsWith($workspace + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Browser setup escaped the workspace.' }
$executable = Join-Path $destination 'chrome-headless-shell-win64/chrome-headless-shell.exe'
if (-not (Test-Path -LiteralPath $executable)) {
  New-Item -ItemType Directory -Path $destination -Force | Out-Null
  $archive = Join-Path $destination 'browser.zip'
  Invoke-WebRequest -Uri "https://storage.googleapis.com/chrome-for-testing-public/$version/win64/chrome-headless-shell-win64.zip" -OutFile $archive
  if ((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash -ne $expectedHash) { throw 'Verification browser download hash did not match the pinned runtime.' }
  Expand-Archive -LiteralPath $archive -DestinationPath $destination -Force
  Remove-Item -LiteralPath $archive
}
if ((Get-FileHash -LiteralPath $executable -Algorithm SHA256).Hash -ne '798971A4FB66ED219F2CAE1E6A0E97AD68A2E935D5E140D7150745B063DEA65B') { throw 'Verification browser executable hash did not match.' }
Push-Location $workspace
try {
  pnpm exec tsx scripts/prepare-verification-browser.ts
  if ($LASTEXITCODE -ne 0) { throw 'Isolated verification browser preflight failed.' }
} finally { Pop-Location }
