param(
  [Parameter(Mandatory = $true)]
  [string]$RepositoryPath,

  [int]$IntervalSeconds = 300
)

$ErrorActionPreference = "Continue"
$mutex = [System.Threading.Mutex]::new($false, "Local\CoCreateGitSafeSyncLoop")
$hasLock = $false

try {
  $hasLock = $mutex.WaitOne(0)
  if (-not $hasLock) {
    exit 0
  }

  $syncScript = Join-Path $RepositoryPath "scripts\safe-git-sync.ps1"
  while ($true) {
    if (Test-Path -LiteralPath $syncScript) {
      & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $syncScript -RepositoryPath $RepositoryPath
    }
    Start-Sleep -Seconds $IntervalSeconds
  }
} finally {
  if ($hasLock) {
    $mutex.ReleaseMutex()
  }
  $mutex.Dispose()
}
