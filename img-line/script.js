let dragged = null;
let level = 0;

const levels = ["img1", "img2", "img3"];

/* =======================
   START GAME
======================= */
function startGame() {
  document.getElementById("startBtn").classList.add("hidden");
  level = 0;

  runLevel();
}

/* =======================
   LOAD LEVEL (ГЛАВНОЕ)
======================= */
function loadLevel() {
  const folder = levels[level];

  const memoryArea = document.getElementById("memoryArea");
  const dropZone = document.getElementById("dropZone");
  const pool = document.getElementById("pool");

  memoryArea.innerHTML = "";
  dropZone.innerHTML = "";
  pool.innerHTML = "";

  for (let i = 1; i <= 5; i++) {

    // память
    memoryArea.innerHTML += `
      <img src="${folder}/${i}.png" class="symbolImg">
    `;

    // слоты
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.answer = `${i}`;
    dropZone.appendChild(slot);

    // картинки
    const item = document.createElement("img");
    item.src = `${folder}/${i}.png`;
    item.className = "item";
    item.draggable = true;
    item.dataset.id = `${i}`;

    pool.appendChild(item);
  }

  addSlotHandlers();
}

/* =======================
   SHUFFLE
======================= */
function shufflePool() {
  const pool = document.getElementById("pool");
  const items = Array.from(pool.children);

  items.sort(() => Math.random() - 0.5);

  pool.innerHTML = "";
  items.forEach(item => pool.appendChild(item));
}

/* =======================
   DRAG
======================= */
document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("item")) {
    dragged = e.target;
  }
});

/* =======================
   SLOTS
======================= */
function addSlotHandlers() {
  document.querySelectorAll(".slot").forEach(slot => {

    slot.ondragover = (e) => e.preventDefault();

    slot.ondrop = () => {
      if (!dragged) return;

      if (slot.firstChild) {
        document.getElementById("pool").appendChild(slot.firstChild);
        slot.firstChild.classList.remove("in-slot");
      }

      slot.appendChild(dragged);
      dragged.classList.add("in-slot");
    };

  });
}

/* =======================
   POOL DROP
======================= */
document.getElementById("pool").addEventListener("dragover", e => e.preventDefault());

document.getElementById("pool").addEventListener("drop", () => {
  if (dragged) {
    dragged.classList.remove("in-slot");
    document.getElementById("pool").appendChild(dragged);
  }
});

/* =======================
   CHECK
======================= */
function check() {
  let slots = document.querySelectorAll(".slot");
  let errors = 0;

  slots.forEach(slot => {
    let expected = slot.dataset.answer;
    let current = slot.firstChild ? slot.firstChild.dataset.id : "";

    if (current !== expected) {
      errors++;
      slot.style.background = "#ffb3b3";
    } else {
      slot.style.background = "#b8f7c5";
    }
  });

  document.getElementById("result").textContent =
    errors === 0 ? "🎉 Всё правильно!" : "Ошибок: " + errors;

  if (errors === 0) {
    document.getElementById("nextBtn").classList.remove("hidden");
  }
}

/* =======================
   NEXT LEVEL
======================= */
function nextLevel() {
  level++;

  if (level >= levels.length) {
    document.getElementById("result").textContent = "🏁 Игра пройдена!";
    document.getElementById("nextBtn").classList.add("hidden");
    return;
  }

  document.getElementById("result").textContent = "";

  runLevel(); // 👈 ВОТ ГЛАВНОЕ ИСПРАВЛЕНИЕ
}

function runLevel() {
  const memoryArea = document.getElementById("memoryArea");
  const gameArea = document.getElementById("gameArea");

  memoryArea.style.display = "flex";
  gameArea.classList.add("hidden");

  loadLevel();

  setTimeout(() => {
    memoryArea.style.display = "none";

    gameArea.classList.remove("hidden");
    document.getElementById("checkBtn").classList.remove("hidden");

    shufflePool();

  }, 3000);
}