# Upload proyecto a AWS EC2
# Uso: .\deploy\upload-aws.ps1 -IP "3.85.100.50" -Key "C:\ruta\mi-llave.pem"

param(
    [Parameter(Mandatory=$true)][string]$IP,
    [Parameter(Mandatory=$true)][string]$Key,
    [string]$User = "ubuntu"
)

$ErrorActionPreference = "Stop"
$dest = "${User}@${IP}"

Write-Host "`n  Upload a $dest`n" -ForegroundColor Cyan

if (-not (Test-Path $Key)) {
    Write-Host "ERROR: Llave no encontrada: $Key" -ForegroundColor Red; exit 1
}

Write-Host "[1/3] Creando directorios..." -ForegroundColor Yellow
ssh -i $Key -o StrictHostKeyChecking=no $dest "mkdir -p ~/api-mock/middleware ~/api-mock/scripts ~/api-mock/deploy"

Write-Host "[2/3] Subiendo archivos..." -ForegroundColor Yellow

foreach ($f in @("app.js", "package.json", "package-lock.json")) {
    if (Test-Path $f) { Write-Host "  -> $f"; scp -i $Key -o StrictHostKeyChecking=no $f "${dest}:~/api-mock/" }
}

foreach ($folder in @(
    @{ src = "middleware\*"; dest = "~/api-mock/middleware/" },
    @{ src = "scripts\*";   dest = "~/api-mock/scripts/" },
    @{ src = "deploy\*";    dest = "~/api-mock/deploy/" }
)) {
    if (Get-ChildItem $folder.src -ErrorAction SilentlyContinue) {
        Write-Host "  -> $($folder.src)"
        scp -i $Key -o StrictHostKeyChecking=no -r $folder.src "${dest}:$($folder.dest)"
    }
}

Write-Host "`n[3/3] Listo.`n" -ForegroundColor Green
Write-Host "  Conectate y ejecuta:" -ForegroundColor White
Write-Host "    ssh -i `"$Key`" $dest" -ForegroundColor Yellow
Write-Host "    cd ~/api-mock && chmod +x deploy/setup-aws.sh && ./deploy/setup-aws.sh`n" -ForegroundColor Yellow
