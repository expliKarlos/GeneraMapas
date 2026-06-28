param(
  [string]$RemoteUrl = ""
)

$ErrorActionPreference = "Stop"

if (Test-Path -LiteralPath ".git") {
  Write-Host "Este directorio ya contiene un repositorio git."
  exit 0
}

git init
git add .
git commit -m "Initial static app"
git branch -M main

if ($RemoteUrl -ne "") {
  git remote add origin $RemoteUrl
  git push -u origin main
  Write-Host "Repositorio inicializado y enviado a $RemoteUrl"
} else {
  Write-Host "Repositorio inicializado localmente."
  Write-Host "Para conectar remoto:"
  Write-Host "git remote add origin https://github.com/TU_USUARIO/GeneraMapas.git"
  Write-Host "git push -u origin main"
}
