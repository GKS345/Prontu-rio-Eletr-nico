// Script de Cadastro - MedSystem
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const crmInput = document.getElementById('crm');
    const specialtySelect = document.getElementById('specialty');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Formatação automática do telefone
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            if (value.length < 14) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    });

    // Formatação automática do CRM
    crmInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9A-Za-z-]/g, '');
        
        // Formato: 12345-SP
        if (value.length > 5 && !value.includes('-')) {
            value = value.substring(0, 5) + '-' + value.substring(5);
        }
        
        e.target.value = value.toUpperCase();
    });

    // Validação de email em tempo real
    emailInput.addEventListener('blur', function() {
        const email = this.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            showMessage('Por favor, insira um e-mail válido.', 'error');
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '';
            
            // Mostrar sugestão de username
            if (email) {
                const username = email.split('@')[0].toLowerCase();
                showMessage(`💡 Seu usuário para login será: ${username}`, 'info');
                setTimeout(() => {
                    const msg = document.querySelector('.message');
                    if (msg && msg.textContent.includes('usuário para login')) {
                        msg.remove();
                    }
                }, 4000);
            }
        }
    });

    // Validação de senha em tempo real
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password.length > 0 && password.length < 6) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '';
        }
        
        // Verificar confirmação de senha se já foi preenchida
        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordInput.style.borderColor = '#e74c3c';
        } else if (confirmPassword) {
            confirmPasswordInput.style.borderColor = '#27ae60';
        }
    });

    // Validação de confirmação de senha
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.style.borderColor = '#e74c3c';
        } else if (confirmPassword) {
            this.style.borderColor = '#27ae60';
        }
    });

    // Validação do CRM
    function validateCRM(crm) {
        const crmRegex = /^\d{4,6}-[A-Z]{2}$/;
        return crmRegex.test(crm);
    }

    // Validação do telefone
    function validatePhone(phone) {
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // Função para exibir mensagens
    function showMessage(message, type = 'info') {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Estilos da mensagem
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            max-width: 300px;
            word-wrap: break-word;
            ${type === 'success' ? 'background-color: #27ae60;' : ''}
            ${type === 'error' ? 'background-color: #e74c3c;' : ''}
            ${type === 'info' ? 'background-color: #3498db;' : ''}
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove mensagem após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Verificar se usuário já existe
    function checkUserExists(email, crm) {
        // Verifica tanto no sessionStorage quanto no localStorage para compatibilidade
        const sessionUsers = JSON.parse(sessionStorage.getItem('medSystemUsers') || '[]');
        const localUsers = JSON.parse(localStorage.getItem('medSystemUsers') || '[]');
        
        const allUsers = [...sessionUsers, ...localUsers];
        
        return allUsers.some(user => 
            user.email.toLowerCase() === email.toLowerCase() || 
            user.crm.toUpperCase() === crm.toUpperCase()
        );
    }

    // Salvar usuário (agora salva em ambos os storages para compatibilidade)
    function saveUser(userData) {
        // Salvar no sessionStorage (para compatibilidade com versão anterior)
        const sessionUsers = JSON.parse(sessionStorage.getItem('medSystemUsers') || '[]');
        sessionUsers.push(userData);
        sessionStorage.setItem('medSystemUsers', JSON.stringify(sessionUsers));
        
        // Salvar no localStorage (para persistência)
        const localUsers = JSON.parse(localStorage.getItem('medSystemUsers') || '[]');
        localUsers.push(userData);
        localStorage.setItem('medSystemUsers', JSON.stringify(localUsers));
        
        console.log('Usuário salvo:', userData.email);
    }

    // Função para migrar dados do sessionStorage para localStorage (se necessário)
    function migrateUsersToLocalStorage() {
        const sessionUsers = JSON.parse(sessionStorage.getItem('medSystemUsers') || '[]');
        const localUsers = JSON.parse(localStorage.getItem('medSystemUsers') || '[]');
        
        if (sessionUsers.length > 0 && localUsers.length === 0) {
            localStorage.setItem('medSystemUsers', JSON.stringify(sessionUsers));
            console.log('Migração de usuários do sessionStorage para localStorage concluída');
        }
    }

    // Submit do formulário
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coleta dos dados
        const formData = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            crm: crmInput.value.trim(),
            specialty: specialtySelect.value,
            phone: phoneInput.value.trim(),
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value,
            registrationDate: new Date().toISOString(),
            registrationId: Date.now().toString() // ID único para o registro
        };

        // Validações
        const errors = [];

        if (!formData.fullName || formData.fullName.length < 3) {
            errors.push('Nome completo deve ter pelo menos 3 caracteres.');
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push('E-mail inválido.');
        }

        if (!formData.crm || !validateCRM(formData.crm)) {
            errors.push('CRM deve estar no formato: 12345-SP');
        }

        if (!formData.specialty) {
            errors.push('Selecione uma especialidade.');
        }

        if (!formData.phone || !validatePhone(formData.phone)) {
            errors.push('Telefone deve estar no formato: (11) 99999-9999');
        }

        if (!formData.password || formData.password.length < 6) {
            errors.push('Senha deve ter pelo menos 6 caracteres.');
        }

        if (formData.password !== formData.confirmPassword) {
            errors.push('Senhas não coincidem.');
        }

        // Verificar se usuário já existe
        if (checkUserExists(formData.email, formData.crm)) {
            errors.push('E-mail ou CRM já cadastrado no sistema.');
        }

        // Exibir erros
        if (errors.length > 0) {
            showMessage(errors.join(' '), 'error');
            return;
        }

        // Simular delay de processamento
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Cadastrando...';
        submitButton.disabled = true;

        setTimeout(() => {
            try {
                // Remover confirmPassword antes de salvar
                delete formData.confirmPassword;
                
                // Salvar usuário
                saveUser(formData);
                
                // Gerar username para exibir
                const username = formData.email.split('@')[0].toLowerCase();
                
                showMessage(`Cadastro realizado com sucesso! Seu usuário é: ${username}`, 'success');
                
                // Resetar formulário
                registerForm.reset();
                
                // Redirecionar após 3 segundos para dar tempo de ver o username
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
                
            } catch (error) {
                showMessage('Erro ao processar cadastro. Tente novamente.', 'error');
                console.error('Erro no cadastro:', error);
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }, 1000);
    });

    // Limpar estilos de erro quando o usuário começar a digitar
    const inputs = [fullNameInput, emailInput, crmInput, phoneInput, passwordInput, confirmPasswordInput];
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });

    specialtySelect.addEventListener('change', function() {
        this.style.borderColor = '';
    });

    // Adicionar informações sobre o sistema de login
    function addLoginInfo() {
        const form = document.getElementById('registerForm');
        if (form) {
            const infoDiv = document.createElement('div');
            infoDiv.style.cssText = `
                background: #e8f4f8;
                border: 1px solid #bee5eb;
                border-radius: 5px;
                padding: 15px;
                margin-bottom: 20px;
                font-size: 0.9em;
                color: #0c5460;
            `;
            infoDiv.innerHTML = `
                <h5 style="margin: 0 0 10px 0; color: #0c5460;">ℹ️ Como fazer login após o cadastro:</h5>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Seu <strong>usuário</strong> será a parte antes do @ do seu e-mail</li>
                    <li>Exemplo: se seu e-mail for <code>joao.silva@gmail.com</code>, seu usuário será <code>joao.silva</code></li>
                    <li>Use a <strong>mesma senha</strong> que você está cadastrando aqui</li>
                </ul>
            `;
            
            form.parentNode.insertBefore(infoDiv, form);
        }
    }

    // Inicialização
    migrateUsersToLocalStorage();
    addLoginInfo();

    // Log inicial
    const totalUsers = JSON.parse(localStorage.getItem('medSystemUsers') || '[]').length;
    console.log('Sistema de Cadastro MedSystem inicializado');
    console.log('Usuários cadastrados:', totalUsers);
    
    if (totalUsers > 0) {
        console.log('Usuários existentes:', JSON.parse(localStorage.getItem('medSystemUsers') || '[]').map(u => ({
            email: u.email,
            username: u.email.split('@')[0],
            name: u.fullName
        })));
    }
});