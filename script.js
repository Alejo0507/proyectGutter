
function showSection(sectionId) {
    // ocultar todas las secciones
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('visible');
    });

    // mostrar la que se pidió
    document.getElementById(sectionId).classList.add('visible');
}

document.getElementById("notiBtn").onclick = function() {
    const panel = document.getElementById("notiPanel");
    panel.style.display = (panel.style.display === "block") ? "none" : "block";
};

// Cerrar si se hace clic afuera
document.addEventListener("click", function(e) {
    const panel = document.getElementById("notiPanel");
    const btn = document.getElementById("notiBtn");

    if (!btn.contains(e.target) && !panel.contains(e.target)) {
        panel.style.display = "none";
    }
});

// URL de tu Google Apps Script publicado
const URL = "https://script.google.com/macros/s/AKfycbyiQSK4V6ok0hL52O-GkRgDy5LLcOfskdAIahZQ2igHXwUS-noVwlYVVOcpHG9n1A/exec";

async function cargarClases() {
    try {
        const response = await fetch(URL);
        const data = await response.json();

        const container = document.getElementById("clasesContainer");
        container.innerHTML = ""; // limpiar

        data.forEach(clase => {
            const card = document.createElement("div");
            card.classList.add("claseCard");

            card.innerHTML = `
                <h3>${clase.Class}</h3>
                <p>${clase.Description}</p>
                <p><strong>Teacher:<br></strong> ${clase.Teacher}</p>
                <p><strong>Time:<br></strong> ${clase.Time}</p>
                <img src="${clase.Image}" alt="Class Icon">
            `;

            container.appendChild(card);
        });

    } catch (e) {
        console.error("Error cargando clases:", e);
    }
}

cargarClases();

const URL2 = "https://script.google.com/macros/s/AKfycbzl2gR3Bl6h5ywFIFPQCpEodSvPgNb5ygu2xtXHokEMRMzi34O7JuijozNsC3oESWKL/exec";

async function cargarTrabajo() {
    try {
        const response = await fetch(URL2);
        const data = await response.json();

        const container = document.getElementById("workContainer");
        container.innerHTML = ""; // limpiar

        data.forEach(clase => {
            const card = document.createElement("div");
            card.classList.add("claseCard");

            card.innerHTML = `
                <h3>${clase.Jobtasks}</h3>
                <p><strong>Description:<br></strong>${clase.Description}</p>
                <p><strong>Place:<br></strong> ${clase.Place}</p>
                <p><strong>Time:<br></strong> ${clase.Time}</p>
                <img src="${clase.Image}" alt="Class Icon">
            `;

            container.appendChild(card);
        });

    } catch (e) {
        console.error("Error cargando work:", e);
    }
}

cargarTrabajo();
/* =====================================
   CONFIG
===================================== */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbw8iJMaRUGIABjwZ2IGWOZLINWoyFv1LlzfMiwNm5JBbQHjD3KFwhXd8Ga4YUD0XzkV/exec"; // pega tu URL

const daysContainer = document.getElementById("days-container");
const monthSelect = document.getElementById("month-select");
const eventCounter = document.getElementById("eventCounter");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let eventsData = []; // datos del Sheets

/* =====================================
   CARGAR GOOGLE SHEETS
===================================== */
async function loadEventsFromSheet() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.json();

    // FORMATO ESPERADO:
    // [{ "Date":"2025-02-14", "Event":"San Valentín", "Color":"red" }]

    eventsData = data;
    loadCalendar();

  } catch (err) {
    console.log("Error cargando Google Sheets:", err);
  }
}

/* =====================================
   CALENDARIO
===================================== */
function loadCalendar() {
  daysContainer.innerHTML = "";
  monthSelect.value = currentMonth;

  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const div = document.createElement("div");
    div.classList.add("day-item");

    let weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][
      new Date(currentYear, currentMonth, day).getDay()
    ];

    const dateFormatted = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    div.innerHTML = `
      <div class="day-number">${day}</div>
      <div class="day-name">${weekday}</div>
    `;

    const dayNumber = div.querySelector(".day-number");
    const dayName = div.querySelector(".day-name");

    /* ===========================
       COLORES DESDE SHEETS
    ============================ */
    const eventosDelDia = eventsData.filter(ev => ev.Date === dateFormatted);

    if (eventosDelDia.length > 0) {
      // si hay múltiples eventos, tomamos el PRIMERO
      const color = eventosDelDia[0].Color;

      dayNumber.style.backgroundColor = color;
      dayName.style.backgroundColor = color;
      dayNumber.style.color = "white";
      dayName.style.color = "white";
    }

    /* --------------------------
       MARCAR DÍA ACTUAL
    --------------------------- */
    if (
      day === currentDate.getDate() &&
      currentMonth === new Date().getMonth()
    ) {
      div.classList.add("day-active");
      updateEvents(dateFormatted);
    }

    /* --------------------------
       CLICK DEL USUARIO
    --------------------------- */
    div.onclick = () => {
      document.querySelectorAll(".day-item").forEach(el => el.classList.remove("day-active"));
      div.classList.add("day-active");
      updateEvents(dateFormatted);
    };

    daysContainer.appendChild(div);
  }
}

/* =====================================
   MOSTRAR EVENTOS
===================================== */
function updateEvents(dateString) {
  const todayEvents = eventsData.filter(ev => ev.Date === dateString);

  let day = dateString.split("-")[2];
  let weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][
    new Date(dateString).getDay()
  ];

  eventCounter.textContent = `${todayEvents.length} events • ${weekday}, ${day}`;
}

/* =====================================
   CAMBIO DE MES
===================================== */
monthSelect.onchange = (e) => {
  currentMonth = parseInt(e.target.value);
  loadCalendar();
};

/* =====================================
   INICIAR
===================================== */
loadEventsFromSheet();
