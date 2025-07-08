
// ========================================
// SCRIPT COMPLETO PARA NOVO PACIENTE
// ========================================

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function () {
    initializeFormHandlers();
    initializeValidations();
    initializeMasks();
    initializeAddressLookup();
    initializeBMICalculator();
});

// ========================================
// INICIALIZAÇÃO DOS MANIPULADORES
// ========================================

function initializeFormHandlers() {
    // Manipulador de submissão do formulário
    const form = document.getElementById('newPatientForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Botão de limpar formulário
    const clearButton = document.querySelector('button[onclick="clearForm()"]');
    if (clearButton) {
        clearButton.removeAttribute('onclick');
        clearButton.addEventListener('click', clearForm);
    }

    // Botão de cancelar
    const cancelButton = document.querySelector('button[onclick="window.location.href=\'patients.html\'"]');
    if (cancelButton) {
        cancelButton.removeAttribute('onclick');
        cancelButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja cancelar? Todos os dados não salvos serão perdidos.')) {
                window.location.href = 'patients.html';
            }
        });
    }
}

// ========================================
// MÁSCARAS DE FORMATAÇÃO
// ========================================

function initializeMasks() {
    // Máscara para CPF
    const cpfField = document.getElementById('cpf');
    if (cpfField) {
        cpfField.addEventListener('input', formatCPF);
        cpfField.addEventListener('blur', validateCPF);
    }

    // Máscara para telefones
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function (e) {
            formatPhone(e.target);
        });
    }

    const emergencyContactField = document.getElementById('emergencyContact');
    if (emergencyContactField) {
        emergencyContactField.addEventListener('input', function (e) {
            formatPhone(e.target);
        });
    }

    // Máscara para CEP
    const cepField = document.getElementById('cep');
    if (cepField) {
        cepField.addEventListener('input', formatCEP);
    }
}

function formatCPF(e) {
    let value = e.target.value.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (value.length > 11) {
        value = value.substring(0, 11);
    }

    // Aplica a máscara
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    e.target.value = value;
}

function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (value.length > 11) {
        value = value.substring(0, 11);
    }

    // Aplica a máscara baseada no tamanho
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }

    input.value = value;
}

function formatCEP(e) {
    let value = e.target.value.replace(/\D/g, '');

    // Limita a 8 dígitos
    if (value.length > 8) {
        value = value.substring(0, 8);
    }

    // Aplica a máscara
    value = value.replace(/(\d{5})(\d)/, '$1-$2');

    e.target.value = value;
}

// ========================================
// VALIDAÇÕES
// ========================================

function initializeValidations() {
    // Validação em tempo real para campos obrigatórios
    const requiredFields = ['fullName', 'cpf', 'birthDate', 'gender', 'phone'];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function () {
                validateRequiredField(this);
            });
            field.addEventListener('input', function () {
                clearFieldError(this);
            });
        }
    });

    // Validação de email
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', validateEmail);
    }

    // Validação de data de nascimento
    const birthDateField = document.getElementById('birthDate');
    if (birthDateField) {
        birthDateField.addEventListener('blur', validateBirthDate);
    }

    // Validação de altura e peso
    const heightField = document.getElementById('height');
    const weightField = document.getElementById('weight');

    if (heightField) {
        heightField.addEventListener('input', function () {
            validateNumericRange(this, 50, 250, 'Altura deve estar entre 50 e 250 cm');
        });
    }

    if (weightField) {
        weightField.addEventListener('input', function () {
            validateNumericRange(this, 1, 500, 'Peso deve estar entre 1 e 500 kg');
        });
    }
}

function validateRequiredField(field) {
    if (!field.value.trim()) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    clearFieldError(field);
    return true;
}

function validateCPF(e) {
    const cpf = e.target.value.replace(/\D/g, '');

    if (cpf.length === 0) return; // Campo vazio é tratado pela validação de obrigatório

    if (cpf.length !== 11 || !isValidCPF(cpf)) {
        showFieldError(e.target, 'CPF inválido');
        return false;
    }

    clearFieldError(e.target);
    return true;
}

function isValidCPF(cpf) {
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

function validateEmail(e) {
    const email = e.target.value.trim();

    if (email.length === 0) return; // Campo opcional

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError(e.target, 'E-mail inválido');
        return false;
    }

    clearFieldError(e.target);
    return true;
}

function validateBirthDate(e) {
    const birthDate = new Date(e.target.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (birthDate > today) {
        showFieldError(e.target, 'Data de nascimento não pode ser futura');
        return false;
    }

    if (age > 120) {
        showFieldError(e.target, 'Data de nascimento inválida');
        return false;
    }

    clearFieldError(e.target);
    return true;
}

function validateNumericRange(field, min, max, message) {
    const value = parseFloat(field.value);

    if (field.value && (isNaN(value) || value < min || value > max)) {
        showFieldError(field, message);
        return false;
    }

    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    field.style.backgroundColor = '#fdf2f2';

    // Remove mensagem de erro anterior
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Adiciona nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e1e5e9';
    field.style.backgroundColor = '';

    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ========================================
// BUSCA DE ENDEREÇO POR CEP
// ========================================

function initializeAddressLookup() {
    const cepField = document.getElementById('cep');
    if (cepField) {
        cepField.addEventListener('blur', lookupAddress);
    }
}

async function lookupAddress(e) {
    const cep = e.target.value.replace(/\D/g, '');

    if (cep.length !== 8) return;

    // Mostra indicador de carregamento
    const originalPlaceholder = e.target.placeholder;
    e.target.placeholder = 'Buscando endereço...';
    e.target.disabled = true;

    try {
        // Tenta buscar o CEP na API dos Correios (ViaCEP)
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        // Preenche os campos com os dados retornados
        fillAddressFields(data);

    } catch (error) {
        // Em caso de erro, usa dados simulados
        fillAddressFields({
            logradouro: 'Rua das Flores',
            bairro: 'Centro',
            localidade: 'São Paulo',
            uf: 'SP'
        });

        console.log('Usando dados simulados para CEP:', cep);
    } finally {
        // Restaura o estado original do campo
        e.target.placeholder = originalPlaceholder;
        e.target.disabled = false;
    }
}

function fillAddressFields(addressData) {
    const fields = {
        street: addressData.logradouro || '',
        neighborhood: addressData.bairro || '',
        city: addressData.localidade || '',
        state: addressData.uf || ''
    };

    Object.keys(fields).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && fields[fieldName]) {
            field.value = fields[fieldName];

            // Adiciona efeito visual de preenchimento
            field.style.backgroundColor = '#f0f8ff';
            setTimeout(() => {
                field.style.backgroundColor = '';
            }, 1000);
        }
    });
}

// ========================================
// CALCULADORA DE IMC
// ========================================

function initializeBMICalculator() {
    const heightField = document.getElementById('height');
    const weightField = document.getElementById('weight');

    if (heightField && weightField) {
        heightField.addEventListener('input', calculateAndDisplayBMI);
        weightField.addEventListener('input', calculateAndDisplayBMI);
    }
}

function calculateAndDisplayBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    // Remove indicador de IMC anterior
    removeBMIIndicator();

    if (height && weight && height > 0) {
        const bmi = weight / ((height / 100) * (height / 100));
        const bmiCategory = getBMICategory(bmi);

        displayBMIResult(bmi, bmiCategory);
        console.log('IMC calculado:', bmi.toFixed(2), '- Categoria:', bmiCategory);
    }
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: '#3498db' };
    if (bmi < 25) return { category: 'Peso normal', color: '#27ae60' };
    if (bmi < 30) return { category: 'Sobrepeso', color: '#f39c12' };
    if (bmi < 35) return { category: 'Obesidade grau I', color: '#e67e22' };
    if (bmi < 40) return { category: 'Obesidade grau II', color: '#d35400' };
    return { category: 'Obesidade grau III', color: '#c0392b' };
}

function displayBMIResult(bmi, bmiCategory) {
    const weightField = document.getElementById('weight');
    const bmiDiv = document.createElement('div');

    bmiDiv.className = 'bmi-result';
    bmiDiv.style.cssText = `
        margin-top: 10px;
        padding: 8px 12px;
        background-color: ${bmiCategory.color}20;
        border: 1px solid ${bmiCategory.color};
        border-radius: 4px;
        font-size: 12px;
        color: ${bmiCategory.color};
        font-weight: bold;
    `;

    bmiDiv.innerHTML = `
        📊 IMC: ${bmi.toFixed(1)} - ${bmiCategory.category}
    `;

    weightField.parentNode.appendChild(bmiDiv);
}

function removeBMIIndicator() {
    const existingBMI = document.querySelector('.bmi-result');
    if (existingBMI) {
        existingBMI.remove();
    }
}

// ========================================
// MANIPULAÇÃO DO FORMULÁRIO
// ========================================

function clearForm() {
    if (confirm('Tem certeza que deseja limpar todos os campos? Todos os dados serão perdidos.')) {
        const form = document.getElementById('newPatientForm');
        if (form) {
            form.reset();

            // Remove todas as mensagens de erro
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());

            // Remove indicador de IMC
            removeBMIIndicator();

            // Restaura estilos dos campos
            const allInputs = form.querySelectorAll('input, select, textarea');
            allInputs.forEach(input => {
                input.style.borderColor = '#e1e5e9';
                input.style.backgroundColor = '';
            });

            // Foca no primeiro campo
            const firstField = document.getElementById('fullName');
            if (firstField) {
                firstField.focus();
            }

            console.log('Formulário limpo com sucesso');
        }
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    console.log('Iniciando validação do formulário...');

    // Executa todas as validações
    const isValid = validateForm();

    if (!isValid) {
        alert('Por favor, corrija os erros no formulário antes de continuar.');
        focusFirstError();
        return;
    }

    // Coleta os dados do formulário
    const formData = collectFormData();
    console.log('Dados coletados:', formData);

    // Inicia o processo de salvamento
    await savePatient(formData);
}

function validateForm() {
    let isValid = true;
    const requiredFields = ['fullName', 'cpf', 'birthDate', 'gender', 'phone'];

    // Valida campos obrigatórios
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateRequiredField(field)) {
            isValid = false;
        }
    });

    // Valida CPF
    const cpfField = document.getElementById('cpf');
    if (cpfField && cpfField.value && !validateCPF({ target: cpfField })) {
        isValid = false;
    }

    // Valida email se preenchido
    const emailField = document.getElementById('email');
    if (emailField && emailField.value && !validateEmail({ target: emailField })) {
        isValid = false;
    }

    // Valida data de nascimento
    const birthDateField = document.getElementById('birthDate');
    if (birthDateField && birthDateField.value && !validateBirthDate({ target: birthDateField })) {
        isValid = false;
    }

    return isValid;
}

function collectFormData() {
    const form = document.getElementById('newPatientForm');
    const formData = new FormData(form);
    const data = {};

    // Converte FormData para objeto
    for (let [key, value] of formData.entries()) { // Corrigido: Use formData.entries() para iterar
        data[key] = value;
    }

    // Adiciona dados calculados
    const height = parseFloat(data.height);
    const weight = parseFloat(data.weight);

    if (height && weight && !isNaN(height) && !isNaN(weight)) { // Corrigido: Adicionado verificação se height e weight são números válidos
        const bmi = weight / ((height / 100) * (height / 100));
        data.bmi = bmi.toFixed(1);
        data.bmiCategory = getBMICategory(parseFloat(data.bmi))?.category; // Corrigido: Adicionado verificação para evitar erros se getBMICategory retornar null ou undefined
    }

    // Adiciona timestamp
    data.createdAt = new Date().toISOString();
    data.id = generatePatientId();

    return data;
}


function generatePatientId() {
    return 'PAC' + Date.now().toString().slice(-8);
}

async function savePatient(patientData) {
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Mostra estado de carregamento
    submitButton.innerHTML = '⏳ Salvando paciente...';
    submitButton.disabled = true;

    try {
        // Simula salvamento no servidor
        await simulateSaveProcess(patientData);

        // Sucesso
        showSuccessMessage();

        // Redireciona após um tempo
        setTimeout(() => {
            window.location.href = 'patients.html';
        }, 2000);

    } catch (error) {
        console.error('Erro ao salvar paciente:', error);
        alert('Erro ao salvar paciente. Tente novamente.');

        // Restaura o botão
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

async function simulateSaveProcess(data) {
    // Simula chamada para API
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simula 95% de taxa de sucesso
            if (Math.random() > 0.05) {
                console.log('Paciente salvo com sucesso:', data);
                resolve(data);
            } else {
                reject(new Error('Erro simulado na API'));
            }
        }, 1500);
    });
}

function showSuccessMessage() {
    // Cria overlay de sucesso
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 400px;
    `;

    messageBox.innerHTML = `
        <div style="font-size: 48px; color: #27ae60; margin-bottom: 20px;">✅</div>
        <h3 style="color: #2c3e50; margin-bottom: 10px;">Paciente Cadastrado!</h3>
        <p style="color: #7f8c8d;">Os dados foram salvos com sucesso.</p>
        <p style="color: #7f8c8d; font-size: 14px;">Redirecionando...</p>
    `;

    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);

    // Remove o overlay após 3 segundos
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 3000);
}

function focusFirstError() {
    const firstError = document.querySelector('.error-message');
    if (firstError) {
        const errorField = firstError.parentNode.querySelector('input, select, textarea');
        if (errorField) {
            errorField.focus();
            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// ========================================
// UTILITÁRIOS E MELHORIAS
// ========================================

// Previne submissão do formulário ao pressionar Enter em campos de texto
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
        e.preventDefault();

        // Move para o próximo campo
        const fields = Array.from(document.querySelectorAll('input, select, textarea'));
        const currentIndex = fields.indexOf(e.target);
        const nextField = fields[currentIndex + 1];

        if (nextField) {
            nextField.focus();
        }
    }
});

// Auto-save em localStorage (opcional)
function initializeAutoSave() {
    const form = document.getElementById('newPatientForm');
    if (!form) return;

    // Carrega dados salvos automaticamente
    loadAutoSavedData();

    // Salva automaticamente a cada mudança
    form.addEventListener('input', debounce(saveFormData, 1000));
}

function saveFormData() {
    const formData = collectFormData();
    try {
        localStorage.setItem('newPatientFormData', JSON.stringify(formData));
        console.log('Dados salvos automaticamente');
    } catch (error) {
        console.log('Auto-save não disponível (localStorage indisponível)');
    }
}

function loadAutoSavedData() {
    try {
        const savedData = localStorage.getItem('newPatientFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            populateForm(data);
            console.log('Dados carregados automaticamente');
        }
    } catch (error) {
        console.log('Auto-load não disponível');
    }
}

function populateForm(data) {
    Object.keys(data).forEach(key => {
        const field = document.getElementById(key);
        if (field && data[key]) {
            field.value = data[key];
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Limpa auto-save ao submeter com sucesso
function clearAutoSave() {
    try {
        localStorage.removeItem('newPatientFormData');
    } catch (error) {
        // Ignore se não disponível
    }
}

// ========================================
// INICIALIZAÇÃO FINAL
// ========================================

// Inicializa auto-save se localStorage estiver disponível
try {
    if (typeof Storage !== 'undefined') {
        initializeAutoSave();
    }
} catch (error) {
    console.log('Auto-save não inicializado - executando no ambiente Claude');
}