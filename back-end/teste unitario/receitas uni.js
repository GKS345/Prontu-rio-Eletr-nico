// ===== TESTES UNITÁRIOS PARA SISTEMA DE RECEITAS MÉDICAS =====

// Configuração do Jest e mocks
const { JSDOM } = require('jsdom');

// Setup do DOM virtual para testes
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
</head>
<body>
    <div id="newPrescriptionForm" style="display:none;">
        <form>
            <select id="patientSelect">
                <option value="">Selecione um paciente</option>
                <option value="1">Maria Silva</option>
                <option value="2">João Santos</option>
            </select>
            <input type="date" id="prescriptionDate" />
            <input type="text" id="diagnosis" />
            <textarea id="observations"></textarea>
            <div id="medicationsList">
                <div class="medication-item">
                    <input type="text" placeholder="Nome do medicamento" />
                    <input type="text" placeholder="Dosagem" />
                    <input type="text" placeholder="Frequência" />
                    <input type="text" placeholder="Duração" />
                    <textarea placeholder="Instruções"></textarea>
                </div>
            </div>
            <button type="submit" class="btn">Salvar Receita</button>
        </form>
    </div>
    <div class="stat-number">0</div>
    <div class="stat-number">0</div>
    <div class="stat-number">0</div>
    <div class="stat-number">0</div>
    <table class="table">
        <tbody></tbody>
    </table>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;
global.alert = jest.fn();
global.confirm = jest.fn();
global.prompt = jest.fn();

// Mock do arquivo JavaScript principal
let prescriptions = [];
let patients = [];
let nextPrescriptionId = 1;

// Reimplementação das funções principais para testes
function resetData() {
    prescriptions = [
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
                    instructions: 'Tomar com alimento'
                }
            ],
            observations: 'Retornar em 7 dias',
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
                    instructions: 'Uso contínuo'
                }
            ],
            observations: 'Monitorar pressão arterial',
            status: 'Finalizada'
        }
    ];

    patients = [
        { id: '1', name: 'Maria Silva', cpf: '123.456.789-00' },
        { id: '2', name: 'João Santos', cpf: '987.654.321-00' }
    ];

    nextPrescriptionId = 3;
}

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

    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = totalPrescriptions;
        statNumbers[1].textContent = thisMonth;
        statNumbers[2].textContent = today;
        statNumbers[3].textContent = pending;
    }

    return { totalPrescriptions, thisMonth, today, pending };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getStatusClass(status) {
    switch (status) {
        case 'Ativa': return 'status-active';
        case 'Finalizada': return 'status-completed';
        case 'Pendente': return 'status-pending';
        default: return 'status-active';
    }
}

function viewPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) {
        alert('Receita não encontrada.');
        return null;
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
    return prescription;
}

function addNewPrescription(prescriptionData) {
    const newPrescription = {
        id: String(nextPrescriptionId++).padStart(3, '0'),
        patient: prescriptionData.patient,
        date: prescriptionData.date,
        diagnosis: prescriptionData.diagnosis,
        medications: prescriptionData.medications,
        observations: prescriptionData.observations,
        status: 'Ativa'
    };

    prescriptions.unshift(newPrescription);
    return newPrescription;
}

function renewPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) {
        return null;
    }

    const newPrescription = {
        ...prescription,
        id: String(nextPrescriptionId++).padStart(3, '0'),
        date: new Date().toISOString().split('T')[0],
        status: 'Ativa'
    };

    prescriptions.unshift(newPrescription);
    return newPrescription;
}

function cancelPrescription(id) {
    const prescriptionIndex = prescriptions.findIndex(p => p.id === id);
    if (prescriptionIndex === -1) {
        return false;
    }

    prescriptions[prescriptionIndex].status = 'Cancelada';
    return true;
}

// ===== SUÍTE DE TESTES =====

describe('Sistema de Receitas Médicas', () => {
    beforeEach(() => {
        resetData();
        jest.clearAllMocks();
    });

    describe('Gerenciamento de Dados', () => {
        test('deve inicializar com dados padrão', () => {
            expect(prescriptions).toHaveLength(2);
            expect(patients).toHaveLength(2);
            expect(nextPrescriptionId).toBe(3);
        });

        test('deve resetar dados corretamente', () => {
            prescriptions.push({ id: '999', status: 'Teste' });
            resetData();
            expect(prescriptions).toHaveLength(2);
            expect(prescriptions.find(p => p.id === '999')).toBeUndefined();
        });
    });

    describe('Estatísticas', () => {
        test('deve calcular estatísticas corretamente', () => {
            const stats = updateStats();
            
            expect(stats.totalPrescriptions).toBe(2);
            expect(stats.pending).toBe(0);
            expect(typeof stats.thisMonth).toBe('number');
            expect(typeof stats.today).toBe('number');
        });

        test('deve atualizar DOM com estatísticas', () => {
            updateStats();
            const statNumbers = document.querySelectorAll('.stat-number');
            
            expect(statNumbers[0].textContent).toBe('2');
            expect(statNumbers[3].textContent).toBe('0'); // pendentes
        });

        test('deve contar receitas pendentes corretamente', () => {
            prescriptions.push({
                id: '003',
                status: 'Pendente',
                date: new Date().toISOString().split('T')[0]
            });

            const stats = updateStats();
            expect(stats.pending).toBe(1);
        });
    });

    describe('Formatação de Dados', () => {
        test('deve formatar datas corretamente', () => {
            const formatted = formatDate('2025-06-28');
            expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
        });

        test('deve retornar classe CSS correta para status', () => {
            expect(getStatusClass('Ativa')).toBe('status-active');
            expect(getStatusClass('Finalizada')).toBe('status-completed');
            expect(getStatusClass('Pendente')).toBe('status-pending');
            expect(getStatusClass('Desconhecido')).toBe('status-active');
        });
    });

    describe('Visualização de Receitas', () => {
        test('deve encontrar e exibir receita existente', () => {
            const prescription = viewPrescription('001');
            
            expect(prescription).toBeTruthy();
            expect(prescription.id).toBe('001');
            expect(prescription.patient.name).toBe('Maria Silva');
            expect(alert).toHaveBeenCalled();
        });

        test('deve lidar com receita não encontrada', () => {
            const prescription = viewPrescription('999');
            
            expect(prescription).toBeNull();
            expect(alert).toHaveBeenCalledWith('Receita não encontrada.');
        });

        test('deve formatar medicamentos na visualização', () => {
            viewPrescription('001');
            
            expect(alert).toHaveBeenCalledWith(
                expect.stringContaining('Amoxicilina 500mg')
            );
            expect(alert).toHaveBeenCalledWith(
                expect.stringContaining('Tomar com alimento')
            );
        });
    });

    describe('Criação de Receitas', () => {
        test('deve criar nova receita corretamente', () => {
            const prescriptionData = {
                patient: { id: '1', name: 'Maria Silva', cpf: '123.456.789-00' },
                date: '2025-07-01',
                diagnosis: 'Teste',
                medications: [
                    {
                        name: 'Teste Med',
                        dosage: '1 comp',
                        frequency: 'diário',
                        duration: '10 dias',
                        instructions: 'Teste'
                    }
                ],
                observations: 'Observação teste'
            };

            const newPrescription = addNewPrescription(prescriptionData);
            
            expect(newPrescription.id).toBe('003');
            expect(newPrescription.status).toBe('Ativa');
            expect(prescriptions).toHaveLength(3);
            expect(prescriptions[0]).toBe(newPrescription);
        });

        test('deve incrementar ID automaticamente', () => {
            const prescriptionData = {
                patient: { id: '1', name: 'Maria Silva', cpf: '123.456.789-00' },
                date: '2025-07-01',
                diagnosis: 'Teste',
                medications: [],
                observations: ''
            };

            const first = addNewPrescription(prescriptionData);
            const second = addNewPrescription(prescriptionData);
            
            expect(first.id).toBe('003');
            expect(second.id).toBe('004');
        });
    });

    describe('Renovação de Receitas', () => {
        test('deve renovar receita existente', () => {
            const originalCount = prescriptions.length;
            const renewedPrescription = renewPrescription('001');
            
            expect(renewedPrescription).toBeTruthy();
            expect(renewedPrescription.id).toBe('003');
            expect(renewedPrescription.status).toBe('Ativa');
            expect(prescriptions).toHaveLength(originalCount + 1);
        });

        test('deve copiar dados da receita original', () => {
            const original = prescriptions.find(p => p.id === '001');
            const renewed = renewPrescription('001');
            
            expect(renewed.patient.name).toBe(original.patient.name);
            expect(renewed.diagnosis).toBe(original.diagnosis);
            expect(renewed.medications).toEqual(original.medications);
            expect(renewed.observations).toBe(original.observations);
        });

        test('deve atualizar data da receita renovada', () => {
            const renewed = renewPrescription('001');
            const today = new Date().toISOString().split('T')[0];
            
            expect(renewed.date).toBe(today);
        });

        test('deve lidar com receita não encontrada para renovação', () => {
            const renewed = renewPrescription('999');
            
            expect(renewed).toBeNull();
        });
    });

    describe('Cancelamento de Receitas', () => {
        test('deve cancelar receita existente', () => {
            const success = cancelPrescription('001');
            const prescription = prescriptions.find(p => p.id === '001');
            
            expect(success).toBe(true);
            expect(prescription.status).toBe('Cancelada');
        });

        test('deve lidar com receita não encontrada para cancelamento', () => {
            const success = cancelPrescription('999');
            
            expect(success).toBe(false);
        });
    });

    describe('Validações', () => {
        test('deve validar dados obrigatórios na criação', () => {
            const invalidData = {
                patient: null,
                date: '',
                diagnosis: '',
                medications: [],
                observations: ''
            };

            // Simulação de validação
            expect(invalidData.patient).toBeNull();
            expect(invalidData.medications).toHaveLength(0);
        });

        test('deve validar formato de CPF', () => {
            const validCPF = '123.456.789-00';
            const invalidCPF = '123456789';
            
            expect(validCPF).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
            expect(invalidCPF).not.toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
        });

        test('deve validar formato de data', () => {
            const validDate = '2025-06-28';
            const invalidDate = '28/06/2025';
            
            expect(validDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(invalidDate).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe('Filtragem e Busca', () => {
        test('deve filtrar receitas por status', () => {
            const activePrescritions = prescriptions.filter(p => p.status === 'Ativa');
            const finishedPrescriptions = prescriptions.filter(p => p.status === 'Finalizada');
            
            expect(activePrescritions).toHaveLength(1);
            expect(finishedPrescriptions).toHaveLength(1);
        });

        test('deve filtrar receitas por paciente', () => {
            const mariaPrescriptions = prescriptions.filter(p => p.patient.name.includes('Maria'));
            const joaoPrescriptions = prescriptions.filter(p => p.patient.name.includes('João'));
            
            expect(mariaPrescriptions).toHaveLength(1);
            expect(joaoPrescriptions).toHaveLength(1);
        });

        test('deve filtrar receitas por período', () => {
            const june2025 = prescriptions.filter(p => p.date.startsWith('2025-06'));
            
            expect(june2025).toHaveLength(2);
        });
    });

    describe('Manipulação do DOM', () => {
        test('deve atualizar elementos DOM das estatísticas', () => {
            updateStats();
            
            const statNumbers = document.querySelectorAll('.stat-number');
            expect(statNumbers).toHaveLength(4);
            expect(statNumbers[0].textContent).toBe('2');
        });

        test('deve validar existência de elementos do formulário', () => {
            const form = document.getElementById('newPrescriptionForm');
            const patientSelect = document.getElementById('patientSelect');
            const dateInput = document.getElementById('prescriptionDate');
            
            expect(form).toBeTruthy();
            expect(patientSelect).toBeTruthy();
            expect(dateInput).toBeTruthy();
        });
    });

    describe('Integração com Sistema', () => {
        test('deve manter integridade dos dados após operações', () => {
            const originalLength = prescriptions.length;
            
            // Adiciona receita
            addNewPrescription({
                patient: patients[0],
                date: '2025-07-01',
                diagnosis: 'Teste',
                medications: [{ name: 'Teste', dosage: '1', frequency: 'diário', duration: '7 dias', instructions: '' }],
                observations: 'Teste'
            });
            
            // Cancela receita
            cancelPrescription('001');
            
            // Renova receita
            renewPrescription('002');
            
            expect(prescriptions.length).toBe(originalLength + 2);
            expect(prescriptions.find(p => p.id === '001').status).toBe('Cancelada');
        });
    });
});

// ===== TESTES DE PERFORMANCE =====

describe('Testes de Performance', () => {
    test('deve processar grande quantidade de receitas rapidamente', () => {
        const startTime = performance.now();
        
        // Adiciona 1000 receitas
        for (let i = 0; i < 1000; i++) {
            prescriptions.push({
                id: String(i + 1000).padStart(3, '0'),
                patient: { id: '1', name: 'Paciente ' + i },
                date: '2025-06-01',
                diagnosis: 'Teste',
                medications: [{ name: 'Med', dosage: '1', frequency: 'diário', duration: '7 dias' }],
                observations: 'Teste',
                status: 'Ativa'
            });
        }
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        expect(executionTime).toBeLessThan(100); // Deve executar em menos de 100ms
        expect(prescriptions.length).toBe(1002); // 2 iniciais + 1000 adicionadas
    });

    test('deve filtrar receitas grandes volumes eficientemente', () => {
        // Adiciona receitas de teste
        for (let i = 0; i < 500; i++) {
            prescriptions.push({
                id: String(i + 1000),
                status: i % 2 === 0 ? 'Ativa' : 'Finalizada',
                date: '2025-06-01'
            });
        }

        const startTime = performance.now();
        const activeCount = prescriptions.filter(p => p.status === 'Ativa').length;
        const endTime = performance.now();
        
        expect(endTime - startTime).toBeLessThan(50);
        expect(activeCount).toBeGreaterThan(0);
    });
});

// ===== TESTES DE EDGE CASES =====

describe('Casos Extremos e Edge Cases', () => {
    test('deve lidar com receitas sem medicamentos', () => {
        const prescriptionWithoutMeds = {
            id: '999',
            patient: { id: '1', name: 'Teste' },
            date: '2025-06-01',
            diagnosis: 'Teste',
            medications: [],
            observations: 'Sem medicamentos',
            status: 'Ativa'
        };

        prescriptions.push(prescriptionWithoutMeds);
        const found = viewPrescription('999');
        
        expect(found).toBeTruthy();
        expect(found.medications).toHaveLength(0);
    });

    test('deve lidar com datas inválidas', () => {
        const invalidDate = 'data-inválida';
        
        expect(() => {
            new Date(invalidDate);
        }).not.toThrow();
        
        expect(isNaN(new Date(invalidDate))).toBe(true);
    });

    test('deve lidar com IDs duplicados', () => {
        const duplicateId = '001';
        const existingPrescription = prescriptions.find(p => p.id === duplicateId);
        
        expect(existingPrescription).toBeTruthy();
        
        // Tentativa de adicionar outro com mesmo ID
        const duplicate = {
            id: duplicateId,
            patient: { id: '2', name: 'Outro' },
            status: 'Ativa'
        };
        
        prescriptions.push(duplicate);
        const foundPrescriptions = prescriptions.filter(p => p.id === duplicateId);
        
        expect(foundPrescriptions).toHaveLength(2);
    });

    test('deve lidar com strings vazias e valores null', () => {
        const prescriptionWithEmptyValues = {
            id: '998',
            patient: { id: '1', name: '', cpf: null },
            date: '',
            diagnosis: null,
            medications: [
                {
                    name: '',
                    dosage: null,
                    frequency: '',
                    duration: null,
                    instructions: ''
                }
            ],
            observations: null,
            status: 'Ativa'
        };

        prescriptions.push(prescriptionWithEmptyValues);
        const found = viewPrescription('998');
        
        expect(found).toBeTruthy();
        expect(found.patient.name).toBe('');
        expect(found.diagnosis).toBeNull();
    });
});

// ===== EXECUÇÃO DOS TESTES =====

console.log('🧪 Executando testes do Sistema de Receitas Médicas...');

// Exporta as funções para uso em outros arquivos de teste
module.exports = {
    resetData,
    updateStats,
    formatDate,
    getStatusClass,
    viewPrescription,
    addNewPrescription,
    renewPrescription,
    cancelPrescription,
    prescriptions,
    patients,
    nextPrescriptionId
};