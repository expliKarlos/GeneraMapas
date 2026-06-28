# Contribuir

## Principios

- Mantener la app estatica y sin backend.
- No incluir claves de API.
- No hacer geocodificacion automatica mientras el usuario escribe.
- Mantener CSV/Google Sheets como fuente principal de verdad.
- Mantener KML como salida opcional de backup.

## Validacion antes de publicar

```powershell
node --check .\app.js
python .\scripts\validate_lugares.py .\examples\lugares_minimo.csv
```

Si se modifica la interfaz, actualizar capturas en `docs/screenshots/` y revisar `docs/GUIA_USUARIO.md`.
