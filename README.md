# GeneraMapas

Aplicacion estatica para preparar archivos importables en Google My Maps a partir de una lista de lugares de viaje.

La app funciona en el navegador, sin backend y sin instalacion. Esta pensada para publicarse con GitHub Pages.

## Funciones

- Pegar una lista de lugares.
- Importar un CSV existente.
- Preparar una tabla editable.
- Geocodificar opcionalmente con OpenStreetMap/Nominatim.
- Cachear resultados en el navegador.
- Exportar CSV maestro.
- Exportar CSV por capas.
- Exportar KML de backup.
- Exportar KML adaptado para My Maps con estilos en `Document`.
- Generar instrucciones de importacion para Google My Maps.

## Demo local

```powershell
python -m http.server 8080
```

Abrir:

```text
http://localhost:8080
```

## Publicacion en GitHub Pages

Este repositorio esta preparado para publicarse desde la raiz de la rama principal.

Pasos:

1. Crear un repositorio nuevo en GitHub, por ejemplo `GeneraMapas`.
2. Subir estos archivos.
3. Ir a `Settings > Pages`.
4. En `Build and deployment`, elegir:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guardar.

La URL tendra un formato parecido a:

```text
https://TU_USUARIO.github.io/GeneraMapas/
```

## Uso recomendado

1. Abre la app.
2. Completa nombre del proyecto y zona base.
3. Pega lugares o importa CSV.
4. Pulsa `Preparar tabla`.
5. Revisa y edita la tabla.
6. Geocodifica con OSM solo si necesitas coordenadas.
7. Exporta CSV maestro, CSV por capas o KML para My Maps.
8. Importa manualmente en Google My Maps.

## Documentacion

- [Guia de usuario](docs/GUIA_USUARIO.md)
- [Metodologia](docs/01_metodologia.md)
- [Prompt maestro reutilizable](docs/02_prompt_maestro_reutilizable.md)
- [Esquema de datos](docs/03_esquema_datos.md)
- [Importacion en My Maps](docs/04_importacion_my_maps.md)
- [Automatizacion](docs/05_automatizacion.md)
- [Checklist de validacion](checklists/validacion.md)

## Privacidad

- La app procesa los datos en el navegador.
- El borrador se guarda en `localStorage`.
- La geocodificacion OSM solo se ejecuta cuando el usuario pulsa el boton correspondiente.
- No hay servidor propio recibiendo tus datos.

## OpenStreetMap / Nominatim

El uso previsto es bajo volumen, orientado a viajes:

- geocodificacion inicial de decenas o pocos cientos de lugares,
- cache local,
- pausa aproximada de 1 segundo entre consultas,
- revision humana de resultados.

No debe usarse como autocompletado continuo ni geocodificacion masiva.

## KML

GeneraMapas ofrece dos salidas KML:

- `KML backup`: KML generico de respaldo para Google Earth o intercambio.
- `KML para My Maps`: KML con estilos definidos solo en `Document`, sin `Folder`, sin `hotSpot` y con metadatos en `ExtendedData`.

El CSV sigue siendo la fuente principal de mantenimiento. El KML para My Maps es una alternativa de importacion cuando se quiere controlar mejor iconos y metadatos.

## Licencia

GPL-3.0. Ver [LICENSE](LICENSE).
