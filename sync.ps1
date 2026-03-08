param(
  [Parameter(Mandatory=$true)]
  [string]$Message
)

$ErrorActionPreference = 'Stop'
$repoPath = 'E:\Moazzam\py'
$remoteUrl = 'https://github.com/RedXC7/moazzam-portfolio.git'

$gitCmd = 'git'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  $gitCandidate = 'C:\Program Files\Git\cmd\git.exe'
  if (Test-Path $gitCandidate) {
    $gitCmd = $gitCandidate
  } else {
    throw 'Git is not installed. Install Git first.'
  }
}

Set-Location $repoPath

$trackedPaths = @(
  '.gitignore',
  'README.md',
  'sync.ps1',
  'web2',
  'backend-deploy'
)

if (-not (Test-Path '.git')) {
  & $gitCmd init
  & $gitCmd branch -M main
}

$hasOrigin = ((& $gitCmd remote) -contains 'origin')
if (-not $hasOrigin) {
  & $gitCmd remote add origin $remoteUrl
} else {
  $existingRemote = (& $gitCmd remote get-url origin)
  if ($existingRemote -ne $remoteUrl) {
  & $gitCmd remote set-url origin $remoteUrl
  }
}

& $gitCmd add --all -- $trackedPaths
$status = & $gitCmd status --porcelain
if (-not $status) {
  Write-Output 'No changes to commit.'
  exit 0
}

& $gitCmd commit -m $Message

# If repo already has commits on GitHub, try to rebase before push.
try {
  & $gitCmd fetch origin main 2>$null
  if ($LASTEXITCODE -eq 0) {
    & $gitCmd pull --rebase origin main
  }
} catch {
  Write-Output 'Skipping remote rebase check for this sync.'
}

& $gitCmd push -u origin main
Write-Output 'Sync complete.'
