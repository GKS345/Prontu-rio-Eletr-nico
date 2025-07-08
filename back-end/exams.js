// Sistema de Exames - Script JavaScript Completo
// Dados simulados para o sistema
const examsData = {
    patients: [
        { id: 1, name: 'Maria Santos Silva', code: '#001' },
        { id: 2, name: 'João Oliveira', code: '#002' },
        { id: 3, name: 'Ana Costa', code: '#003' },
        { id: 4, name: 'Carlos Ferreira', code: '#004' },
        { id: 5, name: 'Lucia Mendes', code: '#005' }
    ],
    
    exams: [
        {
            id: 1,
            patientId: 1,
            patientName: 'Maria Santos Silva',
            patientCode: '#001',
            title: 'Hemograma Completo',
            type: 'laboratorio',
            date: '2025-06-30',
            time: '08:00',
            status: 'realizado',
            location: 'Lab Central',
            indication: 'Rotina pré-operatória',
            observations: 'Paciente em jejum de 12h',
            result: 'Valores dentro da normalidade',
            hasResult: true
        },
        {
            id: 2,
            patientId: 2,
            patientName: 'João Oliveira',
            patientCode: '#002',
            title: 'Raio-X Tórax',
            type: 'imagem',
            date: '2025-06-30',
            time: '14:00',
            status: 'agendado',
            location: 'Clínica Radiológica',
            indication: 'Investigação de tosse persistente',
            observations: 'Remover objetos metálicos',
            hasResult: false
        },
        {
            id: 3,
            patientId: 3,
            patientName: 'Ana Costa',
            patientCode: '#003',
            title: 'Ultrassom Abdominal',
            type: 'imagem',
            date: '2025-06-27',
            time: '10:00',
            status: 'entregue',
            location: 'Diagnóstico Center',
            indication: 'Dor abdominal',
            observations: 'Resultado entregue ao paciente',
            result: 'Estruturas dentro da normalidade',
            hasResult: true
        },
        {
            id: 4,
            patientId: 4,
            patientName: 'Carlos Ferreira',
            patientCode: '#004',
            title: 'Ecocardiograma',
            type: 'cardiologico',
            date: '2025-06-28',
            time: '15:30',
            status: 'realizado',
            location: 'Cardio Center',
            indication: 'Avaliação da função cardíaca',
            observations: 'Aguardando laudo do especialista',
            hasResult: false
        },
        {
            id: 5,
            patientId: 5,
            patientName: 'Lucia Mendes',
            patientCode: '#005',
            title: 'Glicemia de Jejum',
            type: 'laboratorio',
            date: '2025-06-29',
            time: '07:00',
            status: 'resultado_pronto',
            location: 'Lab Express',
            indication: 'Controle diabético',
            observations: 'Valores dentro da normalidade',
            result: '95 mg/dL (Normal)',
            hasResult: true
        }
    ]
};

// Definições de tipos de exame
const examTypes = {
    'laboratorio': [
        'Hemograma Completo',
        'Glicemia de Jejum',
        'Colesterol Total',
        'Triglicerídeos',
        'Creatinina',
        'Ureia',
        'TGO/TGP',
        'TSH',
        'T3/T4',
        'Exame de Urina'
    ],
    'imagem': [
        'Raio-X Tórax',
        'Raio-X Abdome',
        'Ultrassom Abdominal',
        'Ultrassom Pélvico',
        'Tomografia Computadorizada',
        'Ressonância Magnética',
        'Mamografia',
        'Densitometria Óssea'
    ],
    'cardiologico': [
        'Eletrocardiograma (ECG)',
        'Ecocardiograma',
        'Teste Ergométrico',
        'Holter 24h',
        'MAPA',
        'Cintilografia Miocárdica'
    ],
    'neurologico': [
        'Eletroencefalograma (EEG)',
        'Eletromiografia',
        'Doppler Transcraniano',
        'Ressonância Magnética - Crânio'
    ]
};

// Utilitários
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}

function formatDateTime(dateStr, timeStr) {
    return `${formatDate(dateStr)} - ${timeStr}`;
}

function getStatusBadge(status) {
    const statusMap = {
        'solicitado': { bg: '#fff3cd', color: '#856404', text: 'Solicitado' },
        'agendado': { bg: '#cce5ff', color: '#004085', text: 'Agendado' },
        'realizado': { bg: '#d4edda', color: '#155724', text: 'Realizado' },
        'resultado_pronto': { bg: '#cce5ff', color: '#004085', text: 'Resultado Pronto' },
        'entregue': { bg: '#d1ecf1', color: '#0c5460', text: 'Entregue' },
        'cancelado': { bg: '#f8d7da', color: '#721c24', text: 'Cancelado' }
    };
    
    const statusInfo = statusMap[status] || statusMap['solicitado'];
    return `<span class="status-badge" style="background: ${statusInfo.bg}; color: ${statusInfo.color};">${statusInfo.text}</span>`;
}

// Funções de filtro
function filterExams() {
    const selectedDate = document.getElementById('filterDate').value;
    const selectedStatus = document.getElementById('filterStatus').value;
    const selectedType = document.getElementById('filterType').value;
    
    let filteredExams = examsData.exams;
    
    if (selectedDate) {
        filteredExams = filteredExams.filter(exam => exam.date === selectedDate);
    }
    
    if (selectedStatus) {
        filteredExams = filteredExams.filter(exam => exam.status === selectedStatus);
    }
    
    if (selectedType) {
        filteredExams = filteredExams.filter(exam => exam.type === selectedType);
    }
    
    renderFilteredExams(filteredExams);
    updateStats(filteredExams);
}

function renderFilteredExams(exams) {
    const examsList = document.getElementById('examsList');
    
    if (exams.length === 0) {
        examsList.innerHTML = '<div class="no-results">Nenhum exame encontrado com os filtros aplicados.</div>';
        return;
    }
    
    // Agrupar exames por categoria
    const todayExams = exams.filter(exam => exam.date === new Date().toISOString().split('T')[0]);
    const pendingResults = exams.filter(exam => exam.status === 'realizado' && !exam.hasResult);
    const recentResults = exams.filter(exam => exam.hasResult && exam.status !== 'entregue');
    const deliveredResults = exams.filter(exam => exam.status === 'entregue');
    
    let html = '';
    
    if (todayExams.length > 0) {
        html += `
            <h3 style="color: #2c3e50; margin-bottom: 20px; border-left: 4px solid #e74c3c; padding-left: 15px;">
                🔬 Exames de Hoje - ${formatDate(new Date().toISOString().split('T')[0])}
            </h3>
        `;
        todayExams.forEach(exam => {
            html += renderExamCard(exam);
        });
    }
    
    if (pendingResults.length > 0) {
        html += `
            <h3 style="color: #2c3e50; margin: 40px 0 20px 0; border-left: 4px solid #f39c12; padding-left: 15px;">
                ⏳ Resultados Pendentes
            </h3>
        `;
        pendingResults.forEach(exam => {
            html += renderExamCard(exam);
        });
    }
    
    if (recentResults.length > 0) {
        html += `
            <h3 style="color: #2c3e50; margin: 40px 0 20px 0; border-left: 4px solid #27ae60; padding-left: 15px;">
                ✅ Resultados Recentes
            </h3>
        `;
        recentResults.forEach(exam => {
            html += renderExamCard(exam);
        });
    }
    
    if (deliveredResults.length > 0) {
        html += `
            <h3 style="color: #2c3e50; margin: 40px 0 20px 0; border-left: 4px solid #6c757d; padding-left: 15px;">
                📋 Resultados Entregues
            </h3>
        `;
        deliveredResults.forEach(exam => {
            html += renderExamCard(exam);
        });
    }
    
    examsList.innerHTML = html;
}

function renderExamCard(exam) {
    const typeLabels = {
        'laboratorio': 'Laboratório',
        'imagem': 'Imagem',
        'cardiologico': 'Cardiológico',
        'neurologico': 'Neurológico'
    };
    
    const actions = getExamActions(exam);
    
    return `
        <div class="exam-card">
            <div class="exam-header">
                <div>
                    <div class="exam-title">${exam.title}</div>
                    <div style="color: #666; margin: 5px 0;">
                        👤 <strong>${exam.patientName}</strong> | 🆔 ${exam.patientCode}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="exam-date">${formatDateTime(exam.date, exam.time)}</div>
                    ${getStatusBadge(exam.status)}
                </div>
            </div>
            <div class="exam-result">
                <strong>📋 Tipo:</strong> ${typeLabels[exam.type]} | <strong>🏥 Local:</strong> ${exam.location}<br>
                <strong>📝 Indicação:</strong> ${exam.indication}<br>
                ${exam.result ? `<strong>📊 Resultado:</strong> ${exam.result}<br>` : ''}
                <strong>⚠️ ${exam.result ? 'Observações' : 'Preparação'}:</strong> ${exam.observations}
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                ${actions}
            </div>
        </div>
    `;
}

function getExamActions(exam) {
    switch (exam.status) {
        case 'agendado':
            return `
                <button class="btn-small btn-warning" onclick="rescheduleExam(${exam.id})">📅 Reagendar</button>
                <button class="btn-small btn-success" onclick="viewPatient(${exam.patientId})">👤 Ver Paciente</button>
                <button class="btn-small btn-danger" onclick="cancelExam(${exam.id})">❌ Cancelar</button>
            `;
        case 'realizado':
            if (exam.hasResult) {
                return `
                    <button class="btn-small btn-primary" onclick="viewResult(${exam.id})">📊 Ver Resultado</button>
                    <button class="btn-small btn-success" onclick="downloadResult(${exam.id})">📥 Download</button>
                    <button class="btn-small btn-warning" onclick="sendToPatient(${exam.id})">📧 Enviar ao Paciente</button>
                    <button class="btn-small btn-primary" onclick="printResult(${exam.id})">🖨️ Imprimir</button>
                `;
            } else {
                return `
                    <button class="btn-small btn-primary" onclick="followUpExam(${exam.id})">📞 Acompanhar</button>
                    <button class="btn-small btn-warning" onclick="requestUrgent(${exam.id})">⚡ Urgente</button>
                    <button class="btn-small btn-success" onclick="viewPatient(${exam.patientId})">👤 Ver Paciente</button>
                `;
            }
        case 'resultado_pronto':
            return `
                <button class="btn-small btn-primary" onclick="viewResult(${exam.id})">📊 Ver Completo</button>
                <button class="btn-small btn-success" onclick="downloadResult(${exam.id})">📥 Download</button>
                <button class="btn-small btn-warning" onclick="scheduleFollowUp(${exam.id})">📅 Agendar Retorno</button>
                <button class="btn-small btn-primary" onclick="addToHistory(${exam.id})">📋 Adicionar ao Histórico</button>
            `;
        case 'entregue':
            return `
                <button class="btn-small btn-primary" onclick="viewResult(${exam.id})">📊 Ver Resultado</button>
                <button class="btn-small btn-success" onclick="viewPatient(${exam.patientId})">👤 Ver Paciente</button>
            `;
        default:
            return `
                <button class="btn-small btn-success" onclick="viewPatient(${exam.patientId})">👤 Ver Paciente</button>
            `;
    }
}

function updateStats(exams = null) {
    const examsList = exams || examsData.exams;
    const today = new Date().toISOString().split('T')[0];
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    
    const pending = examsList.filter(exam => 
        exam.status === 'solicitado' || exam.status === 'agendado' || 
        (exam.status === 'realizado' && !exam.hasResult)
    ).length;
    
    const todayCount = examsList.filter(exam => exam.date === today).length;
    
    const thisWeekCount = examsList.filter(exam => {
        const examDate = new Date(exam.date);
        return examDate >= thisWeekStart;
    }).length;
    
    const thisMonthCount = examsList.filter(exam => {
        const examDate = new Date(exam.date);
        return examDate >= thisMonthStart;
    }).length;
    
    // Atualizar os cards de estatísticas
    const statCards = document.querySelectorAll('.stat-card .stat-number');
    if (statCards.length >= 4) {
        statCards[0].textContent = pending;
        statCards[1].textContent = todayCount;
        statCards[2].textContent = thisWeekCount;
        statCards[3].textContent = thisMonthCount;
    }
}

// Ações dos exames
function viewResult(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    const resultContent = `
        <div style="padding: 20px;">
            <h3>📊 Resultado: ${exam.title}</h3>
            <p><strong>Paciente:</strong> ${exam.patientName} ${exam.patientCode}</p>
            <p><strong>Data:</strong> ${formatDateTime(exam.date, exam.time)}</p>
            <p><strong>Local:</strong> ${exam.location}</p>
            <p><strong>Resultado:</strong> ${exam.result || 'Aguardando resultado'}</p>
            <p><strong>Observações:</strong> ${exam.observations}</p>
        </div>
    `;
    
    showModal('Resultado do Exame', resultContent);
}

function downloadResult(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    // Simular download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `resultado_${exam.title.replace(/\s+/g, '_')}_${exam.patientName.replace(/\s+/g, '_')}.pdf`;
    
    showNotification('✅ Download iniciado!', 'success');
    console.log(`Downloading: ${link.download}`);
}

function sendToPatient(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    if (confirm(`Enviar resultado do exame "${exam.title}" por email para ${exam.patientName}?`)) {
        showNotification('📧 Resultado enviado com sucesso!', 'success');
        
        // Atualizar status se necessário
        if (exam.status === 'resultado_pronto') {
            exam.status = 'entregue';
            renderFilteredExams(examsData.exams);
        }
    }
}

function printResult(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    showNotification('🖨️ Preparando impressão...', 'info');
    
    // Simular impressão
    setTimeout(() => {
        window.print();
    }, 1000);
}

function rescheduleExam(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    const newDate = prompt('Nova data (AAAA-MM-DD):', exam.date);
    const newTime = prompt('Novo horário (HH:MM):', exam.time);
    
    if (newDate && newTime) {
        exam.date = newDate;
        exam.time = newTime;
        
        showNotification(`📅 Exame reagendado para ${formatDateTime(newDate, newTime)}`, 'success');
        renderFilteredExams(examsData.exams);
        updateStats();
    }
}

function cancelExam(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    const reason = prompt('Motivo do cancelamento:');
    if (reason) {
        exam.status = 'cancelado';
        exam.observations = `Cancelado: ${reason}`;
        
        showNotification('❌ Exame cancelado com sucesso!', 'warning');
        renderFilteredExams(examsData.exams);
        updateStats();
    }
}

function followUpExam(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    showNotification('📞 Acompanhamento registrado. Laboratório será contatado.', 'info');
    
    // Simular follow-up
    setTimeout(() => {
        if (confirm('Resultado disponível. Registrar agora?')) {
            exam.hasResult = true;
            exam.status = 'resultado_pronto';
            exam.result = 'Resultado disponível para análise';
            
            renderFilteredExams(examsData.exams);
            updateStats();
        }
    }, 3000);
}

function requestUrgent(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    if (confirm('Marcar como urgente? Isso priorizará o processamento do resultado.')) {
        exam.observations = 'URGENTE - ' + exam.observations;
        showNotification('⚡ Prioridade alterada para urgente!', 'warning');
        
        renderFilteredExams(examsData.exams);
    }
}

function scheduleFollowUp(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    if (confirm(`Agendar consulta de retorno para ${exam.patientName}?`)) {
        showNotification('📅 Redirecionando para agendamento...', 'info');
        
        setTimeout(() => {
            window.location.href = `appointments.html?action=new&patient=${exam.patientId}`;
        }, 1500);
    }
}

function addToHistory(id) {
    const exam = examsData.exams.find(e => e.id === id);
    if (!exam) return;
    
    exam.status = 'entregue';
    showNotification('📋 Resultado adicionado ao histórico do paciente!', 'success');
    
    renderFilteredExams(examsData.exams);
    updateStats();
}

function viewPatient(id) {
    showNotification('👤 Redirecionando para dados do paciente...', 'info');
    setTimeout(() => {
        window.location.href = `patient-details.html?id=${id}`;
    }, 1000);
}

// Funções dos modals
function openRequestExamModal() {
    document.getElementById('requestExamModal').style.display = 'block';
    document.getElementById('examDate').value = new Date().toISOString().split('T')[0];
    
    // Popular lista de pacientes
    const patientSelect = document.getElementById('examPatient');
    patientSelect.innerHTML = '<option value="">Selecione um paciente...</option>';
    
    examsData.patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        patientSelect.appendChild(option);
    });
}

function closeRequestExamModal() {
    document.getElementById('requestExamModal').style.display = 'none';
    document.getElementById('requestExamForm').reset();
}

function openResultModal() {
    document.getElementById('resultModal').style.display = 'block';
    
    // Popular lista de exames para resultado
    const examSelect = document.getElementById('resultExam');
    examSelect.innerHTML = '<option value="">Selecione um exame...</option>';
    
    const examsNeedingResult = examsData.exams.filter(exam => 
        exam.status === 'realizado' && !exam.hasResult
    );
    
    examsNeedingResult.forEach(exam => {
        const option = document.createElement('option');
        option.value = exam.id;
        option.textContent = `${exam.title} - ${exam.patientName}`;
        examSelect.appendChild(option);
    });
}

function closeResultModal() {
    document.getElementById('resultModal').style.display = 'none';
    document.getElementById('resultForm').reset();
}

// Funções utilitárias
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    const colors = {
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showModal(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #2c3e50;">${title}</h2>
                <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal clicando fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Filtros
    document.getElementById('filterDate').addEventListener('change', filterExams);
    document.getElementById('filterStatus').addEventListener('change', filterExams);
    document.getElementById('filterType').addEventListener('change', filterExams);
    
    // Mudança dinâmica de tipos de exame
    document.getElementById('examType').addEventListener('change', function() {
        const examName = document.getElementById('examName');
        examName.innerHTML = '<option value="">Selecione...</option>';
        
        if (examTypes[this.value]) {
            examTypes[this.value].forEach(exam => {
                const option = document.createElement('option');
                option.value = exam.toLowerCase().replace(/\s+/g, '_');
                option.textContent = exam;
                examName.appendChild(option);
            });
        }
    });
    
    // Formulário de solicitação de exame
    document.getElementById('requestExamForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            patientId: document.getElementById('examPatient').value,
            type: document.getElementById('examType').value,
            name: document.getElementById('examName').value,
            indication: document.getElementById('examIndication').value,
            urgency: document.getElementById('examUrgency').value,
            date: document.getElementById('examDate').value,
            preparation: document.getElementById('examPreparation').value,
            observations: document.getElementById('examObservations').value
        };
        
        if (!formData.patientId || !formData.type || !formData.name || !formData.indication) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Encontrar dados do paciente
        const patient = examsData.patients.find(p => p.id == formData.patientId);
        
        // Criar novo exame
        const newExam = {
            id: Math.max(...examsData.exams.map(e => e.id)) + 1,
            patientId: parseInt(formData.patientId),
            patientName: patient.name,
            patientCode: patient.code,
            title: document.getElementById('examName').selectedOptions[0].text,
            type: formData.type,
            date: formData.date,
            time: '08:00',
            status: 'solicitado',
            location: 'A definir',
            indication: formData.indication,
            observations: formData.preparation || formData.observations || 'Sem observações',
            hasResult: false
        };
        
        examsData.exams.push(newExam);
        
        showNotification('✅ Exame solicitado com sucesso!', 'success');
        closeRequestExamModal();
        renderFilteredExams(examsData.exams);
        updateStats();
    });
    
    // Formulário de resultado
    document.getElementById('resultForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const examId = document.getElementById('resultExam').value;
        const description = document.getElementById('resultDescription').value;
        const status = document.getElementById('resultStatus').value;
        
        if (!examId || !description || !status) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Encontrar e atualizar exame
        const exam = examsData.exams.find(e => e.id == examId);
        if (exam) {
            exam.hasResult = true;
            exam.status = 'resultado_pronto';
            exam.result = description;
            
            const statusMap = {
                'normal': 'Dentro da normalidade',
                'alterado': 'Alterado - requer acompanhamento',
                'inconclusivo': 'Inconclusivo - repetir exame'
            };
            
            exam.result += ` (${statusMap[status]})`;
        }
        
        showNotification('✅ Resultado registrado com sucesso!', 'success');
        closeResultModal();
        renderFilteredExams(examsData.exams);
        updateStats();
    });
    
    // Fechar modais com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeRequestExamModal();
            closeResultModal();
        }
    });
    
    // Inicializar sistema
    initializeSystem();
});

// Função de inicialização
function initializeSystem() {
    // Definir data de hoje no filtro
    document.getElementById('filterDate').value = new Date().toISOString().split('T')[0];
    
    // Renderizar lista inicial
    renderFilteredExams(examsData.exams);
    
    // Atualizar estatísticas
    updateStats();
    
    // Auto-refresh a cada 10 minutos
    setInterval(() => {
        console.log('Auto-refreshing exams data...');
        updateStats();
        
        // Simular atualizações de status
        simulateStatusUpdates();
    }, 10 * 60 * 1000);
    
    console.log('Sistema de exames inicializado com sucesso!');
}

// Simular atualizações automáticas de status
function simulateStatusUpdates() {
    const pendingExams = examsData.exams.filter(exam => 
        exam.status === 'agendado' && new Date(exam.date) < new Date()
    );
    
    pendingExams.forEach(exam => {
        if (Math.random() > 0.7) { // 30% chance de atualização
            exam.status = 'realizado';
            console.log(`Status atualizado: ${exam.title} - ${exam.patientName}`);
        }
    });
    
    const realizados = examsData.exams.filter(exam => 
        exam.status === 'realizado' && !exam.hasResult
    );
    
    realizados.forEach(exam => {
        if (Math.random() > 0.8) { // 20% chance de resultado ficar pronto
            exam.hasResult = true;
            exam.status = 'resultado_pronto';
            exam.result = 'Resultado processado automaticamente';
            console.log(`Resultado disponível: ${exam.title} - ${exam.patientName}`);
            
            showNotification(`📊 Novo resultado disponível: ${exam.title}`, 'success');
        }
    });
    
    renderFilteredExams(examsData.exams);
    updateStats();
}

// Funções adicionais para melhor experiência
function quickActions() {
    return {
        markAllAsRead: function() {
            const unreadResults = examsData.exams.filter(exam => 
                exam.status === 'resultado_pronto'
            );
            
            unreadResults.forEach(exam => {
                exam.status = 'entregue';
            });
            
            showNotification(`✅ ${unreadResults.length} resultados marcados como entregues`, 'success');
            renderFilteredExams(examsData.exams);
            updateStats();
        },
        
        exportData: function() {
            const data = JSON.stringify(examsData, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `exames_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            showNotification('📥 Dados exportados com sucesso!', 'success');
        },
        
        generateReport: function() {
            const today = new Date().toISOString().split('T')[0];
            const todayExams = examsData.exams.filter(exam => exam.date === today);
            const pendingResults = examsData.exams.filter(exam => 
                exam.status === 'realizado' && !exam.hasResult
            );
            
            const report = `
                RELATÓRIO DE EXAMES - ${formatDate(today)}
                ========================================
                
                RESUMO:
                - Total de exames hoje: ${todayExams.length}
                - Resultados pendentes: ${pendingResults.length}
                - Taxa de conclusão: ${((todayExams.length - pendingResults.length) / Math.max(todayExams.length, 1) * 100).toFixed(1)}%
                
                EXAMES DE HOJE:
                ${todayExams.map(exam => 
                    `- ${exam.title} | ${exam.patientName} | Status: ${exam.status}`
                ).join('\n')}
                
                RESULTADOS PENDENTES:
                ${pendingResults.map(exam => 
                    `- ${exam.title} | ${exam.patientName} | Data: ${formatDate(exam.date)}`
                ).join('\n')}
            `;
            
            showModal('📋 Relatório Diário', `<pre style="white-space: pre-line; font-family: monospace;">${report}</pre>`);
        }
    };
}

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Shift + N = Novo exame
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        openRequestExamModal();
    }
    
    // Ctrl/Cmd + Shift + R = Registrar resultado
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        openResultModal();
    }
    
    // Ctrl/Cmd + Shift + F = Foco no filtro de data
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        document.getElementById('filterDate').focus();
    }
    
    // F5 = Atualizar dados
    if (e.key === 'F5') {
        e.preventDefault();
        updateStats();
        renderFilteredExams(examsData.exams);
        showNotification('🔄 Dados atualizados!', 'info');
    }
});

// Adicionar botões de ação rápida
function addQuickActionButtons() {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) return;
    
    const quickActionsDiv = document.createElement('div');
    quickActionsDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 999;
    `;
    
    quickActionsDiv.innerHTML = `
        <button onclick="quickActions().generateReport()" 
                style="padding: 10px; border: none; border-radius: 50px; background: #007bff; color: white; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"
                title="Gerar Relatório (Ctrl+Shift+G)">
            📋
        </button>
        <button onclick="quickActions().exportData()" 
                style="padding: 10px; border: none; border-radius: 50px; background: #28a745; color: white; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"
                title="Exportar Dados">
            📥
        </button>
        <button onclick="quickActions().markAllAsRead()" 
                style="padding: 10px; border: none; border-radius: 50px; background: #ffc107; color: white; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"
                title="Marcar Todos como Lidos">
            ✅
        </button>
    `;
    
    document.body.appendChild(quickActionsDiv);
}

// Busca avançada
function setupAdvancedSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar por paciente, exame ou observações...';
    searchInput.style.cssText = `
        width: 300px;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-right: 10px;
    `;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            renderFilteredExams(examsData.exams);
            return;
        }
        
        const filteredExams = examsData.exams.filter(exam => 
            exam.patientName.toLowerCase().includes(searchTerm) ||
            exam.title.toLowerCase().includes(searchTerm) ||
            exam.indication.toLowerCase().includes(searchTerm) ||
            exam.observations.toLowerCase().includes(searchTerm) ||
            (exam.result && exam.result.toLowerCase().includes(searchTerm))
        );
        
        renderFilteredExams(filteredExams);
        updateStats(filteredExams);
    });
    
    // Adicionar campo de busca ao lado dos filtros
    const filtersContainer = document.querySelector('.content-area > div[style*="display: flex"]');
    if (filtersContainer) {
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = 'display: flex; align-items: center; margin-right: 15px;';
        searchContainer.innerHTML = `
            <span style="margin-right: 8px;">🔍</span>
        `;
        searchContainer.appendChild(searchInput);
        
        filtersContainer.insertBefore(searchContainer, filtersContainer.lastElementChild);
    }
}

// Adicionar animações CSS
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .exam-card {
            animation: fadeIn 0.3s ease-out;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .exam-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .btn-small {
            transition: all 0.2s ease;
        }
        
        .btn-small:hover {
            transform: scale(1.05);
        }
        
        .notification {
            animation: slideIn 0.3s ease-out;
        }
        
        .no-results {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-style: italic;
        }
    `;
    
    document.head.appendChild(style);
}

// Função de limpeza ao sair da página
window.addEventListener('beforeunload', function() {
    // Salvar dados no localStorage para persistência (se necessário)
    // localStorage.setItem('examsData', JSON.stringify(examsData));
    console.log('Sistema de exames finalizado');
});

// Executar configurações adicionais após o DOM estar carregado
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addQuickActionButtons();
        setupAdvancedSearch();
        addAnimations();
    }, 100);
});

// Exposar funções globalmente para uso nos botões HTML
window.filterExams = filterExams;
window.viewResult = viewResult;
window.downloadResult = downloadResult;
window.sendToPatient = sendToPatient;
window.printResult = printResult;
window.rescheduleExam = rescheduleExam;
window.cancelExam = cancelExam;
window.followUpExam = followUpExam;
window.requestUrgent = requestUrgent;
window.scheduleFollowUp = scheduleFollowUp;
window.addToHistory = addToHistory;
window.viewPatient = viewPatient;
window.openRequestExamModal = openRequestExamModal;
window.closeRequestExamModal = closeRequestExamModal;
window.openResultModal = openResultModal;
window.closeResultModal = closeResultModal;
window.quickActions = quickActions;