# GeneraMapas

Aplicacion estatica para preparar archivos importables en Google My Maps a partir de una lista de lugares de viaje.

La app funciona en el navegador, sin backend y sin instalacion. Esta pensada para publicarse con GitHub Pages.

## Funciones

- Pegar una lista de lugares.
- Importar un CSV existente.
- Preparar una tabla editable.
- Resolver nombres ambiguos con IA opcional.
- Buscar varios candidatos OSM antes de confirmar coordenadas.
- Geocodificar opcionalmente con OpenStreetMap/Nominatim.
- Cachear resultados en el navegador.
- Exportar CSV maestro.
- Exportar CSV por capas.
- Exportar KML de backup.
- Exportar KML adaptado para My Maps con estilos en `Document`.
- Personalizar prioridad y tamano de icono por lugar.
- Conservar campos avanzados como horario, precio, Wikipedia, Wikidata, OSM, Street View, Plus Code, elevacion y dificultad.
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
5. Si los nombres son ambiguos, pulsa `Resolver con IA`.
6. Pulsa `Buscar candidatos OSM` y elige el candidato correcto en la tabla.
7. Usa `Geocodificar pendientes con OSM` solo si aceptas la primera coincidencia automaticamente.
8. Revisa y edita la tabla.
9. Exporta CSV maestro, CSV por capas o KML para My Maps.
10. Importa manualmente en Google My Maps.

## Documentacion

- [Guia de usuario](docs/GUIA_USUARIO.md)
- [Metodologia](docs/01_metodologia.md)
- [Prompt maestro reutilizable](docs/02_prompt_maestro_reutilizable.md)
- [Esquema de datos](docs/03_esquema_datos.md)
- [Importacion en My Maps](docs/04_importacion_my_maps.md)
- [Automatizacion](docs/05_automatizacion.md)
- [Checklist de validacion](checklists/validacion.md)
- [Iconos por subcategoria](data/google-icons.json)

## Privacidad

- La app procesa los datos en el navegador.
- El borrador se guarda en `localStorage`.
- La API key de OpenAI, si se usa, se guarda solo en `sessionStorage`.
- La geocodificacion OSM solo se ejecuta cuando el usuario pulsa el boton correspondiente.
- No hay servidor propio recibiendo tus datos.

La resolucion con IA desde GitHub Pages es util para uso personal, pero no es el modelo ideal para una app publica con muchas personas porque la clave se usa desde el navegador. Para uso compartido serio conviene anadir un backend ligero que proteja la clave y aplique limites.

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
- Los iconos KML se enlazan desde una coleccion remota y los colores se generan desde `color_hex`.

El CSV sigue siendo la fuente principal de mantenimiento. El KML para My Maps es una alternativa de importacion cuando se quiere controlar mejor iconos y metadatos.

## Prioridad y tamano de iconos

Cada lugar puede tener:

- `prioridad`: `imprescindible`, `recomendable` u `opcional`.
- `tamano_icono`: `grande`, `normal` o `pequeno`.

Por defecto, todos los lugares empiezan como `recomendable` y `normal`.

En el KML para My Maps, el tamano se traduce a `<scale>`:

- `grande`: `1.3`
- `normal`: `1.1`
- `pequeno`: `0.9`

## Campos avanzados

El CSV canonico incluye campos avanzados desde el inicio, aunque la interfaz principal solo edite los mas frecuentes:

- `horario`
- `precio_rango`
- `interior_exterior`
- `wikipedia_url`
- `wikidata_id`
- `osm_id`
- `street_view_url`
- `plus_code`
- `elevacion_m`
- `dificultad`

Estos campos se conservan al importar/exportar CSV y se incluyen en `ExtendedData` del KML para My Maps.

## Licencia

GPL-3.0. Ver [LICENSE](LICENSE).
