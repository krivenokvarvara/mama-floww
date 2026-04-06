const assistantInput = document.getElementById("assistantInput");
const sendAssistantBtn = document.getElementById("sendAssistantBtn");
const chatWindow = document.getElementById("chatWindow");
const promptButtons = document.querySelectorAll(".prompt-btn");
const filterButtons = document.querySelectorAll(".filter-chip");
const gameCards = document.querySelectorAll(".game-card");

const demoAnswers = {
  "Что подойдёт для 1 года 8 месяцев?":
    "Для этого возраста хорошо заходят короткие повторяющиеся игры: сортировка, простые звуки, коробка ощущений, перекладывание предметов и совместные книжки с короткими фразами.",
  "Чем занять ребёнка на 10 минут?":
    "Попробуй 3 спокойных варианта: сортировка по цветам, перекладывание ложкой и мини-сенсорную коробку. Это коротко, понятно и не требует сложной подготовки.",
  "Что спросить у педиатра на приёме?":
    "Можно заранее выписать 3 блока: сон и режим, питание и новые продукты, вопросы по ближайшим прививкам и реакции после них."
};

function appendMessage(text, type = "ai") {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateAssistantReply(text) {
  const t = text.toLowerCase();

  if (t.includes("речь")) {
    return "Для речи сейчас полезны игры с повтором звуков, короткие песенки, карточки с животными и бытовые комментарии в течение дня. Главное — коротко, часто и без давления.";
  }

  if (t.includes("сон")) {
    return "Если вопрос про сон, в приложении я бы показывал мягкий чеклист: перегруз днём, ритуал перед сном, время последней активности и наблюдения без жёстких универсальных норм.";
  }

  if (t.includes("привив")) {
    return "По прививкам я бы помог структурировать подготовку к визиту и список вопросов врачу. Но решения о графике и медчасти должны подтверждаться специалистом.";
  }

  if (t.includes("игр") || t.includes("занят")) {
    return "Если нужен быстрый подбор, можно выбрать возраст, цель и длительность. Например: речь + 10 минут + спокойная игра.";
  }

  return "Я бы в таком продукте сначала показал мягкий совет по возрасту, потом 2–3 действия на сегодня и кнопку «обсудить с врачом / сохранить вопрос».";
}

sendAssistantBtn?.addEventListener("click", () => {
  const text = assistantInput.value.trim();
  if (!text) return;
  appendMessage(text, "user");
  assistantInput.value = "";

  setTimeout(() => {
    appendMessage(generateAssistantReply(text), "ai");
  }, 400);
});

promptButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.textContent.trim();
    appendMessage(text, "user");

    setTimeout(() => {
      appendMessage(demoAnswers[text] || generateAssistantReply(text), "ai");
    }, 350);
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
        return;
      }

      const tags = card.dataset.tags;
      card.style.display = tags.includes(filter) ? "" : "none";
    });
  });
});

document.getElementById("scrollDashboardBtn")?.addEventListener("click", () => {
  document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("openAssistantBtn")?.addEventListener("click", () => {
  document.getElementById("assistant")?.scrollIntoView({ behavior: "smooth" });
});
