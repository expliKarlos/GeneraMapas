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
  "prioridad",
  "tamano_icono",
  "icono_recomendado",
  "color_hex",
  "horario",
  "precio_rango",
  "interior_exterior",
  "wikipedia_url",
  "wikidata_id",
  "osm_id",
  "street_view_url",
  "plus_code",
  "elevacion_m",
  "dificultad",
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

const MAPSPRO_BLANK_ICON = "https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png";

const KML_CATEGORY_STYLES = {
  "Gastronomia": {
    id: "style-gastronomia",
    colorHex: "#FF7043",
    iconHref: MAPSPRO_BLANK_ICON,
    iconSource: "Material Symbols - restaurant",
  },
  "Visitar y Cultura": {
    id: "style-cultura",
    colorHex: "#4DD0E1",
    iconHref: MAPSPRO_BLANK_ICON,
    iconSource: "Material Symbols - museum",
  },
  "Compras y Servicios": {
    id: "style-compras",
    colorHex: "#1A73E8",
    iconHref: MAPSPRO_BLANK_ICON,
    iconSource: "Material Symbols - shopping_bag",
  },
  "Naturaleza": {
    id: "style-naturaleza",
    colorHex: "#4CAF50",
    iconHref: MAPSPRO_BLANK_ICON,
    iconSource: "Material Symbols - park",
  },
  "Alojamiento": {
    id: "style-alojamiento",
    colorHex: "#7E57C2",
    iconHref: MAPSPRO_BLANK_ICON,
    iconSource: "Material Symbols - hotel",
  },
  "Logistica y Transporte": {
    id: "style-transporte",
    colorHex: "#607D8B",
    iconHref: MAPSPRO_BLANK_ICON,
    iconSource: "Material Symbols - directions_transit",
  },
};

const DEFAULT_KML_STYLE = {
  id: "style-generico",
  colorHex: "#607D8B",
  iconHref: MAPSPRO_BLANK_ICON,
  iconSource: "Material Symbols - place",
};

const ICON_SCALE_BY_SIZE = {
  grande: "1.3",
  normal: "1.1",
  pequeno: "0.9",
};

const ICON_SIZE_BY_PRIORITY = {
  imprescindible: "grande",
  recomendable: "normal",
  opcional: "pequeno",
};

const SUBCATEGORY_ICONS = [
  { categoria: "Gastronomia", subcategoria: "Restaurantes", iconName: "restaurant", codePoint: "e56c" },
  { categoria: "Gastronomia", subcategoria: "Cafeterias y Desayunos", iconName: "coffee_maker", codePoint: "eff0" },
  { categoria: "Gastronomia", subcategoria: "Bares y Noche", iconName: "local_bar", codePoint: "e540" },
  { categoria: "Visitar y Cultura", subcategoria: "Monumentos y Puntos Historicos", iconName: "castle", codePoint: "eab1" },
  { categoria: "Visitar y Cultura", subcategoria: "Museos", iconName: "museum", codePoint: "ea36" },
  { categoria: "Visitar y Cultura", subcategoria: "Puntos Fotograficos", iconName: "photo_camera_back", codePoint: "ef68" },
  { categoria: "Compras y Servicios", subcategoria: "Zonas Comerciales y Tiendas", iconName: "local_mall", codePoint: "e54c" },
  { categoria: "Compras y Servicios", subcategoria: "Mercados", iconName: "storefront", codePoint: "ea12" },
  { categoria: "Naturaleza", subcategoria: "Parques y Jardines Urbanos", iconName: "forest", codePoint: "ea99" },
  { categoria: "Naturaleza", subcategoria: "Playas Rios y Costas", iconName: "water", codePoint: "f084" },
  { categoria: "Naturaleza", subcategoria: "Senderismo y Miradores Naturales", iconName: "landscape_2", codePoint: "f4c4" },
  { categoria: "Alojamiento", subcategoria: "Hotel", iconName: "hotel", codePoint: "e53a" },
  { categoria: "Alojamiento", subcategoria: "Alojamiento", iconName: "night_shelter", codePoint: "f1f1" },
  { categoria: "Logistica y Transporte", subcategoria: "Estaciones", iconName: "train", codePoint: "e570" },
  { categoria: "Logistica y Transporte", subcategoria: "Aeropuertos", iconName: "travel", codePoint: "e6ca" },
  { categoria: "Logistica y Transporte", subcategoria: "Parkings", iconName: "local_parking", codePoint: "e54f" },
];

const state = {
  rows: [],
  stopRequested: false,
  osmRequests: 0,
  baseBoundingBox: null,
  baseBoundingBoxKey: "",
};

const els = {
  projectName: document.querySelector("#projectName"),
  baseZone: document.querySelector("#baseZone"),
  countryCode: document.querySelector("#countryCode"),
  layerStrategy: document.querySelector("#layerStrategy"),
  mapVersion: document.querySelector("#mapVersion"),
  placesInput: document.querySelector("#placesInput"),
  parseButton: document.querySelector("#parseButton"),
  resolveAiButton: document.querySelector("#resolveAiButton"),
  searchCandidatesButton: document.querySelector("#searchCandidatesButton"),
  geocodeButton: document.querySelector("#geocodeButton"),
  stopButton: document.querySelector("#stopButton"),
  aiApiKey: document.querySelector("#aiApiKey"),
  aiModel: document.querySelector("#aiModel"),
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
  if (strategy === "prioridad") return priorityLayerName("recomendable");
  return category.categoria;
}

function priorityLayerName(priority) {
  const names = {
    imprescindible: "Imprescindible",
    recomendable: "Recomendable",
    opcional: "Opcional",
  };
  return names[priority] || "Recomendable";
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
      prioridad: "recomendable",
      tamano_icono: "normal",
      icono_recomendado: category.icono,
      color_hex: category.color,
      horario: "",
      precio_rango: "",
      interior_exterior: "",
      wikipedia_url: "",
      wikidata_id: "",
      osm_id: "",
      street_view_url: "",
      plus_code: "",
      elevacion_m: "",
      dificultad: "",
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

function cacheKey(query, suffix = "") {
  return `${slugify(query).slice(0, 120)}${suffix ? `_${slugify(suffix).slice(0, 40)}` : ""}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function countryCodeValue() {
  return String(els.countryCode.value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .slice(0, 2);
}

function candidateLabel(candidate) {
  if (!candidate) return "Sin candidato";
  const type = [candidate.type, candidate.class].filter(Boolean).join(" / ");
  const name = candidate.name || candidate.display_name || "Resultado OSM";
  return `${name}${type ? ` (${type})` : ""}`;
}

function osmId(candidate) {
  if (!candidate || !candidate.osm_type || !candidate.osm_id) return "";
  return `${candidate.osm_type}/${candidate.osm_id}`;
}

function getCandidateQuery(row) {
  const parts = [];
  for (const value of [row._query_osm, row.nombre_visible, row.nombre_original, els.baseZone.value]) {
    const text = String(value || "").trim();
    if (!text) continue;
    const normalized = slugify(text);
    if (parts.some((part) => slugify(part) === normalized)) continue;
    parts.push(text);
  }
  return parts.join(", ");
}

async function getBaseBoundingBox() {
  const baseZone = String(els.baseZone.value || "").trim();
  if (!baseZone) return null;
  const country = countryCodeValue();
  const baseKey = cacheKey(baseZone, country);
  if (state.baseBoundingBox && state.baseBoundingBoxKey === baseKey) return state.baseBoundingBox;
  const key = `bbox_${baseKey}`;
  const cache = getCache();
  if (cache[key]) {
    state.baseBoundingBox = cache[key];
    state.baseBoundingBoxKey = baseKey;
    return cache[key];
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", baseZone);
  url.searchParams.set("limit", "1");
  url.searchParams.set("accept-language", "es");
  if (country) url.searchParams.set("countrycodes", country);

  await sleep(1050);
  const response = await fetch(url.toString(), { headers: { "Accept": "application/json" } });
  if (!response.ok) return null;
  const data = await response.json();
  state.osmRequests += 1;
  const bbox = data[0]?.boundingbox || null;
  if (bbox) {
    cache[key] = bbox;
    setCache(cache);
    state.baseBoundingBox = bbox;
    state.baseBoundingBoxKey = baseKey;
  }
  return bbox;
}

function addBoundingBox(url, bbox) {
  if (!bbox || bbox.length !== 4) return;
  const [south, north, west, east] = bbox;
  url.searchParams.set("viewbox", `${west},${north},${east},${south}`);
  url.searchParams.set("bounded", "0");
}

async function searchNominatimCandidates(row) {
  const query = getCandidateQuery(row);
  const country = countryCodeValue();
  const cache = getCache();
  const bbox = await getBaseBoundingBox();
  const key = cacheKey(query, `${country}_${bbox ? bbox.join("_") : "sin_bbox"}_candidatos`);
  if (cache[key]) return cache[key];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  url.searchParams.set("accept-language", "es");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("extratags", "1");
  url.searchParams.set("namedetails", "1");
  if (country) url.searchParams.set("countrycodes", country);
  addBoundingBox(url, bbox);

  await sleep(1050);
  const response = await fetch(url.toString(), { headers: { "Accept": "application/json" } });
  if (!response.ok) throw new Error(`Nominatim devolvio HTTP ${response.status}`);
  const data = await response.json();
  state.osmRequests += 1;
  cache[key] = data;
  setCache(cache);
  return data;
}

async function searchCandidatesForRows({ autoAcceptFirst = false } = {}) {
  state.stopRequested = false;
  els.stopButton.disabled = false;
  setStatus(autoAcceptFirst ? "Geocodificando" : "Buscando candidatos", "busy");

  for (let index = 0; index < state.rows.length; index += 1) {
    const row = state.rows[index];
    if (state.stopRequested) break;
    if (row.latitude && row.longitude && row.estado === "confirmado") continue;

    try {
      row._candidates = await searchNominatimCandidates(row);
      if (autoAcceptFirst && row._candidates[0]) {
        acceptCandidate(index, 0, { renderAfter: false });
      } else if (row._candidates.length) {
        row.estado = "revisar";
        row.nota_desambiguacion = "OSM encontro candidatos. Elige uno en la tabla antes de exportar.";
      } else {
        row.estado = "por_confirmar";
        row.nivel_confianza = "bajo";
        row.nota_desambiguacion = "Sin candidatos OSM. Prueba a concretar el nombre o usar IA.";
      }
    } catch (error) {
      row.estado = "por_confirmar";
      row.nivel_confianza = "bajo";
      row.nota_desambiguacion = error.message || "Error consultando OSM.";
    }
    persistDraft();
    render();
  }

  els.stopButton.disabled = true;
  setStatus(state.stopRequested ? "Detenido" : "Listo", state.stopRequested ? "error" : "ready");
  state.stopRequested = false;
}

async function geocodePending() {
  await searchCandidatesForRows({ autoAcceptFirst: true });
}

function acceptCandidate(rowIndex, candidateIndex, { renderAfter = true } = {}) {
  const row = state.rows[rowIndex];
  const candidate = row?._candidates?.[candidateIndex];
  if (!row || !candidate || !candidate.lat || !candidate.lon) return;

  row.nombre_visible = candidate.name || row.nombre_visible;
  row.direccion = candidate.display_name || row.direccion;
  row.latitude = Number(candidate.lat).toFixed(6);
  row.longitude = Number(candidate.lon).toFixed(6);
  row.estado = "confirmado";
  row.osm_id = osmId(candidate) || row.osm_id;
  row.nivel_confianza = "medio";
  row.nota_desambiguacion = "Candidato OSM aceptado por el usuario.";
  row.fuentes_consultadas = "Nominatim/OpenStreetMap";
  if (candidate.extratags?.wikidata && !row.wikidata_id) row.wikidata_id = candidate.extratags.wikidata;
  if (candidate.extratags?.wikipedia?.startsWith("http") && !row.wikipedia_url) row.wikipedia_url = candidate.extratags.wikipedia;
  persistDraft();
  if (renderAfter) render();
}

function openAiApiKey() {
  const key = String(els.aiApiKey.value || "").trim();
  if (key) sessionStorage.setItem("generamapas_openai_key", key);
  return key || sessionStorage.getItem("generamapas_openai_key") || "";
}

function aiSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      lugares: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            indice: { type: "integer" },
            nombre_visible: { type: "string" },
            categoria: { type: "string", enum: Object.keys(KML_CATEGORY_STYLES) },
            subcategoria: { type: "string" },
            capa: { type: "string" },
            prioridad: { type: "string", enum: ["imprescindible", "recomendable", "opcional"] },
            tamano_icono: { type: "string", enum: ["grande", "normal", "pequeno"] },
            consulta_osm: { type: "string" },
            descripcion_breve: { type: "string" },
            nota_desambiguacion: { type: "string" },
            nivel_confianza: { type: "string", enum: ["alto", "medio", "bajo"] },
          },
          required: [
            "indice",
            "nombre_visible",
            "categoria",
            "subcategoria",
            "capa",
            "prioridad",
            "tamano_icono",
            "consulta_osm",
            "descripcion_breve",
            "nota_desambiguacion",
            "nivel_confianza",
          ],
        },
      },
    },
    required: ["lugares"],
  };
}

function responseText(data) {
  if (data.output_text) return data.output_text;
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .join("");
}

function applyAiResult(result) {
  for (const item of result.lugares || []) {
    const row = state.rows[item.indice];
    if (!row) continue;
    row.nombre_visible = item.nombre_visible || row.nombre_visible;
    row.categoria = item.categoria || row.categoria;
    row.subcategoria = item.subcategoria || row.subcategoria;
    row.capa = item.capa || row.capa;
    row.prioridad = item.prioridad || row.prioridad;
    row.tamano_icono = item.tamano_icono || ICON_SIZE_BY_PRIORITY[row.prioridad] || row.tamano_icono || "normal";
    row.descripcion_breve = item.descripcion_breve || row.descripcion_breve;
    row.nota_desambiguacion = item.nota_desambiguacion || "Revisado por IA; pendiente de confirmar coordenadas.";
    row.nivel_confianza = item.nivel_confianza || "medio";
    row._query_osm = item.consulta_osm || "";
    const icon = iconForSubcategory(row.categoria, row.subcategoria);
    if (icon) {
      row.icono_recomendado = icon.iconName;
      row.color_hex = styleForCategory(row.categoria).colorHex;
    }
    row.estado = row.latitude && row.longitude ? row.estado : "revisar";
  }
}

async function resolveWithAi() {
  if (!state.rows.length) parsePlaces();
  if (!state.rows.length) return;

  const key = openAiApiKey();
  if (!key) {
    setStatus("Falta API key", "error");
    alert("Introduce una API key de OpenAI para usar la resolucion con IA.");
    return;
  }

  setStatus("Resolviendo con IA", "busy");
  els.resolveAiButton.disabled = true;
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: els.aiModel.value.trim() || "gpt-5.5-mini",
        input: [
          {
            role: "system",
            content: "Eres un asistente de normalizacion de lugares para mapas de viaje. Devuelve solo JSON valido segun el esquema. No inventes coordenadas. Propon una consulta OSM precisa y una categoria/capa probable.",
          },
          {
            role: "user",
            content: JSON.stringify({
              zona_base: els.baseZone.value,
              codigo_pais: countryCodeValue(),
              categorias_validas: Object.keys(KML_CATEGORY_STYLES),
              subcategorias_disponibles: SUBCATEGORY_ICONS.map((item) => ({
                categoria: item.categoria,
                subcategoria: item.subcategoria,
              })),
              lugares: state.rows.map((row, index) => ({
                indice: index,
                nombre_original: row.nombre_original,
                nombre_visible: row.nombre_visible,
                capa: row.capa,
                categoria: row.categoria,
                subcategoria: row.subcategoria,
              })),
            }),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "generamapas_lugares",
            schema: aiSchema(),
            strict: true,
          },
        },
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `OpenAI devolvio HTTP ${response.status}`);
    applyAiResult(JSON.parse(responseText(data)));
    persistDraft();
    render();
    setStatus("Listo", "ready");
  } catch (error) {
    setStatus("Error IA", "error");
    alert(error.message || "No se pudo resolver con IA.");
  } finally {
    els.resolveAiButton.disabled = false;
  }
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
    row.prioridad = row.prioridad || "recomendable";
    row.tamano_icono = row.tamano_icono || ICON_SIZE_BY_PRIORITY[row.prioridad] || "normal";
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

function normalizeTextKey(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function iconForSubcategory(row) {
  const categoryKey = normalizeTextKey(row.categoria);
  const subcategoryKey = normalizeTextKey(row.subcategoria);
  return SUBCATEGORY_ICONS.find((item) =>
    normalizeTextKey(item.categoria) === categoryKey && normalizeTextKey(item.subcategoria) === subcategoryKey
  ) || null;
}

function normalizeHexColor(value, fallback = "#607D8B") {
  const color = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color.toUpperCase();
  return fallback;
}

function hexToKmlColor(hexColor) {
  const normalized = normalizeHexColor(hexColor).slice(1);
  const red = normalized.slice(0, 2);
  const green = normalized.slice(2, 4);
  const blue = normalized.slice(4, 6);
  return `ff${blue}${green}${red}`.toLowerCase();
}

function styleIdForRow(row) {
  const baseStyle = styleForCategory(row.categoria);
  const colorHex = normalizeHexColor(row.color_hex, baseStyle.colorHex);
  const scaleKey = normalizeIconSize(row.tamano_icono);
  const parts = [baseStyle.id];
  if (colorHex !== normalizeHexColor(baseStyle.colorHex)) parts.push(colorHex.slice(1).toLowerCase());
  if (scaleKey !== "normal") parts.push(scaleKey);
  return parts.join("-");
}

function normalizeIconSize(value) {
  const size = String(value || "").trim().toLowerCase();
  return ICON_SCALE_BY_SIZE[size] ? size : "normal";
}

function iconScaleForRow(row) {
  return ICON_SCALE_BY_SIZE[normalizeIconSize(row.tamano_icono)];
}

function kmlStylesForRows(rows) {
  const usedStyles = new Map();
  rows.forEach((row) => {
    const baseStyle = styleForCategory(row.categoria);
    const style = {
      id: styleIdForRow(row),
      color: hexToKmlColor(row.color_hex || baseStyle.colorHex),
      scale: iconScaleForRow(row),
      iconHref: baseStyle.iconHref,
    };
    usedStyles.set(style.id, style);
  });
  return [...usedStyles.values()].map((style) => `    <Style id="${style.id}">
      <IconStyle>
        <color>${style.color}</color>
        <scale>${style.scale}</scale>
        <Icon><href>${xmlEscape(style.iconHref)}</href></Icon>
      </IconStyle>
    </Style>`).join("\n");
}

function extendedDataForRow(row) {
  const baseStyle = styleForCategory(row.categoria);
  const subcategoryIcon = iconForSubcategory(row);
  const colorHex = normalizeHexColor(row.color_hex, baseStyle.colorHex);
  const dataFields = {
    id_lugar: row.id_lugar,
    categoria: row.categoria,
    subcategoria: row.subcategoria,
    prioridad: row.prioridad,
    tamano_icono: normalizeIconSize(row.tamano_icono),
    icono_fuente: subcategoryIcon ? `Material Symbols - ${subcategoryIcon.iconName}` : baseStyle.iconSource,
    icono_material: subcategoryIcon ? subcategoryIcon.iconName : "",
    icono_code_point: subcategoryIcon ? subcategoryIcon.codePoint : "",
    color_hex: colorHex,
    horario: row.horario,
    precio_rango: row.precio_rango,
    interior_exterior: row.interior_exterior,
    wikipedia_url: row.wikipedia_url,
    wikidata_id: row.wikidata_id,
    osm_id: row.osm_id,
    street_view_url: row.street_view_url,
    plus_code: row.plus_code,
    elevacion_m: row.elevacion_m,
    dificultad: row.dificultad,
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
    return `    <Placemark id="${xmlEscape(row.id_lugar)}">
      <name>${xmlEscape(row.nombre_visible)}</name>
      <styleUrl>#${styleIdForRow(row)}</styleUrl>
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

function candidateOptions(row, rowIndex) {
  const candidates = row._candidates || [];
  if (!candidates.length) return `<span class="small">Sin candidatos</span>`;
  const options = candidates.map((candidate, index) => (
    `<option value="${index}">${escapeHtml(candidateLabel(candidate))}</option>`
  )).join("");
  return `
    <select class="candidate-select" name="candidate_${rowIndex}" aria-label="Candidato OSM ${rowIndex + 1}" data-candidate-select="${rowIndex}">
      ${options}
    </select>
    <button class="candidate-action" type="button" data-accept-candidate="${rowIndex}">Usar</button>
  `;
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
      <td>
        <select class="cell-select compact" name="prioridad_${index}" aria-label="Prioridad ${index + 1}" data-index="${index}" data-field="prioridad">
          ${priorityOptions(row.prioridad)}
        </select>
      </td>
      <td>
        <select class="cell-select compact" name="tamano_icono_${index}" aria-label="Tamano de icono ${index + 1}" data-index="${index}" data-field="tamano_icono">
          ${iconSizeOptions(row.tamano_icono)}
        </select>
      </td>
      <td><input class="cell-input narrow" name="latitude_${index}" aria-label="Latitud ${index + 1}" data-index="${index}" data-field="latitude" value="${escapeAttr(row.latitude)}" /></td>
      <td><input class="cell-input narrow" name="longitude_${index}" aria-label="Longitud ${index + 1}" data-index="${index}" data-field="longitude" value="${escapeAttr(row.longitude)}" /></td>
      <td>
        <select class="cell-select" name="estado_${index}" aria-label="Estado ${index + 1}" data-index="${index}" data-field="estado">
          ${stateOptions(row.estado)}
        </select>
      </td>
      <td>${candidateOptions(row, index)}</td>
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

function priorityOptions(selected) {
  return ["imprescindible", "recomendable", "opcional"]
    .map((priority) => `<option value="${priority}"${priority === selected ? " selected" : ""}>${priority}</option>`)
    .join("");
}

function iconSizeOptions(selected) {
  return ["grande", "normal", "pequeno"]
    .map((size) => `<option value="${size}"${size === normalizeIconSize(selected) ? " selected" : ""}>${size}</option>`)
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
  const previousPriority = row.prioridad;
  const previousSize = row.tamano_icono;
  row[field] = value;
  if (field === "categoria") {
    const rule = CATEGORY_RULES.find((item) => item.categoria === value) || DEFAULT_CATEGORY;
    row.subcategoria = rule.subcategoria;
    row.icono_recomendado = rule.icono;
    row.color_hex = rule.color;
    if (els.layerStrategy.value === "categoria") row.capa = value;
  }
  if (field === "prioridad" && (!previousSize || previousSize === ICON_SIZE_BY_PRIORITY[previousPriority])) {
    row.tamano_icono = ICON_SIZE_BY_PRIORITY[value] || "normal";
  }
  if (field === "prioridad" && els.layerStrategy.value === "prioridad") {
    row.capa = priorityLayerName(value);
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
    countryCode: els.countryCode.value,
    layerStrategy: els.layerStrategy.value,
    mapVersion: els.mapVersion.value,
    aiModel: els.aiModel.value,
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
    els.countryCode.value = data.countryCode || els.countryCode.value;
    els.layerStrategy.value = data.layerStrategy || els.layerStrategy.value;
    els.mapVersion.value = data.mapVersion || els.mapVersion.value;
    els.aiModel.value = data.aiModel || els.aiModel.value;
    els.placesInput.value = data.placesInput || "";
    state.rows = data.rows || [];
  } catch {
    localStorage.removeItem("mapas_draft");
  }
}

function loadExample() {
  els.projectName.value = "Viaje Innsbruck";
  els.baseZone.value = "Innsbruck, Austria";
  els.countryCode.value = "at";
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
els.resolveAiButton.addEventListener("click", resolveWithAi);
els.searchCandidatesButton.addEventListener("click", () => searchCandidatesForRows());
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
  if (!target.dataset) return;
  if (target.dataset.acceptCandidate != null) {
    const rowIndex = Number(target.dataset.acceptCandidate);
    const select = els.table.querySelector(`[data-candidate-select="${rowIndex}"]`);
    acceptCandidate(rowIndex, Number(select?.value || 0));
    return;
  }
  if (target.dataset.delete != null) {
    state.rows.splice(Number(target.dataset.delete), 1);
    persistDraft();
    render();
  }
});

els.aiApiKey.value = sessionStorage.getItem("generamapas_openai_key") || "";
els.aiApiKey.addEventListener("input", () => {
  const key = String(els.aiApiKey.value || "").trim();
  if (key) sessionStorage.setItem("generamapas_openai_key", key);
  else sessionStorage.removeItem("generamapas_openai_key");
});

for (const input of [els.projectName, els.baseZone, els.countryCode, els.layerStrategy, els.mapVersion, els.aiModel, els.placesInput]) {
  input.addEventListener("input", persistDraft);
}

restoreDraft();
render();
