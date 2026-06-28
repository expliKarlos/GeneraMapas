# Checklist de validacion

## Antes de generar

- [ ] `[NOMBRE_PROYECTO]` esta definido.
- [ ] `[ZONA_BASE]` esta definido.
- [ ] `[OBJETIVO_MAPA]` esta definido.
- [ ] La estrategia de capas esta elegida.
- [ ] Las categorias permitidas estan claras.
- [ ] La lista de lugares conserva el texto original.

## Tabla resumen

- [ ] Cada entrada original aparece en la tabla.
- [ ] Los duplicados estan marcados.
- [ ] Las decisiones de fusion o descarte estan justificadas.
- [ ] Los lugares ambiguos estan en `por_confirmar`.
- [ ] No hay coordenadas inventadas.

## CSV

- [ ] Usa el encabezado canonico.
- [ ] Cada fila tiene `id_lugar`.
- [ ] Los IDs son estables y no duplicados.
- [ ] Existe columna `direccion`.
- [ ] Existe columna `google_place_id`.
- [ ] Existe columna `wkt`.
- [ ] Las coordenadas confirmadas usan decimales.
- [ ] Los lugares `por_confirmar` no tienen coordenadas inventadas.
- [ ] Las URLs son publicas o se dejan vacias.
- [ ] No hay comas sin escapar dentro de campos CSV.
- [ ] Se ha ejecutado `scripts/validate_lugares.py`.

## KML

- [ ] Se necesita KML realmente; si el objetivo es My Maps operativo, se usa CSV/Sheets.
- [ ] El archivo empieza con declaracion XML UTF-8.
- [ ] El namespace KML es correcto.
- [ ] Cada capa esta representada como `Folder`.
- [ ] Cada `styleUrl` apunta a un `Style` existente.
- [ ] Las coordenadas estan en orden `longitude,latitude,0`.
- [ ] Las descripciones HTML estan dentro de CDATA.
- [ ] No hay marcadores sin coordenadas confirmadas.
- [ ] El archivo cierra correctamente `Document` y `kml`.
- [ ] El KML no se importara junto al CSV completo en el mismo mapa operativo.

## My Maps

- [ ] Cada capa queda por debajo de los limites de My Maps.
- [ ] El total del mapa queda por debajo de los limites de My Maps.
- [ ] Hay 10 capas o menos.
- [ ] Hay 2.000 filas o menos por importacion/capa.
- [ ] Hay 10.000 elementos o menos en el mapa.
- [ ] Se conserva una copia editable en CSV o Google Sheets.
- [ ] Se usa `id_lugar` como columna de coincidencia para reimportacion.
- [ ] La estrategia de reimportacion esta definida: `Update`, `Add`, `Merge` o `Replace`.
- [ ] Las fotos o videos enlazados son accesibles.
- [ ] Los lugares `por_confirmar` no se importan como definitivos.

## Revision final

- [ ] El mapa responde al objetivo del proyecto.
- [ ] Las categorias son coherentes.
- [ ] La informacion sensible o privada se ha omitido.
- [ ] Las fuentes externas estan citadas cuando se han usado.
- [ ] Las limitaciones quedan documentadas.
