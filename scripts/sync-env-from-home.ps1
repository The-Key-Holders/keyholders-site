# Sync selected secrets from C:\Users\javad\.env into project .env.local
# Next.js only loads env files from the project root — home .env is the vault.
# Usage: pwsh scripts/sync-env-from-home.ps1

$ErrorActionPreference = "Stop"
$homeEnv = "C:\Users\javad\.env"
$projEnv = Join-Path $PSScriptRoot ".." ".env.local"
$projEnv = [System.IO.Path]::GetFullPath($projEnv)

if (-not (Test-Path $homeEnv)) {
  Write-Error "Missing vault: $homeEnv"
}

$keys = @(
  "XAI_API_KEY",
  "XAI_MODEL",
  "TASKADE_API_KEY",
  "TASKADE_ACCESS_TOKEN",
  "DATABASE_URL",
  "ADVISOR_TOOLS_PASSWORD",
  "PORTAL_ADMIN_EMAIL",
  "MAGIC_LINK_FROM_EMAIL",
  "MAGIC_LINK_MODE",
  "RESEND_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
)

function Get-EnvMap([string]$path) {
  $map = @{}
  if (-not (Test-Path $path)) { return $map }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }
    $i = $line.IndexOf("=")
    if ($i -lt 1) { return }
    $k = $line.Substring(0, $i).Trim()
    $v = $line.Substring($i + 1).Trim()
    $map[$k] = $v
  }
  return $map
}

$homeMap = Get-EnvMap $homeEnv
$projMap = Get-EnvMap $projEnv

# Prefer home vault for shared keys; keep project-only keys
foreach ($k in $keys) {
  if ($homeMap.ContainsKey($k) -and $homeMap[$k]) {
    $projMap[$k] = $homeMap[$k]
  }
}

# Portal defaults if still missing
if (-not $projMap["PORTAL_ADMIN_EMAIL"]) {
  $projMap["PORTAL_ADMIN_EMAIL"] = "admin@thekeyholders.org"
}
if (-not $projMap["MAGIC_LINK_FROM_EMAIL"]) {
  $projMap["MAGIC_LINK_FROM_EMAIL"] = "admin@thekeyholders.org"
}
if (-not $projMap["MAGIC_LINK_MODE"]) {
  $projMap["MAGIC_LINK_MODE"] = "copy"
}

$lines = @(
  "# Auto-merged by scripts/sync-env-from-home.ps1 — DO NOT COMMIT",
  "# Vault: C:\Users\javad\.env | Runtime: this file (Next.js)"
)
foreach ($k in ($projMap.Keys | Sort-Object)) {
  $lines += "$k=$($projMap[$k])"
}
$lines | Set-Content -Path $projEnv -Encoding utf8
Write-Host "Wrote $projEnv ($($projMap.Count) keys). Values not printed."
