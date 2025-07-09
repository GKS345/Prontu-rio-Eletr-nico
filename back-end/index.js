// Sistema de Login - MedSystem
document.addEventListener('DOMContentLoaded', function () {

    // Usuários pré-cadastrados para demonstração
    const validUsers = {
        'admin': {
            password: 'admin123',
            name: 'Administrador',
            role: 'admin',
            crm: 'ADMIN001'
        },
        'dr.silva': {
            password: 'medico123',
            name: 'Dr. João Silva',
            role: 'medico',
            crm: 'CRM12345'
        },
        'dra.santos': {
            password: 'medica123',
            name: 'Dra. Maria Santos',
            role: 'medico',
            crm: 'CRM67890'
        },
        'enfermeiro': {
            password: 'enf123',
            name: 'Carlos Enfermeiro',
            role: 'enfermeiro',
            coren: 'COREN11111'
        },
        'recepcionista': {
            password: 'rec123',
            name: 'Ana Recepcionista',
            role: 'recepcionista',
            id: 'REC001'
        }
    };

    // Função para carregar usuários cadastrados dinamicamente
    function loadRegisteredUsers() {
        const registeredUsers = JSON.parse(sessionStorage.getItem('medSystemUsers') || '[]');
        const dynamicUsers = {};

        registeredUsers.forEach(user => {
            // Criar username baseado no email (parte antes do @)
            const username = user.fullName;

            dynamicUsers[username] = {
                password: user.password,
                name: user.fullName,
                role: 'medico', // Usuários cadastrados são médicos por padrão
                crm: user.crm,
                email: user.email,
                specialty: user.specialty,
                phone: user.phone,
                isRegistered: true // Flag para identificar usuários cadastrados
            };
        });

        return dynamicUsers;
    }

    // Função para obter todos os usuários (pré-definidos + cadastrados)
    function getAllUsers() {
        const registeredUsers = loadRegisteredUsers();
        return { ...validUsers, ...registeredUsers };
    }

    // Elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');

    // Função para mostrar mensagens
    function showMessage(message, type = 'error') {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `login-message ${type}`;
        messageDiv.style.cssText = `
            padding: 10px 15px;
            margin: 15px 0;
            border-radius: 5px;
            text-align: center;
            font-weight: 500;
            ${type === 'error' ?
                'background: #fee; color: #c33; border: 1px solid #fcc;' :
                'background: #efe; color: #373; border: 1px solid #cfc;'
            }
        `;
        messageDiv.textContent = message;

        // Insere a mensagem antes do formulário
        loginForm.parentNode.insertBefore(messageDiv, loginForm);

        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Função para simular loading
    function showLoading(button) {
        const originalText = button.textContent;
        button.textContent = 'Entrando...';
        button.disabled = true;

        return function hideLoading() {
            button.textContent = originalText;
            button.disabled = false;
        };
    }

    // Função para salvar sessão do usuário
    function saveUserSession(username, userData) {
        const sessionData = {
            username: username,
            name: userData.name,
            role: userData.role,
            crm: userData.crm || userData.coren || userData.id,
            email: userData.email || '',
            specialty: userData.specialty || '',
            phone: userData.phone || '',
            loginTime: new Date().toISOString(),
            isLoggedIn: true,
            isRegistered: userData.isRegistered || false
        };

        // Salva no sessionStorage (temporário)
        sessionStorage.setItem('medSystemUser', JSON.stringify(sessionData));

        // Salva também no localStorage para persistência (opcional)
        localStorage.setItem('medSystemLastUser', username);
    }

    // Função principal de login
    function handleLogin(username, password) {
        const allUsers = getAllUsers();

        // Verifica se o usuário existe
        if (!allUsers[username]) {
            showMessage('Usuário não encontrado!');
            return false;
        }

        // Verifica a senha
        if (allUsers[username].password !== password) {
            showMessage('Senha incorreta!');
            return false;
        }

        // Login bem-sucedido
        const userData = allUsers[username];
        saveUserSession(username, userData);

        const welcomeMessage = userData.isRegistered ?
            `Bem-vindo(a), Dr(a). ${userData.name}!` :
            `Bem-vindo(a), ${userData.name}!`;

        showMessage(welcomeMessage, 'success');

        // Redireciona após 1.5 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

        return true;
    }

    // Event listener para o formulário
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = usernameField.value.trim().toLowerCase();
        const password = passwordField.value.trim();

        // Validação básica
        if (!username || !password) {
            showMessage('Por favor, preencha todos os campos!');
            return;
        }

        // Mostra loading
        const hideLoading = showLoading(e.target.querySelector('button[type="submit"]'));

        // Simula delay de rede (opcional)
        setTimeout(() => {
            const loginSuccess = handleLogin(username, password);
            if (!loginSuccess) {
                hideLoading();
            }
        }, 800);
    });

    // Adiciona dicas de usuários válidos
    function addUserHints() {
        const hintsContainer = document.querySelector('.login-hints');
        if (hintsContainer) {
            const registeredUsers = loadRegisteredUsers();
            const registeredCount = Object.keys(registeredUsers).length;

            let registeredUsersHTML = '';
            if (registeredCount > 0) {
                registeredUsersHTML = `
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                        <h6 style="margin-bottom: 5px; color: #27ae60;">📋 Usuários Cadastrados (${registeredCount}):</h6>
                        <div style="font-size: 0.8em; color: #666;">
                            ${Object.keys(registeredUsers).map(username =>
                    `<div><strong>${username}</strong> (${registeredUsers[username].specialty})</div>`
                ).join('')}
                        </div>
                        <div style="font-size: 0.75em; color: #999; margin-top: 5px;">
                            💡 Use o nome antes do @ do seu email como usuário
                        </div>
                    </div>
                `;
            }

            const hintsHTML = `
                <div style="margin-top: 15px; font-size: 0.9em; color: #666;">
                    <h5 style="margin-bottom: 8px; color: #333;">👥 Usuários de Demonstração:</h5>
                    <div style="display: grid; gap: 5px; font-size: 0.85em;">
                        <div><strong>admin</strong> / admin123 (Administrador)</div>
                        <div><strong>dr.silva</strong> / medico123 (Médico)</div>
                        <div><strong>dra.santos</strong> / medica123 (Médica)</div>
                        <div><strong>enfermeiro</strong> / enf123 (Enfermeiro)</div>
                        <div><strong>recepcionista</strong> / rec123 (Recepcionista)</div>
                    </div>
                    ${registeredUsersHTML}
                </div>
            `;
            hintsContainer.innerHTML += hintsHTML;
        }
    }

    // Função para pré-preencher o último usuário
    function prefillLastUser() {
        const lastUser = localStorage.getItem('medSystemLastUser');
        if (lastUser && usernameField) {
            usernameField.value = lastUser;
            passwordField.focus();
        }
    }

    // Adiciona eventos de teclado para melhor UX
    usernameField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            passwordField.focus();
        }
    });

    passwordField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    // Adiciona sugestão de username baseado em email
    usernameField.addEventListener('input', function (e) {
        const value = e.target.value.toLowerCase();
        const allUsers = getAllUsers();

        // Se o usuário digitar algo que parece com email, sugerir o username
        if (value.includes('@')) {
            const suggestedUsername = value.split('@')[0];
            if (allUsers[suggestedUsername]) {
                showMessage(`💡 Tente usar: ${suggestedUsername}`, 'info');
                setTimeout(() => {
                    const msg = document.querySelector('.login-message');
                    if (msg) msg.remove();
                }, 3000);
            }
        }
    });

    // Inicialização
    addUserHints();
    prefillLastUser();

    // Função global para logout (pode ser chamada de outras páginas)
    window.medSystemLogout = function () {
        sessionStorage.removeItem('medSystemUser');
        localStorage.removeItem('medSystemLastUser');
        window.location.href = 'index.html';
    };
});