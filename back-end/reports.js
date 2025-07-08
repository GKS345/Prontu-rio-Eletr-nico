// Sistema de Relatórios - MediSystem
// Dados simulados para demonstração
const mockData = {
    patients: [
        { id: 1, name: 'Maria Silva', age: 35, lastVisit: '2025-06-28', status: 'active' },
        { id: 2, name: 'João Santos', age: 42, lastVisit: '2025-06-27', status: 'active' },
        { id: 3, name: 'Ana Costa', age: 28, lastVisit: '2025-06-26', status: 'completed' },
        { id: 4, name: 'Pedro Lima', age: 55, lastVisit: '2025-06-25', status: 'pending' }
    ],
    appointments: [
        { id: 1, patient: 'Maria Silva', date: '2025-06-28', time: '09:00', status: 'completed', value: 150 },
        { id: 2, patient: 'João Santos', date: '2025-06-28', time: '10:30', status: 'completed', value: 200 },
        { id: 3, patient: 'Ana Costa', date: '2025-06-27', time: '14:00', status: 'completed', value: 180 },
        { id: 4, patient: 'Pedro Lima', date: '2025-06-29', time: '11:00', status: 'pending', value: 150 }
    ],
    prescriptions: [
        { id: 1, patient: 'Maria Silva', medication: 'Dipirona', date: '2025-06-28', status: 'active' },
        { id: 2, patient: 'João Santos', medication: 'Ibuprofeno', date: '2025-06-27', status: 'completed' },
        { id: 3, patient: 'Ana Costa', medication: 'Paracetamol', date: '2025-06-26', status: 'active' }
    ],
    exams: [
        { id: 1, patient: 'Maria Silva', exam: 'Hemograma', date: '2025-06-25', status: 'completed' },
        { id: 2, patient: 'João Santos', exam: 'Raio-X', date: '2025-06-24', status: 'completed' },
        { id: 3, patient: 'Pedro Lima', exam: 'Ultrassom', date: '2025-06-30', status: 'pending' }
    ]
};

// Configurações de filtros específicos por tipo de relatório
const specificFilters = {
    patients: [
        { value: 'age_group', text: 'Faixa Etária' },
        { value: 'gender', text: 'Gênero' },
        { value: 'insurance', text: 'Plano de Saúde' }
    ],
    appointments: [
        { value: 'doctor', text: 'Médico' },
        { value: 'specialty', text: 'Especialidade' },
        { value: 'appointment_type', text: 'Tipo de Consulta' }
    ],
    prescriptions: [
        { value: 'medication_type', text: 'Tipo de Medicamento' },
        { value: 'dosage', text: 'Dosagem' },
        { value: 'frequency', text: 'Frequência' }
    ],
    exams: [
        { value: 'exam_type', text: 'Tipo de Exame' },
        { value: 'laboratory', text: 'Laboratório' },
        { value: 'urgency', text: 'Urgência' }
    ],
    financial: [
        { value: 'payment_method', text: 'Forma de Pagamento' },
        { value: 'insurance_type', text: 'Tipo de Plano' },
        { value: 'revenue_source', text: 'Fonte de Receita' }
    ],
    statistics: [
        { value: 'time_period', text: 'Período' },
        { value: 'chart_type', text: 'Tipo de Gráfico' },
        { value: 'metrics', text: 'Métricas' }
    ]
};

// Templates de relatório
const reportTemplates = {
    statistics: {
        title: 'Relatório Estatístico',
        sections: ['Visão Geral', 'Atendimentos por Período', 'Especialidades Mais Procuradas', 'Gráficos e Análises']
    },
    financial: {
        title: 'Relatório Financeiro',
        sections: ['Receita Total', 'Despesas', 'Lucro Líquido', 'Formas de Pagamento', 'Inadimplência']
    },
    patients: {
        title: 'Relatório de Pacientes',
        sections: ['Novos Cadastros', 'Pacientes Ativos', 'Histórico de Consultas', 'Dados Demográficos']
    },
    medications: {
        title: 'Relatório de Medicamentos',
        sections: ['Receitas Emitidas', 'Medicamentos Mais Prescritos', 'Interações Medicamentosas', 'Controle de Estoque']
    }
};

// Função para atualizar opções de filtro específico
function updateReportOptions() {
    const reportType = document.getElementById('reportType').value;
    const additionalFilters = document.getElementById('additionalFilters');
    const specificFilter = document.getElementById('specificFilter');

    if (reportType && specificFilters[reportType]) {
        additionalFilters.style.display = 'block';
        specificFilter.innerHTML = '<option value="">Selecione um filtro</option>';

        specificFilters[reportType].forEach(filter => {
            const option = document.createElement('option');
            option.value = filter.value;
            option.textContent = filter.text;
            specificFilter.appendChild(option);
        });
    } else {
        additionalFilters.style.display = 'none';
    }
}

// Função para limpar filtros
function clearFilters() {
    document.getElementById('reportFilters').reset();
    document.getElementById('additionalFilters').style.display = 'none';
    document.getElementById('reportResults').style.display = 'none';
}

// Função para gerar relatório
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const status = document.getElementById('status').value;
    const specificFilter = document.getElementById('specificFilter').value;

    if (!reportType) {
        alert('Por favor, selecione um tipo de relatório.');
        return;
    }

    // Simular carregamento
    const reportResults = document.getElementById('reportResults');
    const reportTitle = document.getElementById('reportTitle');
    const reportContent = document.getElementById('reportContent');

    reportTitle.textContent = `${reportTemplates[reportType]?.title || 'Relatório'} - ${formatDateRange(dateFrom, dateTo)}`;

    // Gerar conteúdo do relatório baseado no tipo
    let content = generateReportContent(reportType, { dateFrom, dateTo, status, specificFilter });

    reportContent.innerHTML = content;
    reportResults.style.display = 'block';

    // Scroll para o resultado
    reportResults.scrollIntoView({ behavior: 'smooth' });
}

// Função para gerar conteúdo do relatório
function generateReportContent(type, filters) {
    let content = '<div class="report-summary">';

    switch (type) {
        case 'patients':
            content += generatePatientsReport(filters);
            break;
        case 'appointments':
            content += generateAppointmentsReport(filters);
            break;
        case 'prescriptions':
            content += generatePrescriptionsReport(filters);
            break;
        case 'exams':
            content += generateExamsReport(filters);
            break;
        case 'financial':
            content += generateFinancialReport(filters);
            break;
        case 'statistics':
            content += generateStatisticsReport(filters);
            break;
        default:
            content += '<p>Tipo de relatório não reconhecido.</p>';
    }

    content += '</div>';
    return content;
}

// Relatório de Pacientes
function generatePatientsReport(filters) {
    const filteredPatients = mockData.patients.filter(patient => {
        if (filters.status && patient.status !== filters.status) return false;
        return true;
    });

    return `
        <h3>📊 Resumo de Pacientes</h3>
        <div class="stats-grid" style="margin: 20px 0;">
            <div class="stat-item">
                <strong>Total de Pacientes:</strong> ${filteredPatients.length}
            </div>
            <div class="stat-item">
                <strong>Pacientes Ativos:</strong> ${filteredPatients.filter(p => p.status === 'active').length}
            </div>
            <div class="stat-item">
                <strong>Idade Média:</strong> ${Math.round(filteredPatients.reduce((sum, p) => sum + p.age, 0) / filteredPatients.length)} anos
            </div>
        </div>
        
        <h4>📋 Lista de Pacientes</h4>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Última Consulta</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${filteredPatients.map(patient => `
                    <tr>
                        <td>${patient.name}</td>
                        <td>${patient.age} anos</td>
                        <td>${formatDate(patient.lastVisit)}</td>
                        <td><span class="status-badge status-${patient.status}">${getStatusText(patient.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Relatório de Consultas
function generateAppointmentsReport(filters) {
    const filteredAppointments = mockData.appointments.filter(appointment => {
        if (filters.status && appointment.status !== filters.status) return false;
        if (filters.dateFrom && appointment.date < filters.dateFrom) return false;
        if (filters.dateTo && appointment.date > filters.dateTo) return false;
        return true;
    });

    const totalValue = filteredAppointments.reduce((sum, apt) => sum + apt.value, 0);

    return `
        <h3>📅 Resumo de Consultas</h3>
        <div class="stats-grid" style="margin: 20px 0;">
            <div class="stat-item">
                <strong>Total de Consultas:</strong> ${filteredAppointments.length}
            </div>
            <div class="stat-item">
                <strong>Consultas Concluídas:</strong> ${filteredAppointments.filter(a => a.status === 'completed').length}
            </div>
            <div class="stat-item">
                <strong>Valor Total:</strong> R$ ${totalValue.toFixed(2)}
            </div>
        </div>
        
        <h4>📋 Lista de Consultas</h4>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Paciente</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Valor</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${filteredAppointments.map(appointment => `
                    <tr>
                        <td>${appointment.patient}</td>
                        <td>${formatDate(appointment.date)}</td>
                        <td>${appointment.time}</td>
                        <td>R$ ${appointment.value.toFixed(2)}</td>
                        <td><span class="status-badge status-${appointment.status}">${getStatusText(appointment.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Relatório de Receitas
function generatePrescriptionsReport(filters) {
    const filteredPrescriptions = mockData.prescriptions.filter(prescription => {
        if (filters.status && prescription.status !== filters.status) return false;
        return true;
    });

    return `
        <h3>💊 Resumo de Receitas</h3>
        <div class="stats-grid" style="margin: 20px 0;">
            <div class="stat-item">
                <strong>Total de Receitas:</strong> ${filteredPrescriptions.length}
            </div>
            <div class="stat-item">
                <strong>Receitas Ativas:</strong> ${filteredPrescriptions.filter(p => p.status === 'active').length}
            </div>
            <div class="stat-item">
                <strong>Medicamentos Únicos:</strong> ${new Set(filteredPrescriptions.map(p => p.medication)).size}
            </div>
        </div>
        
        <h4>📋 Lista de Receitas</h4>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Paciente</th>
                    <th>Medicamento</th>
                    <th>Data</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${filteredPrescriptions.map(prescription => `
                    <tr>
                        <td>${prescription.patient}</td>
                        <td>${prescription.medication}</td>
                        <td>${formatDate(prescription.date)}</td>
                        <td><span class="status-badge status-${prescription.status}">${getStatusText(prescription.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Relatório de Exames
function generateExamsReport(filters) {
    const filteredExams = mockData.exams.filter(exam => {
        if (filters.status && exam.status !== filters.status) return false;
        return true;
    });

    return `
        <h3>🔬 Resumo de Exames</h3>
        <div class="stats-grid" style="margin: 20px 0;">
            <div class="stat-item">
                <strong>Total de Exames:</strong> ${filteredExams.length}
            </div>
            <div class="stat-item">
                <strong>Exames Concluídos:</strong> ${filteredExams.filter(e => e.status === 'completed').length}
            </div>
            <div class="stat-item">
                <strong>Exames Pendentes:</strong> ${filteredExams.filter(e => e.status === 'pending').length}
            </div>
        </div>
        
        <h4>📋 Lista de Exames</h4>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Paciente</th>
                    <th>Exame</th>
                    <th>Data</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${filteredExams.map(exam => `
                    <tr>
                        <td>${exam.patient}</td>
                        <td>${exam.exam}</td>
                        <td>${formatDate(exam.date)}</td>
                        <td><span class="status-badge status-${exam.status}">${getStatusText(exam.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Relatório Financeiro
function generateFinancialReport(filters) {
    const revenue = mockData.appointments.reduce((sum, apt) => sum + apt.value, 0);
    const expenses = revenue * 0.3; // Simulando despesas como 30% da receita
    const profit = revenue - expenses;

    return `
        <h3>💰 Resumo Financeiro</h3>
        <div class="stats-grid" style="margin: 20px 0;">
            <div class="stat-item">
                <strong>Receita Total:</strong> R$ ${revenue.toFixed(2)}
            </div>
            <div class="stat-item">
                <strong>Despesas:</strong> R$ ${expenses.toFixed(2)}
            </div>
            <div class="stat-item">
                <strong>Lucro Líquido:</strong> R$ ${profit.toFixed(2)}
            </div>
            <div class="stat-item">
                <strong>Margem de Lucro:</strong> ${((profit / revenue) * 100).toFixed(1)}%
            </div>
        </div>
        
        <h4>📊 Análise por Período</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Receita Diária Média:</strong> R$ ${(revenue / 30).toFixed(2)}</p>
            <p><strong>Consultas por Dia:</strong> ${(mockData.appointments.length / 30).toFixed(1)}</p>
            <p><strong>Ticket Médio:</strong> R$ ${(revenue / mockData.appointments.length).toFixed(2)}</p>
        </div>
    `;
}

// Relatório Estatístico
function generateStatisticsReport(filters) {
    const totalPatients = mockData.patients.length;
    const totalAppointments = mockData.appointments.length;
    const totalPrescriptions = mockData.prescriptions.length;
    const totalExams = mockData.exams.length;

    return `
        <h3>📊 Estatísticas Gerais</h3>
        <div class="stats-grid" style="margin: 20px 0;">
            <div class="stat-item">
                <strong>Total de Pacientes:</strong> ${totalPatients}
            </div>
            <div class="stat-item">
                <strong>Total de Consultas:</strong> ${totalAppointments}
            </div>
            <div class="stat-item">
                <strong>Total de Receitas:</strong> ${totalPrescriptions}
            </div>
            <div class="stat-item">
                <strong>Total de Exames:</strong> ${totalExams}
            </div>
        </div>
        
        <h4>📈 Análise de Tendências</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Taxa de Ocupação:</strong> 85%</p>
            <p><strong>Satisfação do Cliente:</strong> 4.8/5.0</p>
            <p><strong>Tempo Médio de Consulta:</strong> 35 minutos</p>
            <p><strong>Taxa de Retorno:</strong> 78%</p>
        </div>
        
        <h4>🏆 Indicadores de Performance</h4>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Indicador</th>
                    <th>Valor Atual</th>
                    <th>Meta</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Consultas/Dia</td>
                    <td>28</td>
                    <td>25</td>
                    <td><span class="status-badge status-active">✅ Atingida</span></td>
                </tr>
                <tr>
                    <td>Receita Mensal</td>
                    <td>R$ 28.450</td>
                    <td>R$ 25.000</td>
                    <td><span class="status-badge status-active">✅ Atingida</span></td>
                </tr>
                <tr>
                    <td>Satisfação</td>
                    <td>4.8</td>
                    <td>4.5</td>
                    <td><span class="status-badge status-active">✅ Atingida</span></td>
                </tr>
            </tbody>
        </table>
    `;
}

// Função para gerar relatórios rápidos
function generateQuickReport(type) {
    const reportResults = document.getElementById('reportResults');
    const reportTitle = document.getElementById('reportTitle');
    const reportContent = document.getElementById('reportContent');

    let title, content;

    switch (type) {
        case 'today':
            title = 'Relatório de Atendimentos - Hoje';
            content = `
                <h3>📅 Atendimentos de Hoje (${formatDate(new Date().toISOString().split('T')[0])})</h3>
                <div class="stats-grid" style="margin: 20px 0;">
                    <div class="stat-item"><strong>Total:</strong> 28 atendimentos</div>
                    <div class="stat-item"><strong>Concluídos:</strong> 25</div>
                    <div class="stat-item"><strong>Pendentes:</strong> 3</div>
                    <div class="stat-item"><strong>Receita:</strong> R$ 4.200,00</div>
                </div>
                <p>📊 <strong>Horário de Pico:</strong> 14:00 - 16:00 (8 atendimentos)</p>
                <p>⏱️ <strong>Tempo Médio por Consulta:</strong> 32 minutos</p>
            `;
            break;
        case 'week':
            title = 'Relatório Semanal';
            content = `
                <h3>📊 Resumo da Semana</h3>
                <div class="stats-grid" style="margin: 20px 0;">
                    <div class="stat-item"><strong>Total:</strong> 156 atendimentos</div>
                    <div class="stat-item"><strong>Novos Pacientes:</strong> 12</div>
                    <div class="stat-item"><strong>Receitas Emitidas:</strong> 89</div>
                    <div class="stat-item"><strong>Exames Solicitados:</strong> 34</div>
                </div>
                <p>📈 <strong>Crescimento:</strong> +8% em relação à semana anterior</p>
                <p>👥 <strong>Especialidade Mais Procurada:</strong> Clínica Geral (45%)</p>
            `;
            break;
        case 'month':
            title = 'Relatório Mensal';
            content = `
                <h3>📈 Resumo do Mês</h3>
                <div class="stats-grid" style="margin: 20px 0;">
                    <div class="stat-item"><strong>Total:</strong> 642 atendimentos</div>
                    <div class="stat-item"><strong>Pacientes Únicos:</strong> 387</div>
                    <div class="stat-item"><strong>Taxa de Retorno:</strong> 78%</div>
                    <div class="stat-item"><strong>Satisfação:</strong> 4.8/5.0</div>
                </div>
                <p>💰 <strong>Receita Mensal:</strong> R$ 96.300,00</p>
                <p>🎯 <strong>Meta Atingida:</strong> 105% da meta mensal</p>
            `;
            break;
        case 'revenue':
            title = 'Relatório de Receita';
            content = `
                <h3>💰 Análise de Receita Mensal</h3>
                <div class="stats-grid" style="margin: 20px 0;">
                    <div class="stat-item"><strong>Receita Bruta:</strong> R$ 28.450,00</div>
                    <div class="stat-item"><strong>Despesas:</strong> R$ 8.535,00</div>
                    <div class="stat-item"><strong>Lucro Líquido:</strong> R$ 19.915,00</div>
                    <div class="stat-item"><strong>Margem:</strong> 70%</div>
                </div>
                <p>💳 <strong>Principais Formas de Pagamento:</strong></p>
                <ul>
                    <li>Cartão de Débito: 35%</li>
                    <li>Cartão de Crédito: 28%</li>
                    <li>PIX: 25%</li>
                    <li>Dinheiro: 12%</li>
                </ul>
            `;
            break;
    }

    reportTitle.textContent = title;
    reportContent.innerHTML = content;
    reportResults.style.display = 'block';
    reportResults.scrollIntoView({ behavior: 'smooth' });
}

// Funções de exportação
function exportReport(format) {
    const reportTitle = document.getElementById('reportTitle').textContent;

    switch (format) {
        case 'pdf':
            alert(`Exportando "${reportTitle}" para PDF...`);
            // Aqui seria implementada a lógica real de exportação para PDF
            break;
        case 'excel':
            alert(`Exportando "${reportTitle}" para Excel...`);
            // Aqui seria implementada a lógica real de exportação para Excel
            break;
        case 'csv':
            alert(`Exportando "${reportTitle}" para CSV...`);
            // Aqui seria implementada a lógica real de exportação para CSV
            break;
    }
}

function printReport() {
    const reportContent = document.getElementById('reportContent').innerHTML;
    const reportTitle = document.getElementById('reportTitle').textContent;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${reportTitle}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .stats-grid { display: flex; gap: 20px; margin: 20px 0; }
                    .stat-item { background: #f8f9fa; padding: 10px; border-radius: 5px; flex: 1; }
                    .report-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .report-table th, .report-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .report-table th { background-color: #f2f2f2; }
                    .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
                    .status-active { background-color: #d4edda; color: #155724; }
                    .status-completed { background-color: #d1ecf1; color: #0c5460; }
                    .status-pending { background-color: #fff3cd; color: #856404; }
                </style>
            </head>
            <body>
                <h1>${reportTitle}</h1>
                <p><strong>Data de Geração:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <hr>
                ${reportContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Funções para relatórios salvos
function viewSavedReport(id) {
    alert(`Visualizando relatório salvo ID: ${id}`);
    // Aqui seria implementada a lógica para carregar e exibir o relatório salvo
}

function downloadReport(id) {
    alert(`Baixando relatório ID: ${id}...`);
    // Aqui seria implementada a lógica para download do relatório
}

function shareReport(id) {
    const shareUrl = `${window.location.origin}/shared-report/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert(`Link do relatório copiado para a área de transferência:\n${shareUrl}`);
    }).catch(() => {
        alert(`Link para compartilhamento:\n${shareUrl}`);
    });
}

function deleteSavedReport(id) {
    if (confirm('Tem certeza que deseja excluir este relatório salvo?')) {
        alert(`Relatório ID: ${id} excluído com sucesso!`);
        // Aqui seria implementada a lógica para excluir o relatório
        location.reload(); // Simula a atualização da página
    }
}

// Funções para templates
function useTemplate(type) {
    document.getElementById('reportType').value = type;
    updateReportOptions();
    alert(`Template "${reportTemplates[type].title}" carregado! Configure os filtros e gere o relatório.`);
    document.getElementById('reportType').scrollIntoView({ behavior: 'smooth' });
}

function previewTemplate(type) {
    const template = reportTemplates[type];
    alert(`Prévia do Template: ${template.title}\n\nSeções incluídas:\n${template.sections.map(s => `• ${s}`).join('\n')}`);
}

// Funções para agendamento
function showScheduleForm() {
    document.getElementById('scheduleForm').style.display = 'block';
    document.getElementById('scheduleForm').scrollIntoView({ behavior: 'smooth' });
}

function hideScheduleForm() {
    document.getElementById('scheduleForm').style.display = 'none';
}

function editScheduledReport(id) {
    alert(`Editando relatório agendado ID: ${id}`);
    showScheduleForm();
    // Aqui seria implementada a lógica para carregar os dados do relatório agendado
}

function deleteScheduledReport(id) {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        alert(`Agendamento ID: ${id} excluído com sucesso!`);
        // Aqui seria implementada a lógica para excluir o agendamento
        location.reload(); // Simula a atualização da página
    }
}

// Funções auxiliares
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatDateRange(dateFrom, dateTo) {
    if (dateFrom && dateTo) {
        return `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;
    } else if (dateFrom) {
        return `A partir de ${formatDate(dateFrom)}`;
    } else if (dateTo) {
        return `Até ${formatDate(dateTo)}`;
    } else {
        return 'Todos os períodos';
    }
}

function getStatusText(status) {
    const statusMap = {
        'active': 'Ativo',
        'completed': 'Concluído',
        'pending': 'Pendente',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Configurar datas padrão (último mês)
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    document.getElementById('dateFrom').value = lastMonth.toISOString().split('T')[0];
    document.getElementById('dateTo').value = today.toISOString().split('T')[0];

    // Event listener para o formulário de agendamento
    const scheduleForm = document.querySelector('#scheduleForm form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const reportType = document.getElementById('scheduleReportType').value;
            const frequency = document.getElementById('frequency').value;
            const time = document.getElementById('scheduleTime').value;
            const recipients = document.getElementById('recipients').value;

            if (!reportType || !frequency || !time || !recipients) {
                alert('Preencha todos os campos obrigatórios.');
                return;
            }

            alert('Relatório agendado com sucesso!');
            hideScheduleForm();
            location.reload(); // Simula a atualização da página
        });
    }

    // Adicionar estilos CSS dinamicamente para a tabela de relatórios
    const style = document.createElement('style');
    style.textContent = `
        .report-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .report-table th,
        .report-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        .report-table th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .report-table tr:hover {
            background-color: #f8f9fa;
        }
        
        .report-summary {
            background: white;
            padding: 20px;
            border-radius: 8px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        
        .btn-small {
            padding: 4px 8px;
            font-size: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 0 2px;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-primary { background: #3498db; color: white; }
        .btn-success { background: #27ae60; color: white; }
        .btn-warning { background: #f39c12; color: white; }
        .btn-danger { background: #e74c3c; color: white; }
        .btn-secondary { background: #95a5a6; color: white; }
        
        .btn-small:hover {
            opacity: 0.8;
        }
        
        @media print {
            .report-table { font-size: 12px; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
    `;
    document.head.appendChild(style);
});

// Função para simular carregamento
function showLoading(element) {
    element.innerHTML = '<div style="text-align: center; padding: 40px;">📊 Gerando relatório...</div>';
}

// Inicialização
console.log('Sistema de Relatórios MediSystem carregado com sucesso!');

// Funcionalidades Avançadas para o Sistema de Relatórios
// Este arquivo complementa o reports.js com recursos adicionais

// Classe para gerenciar relatórios avançados
class ReportManager {
    constructor() {
        this.reportHistory = [];
        this.savedReports = this.loadSavedReports();
        this.scheduledReports = this.loadScheduledReports();
    }

    // Carregar relatórios salvos do localStorage (simulado)
    loadSavedReports() {
        return [
            {
                id: '1',
                title: 'Relatório Mensal - Junho 2025',
                type: 'statistics',
                period: '01/06/2025 - 30/06/2025',
                generatedAt: '2025-06-28T14:30:00',
                pages: 12,
                size: '2.1 MB'
            },
            {
                id: '2',
                title: 'Relatório de Receitas - Semana 25',
                type: 'prescriptions',
                period: '17/06/2025 - 23/06/2025',
                generatedAt: '2025-06-24T09:15:00',
                pages: 8,
                size: '1.5 MB'
            },
            {
                id: '3',
                title: 'Relatório Financeiro - Q2 2025',
                type: 'financial',
                period: '01/04/2025 - 30/06/2025',
                generatedAt: '2025-06-20T16:45:00',
                pages: 15,
                size: '3.2 MB'
            }
        ];
    }

    // Carregar relatórios agendados
    loadScheduledReports() {
        return [
            {
                id: '1',
                title: 'Relatório Mensal',
                type: 'statistics',
                frequency: 'monthly',
                nextExecution: '2025-07-01T08:00:00',
                recipients: ['admin@medisystem.com'],
                status: 'active',
                lastRun: '2025-06-01T08:00:00'
            },
            {
                id: '2',
                title: 'Relatório Semanal',
                type: 'appointments',
                frequency: 'weekly',
                nextExecution: '2025-07-07T07:00:00',
                recipients: ['secretaria@medisystem.com'],
                status: 'active',
                lastRun: '2025-06-30T07:00:00'
            }
        ];
    }

    // Gerar relatório com validação avançada
    generateAdvancedReport(config) {
        try {
            // Validar configuração
            if (!this.validateReportConfig(config)) {
                throw new Error('Configuração de relatório inválida');
            }

            // Simular processamento
            const report = this.processReport(config);

            // Adicionar ao histórico
            this.addToHistory(report);

            return report;
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            throw error;
        }
    }

    // Validar configuração do relatório
    validateReportConfig(config) {
        const requiredFields = ['type', 'dateFrom', 'dateTo'];

        for (const field of requiredFields) {
            if (!config[field]) {
                alert(`Campo obrigatório: ${field}`);
                return false;
            }
        }

        // Validar datas
        const dateFrom = new Date(config.dateFrom);
        const dateTo = new Date(config.dateTo);

        if (dateFrom > dateTo) {
            alert('Data inicial não pode ser maior que a data final');
            return false;
        }

        // Validar período máximo (1 ano)
        const maxPeriod = 365 * 24 * 60 * 60 * 1000; // 1 ano em ms
        if (dateTo - dateFrom > maxPeriod) {
            alert('Período máximo permitido é de 1 ano');
            return false;
        }

        return true;
    }

    // Processar relatório
    processReport(config) {
        const report = {
            id: this.generateReportId(),
            title: this.generateReportTitle(config),
            type: config.type,
            config: config,
            generatedAt: new Date().toISOString(),
            status: 'completed',
            data: this.fetchReportData(config)
        };

        return report;
    }

    // Gerar ID único para o relatório
    generateReportId() {
        return 'RPT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Gerar título do relatório
    generateReportTitle(config) {
        const typeNames = {
            'patients': 'Pacientes',
            'appointments': 'Consultas',
            'prescriptions': 'Receitas',
            'exams': 'Exames',
            'financial': 'Financeiro',
            'statistics': 'Estatístico'
        };

        const typeName = typeNames[config.type] || 'Relatório';
        const dateRange = this.formatDateRange(config.dateFrom, config.dateTo);

        return `Relatório de ${typeName} - ${dateRange}`;
    }

    // Buscar dados do relatório
    fetchReportData(config) {
        // Simular busca de dados baseada na configuração
        const data = {
            summary: this.generateSummaryData(config),
            details: this.generateDetailData(config),
            charts: this.generateChartData(config)
        };

        return data;
    }

    // Gerar dados de resumo
    generateSummaryData(config) {
        const baseData = {
            totalRecords: Math.floor(Math.random() * 1000) + 100,
            avgValue: Math.floor(Math.random() * 500) + 100,
            growth: (Math.random() * 20 - 10).toFixed(1) + '%',
            satisfaction: (Math.random() * 0.5 + 4.5).toFixed(1)
        };

        return baseData;
    }

    // Gerar dados detalhados
    generateDetailData(config) {
        const records = [];
        const recordCount = Math.floor(Math.random() * 50) + 10;

        for (let i = 0; i < recordCount; i++) {
            records.push({
                id: i + 1,
                date: this.randomDateBetween(config.dateFrom, config.dateTo),
                value: Math.floor(Math.random() * 500) + 50,
                status: ['active', 'completed', 'pending'][Math.floor(Math.random() * 3)],
                category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
            });
        }

        return records;
    }

    // Gerar dados para gráficos
    generateChartData(config) {
        return {
            timeline: this.generateTimelineData(config),
            categories: this.generateCategoryData(),
            comparison: this.generateComparisonData()
        };
    }

    // Gerar dados de linha do tempo
    generateTimelineData(config) {
        const data = [];
        const startDate = new Date(config.dateFrom);
        const endDate = new Date(config.dateTo);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        for (let i = 0; i <= daysDiff; i += Math.ceil(daysDiff / 10)) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.floor(Math.random() * 100) + 20
            });
        }

        return data;
    }

    // Gerar dados por categoria
    generateCategoryData() {
        return [
            { category: 'Consultas', value: Math.floor(Math.random() * 300) + 100 },
            { category: 'Exames', value: Math.floor(Math.random() * 200) + 50 },
            { category: 'Receitas', value: Math.floor(Math.random() * 250) + 80 },
            { category: 'Retornos', value: Math.floor(Math.random() * 150) + 30 }
        ];
    }

    // Gerar dados de comparação
    generateComparisonData() {
        return {
            current: Math.floor(Math.random() * 1000) + 500,
            previous: Math.floor(Math.random() * 1000) + 400,
            target: Math.floor(Math.random() * 1000) + 600
        };
    }

    // Gerar data aleatória entre duas datas
    randomDateBetween(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
        return new Date(randomTime).toISOString().split('T')[0];
    }

    // Formatar intervalo de datas
    formatDateRange(dateFrom, dateTo) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const from = new Date(dateFrom).toLocaleDateString('pt-BR', options);
        const to = new Date(dateTo).toLocaleDateString('pt-BR', options);
        return `${from} - ${to}`;
    }

    // Adicionar relatório ao histórico
    addToHistory(report) {
        this.reportHistory.unshift(report);

        // Manter apenas os últimos 50 relatórios
        if (this.reportHistory.length > 50) {
            this.reportHistory = this.reportHistory.slice(0, 50);
        }
    }

    // Salvar relatório
    saveReport(report, name) {
        const savedReport = {
            id: this.generateReportId(),
            name: name || report.title,
            originalReport: report,
            savedAt: new Date().toISOString(),
            size: this.calculateReportSize(report)
        };

        this.savedReports.push(savedReport);
        return savedReport;
    }

    // Calcular tamanho estimado do relatório
    calculateReportSize(report) {
        const dataSize = JSON.stringify(report).length;
        const sizeInKB = Math.ceil(dataSize / 1024);

        if (sizeInKB < 1024) {
            return `${sizeInKB} KB`;
        } else {
            return `${(sizeInKB / 1024).toFixed(1)} MB`;
        }
    }

    // Exportar relatório para diferentes formatos
    exportReport(report, format) {
        switch (format.toLowerCase()) {
            case 'pdf':
                return this.exportToPDF(report);
            case 'excel':
                return this.exportToExcel(report);
            case 'csv':
                return this.exportToCSV(report);
            case 'json':
                return this.exportToJSON(report);
            default:
                throw new Error(`Formato não suportado: ${format}`);
        }
    }

    // Exportar para PDF (simulado)
    exportToPDF(report) {
        console.log('Exportando para PDF:', report.title);

        // Simular geração de PDF
        const pdfData = {
            title: report.title,
            content: this.generatePDFContent(report),
            metadata: {
                author: 'MediSystem',
                createdAt: new Date().toISOString(),
                pages: Math.ceil(JSON.stringify(report.data).length / 3000)
            }
        };

        // Simular download
        this.simulateDownload(`${report.title}.pdf`, 'application/pdf');

        return pdfData;
    }

    // Exportar para Excel (simulado)
    exportToExcel(report) {
        console.log('Exportando para Excel:', report.title);

        const excelData = {
            worksheets: [
                {
                    name: 'Resumo',
                    data: this.formatSummaryForExcel(report.data.summary)
                },
                {
                    name: 'Detalhes',
                    data: this.formatDetailsForExcel(report.data.details)
                }
            ]
        };

        this.simulateDownload(`${report.title}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return excelData;
    }

    // Exportar para CSV (simulado)
    exportToCSV(report) {
        console.log('Exportando para CSV:', report.title);

        const csvData = this.convertToCSV(report.data.details);
        this.simulateDownload(`${report.title}.csv`, 'text/csv');

        return csvData;
    }

    // Exportar para JSON
    exportToJSON(report) {
        console.log('Exportando para JSON:', report.title);

        const jsonData = JSON.stringify(report, null, 2);
        this.simulateDownload(`${report.title}.json`, 'application/json');

        return jsonData;
    }

    // Simular download de arquivo
    simulateDownload(filename, mimeType) {
        // Em uma implementação real, aqui seria criado um blob e iniciado o download
        setTimeout(() => {
            alert(`Download iniciado: ${filename}`);
        }, 500);
    }

    // Converter dados para CSV
    convertToCSV(data) {
        if (!data || !data.length) return '';

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row =>
            Object.values(row).map(value =>
                typeof value === 'string' ? `"${value}"` : value
            ).join(',')
        );

        return [headers, ...rows].join('\n');
    }

    // Formatar resumo para Excel
    formatSummaryForExcel(summary) {
        return Object.entries(summary).map(([key, value]) => ({
            Métrica: key,
            Valor: value
        }));
    }

    // Formatar detalhes para Excel
    formatDetailsForExcel(details) {
        return details.map(item => ({
            ID: item.id,
            Data: item.date,
            Valor: item.value,
            Status: item.status,
            Categoria: item.category
        }));
    }

    // Gerar conteúdo para PDF
    generatePDFContent(report) {
        return {
            header: {
                title: report.title,
                generatedAt: new Date(report.generatedAt).toLocaleString('pt-BR'),
                logo: 'MediSystem'
            },
            sections: [
                {
                    title: 'Resumo Executivo',
                    content: this.formatSummaryContent(report.data.summary)
                },
                {
                    title: 'Análise Detalhada',
                    content: this.formatDetailContent(report.data.details)
                },
                {
                    title: 'Gráficos e Tendências',
                    content: this.formatChartContent(report.data.charts)
                }
            ],
            footer: {
                pageNumbers: true,
                disclaimer: 'Relatório gerado automaticamente pelo MediSystem'
            }
        };
    }

    // Formatar conteúdo do resumo
    formatSummaryContent(summary) {
        return Object.entries(summary).map(([key, value]) =>
            `${key}: ${value}`
        ).join('\n');
    }

    // Formatar conteúdo detalhado
    formatDetailContent(details) {
        return details.map(item =>
            `${item.date} - ${item.category}: ${item.value} (${item.status})`
        ).join('\n');
    }

    // Formatar conteúdo dos gráficos
    formatChartContent(charts) {
        let content = 'Dados para gráficos:\n\n';

        if (charts.timeline) {
            content += 'Timeline:\n';
            content += charts.timeline.map(item => `${item.date}: ${item.value}`).join('\n');
            content += '\n\n';
        }

        if (charts.categories) {
            content += 'Categorias:\n';
            content += charts.categories.map(item => `${item.category}: ${item.value}`).join('\n');
            content += '\n\n';
        }

        return content;
    }
}

// Instanciar o gerenciador de relatórios
const reportManager = new ReportManager();

// Funções globais finais
window.generateAdvancedReport = function (config) {
    try {
        const report = reportManager.generateAdvancedReport(config);
        return report;
    } catch (error) {
        alert('Erro ao gerar relatório: ' + error.message);
        return null;
    }
};

window.exportAdvancedReport = function (report, format) {
    try {
        return reportManager.exportReport(report, format);
    } catch (error) {
        alert('Erro ao exportar relatório: ' + error.message);
        return null;
    }
};

window.saveAdvancedReport = function (report, name) {
    try {
        const savedReport = reportManager.saveReport(report, name);
        alert('Relatório salvo com sucesso!');
        return savedReport;
    } catch (error) {
        alert('Erro ao salvar relatório: ' + error.message);
        return null;
    }
};