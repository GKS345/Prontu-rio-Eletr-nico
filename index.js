// ============================================================
//  register.js  –  MedSystem | Cadastro de Usuários
//  Persiste o novo usuário no banco via DB.auth.register()
//  Depende de: database.js
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    const registerForm          = document.getElementById('registerForm');
    const fullNameInput         = document.getElementById('fullName');
    const emailInput            = document.getElementById('email');
    const crmInput              = document.getElementById('crm');
    const specialtySelect       = document.getElementById('specialty');
    const phoneInput            = document.getElementById('phone');
    const passwordInput         = document.getElementById('newPassword');
    const confirmPasswordInput  = document.getElementById('confirmPassword');

    // ----------------------------------------------------------
    //  Máscaras de input
    // ----------------------------------------------------------
    phoneInput.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length <= 11) {
            v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            if (v.length < 14) v = v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        e.target.value = v;
    });

    crmInput.addEventListener('input', function (e) {
        let v = e.target.value.replace(/[^0-9A-Za-z-]/g, '');
        if (v.length > 5 && !v.includes('-')) v = v.substring(0, 5) + '-' + v.substring(5);
        e.target.value = v.toUpperCase();
    });

    // ----------------------------------------------------------
    //  Validações em tempo real
    // ----------------------------------------------------------
    emailInput.addEventListener('blur', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = '#e74c3c';
            showMessage('Por favor, insira um e-mail válido.', 'error');
        } else {
            this.style.borderColor = '';
            if (this.value) {
                const username = this.value.split('@')[0].toLowerCase();
                showMessage(`💡 Seu usuário para login será: ${username}`, 'info');
                setTimeout(() => {
                    const msg = document.querySelector('.message');
                    if (msg && msg.textContent.includes('usuário para login')) msg.remove();
                }, 4000);
            }
        }
    });

    passwordInput.addEventListener('input', function () {
        this.style.borderColor = this.value.length > 0 && this.value.length < 6 ? '#e74c3c' : '';
        if (confirmPasswordInput.value) {
            confirmPasswordInput.style.borderColor =
                this.value !== confirmPasswordInput.value ? '#e74c3c' : '#27ae60';
        }
    });

    confirmPasswordInput.addEventListener('input', function () {
        this.style.borderColor =
            this.value && this.value !== passwordInput.value ? '#e74c3c' : '#27ae60';
    });

    // Limpa erros ao redigitar
    [fullNameInput, emailInput, crmInput, phoneInput, passwordInput, confirmPasswordInput]
        .forEach(input => input.addEventListener('input', () => { input.style.borderColor = ''; }));
    specialtySelect.addEventListener('change', () => { specialtySelect.style.borderColor = ''; });

    // ----------------------------------------------------------
    //  Helpers de validação
    // ----------------------------------------------------------
    const validateCRM   = crm   => /^\d{4,6}-[A-Z]{2}$/.test(crm);
    const validatePhone = phone => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone);

    // ----------------------------------------------------------
    //  Mensagens de feedback
    // ----------------------------------------------------------
    function showMessage(message, type = 'info') {
        const existing = document.querySelector('.message');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.textContent = message;
        div.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            padding: 15px 20px; border-radius: 5px;
            color: white; font-weight: bold;
            z-index: 1000; max-width: 300px; word-wrap: break-word;
            ${type === 'success' ? 'background-color:#27ae60;' : ''}
            ${type === 'error'   ? 'background-color:#e74c3c;' : ''}
            ${type === 'info'    ? 'background-color:#3498db;' : ''}
        `;
        document.body.appendChild(div);
        setTimeout(() => { if (div.parentNode) div.remove(); }, 5000);
    }

    // ----------------------------------------------------------
    //  Submit — persiste no banco via database.js
    // ----------------------------------------------------------
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            fullName:        fullNameInput.value.trim(),
            email:           emailInput.value.trim().toLowerCase(),
            crm:             crmInput.value.trim(),
            specialty:       specialtySelect.value,
            phone:           phoneInput.value.trim(),
            password:        passwordInput.value,
            confirmPassword: confirmPasswordInput.value,
        };

        // ── Validações locais ──────────────────────────────
        const errors = [];
        if (!formData.fullName || formData.fullName.length < 3)
            errors.push('Nome completo deve ter pelo menos 3 caracteres.');
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errors.push('E-mail inválido.');
        if (!formData.crm || !validateCRM(formData.crm))
            errors.push('CRM deve estar no formato: 12345-SP');
        if (!formData.specialty)
            errors.push('Selecione uma especialidade.');
        if (!formData.phone || !validatePhone(formData.phone))
            errors.push('Telefone deve estar no formato: (11) 99999-9999');
        if (!formData.password || formData.password.length < 6)
            errors.push('Senha deve ter pelo menos 6 caracteres.');
        if (formData.password !== formData.confirmPassword)
            errors.push('Senhas não coincidem.');

        if (errors.length > 0) {
            showMessage(errors.join(' '), 'error');
            return;
        }

        // ── Verifica duplicidade no banco ──────────────────
        try {
            const check = await DB.auth.checkExists(formData.email, formData.crm);
            if (check.exists) {
                showMessage('E-mail ou CRM já cadastrado no sistema.', 'error');
                return;
            }
        } catch (err) {
            showMessage('Erro ao verificar dados. Tente novamente.', 'error');
            console.error('[register] checkExists:', err);
            return;
        }

        // ── Persiste no banco ──────────────────────────────
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Cadastrando...';
        submitButton.disabled    = true;

        try {
            // Remove campo de confirmação antes de enviar
            const payload = { ...formData };
            delete payload.confirmPassword;

            await DB.auth.register(payload);

            const username = formData.fullName;
            showMessage(`Cadastro realizado com sucesso! Seu usuário é: ${username}`, 'success');
            registerForm.reset();

            setTimeout(() => { window.location.href = 'index.html'; }, 3000);

        } catch (err) {
            const msg = err instanceof DBError
                ? err.message
                : 'Erro ao processar cadastro. Tente novamente.';
            showMessage(msg, 'error');
            console.error('[register] register:', err);

        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled    = false;
        }
    });

    // ----------------------------------------------------------
    //  Info de instrução de login
    // ----------------------------------------------------------
    const form = document.getElementById('registerForm');
    if (form) {
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            background:#e8f4f8; border:1px solid #bee5eb; border-radius:5px;
            padding:15px; margin-bottom:20px; font-size:0.9em; color:#0c5460;
        `;
        infoDiv.innerHTML = `
            <h5 style="margin:0 0 10px 0;color:#0c5460;">ℹ️ Como fazer login após o cadastro:</h5>
            <ul style="margin:0;padding-left:20px;">
                <li>Seu <strong>usuário</strong> será o seu nome completo</li>
                <li>Use a <strong>mesma senha</strong> que você está cadastrando aqui</li>
            </ul>
        `;
        form.parentNode.insertBefore(infoDiv, form);
    }
});
