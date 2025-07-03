// Sistema de Receitas Médicas - JavaScript Completo
// Dados simulados em memória

let prescriptions = [
    {
        id: '001',
        patient: { id: '1', name: 'Maria Silva', cpf: '123.456.789-00' },
        date: '2025-06-28',
        diagnosis: 'Infecção respiratória alta',
        medications: [
            {
                name: 'Amoxicilina 500mg',
                dosage: '1 cápsula',
                frequency: 'a cada 8 horas',
                duration: '7 dias',
                instructions: 'Tomar com alimento para reduzir irritação gástrica'
            },
            {
                name: 'Dipirona 500mg',
                dosage: '1 comprimido',
                frequency: 'a cada 6 horas se dor ou febre',
                duration: 'conforme necessário',
                instructions: 'Não exceder 4 comprimidos por dia'
            }
        ],
        observations: 'Retornar em 7 dias para reavaliação. Suspender medicação em caso de reações alérgicas.',
        status: 'Ativa'
    },
    {
        id: '002',
        patient: { id: '2', name: 'João Santos', cpf: '987.654.321-00' },
        date: '2025-06-26',
        diagnosis: 'Hipertensão arterial',
        medications: [
            {
                name: 'Losartana 50mg',
                dosage: '1 comprimido',
                frequency: 'pela manhã',
                duration: 'uso contínuo',
                instructions: 'Uso contínuo - não interromper sem orientação médica'
            },
            {
                name: 'Hidroclorotiazida 25mg',
                dosage: '1 comprimido',
                frequency: 'pela manhã',
                duration: 'uso contínuo',
                instructions: 'Tomar junto com a Losartana'
            }
        ],
        observations: 'Monitorar pressão arterial diariamente. Manter dieta hipossódica e prática regular de exercícios.',
        status: 'Finalizada'
    },
    {
        id: '003',
        patient: { id: '3', name: 'Ana Costa', cpf: '456.789.123-00' },
        date: '2025-06-25',
        diagnosis: 'Gastrite aguda',
        medications: [
            {
                name: 'Omeprazol 20mg',
                dosage: '1 cápsula',
                frequency: 'pela manhã em jejum',
                duration: '30 dias',
                instructions: 'Tomar 30 minutos antes do café da manhã'
            },
            {
                name: 'Simeticona 40mg',
                dosage: '1 comprimido',
                frequency: 'após as refeições',
                duration: '15 dias',
                instructions: 'Para alívio de gases e desconforto abdominal'
            }
        ],
        observations: 'Evitar alimentos irritantes (café, refrigerantes, frituras). Fazer refeições menores e mais frequentes.',
        status: 'Pendente'
    }
];

let patients = [
    { id: '1', name: 'Maria Silva', cpf: '123.456.789-00' },
    { id: '2', name: 'João Santos', cpf: '987.654.321-00' },
    { id: '3', name: 'Ana Costa', cpf: '456.789.123-00' }
];

let nextPrescriptionId = 4;

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    updateStats();
    renderPrescriptions();
    updateHistoryTable();

    // Definir data atual no formulário
    const dateInput = document.getElementById('prescriptionDate');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    // Event listener para o formulário
    const form = document.querySelector('#newPrescriptionForm form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// Função para atualizar estatísticas
function updateStats() {
    const totalPrescriptions = prescriptions.length;
    const thisMonth = prescriptions.filter(p => {
        const prescDate = new Date(p.date);
        const now = new Date();
        return prescDate.getMonth() === now.getMonth() && prescDate.getFullYear() === now.getFullYear();
    }).length;

    const today = prescriptions.filter(p => {
        const prescDate = new Date(p.date);
        const now = new Date();
        return prescDate.toDateString() === now.toDateString();
    }).length;

    const pending = prescriptions.filter(p => p.status === 'Pendente').length;

    // Atualizar DOM
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = totalPrescriptions;
        statNumbers[1].textContent = thisMonth;
        statNumbers[2].textContent = today;
        statNumbers[3].textContent = pending;
    }
}

// Função para mostrar formulário de nova receita
function showNewPrescriptionForm() {
    const form = document.getElementById('newPrescriptionForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });

        // Limpar formulário
        clearForm();
    }
}

// Função para esconder formulário
function hideNewPrescriptionForm() {
    const form = document.getElementById('newPrescriptionForm');
    if (form) {
        form.style.display = 'none';
    }
}

// Função para limpar formulário
function clearForm() {
    const form = document.querySelector('#newPrescriptionForm form');
    if (form) {
        form.reset();
        document.getElementById('prescriptionDate').valueAsDate = new Date();

        // Resetar lista de medicamentos para apenas um item
        const medicationsList = document.getElementById('medicationsList');
        const firstMedication = medicationsList.querySelector('.medication-item');
        medicationsList.innerHTML = '';

        // Clonar o primeiro medicamento limpo
        const cleanMedication = firstMedication.cloneNode(true);
        const inputs = cleanMedication.querySelectorAll('input, textarea');
        inputs.forEach(input => input.value = '');

        // Remover botão de remover se existir
        const removeBtn = cleanMedication.querySelector('.btn-danger');
        if (removeBtn) {
            removeBtn.remove();
        }

        medicationsList.appendChild(cleanMedication);
    }
}

// Função para adicionar medicamento
function addMedication() {
    const medicationsList = document.getElementById('medicationsList');
    const firstMedication = medicationsList.querySelector('.medication-item');
    const newMedication = firstMedication.cloneNode(true);

    // Limpar os campos do novo medicamento
    const inputs = newMedication.querySelectorAll('input, textarea');
    inputs.forEach(input => input.value = '');

    // Adicionar botão de remover
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-small btn-danger';
    removeBtn.textContent = '🗑️ Remover';
    removeBtn.style.marginTop = '10px';
    removeBtn.onclick = function () {
        newMedication.remove();
    };

    newMedication.appendChild(removeBtn);
    medicationsList.appendChild(newMedication);
}

// Função para lidar com envio do formulário
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const patientId = document.getElementById('patientSelect').value;
    const date = document.getElementById('prescriptionDate').value;
    const diagnosis = document.getElementById('diagnosis').value;
    const observations = document.getElementById('observations').value;

    if (!patientId) {
        alert('Por favor, selecione um paciente.');
        return;
    }

    const patient = patients.find(p => p.id === patientId);

    // Coletar medicamentos
    const medications = [];
    const medicationItems = document.querySelectorAll('.medication-item');

    medicationItems.forEach(item => {
        const inputs = item.querySelectorAll('input');
        const textarea = item.querySelector('textarea');

        if (inputs[0].value.trim()) {
            medications.push({
                name: inputs[0].value,
                dosage: inputs[1].value,
                frequency: inputs[2].value,
                duration: inputs[3].value,
                instructions: textarea.value
            });
        }
    });

    if (medications.length === 0) {
        alert('Por favor, adicione pelo menos um medicamento.');
        return;
    }

    // Criar nova receita
    const newPrescription = {
        id: String(nextPrescriptionId++).padStart(3, '0'),
        patient: patient,
        date: date,
        diagnosis: diagnosis,
        medications: medications,
        observations: observations,
        status: 'Ativa'
    };

    prescriptions.unshift(newPrescription);

    // Atualizar interface
    updateStats();
    renderPrescriptions();
    updateHistoryTable();
    hideNewPrescriptionForm();

    alert('Receita salva com sucesso!');
}

// Função para renderizar receitas
function renderPrescriptions() {
    // Esta função atualizaria dinamicamente as receitas exibidas
    // Como o HTML já tem as receitas hardcoded, manteremos a funcionalidade básica
}

// Função para atualizar tabela de histórico
function updateHistoryTable() {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    prescriptions.forEach(prescription => {
        const row = document.createElement('tr');

        const medicationNames = prescription.medications.map(m => m.name.split(' ')[0]).join(', ');
        const statusClass = getStatusClass(prescription.status);

        row.innerHTML = `
            <td>#${prescription.id}</td>
            <td>${prescription.patient.name}</td>
            <td>${formatDate(prescription.date)}</td>
            <td>${medicationNames}</td>
            <td><span class="status-badge ${statusClass}">${prescription.status}</span></td>
            <td>
                <button class="btn-small btn-primary" onclick="viewPrescription('${prescription.id}')">Ver</button>
                ${prescription.status !== 'Finalizada' ?
                `<button class="btn-small btn-warning" onclick="editPrescription('${prescription.id}')">Editar</button>` :
                `<button class="btn-small btn-success" onclick="renewPrescription('${prescription.id}')">Renovar</button>`
            }
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Função para obter classe do status
function getStatusClass(status) {
    switch (status) {
        case 'Ativa': return 'status-active';
        case 'Finalizada': return 'status-completed';
        case 'Pendente': return 'status-pending';
        default: return 'status-active';
    }
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para visualizar receita
function viewPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) {
        alert('Receita não encontrada.');
        return;
    }

    let medicationsText = prescription.medications.map(med =>
        `• ${med.name}\n  Dosagem: ${med.dosage} ${med.frequency}\n  Duração: ${med.duration}\n  ${med.instructions ? 'Instruções: ' + med.instructions : ''}`
    ).join('\n\n');

    const details = `
RECEITA MÉDICA #${prescription.id}

Paciente: ${prescription.patient.name}
CPF: ${prescription.patient.cpf}
Data: ${formatDate(prescription.date)}
Status: ${prescription.status}

Diagnóstico: ${prescription.diagnosis}

MEDICAMENTOS:
${medicationsText}

OBSERVAÇÕES:
${prescription.observations}
    `;

    alert(details);
}

// Função para imprimir receita
function printPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) {
        alert('Receita não encontrada.');
        return;
    }

    // Simulação de impressão
    const printContent = `
        <html>
        <head>
            <title>Receita #${id}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .patient-info { margin-bottom: 20px; }
                .medication { margin-bottom: 15px; border: 1px solid #ddd; padding: 10px; }
                .observations { margin-top: 20px; padding: 10px; background: #f5f5f5; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>RECEITA MÉDICA</h1>
                <p>Dr. João Silva - CRM: 12345-SC</p>
            </div>
            
            <div class="patient-info">
                <strong>Paciente:</strong> ${prescription.patient.name}<br>
                <strong>CPF:</strong> ${prescription.patient.cpf}<br>
                <strong>Data:</strong> ${formatDate(prescription.date)}<br>
                <strong>Diagnóstico:</strong> ${prescription.diagnosis}
            </div>
            
            <h3>MEDICAMENTOS PRESCRITOS:</h3>
            ${prescription.medications.map(med => `
                <div class="medication">
                    <strong>${med.name}</strong><br>
                    ${med.dosage} ${med.frequency}<br>
                    Duração: ${med.duration}<br>
                    ${med.instructions ? '<em>' + med.instructions + '</em>' : ''}
                </div>
            `).join('')}
            
            <div class="observations">
                <strong>Observações:</strong><br>
                ${prescription.observations}
            </div>
            
            <div style="margin-top: 50px;">
                <p>_________________________________</p>
                <p>Dr. João Silva</p>
                <p>CRM: 12345-SC</p>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();

    alert(`Receita #${id} enviada para impressão.`);
}

// Função para enviar receita por email
function emailPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) {
        alert('Receita não encontrada.');
        return;
    }

    const email = prompt(`Digite o email do paciente ${prescription.patient.name}:`);
    if (email && email.includes('@')) {
        // Simulação de envio por email
        setTimeout(() => {
            alert(`Receita #${id} enviada com sucesso para ${email}`);
        }, 1000);

        alert(`Enviando receita #${id} para ${email}...`);
    } else if (email !== null) {
        alert('Email inválido. Por favor, digite um email válido.');
    }
}

// Função para editar receita
function editPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) {
        alert('Receita não encontrada.');
        return;
    }

    if (prescription.status === 'Finalizada') {
        alert('Não é possível editar receitas finalizadas.');
        return;
    }

    // Preencher formulário com dados da receita
    showNewPrescriptionForm();

    setTimeout(() => {
        document.getElementById('patientSelect').value = prescription.patient.id;
        document.getElementById('prescriptionDate').value = prescription.date;
        document.getElementById('diagnosis').value = prescription.diagnosis;
        document.getElementById('observations').value = prescription.observations;

        // Limpar medicamentos atuais
        const medicationsList = document.getElementById('medicationsList');
        medicationsList.innerHTML = '';

        // Adicionar medicamentos da receita
        prescription.medications.forEach((med, index) => {
            if (index === 0) {
                // Primeiro medicamento
                const medicationItem = document.createElement('div');
                medicationItem.className = 'medication-item';
                medicationItem.innerHTML = `
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Nome do Medicamento:</label>
                            <input type="text" value="${med.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Dosagem:</label>
                            <input type="text" value="${med.dosage}" required>
                        </div>
                        <div class="form-group">
                            <label>Frequência:</label>
                            <input type="text" value="${med.frequency}" required>
                        </div>
                        <div class="form-group">
                            <label>Duração:</label>
                            <input type="text" value="${med.duration}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Instruções Especiais:</label>
                        <textarea rows="2">${med.instructions}</textarea>
                    </div>
                `;
                medicationsList.appendChild(medicationItem);
            } else {
                // Medicamentos adicionais
                addMedication();
                const lastMedication = medicationsList.lastElementChild;
                const inputs = lastMedication.querySelectorAll('input');
                const textarea = lastMedication.querySelector('textarea');

                inputs[0].value = med.name;
                inputs[1].value = med.dosage;
                inputs[2].value = med.frequency;
                inputs[3].value = med.duration;
                textarea.value = med.instructions;
            }
        });

        // Mudar o botão de salvar para atualizar
        const submitBtn = document.querySelector('#newPrescriptionForm .btn[type="submit"]');
        submitBtn.textContent = '✏️ Atualizar Receita';
        submitBtn.onclick = function (e) {
            e.preventDefault();
            updatePrescription(id);
        };

    }, 100);
}

// Função para atualizar receita
function updatePrescription(id) {
    const prescriptionIndex = prescriptions.findIndex(p => p.id === id);
    if (prescriptionIndex === -1) {
        alert('Receita não encontrada.');
        return;
    }

    const patientId = document.getElementById('patientSelect').value;
    const date = document.getElementById('prescriptionDate').value;
    const diagnosis = document.getElementById('diagnosis').value;
    const observations = document.getElementById('observations').value;

    if (!patientId) {
        alert('Por favor, selecione um paciente.');
        return;
    }

    const patient = patients.find(p => p.id === patientId);

    // Coletar medicamentos
    const medications = [];
    const medicationItems = document.querySelectorAll('.medication-item');

    medicationItems.forEach(item => {
        const inputs = item.querySelectorAll('input');
        const textarea = item.querySelector('textarea');

        if (inputs[0].value.trim()) {
            medications.push({
                name: inputs[0].value,
                dosage: inputs[1].value,
                frequency: inputs[2].value,
                duration: inputs[3].value,
                instructions: textarea.value
            });
        }
    });

    if (medications.length === 0) {
        alert('Por favor, adicione pelo menos um medicamento.');
        return;
    }

    // Atualizar receita
    prescriptions[prescriptionIndex] = {
        ...prescriptions[prescriptionIndex],
        patient: patient,
        date: date,
        diagnosis: diagnosis,
        medications: medications,
        observations: observations
    };

    // Restaurar botão original
    const submitBtn = document.querySelector('#newPrescriptionForm .btn[type="submit"]');
    submitBtn.textContent = '💾 Salvar Receita';
    submitBtn.onclick = null;

    // Atualizar interface
    updateStats();
    renderPrescriptions();
    updateHistoryTable();
    hideNewPrescriptionForm();

    alert('Receita atualizada com sucesso!');
}

// Função para cancelar receita
function cancelPrescription(id) {
    if (confirm(`Tem certeza que deseja cancelar a receita #${id}?`)) {
        const prescriptionIndex = prescriptions.findIndex(p => p.id === id);
        if (prescriptionIndex !== -1) {
            prescriptions[prescriptionIndex].status = 'Cancelada';
            updateStats();
            updateHistoryTable();
            alert(`Receita #${id} cancelada com sucesso.`);
        } else {
            alert('Receita não encontrada.');
        }
    }
}

// Função para renovar receita
function renewPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) {
        alert('Receita não encontrada.');
        return;
    }

    if (confirm(`Deseja renovar a receita #${id} para ${prescription.patient.name}?`)) {
        // Criar nova receita baseada na anterior
        const newPrescription = {
            ...prescription,
            id: String(nextPrescriptionId++).padStart(3, '0'),
            date: new Date().toISOString().split('T')[0],
            status: 'Ativa'
        };

        prescriptions.unshift(newPrescription);

        updateStats();
        renderPrescriptions();
        updateHistoryTable();

        alert(`Receita renovada com sucesso! Nova receita: #${newPrescription.id}`);
    }
}

// Função para imprimir todas as receitas
function printAllPrescriptions() {
    const activePrescriptions = prescriptions.filter(p => p.status === 'Ativa');

    if (activePrescriptions.length === 0) {
        alert('Não há receitas ativas para imprimir.');
        return;
    }

    if (confirm(`Imprimir ${activePrescriptions.length} receita(s) ativa(s)?`)) {
        activePrescriptions.forEach(prescription => {
            setTimeout(() => {
                printPrescription(prescription.id);
            }, 500);
        });

        alert(`Enviando ${activePrescriptions.length} receitas para impressão...`);
    }
}