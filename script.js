const STORAGE_KEY = "mama_flow_demo_v2";

const defaultState = {
  child: {
    name: "Полина",
    birthDate: "",
    ageLabel: "1 год 8 мес",
    growth: "84 см",
    weight: "11.4 кг",
    sleep: "11 ч 40 м",
    focus: "Речь, сенсорика, мягкая адаптация к новым занятиям"
  },
  todos: [
    { id: 1, text: "Проверить напоминание о визите к врачу", done: true },
    { id: 2, text: "Открыть 2 игры на развитие мелкой моторики", done: false },
    { id: 3, text: "Записать новый продукт в дневник питания", done: false },
    { id: 4, text: "Посмотреть советы по возрасту 18–24 месяца", done: false }
  ],
  timeline: [
    { id: 1, status: "done", title: "Ранние события отмечены", note: "Базовые записи уже сохранены.", editable: false },
    { id: 2, status: "current", title: "Проверить следующее окно визита", note: "Сохранить список вопросов врачу.", editable: false },
    { id: 3, status: "upcoming", title: "Подготовка к визиту", note: "Взять документы и записать наблюдения.", editable: false },
    { id: 4, status: "upcoming", title: "Отметить самочувствие после события", note: "Сон, настроение, температура и заметки.", editable: false }
  ],
  notes: [
    { id: 1, title: "Новый продукт", body: "Попробовали новый продукт спокойно, без явной реакции.", date: "Сегодня" },
    { id: 2, title: "Вечерний сон", body: "После активной прогулки уснул быстрее. Понаблюдать ещё пару дней.", date: "Вчера" }
  ]
};

let appState = loadState();

const childNameCard = document.getElementById("childNameCard");
const childAgeCard = document.getElementById("childAgeCard");
const childNameInput = document.getElementById("childNameInput");
const childBirthInput = document.getElementById("childBirthInput");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const growthStat = document.getElementById("growthStat");
const weightStat = document.getElementById("weightStat");
const sleepStat = document.getElementById("sleepStat");
const focusText = document.getElementById("focusText");

const heroChildName = document.getElementById("heroChildName");
const heroTimelineCount = document.getElementById("heroTimelineCount");
const heroNotesCount = document.getElementById("heroNotesCount");

const todoList = document.getElementById("todoList");
const newTodoInput = document.getElementById("newTodoInput");
const addTodoBtn = document.getElementById("addTodoBtn");

const timelineList = document.getElementById("timelineList");
const eventTitleInput = document.getElementById("eventTitleInput");
const eventNoteInput = document.getElementById("eventNoteInput");
const addEventBtn = document.getElementById("addEventBtn");

const notesList = document.getElementById("notesList");
const noteTitleInput = document.getElementById("noteTitleInput");
const noteBodyInput = document.getElementById("noteBodyInput");
const addNoteBtn = document.getElementById("addNoteBtn");

const assistantInput = document.getElementById("assistantInput");
const sendAssistantBtn = document.getElementById("sendAssistantBtn");
const chatWindow = document.getElementById("chatWindow");
const promptButtons = document.querySelectorAll(".prompt-btn");
const filterButtons = document.querySelectorAll(".filter-chip");
const gameCards = document.querySelectorAll(".game-card");
const resetAllBtn = document.getElementById("resetAllBtn");

const demoAnswers = {
  "Что подойдёт для этого возраста?":
    "Для этого возраста хорошо заходят короткие повторяющиеся игры: сортировка, простые звуки, коробка ощущений, перекладывание предметов и совместные книжки с короткими фразами.",
  "Чем занять ребёнка на 10 минут?":
    "Попробуй 3 спокойных варианта: сортировка по цветам, перекладывание ложкой и мини-сенсорную коробку. Это коротко, понятно и не требует сложной подготовки.",
  "Что спросить у врача на приёме?":
    "Можно заранее выписать 3 блока: сон и режим, питание и новые продукты, вопросы по ближайшим событиям и реакции после них."
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? saved : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function calcAgeLabel(dateString) {
  if (!dateString) return appState.child.ageLabel || "Возраст не указан";
  const birth = new Date(dateString);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years === 0) return `${remMonths} мес`;
  if (remMonths === 0) return `${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"}`;
  return `${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"} ${remMonths} мес`;
}

function renderProfile() {
  childNameCard.textContent = appState.child.name;
  childAgeCard.textContent = calcAgeLabel(appState.child.birthDate) || appState.child.ageLabel;
  growthStat.textContent = appState.child.growth;
  weightStat.textContent = appState.child.weight;
  sleepStat.textContent = appState.child.sleep;
  focusText.textContent = appState.child.focus;

  childNameInput.value = appState.child.name || "";
  childBirthInput.value = appState.child.birthDate || "";

  heroChildName.textContent = `${appState.child.name}, ${childAgeCard.textContent}`;
  heroTimelineCount.textContent = `${appState.timeline.length} события`;
  heroNotesCount.textContent = `${appState.notes.length} записи`;
}

function renderTodos() {
  todoList.innerHTML = "";
  appState.todos.forEach((todo) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      saveState();
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = `todo-text ${todo.done ? "done" : ""}`;
    text.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "icon-btn";
    del.textContent = "✕";
    del.addEventListener("click", () => {
      appState.todos = appState.todos.filter((t) => t.id !== todo.id);
      saveState();
      renderTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(del);
    todoList.appendChild(li);
  });
}

function renderTimeline() {
  timelineList.innerHTML = "";
  appState.timeline.forEach((item) => {
    const wrap = document.createElement("div");
    wrap.className = `timeline-item ${item.status === "done" ? "done" : item.status === "current" ? "current" : ""}`;

    const dot = document.createElement("div");
    dot.className = "timeline-dot";

    const content = document.createElement("div");
    content.className = "timeline-content";
    content.innerHTML = `
      <span>${item.status === "done" ? "Сделано" : item.status === "current" ? "Ближайшее" : "Запланировано"}</span>
      <strong>${item.title}</strong>
      <p>${item.note}</p>
    `;

    const actions = document.createElement("div");
    actions.className = "timeline-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "secondary-btn small";
    toggleBtn.textContent = item.status === "done" ? "Вернуть" : "Готово";
    toggleBtn.addEventListener("click", () => {
      item.status = item.status === "done" ? "upcoming" : "done";
      saveState();
      renderTimeline();
      renderProfile();
    });

    actions.appendChild(toggleBtn);

    if (item.editable !== false) {
      const delBtn = document.createElement("button");
      delBtn.className = "ghost-btn small";
      delBtn.textContent = "Удалить";
      delBtn.addEventListener("click", () => {
        appState.timeline = appState.timeline.filter((e) => e.id !== item.id);
        saveState();
        renderTimeline();
        renderProfile();
      });
      actions.appendChild(delBtn);
    }

    wrap.appendChild(dot);
    wrap.appendChild(content);
    wrap.appendChild(actions);
    timelineList.appendChild(wrap);
  });
}

function renderNotes() {
  notesList.innerHTML = "";
  appState.notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `
      <div class="note-card-top">
        <strong>${note.title}</strong>
        <span class="note-date">${note.date}</span>
      </div>
      <p>${note.body}</p>
    `;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const delBtn = document.createElement("button");
    delBtn.className = "ghost-btn small";
    delBtn.textContent = "Удалить";
    delBtn.addEventListener("click", () => {
      appState.notes = appState.notes.filter((n) => n.id !== note.id);
      saveState();
      renderNotes();
      renderProfile();
    });

    actions.appendChild(delBtn);
    card.appendChild(actions);
    notesList.appendChild(card);
  });
}

function addAssistantMessage(text, type = "ai") {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateAssistantReply(text) {
  const t = text.toLowerCase();
  const child = appState.child.name || "ребёнка";

  if (t.includes("речь")) {
    return `Для ${child} можно попробовать короткие игры с повтором звуков, книжки с простыми словами и бытовые комментарии в течение дня. Главное — часто и без давления.`;
  }

  if (t.includes("сон")) {
    return "Я бы посмотрел на вечернюю рутину, перегруз днём и последние активные игры перед сном. Полезно фиксировать 2–3 вечера подряд в заметках.";
  }

  if (t.includes("врач") || t.includes("приём")) {
    return "Сохрани 3 блока вопросов: сон и режим, питание и новые продукты, наблюдения по самочувствию и всё, что ты не хочешь забыть во время разговора.";
  }

  if (t.includes("игр") || t.includes("занят")) {
    return "Попробуй фильтр по спокойным играм или речи. Самые быстрые варианты здесь — сортировка, повторение звуков и сенсорная коробка.";
  }

  return "Я бы начал с простого: сохранить вопрос в заметки, открыть подходящие игры по цели и добавить событие в таймлайн, если это что-то важное.";
}

function initEvents() {
  saveProfileBtn.addEventListener("click", () => {
    const name = childNameInput.value.trim();
    const birthDate = childBirthInput.value;
    if (name) appState.child.name = name;
    appState.child.birthDate = birthDate;
    saveState();
    renderProfile();
  });

  addTodoBtn.addEventListener("click", () => {
    const text = newTodoInput.value.trim();
    if (!text) return;
    appState.todos.unshift({ id: Date.now(), text, done: false });
    newTodoInput.value = "";
    saveState();
    renderTodos();
  });

  addEventBtn.addEventListener("click", () => {
    const title = eventTitleInput.value.trim();
    const note = eventNoteInput.value.trim();
    if (!title) return;
    appState.timeline.push({
      id: Date.now(),
      status: "upcoming",
      title,
      note: note || "Без заметки",
      editable: true
    });
    eventTitleInput.value = "";
    eventNoteInput.value = "";
    saveState();
    renderTimeline();
    renderProfile();
  });

  addNoteBtn.addEventListener("click", () => {
    const title = noteTitleInput.value.trim();
    const body = noteBodyInput.value.trim();
    if (!title || !body) return;
    appState.notes.unshift({
      id: Date.now(),
      title,
      body,
      date: "Только что"
    });
    noteTitleInput.value = "";
    noteBodyInput.value = "";
    saveState();
    renderNotes();
    renderProfile();
  });

  sendAssistantBtn.addEventListener("click", () => {
    const text = assistantInput.value.trim();
    if (!text) return;
    addAssistantMessage(text, "user");
    assistantInput.value = "";
    setTimeout(() => addAssistantMessage(generateAssistantReply(text), "ai"), 300);
  });

  promptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.textContent.trim();
      addAssistantMessage(text, "user");
      setTimeout(() => addAssistantMessage(demoAnswers[text] || generateAssistantReply(text), "ai"), 250);
    });
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      gameCards.forEach((card) => {
        if (filter === "all") {
          card.style.display = "";
        } else {
          card.style.display = card.dataset.tags.includes(filter) ? "" : "none";
        }
      });
    });
  });

  document.getElementById("scrollDashboardBtn").addEventListener("click", () => {
    document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("openAssistantBtn").addEventListener("click", () => {
    document.getElementById("assistant").scrollIntoView({ behavior: "smooth" });
  });

  resetAllBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    appState = structuredClone(defaultState);
    renderAll();
    chatWindow.innerHTML = '<div class="message ai">Привет. Я помогу сориентироваться по возрасту, играм, рутине и вопросам к врачу. Я не заменяю врача.</div>';
  });
}

function renderAll() {
  renderProfile();
  renderTodos();
  renderTimeline();
  renderNotes();
}

initEvents();
renderAll();
