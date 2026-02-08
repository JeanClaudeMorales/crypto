# Script interactivo para hacer push con Personal Access Token
Write-Host "=== PUSH A GITHUB CON TOKEN ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Primero, necesitas crear un Personal Access Token:" -ForegroundColor Yellow
Write-Host "1. Abre: https://github.com/settings/tokens/new" -ForegroundColor White
Write-Host "2. Name: crypto-push" -ForegroundColor White  
Write-Host "3. Marca: 'repo' (Full control of private repositories)" -ForegroundColor White
Write-Host "4. Click: Generate token" -ForegroundColor White
Write-Host ""

$token = Read-Host "Pega tu token aqui (ejemplo: ghp_xxxxxxxxxxxx)"

if ($token -eq "") {
    Write-Host "Error: No ingresaste un token" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Intentando push con el token..." -ForegroundColor Green

cd c:\AppServ\www\zve

# Hacer push con el token
$url = "https://JeanClaudeMorales:$token@github.com/JeanClaudeMorales/crypto.git"
git push $url main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ PUSH EXITOSO!" -ForegroundColor Green
    Write-Host "Verifica en: https://github.com/JeanClaudeMorales/crypto" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "✗ Push fallo con codigo: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Verifica que el token sea correcto y tenga permisos 'repo'" -ForegroundColor Yellow
}

Write-Host ""
pause
