
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

// script.js — versión robusta que crea el modal si no existe y usa delegación
(function(){
  // Crear el markup del modal (si no existe)
  function ensureModalExists(){
    if(document.getElementById('overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';
    overlay.innerHTML = `
      <div id="modal" class="modal modal--small" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 id="modal-title">Título</h3>
          <button class="close-modal" aria-label="Cerrar">&times;</button>
        </div>
        <div id="modal-body" class="modal-body"></div>
        <div class="modal-footer">
          <button class="close-modal btn">Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Abrir modal con contenido según tipo
  function openModal(type, sourceBtn){
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    if(!title || !body) return;

    switch(type){
      case 'config':
        title.textContent = 'System Settings';
        body.innerHTML = `
<div class="settings-panel">
    <p class="desc3">Gutter system settings and configuration.</p>

    <div class="settings-section-2">
        <h3>Profile</h3>
        <button class="g-btn">Edit Display Name</button>
        <button class="g-btn">Change Security PIN</button>
        <button class="g-btn">Update Status</button>
    </div>

    <div class="settings-section-2">
        <h3>Notifications</h3>
        <button class="g-btn">Enable Alerts</button>
        <button class="g-btn">Mute Messages</button>
        <button class="g-btn">Warning Filters</button>
    </div>

    <div class="settings-section-2  ">
        <h3>System</h3>
        <button class="g-btn">Restart Panel</button>
        <button class="g-btn">Report Malfunction</button>
        <button class="g-btn">View Activity Log</button>
    </div>
</div>
`;
        break;
      case 'info':
        title.textContent = 'Information';
       body.innerHTML = `
<div class="info-panel">

    <h3 class="desc3">General information about the system</h3>

    <div class="info-block">
        <h3>Housing Fee</h3>
        <p>
Recurring charge for occupation of the assigned level.</p>
    </div>

    <div class="info-block">
        <h3>Maintenance & Utilities</h3>
        <p>Discounts applied for use of facilities and supplies.</p>
    </div>

    <div class="info-block">
        <h3>Behavioral Penalties</h3>
        <p>Automatic fines for delays, errors or violations of regulations.</p>
    </div>

    <div class="info-block">
        <h3>Work Compensation Applied</h3>
        <p>Credits deducted from your debt based on hours completed on Gutter tasks.</p>
    </div>
</div>
`;
 break;
      case 'laws':
        title.textContent = 'Laws & Regulations';
        body.innerHTML = `<div class="laws-panel">
    

    <p class="desc3">Rules, regulations and mandatory protocols for all residents of The Academy</p>

    <!-- Conduct Rules -->
    <div class="settings-section">
        <h3>Conduct Rules</h3>

        <p class="law-item">
            • Residents must report for all assigned tasks without delay.
        </p>
        <p class="law-item">
            • Interactions must be kept neutral in tone; discussions or confrontations are penalized.
        </p>
        <p class="law-item">
            • It is prohibited to leave the assigned level without authorization from the central system.
        </p>
        <p class="law-item">
            • Any damage to public property or infrastructure will be deducted from the debt balance.
        </p>
        <p class="law-item">
            • Failure to comply with direct orders from staff will result in automatic penalties.
        </p>
    </div>

    <!-- Operational Protocols -->
    <div class="settings-section">
        <h3>Operational Protocols</h3>

        <p class="law-item">
            • In case of alarm, the resident must proceed to the nearest meeting point without running.
        </p>
        <p class="law-item">
            • The use of restricted hallways is only permitted during maintenance hours.
        </p>
        <p class="law-item">
            • Any anomalies detected in monitoring equipment must be reported immediately.
        </p>
        <p class="law-item">
            • It is prohibited to tamper with electrical systems, automated doors, or control panels.
        </p>
        <p class="law-item">
            • Security routines must be followed exactly as programmed.
        </p>
    </div>

    <!-- Legal Documents -->
    <div class="settings-section">
        <h3>Legal Documents</h3>

        <p class="law-item">
            • Upon entering the Academy, the resident accepts full responsibility for their assigned debt.
        </p>
        <p class="law-item">
            • Failure to make payments will result in progressive penalties.
        </p>
        <p class="law-item">
            • The resident authorizes the retention of part of their work compensation for automatic payment.
        </p>
        <p class="law-item">
            • The disclosure of internal procedures is strictly prohibited.
        </p>
        <p class="law-item">
            • Access to official documents is subject to supervision by the central system.
        </p>
    </div>

    <!-- Accept Button -->
    <div class="accept-terms">
        <button class="g-btn accept-btn">Accept Terms (Required)</button>
    </div>
</div>
        `;
        break;
      case 'help':
        title.textContent = 'Help';
        body.innerHTML = `

        <H2>To receive any kind of help, please go to the main office and speak with the academy advisor.</H2>

 <p class="desc3">
        Official support channels available to residents of the Academy.
        Access to assistance is regulated and subject to eligibility conditions.
    </p>

    <div class="help-section">
        <h3>Emergency Assistance</h3>
        <p>
            Immediate intervention is reserved for critical system failures or
            life-threatening situations. Unauthorized emergency requests may
            result in additional penalties.
        </p>
    </div>

    <div class="help-section">
        <h3>Red Vest Personnel</h3>
        <p>
            Students identified by red safety vests are authorized monitors.
            They may request priority assistance, report incidents directly,
            and intervene during regulated conflicts.
        </p>
    </div>

    <div class="help-section">
        <h3>Standard Student Support</h3>
        <p>
            Regular residents may access assistance only after completing the
            minimum required debt threshold. Requests made before eligibility
            will be automatically denied.
        </p>
    </div>

    <div class="help-section">
        <h3>Debt-Based Access</h3>
        <p>
            Support availability increases proportionally with debt reduction.
            Cooperation and completed labor assignments improve response priority.
        </p>
    </div>

    <div class="help-section">
        <h3>Unresolved Requests</h3>
        <p>
            If assistance is unavailable, residents are expected to resolve
            issues independently or await system reassignment.
        </p>
    </div>

</div>


        <div class="help-panel">

    <p class="desc">The total amount of your debt paid is not enough to book a help appointment.</p>
    <p class="desc2"> Please complete more work tasks to reduce your debt further.</p>
    </div>

        `;
        break;
      default:
        title.textContent = sourceBtn ? (sourceBtn.textContent.trim() || 'Ventana') : 'Ventana';
        body.innerHTML = '<p>Contenido por defecto.</p>';
    }

    document.getElementById('overlay').classList.add('show');
    // foco accesible al modal
    const close = document.querySelector('#modal .close-modal');
    if(close) close.focus();
  }

  function closeModal(){
    const ov = document.getElementById('overlay');
    if(ov) ov.classList.remove('show');
  }

  // Delegación de eventos: clicks para abrir / cerrar
  function setupDelegation(){
    document.addEventListener('click', function(e){
      // abrir: buscar el btn más cercano con data-modal
      const opener = e.target.closest('[data-modal]');
      if(opener){
        const type = opener.dataset.modal;
        openModal(type, opener);
        return;
      }

      // cerrar con botones .close-modal
      if(e.target.closest('.close-modal')){
        closeModal();
        return;
      }

      // clic fuera del modal (sobre el overlay) cierra
      const ov = document.getElementById('overlay');
      if(ov && e.target === ov){
        closeModal();
      }
    });

    // cerrar con ESC
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        closeModal();
      }
    });
  }

  // Arranque seguro
  document.addEventListener('DOMContentLoaded', function(){
    ensureModalExists();
    setupDelegation();
    // pequeño log para debug si algo falla
    // console.log('Modal ready — search botones con [data-modal]');
  });
})();
