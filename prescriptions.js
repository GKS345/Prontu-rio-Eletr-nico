// ============================================================
//  new-patients.js  –  MedSystem | Cadastro de Novo Paciente
//  Persiste o paciente no banco via DB.patients (database.js)
//  Depende de: database.js
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    initializeFormHandlers();
    initializeValidations();
    initializeMasks();
    initializeAddressLookup();
    initializeBMICalculator();
});

// ----------------------------------------------------------
//  Inicialização dos manipuladores
// ----------------------------------------------------------
function initializeFormHandlers() {
    const form = document.getElementById('newPatientForm');
    if (form) form.addEventListener('submit', handleFormSubmit);

    const clearButton = document.querySelector('button[onclick="clearForm()"]');
    if (clearButton) {
        clearButton.removeAttribute('onclick');
        clearButton.addEventListener('click', clearForm);
    }
}

// ----------------------------------------------------------
//  Submit — persiste no banco via DB.patients.create()
// ----------------------------------------------------------
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    if (!validateFullForm(form)) return;

    const patientData = collectFormData(form);

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText  = submitBtn?.textContent;
    if (submitBtn) { submitBtn.textContent = 'Salvando...'; submitBtn.disabled = true; }

    try {
        const created = await DB.patients.create(patientData);

        showFieldSuccess(submitBtn, 'Paciente cadastrado com sucesso!');
        alert(`Paciente "${patientData.name}" cadastrado com sucesso!\nID: ${created?.id || '—'}`);

        form.reset();
        removeBMIIndicator();

        setTimeout(() => { window.location.href = 'patients.html'; }, 1500);

    } catch (err) {
        const msg = err instanceof DBError
            ? err.message
            : 'Erro ao salvar paciente. Verifique a conexão.';
        alert('Erro: ' + msg);
        console.error('[new-patients] handleFormSubmit:', err);
    } finally {
        if (submitBtn) { submitBtn.textContent = origText; submitBtn.disabled = false; }
    }
}

function collectFormData(form) {
    const g = (id) => document.getElementById(id)?.value?.trim() || '';
    return {
        name:             g('fullName'),
        birthDate:        g('birthDate'),
        cpf:              g('cpf'),
        rg:               g('rg'),
        phone:            g('phone'),
        email:            g('email'),
        address:          `${g('street')}, ${g('number')} ${g('complement')} — ${g('neighborhood')}, ${g('city')}/${g('state')} — CEP: ${g('cep')}`,
        emergencyContact: g('emergencyContact'),
        bloodType:        g('bloodType'),
        allergies:        g('allergies'),
        weight:           g('weight'),
        height:           g('height'),
        observations:     g('observations'),
        // Calculado
        age:              calculateAge(g('birthDate')),
        slug:             generateSlug(g('fullName')),
        lastConsultation: new Date().toLocaleDateString('pt-BR'),
    };
}

function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() ||
       (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
}

function generateSlug(name) {
    return name.toLowerCase()
               .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
               .replace(/[^a-z0-9]+/g, '-')
               .replace(/^-|-$/g, '');
}

// ----------------------------------------------------------
//  Validação geral do formulário
// ----------------------------------------------------------
function validateFullForm(form) {
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
        if (!validateRequiredField(field)) valid = false;
    });
    return valid;
}

// ----------------------------------------------------------
//  Máscaras
// ----------------------------------------------------------
function initializeMasks() {
    const phoneField            = document.getElementById('phone');
    const emergencyContactField = document.getElementById('emergencyContact');
    if (phoneField)            phoneField.addEventListener('input', e => formatPhone(e.target));
    if (emergencyContactField) emergencyContactField.addEventListener('input', e => formatPhone(e.target));

    const cpfField = document.getElementById('cpf');
    if (cpfField) cpfField.addEventListener('input', formatCPF);

    const cepField = document.getElementById('cep');
    if (cepField) cepField.addEventListener('input', formatCEP);
}

function formatCPF(e) {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
}

function formatPhone(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length <= 10) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else                v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    input.value = v;
}

function formatCEP(e) {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    e.target.value = v;
    if (v.replace(/\D/g,'').length === 8) lookupAddress(e);
}

// ----------------------------------------------------------
//  Validações
// ----------------------------------------------------------
function initializeValidations() {
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur',  () => validateRequiredField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });

    const cpfField       = document.getElementById('cpf');
    const emailField     = document.getElementById('email');
    const birthDateField = document.getElementById('birthDate');
    const heightField    = document.getElementById('height');
    const weightField    = document.getElementById('weight');

    if (cpfField)       cpfField.addEventListener('blur', validateCPF);
    if (emailField)     emailField.addEventListener('blur', validateEmail);
    if (birthDateField) birthDateField.addEventListener('blur', validateBirthDate);

    if (heightField) heightField.addEventListener('input', () => { validateNumericRange(heightField, 50, 250, 'Altura deve ser entre 50 e 250 cm'); calculateAndDisplayBMI(); });
    if (weightField) weightField.addEventListener('input', () => { validateNumericRange(weightField, 1, 300, 'Peso deve ser entre 1 e 300 kg'); calculateAndDisplayBMI(); });
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
    if (cpf && !isValidCPF(cpf)) showFieldError(e.target, 'CPF inválido');
    else clearFieldError(e.target);
}

function isValidCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let r = 11 - (sum % 11);
    if (r >= 10) r = 0;
    if (r !== parseInt(cpf[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    r = 11 - (sum % 11);
    if (r >= 10) r = 0;
    return r === parseInt(cpf[10]);
}

function validateEmail(e) {
    const email = e.target.value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) showFieldError(e.target, 'E-mail inválido');
    else clearFieldError(e.target);
}

function validateBirthDate(e) {
    const date = new Date(e.target.value);
    const now  = new Date();
    if (isNaN(date)) { showFieldError(e.target, 'Data inválida'); return; }
    if (date > now)  { showFieldError(e.target, 'Data não pode ser futura'); return; }
    if (now.getFullYear() - date.getFullYear() > 150) { showFieldError(e.target, 'Data muito antiga'); return; }
    clearFieldError(e.target);
}

function validateNumericRange(field, min, max, message) {
    const v = parseFloat(field.value);
    if (field.value && (isNaN(v) || v < min || v > max)) showFieldError(field, message);
    else clearFieldError(field);
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#e74c3c';
    const span = document.createElement('span');
    span.className = 'field-error';
    span.style.cssText = 'color:#e74c3c;font-size:12px;display:block;margin-top:3px;';
    span.textContent = message;
    field.parentNode.appendChild(span);
}

function showFieldSuccess(field, message) {
    if (!field) return;
    const span = document.createElement('span');
    span.className = 'field-success';
    span.style.cssText = 'color:#27ae60;font-size:12px;display:block;margin-top:3px;';
    span.textContent = message;
    field.parentNode.appendChild(span);
    setTimeout(() => span.remove(), 3000);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const err = field.parentNode.querySelector('.field-error');
    if (err) err.remove();
}

// ----------------------------------------------------------
//  Busca de endereço por CEP (ViaCEP — API pública, sem banco)
// ----------------------------------------------------------
function initializeAddressLookup() {
    const cepField = document.getElementById('cep');
    if (cepField) cepField.addEventListener('blur', lookupAddress);
}

async function lookupAddress(e) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error('CEP não encontrado');
        const data = await response.json();
        if (data.erro) { showFieldError(e.target, 'CEP não encontrado'); return; }
        fillAddressFields(data);
    } catch (err) {
        showFieldError(e.target, 'Erro ao buscar CEP');
    }
}

function fillAddressFields(data) {
    const fields = {
        street:       data.logradouro,
        neighborhood: data.bairro,
        city:         data.localidade,
        state:        data.uf,
    };
    Object.entries(fields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el && value) { el.value = value; clearFieldError(el); }
    });
    document.getElementById('number')?.focus();
}

// ----------------------------------------------------------
//  Calculadora de IMC
// ----------------------------------------------------------
function initializeBMICalculator() {
    ['height','weight'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateAndDisplayBMI);
    });
}

function calculateAndDisplayBMI() {
    const h = parseFloat(document.getElementById('height')?.value);
    const w = parseFloat(document.getElementById('weight')?.value);
    if (!h || !w || h < 50 || w < 1) { removeBMIIndicator(); return; }
    const bmi = w / Math.pow(h / 100, 2);
    displayBMIResult(bmi, getBMICategory(bmi));
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { label: 'Abaixo do peso',  color: '#3498db' };
    if (bmi < 25)   return { label: 'Peso normal',      color: '#27ae60' };
    if (bmi < 30)   return { label: 'Sobrepeso',         color: '#f39c12' };
    if (bmi < 35)   return { label: 'Obesidade grau I',  color: '#e67e22' };
    if (bmi < 40)   return { label: 'Obesidade grau II', color: '#e74c3c' };
    return                 { label: 'Obesidade grau III',color: '#c0392b' };
}

function displayBMIResult(bmi, category) {
    removeBMIIndicator();
    const weightField = document.getElementById('weight');
    if (!weightField) return;
    const div = document.createElement('div');
    div.className = 'bmi-indicator';
    div.style.cssText = `background:${category.color}15;border:1px solid ${category.color};
        border-radius:4px;padding:8px;margin-top:5px;font-size:13px;`;
    div.innerHTML = `<strong style="color:${category.color};">IMC: ${bmi.toFixed(1)}</strong>
        <span style="color:#666;"> — ${category.label}</span>`;
    weightField.parentNode.appendChild(div);
}

function removeBMIIndicator() {
    document.querySelectorAll('.bmi-indicator').forEach(el => el.remove());
}

function clearForm() {
    document.getElementById('newPatientForm')?.reset();
    document.querySelectorAll('.field-error,.field-success').forEach(el => el.remove());
    document.querySelectorAll('input,textarea,select').forEach(el => { el.style.borderColor = ''; });
    removeBMIIndicator();
}
