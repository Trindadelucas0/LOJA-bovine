$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$runtimeDir = Join-Path $repoRoot ".setup-bovine\runtime"
$backendEnv = Join-Path $repoRoot "apps\backend\.env"
$storefrontEnv = Join-Path $repoRoot "apps\storefront\.env.local"

if (-not (Test-Path $backendEnv) -or -not (Test-Path $storefrontEnv)) {
  throw "Configuração local ausente. Crie apps\backend\.env e apps\storefront\.env.local a partir dos arquivos .env.example."
}

$env:SWC_NATIVE_BINDING_CACHE = Join-Path $env:USERPROFILE ".cache\bovine-swc"
$env:XDG_CONFIG_HOME = Join-Path $repoRoot ".setup-bovine\config"
New-Item -ItemType Directory -Force -Path $runtimeDir, $env:SWC_NATIVE_BINDING_CACHE, $env:XDG_CONFIG_HOME | Out-Null

function Get-HttpStatus([string]$url) {
  $client = [System.Net.Http.HttpClient]::new()
  try {
    $response = $client.GetAsync($url).GetAwaiter().GetResult()
    return [int]$response.StatusCode
  } catch {
    return 0
  } finally {
    $client.Dispose()
  }
}

function Test-LocalPort([int]$port) {
  $client = [System.Net.Sockets.TcpClient]::new()
  try {
    $attempt = $client.BeginConnect("127.0.0.1", $port, $null, $null)
    return $attempt.AsyncWaitHandle.WaitOne(1000) -and $client.Connected
  } catch {
    return $false
  } finally {
    $client.Dispose()
  }
}

foreach ($containerName in @("medusa-postgres-manual", "bovine-medusa-redis")) {
  docker inspect $containerName --format "{{.State.Status}}" *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "O contêiner local '$containerName' não existe. Abra o Docker Desktop e confira a instalação local da loja."
  }

  $containerStatus = (docker inspect $containerName --format "{{.State.Status}}").Trim()
  if ($containerStatus -ne "running") {
    docker start $containerName | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw "Não foi possível iniciar o contêiner '$containerName'."
    }
  }
}

$npm = (Get-Command npm.cmd -ErrorAction Stop).Source
New-Item -ItemType Directory -Force -Path $env:XDG_CONFIG_HOME | Out-Null

function Start-LocalApp([string]$name, [string]$appDirectory) {
  $pidFile = Join-Path $runtimeDir "$name.pid"
  $stdout = Join-Path $runtimeDir "$name.stdout.log"
  $stderr = Join-Path $runtimeDir "$name.stderr.log"
  $process = Start-Process -FilePath $npm -ArgumentList @("run", "dev") `
    -WorkingDirectory (Join-Path $repoRoot $appDirectory) -WindowStyle Hidden `
    -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
  Set-Content -Path $pidFile -Value $process.Id
}

$backendStatus = Get-HttpStatus "http://127.0.0.1:9000/health"
if ($backendStatus -ne 200) {
  if (Test-LocalPort 9000) {
    throw "A porta 9000 está ocupada por outro serviço; confira .setup-bovine\runtime\backend.*.log."
  }
  Start-LocalApp "backend" "apps\backend"
  for ($attempt = 0; $attempt -lt 90; $attempt++) {
    if ((Get-HttpStatus "http://127.0.0.1:9000/health") -eq 200) { break }
    Start-Sleep -Seconds 1
  }
  if ((Get-HttpStatus "http://127.0.0.1:9000/health") -ne 200) {
    Get-Content (Join-Path $runtimeDir "backend.stdout.log") -Tail 30 -ErrorAction SilentlyContinue
    Get-Content (Join-Path $runtimeDir "backend.stderr.log") -Tail 30 -ErrorAction SilentlyContinue
    throw "O backend não respondeu em http://localhost:9000/health."
  }
}

$storefrontStatus = Get-HttpStatus "http://127.0.0.1:8000/br"
if ($storefrontStatus -ne 200) {
  if (Test-LocalPort 8000) {
    throw "A porta 8000 já está ocupada e a rota /br não respondeu 200; confira .setup-bovine\runtime\storefront.*.log."
  }
  Start-LocalApp "storefront" "apps\storefront"
  for ($attempt = 0; $attempt -lt 90; $attempt++) {
    if ((Get-HttpStatus "http://127.0.0.1:8000/br") -eq 200) { break }
    Start-Sleep -Seconds 1
  }
  if ((Get-HttpStatus "http://127.0.0.1:8000/br") -ne 200) {
    Get-Content (Join-Path $runtimeDir "storefront.stdout.log") -Tail 30 -ErrorAction SilentlyContinue
    Get-Content (Join-Path $runtimeDir "storefront.stderr.log") -Tail 30 -ErrorAction SilentlyContinue
    throw "A loja não respondeu em http://localhost:8000/br."
  }
}

Write-Host "Loja local pronta: http://localhost:8000/br"
Write-Host "API local: http://localhost:9000/health"
Write-Host "Logs: $runtimeDir"
