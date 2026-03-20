// ============================================================
//  index.js  –  MedSystem | Login
//  Usa DB.auth para autenticar contra o banco de dados.
//  Depende de: database.js
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // Elementos do DOM
    const loginForm     = document.getElementById('loginForm');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');

    // ----------------------------------------------------------
    //  Mensagens de feedback
    // ----------------------------------------------------------
    function showMessage(message, type = 'error') {
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) existingMessage.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `login-message ${type}`;
        messageDiv.style.cssText = `
            padding: 10px 15px;
            margin: 15px 0;
            border-radius: 5px;
            text-align: center;
            font-weight: 500;
            ${type === 'error'   ? 'background:#fee;color:#c33;border:1px solid #fcc;' : ''}
            ${type === 'success' ? 'background:#efe;color:#373;border:1px solid #cfc;' : ''}
            ${type === 'info'    ? 'background:#e8f4f8;color:#0c5460;border:1px solid #bee5eb;' : ''}
        `;
        messageDiv.textContent = message;
        loginForm.parentNode.insertBefore(messageDiv, loginForm);

        setTimeout(() => { if (messageDiv.parentNode) messageDiv.remove(); }, 5000);
    }

    // ----------------------------------------------------------
    //  Loading no botão
    // ----------------------------------------------------------
    function showLoading(button) {
        const originalText = button.textContent;
        button.textContent = 'Entrando...';
        button.disabled    = true;
        return () => {
            button.textContent = originalText;
            button.disabled    = false;
        };
    }

    // ----------------------------------------------------------
    //  Salva sessão após login bem-sucedido
    // ----------------------------------------------------------
    function saveUserSession(username, userData) {
        const sessionData = {
            username,
            name:      userData.name,
            role:      userData.role,
            crm:       userData.crm || userData.coren || userData.id || '',
            email:     userData.email     || '',
            specialty: userData.specialty || '',
            phone:     userData.phone     || '',
            token:     userData.token     || '',      // JWT retornado pelo banco
            loginTime: new Date().toISOString(),
            isLoggedIn: true,
        };

        sessionStorage.setItem('medSystemUser', JSON.stringify(sessionData));
        localStorage.setItem('medSystemLastUser', username);
    }

    // ----------------------------------------------------------
    //  Login principal — chama DB.auth.login()
    // ----------------------------------------------------------
    async function handleLogin(username, password) {
        try {
            // Chamada ao banco via database.js
            const response = await DB.auth.login(username, password);

            // Espera-se que o servidor retorne: { user: {...}, token: '...' }
            const userData = response.user || response;
            saveUserSession(username, { ...userData, token: response.token });

            showMessage(`Bem-vindo(a), ${userData.name}!`, 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

            return true;

        } catch (err) {
            // DBError traz a mensagem do servidor (ex: "Usuário não encontrado")
            const msg = err instanceof DBError
                ? err.message
                : 'Erro ao conectar ao servidor. Tente novamente.';
            showMessage(msg);
            return false;
        }
    }

    // ----------------------------------------------------------
    //  Submit do formulário
    // ----------------------------------------------------------
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = usernameField.value.trim().toLowerCase();
        const password = passwordField.value.trim();

        if (!username || !password) {
            showMessage('Por favor, preencha todos os campos!');
            return;
        }

        const hideLoading = showLoading(e.target.querySelector('button[type="submit"]'));

        handleLogin(username, password).then(success => {
            if (!success) hideLoading();
        });
    });

    // ----------------------------------------------------------
    //  UX: sugestão de username por e-mail digitado
    // ----------------------------------------------------------
    usernameField.addEventListener('input', function (e) {
        const value = e.target.value.toLowerCase();
        if (value.includes('@')) {
            const suggested = value.split('@')[0];
            showMessage(`💡 Tente usar: ${suggested}`, 'info');
            setTimeout(() => {
                const msg = document.querySelector('.login-message');
                if (msg) msg.remove();
            }, 3000);
        }
    });

    usernameField.addEventListener('keypress', e => {
        if (e.key === 'Enter') passwordField.focus();
    });

    passwordField.addEventListener('keypress', e => {
        if (e.key === 'Enter') loginForm.dispatchEvent(new Event('submit'));
    });

    // ----------------------------------------------------------
    //  Pré-preenche o último usuário logado
    // ----------------------------------------------------------
    const lastUser = localStorage.getItem('medSystemLastUser');
    if (lastUser && usernameField) {
        usernameField.value = lastUser;
        passwordField.focus();
    }

    // ----------------------------------------------------------
    //  Função global de logout (usada por outras páginas)
    // ----------------------------------------------------------
    window.medSystemLogout = async function () {
        try {
            await DB.auth.logout();
        } catch (_) {
            // Ignora erros no logout — limpa sessão de qualquer forma
        }
        sessionStorage.removeItem('medSystemUser');
        localStorage.removeItem('medSystemLastUser');
        window.location.href = 'index.html';
    };
});
