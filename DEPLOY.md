# Publicar en GitHub Pages

## Opcion recomendada

Publicar desde la raiz del repositorio.

## Pasos

1. Crear un repositorio nuevo en GitHub:

```text
GeneraMapas
```

2. Inicializar git localmente:

```powershell
git init
git add .
git commit -m "Initial static app"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/GeneraMapas.git
git push -u origin main
```

Tambien puedes usar el script incluido:

```powershell
.\init-repo.ps1 -RemoteUrl "https://github.com/TU_USUARIO/GeneraMapas.git"
```

3. Activar GitHub Pages:

```text
Settings > Pages > Deploy from a branch > main > /root
```

4. Esperar a que GitHub publique la pagina.

## Comprobar

Abrir:

```text
https://TU_USUARIO.github.io/GeneraMapas/
```

## Actualizar

```powershell
git add .
git commit -m "Update app"
git push
```

GitHub Pages actualizara la web automaticamente.
