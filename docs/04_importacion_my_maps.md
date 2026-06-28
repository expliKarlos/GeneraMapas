# Importacion y mantenimiento en Google My Maps

## Estrategia principal

Usar CSV o Google Sheets como fuente principal de verdad.

No importar CSV y KML completos en el mismo mapa salvo que se quiera crear una version separada. Si se importan ambos, My Maps puede duplicar marcadores.

## Crear el mapa

1. Abrir Google My Maps.
2. Crear un mapa nuevo.
3. Nombrarlo como `[NOMBRE_PROYECTO] v[VERSION] [FECHA]`.
4. Crear las capas planificadas en `[PREFERENCIA_CAPAS]`.

## Importar CSV o Google Sheets

1. Crear o seleccionar una capa.
2. Pulsar `Importar`.
3. Subir CSV, XLSX, TSV o seleccionar Google Sheets.
4. Seleccionar columnas de ubicacion:
   - `latitude`
   - `longitude`
5. Seleccionar columna de titulo:
   - `nombre_visible`
6. Revisar los marcadores importados.
7. Estilar por columna:
   - Columna recomendada: `categoria`.
   - Ajustar colores e iconos una vez por mapa.

## Reimportar y mantener

Al reimportar en My Maps, elegir la opcion adecuada:

- `Replace all items`: sustituye toda la capa. Usar solo para reconstrucciones completas.
- `Update matching items`: actualiza elementos coincidentes. Usar `id_lugar` como columna de coincidencia.
- `Add more items`: anade elementos nuevos sin tocar los existentes.
- `Merge matching items`: fusiona datos por una columna comun.

Recomendacion:

- Mantener `id_lugar` estable.
- Usar `Update matching items` para cambios de texto, categoria, enlaces o datos.
- Usar `Add more items` para nuevos lugares.
- Usar `Replace all items` solo si se acepta perder ajustes manuales no reproducidos desde el CSV.
- No editar manualmente datos criticos en My Maps si luego no se reflejan en el CSV maestro.

## KML opcional

El KML se usa para:

- backup,
- Google Earth,
- visores externos,
- reconstruccion completa en una nueva version.

Precauciones:

- My Maps puede no respetar todas las carpetas, estilos o HTML de un KML.
- Si se usa KML para importar en My Maps, generar preferiblemente un KML por capa.
- No mezclarlo con CSV en el mismo mapa operativo.

## KML adaptado para My Maps

Cuando se quiera usar KML como via de importacion en My Maps, GeneraMapas puede generar una variante mas conservadora:

- estilos definidos solo bajo `Document`,
- sin `Folder`,
- sin `hotSpot`,
- `styleUrl` por categoria,
- iconos enlazados por URL remota,
- color KML generado desde `color_hex`,
- escala KML generada desde `tamano_icono`,
- metadatos en `ExtendedData`, incluyendo `icono_fuente` y `color_hex`,
- descripcion breve en texto plano o CDATA minimo,
- solo `Placemark` con coordenadas confirmadas.

Esta variante sigue sin sustituir al CSV como fuente de mantenimiento, pero reduce el riesgo de que My Maps ignore estructuras KML complejas.

Valores de tamano:

- `grande`: `<scale>1.3</scale>`
- `normal`: `<scale>1.1</scale>`
- `pequeno`: `<scale>0.9</scale>`

My Maps puede simplificar algunos estilos importados desde KML. Si el tamano no se conserva exactamente, el CSV conserva `prioridad` y `tamano_icono` para ajustar el estilo manualmente por columna dentro de My Maps.

## Imagenes y videos

Opciones:

- Importar fotos desde Google Drive o Google Photos si el flujo de My Maps lo permite.
- Usar `image_url` y `video_url` como enlaces en la descripcion del marcador.
- Mantener los archivos multimedia en una carpeta publica o compartida.

Plantilla de descripcion HTML:

```html
<p><b>Categoria:</b> [CATEGORIA]</p>
<p>[DESCRIPCION_BREVE]</p>
<p><b>Datos de interes:</b> [DATOS_INTERES]</p>
<p><a href="[ENLACE_UTIL]">Mas informacion</a></p>
<p><a href="[IMAGE_URL]">Ver foto</a></p>
<p><a href="[VIDEO_URL]">Ver video</a></p>
```

Si no hay imagen o video, omitir esas lineas.

## Limites operativos

Limites relevantes documentados por Google My Maps:

- 10 capas por mapa.
- 2.000 filas por importacion/capa.
- 10.000 lineas, formas o lugares por mapa.
- 50.000 puntos totales en lineas y formas.
- 20.000 celdas de tabla de datos.
- KML/KMZ hasta 5 MB descomprimido.
- Otros archivos hasta 40 MB.
- Hasta 100 fotos por importacion.

Antes de importar mapas grandes, dividir por capas o proyectos.

## Fuentes

- Importar elementos desde archivo: https://support.google.com/mymaps/answer/3024836
- Usar capas: https://support.google.com/mymaps/answer/3024933
- Anadir lugares y limites por capa/mapa: https://support.google.com/mymaps/answer/3024925
- Lineas, formas y limites de puntos: https://support.google.com/mymaps/answer/3433053
