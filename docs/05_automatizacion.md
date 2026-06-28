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
  -> Preparar tabla
  -> Resolver nombres con IA opcional
  -> Buscar candidatos OSM
  -> Confirmacion humana del candidato correcto
  -> CSV maestro
  -> Validacion automatica
  -> CSV por capas
  -> Google My Maps
```

## Geocodificacion

Para maxima fiabilidad:

1. Usar el LLM para limpiar nombres, categorias, subcategorias, capas y consulta OSM.
2. Usar un geocoder real para candidatos de coordenadas:
   - Google Places API / Geocoding API si hay presupuesto y proyecto GCP.
   - Nominatim/OpenStreetMap si el volumen es bajo y se respetan sus politicas.
3. Mostrar varios candidatos cuando sea posible.
4. Confirmar manualmente el candidato correcto.
5. Guardar `google_place_id` cuando exista.
6. Mantener `direccion` aunque haya coordenadas, porque ayuda a auditorias humanas.

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

La app estatica de GitHub Pages sigue este enfoque: no geocodifica mientras el usuario escribe, guarda resultados en `localStorage` y separa la busqueda de candidatos de la confirmacion final.

## Resolucion con IA

La IA se usa solo para mejorar la identificacion previa del lugar:

- nombre visible,
- categoria,
- subcategoria,
- capa,
- prioridad,
- consulta OSM sugerida,
- nota de desambiguacion.

No debe generar coordenadas ni sustituir a un geocoder real.

En GitHub Pages la integracion es client-side: el token o API key se introduce en el navegador y se guarda solo en `sessionStorage`.

Proveedores disponibles:

- `GitHub Models`: opcion recomendada para uso libre. Cada usuario introduce su token de GitHub con permiso `models:read`, asi el consumo no queda asociado a una API del autor.
- `OpenAI`: alternativa para usuarios que prefieran usar su propia API key de OpenAI.

Esto es aceptable para pruebas o uso personal controlado. Para una app publica con login comodo, el siguiente paso tecnico recomendable es un backend ligero que:

- proteja la API key,
- limite cuotas,
- registre errores,
- aplique validaciones antes de llamar al modelo.

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
    <Data name="prioridad"><value>imprescindible</value></Data>
    <Data name="tamano_icono"><value>grande</value></Data>
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
- convertir `color_hex` a color KML `aabbggrr`,
- convertir `tamano_icono` a `<scale>`.

Escala recomendada:

- `grande`: `1.3`
- `normal`: `1.1`
- `pequeno`: `0.9`

La opcion avanzada de pre-renderizar iconos Material Symbols queda reservada para una fase posterior, porque requiere generar y alojar imagenes PNG por combinacion de icono, color y tamano.

## Mejoras futuras

- Script para dividir CSV por capa.
- Script para generar KML desde CSV validado.
- Script para generar GeoJSON para visor web.
- Integracion opcional con Google Places API.
- Editor de campos avanzados en la app.
- Personalizacion visual de color por categoria antes de descargar KML.
- Pre-renderizado de iconos Material Symbols como PNG alojados remotamente.

## Iconos por subcategoria

La app incluye una tabla interna de iconos Material Symbols generada a partir del archivo de referencia `GoogleIcons.csv` / `GoogleIcons.xlsx`.

Uso actual:

- La subcategoria determina `icono_material` y `icono_code_point`.
- El KML para My Maps conserva esos datos en `ExtendedData`.
- El icono visual KML sigue usando una URL remota compatible con My Maps.

Este enfoque permite guardar la intencion semantica del icono aunque My Maps simplifique la representacion visual al importar.
