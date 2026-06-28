# Metodologia reutilizable para crear mapas

## 1. Entradas

Cada proyecto debe aportar, como minimo:

- `[NOMBRE_PROYECTO]`: nombre visible del mapa.
- `[ZONA_BASE]`: ciudad, region o pais que sirve de contexto geografico.
- `[OBJETIVO_MAPA]`: viaje, guia gastronomica, ruta cultural, logistica, etc.
- `[FECHAS_O_DURACION]`: opcional, por ejemplo `10 dias`, `2026-08-01 a 2026-08-10`.
- `[IDIOMA_SALIDA]`: idioma del mapa y de las descripciones.
- `[LISTA_LUGARES]`: lugares originales, aunque esten incompletos o duplicados.
- `[PREFERENCIA_CAPAS]`: por categoria, por dia, por zona, por prioridad o mixta.
- `[FUENTES_PRIORITARIAS]`: fuentes oficiales, turismo local, Wikipedia, webs propias, etc.

## 2. Fuente de verdad

El CSV o Google Sheets es la fuente principal de verdad del proyecto.

El KML no debe usarse como fuente principal de mantenimiento en My Maps. Se reserva para:

- copia de seguridad,
- Google Earth,
- visores externos,
- intercambio puntual,
- reconstruccion completa del mapa.

Regla operativa: no importar CSV y KML completos en el mismo mapa salvo que se este creando una version separada, porque puede duplicar marcadores.

## 3. Normalizacion

Para cada entrada:

- Conservar el texto original.
- Normalizar nombre, acentos, variantes y traducciones conocidas.
- Detectar duplicados y posibles equivalencias.
- Identificar categoria probable.
- Buscar candidatos reales coherentes con `[ZONA_BASE]`.
- Desambiguar usando cercania geografica, contexto, relevancia y categoria.

## 4. Modelo de decision

Seleccionar una coincidencia solo cuando sea razonable. Si no lo es:

- Marcar `estado = por_confirmar`.
- Proponer 1-3 alternativas.
- Explicar la duda en `nota_desambiguacion`.
- No inventar coordenadas ni enlaces.

Niveles de confianza:

- `alto`: lugar inequivoco y coordenadas verificables.
- `medio`: lugar probable, pero con alguna ambiguedad menor.
- `bajo`: coincidencia incierta o dependiente de supuestos.

Regla anti-alucinacion de coordenadas: si no hay latitud y longitud verificadas, no interpolar ni aproximar por ciudad o zona. Dejar `latitude` y `longitude` vacios y marcar `estado = por_confirmar`.

## 5. Enriquecimiento

Cada lugar debe incluir:

- ID estable.
- Nombre visible.
- Nombre original.
- Direccion, si se conoce.
- Google Place ID, si se usa Google Places.
- Coordenadas en formato decimal.
- Categoria y subcategoria.
- Capa asignada.
- Icono recomendado.
- Descripcion breve.
- Datos de interes.
- Enlace util.
- Enlaces multimedia opcionales.
- Nivel de confianza.
- Nota de desambiguacion.
- WKT opcional para lineas o poligonos.

## 6. Capas

Elegir una estrategia y mantenerla en todo el proyecto:

- Por categoria: gastronomia, cultura, naturaleza, alojamiento, transporte.
- Por dia: dia 1, dia 2, dia 3.
- Por zona: centro, norte, valle, costa, alrededores.
- Por prioridad: imprescindible, recomendable, opcional.

Regla practica: si el mapa es para viajar dia a dia, usar capas por dia. Si es una guia reutilizable, usar capas por categoria.

Limites practicos:

- Maximo 10 capas por mapa.
- Maximo 2.000 filas por importacion/capa.
- Si una capa supera 1.800 filas, planificar division antes de importar.

## 7. Salidas

Generar siempre:

- Tabla resumen de reconocimiento.
- CSV mantenible.
- Lista de advertencias.
- Lista de lugares por confirmar.

Generar opcionalmente:

- KML de backup o Google Earth.
- GeoJSON para visor web.

Formato de coordenadas:

- CSV: `latitude`, `longitude`.
- KML: `longitude,latitude,0`.

## 8. Multimedia

Campos admitidos:

- `image_url`: URL publica directa o compartible.
- `video_url`: URL de YouTube, Drive, Vimeo u otra pagina publica.
- `media_credit`: autor, licencia o procedencia.

Recomendacion:

- Para fotos geolocalizadas, importar desde Google Photos o Google Drive cuando sea posible.
- Para medios por marcador, usar enlaces robustos dentro de la descripcion.
- Evitar depender de `iframe` o embeds avanzados, porque My Maps puede no conservarlos.
- No hacer que una imagen embebida sea necesaria para entender el marcador.

## 9. Rutas y geometria

My Maps no es un optimizador de rutas. Para viajes:

- Usar capas por dia.
- Mantener rutas manuales con pocas paradas.
- Usar `wkt` para lineas o poligonos cuando se quiera importar geometria desde CSV.
- Para optimizacion real, usar herramientas externas o APIs de rutas y exportar el resultado.

## 10. Validacion

Antes de importar:

- Comprobar que el KML es XML valido.
- Confirmar que no hay coordenadas invertidas.
- Verificar que cada `styleUrl` existe.
- Confirmar que cada lugar tiene `id_lugar` estable.
- Revisar que las capas no exceden los limites de My Maps.
- Separar los lugares `por_confirmar`.
- Ejecutar `scripts/validate_lugares.py` sobre el CSV maestro.
