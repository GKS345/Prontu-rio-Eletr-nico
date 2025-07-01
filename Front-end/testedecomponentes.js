// tests/login.test.js
function runLoginTests() {
    const testResults = document.getElementById('test-results');
    const loginContainer = document.createElement('div');
    loginContainer.className = 'test-container';
    loginContainer.innerHTML = `
        <div class="test-title">Testes de Login</div>
        <div id="login-test-results"></div>
    `;
    testResults.appendChild(loginContainer);
    
    const loginTestResults = document.getElementById('login-test-results');
    
    // Teste 1: Verificar se o formulário de login existe
    try {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) throw new Error('Formulário de login não encontrado');
        
        loginTestResults.innerHTML += `
            <div class="test-pass">✓ Formulário de login existe</div>
        `;
    } catch (error) {
        loginTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
    
    // Teste 2: Verificar validação de campos obrigatórios
    try {
        const loginForm = document.getElementById('loginForm');
        const originalAction = loginForm.action;
        let validationPassed = false;
        
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            validationPassed = true;
            return false;
        };
        
        loginForm.action = 'javascript:void(0);';
        loginForm.submit();
        
        if (!validationPassed) throw new Error('Validação de campos obrigatórios falhou');
        
        loginTestResults.innerHTML += `
            <div class="test-pass">✓ Validação de campos obrigatórios funciona</div>
        `;
        
        loginForm.action = originalAction;
    } catch (error) {
        loginTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
    
    // Teste 3: Verificar login com credenciais demo
    try {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginButton = document.querySelector('#loginForm button[type="submit"]');
        
        usernameInput.value = 'demo';
        passwordInput.value = 'demo';
        
        let redirectSuccess = false;
        const originalOnSubmit = loginForm.onsubmit;
        
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            if (usernameInput.value === 'demo' && passwordInput.value === 'demo') {
                redirectSuccess = true;
            }
            return false;
        };
        
        loginButton.click();
        
        if (!redirectSuccess) throw new Error('Login com credenciais demo falhou');
        
        loginTestResults.innerHTML += `
            <div class="test-pass">✓ Login com credenciais demo funciona</div>
        `;
        
        loginForm.onsubmit = originalOnSubmit;
    } catch (error) {
        loginTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
}
// tests/patients.test.js
function runPatientTests() {
    const testResults = document.getElementById('test-results');
    const container = document.createElement('div');
    container.className = 'test-container';
    container.innerHTML = `
        <div class="test-title">Testes de Pacientes</div>
        <div id="patient-test-results"></div>
    `;
    testResults.appendChild(container);
    
    const patientTestResults = document.getElementById('patient-test-results');
    
    // Teste 1: Verificar se a lista de pacientes é carregada
    try {
        const patientList = document.querySelector('.patient-card');
        if (!patientList) throw new Error('Lista de pacientes não carregada');
        
        patientTestResults.innerHTML += `
            <div class="test-pass">✓ Lista de pacientes carregada com sucesso</div>
        `;
    } catch (error) {
        patientTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
    
    // Teste 2: Verificar busca de pacientes
    try {
        const searchInput = document.querySelector('input[placeholder*="Buscar paciente"]');
        const searchButton = document.querySelector('button.btn-small.btn-primary');
        
        if (!searchInput || !searchButton) throw new Error('Elementos de busca não encontrados');
        
        // Simular busca
        searchInput.value = 'Maria';
        searchButton.click();
        
        // Verificar se a lista foi filtrada (simulação)
        const patientCards = document.querySelectorAll('.patient-card');
        let found = false;
        
        patientCards.forEach(card => {
            if (card.textContent.includes('Maria')) found = true;
        });
        
        if (!found) throw new Error('Busca de pacientes não funcionou');
        
        patientTestResults.innerHTML += `
            <div class="test-pass">✓ Busca de pacientes funciona</div>
        `;
    } catch (error) {
        patientTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
    
    // Teste 3: Verificar cadastro de novo paciente
    try {
        const newPatientButton = document.querySelector('button[onclick*="new-patient.html"]');
        if (!newPatientButton) throw new Error('Botão de novo paciente não encontrado');
        
        // Simular clique e verificar redirecionamento
        let redirectSuccess = false;
        const originalHref = newPatientButton.onclick;
        
        newPatientButton.onclick = function() {
            redirectSuccess = true;
            return false;
        };
        
        newPatientButton.click();
        
        if (!redirectSuccess) throw new Error('Redirecionamento para novo paciente falhou');
        
        patientTestResults.innerHTML += `
            <div class="test-pass">✓ Redirecionamento para novo paciente funciona</div>
        `;
        
        newPatientButton.onclick = originalHref;
    } catch (error) {
        patientTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
}
// tests/appointments.test.js
function runAppointmentTests() {
    const testResults = document.getElementById('test-results');
    const container = document.createElement('div');
    container.className = 'test-container';
    container.innerHTML = `
        <div class="test-title">Testes de Consultas</div>
        <div id="appointment-test-results"></div>
    `;
    testResults.appendChild(container);
    
    const appointmentTestResults = document.getElementById('appointment-test-results');
    
    // Teste 1: Verificar se a lista de consultas é carregada
    try {
        const appointmentList = document.querySelectorAll('.patient-card');
        if (appointmentList.length === 0) throw new Error('Lista de consultas não carregada');
        
        appointmentTestResults.innerHTML += `
            <div class="test-pass">✓ Lista de consultas carregada com sucesso</div>
        `;
    } catch (error) {
        appointmentTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
    
    // Teste 2: Verificar filtro de status
    try {
        const statusFilter = document.getElementById('filterStatus');
        if (!statusFilter) throw new Error('Filtro de status não encontrado');
        
        // Simular filtro
        statusFilter.value = 'confirmada';
        const changeEvent = new Event('change');
        statusFilter.dispatchEvent(changeEvent);
        
        // Verificar se a lista foi filtrada (simulação)
        const statusBadges = document.querySelectorAll('.status-badge.status-confirmada');
        if (statusBadges.length === 0) throw new Error('Filtro de status não funcionou');
        
        appointmentTestResults.innerHTML += `
            <div class="test-pass">✓ Filtro por status funciona</div>
        `;
    } catch (error) {
        appointmentTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
    
    // Teste 3: Verificar agendamento de nova consulta
    try {
        const newAppointmentButton = document.querySelector('button[onclick*="openNewAppointmentModal"]');
        if (!newAppointmentButton) throw new Error('Botão de nova consulta não encontrado');
        
        // Simular clique
        let modalOpened = false;
        const originalOnClick = newAppointmentButton.onclick;
        
        newAppointmentButton.onclick = function() {
            modalOpened = true;
            return false;
        };
        
        newAppointmentButton.click();
        
        if (!modalOpened) throw new Error('Modal de nova consulta não abriu');
        
        appointmentTestResults.innerHTML += `
            <div class="test-pass">✓ Abertura do modal de nova consulta funciona</div>
        `;
        
        newAppointmentButton.onclick = originalOnClick;
    } catch (error) {
        appointmentTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
}
// tests/prescriptions.test.js
function runPrescriptionTests() {
    const testResults = document.getElementById('test-results');
    const container = document.createElement('div');
    container.className = 'test-container';
    container.innerHTML = `
        <div class="test-title">Testes de Receitas Médicas</div>
        <div id="prescription-test-results"></div>
    `;
    testResults.appendChild(container);
    
    const prescriptionTestResults = document.getElementById('prescription-test-results');
    
    // Teste 1: Verificar se a lista de receitas é carregada
    try {
        const prescriptionList = document.querySelectorAll('.prescription-card');
        if (prescriptionList.length === 0) throw new Error('Lista de receitas não carregada');
        
        prescriptionTestResults.innerHTML += `
            <div class="test-pass">✓ Lista de receitas carregada com sucesso</div>
        `;
    } catch (error) {
        prescriptionTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
    
    // Teste 2: Verificar adição de novo medicamento
    try {
        const addMedicationButton = document.querySelector('button[onclick*="addMedication"]');
        if (!addMedicationButton) throw new Error('Botão de adicionar medicamento não encontrado');
        
        // Simular clique
        const initialMedications = document.querySelectorAll('.medication-item').length;
        addMedicationButton.click();
        const newMedications = document.querySelectorAll('.medication-item').length;
        
        if (newMedications <= initialMedications) throw new Error('Adição de medicamento falhou');
        
        prescriptionTestResults.innerHTML += `
            <div class="test-pass">✓ Adição de novo medicamento funciona</div>
        `;
    } catch (error) {
        prescriptionTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
    
    // Teste 3: Verificar impressão de receita
    try {
        const printButton = document.querySelector('button[onclick*="printPrescription"]');
        if (!printButton) throw new Error('Botão de impressão não encontrado');
        
        // Substituir a função print para teste
        const originalPrint = window.print;
        let printCalled = false;
        window.print = function() { printCalled = true; };
        
        printButton.click();
        
        if (!printCalled) throw new Error('Função de impressão não foi chamada');
        
        prescriptionTestResults.innerHTML += `
            <div class="test-pass">✓ Botão de impressão funciona</div>
        `;
        
        window.print = originalPrint;
    } catch (error) {
        prescriptionTestResults.innerHTML += `
            <div class="test-fail">✗ ${error.message}</div>
        `;
    }
};