# Script para hacer push a GitHub
Write-Host "Verificando configuración..."
git config user.name
git config user.email
git remote -v

Write-Host "`nIntentando push..."
git push -u origin main

Write-Host "`nEstado final:"
$LASTEXITCODE
