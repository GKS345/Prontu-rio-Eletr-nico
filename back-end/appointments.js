
// Sistema de Consultas - JavaScript Completo
// Dados mockados para simulação
const appointmentsData = [
    {
        id: 1,
        patientId: 1,
        patientName: "Maria Santos Silva",
        phone: "(11) 99999-1234",
        date: "2025-06-30",
        time: "08:00",
        duration: 30,
        type: "Consulta de rotina",
        status: "confirmada",
        notes: ""
    },
    {
        id: 2,
        patientId: 2,
        patientName: "João Oliveira",
        phone: "(11) 99999-5678",
        date: "2025-06-30",
        time: "09:00",
        duration: 30,
        type: "Retorno pós-cirúrgico",
        status: "em_andamento",
        notes: ""
    },
    {
        id: 3,
        patientId: 3,
        patientName: "Ana Costa",
        phone: "(11) 99999-9012",
        date: "2025-06-30",
        time: "10:30",
        duration: 30,
        type: "Primeira consulta",
        status: "agendada",
        notes: ""
    },
    {
        id: 4,
        patientId: 4,
        patientName: "Carlos Ferreira",
        phone: "(11) 99999-3456",
        date: "2025-07-01",
        time: "14:00",
        duration: 30,
        type: "Consulta cardiológica",
        status: "confirmada",
        notes: ""
    },
    {
        id: 5,
        patientId: 5,
        patientName: "Lucia Mendes",
        phone: "(11) 99999-7890",
        date: "2025-07-01",
        time: "15:30",
        duration: 30,
        type: "Acompanhamento diabetes",
        status: "agendada",
        notes: ""
    },
    {
        id: 6,
        patientId: 6,
        patientName: "Pedro Silva",
        phone: "(11) 99999-1111",
        date: "2025-07-03",
        time: "16:00",
        duration: 30,
        type: "Consulta de rotina",
        status: "agendada",
        notes: ""
    }
];

const patientsData = [
    { id: 1, name: "Maria Santos Silva" },
    { id: 2, name: "João Oliveira" },
    { id: 3, name: "Ana Costa" },
    { id: 4, name: "Carlos Ferreira" },
    { id: 5, name: "Lucia Mendes" },
    { id: 6, name: "Pedro Silva" },
    { id: 7, name: "Roberto Costa" },
    { id: 8, name: "Patricia Lima" }
];

// Estado da aplicação
let currentView = 'list';
let currentMonth = 5; // Junho (0-indexed)
let currentYear = 2025;
let filteredAppointments = [...appointmentsData];

// Utilitários
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
};

const formatTime = (timeStr) => {
    return timeStr.substring(0, 5);
};

const getStatusColor = (status) => {
    const colors = {
        'agendada': { background: '#cce5ff', color: '#004085' },
        'confirmada': { background: '#d4edda', color: '#155724' },
        'em_andamento': { background: '#fff3cd', color: '#856404' },
        'concluida': { background: '#d1ecf1', color: '#0c5460' },
        'cancelada': { background: '#f8d7da', color: '#721c24' }
    };
    return colors[status] || { background: '#e9ecef', color: '#495057' };
};

const getStatusLabel = (status) => {
    const labels = {
        'agendada': 'Agendada',
        'confirmada': 'Confirmada',
        'em_andamento': 'Em Andamento',
        'concluida': 'Concluída',
        'cancelada': 'Cancelada'
    };
    return labels[status] || status;
};

// Funções de filtro
function filterAppointments() {
    const selectedDate = document.getElementById('filterDate').value;
    const selectedStatus = document.getElementById('filterStatus').value;

    filteredAppointments = appointmentsData.filter(appointment => {
        const dateMatch = !selectedDate || appointment.date === selectedDate;
        const statusMatch = !selectedStatus || appointment.status === selectedStatus;
        return dateMatch && statusMatch;
    });

    updateStats();
    renderAppointmentsList();
}

// Atualizar estatísticas
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    const todayCount = appointmentsData.filter(app => app.date === today).length;
    const weekCount = appointmentsData.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= startOfWeek;
    }).length;
    const pendingCount = appointmentsData.filter(app =>
        app.status === 'agendada' || app.status === 'confirmada'
    ).length;
    const monthCount = appointmentsData.filter(app => {
        const appDate = new Date(app.date);
        return appDate.getMonth() === startOfMonth.getMonth() &&
            appDate.getFullYear() === startOfMonth.getFullYear();
    }).length;

    // Atualizar DOM
    const statCards = document.querySelectorAll('.stat-card .stat-number');
    if (statCards.length >= 4) {
        statCards[0].textContent = todayCount;
        statCards[1].textContent = weekCount;
        statCards[2].textContent = pendingCount;
        statCards[3].textContent = monthCount;
    }
}

// Renderizar lista de consultas
function renderAppointmentsList() {
    const appointmentsList = document.getElementById('appointmentsList');
    if (!appointmentsList) return;

    // Agrupar por data
    const groupedAppointments = {};
    filteredAppointments.forEach(appointment => {
        if (!groupedAppointments[appointment.date]) {
            groupedAppointments[appointment.date] = [];
        }
        groupedAppointments[appointment.date].push(appointment);
    });

    // Ordenar datas
    const sortedDates = Object.keys(groupedAppointments).sort();

    let html = '';
    sortedDates.forEach(date => {
        const dateObj = new Date(date);
        const isToday = date === new Date().toISOString().split('T')[0];
        const isTomorrow = date === new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        let dateLabel = formatDate(date);
        if (isToday) dateLabel = `📅 Hoje - ${dateLabel}`;
        else if (isTomorrow) dateLabel = `📅 Amanhã - ${dateLabel}`;
        else dateLabel = `📅 ${dateLabel}`;

        const borderColor = isToday ? '#3498db' : (isTomorrow ? '#27ae60' : '#95a5a6');

        html += `
            <h3 style="color: #2c3e50; margin: ${html ? '40px' : '0'} 0 20px 0; border-left: 4px solid ${borderColor}; padding-left: 15px;">
                ${dateLabel}
            </h3>
        `;

        // Ordenar consultas por horário
        const sortedAppointments = groupedAppointments[date].sort((a, b) => a.time.localeCompare(b.time));

        sortedAppointments.forEach(appointment => {
            const statusColor = getStatusColor(appointment.status);
            const statusLabel = getStatusLabel(appointment.status);

            html += `
                <div class="patient-card">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div>
                            <div class="patient-name">${appointment.patientName}</div>
                            <div class="patient-info">
                                ⏰ ${formatTime(appointment.time)} - ${formatTime(appointment.time.split(':')[0] + ':' + (parseInt(appointment.time.split(':')[1]) + appointment.duration).toString().padStart(2, '0'))} | 📱 ${appointment.phone}<br>
                                📋 ${appointment.type} | 🆔 Paciente #${appointment.patientId.toString().padStart(3, '0')}
                            </div>
                        </div>
                        <span class="status-badge status-${appointment.status}" style="background: ${statusColor.background}; color: ${statusColor.color};">${statusLabel}</span>
                    </div>
                    <div class="patient-actions">
                        ${renderAppointmentActions(appointment)}
                    </div>
                </div>
            `;
        });
    });

    appointmentsList.innerHTML = html;
}

// Renderizar ações baseadas no status
function renderAppointmentActions(appointment) {
    const actions = [];

    switch (appointment.status) {
        case 'agendada':
            actions.push(`<button class="btn-small btn-primary" onclick="confirmAppointment(${appointment.id})">✅ Confirmar</button>`);
            actions.push(`<button class="btn-small btn-success" onclick="viewPatient(${appointment.patientId})">👤 Ver Paciente</button>`);
            actions.push(`<button class="btn-small btn-warning" onclick="rescheduleAppointment(${appointment.id})">📅 Reagendar</button>`);
            actions.push(`<button class="btn-small btn-danger" onclick="cancelAppointment(${appointment.id})">❌ Cancelar</button>`);
            break;
        case 'confirmada':
            actions.push(`<button class="btn-small btn-primary" onclick="startAppointment(${appointment.id})">▶️ Iniciar</button>`);
            actions.push(`<button class="btn-small btn-success" onclick="viewPatient(${appointment.patientId})">👤 Ver Paciente</button>`);
            actions.push(`<button class="btn-small btn-warning" onclick="rescheduleAppointment(${appointment.id})">📅 Reagendar</button>`);
            actions.push(`<button class="btn-small btn-danger" onclick="cancelAppointment(${appointment.id})">❌ Cancelar</button>`);
            break;
        case 'em_andamento':
            actions.push(`<button class="btn-small btn-success" onclick="finishAppointment(${appointment.id})">✅ Finalizar</button>`);
            actions.push(`<button class="btn-small btn-primary" onclick="addNotes(${appointment.id})">📝 Anotações</button>`);
            actions.push(`<button class="btn-small btn-warning" onclick="requestExam(${appointment.id})">🔬 Solicitar Exame</button>`);
            break;
        case 'concluida':
        case 'cancelada':
            actions.push(`<button class="btn-small btn-success" onclick="viewPatient(${appointment.patientId})">👤 Ver Paciente</button>`);
            actions.push(`<button class="btn-small btn-primary" onclick="addNotes(${appointment.id})">📝 Ver Anotações</button>`);
            break;
    }

    return actions.join('');
}

// Alternar entre visualizações
function showCalendarView() {
    const appointmentsList = document.getElementById('appointmentsList');
    const calendarView = document.getElementById('calendarView');
    const button = document.querySelector('button[onclick="showCalendarView()"]');

    if (currentView === 'list') {
        appointmentsList.style.display = 'none';
        calendarView.style.display = 'block';
        currentView = 'calendar';
        button.innerHTML = '📋 Visualizar Lista';
        renderCalendar();
    } else {
        appointmentsList.style.display = 'block';
        calendarView.style.display = 'none';
        currentView = 'list';
        button.innerHTML = '📅 Visualizar Calendário';
    }
}

// Renderizar calendário
function renderCalendar() {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;

    // Limpar dias anteriores (manter cabeçalhos)
    const dayHeaders = calendarGrid.querySelectorAll('.calendar-day:nth-child(-n+7)');
    calendarGrid.innerHTML = '';
    dayHeaders.forEach(header => calendarGrid.appendChild(header));

    // Primeiro dia do mês e dias no mês
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    // Dias do mês anterior
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.style.opacity = '0.5';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayAppointments = appointmentsData.filter(app => app.date === dateStr);

        // Verificar se é hoje
        if (currentYear === today.getFullYear() &&
            currentMonth === today.getMonth() &&
            day === today.getDate()) {
            dayElement.classList.add('today');
        }

        // Adicionar consultas
        if (dayAppointments.length > 0) {
            dayElement.classList.add('has-appointment');
            dayElement.innerHTML = `${day}`;

            dayAppointments.forEach(appointment => {
                const appointmentItem = document.createElement('div');
                appointmentItem.className = 'appointment-item';
                appointmentItem.textContent = `${formatTime(appointment.time)} ${appointment.patientName.split(' ')[0]} ${appointment.patientName.split(' ')[appointment.patientName.split(' ').length - 1].charAt(0)}.`;
                dayElement.appendChild(appointmentItem);
            });
        } else {
            dayElement.textContent = day;
        }

        calendarGrid.appendChild(dayElement);
    }

    // Completar com dias do próximo mês
    const totalCells = 42; // 6 semanas x 7 dias
    const currentCells = calendarGrid.children.length;
    for (let day = 1; currentCells + day - 1 < totalCells; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.style.opacity = '0.5';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    }
}

// Navegação do calendário
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Ações das consultas
function startAppointment(id) {
    if (confirm('Iniciar consulta do paciente?')) {
        const appointment = appointmentsData.find(app => app.id === id);
        if (appointment) {
            appointment.status = 'em_andamento';
            alert('Consulta iniciada! Timer ativado.');
            updateStats();
            renderAppointmentsList();
        }
    }
}

function finishAppointment(id) {
    if (confirm('Finalizar consulta?')) {
        const appointment = appointmentsData.find(app => app.id === id);
        if (appointment) {
            appointment.status = 'concluida';
            alert('Consulta finalizada com sucesso!');
            updateStats();
            renderAppointmentsList();
        }
    }
}

function confirmAppointment(id) {
    if (confirm('Confirmar esta consulta?')) {
        const appointment = appointmentsData.find(app => app.id === id);
        if (appointment) {
            appointment.status = 'confirmada';
            alert('Consulta confirmada!');
            updateStats();
            renderAppointmentsList();
        }
    }
}

function rescheduleAppointment(id) {
    const appointment = appointmentsData.find(app => app.id === id);
    if (!appointment) return;

    const newDate = prompt('Nova data (AAAA-MM-DD):', appointment.date);
    const newTime = prompt('Novo horário (HH:MM):', appointment.time);

    if (newDate && newTime) {
        // Validar formato da data
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^\d{2}:\d{2}$/;

        if (dateRegex.test(newDate) && timeRegex.test(newTime)) {
            appointment.date = newDate;
            appointment.time = newTime;
            alert(`Consulta reagendada para ${formatDate(newDate)} às ${newTime}`);
            updateStats();
            renderAppointmentsList();
        } else {
            alert('Formato de data ou horário inválido!');
        }
    }
}

function cancelAppointment(id) {
    const reason = prompt('Motivo do cancelamento:');
    if (reason) {
        const appointment = appointmentsData.find(app => app.id === id);
        if (appointment) {
            appointment.status = 'cancelada';
            appointment.notes = `Cancelada: ${reason}`;
            alert('Consulta cancelada com sucesso!');
            updateStats();
            renderAppointmentsList();
        }
    }
}

//Redireciona para o paciente
function viewPatient(id) {
    window.location.href = `patients.html?highlight=${id}`;
}

function addNotes(id) {
    const appointment = appointmentsData.find(app => app.id === id);
    if (!appointment) return;

    const currentNotes = appointment.notes || '';
    const notes = prompt('Adicionar anotações à consulta:', currentNotes);

    if (notes !== null) {
        appointment.notes = notes;
        alert('Anotações salvas com sucesso!');
    }
}

function requestExam(id) {
    if (confirm('Solicitar exame para este paciente?')) {
        const appointment = appointmentsData.find(app => app.id === id);
        if (appointment) {
            alert(`Redirecionando para solicitação de exame do paciente #${appointment.patientId}`);
            // window.location.href = `new-exam.html?patient=${appointment.patientId}`;
        }
    }
}

// Modal de nova consulta
function openNewAppointmentModal() {
    const modal = document.getElementById('newAppointmentModal');
    if (modal) {
        modal.style.display = 'block';

        // Definir data padrão para hoje
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            dateInput.value = today;
        }

        // Preencher select de pacientes
        populatePatientSelect();
    }
}

function closeNewAppointmentModal() {
    const modal = document.getElementById('newAppointmentModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('newAppointmentForm');
        if (form) {
            form.reset();
        }
    }
}

function populatePatientSelect() {
    const select = document.getElementById('patientSelect');
    if (!select) return;

    // Limpar opções existentes (exceto a primeira)
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }

    // Adicionar pacientes
    patientsData.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        select.appendChild(option);
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    // Configurar event listeners
    const filterDate = document.getElementById('filterDate');
    const filterStatus = document.getElementById('filterStatus');
    const newAppointmentForm = document.getElementById('newAppointmentForm');

    if (filterDate) {
        filterDate.addEventListener('change', filterAppointments);
        // Definir data padrão para hoje
        filterDate.value = new Date().toISOString().split('T')[0];
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', filterAppointments);
    }

    if (newAppointmentForm) {
        newAppointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const patientId = document.getElementById('patientSelect').value;
            const date = document.getElementById('appointmentDate').value;
            const time = document.getElementById('appointmentTime').value;
            const type = document.getElementById('appointmentType').value;
            const notes = document.getElementById('appointmentNotes').value;

            if (!patientId || !date || !time || !type) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            // Criar nova consulta
            const newAppointment = {
                id: Math.max(...appointmentsData.map(app => app.id)) + 1,
                patientId: parseInt(patientId),
                patientName: patientsData.find(p => p.id == patientId)?.name || 'Paciente Desconhecido',
                phone: "(11) 99999-0000", // Número padrão
                date: date,
                time: time,
                duration: 30,
                type: type,
                status: 'agendada',
                notes: notes
            };

            appointmentsData.push(newAppointment);
            alert('Consulta agendada com sucesso!');
            closeNewAppointmentModal();

            // Atualizar visualização
            filterAppointments();
        });
    }

    // Fechar modal clicando fora
    const modal = document.getElementById('newAppointmentModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeNewAppointmentModal();
            }
        });
    }

    // Inicializar dados
    updateStats();
    renderAppointmentsList();

    // Auto-refresh a cada 5 minutos
    setInterval(() => {
        console.log('Refreshing appointments...');
        updateStats();
        if (currentView === 'list') {
            renderAppointmentsList();
        } else {
            renderCalendar();
        }
    }, 5 * 60 * 1000);
});

// Funções globais para compatibilidade
window.filterAppointments = filterAppointments;
window.showCalendarView = showCalendarView;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.startAppointment = startAppointment;
window.finishAppointment = finishAppointment;
window.confirmAppointment = confirmAppointment;
window.rescheduleAppointment = rescheduleAppointment;
window.cancelAppointment = cancelAppointment;
window.viewPatient = viewPatient;
window.addNotes = addNotes;
window.requestExam = requestExam;
window.openNewAppointmentModal = openNewAppointmentModal;
window.closeNewAppointmentModal = closeNewAppointmentModal;