param(
  [Parameter(Mandatory = $true)]
  [string]$RepositoryPath
)

$ErrorActionPreference = "Continue"
$mutex = [System.Threading.Mutex]::new($false, "Local\CoCreateGitSafeSync")
$hasLock = $false

try {
  $hasLock = $mutex.WaitOne(0)
  if (-not $hasLock) {
    exit 0
  }

  Set-Location -LiteralPath $RepositoryPath
  if (-not (Test-Path -LiteralPath ".git")) {
    throw "Not a Git repository: $RepositoryPath"
  }

  $logPath = Join-Path $RepositoryPath ".git\safe-sync.log"
  $timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssK"

  git fetch origin main --prune 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Add-Content -LiteralPath $logPath -Value "$timestamp fetch failed"
    exit 1
  }

  $branch = (git branch --show-current).Trim()
  $isDirty = [bool](git status --porcelain)
  if ($branch -ne "main" -or $isDirty) {
    Add-Content -LiteralPath $logPath -Value "$timestamp fetched only (branch=$branch dirty=$isDirty)"
    exit 0
  }

  $counts = (git rev-list --left-right --count HEAD...origin/main).Trim() -split "\s+"
  $ahead = [int]$counts[0]
  $behind = [int]$counts[1]

  if ($ahead -eq 0 -and $behind -gt 0) {
    git merge --ff-only origin/main 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
      Add-Content -LiteralPath $logPath -Value "$timestamp fast-forward failed"
      exit 1
    }
    Add-Content -LiteralPath $logPath -Value "$timestamp fast-forwarded by $behind commit(s)"
  } elseif ($ahead -gt 0 -and $behind -gt 0) {
    Add-Content -LiteralPath $logPath -Value "$timestamp fetched only (branches diverged)"
  }
} catch {
  try {
    $fallbackLog = Join-Path $RepositoryPath ".git\safe-sync.log"
    Add-Content -LiteralPath $fallbackLog -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK') error: $($_.Exception.Message)"
  } catch {
    # Nothing else is safe to do if the repository or log is unavailable.
  }
  exit 1
} finally {
  if ($hasLock) {
    $mutex.ReleaseMutex()
  }
  $mutex.Dispose()
}
