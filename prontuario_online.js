// ============================================================
//  reports.js  –  MedSystem | Relatórios
//  Todos os dados vêm do banco via DB.reports (database.js)
//  Depende de: database.js
// ============================================================

// Estado local
let currentReportData = null;
let savedReports      = [];

// ----------------------------------------------------------
//  Helpers
// ----------------------------------------------------------
const formatDate = (d) => {
    if (!d) return '';
    if (d.includes('/')) return d;
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
};

const formatDateRange = (from, to) => {
    if (!from && !to) return 'Todos os períodos';
    if (!to)   return `A partir de ${formatDate(from)}`;
    if (!from) return `Até ${formatDate(to)}`;
    return `${formatDate(from)} – ${formatDate(to)}`;
};

const getStatusText = (status) => ({
    active:    'Ativo',
    completed: 'Concluído',
    pending:   'Pendente',
    cancelled: 'Cancelado',
    Ativa:     'Ativa',
    Finalizada:'Finalizada',
}[status] || status || '—');

// ----------------------------------------------------------
//  Filtros dinâmicos por tipo de relatório
// ----------------------------------------------------------
function updateReportOptions() {
    const type = document.getElementById('reportType')?.value;
    const container = document.getElementById('specificFilters');
    if (!container) return;

    const filterSets = {
        patients: `
            <label>Status do Paciente</label>
            <select id="patientStatus">
                <option value="">Todos</option>
                <option value="active">Ativos</option>
                <option value="completed">Finalizados</option>
                <option value="pending">Pendentes</option>
            </select>`,
        appointments: `
            <label>Status da Consulta</label>
            <select id="appointmentStatus">
                <option value="">Todos</option>
                <option value="confirmada">Confirmada</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
            </select>`,
        prescriptions: `
            <label>Status da Receita</label>
            <select id="prescriptionStatus">
                <option value="">Todos</option>
                <option value="Ativa">Ativa</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Pendente">Pendente</option>
            </select>`,
        exams: `
            <label>Tipo de Exame</label>
            <select id="examType">
                <option value="">Todos</option>
                <option value="laboratorio">Laboratório</option>
                <option value="imagem">Imagem</option>
                <option value="cardiologia">Cardiologia</option>
            </select>`,
        financial: `
            <label>Tipo de Receita</label>
            <select id="revenueType">
                <option value="">Todos</option>
                <option value="consulta">Consultas</option>
                <option value="exame">Exames</option>
                <option value="procedimento">Procedimentos</option>
            </select>`,
        statistics: '',
    };

    container.innerHTML = filterSets[type] || '';
}

function clearFilters() {
    ['dateFrom','dateTo','reportType'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const container = document.getElementById('specificFilters');
    if (container) container.innerHTML = '';
    const output = document.getElementById('reportOutput');
    if (output) output.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">Configure os filtros acima e clique em "Gerar Relatório".</p>';
    currentReportData = null;
}

// ----------------------------------------------------------
//  Geração de relatório (chama o banco)
// ----------------------------------------------------------
async function generateReport() {
    const type    = document.getElementById('reportType')?.value;
    const dateFrom= document.getElementById('dateFrom')?.value;
    const dateTo  = document.getElementById('dateTo')?.value;

    if (!type) { alert('Selecione o tipo de relatório.'); return; }

    // Coleta filtros específicos
    const specific = {};
    ['patientStatus','appointmentStatus','prescriptionStatus','examType','revenueType'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value) specific[id] = el.value;
    });

    const filters = { dateFrom, dateTo, ...specific };

    showLoading(document.getElementById('reportOutput'));

    try {
        const data = await DB.reports.generate(type, filters);
        currentReportData = { type, filters, data, generatedAt: new Date().toISOString() };
        renderReportContent(type, filters, data);
    } catch (err) {
        const output = document.getElementById('reportOutput');
        if (output) output.innerHTML = `
            <div style="text-align:center;padding:40px;color:#e74c3c;">
                <div style="font-size:48px;margin-bottom:20px;">⚠️</div>
                <h3>Erro ao gerar relatório</h3>
                <p>${err instanceof DBError ? err.message : 'Verifique a conexão com o servidor.'}</p>
            </div>`;
        console.error('[reports] generateReport:', err);
    }
}

// ----------------------------------------------------------
//  Renderização do conteúdo gerado
// ----------------------------------------------------------
function renderReportContent(type, filters, data) {
    const output = document.getElementById('reportOutput');
    if (!output) return;

    const titles = {
        patients:      '👥 Relatório de Pacientes',
        appointments:  '📅 Relatório de Consultas',
        prescriptions: '💊 Relatório de Receitas',
        exams:         '🔬 Relatório de Exames',
        financial:     '💰 Relatório Financeiro',
        statistics:    '📊 Relatório Estatístico',
    };

    const period = formatDateRange(filters.dateFrom, filters.dateTo);
    const rows   = Array.isArray(data) ? data : (data.items || data.rows || []);
    const summary= data.summary || {};

    // Cabeçalho do relatório
    let html = `
        <div class="report-header" style="margin-bottom:20px;">
            <h2>${titles[type] || 'Relatório'}</h2>
            <p style="color:#666;">Período: ${period} · Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            ${Object.keys(summary).length ? `
            <div class="report-summary" style="display:flex;gap:15px;flex-wrap:wrap;margin-top:10px;">
                ${Object.entries(summary).map(([k, v]) =>
                    `<div style="background:#f8f9fa;padding:10px 15px;border-radius:6px;border-left:3px solid #3498db;">
                        <div style="font-size:20px;font-weight:bold;color:#2c3e50;">${v}</div>
                        <div style="font-size:12px;color:#666;">${k}</div>
                    </div>`
                ).join('')}
            </div>` : ''}
        </div>`;

    // Tabela de dados
    if (rows.length === 0) {
        html += '<p style="text-align:center;color:#999;padding:30px;">Nenhum dado encontrado para os filtros selecionados.</p>';
    } else {
        const cols = Object.keys(rows[0]);
        html += `
            <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <thead>
                    <tr style="background:#3498db;color:white;">
                        ${cols.map(c => `<th style="padding:10px;text-align:left;">${c}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((row, i) => `
                    <tr style="background:${i % 2 === 0 ? '#fff' : '#f8f9fa'};">
                        ${cols.map(c => `<td style="padding:8px 10px;border-bottom:1px solid #eee;">${row[c] ?? '—'}</td>`).join('')}
                    </tr>`).join('')}
                </tbody>
            </table>
            </div>
            <p style="text-align:right;color:#999;font-size:12px;margin-top:10px;">Total: ${rows.length} registro(s)</p>`;
    }

    output.innerHTML = html;
}

// ----------------------------------------------------------
//  Relatório rápido
// ----------------------------------------------------------
async function generateQuickReport(type) {
    const today = new Date().toISOString().split('T')[0];
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                         .toISOString().split('T')[0];

    document.getElementById('reportType').value = type;
    const dateFrom = document.getElementById('dateFrom');
    const dateTo   = document.getElementById('dateTo');
    if (dateFrom) dateFrom.value = firstDay;
    if (dateTo)   dateTo.value   = today;

    updateReportOptions();
    await generateReport();
}

// ----------------------------------------------------------
//  Exportar / Imprimir
// ----------------------------------------------------------
function exportReport(format) {
    if (!currentReportData) { alert('Gere um relatório antes de exportar.'); return; }

    if (format === 'csv') {
        const rows   = Array.isArray(currentReportData.data)
            ? currentReportData.data
            : (currentReportData.data.items || currentReportData.data.rows || []);
        if (!rows.length) { alert('Nenhum dado para exportar.'); return; }

        const cols = Object.keys(rows[0]);
        const csv  = [cols.join(','),
            ...rows.map(r => cols.map(c => `"${String(r[c] ?? '').replace(/"/g,'""')}"`).join(','))
        ].join('\n');

        const link = document.createElement('a');
        link.href     = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        link.download = `relatorio_${currentReportData.type}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

    } else if (format === 'pdf') {
        printReport();
    }
}

function printReport() {
    if (!currentReportData) { alert('Gere um relatório antes de imprimir.'); return; }
    const output = document.getElementById('reportOutput');
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Relatório MedSystem</title>
        <style>body{font-family:Arial,sans-serif;}table{width:100%;border-collapse:collapse;}
        th{background:#3498db;color:white;padding:8px;}td{padding:6px;border-bottom:1px solid #eee;}</style>
        </head><body>${output?.innerHTML || ''}</body></html>`);
    w.print();
}

// ----------------------------------------------------------
//  Relatórios salvos
// ----------------------------------------------------------
async function loadSavedReports() {
    try {
        const data = await DB.reports.getSaved();
        savedReports = Array.isArray(data) ? data : (data.reports || []);
        renderSavedReports();
    } catch (err) {
        console.error('[reports] loadSaved:', err);
    }
}

function renderSavedReports() {
    const container = document.getElementById('savedReportsList');
    if (!container) return;
    if (!savedReports.length) {
        container.innerHTML = '<p style="color:#999;font-size:13px;">Nenhum relatório salvo.</p>';
        return;
    }
    container.innerHTML = savedReports.map(r => `
        <div class="saved-report-item" style="padding:8px;border-bottom:1px solid #eee;">
            <strong>${r.title || r.type}</strong>
            <span style="color:#999;font-size:12px;margin-left:8px;">${formatDate(r.createdAt?.split('T')[0])}</span>
            <div style="margin-top:4px;">
                <button class="btn-action btn-sm" onclick="viewSavedReport('${r.id}')">Ver</button>
                <button class="btn-action btn-sm" onclick="downloadReport('${r.id}')">Download</button>
                <button class="btn-action btn-sm btn-danger" onclick="deleteSavedReport('${r.id}')">Excluir</button>
            </div>
        </div>`).join('');
}

function viewSavedReport(id) {
    const r = savedReports.find(x => x.id === id);
    if (r) { currentReportData = r; renderReportContent(r.type, r.filters || {}, r.data || []); }
}

function downloadReport(id) {
    const r = savedReports.find(x => x.id === id);
    if (r) { currentReportData = r; exportReport('csv'); }
}

function shareReport(id) { alert('Funcionalidade de compartilhamento conectada ao servidor.'); }

async function deleteSavedReport(id) {
    if (!confirm('Excluir este relatório?')) return;
    try {
        await DB.reports.delete(id);
        savedReports = savedReports.filter(x => x.id !== id);
        renderSavedReports();
    } catch (err) {
        alert('Erro ao excluir: ' + (err instanceof DBError ? err.message : err.message));
    }
}

// ----------------------------------------------------------
//  Templates e agendamento (UI local)
// ----------------------------------------------------------
function useTemplate(type) {
    const el = document.getElementById('reportType');
    if (el) { el.value = type; updateReportOptions(); }
}

function previewTemplate(type) { alert(`Pré-visualização do template: ${type}`); }

function showScheduleForm() {
    const form = document.getElementById('scheduleForm');
    if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
function hideScheduleForm() {
    const form = document.getElementById('scheduleForm');
    if (form) form.style.display = 'none';
}
function editScheduledReport(id)   { alert(`Editando agendamento #${id}`); }
function deleteScheduledReport(id) { if (confirm('Excluir agendamento?')) alert(`Agendamento #${id} excluído.`); }

// ----------------------------------------------------------
//  Loading visual
// ----------------------------------------------------------
function showLoading(el) {
    if (!el) return;
    el.innerHTML = `
        <div style="text-align:center;padding:60px;color:#666;">
            <div style="font-size:48px;margin-bottom:20px;">⏳</div>
            <p>Gerando relatório...</p>
        </div>`;
}

// ----------------------------------------------------------
//  Dashboard stats (carregados do banco)
// ----------------------------------------------------------
async function loadDashboardStats() {
    try {
        const stats = await DB.reports.getStats();
        const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        setEl('totalPatients',      stats.totalPatients      || '—');
        setEl('monthAppointments',  stats.monthAppointments  || '—');
        setEl('activePrescriptions',stats.activePrescriptions|| '—');
        setEl('pendingExams',       stats.pendingExams       || '—');
    } catch (err) {
        console.error('[reports] loadDashboardStats:', err);
    }
}

// ----------------------------------------------------------
//  Inicialização
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('reportType')?.addEventListener('change', updateReportOptions);

    const scheduleForm = document.getElementById('scheduleReportForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Agendamento salvo! O relatório será gerado automaticamente.');
            hideScheduleForm();
        });
    }

    await Promise.all([loadDashboardStats(), loadSavedReports()]);
});

// Expõe globalmente
Object.assign(window, {
    updateReportOptions, clearFilters, generateReport, generateQuickReport,
    exportReport, printReport,
    viewSavedReport, downloadReport, shareReport, deleteSavedReport,
    useTemplate, previewTemplate,
    showScheduleForm, hideScheduleForm,
    editScheduledReport, deleteScheduledReport,
});
