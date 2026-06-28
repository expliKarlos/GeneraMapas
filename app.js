const CANONICAL_COLUMNS = [
  "id_lugar",
  "nombre_visible",
  "nombre_original",
  "estado",
  "direccion",
  "google_place_id",
  "capa",
  "categoria",
  "subcategoria",
  "icono_recomendado",
  "color_hex",
  "latitude",
  "longitude",
  "descripcion_breve",
  "datos_interes",
  "enlace_util",
  "image_url",
  "video_url",
  "media_credit",
  "nivel_confianza",
  "nota_desambiguacion",
  "wkt",
  "fuentes_consultadas",
];

const CATEGORY_RULES = [
  { match: /restaurante|restaurant|bar|cafe|mercado|comer|gastr/i, categoria: "Gastronomia", subcategoria: "Restaurantes", icono: "Utensils", color: "#FF7043" },
  { match: /hotel|hostal|apartamento|alojamiento|lodging/i, categoria: "Alojamiento", subcategoria: "Alojamiento", icono: "Lodging", color: "#7E57C2" },
  { match: /estacion|aeropuerto|parking|tren|bus|metro/i, categoria: "Logistica y Transporte", subcategoria: "Estaciones", icono: "Directions transit", color: "#607D8B" },
  { match: /parque|jardin|rio|lago|monte|mirador|sendero|valle|playa/i, categoria: "Naturaleza", subcategoria: "Senderismo y Miradores Naturales", icono: "Mountain", color: "#4CAF50" },
  { match: /tienda|compras|mall|centro comercial/i, categoria: "Compras y Servicios", subcategoria: "Zonas Comerciales y Tiendas", icono: "Shopping bag", color: "#1A73E8" },
];

const DEFAULT_CATEGORY = {
  categoria: "Visitar y Cultura",
  subcategoria: "Monumentos y Puntos Historicos",
  icono: "Museum",
  color: "#4DD0E1",
};

const KML_CATEGORY_STYLES = {
  "Gastronomia": {
    id: "style-gastronomia",
    color: "ff4370ff",
    icon: "https://maps.google.com/mapfiles/kml/paddle/orange-circle.png",
  },
  "Visitar y Cultura": {
    id: "style-cultura",
    color: "ffe1d04d",
    icon: "https://maps.google.com/mapfiles/kml/paddle/ltblu-circle.png",
  },
  "Compras y Servicios": {
    id: "style-compras",
    color: "ffe8731a",
    icon: "https://maps.google.com/mapfiles/kml/paddle/blu-circle.png",
  },
  "Naturaleza": {
    id: "style-naturaleza",
    color: "ff50af4c",
    icon: "https://maps.google.com/mapfiles/kml/paddle/grn-circle.png",
  },
  "Alojamiento": {
    id: "style-alojamiento",
    color: "ffc2577e",
    icon: "https://maps.google.com/mapfiles/kml/paddle/purple-circle.png",
  },
  "Logistica y Transporte": {
    id: "style-transporte",
    color: "ff8b7d60",
    icon: "https://maps.google.com/mapfiles/kml/paddle/wht-circle.png",
  },
};

const DEFAULT_KML_STYLE = {
  id: "style-generico",
  color: "ff8b7d60",
  icon: "https://maps.google.com/mapfiles/kml/paddle/wht-circle.png",
};

const state = {
  rows: [],
  stopRequested: false,
  osmRequests: 0,
};

const els = {
  projectName: document.querySelector("#projectName"),
  baseZone: document.querySelector("#baseZone"),
  layerStrategy: document.querySelector("#layerStrategy"),
  mapVersion: document.querySelector("#mapVersion"),
  placesInput: document.querySelector("#placesInput"),
  parseButton: document.querySelector("#parseButton"),
  geocodeButton: document.querySelector("#geocodeButton"),
  stopButton: document.querySelector("#stopButton"),
  loadExampleButton: document.querySelector("#loadExampleButton"),
  importCsvButton: document.querySelector("#importCsvButton"),
  csvFileInput: document.querySelector("#csvFileInput"),
  resetButton: document.querySelector("#resetButton"),
  table: document.querySelector("#placesTable"),
  rowSummary: document.querySelector("#rowSummary"),
  checks: document.querySelector("#checks"),
  exportStatus: document.querySelector("#exportStatus"),
  osmCount: document.querySelector("#osmCount"),
  cacheCount: document.querySelector("#cacheCount"),
  readyCount: document.querySelector("#readyCount"),
  exportMasterButton: document.querySelector("#exportMasterButton"),
  exportLayersButton: document.querySelector("#exportLayersButton"),
  exportKmlButton: document.querySelector("#exportKmlButton"),
  exportMyMapsKmlButton: document.querySelector("#exportMyMapsKmlButton"),
  exportGuideButton: document.querySelector("#exportGuideButton"),
};

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64) || "lugar";
}

function detectCategory(text) {
  const normalized = String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return CATEGORY_RULES.find((rule) => rule.match.test(normalized)) || DEFAULT_CATEGORY;
}

function getLayer(text, category) {
  const strategy = els.layerStrategy.value;
  if (strategy === "categoria") return category.categoria;
  if (strategy === "dia") return "Dia 01";
  if (strategy === "zona") return els.baseZone.value || "Zona principal";
  if (strategy === "prioridad") return "Recomendado";
  return category.categoria;
}

function parsePlaces() {
  const lines = els.placesInput.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const seen = new Map();
  state.rows = lines.map((line, index) => {
    const category = detectCategory(line);
    const baseId = slugify(line);
    const count = (seen.get(baseId) || 0) + 1;
    seen.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}_${count}`;
    return {
      id_lugar: id,
      nombre_visible: line,
      nombre_original: line,
      estado: "revisar",
      direccion: "",
      google_place_id: "",
      capa: getLayer(line, category),
      categoria: category.categoria,
      subcategoria: category.subcategoria,
      icono_recomendado: category.icono,
      color_hex: category.color,
      latitude: "",
      longitude: "",
      descripcion_breve: "",
      datos_interes: "",
      enlace_util: "",
      image_url: "",
      video_url: "",
      media_credit: "",
      nivel_confianza: "medio",
      nota_desambiguacion: "Pendiente de revisar/geocodificar.",
      wkt: "",
      fuentes_consultadas: "",
      _index: index + 1,
    };
  });
  persistDraft();
  render();
}

function getCache() {
  try {
    return JSON.parse(localStorage.getItem("mapas_geocode_cache") || "{}");
  } catch {
    return {};
  }
}

function setCache(cache) {
  localStorage.setItem("mapas_geocode_cache", JSON.stringify(cache));
}

function cacheKey(query) {
  return slugify(query).slice(0, 120);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocodePending() {
  state.stopRequested = false;
  els.stopButton.disabled = false;
  setStatus("Geocodificando", "busy");
  const cache = getCache();

  for (const row of state.rows) {
    if (state.stopRequested) break;
    if (row.latitude && row.longitude) continue;

    const query = `${row.nombre_original}, ${els.baseZone.value}`.trim();
    const key = cacheKey(query);
    let result = cache[key];

    if (!result) {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("q", query);
      url.searchParams.set("limit", "1");
      url.searchParams.set("accept-language", "es");
      await sleep(1050);
      const response = await fetch(url.toString(), {
        headers: { "Accept": "application/json" },
      });
      if (!response.ok) {
        row.estado = "por_confirmar";
        row.nota_desambiguacion = `Nominatim devolvio HTTP ${response.status}.`;
        render();
        continue;
      }
      const data = await response.json();
      result = data[0] || null;
      cache[key] = result;
      setCache(cache);
      state.osmRequests += 1;
    }

    if (result && result.lat && result.lon) {
      row.nombre_visible = result.name || row.nombre_visible;
      row.direccion = result.display_name || row.direccion;
      row.latitude = Number(result.lat).toFixed(6);
      row.longitude = Number(result.lon).toFixed(6);
      row.estado = "confirmado";
      row.nivel_confianza = "medio";
      row.nota_desambiguacion = "Coordenadas obtenidas de Nominatim; revisar si hay homonimos.";
      row.fuentes_consultadas = "Nominatim/OpenStreetMap";
    } else {
      row.estado = "por_confirmar";
      row.nivel_confianza = "bajo";
      row.nota_desambiguacion = "Sin resultado en Nominatim con la zona base indicada.";
    }
    persistDraft();
    render();
  }

  els.stopButton.disabled = true;
  setStatus(state.stopRequested ? "Detenido" : "Listo", state.stopRequested ? "error" : "ready");
  state.stopRequested = false;
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function rowsToCsv(rows) {
  return [
    CANONICAL_COLUMNS.join(","),
    ...rows.map((row) => CANONICAL_COLUMNS.map((column) => csvEscape(row[column])).join(",")),
  ].join("\r\n");
}

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(current);
      current = "";
    } else if (char === "\n") {
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
    } else if (char !== "\r") {
      current += char;
    }
  }
  row.push(current);
  rows.push(row);
  return rows.filter((item) => item.some((cell) => cell.trim()));
}

function importCsvText(text) {
  const parsed = parseCsv(text);
  if (parsed.length < 2) return;
  const headers = parsed[0].map((header) => header.trim());
  state.rows = parsed.slice(1).map((cells, index) => {
    const row = {};
    headers.forEach((header, cellIndex) => {
      row[header] = cells[cellIndex] || "";
    });
    for (const column of CANONICAL_COLUMNS) {
      if (!(column in row)) row[column] = "";
    }
    row.id_lugar = row.id_lugar || slugify(row.nombre_visible || row.nombre_original || `lugar_${index + 1}`);
    row.estado = row.estado || "revisar";
    row.nivel_confianza = row.nivel_confianza || "medio";
    return row;
  });
  els.placesInput.value = state.rows.map((row) => row.nombre_original || row.nombre_visible).join("\n");
  persistDraft();
  render();
}

function downloadFile(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function projectSlug() {
  return slugify(els.projectName.value || "mapa");
}

function exportMaster() {
  downloadFile(`lugares_${projectSlug()}_maestro.csv`, rowsToCsv(state.rows), "text/csv;charset=utf-8");
}

function exportLayers() {
  const groups = Map.groupBy ? Map.groupBy(state.rows, (row) => row.capa || "Sin capa") : groupByLayer(state.rows);
  for (const [layer, rows] of groups.entries()) {
    downloadFile(`lugares_${projectSlug()}_${slugify(layer)}.csv`, rowsToCsv(rows), "text/csv;charset=utf-8");
  }
}

function groupByLayer(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = row.capa || "Sin capa";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return groups;
}

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cdata(value) {
  return String(value || "").replace(/]]>/g, "]]]]><![CDATA[>");
}

function exportKml() {
  const valid = state.rows.filter((row) => row.latitude && row.longitude && row.estado !== "por_confirmar");
  const placemarks = valid.map((row) => {
    const description = [
      `<p><b>Nombre original:</b> ${xmlEscape(row.nombre_original)}</p>`,
      `<p><b>Categoria:</b> ${xmlEscape(row.categoria)} / ${xmlEscape(row.subcategoria)}</p>`,
      row.direccion ? `<p><b>Direccion:</b> ${xmlEscape(row.direccion)}</p>` : "",
      row.enlace_util ? `<p><a href="${xmlEscape(row.enlace_util)}">Mas informacion</a></p>` : "",
      row.image_url ? `<p><a href="${xmlEscape(row.image_url)}">Ver foto</a></p>` : "",
      row.video_url ? `<p><a href="${xmlEscape(row.video_url)}">Ver video</a></p>` : "",
    ].filter(Boolean).join("");
    return `    <Placemark id="${xmlEscape(row.id_lugar)}">
      <name>${xmlEscape(row.nombre_visible)}</name>
      <description><![CDATA[${cdata(description)}]]></description>
      <ExtendedData>
        <Data name="id_lugar"><value>${xmlEscape(row.id_lugar)}</value></Data>
        <Data name="categoria"><value>${xmlEscape(row.categoria)}</value></Data>
        <Data name="capa"><value>${xmlEscape(row.capa)}</value></Data>
      </ExtendedData>
      <Point><coordinates>${row.longitude},${row.latitude},0</coordinates></Point>
    </Placemark>`;
  }).join("\n");

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${xmlEscape(els.projectName.value)} - backup KML</name>
${placemarks}
  </Document>
</kml>`;
  downloadFile(`mapa_${projectSlug()}_backup.kml`, kml, "application/vnd.google-earth.kml+xml;charset=utf-8");
}

function styleForCategory(category) {
  return KML_CATEGORY_STYLES[category] || DEFAULT_KML_STYLE;
}

function kmlStylesForRows(rows) {
  const usedStyles = new Map();
  rows.forEach((row) => {
    const style = styleForCategory(row.categoria);
    usedStyles.set(style.id, style);
  });
  return [...usedStyles.values()].map((style) => `    <Style id="${style.id}">
      <IconStyle>
        <color>${style.color}</color>
        <scale>1.1</scale>
        <Icon><href>${xmlEscape(style.icon)}</href></Icon>
      </IconStyle>
    </Style>`).join("\n");
}

function extendedDataForRow(row) {
  const dataFields = {
    id_lugar: row.id_lugar,
    categoria: row.categoria,
    subcategoria: row.subcategoria,
    capa: row.capa,
    estado: row.estado,
    direccion: row.direccion,
    google_place_id: row.google_place_id,
    enlace_util: row.enlace_util,
    image_url: row.image_url,
    video_url: row.video_url,
    nivel_confianza: row.nivel_confianza,
    fuentes_consultadas: row.fuentes_consultadas,
  };
  return Object.entries(dataFields)
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(([name, value]) => `        <Data name="${xmlEscape(name)}"><value>${xmlEscape(value)}</value></Data>`)
    .join("\n");
}

function plainDescription(row) {
  return [
    row.descripcion_breve,
    row.datos_interes,
    row.nota_desambiguacion ? `Nota: ${row.nota_desambiguacion}` : "",
  ].filter(Boolean).join(" ");
}

function exportMyMapsKml() {
  const valid = state.rows.filter((row) => row.latitude && row.longitude && row.estado !== "por_confirmar");
  const styles = kmlStylesForRows(valid);
  const placemarks = valid.map((row) => {
    const style = styleForCategory(row.categoria);
    return `    <Placemark id="${xmlEscape(row.id_lugar)}">
      <name>${xmlEscape(row.nombre_visible)}</name>
      <styleUrl>#${style.id}</styleUrl>
      <ExtendedData>
${extendedDataForRow(row)}
      </ExtendedData>
      <description><![CDATA[${cdata(plainDescription(row))}]]></description>
      <Point><coordinates>${row.longitude},${row.latitude},0</coordinates></Point>
    </Placemark>`;
  }).join("\n");

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${xmlEscape(els.projectName.value)} - KML My Maps</name>
${styles}
${placemarks}
  </Document>
</kml>`;
  downloadFile(`mapa_${projectSlug()}_mymaps.kml`, kml, "application/vnd.google-earth.kml+xml;charset=utf-8");
}

function exportGuide() {
  const guide = `# Instrucciones de importacion - ${els.projectName.value}

Version sugerida del mapa: ${els.projectName.value} ${els.mapVersion.value}
Zona base: ${els.baseZone.value}

## Flujo recomendado

1. Abre Google My Maps.
2. Crea un mapa nuevo o una nueva version.
3. Importa el CSV maestro o los CSV por capas.
4. Usa latitude y longitude como columnas de ubicacion.
5. Usa nombre_visible como titulo.
6. Estila por la columna categoria.
7. Para mantenimiento, reimporta con Update matching items usando id_lugar.

## Notas

- No importes CSV y KML completos en el mismo mapa operativo.
- El KML exportado es backup o Google Earth.
- El KML para My Maps usa estilos en Document, sin Folder y con metadatos en ExtendedData.
- Revisa manualmente los lugares con estado revisar o por_confirmar.
`;
  downloadFile(`instrucciones_${projectSlug()}.md`, guide, "text/markdown;charset=utf-8");
}

function render() {
  els.table.innerHTML = "";
  const fragment = document.createDocumentFragment();
  state.rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(row.nombre_original)}</td>
      <td><input class="cell-input" name="nombre_visible_${index}" aria-label="Lugar estandarizado ${index + 1}" data-index="${index}" data-field="nombre_visible" value="${escapeAttr(row.nombre_visible)}" /></td>
      <td><input class="cell-input" name="capa_${index}" aria-label="Capa ${index + 1}" data-index="${index}" data-field="capa" value="${escapeAttr(row.capa)}" /></td>
      <td>
        <select class="cell-select" name="categoria_${index}" aria-label="Categoria ${index + 1}" data-index="${index}" data-field="categoria">
          ${categoryOptions(row.categoria)}
        </select>
      </td>
      <td><input class="cell-input narrow" name="latitude_${index}" aria-label="Latitud ${index + 1}" data-index="${index}" data-field="latitude" value="${escapeAttr(row.latitude)}" /></td>
      <td><input class="cell-input narrow" name="longitude_${index}" aria-label="Longitud ${index + 1}" data-index="${index}" data-field="longitude" value="${escapeAttr(row.longitude)}" /></td>
      <td>
        <select class="cell-select" name="estado_${index}" aria-label="Estado ${index + 1}" data-index="${index}" data-field="estado">
          ${stateOptions(row.estado)}
        </select>
      </td>
      <td><button class="delete-button" type="button" data-delete="${index}" aria-label="Eliminar fila ${index + 1}">x</button></td>
    `;
    fragment.appendChild(tr);
  });
  els.table.appendChild(fragment);
  els.rowSummary.textContent = `${state.rows.length} lugares`;
  els.osmCount.textContent = String(state.osmRequests);
  els.cacheCount.textContent = String(Object.keys(getCache()).length);
  els.readyCount.textContent = String(state.rows.filter((row) => row.latitude && row.longitude).length);
  renderChecks();
}

function categoryOptions(selected) {
  const categories = [
    "Gastronomia",
    "Visitar y Cultura",
    "Compras y Servicios",
    "Naturaleza",
    "Alojamiento",
    "Logistica y Transporte",
  ];
  return categories.map((category) => `<option value="${escapeAttr(category)}"${category === selected ? " selected" : ""}>${escapeHtml(category)}</option>`).join("");
}

function stateOptions(selected) {
  return ["confirmado", "revisar", "por_confirmar"]
    .map((estado) => `<option value="${estado}"${estado === selected ? " selected" : ""}>${estado}</option>`)
    .join("");
}

function renderChecks() {
  const layers = new Set(state.rows.map((row) => row.capa).filter(Boolean));
  const invalidCoordinates = state.rows.filter((row) => {
    const lat = Number(row.latitude);
    const lon = Number(row.longitude);
    return row.latitude && row.longitude && (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180);
  }).length;
  const checks = [
    { label: "Lista no vacia", value: state.rows.length ? `${state.rows.length} filas` : "pendiente", ok: state.rows.length > 0 },
    { label: "Capas <= 10", value: `${layers.size} capas`, ok: layers.size <= 10 },
    { label: "Coordenadas validas", value: invalidCoordinates ? `${invalidCoordinates} errores` : "OK", ok: invalidCoordinates === 0 },
    { label: "Importacion final manual", value: "My Maps", ok: true },
  ];
  els.checks.innerHTML = checks.map((check) => `
    <div class="check ${check.ok ? "check-ok" : "check-error"}">
      <span>${check.label}</span>
      <strong>${check.value}</strong>
    </div>
  `).join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function updateRow(index, field, value) {
  const row = state.rows[index];
  if (!row) return;
  row[field] = value;
  if (field === "categoria") {
    const rule = CATEGORY_RULES.find((item) => item.categoria === value) || DEFAULT_CATEGORY;
    row.subcategoria = rule.subcategoria;
    row.icono_recomendado = rule.icono;
    row.color_hex = rule.color;
    if (els.layerStrategy.value === "categoria") row.capa = value;
  }
  persistDraft();
  render();
}

function setStatus(text, type) {
  els.exportStatus.textContent = text;
  els.exportStatus.className = `status-dot status-${type}`;
}

function persistDraft() {
  const data = {
    projectName: els.projectName.value,
    baseZone: els.baseZone.value,
    layerStrategy: els.layerStrategy.value,
    mapVersion: els.mapVersion.value,
    placesInput: els.placesInput.value,
    rows: state.rows,
  };
  localStorage.setItem("mapas_draft", JSON.stringify(data));
}

function restoreDraft() {
  const raw = localStorage.getItem("mapas_draft");
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    els.projectName.value = data.projectName || els.projectName.value;
    els.baseZone.value = data.baseZone || els.baseZone.value;
    els.layerStrategy.value = data.layerStrategy || els.layerStrategy.value;
    els.mapVersion.value = data.mapVersion || els.mapVersion.value;
    els.placesInput.value = data.placesInput || "";
    state.rows = data.rows || [];
  } catch {
    localStorage.removeItem("mapas_draft");
  }
}

function loadExample() {
  els.projectName.value = "Viaje Innsbruck";
  els.baseZone.value = "Innsbruck, Austria";
  els.placesInput.value = [
    "Goldenes Dachl",
    "Hofburg Innsbruck",
    "Nordkette",
    "Estacion central de Innsbruck",
    "Castillo de Ambras",
    "Markthalle Innsbruck",
  ].join("\n");
  parsePlaces();
}

els.parseButton.addEventListener("click", parsePlaces);
els.geocodeButton.addEventListener("click", geocodePending);
els.stopButton.addEventListener("click", () => { state.stopRequested = true; });
els.loadExampleButton.addEventListener("click", loadExample);
els.importCsvButton.addEventListener("click", () => els.csvFileInput.click());
els.csvFileInput.addEventListener("change", async () => {
  const file = els.csvFileInput.files[0];
  if (!file) return;
  importCsvText(await file.text());
  els.csvFileInput.value = "";
});
els.resetButton.addEventListener("click", () => {
  localStorage.removeItem("mapas_draft");
  state.rows = [];
  els.placesInput.value = "";
  render();
});
els.exportMasterButton.addEventListener("click", exportMaster);
els.exportLayersButton.addEventListener("click", exportLayers);
els.exportKmlButton.addEventListener("click", exportKml);
els.exportMyMapsKmlButton.addEventListener("click", exportMyMapsKml);
els.exportGuideButton.addEventListener("click", exportGuide);
els.table.addEventListener("change", (event) => {
  const target = event.target;
  if (!target.dataset || target.dataset.index == null) return;
  updateRow(Number(target.dataset.index), target.dataset.field, target.value);
});
els.table.addEventListener("input", (event) => {
  const target = event.target;
  if (!target.dataset || target.dataset.index == null || target.tagName === "SELECT") return;
  const row = state.rows[Number(target.dataset.index)];
  if (!row) return;
  row[target.dataset.field] = target.value;
  persistDraft();
});
els.table.addEventListener("click", (event) => {
  const target = event.target;
  if (!target.dataset || target.dataset.delete == null) return;
  state.rows.splice(Number(target.dataset.delete), 1);
  persistDraft();
  render();
});

for (const input of [els.projectName, els.baseZone, els.layerStrategy, els.mapVersion, els.placesInput]) {
  input.addEventListener("input", persistDraft);
}

restoreDraft();
render();
