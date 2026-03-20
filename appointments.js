<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MedSystem - Prontuário Online</title>
    <link rel="stylesheet" href="Front-end/styles.css">
</head>
<body>
    <!-- LOGIN SCREEN -->
    <div id="loginScreen" class="screen">
        <div class="login-screen">
            <div class="logo">🏥 MedSystem</div>
            <p class="subtitle">Sistema de Prontuário Eletrônico</p>
            
            <div class="login-hints">
                <h4>👤 Acesso Rápido:</h4>
                <p>Clique no botão verde abaixo para acessar diretamente o sistema</p>
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Usuário</label>
                    <input type="text" id="username" placeholder="Digite seu usuário" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input type="password" id="password" placeholder="Digite sua senha" required>
                </div>
                
                <button type="submit" class="btn">Entrar</button>
                <button type="button" class="btn btn-secondary" onclick="window.location.href='Front-end/register.html'">Cadastrar Usuário</button>
            </form>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e1e5e9;">
                <button type="button" class="btn" onclick="window.location.href='Front-end/dashboard.html'" style="background: #27ae60;">
                    🚀 Acesso Direto ao Dashboard (Demo)
                </button>
            </div>
        </div>
    </div>

    <script src="./back-end/database.js"></script>
    <script src="/back-end/index.js"></script>
</body>
</html>