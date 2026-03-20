// ============================================================
//  prescriptions.js  –  MedSystem | Receitas Médicas
//  Todos os dados vêm do banco via DB.prescriptions (database.js)
//  Depende de: database.js
// ============================================================

// Estado local
let prescriptions    = [];
let patientsList     = [];
let nextMedIndex     = 1;

// ----------------------------------------------------------
//  Carga inicial
// ----------------------------------------------------------
async function loadPrescriptions() {
    try {
        const [presRes, patRes] = await Promise.all([
            DB.prescriptions.getAll(),
            DB.patients.getAll(),
        ]);
        prescriptions = Array.isArray(presRes) ? presRes : (presRes.prescriptions || []);
        patientsList  = Array.isArray(patRes)  ? patRes  : (patRes.patients       || []);

        updateStats();
        renderPrescriptions();
        updateHistoryTable();
        populatePatientSelect();
    } catch (err) {
        console.error('[prescriptions] load:', err);
        alert('Erro ao carregar receitas: ' + (err instanceof DBError ? err.message : err.message));
    }
}

// ----------------------------------------------------------
//  Helpers
// ----------------------------------------------------------
const formatDate = (d) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
};

const getStatusClass = (status) => ({
    'Ativa':     'status-active',
    'Finalizada':'status-completed',
    'Pendente':  'status-pending',
    'Cancelada': 'status-cancelled',
}[status] || 'status-active');

// ----------------------------------------------------------
//  Estatísticas
// ----------------------------------------------------------
function updateStats() {
    const now   = new Date();
    const month = now.getMonth();
    const year  = now.getFullYear();
    const today = now.toISOString().split('T')[0];

    const total        = prescriptions.length;
    const thisMonth    = prescriptions.filter(p => {
        const d = new Date(p.date); return d.getMonth() === month && d.getFullYear() === year;
    }).length;
    const todayCount   = prescriptions.filter(p => p.date === today).length;
    const pending      = prescriptions.filter(p => p.status === 'Pendente').length;

    const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setEl('totalPrescriptions', total);
    setEl('monthPrescriptions', thisMonth);
    setEl('todayPrescriptions', todayCount);
    setEl('pendingPrescriptions', pending);
}

// ----------------------------------------------------------
//  Renderização
// ----------------------------------------------------------
function renderPrescriptions() {
    const container = document.getElementById('prescriptionCards') ||
                      document.querySelector('.prescriptions-container');
    if (!container) return;

    if (!prescriptions.length) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:40px;">Nenhuma receita encontrada.</p>';
        return;
    }

    container.innerHTML = prescriptions.map(p => `
        <div class="prescription-card" id="presc-${p.id}">
            <div class="prescription-header">
                <span class="prescription-id">Receita #${p.id}</span>
                <span class="status-badge ${getStatusClass(p.status)}">${p.status}</span>
            </div>
            <div class="prescription-patient">
                <strong>${p.patient?.name || '—'}</strong>
                ${p.patient?.cpf ? `<span>CPF: ${p.patient.cpf}</span>` : ''}
            </div>
            <div class="prescription-info">
                📅 ${formatDate(p.date)}
                ${p.diagnosis ? `· 🩺 ${p.diagnosis}` : ''}
            </div>
            <div class="prescription-medications">
                ${(p.medications || []).map(m => `
                    <div class="medication-summary">💊 ${m.name} ${m.dosage} — ${m.frequency}</div>`).join('')}
            </div>
            <div class="prescription-actions">
                <button class="btn-action" onclick="viewPrescription('${p.id}')">Ver</button>
                <button class="btn-action" onclick="printPrescription('${p.id}')">Imprimir</button>
                ${p.status !== 'Finalizada' ? `
                <button class="btn-action" onclick="editPrescription('${p.id}')">Editar</button>
                <button class="btn-action btn-danger" onclick="cancelPrescription('${p.id}')">Cancelar</button>` : ''}
                <button class="btn-action" onclick="renewPrescription('${p.id}')">Renovar</button>
                <button class="btn-action" onclick="emailPrescription('${p.id}')">Enviar</button>
            </div>
        </div>`).join('');
}

function updateHistoryTable() {
    const tbody = document.getElementById('historyTableBody') ||
                  document.querySelector('#prescriptionHistory tbody');
    if (!tbody) return;

    tbody.innerHTML = prescriptions.map(p => {
        const statusClass = getStatusClass(p.status);
        return `
            <tr>
                <td>#${p.id}</td>
                <td>${p.patient?.name || '—'}</td>
                <td>${formatDate(p.date)}</td>
                <td>${p.diagnosis || '—'}</td>
                <td><span class="status-badge ${statusClass}">${p.status}</span></td>
                <td>
                    <button class="btn-action btn-sm" onclick="viewPrescription('${p.id}')">Ver</button>
                    ${p.status !== 'Finalizada' ? `
                    <button class="btn-action btn-sm btn-danger" onclick="cancelPrescription('${p.id}')">Cancelar</button>` : ''}
                </td>
            </tr>`;
    }).join('');
}

// ----------------------------------------------------------
//  Formulário: nova / edição
// ----------------------------------------------------------
function showNewPrescriptionForm() {
    const form = document.getElementById('newPrescriptionSection') ||
                 document.querySelector('.new-prescription-form');
    if (form) form.style.display = 'block';

    // Pré-preenche data
    const dateField = document.getElementById('prescriptionDate');
    if (dateField && !dateField.value) dateField.value = new Date().toISOString().split('T')[0];
}

function hideNewPrescriptionForm() {
    const form = document.getElementById('newPrescriptionSection') ||
                 document.querySelector('.new-prescription-form');
    if (form) form.style.display = 'none';
    clearForm();
}

function clearForm() {
    ['patientSelect','prescriptionDate','diagnosis','observations'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const container = document.getElementById('medicationsContainer');
    if (container) {
        container.innerHTML = '';
        nextMedIndex = 1;
        addMedication(); // pelo menos um campo
    }
}

function addMedication() {
    const container = document.getElementById('medicationsContainer');
    if (!container) return;

    const idx  = nextMedIndex++;
    const item = document.createElement('div');
    item.className = 'medication-item';
    item.id        = `med-${idx}`;
    item.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(4,1fr) auto;gap:10px;align-items:end;margin-bottom:10px;">
            <div>
                <label>Medicamento</label>
                <input type="text" class="med-name" placeholder="Nome" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;">
            </div>
            <div>
                <label>Dosagem</label>
                <input type="text" class="med-dosage" placeholder="Ex: 500mg" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;">
            </div>
            <div>
                <label>Frequência</label>
                <input type="text" class="med-frequency" placeholder="Ex: 3x ao dia" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;">
            </div>
            <div>
                <label>Duração</label>
                <input type="text" class="med-duration" placeholder="Ex: 7 dias" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;">
            </div>
            <button type="button" onclick="document.getElementById('med-${idx}').remove()"
                    style="padding:6px 10px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;height:34px;">✕</button>
        </div>
        <div style="margin-bottom:15px;">
            <label>Instruções</label>
            <textarea class="med-instructions" rows="2" placeholder="Instruções adicionais..."
                      style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;"></textarea>
        </div>`;
    container.appendChild(item);
}

function collectMedications() {
    return Array.from(document.querySelectorAll('.medication-item'))
        .map(item => ({
            name:         item.querySelector('.med-name')?.value         || '',
            dosage:       item.querySelector('.med-dosage')?.value       || '',
            frequency:    item.querySelector('.med-frequency')?.value    || '',
            duration:     item.querySelector('.med-duration')?.value     || '',
            instructions: item.querySelector('.med-instructions')?.value || '',
        }))
        .filter(m => m.name.trim());
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const patientId  = document.getElementById('patientSelect')?.value;
    const date       = document.getElementById('prescriptionDate')?.value ||
                       new Date().toISOString().split('T')[0];
    const diagnosis  = document.getElementById('diagnosis')?.value        || '';
    const obs        = document.getElementById('observations')?.value     || '';
    const medications= collectMedications();

    if (!patientId)         { alert('Selecione um paciente.');               return; }
    if (!medications.length){ alert('Adicione pelo menos um medicamento.');  return; }

    const patient = patientsList.find(p => p.id == patientId);

    try {
        const created = await DB.prescriptions.create({
            patient: { id: String(patientId), name: patient?.name || '', cpf: patient?.cpf || '' },
            date, diagnosis, medications, observations: obs, status: 'Ativa',
        });

        prescriptions.unshift(created);
        updateStats();
        renderPrescriptions();
        updateHistoryTable();
        hideNewPrescriptionForm();
        alert('Receita salva com sucesso!');
    } catch (err) {
        alert('Erro ao salvar receita: ' + (err instanceof DBError ? err.message : err.message));
    }
}

// ----------------------------------------------------------
//  Ações individuais
// ----------------------------------------------------------
function viewPrescription(id) {
    const p = prescriptions.find(x => x.id === id);
    if (!p) return;
    const meds = (p.medications || []).map(m =>
        `  • ${m.name} ${m.dosage} — ${m.frequency} por ${m.duration}\n    ${m.instructions}`
    ).join('\n');
    alert(`RECEITA #${p.id}\nPaciente: ${p.patient?.name}\nData: ${formatDate(p.date)}\nDiagnóstico: ${p.diagnosis}\n\nMEDICAMENTOS:\n${meds}\n\nObservações: ${p.observations}\nStatus: ${p.status}`);
}

function printPrescription(id) {
    const p = prescriptions.find(x => x.id === id);
    if (!p) return;
    const meds = (p.medications || []).map(m =>
        `<li><strong>${m.name} ${m.dosage}</strong> — ${m.frequency} por ${m.duration}<br><em>${m.instructions}</em></li>`
    ).join('');
    const w = window.open('', '_blank');
    w.document.write(`<html><body>
        <h2>Receita Médica #${p.id}</h2>
        <p>Paciente: ${p.patient?.name || ''} | CPF: ${p.patient?.cpf || ''}</p>
        <p>Data: ${formatDate(p.date)} | Diagnóstico: ${p.diagnosis}</p>
        <h3>Medicamentos</h3><ul>${meds}</ul>
        <p>Observações: ${p.observations}</p>
    </body></html>`);
    w.print();
}

function emailPrescription(id) {
    const p = prescriptions.find(x => x.id === id);
    if (!p) return;
    alert(`Enviando receita #${id} para ${p.patient?.name}...\n(Funcionalidade conectada ao servidor SMTP)`);
}

async function cancelPrescription(id) {
    if (!confirm(`Cancelar receita #${id}?`)) return;
    try {
        await DB.prescriptions.updateStatus(id, 'Cancelada');
        const p = prescriptions.find(x => x.id === id);
        if (p) p.status = 'Cancelada';
        updateStats(); renderPrescriptions(); updateHistoryTable();
        alert(`Receita #${id} cancelada.`);
    } catch (err) {
        alert('Erro: ' + (err instanceof DBError ? err.message : err.message));
    }
}

async function renewPrescription(id) {
    const original = prescriptions.find(x => x.id === id);
    if (!original || !confirm(`Renovar receita #${id} para ${original.patient?.name}?`)) return;
    try {
        const created = await DB.prescriptions.create({
            ...original,
            id: undefined,
            date: new Date().toISOString().split('T')[0],
            status: 'Ativa',
        });
        prescriptions.unshift(created);
        updateStats(); renderPrescriptions(); updateHistoryTable();
        alert(`Receita renovada! Nova receita: #${created.id}`);
    } catch (err) {
        alert('Erro ao renovar: ' + (err instanceof DBError ? err.message : err.message));
    }
}

function editPrescription(id) {
    const p = prescriptions.find(x => x.id === id);
    if (!p) return;
    if (p.status === 'Finalizada') { alert('Receitas finalizadas não podem ser editadas.'); return; }

    showNewPrescriptionForm();

    setTimeout(() => {
        const sel  = document.getElementById('patientSelect');
        const date = document.getElementById('prescriptionDate');
        const diag = document.getElementById('diagnosis');
        const obs  = document.getElementById('observations');

        if (sel  && p.patient) sel.value  = p.patient.id || '';
        if (date)              date.value = p.date;
        if (diag)              diag.value = p.diagnosis || '';
        if (obs)               obs.value  = p.observations || '';

        // Repopula medicamentos
        const container = document.getElementById('medicationsContainer');
        if (container && p.medications) {
            container.innerHTML = ''; nextMedIndex = 1;
            p.medications.forEach(() => addMedication());
            const items = container.querySelectorAll('.medication-item');
            p.medications.forEach((m, i) => {
                if (!items[i]) return;
                items[i].querySelector('.med-name').value         = m.name;
                items[i].querySelector('.med-dosage').value       = m.dosage;
                items[i].querySelector('.med-frequency').value    = m.frequency;
                items[i].querySelector('.med-duration').value     = m.duration;
                items[i].querySelector('.med-instructions').value = m.instructions;
            });
        }

        // Substitui submit por update
        const btn = document.querySelector('#newPrescriptionForm button[type="submit"]');
        if (btn) {
            btn.textContent = '💾 Atualizar Receita';
            btn.onclick = async (e) => {
                e.preventDefault();
                await updatePrescription(id);
                btn.textContent = '💾 Salvar Receita';
                btn.onclick = null;
            };
        }
    }, 100);
}

async function updatePrescription(id) {
    const patientId   = document.getElementById('patientSelect')?.value;
    const date        = document.getElementById('prescriptionDate')?.value;
    const diagnosis   = document.getElementById('diagnosis')?.value || '';
    const obs         = document.getElementById('observations')?.value || '';
    const medications = collectMedications();

    if (!patientId)         { alert('Selecione um paciente.'); return; }
    if (!medications.length){ alert('Adicione ao menos um medicamento.'); return; }

    const patient = patientsList.find(p => p.id == patientId);
    try {
        const updated = await DB.prescriptions.update(id, {
            patient: { id: String(patientId), name: patient?.name || '', cpf: patient?.cpf || '' },
            date, diagnosis, medications, observations: obs,
        });
        const idx = prescriptions.findIndex(x => x.id === id);
        if (idx !== -1) prescriptions[idx] = updated || { ...prescriptions[idx], date, diagnosis, medications, observations: obs };
        updateStats(); renderPrescriptions(); updateHistoryTable();
        hideNewPrescriptionForm();
        alert('Receita atualizada com sucesso!');
    } catch (err) {
        alert('Erro ao atualizar: ' + (err instanceof DBError ? err.message : err.message));
    }
}

function populatePatientSelect() {
    const select = document.getElementById('patientSelect');
    if (!select) return;
    while (select.children.length > 1) select.removeChild(select.lastChild);
    patientsList.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id; opt.textContent = `${p.name} (CPF: ${p.cpf || '—'})`;
        select.appendChild(opt);
    });
}

// ----------------------------------------------------------
//  Inicialização
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    // Garante ao menos um campo de medicamento
    const container = document.getElementById('medicationsContainer');
    if (container && !container.children.length) addMedication();

    document.getElementById('newPrescriptionForm')
        ?.addEventListener('submit', handleFormSubmit);

    await loadPrescriptions();
});

Object.assign(window, {
    showNewPrescriptionForm, hideNewPrescriptionForm, clearForm, addMedication,
    viewPrescription, printPrescription, emailPrescription,
    cancelPrescription, renewPrescription, editPrescription,
});
