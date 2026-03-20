<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Médico - Relatórios</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="dashboard">
        <nav class="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo">MedSystem</div>
            </div>
            <ul class="sidebar-menu">
                <li><a href="dashboard.html">📊 Visão Geral</a></li>
                <li><a href="patients.html">👥 Pacientes</a></li>
                <li><a href="new-patient.html">➕ Novo Paciente</a></li>
                <li><a href="appointments.html">📅 Consultas</a></li>
                <li><a href="exams.html">🔬 Exames</a></li>
                <li><a href="prescriptions.html">💊 Receitas</a></li>
                <li><a href="reports.html" class="active">📋 Relatórios</a></li>
                <li><a href="./index.html">🚪 Sair</a></li>
            </ul>
        </nav>

        <main class="main-content">
            <div class="header">
                <h1 class="page-title">Relatórios</h1>
                <div class="user-info">
                    <span>Dr. João Silva</span>
                    <div class="user-avatar">JS</div>
                </div>
            </div>

            <div class="content-area">
                <!-- Filtros de Relatório -->
                <div class="exam-card">
                    <div class="exam-header">
                        <h2 class="exam-title">Filtros de Relatório</h2>
                    </div>
                    <form id="reportFilters">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="reportType">Tipo de Relatório:</label>
                                <select id="reportType" onchange="updateReportOptions()">
                                    <option value="">Selecione o tipo</option>
                                    <option value="patients">Relatório de Pacientes</option>
                                    <option value="appointments">Relatório de Consultas</option>
                                    <option value="prescriptions">Relatório de Receitas</option>
                                    <option value="exams">Relatório de Exames</option>
                                    <option value="financial">Relatório Financeiro</option>
                                    <option value="statistics">Relatório Estatístico</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="dateFrom">Data Inicial:</label>
                                <input type="date" id="dateFrom">
                            </div>
                            
                            <div class="form-group">
                                <label for="dateTo">Data Final:</label>
                                <input type="date" id="dateTo">
                            </div>
                            
                            <div class="form-group">
                                <label for="status">Status:</label>
                                <select id="status">
                                    <option value="">Todos</option>
                                    <option value="active">Ativo</option>
                                    <option value="completed">Concluído</option>
                                    <option value="pending">Pendente</option>
                                    <option value="cancelled">Cancelado</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group" id="additionalFilters" style="display: none;">
                            <label for="specificFilter">Filtro Específico:</label>
                            <select id="specificFilter">
                                <!-- Options will be populated by JavaScript -->
                            </select>
                        </div>
                        
                        <div style="margin-top: 20px;">
                            <button type="button" class="btn" onclick="generateReport()">📊 Gerar Relatório</button>
                            <button type="button" class="btn btn-secondary" onclick="clearFilters()">🔄 Limpar Filtros</button>
                        </div>
                    </form>
                </div>

                <!-- Relatórios Rápidos -->
                <div class="stats-grid">
                    <div class="stat-card" onclick="generateQuickReport('today')">
                        <div class="stat-number">28</div>
                        <div class="stat-label">Atendimentos Hoje</div>
                        <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">Clique para ver detalhes</div>
                    </div>
                    <div class="stat-card" onclick="generateQuickReport('week')">
                        <div class="stat-number">156</div>
                        <div class="stat-label">Esta Semana</div>
                        <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">Clique para ver detalhes</div>
                    </div>
                    <div class="stat-card" onclick="generateQuickReport('month')">
                        <div class="stat-number">642</div>
                        <div class="stat-label">Este Mês</div>
                        <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">Clique para ver detalhes</div>
                    </div>
                    <div class="stat-card" onclick="generateQuickReport('revenue')">
                        <div class="stat-number">R$ 28.450</div>
                        <div class="stat-label">Receita Mensal</div>
                        <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">Clique para ver detalhes</div>
                    </div>
                </div>

                <!-- Área de Resultados -->
                <div id="reportResults" style="display: none;">
                    <h2 style="margin: 30px 0 20px 0; color: #2c3e50;">Resultado do Relatório</h2>
                    
                    <div class="exam-card">
                        <div class="exam-header">
                            <h3 class="exam-title" id="reportTitle">Relatório Gerado</h3>
                            <div style="display: flex; gap: 10px;">
                                <button class="btn-small btn-primary" onclick="exportReport('pdf')">📄 PDF</button>
                                <button class="btn-small btn-success" onclick="exportReport('excel')">📊 Excel</button>
                                <button class="btn-small btn-warning" onclick="exportReport('csv')">📋 CSV</button>
                                <button class="btn-small btn-danger" onclick="printReport()">🖨️ Imprimir</button>
                            </div>
                        </div>
                        
                        <div id="reportContent">
                            <!-- Conteúdo será gerado dinamicamente -->
                        </div>
                    </div>
                </div>

                <!-- Relatórios Salvos -->
                <h2 style="margin: 40px 0 20px 0; color: #2c3e50;">Relatórios Salvos</h2>
                
                <div class="patient-card">
                    <div class="patient-name">Relatório Mensal - Junho 2025</div>
                    <div class="patient-info">
                        <strong>Tipo:</strong> Relatório Estatístico<br>
                        <strong>Período:</strong> 01/06/2025 - 30/06/2025<br>
                        <strong>Gerado em:</strong> 28/06/2025 14:30<br>
                        <strong>Páginas:</strong> 12
                    </div>
                    <div class="patient-actions">
                        <button class="btn-small btn-primary" onclick="viewSavedReport('1')">👁️ Visualizar</button>
                        <button class="btn-small btn-success" onclick="downloadReport('1')">⬇️ Download</button>
                        <button class="btn-small btn-warning" onclick="shareReport('1')">📤 Compartilhar</button>
                        <button class="btn-small btn-danger" onclick="deleteSavedReport('1')">🗑️ Excluir</button>
                    </div>
                </div>

                <div class="patient-card">
                    <div class="patient-name">Relatório de Receitas - Semana 25</div>
                    <div class="patient-info">
                        <strong>Tipo:</strong> Relatório de Receitas<br>
                        <strong>Período:</strong> 17/06/2025 - 23/06/2025<br>
                        <strong>Gerado em:</strong> 24/06/2025 09:15<br>
                        <strong>Páginas:</strong> 8
                    </div>
                    <div class="patient-actions">
                        <button class="btn-small btn-primary" onclick="viewSavedReport('2')">👁️ Visualizar</button>
                        <button class="btn-small btn-success" onclick="downloadReport('2')">⬇️ Download</button>
                        <button class="btn-small btn-warning" onclick="shareReport('2')">📤 Compartilhar</button>
                        <button class="btn-small btn-danger" onclick="deleteSavedReport('2')">🗑️ Excluir</button>
                    </div>
                </div>

                <div class="patient-card">
                    <div class="patient-name">Relatório Financeiro - Q2 2025</div>
                    <div class="patient-info">
                        <strong>Tipo:</strong> Relatório Financeiro<br>
                        <strong>Período:</strong> 01/04/2025 - 30/06/2025<br>
                        <strong>Gerado em:</strong> 20/06/2025 16:45<br>
                        <strong>Páginas:</strong> 15
                    </div>
                    <div class="patient-actions">
                        <button class="btn-small btn-primary" onclick="viewSavedReport('3')">👁️ Visualizar</button>
                        <button class="btn-small btn-success" onclick="downloadReport('3')">⬇️ Download</button>
                        <button class="btn-small btn-warning" onclick="shareReport('3')">📤 Compartilhar</button>
                        <button class="btn-small btn-danger" onclick="deleteSavedReport('3')">🗑️ Excluir</button>
                    </div>
                </div>

                <!-- Templates de Relatório -->
                <h2 style="margin: 40px 0 20px 0; color: #2c3e50;">Templates de Relatório</h2>
                
                <div class="form-grid">
                    <div class="exam-card">
                        <div class="exam-header">
                            <h3 class="exam-title">📊 Relatório Estatístico</h3>
                        </div>
                        <p style="margin-bottom: 15px; color: #666;">
                            Análise completa de atendimentos, receitas e exames por período.
                        </p>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-small btn-primary" onclick="useTemplate('statistics')">📋 Usar Template</button>
                            <button class="btn-small btn-secondary" onclick="previewTemplate('statistics')">👁️ Prévia</button>
                        </div>
                    </div>

                    <div class="exam-card">
                        <div class="exam-header">
                            <h3 class="exam-title">💰 Relatório Financeiro</h3>
                        </div>
                        <p style="margin-bottom: 15px; color: #666;">
                            Análise de receitas, despesas e faturamento por período.
                        </p>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-small btn-primary" onclick="useTemplate('financial')">📋 Usar Template</button>
                            <button class="btn-small btn-secondary" onclick="previewTemplate('financial')">👁️ Prévia</button>
                        </div>
                    </div>

                    <div class="exam-card">
                        <div class="exam-header">
                            <h3 class="exam-title">👥 Relatório de Pacientes</h3>
                        </div>
                        <p style="margin-bottom: 15px; color: #666;">
                            Cadastros, consultas e histórico médico dos pacientes.
                        </p>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-small btn-primary" onclick="useTemplate('patients')">📋 Usar Template</button>
                            <button class="btn-small btn-secondary" onclick="previewTemplate('patients')">👁️ Prévia</button>
                        </div>
                    </div>

                    <div class="exam-card">
                        <div class="exam-header">
                            <h3 class="exam-title">💊 Relatório de Medicamentos</h3>
                        </div>
                        <p style="margin-bottom: 15px; color: #666;">
                            Receitas emitidas, medicamentos mais prescritos e estatísticas.
                        </p>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-small btn-primary" onclick="useTemplate('medications')">📋 Usar Template</button>
                            <button class="btn-small btn-secondary" onclick="previewTemplate('medications')">👁️ Prévia</button>
                        </div>
                    </div>
                </div>

                <!-- Agendamento de Relatórios -->
                <h2 style="margin: 40px 0 20px 0; color: #2c3e50;">Agendamento de Relatórios</h2>
                
                <div class="exam-card">
                    <div class="exam-header">
                        <h3 class="exam-title">📅 Relatórios Automáticos</h3>
                    </div>
                    
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Relatório</th>
                                <th>Frequência</th>
                                <th>Próxima Execução</th>
                                <th>Destinatários</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Relatório Mensal</td>
                                <td>Mensal</td>
                                <td>01/07/2025 08:00</td>
                                <td>admin@medisystem.com</td>
                                <td><span class="status-badge status-active">Ativo</span></td>
                                <td>
                                    <button class="btn-small btn-warning" onclick="editScheduledReport('1')">✏️ Editar</button>
                                    <button class="btn-small btn-danger" onclick="deleteScheduledReport('1')">🗑️ Excluir</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Relatório Semanal</td>
                                <td>Semanal</td>
                                <td>07/07/2025 07:00</td>
                                <td>secretaria@medisystem.com</td>
                                <td><span class="status-badge status-active">Ativo</span></td>
                                <td>
                                    <button class="btn-small btn-warning" onclick="editScheduledReport('2')">✏️ Editar</button>
                                    <button class="btn-small btn-danger" onclick="deleteScheduledReport('2')">🗑️ Excluir</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 20px;">
                        <button class="btn" onclick="showScheduleForm()">⏰ Agendar Novo Relatório</button>
                    </div>
                </div>

                <!-- Formulário de Agendamento (oculto) -->
                <div id="scheduleForm" style="display: none; margin-top: 20px;">
                    <div class="exam-card">
                        <div class="exam-header">
                            <h3 class="exam-title">📅 Agendar Relatório</h3>
                        </div>
                        
                        <form>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="scheduleReportType">Tipo de Relatório:</label>
                                    <select id="scheduleReportType" required>
                                        <option value="">Selecione</option>
                                        <option value="statistics">Estatístico</option>
                                        <option value="financial">Financeiro</option>
                                        <option value="patients">Pacientes</option>
                                        <option value="medications">Medicamentos</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="frequency">Frequência:</label>
                                    <select id="frequency" required>
                                        <option value="">Selecione</option>
                                        <option value="daily">Diário</option>
                                        <option value="weekly">Semanal</option>
                                        <option value="monthly">Mensal</option>
                                        <option value="quarterly">Trimestral</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="scheduleTime">Horário:</label>
                                    <input type="time" id="scheduleTime" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="recipients">Destinatários:</label>
                                    <input type="email" id="recipients" placeholder="email@exemplo.com" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="scheduleNotes">Observações:</label>
                                <textarea id="scheduleNotes" rows="3" placeholder="Observações sobre o relatório agendado..."></textarea>
                            </div>
                            
                            <div style="margin-top: 20px; display: flex; gap: 10px;">
                                <button type="submit" class="btn">💾 Salvar Agendamento</button>
                                <button type="button" class="btn btn-secondary" onclick="hideScheduleForm()">❌ Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="../back-end/database.js"></script>
    <script src="../back-end/reports.js"></script>
</body>
</html>