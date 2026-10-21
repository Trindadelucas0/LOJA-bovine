$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$runtimeDir = Join-Path $repoRoot ".setup-bovine\runtime"
$processes = Get-CimInstance Win32_Process

foreach ($name in @("storefront", "backend")) {
  $pidFile = Join-Path $runtimeDir "$name.pid"
  if (-not (Test-Path $pidFile)) { continue }

  $rootPid = [int](Get-Content $pidFile -ErrorAction Stop)
  $rootProcess = $processes | Where-Object ProcessId -eq $rootPid | Select-Object -First 1
  if (-not $rootProcess) { continue }

  $queue = [System.Collections.Generic.Queue[int]]::new()
  $queue.Enqueue($rootPid)
  $tree = @()
  while ($queue.Count -gt 0) {
    $currentPid = $queue.Dequeue()
    $current = $processes | Where-Object ProcessId -eq $currentPid | Select-Object -First 1
    if (-not $current) { continue }
    $tree += $current
    foreach ($child in ($processes | Where-Object ParentProcessId -eq $currentPid)) {
      $queue.Enqueue([int]$child.ProcessId)
    }
  }

  $escapedRoot = [regex]::Escape($repoRoot)
  $isExpectedApp = if ($name -eq "storefront") {
    [bool]($tree | Where-Object { $_.CommandLine -match $escapedRoot -and $_.CommandLine -match "next.*dev" })
  } else {
    [bool]($tree | Where-Object { $_.CommandLine -match $escapedRoot -and $_.CommandLine -match "medusa.*develop" })
  }

  if (-not $isExpectedApp) {
    Write-Warning "PID salvo para '$name' não corresponde a este projeto; processo preservado."
    continue
  }

  taskkill /PID $rootPid /T /F | Out-Null
  Write-Host "Processo local '$name' encerrado."
}

Write-Host "PostgreSQL e Redis continuam ligados; nenhum dado ou contêiner foi removido."
