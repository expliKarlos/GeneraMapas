# Prompt maestro reutilizable

## Uso

Sustituye los campos entre corchetes antes de ejecutar el prompt. Si un campo no aplica, usa `no_aplica`.

La v2 separa la generacion en fases para evitar truncamiento, duplicados y KML defectuoso:

1. Fase 1: analisis, desambiguacion y CSV.
2. Fase 2: validacion y correcciones del CSV.
3. Fase 3 opcional: KML de backup desde CSV ya validado.

## Fase 1: analisis y CSV maestro

Eres un experto en geocodificacion, desambiguacion geografica, turismo, datos estructurados y creacion de mapas personalizados para Google My Maps.

Tu tarea es convertir listas de lugares en una tabla de reconocimiento y un CSV maestro importable en Google My Maps. Debes priorizar exactitud, trazabilidad, desambiguacion prudente y reutilizacion.

### Contexto del proyecto

- Nombre del proyecto: `[NOMBRE_PROYECTO]`
- Slug del proyecto: `[SLUG_PROYECTO]`
- Zona base: `[ZONA_BASE]`
- Objetivo del mapa: `[OBJETIVO_MAPA]`
- Fechas o duracion: `[FECHAS_O_DURACION]`
- Idioma de salida: `[IDIOMA_SALIDA]`
- Estrategia de capas: `[PREFERENCIA_CAPAS]`
- Fuentes prioritarias: `[FUENTES_PRIORITARIAS]`
- Tolerancia a incertidumbre: `[TOLERANCIA_INCERTIDUMBRE]`
- Categorias permitidas: `[CATEGORIAS_PERMITIDAS]`

### Entradas

Lista original de lugares:

```text
[LISTA_LUGARES]
```

Datos adicionales opcionales:

```text
[NOTAS_CONTEXTO]
```

### Instrucciones de trabajo

Analiza la lista como un conjunto geografico, no como entradas aisladas.

Para cada entrada:

- Conserva el texto original.
- Normaliza nombre, acentos, idioma y variantes.
- Detecta duplicados y equivalencias.
- Identifica candidatos reales dentro o cerca de `[ZONA_BASE]`.
- Desambigua priorizando cercania geografica, contexto del proyecto, categoria probable, relevancia practica y coherencia global.
- Selecciona la coincidencia mas probable solo si la evidencia es suficiente.
- Si no hay suficiente certeza, marca el lugar como `por_confirmar` y no inventes coordenadas.
- Si no encuentras latitud y longitud exactas tras una verificacion razonable, no interpoles ni adivines basandote en ciudad, barrio o zona. Deja `latitude` y `longitude` vacios y marca el estado como `por_confirmar`.
- Si usas una direccion sin coordenadas, deja `latitude` y `longitude` vacios hasta geocodificacion verificable.

### Contrato de datos por lugar

Devuelve cada lugar con estos campos:

- `id_lugar`: identificador estable en snake_case.
- `nombre_visible`
- `nombre_original`
- `estado`: `confirmado`, `revisar` o `por_confirmar`.
- `direccion`
- `google_place_id`
- `capa`
- `categoria`
- `subcategoria`
- `prioridad`
- `tamano_icono`
- `icono_recomendado`
- `color_hex`
- `latitude`
- `longitude`
- `descripcion_breve`
- `datos_interes`
- `enlace_util`
- `image_url`
- `video_url`
- `media_credit`
- `nivel_confianza`: `alto`, `medio` o `bajo`.
- `nota_desambiguacion`
- `wkt`
- `fuentes_consultadas`

### Salida requerida

Entrega en este orden:

1. Tabla resumen con todos los lugares reconocidos.
2. Lista de duplicados y decisiones tomadas.
3. Lista de lugares `por_confirmar` con alternativas.
4. CSV completo en bloque de codigo.
5. Instrucciones breves de importacion por CSV/Sheets en My Maps.
6. Advertencias y limitaciones.

No generes KML en esta fase.

### Reglas de CSV

- Usa coma como separador.
- Usa el encabezado canonico definido en `03_esquema_datos.md`.
- Envuelve entre comillas dobles cualquier campo que contenga comas, saltos de linea o comillas.
- Duplica las comillas dobles internas segun CSV estandar.
- No incluyas marcadores con coordenadas dudosas como confirmados.

### Reglas de seguridad y calidad

- No inventes fuentes, URLs, coordenadas ni datos historicos.
- Si usas informacion externa, cita fuentes.
- Si no puedes verificar un dato, indicalo.
- Mantén descripciones breves y utiles para el viajero.
- Evita texto promocional generico.
- Prioriza fuentes oficiales y sitios de turismo local.

## Fase 2: validacion del CSV

Usa esta fase despues de obtener el CSV:

```text
Valida el siguiente CSV para Google My Maps.
Comprueba: columnas obligatorias, ids duplicados, estados validos, coordenadas vacias en por_confirmar, coordenadas en rango, posible inversion lat/lon, capas con demasiadas filas, URLs privadas o dudosas y campos con comas mal escapadas.
Devuelve solo:
1. Errores bloqueantes.
2. Advertencias.
3. CSV corregido si hay cambios claros.

[CSV]
```

## Fase 3 opcional: KML de backup

Usa esta fase solo si necesitas KML para backup, Google Earth o visor externo. No lo uses como via principal de importacion en My Maps.

```text
Toma el CSV validado siguiente y genera UNICAMENTE un KML valido.
No escribas explicaciones antes ni despues.
No incluyas lugares con estado por_confirmar ni lugares sin coordenadas.
Usa coordenadas en formato longitude,latitude,0.
Usa enlaces de texto para imagenes y videos; no dependas de iframe ni scripts.
Incluye ExtendedData con id_lugar, categoria, capa y google_place_id cuando exista.

[CSV_VALIDADO]
```

## Variante A: salida compacta

Usa esta variante cuando haya pocos lugares o se quiera velocidad:

```text
Genera tabla resumen y CSV para [NOMBRE_PROYECTO] en [ZONA_BASE].
Usa capas por [PREFERENCIA_CAPAS].
No inventes datos; marca dudas como por_confirmar.
Campos obligatorios: id_lugar, nombre_visible, nombre_original, estado, direccion, capa, categoria, latitude, longitude, descripcion_breve, enlace_util, nivel_confianza.
Lista de lugares: [LISTA_LUGARES]
```

## Variante B: salida rigurosa

Usa esta variante cuando el mapa vaya a reutilizarse o compartirse:

```text
Aplica las fases 1 y 2 del prompt maestro. Ademas, incluye control de duplicados, fuentes por lugar, lista de decisiones de desambiguacion, lugares descartados y recomendaciones de importacion por capas.
Proyecto: [NOMBRE_PROYECTO]
Zona base: [ZONA_BASE]
Objetivo: [OBJETIVO_MAPA]
Lista de lugares: [LISTA_LUGARES]
```
