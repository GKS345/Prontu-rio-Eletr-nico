// Dados dos pacientes (simulando um banco de dados)
const patientsData = [
    {
        id: 1,
        name: "Maria Santos Silva",
        phone: "(11) 99999-9999",
        email: "maria@email.com",
        age: 45,
        cpf: "123.456.789-00",
        address: "Rua das Flores, 123 - São Paulo, SP",
        lastConsultation: "20/06/2025",
        slug: "maria"
    },
    {
        id: 2,
        name: "José Oliveira Costa",
        phone: "(11) 88888-8888",
        email: "jose@email.com",
        age: 62,
        cpf: "987.654.321-00",
        address: "Av. Paulista, 456 - São Paulo, SP",
        lastConsultation: "15/06/2025",
        slug: "jose"
    },
    {
        id: 3,
        name: "Ana Costa Pereira",
        phone: "(11) 77777-7777",
        email: "ana@email.com",
        age: 28,
        cpf: "456.789.123-00",
        address: "Rua da Consolação, 789 - São Paulo, SP",
        lastConsultation: "10/06/2025",
        slug: "ana"
    },
    {
        id: 4,
        name: "Roberto Ferreira Lima",
        phone: "(11) 66666-6666",
        email: "roberto@email.com",
        age: 52,
        cpf: "321.654.987-00",
        address: "Rua Augusta, 321 - São Paulo, SP",
        lastConsultation: "05/06/2025",
        slug: "roberto"
    },
    {
        id: 5,
        name: "Carla Mendes Souza",
        phone: "(11) 55555-5555",
        email: "carla@email.com",
        age: 38,
        cpf: "159.753.486-00",
        address: "Rua Oscar Freire, 654 - São Paulo, SP",
        lastConsultation: "01/06/2025",
        slug: "carla"
    }
];

// Variável para armazenar todos os pacientes (para filtros)
let allPatients = [...patientsData];
let filteredPatients = [...patientsData];

// Função para destacar paciente específico baseado na URL
function highlightPatientFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get('highlight');

    if (highlightId) {
        const patientCards = document.querySelectorAll('.patient-card');
        patientCards.forEach((card, index) => {
            if (index + 1 == highlightId) {
                card.style.border = '2px solid #3498db';
                card.style.backgroundColor = '#f8f9ff';
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    card.style.border = '';
                    card.style.backgroundColor = '';
                }, 3000);
            }
        });
    }
}

// Função para buscar pacientes
function searchPatients(query) {
    if (!query.trim()) {
        filteredPatients = [...allPatients];
        return;
    }

    const searchTerm = query.toLowerCase().trim();
    filteredPatients = allPatients.filter(patient => {
        return patient.name.toLowerCase().includes(searchTerm) ||
            patient.cpf.includes(searchTerm) ||
            patient.phone.includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm);
    });
}

// Função para renderizar a lista de pacientes
function renderPatients() {
    const container = document.querySelector('.content-area');

    // Remove cards existentes (exceto o primeiro elemento que é a barra de busca)
    const existingCards = container.querySelectorAll('.patient-card');
    existingCards.forEach(card => card.remove());

    if (filteredPatients.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                <h3>Nenhum paciente encontrado</h3>
                <p>Tente buscar por nome, CPF ou telefone</p>
            </div>
        `;
        container.appendChild(noResults);
        return;
    }

    filteredPatients.forEach(patient => {
        const patientCard = document.createElement('div');
        patientCard.className = 'patient-card';
        patientCard.innerHTML = `
            <div class="patient-name">${patient.name}</div>
            <div class="patient-info">
                📞 ${patient.phone} • 📧 ${patient.email}<br>
                🎂 ${patient.age} anos • 🆔 CPF: ${patient.cpf}<br>
                📍 ${patient.address}<br>
                🩺 Última consulta: ${patient.lastConsultation}
            </div>
            <div class="patient-actions">
                <button class="btn-small btn-success" onclick="newConsultation(${patient.id})">Nova Consulta</button>
                <button class="btn-small btn-warning" onclick="editPatient(${patient.id})">Editar</button>
                <button class="btn-small btn-primary" onclick="newPrescription(${patient.id})">Receita</button>
            </div>
        `;
        container.appendChild(patientCard);
    });
}

// Função para ver histórico do paciente
function viewPatientHistory(patientSlug) {
    try {
        // Verifica se a página existe antes de redirecionar
        const patient = patientsData.find(p => p.slug === patientSlug);
        if (patient) {
            // Simula carregamento
            showLoadingMessage('Carregando histórico do paciente...');
            setTimeout(() => {
                window.location.href = `patient-history.html?patient=${patientSlug}`;
            }, 800);
        } else {
            showErrorMessage('Paciente não encontrado!');
        }
    } catch (error) {
        console.error('Erro ao acessar histórico:', error);
        showErrorMessage('Erro ao carregar histórico do paciente');
    }
}

// Função para nova consulta
function newConsultation(patientId) {
    try {
        const patient = patientsData.find(p => p.id === patientId);
        if (patient) {
            // Cria modal para nova consulta
            showConsultationModal(patient);
        } else {
            showErrorMessage('Paciente não encontrado!');
        }
    } catch (error) {
        console.error('Erro ao agendar consulta:', error);
        showErrorMessage('Erro ao agendar consulta');
    }
}

// Função para editar paciente
function editPatient(patientId) {
    try {
        const patient = patientsData.find(p => p.id === patientId);
        if (patient) {
            // Cria modal para edição
            showEditModal(patient);
        } else {
            showErrorMessage('Paciente não encontrado!');
        }
    } catch (error) {
        console.error('Erro ao editar paciente:', error);
        showErrorMessage('Erro ao editar paciente');
    }
}

// Função para nova receita
function newPrescription(patientId) {
    try {
        const patient = patientsData.find(p => p.id === patientId);
        if (patient) {
            // Cria modal para nova receita
            showPrescriptionModal(patient);
        } else {
            showErrorMessage('Paciente não encontrado!');
        }
    } catch (error) {
        console.error('Erro ao criar receita:', error);
        showErrorMessage('Erro ao criar receita');
    }
}

// Função para mostrar mensagem de carregamento
function showLoadingMessage(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
                    align-items: center; z-index: 1000;">
            <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 15px;">⏳</div>
                <div>${message}</div>
            </div>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

// Função para mostrar mensagem de erro
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #e74c3c; 
                    color: white; padding: 15px 20px; border-radius: 5px; z-index: 1000;">
            <strong>❌ Erro:</strong> ${message}
        </div>
    `;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #27ae60; 
                    color: white; padding: 15px 20px; border-radius: 5px; z-index: 1000;">
            <strong>✅ Sucesso:</strong> ${message}
        </div>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

// Modal para nova consulta
function showConsultationModal(patient) {
    const modal = document.createElement('div');
    modal.id = 'consultationModal';
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
                    align-items: center; z-index: 1000;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;">
                <h3>📅 Nova Consulta</h3>
                <p><strong>Paciente:</strong> ${patient.name}</p>
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 5px;">Data da Consulta:</label>
                    <input type="date" id="consultationDate" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 5px;">Horário:</label>
                    <input type="time" id="consultationTime" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 5px;">Observações:</label>
                    <textarea id="consultationNotes" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Motivo da consulta..."></textarea>
                </div>
                <div style="text-align: right; margin-top: 20px;">
                    <button onclick="closeModal('consultationModal')" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancelar</button>
                    <button onclick="confirmConsultation(${patient.id})" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirmar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Modal para editar paciente
function showEditModal(patient) {
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
                    align-items: center; z-index: 1000;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; width: 90%; max-height: 80%; overflow-y: auto;">
                <h3>✏️ Editar Paciente</h3>
                <div style="display: grid; gap: 15px; margin: 20px 0;">
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Nome Completo:</label>
                        <input type="text" id="editName" value="${patient.name}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Telefone:</label>
                            <input type="text" id="editPhone" value="${patient.phone}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Idade:</label>
                            <input type="number" id="editAge" value="${patient.age}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Email:</label>
                        <input type="email" id="editEmail" value="${patient.email}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px;">CPF:</label>
                        <input type="text" id="editCpf" value="${patient.cpf}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Endereço:</label>
                        <textarea id="editAddress" rows="2" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">${patient.address}</textarea>
                    </div>
                </div>
                <div style="text-align: right; margin-top: 20px;">
                    <button onclick="closeModal('editModal')" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancelar</button>
                    <button onclick="confirmEdit(${patient.id})" style="padding: 8px 16px; background: #f39c12; color: white; border: none; border-radius: 4px; cursor: pointer;">Salvar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Modal para nova receita
function showPrescriptionModal(patient) {
    const modal = document.createElement('div');
    modal.id = 'prescriptionModal';
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
                    align-items: center; z-index: 1000;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; width: 90%; max-height: 80%; overflow-y: auto;">
                <h3>💊 Nova Receita</h3>
                <p><strong>Paciente:</strong> ${patient.name}</p>
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 5px;">Medicamento:</label>
                    <input type="text" id="medicationName" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nome do medicamento">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Dosagem:</label>
                        <input type="text" id="dosage" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Ex: 500mg">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Frequência:</label>
                        <select id="frequency" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">Selecione...</option>
                            <option value="1x ao dia">1x ao dia</option>
                            <option value="2x ao dia">2x ao dia</option>
                            <option value="3x ao dia">3x ao dia</option>
                            <option value="4x ao dia">4x ao dia</option>
                            <option value="De 8 em 8 horas">De 8 em 8 horas</option>
                            <option value="De 12 em 12 horas">De 12 em 12 horas</option>
                        </select>
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 5px;">Duração do tratamento:</label>
                    <input type="text" id="duration" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Ex: 7 dias, 2 semanas">
                </div>
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 5px;">Instruções adicionais:</label>
                    <textarea id="instructions" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Tomar com água, após as refeições..."></textarea>
                </div>
                <div style="text-align: right; margin-top: 20px;">
                    <button onclick="closeModal('prescriptionModal')" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancelar</button>
                    <button onclick="confirmPrescription(${patient.id})" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Criar Receita</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Função para fechar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Confirmar consulta
function confirmConsultation(patientId) {
    const date = document.getElementById('consultationDate').value;
    const time = document.getElementById('consultationTime').value;
    const notes = document.getElementById('consultationNotes').value;

    if (!date || !time) {
        showErrorMessage('Por favor, preencha data e horário da consulta');
        return;
    }

    const patient = patientsData.find(p => p.id === patientId);

    // Simula salvamento da consulta
    setTimeout(() => {
        closeModal('consultationModal');
        showSuccessMessage(`Consulta agendada para ${patient.name} em ${date} às ${time}`);
    }, 500);
}

// Confirmar edição
function confirmEdit(patientId) {
    const name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    const email = document.getElementById('editEmail').value;
    const age = document.getElementById('editAge').value;
    const cpf = document.getElementById('editCpf').value;
    const address = document.getElementById('editAddress').value;

    if (!name || !phone || !email) {
        showErrorMessage('Por favor, preencha os campos obrigatórios');
        return;
    }

    // Atualiza os dados do paciente
    const patientIndex = patientsData.findIndex(p => p.id === patientId);
    if (patientIndex !== -1) {
        patientsData[patientIndex] = {
            ...patientsData[patientIndex],
            name, phone, email, age: parseInt(age), cpf, address
        };

        // Atualiza também as listas filtradas
        allPatients = [...patientsData];
        filteredPatients = [...patientsData];

        // Re-renderiza a lista
        renderPatients();

        closeModal('editModal');
        showSuccessMessage(`Dados de ${name} atualizados com sucesso!`);
    }
}

// Confirmar receita
function confirmPrescription(patientId) {
    const medication = document.getElementById('medicationName').value;
    const dosage = document.getElementById('dosage').value;
    const frequency = document.getElementById('frequency').value;
    const duration = document.getElementById('duration').value;
    const instructions = document.getElementById('instructions').value;

    if (!medication || !dosage || !frequency) {
        showErrorMessage('Por favor, preencha medicamento, dosagem e frequência');
        return;
    }

    const patient = patientsData.find(p => p.id === patientId);

    // Simula criação da receita
    setTimeout(() => {
        closeModal('prescriptionModal');
        showSuccessMessage(`Receita criada para ${patient.name}: ${medication} ${dosage}`);
    }, 500);
}

// Função para configurar eventos da barra de busca
function setupSearchBar() {
    const searchInput = document.querySelector('input[type="text"]');
    const searchButton = document.querySelector('.btn-small.btn-primary');

    if (searchInput && searchButton) {
        // Busca em tempo real enquanto digita
        searchInput.addEventListener('input', function () {
            searchPatients(this.value);
            renderPatients();
        });

        // Busca ao clicar no botão
        searchButton.addEventListener('click', function () {
            searchPatients(searchInput.value);
            renderPatients();
        });

        // Busca ao pressionar Enter
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchPatients(this.value);
                renderPatients();
            }
        });
    }
}

// Função para configurar botão "Novo Paciente"
function setupNewPatientButton() {
    const newPatientBtn = document.querySelector('.btn-small.btn-success');
    if (newPatientBtn && newPatientBtn.textContent.includes('Novo Paciente')) {
        newPatientBtn.addEventListener('click', function () {
            window.location.href = 'new-patient.html';
        });
    }
}

// Função para mostrar estatísticas rápidas
function showQuickStats() {
    const totalPatients = allPatients.length;
    const recentConsultations = allPatients.filter(patient => {
        const consultDate = new Date(patient.lastConsultation.split('/').reverse().join('-'));
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return consultDate >= oneWeekAgo;
    }).length;

    // Adiciona estatísticas no topo da página
    const header = document.querySelector('.header');
    if (header && !header.querySelector('.quick-stats')) {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'quick-stats';
        statsDiv.innerHTML = `
            <div style="display: flex; gap: 20px; margin-top: 10px; font-size: 14px; color: #666;">
                <span>📊 Total de pacientes: <strong>${totalPatients}</strong></span>
                <span>📅 Consultas recentes: <strong>${recentConsultations}</strong></span>
            </div>
        `;
        header.appendChild(statsDiv);
    }
}

// Função para adicionar funcionalidade de ordenação
function addSortingOptions() {
    const searchBar = document.querySelector('.content-area > div');
    if (searchBar && !searchBar.querySelector('.sort-options')) {
        const sortDiv = document.createElement('div');
        sortDiv.className = 'sort-options';
        sortDiv.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
                <span style="font-size: 14px; color: #666;">Ordenar por:</span>
                <select id="sortSelect" style="padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="name">Nome</option>
                    <option value="age">Idade</option>
                    <option value="lastConsultation">Última consulta</option>
                </select>
                <select id="sortOrder" style="padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="asc">Crescente</option>
                    <option value="desc">Decrescente</option>
                </select>
            </div>
        `;
        searchBar.appendChild(sortDiv);

        // Adiciona eventos de ordenação
        const sortSelect = document.getElementById('sortSelect');
        const sortOrder = document.getElementById('sortOrder');

        function sortPatients() {
            const sortBy = sortSelect.value;
            const order = sortOrder.value;

            filteredPatients.sort((a, b) => {
                let aValue, bValue;

                switch (sortBy) {
                    case 'name':
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                        break;
                    case 'age':
                        aValue = a.age;
                        bValue = b.age;
                        break;
                    case 'lastConsultation':
                        aValue = new Date(a.lastConsultation.split('/').reverse().join('-'));
                        bValue = new Date(b.lastConsultation.split('/').reverse().join('-'));
                        break;
                }

                if (order === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });

            renderPatients();
        }

        sortSelect.addEventListener('change', sortPatients);
        sortOrder.addEventListener('change', sortPatients);
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    // Configura funcionalidades básicas
    setupSearchBar();
    setupNewPatientButton();
    showQuickStats();
    addSortingOptions();

    // Renderiza a lista inicial de pacientes
    renderPatients();

    // Destaca paciente se especificado na URL
    highlightPatientFromURL();

    console.log('Sistema de pacientes inicializado com sucesso!');
    console.log(`Total de pacientes carregados: ${allPatients.length}`);
});