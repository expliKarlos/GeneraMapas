# Automatizacion recomendada

## Objetivo

Reducir errores antes de importar en Google My Maps:

- IDs duplicados.
- Columnas ausentes.
- Estados invalidos.
- Coordenadas fuera de rango.
- Posible inversion latitud/longitud.
- Capas demasiado grandes.
- Exceso de capas.
- URLs privadas o fragiles.

## Flujo minimo

```text
lugares.csv
  -> scripts/validate_lugares.py
  -> correccion de errores
  -> importacion en My Maps
```

Comando:

```powershell
python .\Mapas\scripts\validate_lugares.py .\Mapas\templates\lugares.csv
```

## Flujo recomendado

```text
Lista original
  -> Prompt fase 1
  -> CSV maestro
  -> Validacion automatica
  -> Correccion manual o prompt fase 2
  -> CSV por capas
  -> Google My Maps
```

## Geocodificacion

Para maxima fiabilidad:

1. Usar el LLM para limpiar nombres, categorias y contexto.
2. Usar un geocoder real para coordenadas:
   - Google Places API / Geocoding API si hay presupuesto y proyecto GCP.
   - Nominatim/OpenStreetMap si el volumen es bajo y se respetan sus politicas.
3. Guardar `google_place_id` cuando exista.
4. Mantener `direccion` aunque haya coordenadas, porque ayuda a auditorias humanas.

## Geocodificacion OSM para viajes

Para mapas de vacaciones, el volumen esperado suele ser bajo:

- unas decenas de lugares por proyecto,
- hasta 300-500 consultas en escenarios amplios,
- geocodificacion principalmente inicial,
- consultas incrementales pequenas cuando se agregan nuevos lugares.

Este caso encaja con Nominatim/OpenStreetMap si se cumplen estas reglas:

- consulta iniciada por accion explicita del usuario,
- pausa minima aproximada de 1 segundo entre peticiones,
- cache local obligatoria,
- no repetir busquedas ya resueltas,
- revision humana de resultados ambiguos,
- no usar como busqueda continua ni autocompletado en tiempo real.

La app estatica de `github-pages/` sigue este enfoque: no geocodifica mientras el usuario escribe y guarda resultados en `localStorage`.

## Particion por capas

Reglas:

- Si hay mas de 10 capas, fusionar categorias o dividir en mapas.
- Si una capa supera 1.800 filas, preparar subcapas antes de llegar al limite de 2.000.
- Si el mapa supera 10.000 elementos, crear mapas separados o migrar a un visor propio.

## KML opcional

El KML debe generarse desde el CSV validado, no directamente desde una lista original.

Orden recomendado:

1. Validar CSV.
2. Filtrar `estado != por_confirmar`.
3. Excluir filas sin `latitude` o `longitude`.
4. Generar `Placemark` con `ExtendedData`.
5. Validar XML.

## KML para My Maps

La variante de My Maps debe seguir una plantilla conservadora:

```xml
<Style id="style-categoria">
  <IconStyle>
    <color>ff4370ff</color>
    <scale>1.1</scale>
    <Icon><href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href></Icon>
  </IconStyle>
</Style>

<Placemark id="restaurante_ejemplo">
  <name>Nombre visible</name>
  <styleUrl>#style-categoria</styleUrl>
  <ExtendedData>
    <Data name="id_lugar"><value>restaurante_ejemplo</value></Data>
    <Data name="categoria"><value>Gastronomia</value></Data>
    <Data name="icono_fuente"><value>Material Symbols - restaurant</value></Data>
    <Data name="color_hex"><value>#FF7043</value></Data>
  </ExtendedData>
  <description>Texto plano breve</description>
  <Point><coordinates>lon,lat,0</coordinates></Point>
</Placemark>
```

Reglas:

- no usar `Folder`,
- no usar `hotSpot`,
- no meter metadatos principales en `description`,
- no incluir filas `por_confirmar`,
- definir los estilos antes de los `Placemark`,
- enlazar iconos remotos y no almacenar iconos locales,
- convertir `color_hex` a color KML `aabbggrr`.

## Mejoras futuras

- Script para dividir CSV por capa.
- Script para generar KML desde CSV validado.
- Script para generar GeoJSON para visor web.
- Integracion opcional con Google Places API.
