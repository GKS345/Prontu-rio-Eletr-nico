
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
            loginTime: new Date().toISOString(),
            isLoggedIn: true
        };

        // Salva no sessionStorage (temporário)
        sessionStorage.setItem('medSystemUser', JSON.stringify(sessionData));

        // Salva também no localStorage para persistência (opcional)
        localStorage.setItem('medSystemLastUser', username);
    }

    // Função principal de login
    function handleLogin(username, password) {
        // Verifica se o usuário existe
        if (!validUsers[username]) {
            showMessage('Usuário não encontrado!');
            return false;
        }

        // Verifica a senha
        if (validUsers[username].password !== password) {
            showMessage('Senha incorreta!');
            return false;
        }

        // Login bem-sucedido
        const userData = validUsers[username];
        saveUserSession(username, userData);

        showMessage(`Bem-vindo(a), ${userData.name}!`, 'success');

        // Redireciona após 1.5 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

        return true;
    }

    // Event listener para o formulário
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = usernameField.value.trim();
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
                </div>
            `;
            hintsContainer.innerHTML += hintsHTML;
        }
    }

    // Função para verificar se já está logado
    function checkExistingSession() {
        const existingSession = sessionStorage.getItem('medSystemUser');
        if (existingSession) {
            try {
                const userData = JSON.parse(existingSession);
                if (userData.isLoggedIn) {
                    showMessage(`Você já está logado como ${userData.name}. Redirecionando...`, 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                    return true;
                }
            } catch (error) {
                // Remove sessão corrompida
                sessionStorage.removeItem('medSystemUser');
            }
        }
        return false;
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

    // Inicialização
    if (!checkExistingSession()) {
        addUserHints();
        prefillLastUser();
    }

    // Função global para logout (pode ser chamada de outras páginas)
    window.medSystemLogout = function () {
        sessionStorage.removeItem('medSystemUser');
        localStorage.removeItem('medSystemLastUser');
        window.location.href = 'index.html';
    };

    // Console info para desenvolvedores
    console.log('MedSystem Login System carregado');
    console.log('Usuários disponíveis:', Object.keys(validUsers));
});