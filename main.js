
const exercises = [
  {name:"Supino reto",group:"Peito",sets:"3 séries",reps:"8–12 reps",tip:"Controle a descida e mantenha os pés firmes."},
  {name:"Supino inclinado com halteres",group:"Peito",sets:"3 séries",reps:"8–12 reps",tip:"Use amplitude confortável e movimento controlado."},
  {name:"Crucifixo na máquina",group:"Peito",sets:"2–3 séries",reps:"10–15 reps",tip:"Evite impulso e não force a amplitude."},

  {name:"Puxada frontal",group:"Costas",sets:"3 séries",reps:"8–12 reps",tip:"Puxe com controle, sem balançar o tronco."},
  {name:"Remada baixa",group:"Costas",sets:"3 séries",reps:"8–12 reps",tip:"Mantenha o tronco estável e os ombros controlados."},
  {name:"Remada unilateral",group:"Costas",sets:"2–3 séries",reps:"10–12 reps",tip:"Faça os dois lados com técnica semelhante."},

  {name:"Agachamento",group:"Pernas",sets:"3 séries",reps:"6–10 reps",tip:"Use uma amplitude segura e carga adequada à técnica."},
  {name:"Leg press",group:"Pernas",sets:"3 séries",reps:"10–12 reps",tip:"Não trave os joelhos nem tire o quadril do apoio."},
  {name:"Mesa flexora",group:"Pernas",sets:"3 séries",reps:"10–15 reps",tip:"Faça a fase de retorno devagar."},
  {name:"Panturrilha em pé",group:"Pernas",sets:"2–3 séries",reps:"12–15 reps",tip:"Use amplitude confortável e controle total."},

  {name:"Desenvolvimento",group:"Ombros",sets:"3 séries",reps:"8–12 reps",tip:"Evite arquear excessivamente a lombar."},
  {name:"Elevação lateral",group:"Ombros",sets:"3 séries",reps:"12–15 reps",tip:"Prefira controle a cargas altas."},
  {name:"Face pull",group:"Ombros",sets:"2–3 séries",reps:"12–15 reps",tip:"Puxe em direção ao rosto sem compensar."},

  {name:"Rosca direta",group:"Braços",sets:"3 séries",reps:"8–12 reps",tip:"Mantenha os cotovelos estáveis."},
  {name:"Rosca martelo",group:"Braços",sets:"2–3 séries",reps:"10–12 reps",tip:"Evite embalar o corpo."},
  {name:"Tríceps na polia",group:"Braços",sets:"3 séries",reps:"10–15 reps",tip:"Mantenha os cotovelos próximos ao corpo."},
  {name:"Tríceps francês",group:"Braços",sets:"2–3 séries",reps:"10–12 reps",tip:"Use uma carga que permita controle."},

  {name:"Prancha",group:"Pernas",sets:"2–3 séries",reps:"20–45 s",tip:"Mantenha o tronco alinhado e respire."}
];


// ROTINA SEMANAL

const days = [
  {day:"Segunda",name:"Superior A",detail:"Empurrar + puxar"},
  {day:"Terça",name:"Inferior A",detail:"Pernas + core"},
  {day:"Quarta",name:"Recuperação",detail:"Descanso ou caminhada leve"},
  {day:"Quinta",name:"Superior B",detail:"Variações de superiores"},
  {day:"Sexta",name:"Inferior B",detail:"Pernas + estabilidade"},
  {day:"Sábado",name:"Opcional",detail:"Atividade leve ou lazer"},
  {day:"Domingo",name:"Descanso",detail:"Recuperação"}
];


// SELETORES

const $ = (selector) => document.querySelector(selector);


// SALVAMENTO LOCAL

const safeRead = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

let completed = safeRead("forge-completed", []);
let records = safeRead("forge-records", []);
let selectedFilter = "Todos";


function saveState() {
  localStorage.setItem(
    "forge-completed",
    JSON.stringify(completed)
  );

  localStorage.setItem(
    "forge-records",
    JSON.stringify(records)
  );
}


// BIBLIOTECA DE EXERCÍCIOS

function renderExercises() {

  const list = selectedFilter === "Todos"
    ? exercises
    : exercises.filter(e =>
        selectedFilter === "Braços"
          ? e.group === "Braços"
          : e.group === selectedFilter
      );

  $("#exercise-grid").innerHTML = list.map(e => `
    <article class="exercise-card">

      <div class="exercise-top">
        <h3>${e.name}</h3>
        <span class="tag">${e.group}</span>
      </div>

      <p>${e.tip}</p>

      <div class="prescription">
        <span><b>${e.sets}</b></span>
        <span>${e.reps}</span>
      </div>

    </article>
  `).join("");
}


// ROTINA SEMANAL

function renderRoutine() {

  const nowDay = new Date().getDay();

  // Domingo = 0
  // Segunda = 1
  const indexToday = nowDay === 0 ? 6 : nowDay - 1;

  $("#routine-grid").innerHTML = days.map((d, i) => {

    const done = completed.includes(i);

    return `
      <article class="day-card
        ${done ? "done" : ""}
        ${i === indexToday ? "today" : ""}">

        <div class="day-name">
          ${d.day}${i === indexToday ? " • HOJE" : ""}
        </div>

        <h3>${d.name}</h3>

        <p>${d.detail}</p>

        <button
          class="btn ${done ? "secondary" : ""} small day-check"
          data-day="${i}"
          aria-pressed="${done}">

          ${done ? "✓ Concluído" : "Marcar feito"}

        </button>

      </article>
    `;

  }).join("");


  // Eventos dos botões da rotina

  document.querySelectorAll("[data-day]")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        const day = Number(btn.dataset.day);

        if (completed.includes(day)) {

          completed = completed.filter(n => n !== day);

        } else {

          completed = [...completed, day];

        }

        saveState();

        renderRoutine();
        renderStats();
        renderProgress();

      });

    });

}


// ESTATÍSTICAS

function renderStats() {

  $("#stat-workouts").innerHTML =
    `${completed.length}<span> / 7</span>`;

  $("#stat-exercises").textContent = exercises.length;

  $("#stat-records").textContent = records.length;

}


// BARRA DE PROGRESSO

function renderProgress() {

  const count = completed.length;

  const percent = Math.min(
    100,
    Math.round(count / 4 * 100)
  );

  $("#progress-label").textContent = `${count} de 4`;

  $("#weekly-fill").style.width = percent + "%";

  $("#weekly-percent").textContent = percent + "%";

  $("#progress-toast").textContent =
    count >= 4
      ? "Meta semanal atingida. Boa consistência!"
      : "Cada sessão concluída soma ao seu histórico.";

}


// REGISTROS DE CARGA

function renderRecords() {

  const recent = records.slice(-8).reverse();

  $("#record-list").innerHTML = recent.length
    ? recent.map(r => `
        <li>
          <span>
            <b>${r.exercise}</b><br>
            <small>${r.date}</small>
          </span>

          <span>
            <b>${r.weight} kg</b> × ${r.reps}
          </span>
        </li>
      `).join("")
    : `
        <li class="empty">
          Nenhum registro ainda.
          Adicione sua primeira carga acima.
        </li>
      `;

}


// FILTROS

$("#filters").addEventListener("click", (event) => {

  const button = event.target.closest("[data-filter]");

  if (!button) return;

  selectedFilter = button.dataset.filter;

  document.querySelectorAll(".filter")
    .forEach(b => {
      b.classList.toggle("active", b === button);
    });

  renderExercises();

});


// REINICIAR SEMANA

$("#reset-week").addEventListener("click", () => {

  if (!confirm("Deseja desmarcar todos os dias desta semana?")) {
    return;
  }

  completed = [];

  saveState();

  renderRoutine();
  renderStats();
  renderProgress();

});


// FORMULÁRIO DE REGISTRO

$("#record-form").addEventListener("submit", (event) => {

  event.preventDefault();

  const weight = Number($("#record-weight").value);
  const reps = Number($("#record-reps").value);

  if (
    !Number.isFinite(weight) ||
    weight < 0 ||
    weight > 1000 ||
    !Number.isInteger(reps) ||
    reps < 1 ||
    reps > 200
  ) {
    $("#record-toast").textContent =
      "Confira a carga e o número de repetições.";

    return;
  }

  records.push({

    exercise: $("#record-exercise").value,

    weight: weight.toLocaleString("pt-BR", {
      maximumFractionDigits: 1
    }),

    reps,

    date: new Date().toLocaleDateString("pt-BR")

  });

  saveState();

  renderRecords();
  renderStats();

  $("#record-form").reset();

  $("#record-toast").textContent =
    "Registro salvo neste navegador.";

});


// TIMER DE DESCANSO

let remaining = 90;
let intervalId = null;


function showTimer() {

  const mins = String(
    Math.floor(remaining / 60)
  ).padStart(2, "0");

  const secs = String(
    remaining % 60
  ).padStart(2, "0");

  $("#timer-display").textContent =
    `${mins}:${secs}`;

}


function stopTimer() {

  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  intervalId = null;

  $("#timer-toggle").textContent = "Iniciar";

}


// ESCOLHER TEMPO

document.querySelectorAll("[data-seconds]")
  .forEach(button => {

    button.addEventListener("click", () => {

      stopTimer();

      remaining = Number(button.dataset.seconds);

      showTimer();

      $("#timer-status").textContent =
        "Intervalo definido.";

    });

  });


// INICIAR OU PAUSAR

$("#timer-toggle").addEventListener("click", () => {

  // Se estiver rodando, pausa
  if (intervalId !== null) {

    stopTimer();

    $("#timer-status").textContent =
      "Timer pausado.";

    return;
  }

  if (remaining <= 0) {
    remaining = 90;
  }

  $("#timer-toggle").textContent = "Pausar";

  $("#timer-status").textContent = "Descansando…";

  intervalId = setInterval(() => {

    remaining--;

    showTimer();

    if (remaining <= 0) {

      stopTimer();

      $("#timer-status").textContent =
        "Intervalo concluído. Prepare-se para a próxima série.";

    }

  }, 1000);

});


// ZERAR TIMER

$("#timer-reset").addEventListener("click", () => {

  stopTimer();

  remaining = 90;

  showTimer();

  $("#timer-status").textContent = "Timer zerado.";

});


// INICIALIZAÇÃO

renderExercises();
renderRoutine();
renderStats();
renderProgress();
renderRecords();
showTimer();

