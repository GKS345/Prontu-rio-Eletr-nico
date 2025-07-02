// ===== SISTEMA DE NAVEGAÇÃO ENTRE TELAS =====
function showScreen(screenId) {
    // Esconde todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    // Mostra a tela solicitada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Se for dashboard, garante que mostra a visão geral
    if (screenId === 'dashboardScreen') {
        setTimeout(() => showDashboardContent('overview'), 100);
    }

    // Limpa campos de formulário se saindo do sistema
    if (screenId === 'loginScreen') {
        clearAllForms();
    }
}

// ===== SISTEMA DE NAVEGAÇÃO DO DASHBOARD =====
function showDashboardContent(contentType) {
    // Remove active de todos os links do menu
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => link.classList.remove('active'));

    // Adiciona active ao link correto baseado no contentType
    const activeLink = document.querySelector(`[onclick="showDashboardContent('${contentType}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Esconde todo o conteúdo existente
    const contents = ['overviewContent', 'patientsContent', 'newPatientContent', 'patientHistoryContent'];
    contents.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });

    // Atualiza título da página e mostra conteúdo correspondente
    const pageTitle = document.getElementById('pageTitle');
    const contentArea = document.getElementById('contentArea');

    switch (contentType) {
        case 'overview':
            pageTitle.textContent = 'Visão Geral';
            document.getElementById('overviewContent').style.display = 'block';
            updateDashboardStats();
            break;

        case 'patients':
            pageTitle.textContent = 'Pacientes';
            document.getElementById('patientsContent').style.display = 'block';
            break;

        case 'newPatient':
            pageTitle.textContent = 'Novo Paciente';
            document.getElementById('newPatientContent').style.display = 'block';
            // Limpa o formulário quando abre
            document.getElementById('patientForm').reset();
            break;

        case 'appointments':
            pageTitle.textContent = 'Consultas';
            showAppointmentsContent();
            break;

        case 'exams':
            pageTitle.textContent = 'Exames';
            showExamsContent();
            break;

        case 'prescriptions':
            pageTitle.textContent = 'Receitas';
            showPrescriptionsContent();
            break;

        case 'reports':
            pageTitle.textContent = 'Relatórios';
            showReportsContent();
            break;
    }
}

// ===== CONTEÚDOS ESPECÍFICOS PARA CADA SEÇÃO =====
function showAppointmentsContent() {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button class="btn-small btn-success" onclick="openNewAppointmentModal()">Nova Consulta</button>
            <button class="btn-small btn-primary" onclick="refreshAppointments()">Atualizar</button>
        </div>
        
        <h3>Consultas Agendadas</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Data/Hora</th>
                    <th>Paciente</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>26/06/2025 09:00</td>
                    <td>Maria Santos</td>
                    <td>Consulta</td>
                    <td><span class="status-badge status-active">Confirmada</span></td>
                    <td>
                        <button class="btn-small btn-primary" onclick="viewAppointment(1)">Ver</button>
                        <button class="btn-small btn-warning" onclick="editAppointment(1)">Editar</button>
                    </td>
                </tr>
                <tr>
                    <td>26/06/2025 10:30</td>
                    <td>José Oliveira</td>
                    <td>Retorno</td>
                    <td><span class="status-badge status-pending">Aguardando</span></td>
                    <td>
                        <button class="btn-small btn-primary" onclick="viewAppointment(2)">Ver</button>
                        <button class="btn-small btn-warning" onclick="editAppointment(2)">Editar</button>
                    </td>
                </tr>
                <tr>
                    <td>27/06/2025 14:00</td>
                    <td>Ana Costa</td>
                    <td>Consulta</td>
                    <td><span class="status-badge status-active">Confirmada</span></td>
                    <td>
                        <button class="btn-small btn-primary" onclick="viewAppointment(3)">Ver</button>
                        <button class="btn-small btn-warning" onclick="editAppointment(3)">Editar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function showExamsContent() {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button class="btn-small btn-success" onclick="requestNewExam()">Solicitar Exame</button>
            <button class="btn-small btn-primary" onclick="refreshExams()">Atualizar</button>
        </div>
        
        <h3>Exames Solicitados</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Data Solicitação</th>
                    <th>Paciente</th>
                    <th>Tipo de Exame</th>
                    <th>Status</th>
                    <th>Resultado</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>25/06/2025</td>
                    <td>Maria Santos</td>
                    <td>Hemograma Completo</td>
                    <td><span class="status-badge status-active">Concluído</span></td>
                    <td>✅ Disponível</td>
                    <td>
                        <button class="btn-small btn-primary" onclick="viewExamResult(1)">Ver Resultado</button>
                    </td>
                </tr>
                <tr>
                    <td>24/06/2025</td>
                    <td>José Oliveira</td>
                    <td>Radiografia Tórax</td>
                    <td><span class="status-badge status-pending">Processando</span></td>
                    <td>⏳ Aguardando</td>
                    <td>
                        <button class="btn-small btn-warning" onclick="followExam(2)">Acompanhar</button>
                    </td>
                </tr>
                <tr>
                    <td>23/06/2025</td>
                    <td>Ana Costa</td>
                    <td>Ultrassom</td>
                    <td><span class="status-badge status-active">Concluído</span></td>
                    <td>✅ Disponível</td>
                    <td>
                        <button class="btn-small btn-primary" onclick="viewExamResult(3)">Ver Resultado</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function showPrescriptionsContent() {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button class="btn-small btn-success" onclick="createPrescription()">Nova Receita</button>
            <button class="btn-small btn-primary" onclick="refreshPrescriptions()">Atualizar</button>
        </div>
        
        <h3>Receitas Emitidas</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Paciente</th>
                    <th>Medicamentos</th>
                    <th>Validade</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>26/06/2025</td>
                    <td>Maria Santos</td>
                    <td>Losartana 50mg</td>
                    <td>26/12/2025</td>
                    <td><span class="status-badge status-active">Ativa</span></td>
                    <td>
                        <button class="btn-small btn-primary" onclick="viewPrescription(1)">Ver</button>
                        <button class="btn-small btn-warning" onclick="printPrescription(1)">Imprimir</button>
                    </td>
                </tr>
                <tr>
                    <td>25/06/2025</td>
                    <td>José Oliveira</td>
                    <td>Omeprazol 20mg, Sinvastatina 20mg</td>
                    <td>25/12/2025</td>
                    <td><span class="status-badge status-active">Ativa</span></td>
                    <td>
                        <button class="btn-small btn-primary" onclick="viewPrescription(2)">Ver</button>
                        <button class="btn-small btn-warning" onclick="printPrescription(2)">Imprimir</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function showReportsContent() {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div class="stats-grid" style="margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-number">127</div>
                <div class="stat-label">Total de Pacientes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">456</div>
                <div class="stat-label">Consultas Este Mês</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">89</div>
                <div class="stat-label">Exames Realizados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">234</div>
                <div class="stat-label">Receitas Emitidas</div>
            </div>
        </div>
        
        <h3>Relatórios Disponíveis</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            <div class="patient-card">
                <div class="patient-name">📊 Relatório Mensal</div>
                <div class="patient-info">Estatísticas completas do mês atual</div>
                <div class="patient-actions">
                    <button class="btn-small btn-primary" onclick="generateReport('monthly')">Gerar</button>
                </div>
            </div>
            
            <div class="patient-card">
                <div class="patient-name">📈 Relatório de Pacientes</div>
                <div class="patient-info">Lista completa de pacientes ativos</div>
                <div class="patient-actions">
                    <button class="btn-small btn-primary" onclick="generateReport('patients')">Gerar</button>
                </div>
            </div>
            
            <div class="patient-card">
                <div class="patient-name">💊 Relatório de Medicamentos</div>
                <div class="patient-info">Medicamentos mais prescritos</div>
                <div class="patient-actions">
                    <button class="btn-small btn-primary" onclick="generateReport('medications')">Gerar</button>
                </div>
            </div>
        </div>
    `;
}

// ===== FUNÇÃO PARA MOSTRAR HISTÓRICO DO PACIENTE =====
function showPatientHistory(patientName) {
    // Dados simulados para diferentes pacientes
    const patientData = {
        'Maria Santos Silva': {
            birth: '15/03/1979',
            age: 45,
            cpf: '123.456.789-00',
            phone: '(11) 99999-9999',
            email: 'maria@email.com'
        },
        'José Oliveira Costa': {
            birth: '10/08/1962',
            age: 62,
            cpf: '987.654.321-00',
            phone: '(11) 88888-8888',
            email: 'jose@email.com'
        },
        'Ana Costa Pereira': {
            birth: '22/12/1996',
            age: 28,
            cpf: '456.789.123-00',
            phone: '(11) 77777-7777',
            email: 'ana@email.com'
        }
    };

    const patient = patientData[patientName] || patientData['Maria Santos Silva'];

    document.getElementById('historyPatientName').textContent = patientName;
    document.getElementById('pageTitle').textContent = 'Histórico do Paciente';

    // Atualiza dados do paciente
    const patientInfoDiv = document.querySelector('#patientHistoryContent > div:nth-child(2)');
    patientInfoDiv.innerHTML = `
        <h2 id="historyPatientName">${patientName}</h2>
        <p><strong>Data de Nascimento:</strong> ${patient.birth} (${patient.age} anos)</p>
        <p><strong>CPF:</strong> ${patient.cpf}</p>
        <p><strong>Telefone:</strong> ${patient.phone}</p>
        <p><strong>E-mail:</strong> ${patient.email}</p>
    `;

    // Esconde conteúdo de pacientes e mostra histórico
    document.getElementById('patientsContent').style.display = 'none';
    document.getElementById('patientHistoryContent').style.display = 'block';
}

// ===== SISTEMA DE AUTENTICAÇÃO =====
const validUsers = {
    'admin': 'admin123',
    'medico': 'med123',
    'doutor': 'doutor123',
    'demo': 'demo'
};

// ===== FUNÇÃO DE LOGIN COM VALIDAÇÃO =====
function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            // Remove mensagem de erro anterior
            removeLoginMessage();

            // Validação básica
            if (!username || !password) {
                showLoginError('Por favor, preencha todos os campos.');
                return;
            }

            // Verifica credenciais
            if (validUsers[username] && validUsers[username] === password) {
                // Login bem-sucedido
                showLoginSuccess();
                setTimeout(() => {
                    updateUserInfo(username);
                    showScreen('dashboardScreen');
                }, 1000);
            } else {
                showLoginError('Usuário ou senha incorretos. Tente: admin/admin123 ou demo/demo');
            }
        });
    }
}

// ===== FUNÇÕES DE MENSAGENS DE LOGIN =====
function removeLoginMessage() {
    const existingMessage = document.getElementById('loginMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function showLoginError(message) {
    removeLoginMessage();

    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.createElement('div');
    errorDiv.id = 'loginMessage';
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        border: 1px solid #f5c6cb;
        font-size: 14px;
    `;
    errorDiv.textContent = message;

    const firstButton = loginForm.querySelector('.btn');
    loginForm.insertBefore(errorDiv, firstButton);

    // Efeito visual nos campos
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = '#dc3545';
        input.style.animation = 'shake 0.5s ease-in-out';
    });

    setTimeout(() => {
        inputs.forEach(input => {
            input.style.borderColor = '#e1e5e9';
            input.style.animation = '';
        });
    }, 500);
}

function showLoginSuccess() {
    removeLoginMessage();

    const loginForm = document.getElementById('loginForm');
    const successDiv = document.createElement('div');
    successDiv.id = 'loginMessage';
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        border: 1px solid #c3e6cb;
        font-size: 14px;
        text-align: center;
    `;
    successDiv.innerHTML = '✅ Login realizado com sucesso! Redirecionando...';

    const firstButton = loginForm.querySelector('.btn');
    loginForm.insertBefore(successDiv, firstButton);
}

// ===== FUNÇÃO PARA ATUALIZAR INFORMAÇÕES DO USUÁRIO =====
function updateUserInfo(username) {
    const userNames = {
        'admin': 'Administrador',
        'medico': 'Dr. Silva',
        'doutor': 'Dr. Santos',
        'demo': 'Usuário Demo'
    };

    const userInitials = {
        'admin': 'AD',
        'medico': 'DS',
        'doutor': 'DT',
        'demo': 'UD'
    };

    // Atualiza nome no header
    const userInfoSpan = document.querySelector('.user-info span');
    if (userInfoSpan) {
        userInfoSpan.textContent = userNames[username] || username;
    }

    // Atualiza avatar
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.textContent = userInitials[username] || username.substring(0, 2).toUpperCase();
    }
}

// ===== FORMULÁRIOS =====
function initializeForms() {
    // Cadastro de usuário
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showAlert('✅ Usuário cadastrado com sucesso!', 'success');
            setTimeout(() => {
                showScreen('loginScreen');
            }, 1500);
        });
    }

    // Cadastro de paciente
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const patientName = document.getElementById('patientName').value;
            if (!patientName.trim()) {
                showAlert('❌ Por favor, preencha o nome do paciente.', 'error');
                return;
            }

            showAlert('✅ Paciente cadastrado com sucesso!', 'success');
            setTimeout(() => {
                showDashboardContent('patients');
            }, 1500);
        });
    }
}

// ===== FUNÇÃO PARA MOSTRAR ALERTAS =====
function showAlert(message, type = 'info') {
    // Remove alerta anterior se existir
    const existingAlert = document.getElementById('systemAlert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const colors = {
        success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
        error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
        info: { bg: '#e3f2fd', border: '#bbdefb', text: '#1976d2' }
    };

    const alertDiv = document.createElement('div');
    alertDiv.id = 'systemAlert';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type].bg};
        color: ${colors[type].text};
        border: 1px solid ${colors[type].border};
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 3000);
}

// ===== FUNÇÕES DE INTERAÇÃO =====
function updateDashboardStats() {
    // Simula atualização de estatísticas em tempo real
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const currentValue = parseInt(stat.textContent);
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0 ou 1
        const newValue = Math.max(0, currentValue + variation);

        if (newValue !== currentValue) {
            stat.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                stat.textContent = newValue;
                setTimeout(() => {
                    stat.style.animation = '';
                }, 500);
            }, 250);
        }
    });
}

// ===== FUNÇÕES DE AÇÃO DOS BOTÕES =====
function openNewAppointmentModal() {
    showAlert('📅 Funcionalidade de Nova Consulta em desenvolvimento!', 'info');
}

function refreshAppointments() {
    showAlert('🔄 Consultas atualizadas!', 'success');
}

function viewAppointment(id) {
    showAlert(`👁️ Visualizando consulta #${id}`, 'info');
}

function editAppointment(id) {
    showAlert(`✏️ Editando consulta #${id}`, 'info');
}

function requestNewExam() {
    showAlert('🔬 Funcionalidade de Solicitação de Exame em desenvolvimento!', 'info');
}

function refreshExams() {
    showAlert('🔄 Exames atualizados!', 'success');
}

function viewExamResult(id) {
    showAlert(`📋 Visualizando resultado do exame #${id}`, 'info');
}

function followExam(id) {
    showAlert(`👀 Acompanhando exame #${id}`, 'info');
}

function createPrescription() {
    showAlert('💊 Funcionalidade de Nova Receita em desenvolvimento!', 'info');
}

function refreshPrescriptions() {
    showAlert('🔄 Receitas atualizadas!', 'success');
}

function viewPrescription(id) {
    showAlert(`👁️ Visualizando receita #${id}`, 'info');
}

function printPrescription(id) {
    showAlert(`🖨️ Imprimindo receita #${id}`, 'info');
}

function generateReport(type) {
    const reportTypes = {
        'monthly': 'Relatório Mensal',
        'patients': 'Relatório de Pacientes',
        'medications': 'Relatório de Medicamentos'
    };
    showAlert(`📊 Gerando ${reportTypes[type]}...`, 'info');
}

// ===== FUNÇÕES UTILITÁRIAS =====
function clearAllForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());

    // Remove mensagens de erro/sucesso
    removeLoginMessage();

    // Reseta estilos dos inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '#e1e5e9';
        input.style.animation = '';
    });
}

function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR');

    // Atualiza informações em tempo real se necessário
    console.log(`Sistema ativo em ${dateStr} às ${timeStr}`);
}

// ===== BUSCA DE PACIENTES =====
function initializeSearch() {
    const searchInput = document.querySelector('input[placeholder*="Buscar paciente"]');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            const patientCards = document.querySelectorAll('.patient-card');

            patientCards.forEach(card => {
                const patientName = card.querySelector('.patient-name').textContent.toLowerCase();
                const patientInfo = card.querySelector('.patient-info').textContent.toLowerCase();

                if (patientName.includes(searchTerm) || patientInfo.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// ===== ANIMAÇÕES CSS DINÂMICAS =====
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// ===== INICIALIZAÇÃO DO SISTEMA =====
function initializeSystem() {
    // Adiciona estilos dinâmicos
    addDynamicStyles();

    // Inicializa autenticação
    initializeAuth();

    // Inicializa formulários
    initializeForms();

    // Inicializa busca
    setTimeout(initializeSearch, 500);

    // Atualiza estatísticas a cada 10 segundos
    setInterval(updateDashboardStats, 10000);

    // Atualiza data/hora a cada minuto
    setInterval(updateDateTime, 60000);

    // Primeira execução
    updateDateTime();

    console.log('🏥 MedSystem inicializado com sucesso!');
}

// ===== INICIALIZAÇÃO QUANDO O DOM ESTIVER PRONTO =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSystem);
} else {
    initializeSystem();
}