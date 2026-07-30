# Ingest CA_911_Advisor_Agent markdown into keyholders-site Advisor AI knowledge.
# Safe to re-run. Does not touch public site pages outside agent knowledge.

$ErrorActionPreference = "Stop"
$site = "C:\Users\javad\Projects\keyholders-site"
$ca = "C:\Users\javad\Projects\CA_911_Advisor_Agent"
$dest = Join-Path $site "lib\advisor-ai\knowledge\extra-md\ca_911_advisor_agent"

if (-not (Test-Path $ca)) {
  throw "Missing source pack: $ca"
}
if (-not (Test-Path $site)) {
  throw "Missing site root: $site"
}

New-Item -ItemType Directory -Force -Path $dest | Out-Null
robocopy $ca $dest *.md /S /NFL /NDL /NJH /NJS /nc /ns /np /R:1 /W:1 | Out-Null
robocopy $ca $dest *.txt /S /NFL /NDL /NJH /NJS /nc /ns /np /R:1 /W:1 | Out-Null

$n = (Get-ChildItem $dest -Recurse -File | Measure-Object).Count
$mb = [math]::Round(((Get-ChildItem $dest -Recurse -File | Measure-Object Length -Sum).Sum / 1MB), 2)
Write-Host "ingested $n files ($mb MB) -> $dest"
Write-Host "re-run tests: cd $site; npx vitest run lib/advisor-ai/advisor-ai.test.ts"
