const characters = [
  {
    id: "self",
    number: "00",
    name: "Myself",
    trait: "Direct",
    description: "Answer from your own point of view.",
  },
  {
    id: "june",
    number: "01",
    name: "June",
    trait: "Curious",
    description: "Lives alone and likes familiar routines.",
  },
  {
    id: "arthur",
    number: "02",
    name: "Arthur",
    trait: "Steady",
    description: "Values independence and local connections.",
  },
  {
    id: "sam",
    number: "03",
    name: "Sam",
    trait: "Kind",
    description: "Enjoys company but does not like to impose.",
  },
];

const moments = [
  {
    id: "evening-company",
    number: "01",
    icon: "🌙",
    title: "An evening at home",
    prompt: "You would like some company, but you are unsure who to contact.",
    time: "Evening",
  },
  {
    id: "someone-call",
    number: "02",
    icon: "📞",
    title: "Someone I can call",
    prompt: "You want a quick conversation, reassurance, or a familiar voice.",
    time: "Any time",
  },
  {
    id: "appointment-journey",
    number: "03",
    icon: "🚌",
    title: "Getting to an appointment",
    prompt: "Travel, timing, weather, or changing plans makes the journey difficult.",
    time: "Daytime",
  },
  {
    id: "local-place",
    number: "04",
    icon: "🌳",
    title: "A place I visit often",
    prompt: "A local place helps you feel active, recognised, or connected.",
    time: "Daytime",
  },
  {
    id: "need-help",
    number: "05",
    icon: "🤝",
    title: "A moment I need help",
    prompt: "A small task becomes harder and you must decide whether to ask.",
    time: "Any time",
  },
  {
    id: "digital-service",
    number: "06",
    icon: "📱",
    title: "Using a digital service",
    prompt: "A phone, website, or online form is part of getting something done.",
    time: "Any time",
  },
  {
    id: "community-gathering",
    number: "07",
    icon: "⛪",
    title: "Joining a local gathering",
    prompt: "You consider attending a church, group, class, or community event.",
    time: "Daytime",
  },
  {
    id: "coast-walk",
    number: "08",
    icon: "🌊",
    title: "Going out near the coast",
    prompt: "A walk, harbour visit, or outdoor routine affects how the day feels.",
    time: "Daytime",
  },
];

const nodes = [
  { id: "park", label: "Park", icon: "🌳", type: "place" },
  { id: "cafe", label: "Cafe", icon: "☕", type: "place" },
  { id: "health", label: "Health", icon: "✚", type: "service" },
  { id: "harbour", label: "Harbour", icon: "⚓", type: "place" },
  { id: "community", label: "Community", icon: "⌂", type: "service" },
  { id: "home", label: "Home", icon: "🏠", type: "place" },
  { id: "church", label: "Church", icon: "⛪", type: "service" },
  { id: "neighbours", label: "Neighbours", icon: "👋", type: "people" },
  { id: "shops", label: "Shops", icon: "🛒", type: "service" },
  { id: "bus", label: "Bus", icon: "🚌", type: "service" },
  { id: "friends", label: "Friends", icon: "👥", type: "people" },
  { id: "family", label: "Family", icon: "♥", type: "people" },
];

const reflectionOptions = {
  feeling: [
    { id: "calm", label: "Calm", icon: "🙂" },
    { id: "connected", label: "Connected", icon: "😊" },
    { id: "unsure", label: "Unsure", icon: "🤔" },
    { id: "lonely", label: "Lonely", icon: "😔" },
    { id: "worried", label: "Worried", icon: "😟" },
    { id: "frustrated", label: "Frustrated", icon: "😣" },
  ],
  frequency: [
    { id: "rarely", label: "Rarely", icon: "○" },
    { id: "monthly", label: "Some months", icon: "◔" },
    { id: "weekly", label: "Most weeks", icon: "◑" },
    { id: "daily", label: "Most days", icon: "●" },
  ],
  importance: [
    { id: "not-much", label: "Not much", icon: "•", score: 1 },
    { id: "a-little", label: "A little", icon: "◔", score: 2 },
    { id: "a-lot", label: "A lot", icon: "♥", score: 3 },
    { id: "essential", label: "Essential", icon: "★", score: 4 },
  ],
  support: [
    { id: "self", label: "I can manage", icon: "✓" },
    { id: "family-friend", label: "Family or friend", icon: "👥" },
    { id: "neighbour", label: "A neighbour", icon: "👋" },
    { id: "community", label: "Community group", icon: "⌂" },
    { id: "service", label: "A local service", icon: "✚" },
    { id: "clear-info", label: "Clear information", icon: "i" },
    { id: "transport", label: "Transport help", icon: "🚌" },
    { id: "reminder", label: "A reminder", icon: "⏰" },
    { id: "someone-check", label: "Someone checking in", icon: "📞" },
  ],
  technology: [
    { id: "yes", label: "Yes", icon: "✓" },
    { id: "maybe", label: "Maybe", icon: "?" },
    { id: "human-first", label: "Human help first", icon: "👥" },
    { id: "no", label: "No", icon: "×" },
  ],
  privacy: [
    { id: "only-me", label: "Only me", icon: "•" },
    { id: "family", label: "Family", icon: "♥" },
    { id: "trusted-neighbour", label: "Trusted neighbour", icon: "👋" },
    { id: "community-service", label: "Community service", icon: "⌂" },
    { id: "care-service", label: "Health or care service", icon: "✚" },
    { id: "ask-first", label: "Ask me first", icon: "?" },
  ],
};

const STORAGE_RECORDS = "neighbour-signals-records-v3";
const STORAGE_DRAFT = "neighbour-signals-draft-v3";
const flow = ["welcome", "character", "moment", "map", "reflection", "result"];
const stepScreens = ["character", "moment", "map", "reflection", "result"];

const state = {
  screen: "welcome",
  returnScreen: "welcome",
  records: readStorage(STORAGE_RECORDS, []),
  cloudRecords: [],
  adminSession: false,
  serverOnline: false,
  syncing: false,
  sessionRecordIds: [],
  session: createSession(),
};

function createSession() {
  return {
    participantId: makeParticipantId(),
    ageRange: "",
    localArea: "Elgin",
    consent: false,
    role: "",
    moment: "",
    node: "",
    reflection: {
      feeling: "",
      frequency: "",
      importance: "",
      support: "",
      technology: "",
      privacy: "",
      note: "",
    },
  };
}

function makeParticipantId() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900);
  return `NS-${day}${random}`;
}

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("This browser could not save locally.");
  }
}

function cloudConfigured() {
  return state.serverOnline;
}

function setSyncStatus(mode, label) {
  const status = $("#sync-status");
  if (!status) return;
  status.className = `sync-status ${mode}`;
  status.querySelector("span").textContent = label;
}

function recordForCloud(record) {
  const { syncStatus, lastSyncError, submitted, ...payload } = record;
  return payload;
}

async function checkServerConnection() {
  if (!location.protocol.startsWith("http")) {
    state.serverOnline = false;
    renderSyncStatus();
    return false;
  }
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    state.serverOnline = response.ok;
  } catch {
    state.serverOnline = false;
  }
  renderSyncStatus();
  return state.serverOnline;
}

function markRecordSync(recordId, syncStatus, error = "") {
  const record = state.records.find((item) => item.recordId === recordId);
  if (!record) return;
  record.syncStatus = syncStatus;
  record.lastSyncError = error;
  writeStorage(STORAGE_RECORDS, state.records);
}

async function syncRecord(record) {
  if (!cloudConfigured() || record.submitted === false) return false;
  if (!navigator.onLine) {
    markRecordSync(record.recordId, "pending", "Offline");
    setSyncStatus("offline", "Waiting");
    return false;
  }

  try {
    const response = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recordForCloud(record)),
    });
    if (response.status === 409) {
      markRecordSync(record.recordId, "synced");
      return true;
    }
    if (!response.ok) throw new Error(await readResponseError(response));
    markRecordSync(record.recordId, "synced");
    return true;
  } catch (error) {
    markRecordSync(record.recordId, "pending", error.message);
    return false;
  }
}

async function syncPendingRecords() {
  if (!cloudConfigured()) await checkServerConnection();
  if (!cloudConfigured() || state.syncing) {
    renderSyncStatus();
    return;
  }
  const pending = state.records.filter(
    (record) => record.submitted !== false && record.syncStatus !== "synced"
  );
  if (!pending.length) {
    renderSyncStatus();
    return;
  }

  state.syncing = true;
  setSyncStatus("syncing", `Syncing ${pending.length}`);
  let synced = 0;
  for (const record of pending) {
    if (await syncRecord(record)) synced += 1;
  }
  state.syncing = false;
  renderSyncStatus();
  if (synced) showToast(`${synced} ${plural(synced, "story", "stories")} synced.`);
}

function renderSyncStatus() {
  if (!cloudConfigured()) {
    setSyncStatus(
      location.protocol.startsWith("http") ? "offline" : "local",
      location.protocol.startsWith("http") ? "Main offline" : "Open shared URL"
    );
    return;
  }
  if (!navigator.onLine) {
    setSyncStatus("offline", "Offline");
    return;
  }
  const pending = state.records.filter(
    (record) => record.submitted !== false && record.syncStatus !== "synced"
  ).length;
  if (pending) {
    setSyncStatus("error", `${pending} waiting`);
    return;
  }
  setSyncStatus("synced", "Main synced");
}

async function readResponseError(response) {
  try {
    const payload = await response.json();
    return payload.message || payload.error_description || payload.error || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

async function signInResearcher(password) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) throw new Error(await readResponseError(response));
  state.adminSession = true;
}

async function ensureAdminSession() {
  try {
    const response = await fetch("/api/session", { cache: "no-store" });
    if (!response.ok) return false;
    const payload = await response.json();
    state.adminSession = Boolean(payload.authenticated);
    return state.adminSession;
  } catch {
    state.adminSession = false;
    return false;
  }
}

async function fetchCloudRecords() {
  if (!(await ensureAdminSession())) throw new Error("Please sign in again.");
  const response = await fetch("/api/records", { cache: "no-store" });
  if (!response.ok) throw new Error(await readResponseError(response));
  const payload = await response.json();
  state.cloudRecords = payload.records.map((record) => ({
    ...record,
    syncStatus: "synced",
    submitted: true,
  }));
  return state.cloudRecords;
}

async function deleteCloudRecords() {
  if (!(await ensureAdminSession())) throw new Error("Please sign in again.");
  const response = await fetch("/api/records", {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(await readResponseError(response));
  state.cloudRecords = [];
}

async function researcherLogout() {
  try {
    await fetch("/api/logout", { method: "POST" });
  } catch {}
  state.adminSession = null;
  state.cloudRecords = [];
}

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCharacter(id = state.session.role) {
  return characters.find((item) => item.id === id);
}

function getMoment(id = state.session.moment) {
  return moments.find((item) => item.id === id);
}

function getNode(id = state.session.node) {
  return nodes.find((item) => item.id === id);
}

function optionLabel(group, id) {
  return reflectionOptions[group].find((item) => item.id === id)?.label || "";
}

function saveDraft() {
  writeStorage(STORAGE_DRAFT, {
    session: state.session,
    sessionRecordIds: state.sessionRecordIds,
    screen: state.screen,
  });
}

function loadDraft() {
  const draft = readStorage(STORAGE_DRAFT, null);
  if (!draft?.session) return;
  state.session = {
    ...createSession(),
    ...draft.session,
    reflection: { ...createSession().reflection, ...(draft.session.reflection || {}) },
  };
  state.sessionRecordIds = Array.isArray(draft.sessionRecordIds) ? draft.sessionRecordIds : [];
  state.screen = flow.includes(draft.screen) || draft.screen === "finished" ? draft.screen : "welcome";
}

function renderCharacters() {
  $("#character-grid").innerHTML = characters
    .map(
      (character) => `
        <button class="character-card ${state.session.role === character.id ? "selected" : ""}" data-character="${character.id}" aria-pressed="${state.session.role === character.id}">
          <div class="character-art" aria-hidden="true"></div>
          <div class="character-copy">
            <span>${character.number}</span>
            <h2>${character.name}</h2>
            <p><b>${character.trait}.</b> ${character.description}</p>
          </div>
        </button>
      `
    )
    .join("");

  $$("[data-character]").forEach((button) => {
    button.addEventListener("click", () => {
      state.session.role = button.dataset.character;
      renderCharacters();
      updateRail();
      updateNav();
      saveDraft();
    });
  });
}

function renderMoments() {
  $("#moment-grid").innerHTML = moments
    .map(
      (moment) => `
        <button class="moment-card ${state.session.moment === moment.id ? "selected" : ""}" data-moment="${moment.id}" aria-pressed="${state.session.moment === moment.id}">
          <span class="moment-number">${moment.number}</span>
          <span class="moment-copy">
            <h2>${moment.title}</h2>
            <p>${moment.prompt}</p>
          </span>
          <span class="moment-icon" aria-hidden="true">${moment.icon}</span>
        </button>
      `
    )
    .join("");

  $$("[data-moment]").forEach((button) => {
    button.addEventListener("click", () => {
      state.session.moment = button.dataset.moment;
      renderMoments();
      updateRail();
      updateNav();
      saveDraft();
    });
  });
}

function renderMap() {
  $("#map-grid").innerHTML = nodes
    .map(
      (node) => `
        <button class="map-node ${state.session.node === node.id ? "selected" : ""}" data-node="${node.id}" aria-pressed="${state.session.node === node.id}">
          <span class="node-icon" aria-hidden="true">${node.icon}</span>
          <strong>${node.label.toUpperCase()}</strong>
          <small>${node.type}</small>
        </button>
      `
    )
    .join("");

  $$("[data-node]").forEach((button) => {
    button.addEventListener("click", () => {
      state.session.node = button.dataset.node;
      renderMap();
      updateRail();
      updateNav();
      saveDraft();
    });
  });

  const moment = getMoment();
  $("#selected-token").innerHTML = moment
    ? `${moment.icon} <span>${moment.title}</span>`
    : `✦ <span>Choose a moment first</span>`;
}

function renderChoiceGroup(group, containerId) {
  const selected = state.session.reflection[group];
  $(`#${containerId}`).innerHTML = reflectionOptions[group]
    .map(
      (option) => `
        <button class="choice-button ${selected === option.id ? "selected" : ""}" data-choice-group="${group}" data-choice="${option.id}" aria-pressed="${selected === option.id}">
          <span class="choice-icon" aria-hidden="true">${option.icon}</span>
          <strong>${option.label}</strong>
        </button>
      `
    )
    .join("");
}

function renderReflection() {
  renderChoiceGroup("feeling", "feeling-choices");
  renderChoiceGroup("frequency", "frequency-choices");
  renderChoiceGroup("importance", "importance-choices");
  renderChoiceGroup("support", "support-choices");
  renderChoiceGroup("technology", "technology-choices");
  renderChoiceGroup("privacy", "privacy-choices");

  $$("[data-choice-group]").forEach((button) => {
    button.addEventListener("click", () => {
      state.session.reflection[button.dataset.choiceGroup] = button.dataset.choice;
      renderReflection();
      updateNav();
      saveDraft();
    });
  });

  $("#story-note").value = state.session.reflection.note;
  $("#note-count").textContent = state.session.reflection.note.length;
}

function updateRail() {
  const role = getCharacter();
  const moment = getMoment();
  const node = getNode();
  const storyIndex = Math.max(1, state.sessionRecordIds.length + 1);
  $("#story-number").textContent = String(storyIndex).padStart(2, "0");

  let title = "Start with a story";
  let copy = "There are no right answers. Choose what feels closest to your own life.";
  let guide = "I will stay with you, one small step at a time.";
  let art = "✦";

  if (state.screen === "character") {
    title = "Choose a viewpoint";
    copy = role ? `${role.name} is ready.` : "You can answer as yourself or through a character.";
    guide = role ? `Good choice. We will follow ${role.name}'s point of view.` : "Pick the viewpoint that feels easiest.";
    art = role?.id === "self" ? "◉" : "☺";
  }

  if (state.screen === "moment" || state.screen === "map" || state.screen === "reflection") {
    title = moment?.title || "Pick a familiar moment";
    copy = moment?.prompt || "Choose a situation that connects to your daily life.";
    art = moment?.icon || "✦";
  }

  if (state.screen === "moment") {
    guide = moment ? "That moment is ready. Next, we will give it a place." : "Choose one card. You can return for another later.";
  }

  if (state.screen === "map") {
    guide = node ? `${node.label} is marked. Does that feel right?` : "Put the moment where it happens or where support comes from.";
  }

  if (state.screen === "reflection") {
    guide = "Choose what fits. You can leave the optional questions blank.";
  }

  if (state.screen === "result") {
    title = "Your connection map";
    copy = "Places, people, and support needs are now visible together.";
    guide = "Add another story for a richer map, or finish when you are ready.";
    art = "🗺️";
  }

  if (state.screen === "finished") {
    title = "Story complete";
    copy = "Thank you for sharing what community life feels like.";
    guide = "Your anonymous record is ready for the research summary.";
    art = "✓";
  }

  if (state.screen === "research") {
    title = "Research signals";
    copy = "The participant view is hidden while the anonymous data is reviewed.";
    guide = "Patterns are evidence for future community design decisions.";
    art = "▥";
  }

  $("#scene-title").textContent = title;
  $("#scene-copy").textContent = copy;
  $("#guide-copy").textContent = guide;
  $("#scene-art").textContent = art;
}

function showScreen(name, options = {}) {
  state.screen = name;
  $$(".screen").forEach((screen) => screen.classList.toggle("active", screen.dataset.screen === name));
  updateProgress();
  updateRail();
  updateNav();

  if (name === "result") renderResult();
  if (name === "research") renderResearch();
  if (name === "map") renderMap();
  if (name === "reflection") renderReflection();

  if (options.scroll !== false) window.scrollTo({ top: 0, behavior: "smooth" });
  saveDraft();
}

function updateProgress() {
  let activeScreen = state.screen;
  if (activeScreen === "welcome") activeScreen = "character";
  if (activeScreen === "finished" || activeScreen === "research") activeScreen = "result";
  const activeIndex = stepScreens.indexOf(activeScreen);

  $$(".progress-step").forEach((step, index) => {
    step.classList.toggle("active", index === activeIndex);
    step.classList.toggle("complete", index < activeIndex);
    step.disabled = true;
  });
}

function canContinue() {
  if (state.screen === "welcome") {
    return Boolean($("#participant-id").value.trim()) && $("#consent").checked;
  }
  if (state.screen === "character") return Boolean(state.session.role);
  if (state.screen === "moment") return Boolean(state.session.moment);
  if (state.screen === "map") return Boolean(state.session.node);
  if (state.screen === "reflection") {
    const reflection = state.session.reflection;
    return Boolean(reflection.feeling && reflection.importance && reflection.support);
  }
  return true;
}

function updateNav() {
  const nav = $("#game-nav");
  const hidden = ["result", "finished", "research"].includes(state.screen);
  nav.style.display = hidden ? "none" : "flex";
  if (hidden) return;

  const index = flow.indexOf(state.screen);
  $("#back-button").disabled = index <= 0;
  $("#next-button").disabled = !canContinue();

  const labels = {
    welcome: ["START", "BEGIN"],
    character: ["01 / 05", "CONTINUE"],
    moment: ["02 / 05", "CONTINUE"],
    map: ["03 / 05", "CONTINUE"],
    reflection: ["04 / 05", "SAVE STORY"],
  };
  const [progress, next] = labels[state.screen] || ["", "NEXT"];
  $("#nav-progress").textContent = progress;
  $("#next-button span").textContent = next;
}

function goNext() {
  if (!canContinue()) {
    showToast("Please complete the highlighted choice.");
    return;
  }

  if (state.screen === "welcome") {
    state.session.participantId = $("#participant-id").value.trim();
    state.session.ageRange = $("#age-range").value;
    state.session.localArea = $("#local-area").value;
    state.session.consent = $("#consent").checked;
    showScreen("character");
    return;
  }

  if (state.screen === "character") return showScreen("moment");
  if (state.screen === "moment") return showScreen("map");
  if (state.screen === "map") return showScreen("reflection");
  if (state.screen === "reflection") {
    saveStory();
    showScreen("result");
  }
}

function goBack() {
  const index = flow.indexOf(state.screen);
  if (index <= 0) return;
  showScreen(flow[index - 1]);
}

function saveStory() {
  const moment = getMoment();
  const node = getNode();
  const role = getCharacter();
  const importance = reflectionOptions.importance.find(
    (item) => item.id === state.session.reflection.importance
  );
  const record = {
    recordId: `NSR-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    participantId: state.session.participantId,
    ageRange: state.session.ageRange,
    localArea: state.session.localArea,
    roleId: role.id,
    role: role.name,
    momentId: moment.id,
    moment: moment.title,
    momentIcon: moment.icon,
    timeContext: moment.time,
    nodeId: node.id,
    node: node.label,
    nodeType: node.type,
    feeling: optionLabel("feeling", state.session.reflection.feeling),
    frequency: optionLabel("frequency", state.session.reflection.frequency) || "Not answered",
    importance: importance.label,
    importanceScore: importance.score,
    support: optionLabel("support", state.session.reflection.support),
    technology: optionLabel("technology", state.session.reflection.technology) || "Not answered",
    privacy: optionLabel("privacy", state.session.reflection.privacy) || "Not answered",
    note: state.session.reflection.note.trim(),
    completedAt: new Date().toISOString(),
    gameVersion: "4.0",
    submitted: false,
    syncStatus: cloudConfigured() ? "pending" : "local",
    lastSyncError: "",
  };
  state.records.push(record);
  state.sessionRecordIds.push(record.recordId);
  writeStorage(STORAGE_RECORDS, state.records);
  saveDraft();
  showToast("Story added to your map.");
}

function sessionRecords() {
  return state.records.filter((record) => state.sessionRecordIds.includes(record.recordId));
}

function renderResult() {
  const records = sessionRecords();
  $("#result-count").textContent = records.length;
  $("#review-count").textContent = records.length;
  $("#result-intro").textContent =
    records.length === 1
      ? "One story can already reveal a useful connection."
      : `${records.length} stories reveal a broader pattern of places, people, and support.`;

  const countByNode = countBy(records, "nodeId");
  $("#result-map").innerHTML = nodes
    .map((node) => {
      const count = countByNode[node.id] || 0;
      return `
        <div class="mini-node ${count ? "active" : ""}">
          <span>${node.icon}</span>
          ${node.label}
          ${count ? `<b>${count}</b>` : ""}
        </div>
      `;
    })
    .join("");

  const topNode = topEntry(countBy(records, "node"));
  const topSupport = topEntry(countBy(records, "support"));
  const averageImportance = records.length
    ? (records.reduce((sum, record) => sum + record.importanceScore, 0) / records.length).toFixed(1)
    : "0";
  $("#personal-insights").innerHTML = [
    personalInsight("Strongest location", topNode ? `${topNode[0]} appears most often.` : "Add a story to reveal a location."),
    personalInsight("Support signal", topSupport ? `${topSupport[0]} is the leading need.` : "Support has not been selected."),
    personalInsight("Importance", `${averageImportance} out of 4 average importance.`),
  ].join("");

  $("#story-review-list").innerHTML = records
    .slice()
    .reverse()
    .map(
      (record) => `
        <article class="review-card">
          <span aria-hidden="true">${record.momentIcon}</span>
          <div>
            <strong>${escapeHtml(record.moment)}</strong>
            <small>${escapeHtml(record.node)} · ${escapeHtml(record.feeling)} · ${escapeHtml(record.support)}</small>
          </div>
          <button data-remove-record="${record.recordId}" aria-label="Remove this story" title="Remove story">×</button>
        </article>
      `
    )
    .join("");

  $$("[data-remove-record]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.removeRecord;
      state.records = state.records.filter((record) => record.recordId !== id);
      state.sessionRecordIds = state.sessionRecordIds.filter((recordId) => recordId !== id);
      writeStorage(STORAGE_RECORDS, state.records);
      saveDraft();
      if (!state.sessionRecordIds.length) {
        prepareAnotherStory();
      } else {
        renderResult();
      }
    });
  });
}

function personalInsight(title, copy) {
  return `<div class="personal-insight"><strong>${title}</strong><span>${copy}</span></div>`;
}

function prepareAnotherStory() {
  state.session.moment = "";
  state.session.node = "";
  state.session.reflection = createSession().reflection;
  renderMoments();
  renderMap();
  renderReflection();
  showScreen("moment");
}

function submitCurrentSession() {
  state.records.forEach((record) => {
    if (state.sessionRecordIds.includes(record.recordId)) {
      record.submitted = true;
      if (record.syncStatus !== "synced") record.syncStatus = cloudConfigured() ? "pending" : "local";
    }
  });
  writeStorage(STORAGE_RECORDS, state.records);
  saveDraft();
  syncPendingRecords();
}

function countBy(records, key) {
  return records.reduce((result, record) => {
    const value = record[key] || "Not answered";
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
}

function topEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
}

function researchRecords() {
  return cloudConfigured() && state.adminSession ? state.cloudRecords : state.records;
}

function renderResearch() {
  const records = researchRecords();
  const participants = new Set(records.map((record) => record.participantId)).size;
  const highImportance = records.filter((record) => record.importanceScore >= 3).length;
  const peopleConnections = records.filter((record) => record.nodeType === "people").length;
  const techOpen = records.filter((record) => ["Yes", "Maybe"].includes(record.technology)).length;

  $("#metric-grid").innerHTML = [
    metric(participants, "PARTICIPANTS"),
    metric(records.length, "STORIES"),
    metric(percent(highImportance, records.length), "HIGH IMPORTANCE"),
    metric(percent(techOpen, records.length), "OPEN TO TECH"),
  ].join("");

  renderBarChart("#node-chart", countBy(records, "node"));
  renderBarChart("#support-chart", countBy(records, "support"));
  renderBarChart("#feeling-chart", countBy(records, "feeling"));

  const topNode = topEntry(countBy(records, "node"));
  const topSupport = topEntry(countBy(records, "support"));
  const lonely = records.filter((record) => ["Lonely", "Worried"].includes(record.feeling)).length;
  const privacyFirst = records.filter((record) => record.privacy === "Ask me first").length;
  const signals = records.length
    ? [
        {
          title: "Place opportunity",
          copy: topNode
            ? `${topNode[0]} is the strongest community touchpoint (${topNode[1]} stories).`
            : "No place pattern yet.",
        },
        {
          title: "Support opportunity",
          copy: topSupport ? `${topSupport[0]} is the most requested form of help.` : "No support pattern yet.",
        },
        {
          title: "Connection risk",
          copy: `${lonely} ${plural(lonely, "story", "stories")} include loneliness or worry; ${peopleConnections} connect directly to people.`,
        },
        {
          title: "Consent boundary",
          copy: `${privacyFirst} ${plural(privacyFirst, "story", "stories")} explicitly ask to be consulted before sharing.`,
        },
      ]
    : [{ title: "No records yet", copy: "Complete one story to generate design signals." }];

  $("#research-insights").innerHTML = signals
    .map(
      (signal) =>
        `<div class="research-signal"><strong>${signal.title}</strong><p>${signal.copy}</p></div>`
    )
    .join("");

  $("#record-count").textContent = `${records.length} ${plural(records.length, "RECORD", "RECORDS")}`;
  renderDataTable(records);
}

function metric(value, label) {
  return `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
}

function percent(part, total) {
  return total ? `${Math.round((part / total) * 100)}%` : "0%";
}

function plural(count, singular, pluralForm) {
  return count === 1 ? singular : pluralForm;
}

function renderBarChart(selector, counts) {
  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);
  const maximum = Math.max(...entries.map((entry) => entry[1]), 1);
  $(selector).innerHTML = entries.length
    ? entries
        .map(
          ([label, count]) => `
            <div class="bar-row">
              <label title="${escapeHtml(label)}">${escapeHtml(label)}</label>
              <div class="bar-track"><div class="bar-fill" style="width:${(count / maximum) * 100}%"></div></div>
              <b>${count}</b>
            </div>
          `
        )
        .join("")
    : `<p class="privacy-note">No data yet.</p>`;
}

function renderDataTable(records) {
  if (!records.length) {
    $("#data-table").innerHTML = `<p class="privacy-note">No story records yet.</p>`;
    return;
  }
  $("#data-table").innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Participant</th><th>Area</th><th>Moment</th><th>Node</th><th>Feeling</th>
          <th>Importance</th><th>Support</th><th>Technology</th><th>Privacy</th><th>Time</th>
        </tr>
      </thead>
      <tbody>
        ${records
          .slice()
          .reverse()
          .map(
            (record) => `
              <tr>
                <td>${escapeHtml(record.participantId)}</td>
                <td>${escapeHtml(record.localArea)}</td>
                <td>${escapeHtml(record.moment)}</td>
                <td>${escapeHtml(record.node)}</td>
                <td>${escapeHtml(record.feeling)}</td>
                <td>${escapeHtml(record.importance)}</td>
                <td>${escapeHtml(record.support)}</td>
                <td>${escapeHtml(record.technology)}</td>
                <td>${escapeHtml(record.privacy)}</td>
                <td>${new Date(record.completedAt).toLocaleDateString("en-GB")}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function openResearch() {
  state.returnScreen = state.screen === "research" ? "welcome" : state.screen;
  if (!cloudConfigured()) await checkServerConnection();
  if (!cloudConfigured()) {
    $("#cloud-setup-dialog").showModal();
    return;
  }
  if (!(await ensureAdminSession())) {
    $("#admin-error").textContent = "";
    $("#admin-dialog").showModal();
    return;
  }
  await enterResearch();
}

async function enterResearch() {
  setSyncStatus("syncing", "Loading data");
  try {
    await fetchCloudRecords();
    $("#research-source-copy").textContent =
      "All participant devices synced to this main device · password-protected view";
    showScreen("research");
    setSyncStatus("synced", "All data loaded");
  } catch (error) {
    setSyncStatus("error", "Load failed");
    showToast(error.message);
    if (!state.adminSession) $("#admin-dialog").showModal();
  }
}

function closeResearch() {
  const target = state.returnScreen === "research" ? "welcome" : state.returnScreen;
  showScreen(target || "welcome");
}

function exportRecords(format) {
  const records = researchRecords();
  if (!records.length) {
    showToast("There is no data to export yet.");
    return;
  }
  if (format === "json") {
    const payload = {
      exportedAt: new Date().toISOString(),
      game: "Neighbour Signals",
      version: "4.0",
      recordCount: records.length,
      records,
    };
    downloadFile(
      `neighbour-signals-${dateStamp()}.json`,
      JSON.stringify(payload, null, 2),
      "application/json"
    );
    return;
  }

  const headers = [
    "recordId",
    "participantId",
    "ageRange",
    "localArea",
    "role",
    "momentId",
    "moment",
    "timeContext",
    "nodeId",
    "node",
    "nodeType",
    "feeling",
    "frequency",
    "importance",
    "importanceScore",
    "support",
    "technology",
    "privacy",
    "note",
    "completedAt",
    "gameVersion",
  ];
  const csv = [
    headers.join(","),
    ...records.map((record) => headers.map((header) => csvCell(record[header])).join(",")),
  ].join("\n");
  downloadFile(`neighbour-signals-${dateStamp()}.csv`, csv, "text/csv;charset=utf-8");
}

function csvCell(value) {
  const text = String(value ?? "");
  const spreadsheetSafe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${spreadsheetSafe.replaceAll('"', '""')}"`;
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`${filename} exported.`);
}

function startNewParticipant() {
  state.session = createSession();
  state.sessionRecordIds = [];
  $("#participant-id").value = state.session.participantId;
  $("#age-range").value = "";
  $("#local-area").value = "Elgin";
  $("#consent").checked = false;
  renderAll();
  showScreen("welcome");
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function bindEvents() {
  $("#next-button").addEventListener("click", goNext);
  $("#back-button").addEventListener("click", goBack);
  $("#open-help").addEventListener("click", () => $("#help-dialog").showModal());
  $("#close-help").addEventListener("click", () => $("#help-dialog").close());
  $("#open-research").addEventListener("click", openResearch);
  $("#close-research").addEventListener("click", closeResearch);
  $("#close-admin").addEventListener("click", () => $("#admin-dialog").close());
  $("#close-cloud-setup").addEventListener("click", () => $("#cloud-setup-dialog").close());
  $("#close-cloud-setup-action").addEventListener("click", () => $("#cloud-setup-dialog").close());
  $("#refresh-research").addEventListener("click", enterResearch);
  $("#research-logout").addEventListener("click", async () => {
    await researcherLogout();
    closeResearch();
    showToast("Researcher signed out.");
  });
  $("#brand-home").addEventListener("click", () => {
    if (state.screen === "research") closeResearch();
    else showScreen(state.screen);
  });

  $("#admin-login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = $("#admin-login-button");
    const password = $("#admin-password").value;
    $("#admin-error").textContent = "";
    button.disabled = true;
    button.textContent = "Signing in…";
    try {
      await signInResearcher(password);
      $("#admin-password").value = "";
      $("#admin-dialog").close();
      await enterResearch();
    } catch (error) {
      $("#admin-error").textContent = error.message || "Sign-in failed.";
    } finally {
      button.disabled = false;
      button.textContent = "Sign in securely";
    }
  });

  $("#participant-id").addEventListener("input", () => {
    state.session.participantId = $("#participant-id").value.trim();
    updateNav();
    saveDraft();
  });
  $("#age-range").addEventListener("change", () => {
    state.session.ageRange = $("#age-range").value;
    saveDraft();
  });
  $("#local-area").addEventListener("change", () => {
    state.session.localArea = $("#local-area").value;
    saveDraft();
  });
  $("#consent").addEventListener("change", () => {
    state.session.consent = $("#consent").checked;
    updateNav();
    saveDraft();
  });
  $("#story-note").addEventListener("input", () => {
    state.session.reflection.note = $("#story-note").value;
    $("#note-count").textContent = state.session.reflection.note.length;
    saveDraft();
  });

  $("#add-story").addEventListener("click", prepareAnotherStory);
  $("#finish-session").addEventListener("click", () => {
    submitCurrentSession();
    showScreen("finished");
  });
  $("#view-data").addEventListener("click", openResearch);
  $("#new-participant").addEventListener("click", startNewParticipant);
  $("#export-json").addEventListener("click", () => exportRecords("json"));
  $("#export-csv").addEventListener("click", () => exportRecords("csv"));
  $("#clear-data").addEventListener("click", async () => {
    if (!confirm("Permanently delete every participant story stored on this main device?")) return;
    try {
      await deleteCloudRecords();
      state.records = [];
      state.sessionRecordIds = [];
      writeStorage(STORAGE_RECORDS, []);
      saveDraft();
      renderResearch();
      renderSyncStatus();
      showToast("All research data on the main device has been deleted.");
    } catch (error) {
      showToast(error.message);
    }
  });

  window.addEventListener("online", syncPendingRecords);
  window.addEventListener("offline", renderSyncStatus);
}

function renderAll() {
  renderCharacters();
  renderMoments();
  renderMap();
  renderReflection();
}

async function init() {
  loadDraft();
  $("#participant-id").value = state.session.participantId;
  $("#age-range").value = state.session.ageRange;
  $("#local-area").value = state.session.localArea;
  $("#consent").checked = state.session.consent;
  renderAll();
  bindEvents();
  showScreen(state.screen, { scroll: false });
  await checkServerConnection();
  if (cloudConfigured()) {
    $("#storage-note").textContent =
      "No name, email, address, or precise location is requested. Completed stories sync securely to the main research device.";
    $("#finish-sync-copy").textContent =
      "They are syncing securely with the main research device. You may close this page.";
  } else {
    $("#storage-note").textContent =
      "No name, email, address, or precise location is requested. This page is not connected to the main device, so answers remain here.";
    $("#finish-sync-copy").textContent =
      "They are saved here. Open the shared main-device address to collect across devices.";
  }
  renderSyncStatus();
  syncPendingRecords();
}

init();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
