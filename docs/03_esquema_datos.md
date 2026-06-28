# Esquema de datos

## Tabla principal: lugares

| Campo | Obligatorio | Tipo | Descripcion |
|---|---:|---|---|
| `id_lugar` | si | texto | Identificador estable en snake_case. |
| `nombre_visible` | si | texto | Nombre que vera el usuario en el mapa. |
| `nombre_original` | si | texto | Texto recibido originalmente. |
| `estado` | si | enum | `confirmado`, `revisar`, `por_confirmar`. |
| `direccion` | no | texto | Direccion postal o descripcion ubicable. |
| `google_place_id` | no | texto | Identificador estable de Google Places, si se usa. |
| `capa` | si | texto | Capa de My Maps. |
| `categoria` | si | texto | Categoria principal. |
| `subcategoria` | no | texto | Subtipo del lugar. |
| `prioridad` | no | enum | `imprescindible`, `recomendable`, `opcional`. |
| `tamano_icono` | no | enum | `grande`, `normal`, `pequeno`. |
| `icono_recomendado` | no | texto | Nombre funcional del icono recomendado. |
| `color_hex` | no | texto | Color asociado en formato `#RRGGBB`, por ejemplo `#4CAF50`. |
| `latitude` | si, si confirmado | decimal | Latitud decimal. |
| `longitude` | si, si confirmado | decimal | Longitud decimal. |
| `descripcion_breve` | no | texto | Resumen util y conciso. |
| `datos_interes` | no | texto | Detalle practico, historico o turistico. |
| `enlace_util` | no | URL | Fuente oficial o enlace informativo. |
| `image_url` | no | URL | Imagen publica o compartible. |
| `video_url` | no | URL | Video publico o compartible. |
| `media_credit` | no | texto | Autor, licencia o procedencia. |
| `nivel_confianza` | si | enum | `alto`, `medio`, `bajo`. |
| `nota_desambiguacion` | condicional | texto | Obligatoria si `estado != confirmado` o `nivel_confianza != alto`. |
| `wkt` | no | texto | Geometria WKT para lineas o poligonos, si aplica. |
| `fuentes_consultadas` | no | texto | URLs o referencias usadas. |

## Reglas de identificadores

- Usar minusculas, sin acentos y con guiones bajos.
- Mantener el mismo `id_lugar` entre versiones.
- No reutilizar IDs para lugares diferentes.

Ejemplos:

- `goldenes_dachl`
- `estacion_central_innsbruck`
- `restaurante_die_wilderin`

## Reglas de capas

Cada lugar debe pertenecer a una sola capa primaria.

Ejemplos de capas:

- `Dia 01 - Llegada`
- `Gastronomia`
- `Visitar y Cultura`
- `Naturaleza`
- `Logistica y Transporte`

Limites de diseno:

- Maximo 10 capas por mapa.
- Maximo 2.000 filas por importacion/capa.
- Planificar particion si una capa supera 1.800 filas.

## Reglas de multimedia

`image_url` debe ser:

- URL publica directa a imagen, o
- enlace compartible a Google Drive/Photos, o
- vacio si no hay medio fiable.

`video_url` debe ser:

- enlace a YouTube, Google Drive, Vimeo o pagina publica.

Evitar:

- URLs privadas.
- Imagenes sin permiso claro si el mapa va a publicarse.
- HTML complejo que dependa de scripts, `iframe` o imagenes embebidas.

Para My Maps, tratar `image_url` y `video_url` como referencias/enlaces. Para fotos visibles, preferir la funcion nativa de fotos de My Maps o importacion desde Google Drive/Photos.

## Reglas de estilos KML para My Maps

Los estilos KML para My Maps se generan desde una configuracion por categoria:

- `color_hex` se guarda como dato legible.
- El KML convierte `color_hex` a formato KML `aabbggrr`.
- El icono se enlaza por URL remota; no se almacenan iconos locales.
- `ExtendedData` incluye `icono_fuente` y `color_hex`.
- `tamano_icono` se traduce a `<scale>`: `grande = 1.3`, `normal = 1.1`, `pequeno = 0.9`.
- `prioridad` permite diferenciar importancia sin cambiar la categoria.

Ejemplo:

```xml
<Style id="style-gastronomia">
  <IconStyle>
    <color>ff4370ff</color>
    <scale>1.1</scale>
    <Icon><href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href></Icon>
  </IconStyle>
</Style>
```

En una fase posterior, el usuario podra cambiar los colores antes de descargar el KML para My Maps.

## Reglas de coordenadas

- No adivinar coordenadas.
- Si `estado = por_confirmar`, dejar `latitude` y `longitude` vacios.
- Si hay direccion pero no coordenadas verificadas, dejar coordenadas vacias.
- Latitud valida: `-90` a `90`.
- Longitud valida: `-180` a `180`.
- En KML, invertir a `longitude,latitude,0`.

## CSV canonico

El CSV debe usar estas columnas, en este orden:

```csv
id_lugar,nombre_visible,nombre_original,estado,direccion,google_place_id,capa,categoria,subcategoria,prioridad,tamano_icono,icono_recomendado,color_hex,latitude,longitude,descripcion_breve,datos_interes,enlace_util,image_url,video_url,media_credit,nivel_confianza,nota_desambiguacion,wkt,fuentes_consultadas
```
