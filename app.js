const HOTEL = {
  id: "hotel_center",
  map_label_name: "凱達大飯店",
  name_zh: "凱達大飯店",
  name_en: "Caesar Metro Taipei",
  primary_category: "其他設施",
  subcategory: "飯店",
  near_mrt: "龍山寺站",
  opening_hours: "24H front desk / Check-in 15:00, Check-out 12:00",
  notes: "以凱達大飯店為中心開始探索萬華。",
  google_maps_url: "https://www.google.com/maps/search/?api=1&query=Caesar+Metro+Taipei",
  address_zh: "台北市萬華區艋舺大道167號",
  source_status: "center",
};

const GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || "";
const GOOGLE_MAPS_USE_EMBED_API = window.GOOGLE_MAPS_USE_EMBED_API === true;

const rawData = Array.isArray(window.WANHUA_POI_DATA) ? window.WANHUA_POI_DATA : [];
const hotelRecord = rawData.find((place) => place.id === "wanhua_001");

if (hotelRecord) {
  HOTEL.map_label_name = hotelRecord.map_label_name || HOTEL.map_label_name;
  HOTEL.name_zh = hotelRecord.name_zh || HOTEL.name_zh;
  HOTEL.name_en = hotelRecord.name_en || HOTEL.name_en;
  HOTEL.primary_category = hotelRecord.primary_category || HOTEL.primary_category;
  HOTEL.subcategory = hotelRecord.subcategory || HOTEL.subcategory;
  HOTEL.near_mrt = hotelRecord.near_mrt || HOTEL.near_mrt;
  HOTEL.opening_hours = hotelRecord.opening_hours || HOTEL.opening_hours;
  HOTEL.notes = hotelRecord.notes || HOTEL.notes;
  HOTEL.google_maps_url = hotelRecord.google_maps_url || HOTEL.google_maps_url;
  HOTEL.address_zh = hotelRecord.address_zh || HOTEL.address_zh;
}

const places = rawData
  .filter((place) => place.id !== "wanhua_001")
  .map((place) => ({
    ...place,
    meal_tags: Array.isArray(place.meal_tags) ? place.meal_tags : [],
  }))
  .sort((a, b) => Number(a.display_order ?? 9999) - Number(b.display_order ?? 9999));

const state = {
  draft: createFilterState(),
  applied: createFilterState(),
  selectedPlaceId: null,
  dirty: false,
};

const dom = {
  searchInput: document.querySelector("#search-input"),
  activeOnly: document.querySelector("#active-only"),
  resetFilters: document.querySelector("#reset-filters"),
  applyFilters: document.querySelector("#apply-filters"),
  filterPending: document.querySelector("#filter-pending"),
  primaryFilters: document.querySelector("#primary-filters"),
  subcategoryFilters: document.querySelector("#subcategory-filters"),
  mealFilters: document.querySelector("#meal-filters"),
  primaryCount: document.querySelector("#primary-count"),
  subcategoryCount: document.querySelector("#subcategory-count"),
  mealCount: document.querySelector("#meal-count"),
  resultCount: document.querySelector("#result-count"),
  focusLabel: document.querySelector("#focus-label"),
  statusText: document.querySelector("#status-text"),
  selectedKicker: document.querySelector("#selected-kicker"),
  selectedName: document.querySelector("#selected-name"),
  selectedSecondary: document.querySelector("#selected-secondary"),
  selectedStatus: document.querySelector("#selected-status"),
  selectedPrimary: document.querySelector("#selected-primary"),
  selectedSubcategory: document.querySelector("#selected-subcategory"),
  selectedMrt: document.querySelector("#selected-mrt"),
  selectedAddress: document.querySelector("#selected-address"),
  selectedHours: document.querySelector("#selected-hours"),
  selectedNotes: document.querySelector("#selected-notes"),
  selectedOpen: document.querySelector("#selected-open"),
  selectedRoute: document.querySelector("#selected-route"),
  mapFrame: document.querySelector("#map-frame"),
  results: document.querySelector("#results"),
  quickFilters: document.querySelectorAll(".quick-filter"),
};

const filterValues = {
  primary: uniqueValues(places.map((place) => place.primary_category)),
  subcategory: uniqueValues(places.map((place) => place.subcategory)),
  meal: uniqueValues(places.flatMap((place) => place.meal_tags)),
};

initializeFilters();
attachEvents();
render();

function createFilterState() {
  return {
    search: "",
    activeOnly: true,
    primary: new Set(),
    subcategory: new Set(),
    meal: new Set(),
  };
}

function cloneFilterState(filterState) {
  return {
    search: filterState.search,
    activeOnly: filterState.activeOnly,
    primary: new Set(filterState.primary),
    subcategory: new Set(filterState.subcategory),
    meal: new Set(filterState.meal),
  };
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function initializeFilters() {
  renderChipGroup(dom.primaryFilters, filterValues.primary, state.draft.primary);
  renderChipGroup(dom.subcategoryFilters, filterValues.subcategory, state.draft.subcategory);
  renderChipGroup(dom.mealFilters, filterValues.meal, state.draft.meal);
  dom.primaryCount.textContent = `${filterValues.primary.length} 類`;
  dom.subcategoryCount.textContent = `${filterValues.subcategory.length} 類`;
  dom.mealCount.textContent = `${filterValues.meal.length} 類`;
  renderQuickFilters();
  syncPendingState();
}

function renderChipGroup(container, values, selectedSet) {
  container.innerHTML = "";

  values.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip${selectedSet.has(value) ? " is-active" : ""}`;
    button.textContent = value;

    button.addEventListener("click", () => {
      if (selectedSet.has(value)) {
        selectedSet.delete(value);
      } else {
        selectedSet.add(value);
      }

      renderChipGroup(container, values, selectedSet);
      markDirty();
    });

    container.appendChild(button);
  });
}

function attachEvents() {
  dom.searchInput.addEventListener("input", (event) => {
    state.draft.search = event.target.value.trim().toLowerCase();
    markDirty();
  });

  dom.activeOnly.addEventListener("change", (event) => {
    state.draft.activeOnly = event.target.checked;
    markDirty();
  });

  dom.applyFilters.addEventListener("click", () => {
    applyDraftFilters();
  });

  dom.quickFilters.forEach((button) => {
    button.addEventListener("click", () => {
      state.draft = createFilterState();
      dom.searchInput.value = "";
      dom.activeOnly.checked = true;

      if (button.dataset.quickPrimary) {
        state.draft.primary.add(button.dataset.quickPrimary);
      }

      initializeFilters();
      applyDraftFilters();
    });
  });

  dom.resetFilters.addEventListener("click", () => {
    state.draft = createFilterState();
    state.applied = createFilterState();
    state.selectedPlaceId = null;
    state.dirty = false;

    dom.searchInput.value = "";
    dom.activeOnly.checked = true;
    initializeFilters();
    render();
  });
}

function markDirty() {
  state.dirty = true;
  renderQuickFilters();
  syncPendingState();
}

function syncPendingState() {
  dom.applyFilters.disabled = !state.dirty;
  dom.filterPending.hidden = !state.dirty;
}

function applyDraftFilters() {
  state.applied = cloneFilterState(state.draft);
  state.dirty = false;
  renderQuickFilters();
  syncPendingState();
  render();
}

function renderQuickFilters() {
  const activePrimary =
    state.applied.primary.size === 1 &&
    state.applied.subcategory.size === 0 &&
    state.applied.meal.size === 0 &&
    !state.applied.search &&
    state.applied.activeOnly
      ? [...state.applied.primary][0]
      : null;

  dom.quickFilters.forEach((button) => {
    const isAll =
      button.dataset.quickFilter === "all" &&
      !state.applied.search &&
      state.applied.activeOnly &&
      state.applied.primary.size === 0 &&
      state.applied.subcategory.size === 0 &&
      state.applied.meal.size === 0;
    const isPrimary = button.dataset.quickPrimary && button.dataset.quickPrimary === activePrimary;
    button.classList.toggle("is-active", Boolean(isAll || isPrimary));
  });
}

function render() {
  const filtered = places.filter(applyFilters);
  syncSelection(filtered);
  const selected = getSelectedPlace(filtered);

  dom.resultCount.textContent = String(filtered.length);
  dom.focusLabel.textContent = selected ? getDisplayName(selected) : HOTEL.name_zh;
  dom.statusText.textContent = buildStatusText(filtered, selected);

  renderSpotlight(selected);
  renderList(filtered, selected);
}

function applyFilters(place) {
  if (state.applied.activeOnly && !place.is_active) {
    return false;
  }

  if (state.applied.primary.size && !state.applied.primary.has(place.primary_category)) {
    return false;
  }

  if (state.applied.subcategory.size && !state.applied.subcategory.has(place.subcategory)) {
    return false;
  }

  if (state.applied.meal.size && !place.meal_tags.some((tag) => state.applied.meal.has(tag))) {
    return false;
  }

  if (!state.applied.search) {
    return true;
  }

  const haystack = [
    place.id,
    place.map_label_name,
    place.name_zh,
    place.name_en,
    place.primary_category,
    place.subcategory,
    place.business_type,
    place.address_zh,
    place.notes,
    place.near_mrt,
    place.meal_tags.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(state.applied.search);
}

function syncSelection(filtered) {
  if (!filtered.length) {
    state.selectedPlaceId = null;
    return;
  }

  if (state.selectedPlaceId && filtered.some((place) => place.id === state.selectedPlaceId)) {
    return;
  }

  state.selectedPlaceId = hasActiveFilters() ? filtered[0].id : null;
}

function hasActiveFilters() {
  return (
    Boolean(state.applied.search) ||
    !state.applied.activeOnly ||
    state.applied.primary.size > 0 ||
    state.applied.subcategory.size > 0 ||
    state.applied.meal.size > 0
  );
}

function getSelectedPlace(filtered) {
  if (!state.selectedPlaceId) {
    return null;
  }

  return filtered.find((place) => place.id === state.selectedPlaceId) || null;
}

function buildStatusText(filtered, selected) {
  if (!filtered.length) {
    return "目前沒有符合條件的點位，地圖會先停留在凱達大飯店。";
  }

  if (!selected) {
    return `共 ${filtered.length} 個點位符合條件，目前維持以凱達大飯店作為地圖中心。`;
  }

  return `共 ${filtered.length} 個點位符合條件，目前聚焦在「${getDisplayName(selected)}」。`;
}

function renderSpotlight(selected) {
  const focus = selected || HOTEL;
  const isHotel = focus.id === HOTEL.id;

  dom.selectedKicker.textContent = isHotel ? "Hotel Anchor" : "Selected Place";
  dom.selectedName.textContent = getDisplayName(focus);
  dom.selectedSecondary.textContent = getSecondaryName(focus) || HOTEL.name_en;
  dom.selectedStatus.textContent = humanizeSourceStatus(focus.source_status, isHotel);
  dom.selectedPrimary.textContent = focus.primary_category || "未分類";
  dom.selectedSubcategory.textContent = focus.subcategory || "其他";
  dom.selectedMrt.textContent = focus.near_mrt || "萬華";
  dom.selectedAddress.textContent = focus.address_zh || "地址待補";
  dom.selectedHours.textContent = focus.opening_hours || "營業資訊待補";
  dom.selectedNotes.textContent = focus.notes || "目前沒有額外備註。";

  const openUrl = focus.google_maps_url || buildSearchUrl(focus);
  dom.selectedOpen.href = openUrl;
  dom.selectedOpen.textContent = isHotel ? "查看飯店位置" : "查看目前地點";

  dom.selectedRoute.href = isHotel ? HOTEL.google_maps_url : buildRouteUrl(focus);
  dom.selectedRoute.textContent = isHotel ? "查看飯店周邊" : "從飯店前往";

  dom.mapFrame.src = buildEmbedUrl(focus);
}

function renderList(filtered, selected) {
  if (!filtered.length) {
    dom.results.innerHTML =
      '<div class="empty-state">目前沒有符合條件的結果。你可以放寬分類、清除搜尋，或重新打開停用中的資料。</div>';
    return;
  }

  dom.results.innerHTML = filtered
    .map((place) => {
      const isSelected = selected?.id === place.id;
      const mealBadges = place.meal_tags
        .map((tag) => `<span class="badge">${escapeHtml(tag)}</span>`)
        .join("");

      return `
        <article class="place-card${isSelected ? " is-selected" : ""}" data-card-id="${escapeHtml(place.id)}">
          <div class="place-card__top">
            <div>
              <h3 class="place-card__title">${escapeHtml(getDisplayName(place))}</h3>
              <p class="place-card__secondary">${escapeHtml(getSecondaryName(place))}</p>
            </div>
            <span class="badge">${escapeHtml(place.primary_category || "未分類")}</span>
          </div>

          <div class="badge-row">
            <span class="badge">${escapeHtml(place.subcategory || "其他")}</span>
            <span class="badge">${escapeHtml(place.business_type || "poi")}</span>
            ${mealBadges}
          </div>

          <div class="place-card__meta">
            <div>地址：${escapeHtml(place.address_zh || "待補")}</div>
            <div>捷運：${escapeHtml(place.near_mrt || "未提供")}</div>
            <div>營業：${escapeHtml(place.opening_hours || "待補")}</div>
            <div>備註：${escapeHtml(place.notes || "無")}</div>
          </div>

          <div class="place-card__actions">
            <a
              class="button button--slim"
              href="${escapeAttribute(place.google_maps_url || buildSearchUrl(place))}"
              target="_blank"
              rel="noreferrer"
            >
              Google Maps
            </a>
            <a
              class="button button--ghost button--slim"
              href="#"
              data-focus-id="${escapeAttribute(place.id)}"
            >
              切到中間地圖
            </a>
          </div>
        </article>
      `;
    })
    .join("");

  dom.results.querySelectorAll("[data-focus-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      state.selectedPlaceId = event.currentTarget.dataset.focusId;
      render();
    });
  });

  dom.results.querySelectorAll("[data-card-id]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        return;
      }

      state.selectedPlaceId = card.dataset.cardId;
      render();
    });
  });
}

function getDisplayName(place) {
  return place.map_label_name || place.name_zh || place.name_en || place.id;
}

function getSecondaryName(place) {
  const names = [];
  const displayName = getDisplayName(place);

  if (place.name_zh && place.name_zh !== displayName) {
    names.push(place.name_zh);
  }

  if (place.name_en) {
    names.push(place.name_en);
  }

  return names.join(" / ");
}

function humanizeSourceStatus(status, isHotel = false) {
  if (isHotel) {
    return "中心點";
  }

  switch (status) {
    case "verified":
      return "已核對";
    case "partially_verified":
      return "部分核對";
    case "paper_map_corrected":
      return "紙本校正";
    case "needs_review":
      return "待複核";
    case "map_only":
      return "地圖點位";
    case "closed":
      return "已停業";
    default:
      return "行程點位";
  }
}

function buildSearchUrl(place) {
  const query = buildMapQuery(place);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildRouteUrl(place) {
  const destination = buildMapQuery(place);
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    HOTEL.address_zh
  )}&destination=${encodeURIComponent(destination)}`;
}

function buildEmbedUrl(place) {
  const query = buildMapQuery(place);
  if (GOOGLE_MAPS_USE_EMBED_API && GOOGLE_MAPS_API_KEY) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
      GOOGLE_MAPS_API_KEY
    )}&q=${encodeURIComponent(query)}&zoom=16`;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}

function buildMapQuery(place) {
  return [place.name_zh || place.map_label_name, place.address_zh || "台北市萬華區", "Taipei"]
    .filter(Boolean)
    .join(" ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
