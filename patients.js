// ============================================================
//  appointments.js  –  MedSystem | Consultas / Agendamentos
//  Todos os dados vêm do banco via DB.appointments (database.js)
//  Depende de: database.js
// ============================================================

// Estado local
let appointmentsData     = [];
let filteredAppointments = [];
let patientsList         = [];     // lista de pacientes para o select
let currentView          = 'list'; // 'list' | 'calendar'
let currentMonth         = new Date().getMonth();
let currentYear          = new Date().getFullYear();

// ----------------------------------------------------------
//  Helpers de status
// ----------------------------------------------------------
const getStatusColor = (status) => {
    const colors = {
        agendada:     { background: '#cce5ff', color: '#004085' },
        confirmada:   { background: '#d4edda', color: '#155724' },
        em_andamento: { background: '#fff3cd', color: '#856404' },
        concluida:    { background: '#e2e3e5', color: '#383d41' },
        cancelada:    { background: '#f8d7da', color: '#721c24' },
    };
    return colors[status] || { background: '#e9ecef', color: '#495057' };
};

const getStatusLabel = (status) => {
    const labels = {
        agendada:     'Agendada',
        confirmada:   'Confirmada',
        em_andamento: 'Em Andamento',
        concluida:    'Concluída',
        cancelada:    'Cancelada',
    };
    return labels[status] || status;
};

const formatDate = (d) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
};

// ----------------------------------------------------------
//  Carga inicial do banco
// ----------------------------------------------------------
async function loadAppointments() {
    try {
        const today = document.getElementById('filterDate')?.value ||
                      new Date().toISOString().split('T')[0];

        const data = await DB.appointments.getAll({ date: today });
        appointmentsData     = Array.isArray(data) ? data : (data.appointments || []);
        filteredAppointments = [...appointmentsData];
        updateStats();
        renderAppointmentsList();
    } catch (err) {
        console.error('[appointments] loadAppointments:', err);
        alert('Não foi possível carregar as consultas: ' +
              (err instanceof DBError ? err.message : err.message));
    }
}

async function loadPatientsList() {
    try {
        const data = await DB.patients.getAll();
        patientsList = Array.isArray(data) ? data : (data.patients || []);
    } catch (err) {
        console.error('[appointments] loadPatientsList:', err);
    }
}

// ----------------------------------------------------------
//  Filtro e estatísticas
// ----------------------------------------------------------
async function filterAppointments() {
    const selectedDate   = document.getElementById('filterDate')?.value;
    const selectedStatus = document.getElementById('filterStatus')?.value;

    try {
        const params = {};
        if (selectedDate)   params.date   = selectedDate;
        if (selectedStatus) params.status = selectedStatus;

        const data = await DB.appointments.getAll(params);
        appointmentsData     = Array.isArray(data) ? data : (data.appointments || []);
        filteredAppointments = [...appointmentsData];
        updateStats();
        if (currentView === 'list') renderAppointmentsList();
        else renderCalendar();
    } catch (err) {
        console.error('[appointments] filterAppointments:', err);
    }
}

function updateStats() {
    const today      = new Date().toISOString().split('T')[0];
    const todayCount = appointmentsData.filter(a => a.date === today).length;

    const weekStart  = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd    = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 6);
    const weekCount  = appointmentsData.filter(a => {
        const d = new Date(a.date);
        return d >= weekStart && d <= weekEnd;
    }).length;

    const pendingCount = appointmentsData.filter(a =>
        a.status === 'agendada' || a.status === 'confirmada'
    ).length;

    const monthCount = appointmentsData.filter(a => {
        const d = new Date(a.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('todayCount',   todayCount);
    setEl('weekCount',    weekCount);
    setEl('pendingCount', pendingCount);
    setEl('monthCount',   monthCount);
}

// ----------------------------------------------------------
//  Renderização: lista
// ----------------------------------------------------------
function renderAppointmentActions(appointment) {
    switch (appointment.status) {
        case 'agendada':
            return `
                <button class="btn-action btn-confirm"     onclick="confirmAppointment(${appointment.id})">Confirmar</button>
                <button class="btn-action btn-reschedule"  onclick="rescheduleAppointment(${appointment.id})">Reagendar</button>
                <button class="btn-action btn-cancel"      onclick="cancelAppointment(${appointment.id})">Cancelar</button>`;
        case 'confirmada':
            return `
                <button class="btn-action btn-start"       onclick="startAppointment(${appointment.id})">Iniciar</button>
                <button class="btn-action btn-reschedule"  onclick="rescheduleAppointment(${appointment.id})">Reagendar</button>
                <button class="btn-action btn-cancel"      onclick="cancelAppointment(${appointment.id})">Cancelar</button>`;
        case 'em_andamento':
            return `
                <button class="btn-action btn-finish"      onclick="finishAppointment(${appointment.id})">Finalizar</button>
                <button class="btn-action btn-notes"       onclick="addNotes(${appointment.id})">Anotações</button>
                <button class="btn-action btn-exam"        onclick="requestExam(${appointment.id})">Solicitar Exame</button>`;
        case 'concluida':
            return `
                <button class="btn-action btn-view"        onclick="viewPatient(${appointment.patientId})">Ver Paciente</button>
                <button class="btn-action btn-notes"       onclick="addNotes(${appointment.id})">Ver Notas</button>`;
        case 'cancelada':
            return `
                <button class="btn-action btn-reschedule"  onclick="rescheduleAppointment(${appointment.id})">Reagendar</button>`;
        default:
            return '';
    }
}

function renderAppointmentsList() {
    const container = document.getElementById('appointmentsList') ||
                      document.querySelector('.appointments-list');
    if (!container) return;

    if (filteredAppointments.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#666;">
                <div style="font-size:48px;margin-bottom:20px;">📅</div>
                <h3>Nenhuma consulta encontrada</h3>
                <p>Altere os filtros ou agende uma nova consulta</p>
            </div>`;
        return;
    }

    container.innerHTML = filteredAppointments.map(appointment => {
        const statusColor = getStatusColor(appointment.status);
        const statusLabel = getStatusLabel(appointment.status);
        return `
            <div class="appointment-card">
                <div class="appointment-header">
                    <div class="appointment-time">${appointment.time}</div>
                    <span class="status-badge status-${appointment.status}"
                          style="background:${statusColor.background};color:${statusColor.color};">
                        ${statusLabel}
                    </span>
                </div>
                <div class="appointment-patient">
                    <strong>${appointment.patientName}</strong>
                    ${appointment.phone ? `<span>${appointment.phone}</span>` : ''}
                </div>
                <div class="appointment-details">
                    <span>📋 ${appointment.type}</span>
                    <span>⏱ ${appointment.duration || 30} min</span>
                    <span>📅 ${formatDate(appointment.date)}</span>
                </div>
                ${appointment.notes ? `<div class="appointment-notes">📝 ${appointment.notes}</div>` : ''}
                <div class="appointment-actions">
                    ${renderAppointmentActions(appointment)}
                </div>
            </div>`;
    }).join('');
}

// ----------------------------------------------------------
//  Calendário
// ----------------------------------------------------------
function showCalendarView() {
    currentView = 'calendar';
    const listView     = document.getElementById('listView');
    const calendarView = document.getElementById('calendarView');
    if (listView)     listView.style.display     = 'none';
    if (calendarView) calendarView.style.display = 'block';
    renderCalendar();
}

function showListView() {
    currentView = 'list';
    const listView     = document.getElementById('listView');
    const calendarView = document.getElementById('calendarView');
    if (listView)     listView.style.display     = 'block';
    if (calendarView) calendarView.style.display = 'none';
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;

    const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                        'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    const titleEl = document.getElementById('calendarTitle');
    if (titleEl) titleEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay   = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth= new Date(currentYear, currentMonth + 1, 0).getDate();

    calendarGrid.innerHTML = '';
    ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(d => {
        const h = document.createElement('div');
        h.className = 'calendar-header-day';
        h.textContent = d;
        calendarGrid.appendChild(h);
    });

    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        blank.className = 'calendar-day empty';
        calendarGrid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr       = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const dayAppts      = appointmentsData.filter(a => a.date === dateStr);
        const today         = new Date().toISOString().split('T')[0];

        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${dateStr === today ? 'today' : ''} ${dayAppts.length ? 'has-appointments' : ''}`;
        dayEl.innerHTML = `
            <div class="day-number">${day}</div>
            ${dayAppts.slice(0, 3).map(a => `
                <div class="calendar-appointment" style="background:${getStatusColor(a.status).background};color:${getStatusColor(a.status).color};">
                    ${a.time} - ${a.patientName.split(' ')[0]}
                </div>`).join('')}
            ${dayAppts.length > 3 ? `<div class="more-appointments">+${dayAppts.length - 3} mais</div>` : ''}`;
        calendarGrid.appendChild(dayEl);
    }
}

function previousMonth() {
    if (--currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
}
function nextMonth() {
    if (++currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
}

// ----------------------------------------------------------
//  Ações de status (persistem no banco)
// ----------------------------------------------------------
async function updateAppointmentStatus(id, status, confirmMsg, successMsg) {
    if (!confirm(confirmMsg)) return;
    try {
        await DB.appointments.updateStatus(id, status);
        const appt = appointmentsData.find(a => a.id === id);
        if (appt) appt.status = status;
        alert(successMsg);
        updateStats();
        renderAppointmentsList();
    } catch (err) {
        alert('Erro: ' + (err instanceof DBError ? err.message : err.message));
    }
}

function startAppointment(id)    { updateAppointmentStatus(id, 'em_andamento', 'Iniciar consulta do paciente?', 'Consulta iniciada!'); }
function finishAppointment(id)   { updateAppointmentStatus(id, 'concluida',    'Finalizar consulta?',           'Consulta finalizada com sucesso!'); }
function confirmAppointment(id)  { updateAppointmentStatus(id, 'confirmada',   'Confirmar esta consulta?',      'Consulta confirmada!'); }

async function rescheduleAppointment(id) {
    const appt    = appointmentsData.find(a => a.id === id);
    if (!appt) return;
    const newDate = prompt('Nova data (AAAA-MM-DD):', appt.date);
    const newTime = prompt('Novo horário (HH:MM):',   appt.time);
    if (!newDate || !newTime) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate) || !/^\d{2}:\d{2}$/.test(newTime)) {
        alert('Formato inválido!'); return;
    }
    try {
        await DB.appointments.update(id, { ...appt, date: newDate, time: newTime });
        appt.date = newDate; appt.time = newTime;
        alert(`Consulta reagendada para ${formatDate(newDate)} às ${newTime}`);
        updateStats(); renderAppointmentsList();
    } catch (err) {
        alert('Erro ao reagendar: ' + (err instanceof DBError ? err.message : err.message));
    }
}

async function cancelAppointment(id) {
    const reason = prompt('Motivo do cancelamento:');
    if (!reason) return;
    try {
        await DB.appointments.update(id, { status: 'cancelada', notes: `Cancelada: ${reason}` });
        const appt = appointmentsData.find(a => a.id === id);
        if (appt) { appt.status = 'cancelada'; appt.notes = `Cancelada: ${reason}`; }
        alert('Consulta cancelada com sucesso!');
        updateStats(); renderAppointmentsList();
    } catch (err) {
        alert('Erro ao cancelar: ' + (err instanceof DBError ? err.message : err.message));
    }
}

async function addNotes(id) {
    const appt = appointmentsData.find(a => a.id === id);
    if (!appt) return;
    const notes = prompt('Anotações:', appt.notes || '');
    if (notes === null) return;
    try {
        await DB.appointments.update(id, { ...appt, notes });
        appt.notes = notes;
        alert('Anotações salvas!');
    } catch (err) {
        alert('Erro ao salvar notas: ' + (err instanceof DBError ? err.message : err.message));
    }
}

function viewPatient(patientId) { window.location.href = `patients.html?highlight=${patientId}`; }

function requestExam(id) {
    const appt = appointmentsData.find(a => a.id === id);
    if (appt && confirm('Solicitar exame para este paciente?')) {
        window.location.href = `exams.html?patient=${appt.patientId}`;
    }
}

// ----------------------------------------------------------
//  Modal: Nova Consulta
// ----------------------------------------------------------
function openNewAppointmentModal() {
    const modal = document.getElementById('newAppointmentModal');
    if (!modal) return;
    modal.style.display = 'block';

    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    populatePatientSelect();
}

function closeNewAppointmentModal() {
    const modal = document.getElementById('newAppointmentModal');
    if (modal) { modal.style.display = 'none'; document.getElementById('newAppointmentForm')?.reset(); }
}

function populatePatientSelect() {
    const select = document.getElementById('patientSelect');
    if (!select) return;
    while (select.children.length > 1) select.removeChild(select.lastChild);
    patientsList.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id; opt.textContent = p.name;
        select.appendChild(opt);
    });
}

// ----------------------------------------------------------
//  Inicialização
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    const filterDate   = document.getElementById('filterDate');
    const filterStatus = document.getElementById('filterStatus');

    if (filterDate) {
        filterDate.value = new Date().toISOString().split('T')[0];
        filterDate.addEventListener('change', filterAppointments);
    }
    if (filterStatus) filterStatus.addEventListener('change', filterAppointments);

    // Carrega pacientes e consultas do banco
    await Promise.all([loadPatientsList(), loadAppointments()]);

    // Formulário de nova consulta
    const form = document.getElementById('newAppointmentForm');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const patientId = document.getElementById('patientSelect').value;
            const date      = document.getElementById('appointmentDate').value;
            const time      = document.getElementById('appointmentTime').value;
            const type      = document.getElementById('appointmentType').value;
            const notes     = document.getElementById('appointmentNotes').value;

            if (!patientId || !date || !time || !type) {
                alert('Preencha todos os campos obrigatórios.'); return;
            }

            const patient = patientsList.find(p => p.id == patientId);
            try {
                const created = await DB.appointments.create({
                    patientId: parseInt(patientId),
                    patientName: patient?.name || 'Paciente',
                    phone: patient?.phone || '',
                    date, time, duration: 30, type, status: 'agendada', notes,
                });
                appointmentsData.push(created);
                alert('Consulta agendada com sucesso!');
                closeNewAppointmentModal();
                filterAppointments();
            } catch (err) {
                alert('Erro ao agendar: ' + (err instanceof DBError ? err.message : err.message));
            }
        });
    }

    // Fechar modal clicando fora
    document.getElementById('newAppointmentModal')?.addEventListener('click', function (e) {
        if (e.target === this) closeNewAppointmentModal();
    });

    // Auto-refresh a cada 5 minutos
    setInterval(() => {
        if (currentView === 'list') renderAppointmentsList();
        else renderCalendar();
        updateStats();
    }, 5 * 60 * 1000);
});

// Expõe globalmente para atributos onclick no HTML
Object.assign(window, {
    filterAppointments, showCalendarView, showListView,
    previousMonth, nextMonth,
    startAppointment, finishAppointment, confirmAppointment,
    rescheduleAppointment, cancelAppointment,
    viewPatient, addNotes, requestExam,
    openNewAppointmentModal, closeNewAppointmentModal,
});
