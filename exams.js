// ============================================================
//  patients.js  –  MedSystem | Lista de Pacientes
//  Todos os dados vêm do banco via DB.patients (database.js)
//  Depende de: database.js
// ============================================================

// Estado local (carregado do banco)
let allPatients      = [];
let filteredPatients = [];

// ----------------------------------------------------------
//  Feedback visual
// ----------------------------------------------------------
function showLoadingMessage(message) {
    const div = document.createElement('div');
    div.id = 'loadingMessage';
    div.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                    background:rgba(0,0,0,.5);display:flex;justify-content:center;
                    align-items:center;z-index:1000;">
            <div style="background:white;padding:30px;border-radius:10px;text-align:center;">
                <div style="font-size:24px;margin-bottom:15px;">⏳</div>
                <div>${message}</div>
            </div>
        </div>`;
    document.body.appendChild(div);
}

function hideLoadingMessage() {
    const div = document.getElementById('loadingMessage');
    if (div) div.remove();
}

function showErrorMessage(message) {
    const div = document.createElement('div');
    div.innerHTML = `
        <div style="position:fixed;top:20px;right:20px;background:#e74c3c;
                    color:white;padding:15px 20px;border-radius:5px;z-index:1000;">
            <strong>❌ Erro:</strong> ${message}
        </div>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function showSuccessMessage(message) {
    const div = document.createElement('div');
    div.innerHTML = `
        <div style="position:fixed;top:20px;right:20px;background:#27ae60;
                    color:white;padding:15px 20px;border-radius:5px;z-index:1000;">
            <strong>✅ Sucesso:</strong> ${message}
        </div>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// ----------------------------------------------------------
//  Carga inicial — busca pacientes no banco
// ----------------------------------------------------------
async function loadPatients() {
    try {
        showLoadingMessage('Carregando pacientes...');
        const data = await DB.patients.getAll();

        // O servidor pode retornar { patients: [...] } ou diretamente um array
        allPatients      = Array.isArray(data) ? data : (data.patients || []);
        filteredPatients = [...allPatients];

        renderPatients();
        showQuickStats();
    } catch (err) {
        const msg = err instanceof DBError
            ? err.message
            : 'Não foi possível carregar os pacientes.';
        showErrorMessage(msg);
        console.error('[patients] loadPatients:', err);
    } finally {
        hideLoadingMessage();
    }
}

// ----------------------------------------------------------
//  Busca local (filtro em memória dos dados já carregados)
// ----------------------------------------------------------
function searchPatients(query) {
    if (!query.trim()) {
        filteredPatients = [...allPatients];
        return;
    }
    const term = query.toLowerCase().trim();
    filteredPatients = allPatients.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.cpf   && p.cpf.includes(term))   ||
        (p.phone && p.phone.includes(term))  ||
        (p.email && p.email.toLowerCase().includes(term))
    );
}

// ----------------------------------------------------------
//  Renderiza cards de pacientes
// ----------------------------------------------------------
function renderPatients() {
    const container = document.querySelector('.content-area');
    container.querySelectorAll('.patient-card').forEach(c => c.remove());

    if (filteredPatients.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div style="text-align:center;padding:40px;color:#666;">
                <div style="font-size:48px;margin-bottom:20px;">🔍</div>
                <h3>Nenhum paciente encontrado</h3>
                <p>Tente buscar por nome, CPF ou telefone</p>
            </div>`;
        container.appendChild(noResults);
        return;
    }

    filteredPatients.forEach(patient => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        card.innerHTML = `
            <div class="patient-name">${patient.name}</div>
            <div class="patient-info">
                📞 ${patient.phone} • 📧 ${patient.email}<br>
                🎂 ${patient.age} anos • 🆔 CPF: ${patient.cpf}<br>
                📍 ${patient.address}<br>
                🩺 Última consulta: ${patient.lastConsultation}
            </div>
            <div class="patient-actions">
                <button class="btn-small btn-success"  onclick="newConsultation(${patient.id})">Nova Consulta</button>
                <button class="btn-small btn-warning"  onclick="editPatient(${patient.id})">Editar</button>
                <button class="btn-small btn-primary"  onclick="newPrescription(${patient.id})">Receita</button>
            </div>`;
        container.appendChild(card);
    });
}

// ----------------------------------------------------------
//  Ações
// ----------------------------------------------------------
function viewPatientHistory(patientSlug) {
    showLoadingMessage('Carregando histórico do paciente...');
    setTimeout(() => {
        window.location.href = `patient-history.html?patient=${patientSlug}`;
    }, 800);
}

function newConsultation(patientId) {
    const patient = allPatients.find(p => p.id === patientId);
    if (patient) showConsultationModal(patient);
    else showErrorMessage('Paciente não encontrado!');
}

function editPatient(patientId) {
    const patient = allPatients.find(p => p.id === patientId);
    if (patient) showEditModal(patient);
    else showErrorMessage('Paciente não encontrado!');
}

function newPrescription(patientId) {
    const patient = allPatients.find(p => p.id === patientId);
    if (patient) showPrescriptionModal(patient);
    else showErrorMessage('Paciente não encontrado!');
}

// ----------------------------------------------------------
//  Modal: Nova Consulta
// ----------------------------------------------------------
function showConsultationModal(patient) {
    const modal = document.createElement('div');
    modal.id = 'consultationModal';
    modal.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                    background:rgba(0,0,0,.5);display:flex;justify-content:center;
                    align-items:center;z-index:1000;">
            <div style="background:white;padding:30px;border-radius:10px;max-width:500px;width:90%;">
                <h3>📅 Nova Consulta</h3>
                <p><strong>Paciente:</strong> ${patient.name}</p>
                <div style="margin:20px 0;">
                    <label style="display:block;margin-bottom:5px;">Data da Consulta:</label>
                    <input type="date" id="consultationDate" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                </div>
                <div style="margin:20px 0;">
                    <label style="display:block;margin-bottom:5px;">Horário:</label>
                    <input type="time" id="consultationTime" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                </div>
                <div style="margin:20px 0;">
                    <label style="display:block;margin-bottom:5px;">Observações:</label>
                    <textarea id="consultationNotes" rows="3" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;" placeholder="Motivo da consulta..."></textarea>
                </div>
                <div style="text-align:right;margin-top:20px;">
                    <button onclick="closeModal('consultationModal')" style="margin-right:10px;padding:8px 16px;border:1px solid #ddd;background:white;border-radius:4px;cursor:pointer;">Cancelar</button>
                    <button onclick="confirmConsultation(${patient.id})" style="padding:8px 16px;background:#27ae60;color:white;border:none;border-radius:4px;cursor:pointer;">Confirmar</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

// ----------------------------------------------------------
//  Modal: Editar Paciente
// ----------------------------------------------------------
function showEditModal(patient) {
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                    background:rgba(0,0,0,.5);display:flex;justify-content:center;
                    align-items:center;z-index:1000;">
            <div style="background:white;padding:30px;border-radius:10px;max-width:600px;width:90%;max-height:80%;overflow-y:auto;">
                <h3>✏️ Editar Paciente</h3>
                <div style="display:grid;gap:15px;margin:20px 0;">
                    <div>
                        <label style="display:block;margin-bottom:5px;">Nome Completo:</label>
                        <input type="text" id="editName" value="${patient.name}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div>
                            <label style="display:block;margin-bottom:5px;">Telefone:</label>
                            <input type="text" id="editPhone" value="${patient.phone}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                        </div>
                        <div>
                            <label style="display:block;margin-bottom:5px;">Idade:</label>
                            <input type="number" id="editAge" value="${patient.age}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                        </div>
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:5px;">Email:</label>
                        <input type="email" id="editEmail" value="${patient.email}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:5px;">CPF:</label>
                        <input type="text" id="editCpf" value="${patient.cpf}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:5px;">Endereço:</label>
                        <textarea id="editAddress" rows="2" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">${patient.address}</textarea>
                    </div>
                </div>
                <div style="text-align:right;margin-top:20px;">
                    <button onclick="closeModal('editModal')" style="margin-right:10px;padding:8px 16px;border:1px solid #ddd;background:white;border-radius:4px;cursor:pointer;">Cancelar</button>
                    <button onclick="confirmEdit(${patient.id})" style="padding:8px 16px;background:#f39c12;color:white;border:none;border-radius:4px;cursor:pointer;">Salvar</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

// ----------------------------------------------------------
//  Modal: Nova Receita
// ----------------------------------------------------------
function showPrescriptionModal(patient) {
    const modal = document.createElement('div');
    modal.id = 'prescriptionModal';
    modal.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                    background:rgba(0,0,0,.5);display:flex;justify-content:center;
                    align-items:center;z-index:1000;">
            <div style="background:white;padding:30px;border-radius:10px;max-width:600px;width:90%;max-height:80%;overflow-y:auto;">
                <h3>💊 Nova Receita</h3>
                <p><strong>Paciente:</strong> ${patient.name}</p>
                <div style="margin:20px 0;">
                    <label style="display:block;margin-bottom:5px;">Medicamento:</label>
                    <input type="text" id="medicationName" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;" placeholder="Nome do medicamento">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0;">
                    <div>
                        <label style="display:block;margin-bottom:5px;">Dosagem:</label>
                        <input type="text" id="dosage" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;" placeholder="Ex: 500mg">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:5px;">Frequência:</label>
                        <select id="frequency" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                            <option value="">Selecione...</option>
                            <option>1x ao dia</option><option>2x ao dia</option>
                            <option>3x ao dia</option><option>4x ao dia</option>
                            <option>De 8 em 8 horas</option><option>De 12 em 12 horas</option>
                        </select>
                    </div>
                </div>
                <div style="margin:20px 0;">
                    <label style="display:block;margin-bottom:5px;">Duração:</label>
                    <input type="text" id="duration" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;" placeholder="Ex: 7 dias, 2 semanas">
                </div>
                <div style="margin:20px 0;">
                    <label style="display:block;margin-bottom:5px;">Instruções adicionais:</label>
                    <textarea id="instructions" rows="3" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;" placeholder="Tomar com água, após as refeições..."></textarea>
                </div>
                <div style="text-align:right;margin-top:20px;">
                    <button onclick="closeModal('prescriptionModal')" style="margin-right:10px;padding:8px 16px;border:1px solid #ddd;background:white;border-radius:4px;cursor:pointer;">Cancelar</button>
                    <button onclick="confirmPrescription(${patient.id})" style="padding:8px 16px;background:#3498db;color:white;border:none;border-radius:4px;cursor:pointer;">Criar Receita</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
}

// ----------------------------------------------------------
//  Confirmar ações (salvam no banco)
// ----------------------------------------------------------
async function confirmConsultation(patientId) {
    const date  = document.getElementById('consultationDate').value;
    const time  = document.getElementById('consultationTime').value;
    const notes = document.getElementById('consultationNotes').value;

    if (!date || !time) { showErrorMessage('Preencha data e horário da consulta'); return; }

    const patient = allPatients.find(p => p.id === patientId);
    try {
        await DB.appointments.create({ patientId, patientName: patient.name, date, time, notes });
        closeModal('consultationModal');
        showSuccessMessage(`Consulta agendada para ${patient.name} em ${date} às ${time}`);
    } catch (err) {
        showErrorMessage(err instanceof DBError ? err.message : 'Erro ao agendar consulta');
    }
}

async function confirmEdit(patientId) {
    const name    = document.getElementById('editName').value;
    const phone   = document.getElementById('editPhone').value;
    const email   = document.getElementById('editEmail').value;
    const age     = document.getElementById('editAge').value;
    const cpf     = document.getElementById('editCpf').value;
    const address = document.getElementById('editAddress').value;

    if (!name || !phone || !email) { showErrorMessage('Preencha os campos obrigatórios'); return; }

    try {
        await DB.patients.update(patientId, { name, phone, email, age: parseInt(age), cpf, address });

        // Atualiza memória local
        const idx = allPatients.findIndex(p => p.id === patientId);
        if (idx !== -1) allPatients[idx] = { ...allPatients[idx], name, phone, email, age: parseInt(age), cpf, address };
        filteredPatients = [...allPatients];
        renderPatients();

        closeModal('editModal');
        showSuccessMessage(`Dados de ${name} atualizados com sucesso!`);
    } catch (err) {
        showErrorMessage(err instanceof DBError ? err.message : 'Erro ao salvar edição');
    }
}

async function confirmPrescription(patientId) {
    const medication   = document.getElementById('medicationName').value;
    const dosage       = document.getElementById('dosage').value;
    const frequency    = document.getElementById('frequency').value;
    const duration     = document.getElementById('duration').value;
    const instructions = document.getElementById('instructions').value;

    if (!medication || !dosage || !frequency) {
        showErrorMessage('Preencha medicamento, dosagem e frequência');
        return;
    }

    const patient = allPatients.find(p => p.id === patientId);
    try {
        await DB.prescriptions.create({
            patientId,
            patient: { id: String(patientId), name: patient.name, cpf: patient.cpf },
            medications: [{ name: medication, dosage, frequency, duration, instructions }],
            date: new Date().toISOString().split('T')[0],
        });
        closeModal('prescriptionModal');
        showSuccessMessage(`Receita criada para ${patient.name}: ${medication} ${dosage}`);
    } catch (err) {
        showErrorMessage(err instanceof DBError ? err.message : 'Erro ao criar receita');
    }
}

// ----------------------------------------------------------
//  Barra de busca e ordenação
// ----------------------------------------------------------
function setupSearchBar() {
    const searchInput  = document.querySelector('input[type="text"]');
    const searchButton = document.querySelector('.btn-small.btn-primary');

    if (searchInput) {
        searchInput.addEventListener('input', () => { searchPatients(searchInput.value); renderPatients(); });
        searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') { searchPatients(searchInput.value); renderPatients(); }
        });
    }
    if (searchButton) {
        searchButton.addEventListener('click', () => { searchPatients(searchInput?.value || ''); renderPatients(); });
    }
}

function setupNewPatientButton() {
    const btn = document.querySelector('.btn-small.btn-success');
    if (btn && btn.textContent.includes('Novo Paciente')) {
        btn.addEventListener('click', () => { window.location.href = 'new-patient.html'; });
    }
}

function showQuickStats() {
    const header = document.querySelector('.header');
    if (header && !header.querySelector('.quick-stats')) {
        const div = document.createElement('div');
        div.className = 'quick-stats';
        div.innerHTML = `
            <div style="display:flex;gap:20px;margin-top:10px;font-size:14px;color:#666;">
                <span>📊 Total de pacientes: <strong>${allPatients.length}</strong></span>
            </div>`;
        header.appendChild(div);
    }
}

function addSortingOptions() {
    const searchBar = document.querySelector('.content-area > div');
    if (!searchBar || searchBar.querySelector('.sort-options')) return;

    const sortDiv = document.createElement('div');
    sortDiv.className = 'sort-options';
    sortDiv.innerHTML = `
        <div style="display:flex;gap:10px;align-items:center;margin-top:15px;">
            <span style="font-size:14px;color:#666;">Ordenar por:</span>
            <select id="sortSelect" style="padding:5px 10px;border:1px solid #ddd;border-radius:4px;">
                <option value="name">Nome</option>
                <option value="age">Idade</option>
                <option value="lastConsultation">Última consulta</option>
            </select>
            <select id="sortOrder" style="padding:5px 10px;border:1px solid #ddd;border-radius:4px;">
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
            </select>
        </div>`;
    searchBar.appendChild(sortDiv);

    function sortPatients() {
        const by    = document.getElementById('sortSelect').value;
        const order = document.getElementById('sortOrder').value;
        filteredPatients.sort((a, b) => {
            const av = by === 'lastConsultation'
                ? new Date(a[by]?.split('/').reverse().join('-'))
                : (typeof a[by] === 'string' ? a[by].toLowerCase() : a[by]);
            const bv = by === 'lastConsultation'
                ? new Date(b[by]?.split('/').reverse().join('-'))
                : (typeof b[by] === 'string' ? b[by].toLowerCase() : b[by]);
            return order === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
        });
        renderPatients();
    }

    document.getElementById('sortSelect').addEventListener('change', sortPatients);
    document.getElementById('sortOrder').addEventListener('change', sortPatients);
}

function highlightPatientFromURL() {
    const highlightId = new URLSearchParams(window.location.search).get('highlight');
    if (!highlightId) return;
    document.querySelectorAll('.patient-card').forEach((card, i) => {
        if (i + 1 == highlightId) {
            card.style.border          = '2px solid #3498db';
            card.style.backgroundColor = '#f8f9ff';
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => { card.style.border = ''; card.style.backgroundColor = ''; }, 3000);
        }
    });
}

// ----------------------------------------------------------
//  Inicialização
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    setupSearchBar();
    setupNewPatientButton();
    addSortingOptions();

    // Carrega dados reais do banco
    await loadPatients();

    highlightPatientFromURL();
    console.log('[patients] Sistema inicializado. Total:', allPatients.length);
});
