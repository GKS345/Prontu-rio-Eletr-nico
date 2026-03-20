CREATE DATABASE IF NOT EXISTS medsystem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medsystem;

CREATE TABLE IF NOT EXISTS usuarios (
    id              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    username        VARCHAR(100)     NOT NULL UNIQUE,
    senha_hash      VARCHAR(255)     NOT NULL,
    nome_completo   VARCHAR(150)     NOT NULL,
    email           VARCHAR(150)     NOT NULL UNIQUE,
    telefone        VARCHAR(20)          NULL,
    perfil          ENUM('admin','medico','enfermeiro','recepcionista') NOT NULL DEFAULT 'medico',
    crm             VARCHAR(20)          NULL,
    coren           VARCHAR(20)          NULL,
    especialidade   VARCHAR(100)         NULL,
    ativo           TINYINT(1)       NOT NULL DEFAULT 1,
    criado_em       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_email  (email),
    INDEX idx_perfil (perfil),
    INDEX idx_ativo  (ativo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tokens_sessao (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id  INT UNSIGNED    NOT NULL,
    token       VARCHAR(512)    NOT NULL UNIQUE,
    expira_em   DATETIME        NOT NULL,
    criado_em   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token  (token(255)),
    INDEX idx_expira (expira_em)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pacientes (
    id                  INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    nome                VARCHAR(150)      NOT NULL,
    data_nascimento     DATE                  NULL,
    idade               SMALLINT UNSIGNED     NULL,
    cpf                 VARCHAR(14)           NULL UNIQUE,
    rg                  VARCHAR(20)           NULL,
    telefone            VARCHAR(20)           NULL,
    email               VARCHAR(150)          NULL,
    cep                 VARCHAR(9)            NULL,
    logradouro          VARCHAR(200)          NULL,
    numero              VARCHAR(10)           NULL,
    complemento         VARCHAR(100)          NULL,
    bairro              VARCHAR(100)          NULL,
    cidade              VARCHAR(100)          NULL,
    estado              CHAR(2)               NULL,
    endereco_completo   TEXT                  NULL,
    tipo_sanguineo      ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NULL,
    alergias            TEXT                  NULL,
    peso_kg             DECIMAL(5,2)          NULL,
    altura_cm           SMALLINT UNSIGNED     NULL,
    observacoes         TEXT                  NULL,
    contato_emergencia  VARCHAR(150)          NULL,
    slug                VARCHAR(200)          NULL UNIQUE,
    ultima_consulta     DATE                  NULL,
    ativo               TINYINT(1)        NOT NULL DEFAULT 1,
    criado_por          INT UNSIGNED          NULL,
    criado_em           DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_nome           (nome),
    INDEX idx_cpf            (cpf),
    INDEX idx_slug           (slug),
    INDEX idx_ativo          (ativo),
    INDEX idx_ultima_consult (ultima_consulta)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS consultas (
    id              INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    paciente_id     INT UNSIGNED      NOT NULL,
    medico_id       INT UNSIGNED          NULL,
    nome_paciente   VARCHAR(150)      NOT NULL,
    telefone        VARCHAR(20)           NULL,
    data            DATE              NOT NULL,
    horario         TIME              NOT NULL,
    duracao_min     SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    tipo            VARCHAR(100)      NOT NULL,
    status          ENUM('agendada','confirmada','em_andamento','concluida','cancelada') NOT NULL DEFAULT 'agendada',
    notas           TEXT                  NULL,
    criado_em       DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (medico_id)   REFERENCES usuarios(id)  ON DELETE SET NULL,
    INDEX idx_data        (data),
    INDEX idx_status      (status),
    INDEX idx_paciente    (paciente_id),
    INDEX idx_data_status (data, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS exames (
    id                  INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    paciente_id         INT UNSIGNED      NOT NULL,
    medico_id           INT UNSIGNED          NULL,
    nome_paciente       VARCHAR(150)      NOT NULL,
    codigo_paciente     VARCHAR(20)           NULL,
    titulo              VARCHAR(200)      NOT NULL,
    tipo                VARCHAR(100)      NOT NULL,
    data                DATE              NOT NULL,
    horario             TIME                  NULL,
    status              ENUM('agendado','realizado','resultado_pronto','cancelado','pendente') NOT NULL DEFAULT 'agendado',
    local               VARCHAR(200)          NULL,
    indicacao           TEXT                  NULL,
    observacoes         TEXT                  NULL,
    resultado           TEXT                  NULL,
    tem_resultado       TINYINT(1)        NOT NULL DEFAULT 0,
    urgente             TINYINT(1)        NOT NULL DEFAULT 0,
    resultado_enviado   TINYINT(1)        NOT NULL DEFAULT 0,
    no_historico        TINYINT(1)        NOT NULL DEFAULT 0,
    criado_em           DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (medico_id)   REFERENCES usuarios(id)  ON DELETE SET NULL,
    INDEX idx_data     (data),
    INDEX idx_status   (status),
    INDEX idx_paciente (paciente_id),
    INDEX idx_tipo     (tipo),
    INDEX idx_urgente  (urgente)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS receitas (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    paciente_id     INT UNSIGNED NOT NULL,
    medico_id       INT UNSIGNED     NULL,
    nome_paciente   VARCHAR(150) NOT NULL,
    cpf_paciente    VARCHAR(14)      NULL,
    data            DATE         NOT NULL,
    diagnostico     TEXT             NULL,
    observacoes     TEXT             NULL,
    status          ENUM('Ativa','Finalizada','Pendente','Cancelada') NOT NULL DEFAULT 'Ativa',
    criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (medico_id)   REFERENCES usuarios(id)  ON DELETE SET NULL,
    INDEX idx_data     (data),
    INDEX idx_status   (status),
    INDEX idx_paciente (paciente_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS receita_medicamentos (
    id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    receita_id  INT UNSIGNED      NOT NULL,
    nome        VARCHAR(200)      NOT NULL,
    dosagem     VARCHAR(100)          NULL,
    frequencia  VARCHAR(100)          NULL,
    duracao     VARCHAR(100)          NULL,
    instrucoes  TEXT                  NULL,
    ordem       SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    FOREIGN KEY (receita_id) REFERENCES receitas(id) ON DELETE CASCADE,
    INDEX idx_receita (receita_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS historico_paciente (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    paciente_id     INT UNSIGNED    NOT NULL,
    usuario_id      INT UNSIGNED        NULL,
    tipo_evento     ENUM('consulta','exame','receita','internacao','procedimento','observacao') NOT NULL,
    referencia_id   INT UNSIGNED        NULL,
    titulo          VARCHAR(200)    NOT NULL,
    descricao       TEXT                NULL,
    data_evento     DATE            NOT NULL,
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE SET NULL,
    INDEX idx_paciente (paciente_id),
    INDEX idx_data     (data_evento),
    INDEX idx_tipo     (tipo_evento)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS relatorios_salvos (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id  INT UNSIGNED     NULL,
    tipo        VARCHAR(50)  NOT NULL,
    titulo      VARCHAR(200)     NULL,
    filtros     JSON             NULL,
    dados       LONGTEXT         NULL,
    criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_tipo      (tipo),
    INDEX idx_usuario   (usuario_id),
    INDEX idx_criado_em (criado_em)
) ENGINE=InnoDB;

INSERT INTO usuarios (username, senha_hash, nome_completo, email, perfil, crm, especialidade, telefone) VALUES
('admin',         'admin123',   'Administrador',     'admin@medsystem.local',         'admin',         'ADMIN001',    NULL,            NULL),
('dr.silva',      'medico123',  'Dr. João Silva',    'dr.silva@medsystem.local',      'medico',        'CRM12345-SP', 'Clínica Geral', '(11) 99999-1111'),
('dra.santos',    'medica123',  'Dra. Maria Santos', 'dra.santos@medsystem.local',    'medico',        'CRM67890-SP', 'Cardiologia',   '(11) 99999-2222'),
('enfermeiro',    'enf123',     'Carlos Enfermeiro', 'enfermeiro@medsystem.local',    'enfermeiro',    NULL,          NULL,            '(11) 99999-3333'),
('recepcionista', 'rec123',     'Ana Recepcionista', 'recepcionista@medsystem.local', 'recepcionista', NULL,          NULL,            '(11) 99999-4444');

INSERT INTO pacientes (nome, data_nascimento, idade, cpf, telefone, email, cidade, estado, tipo_sanguineo, slug, ultima_consulta, criado_por) VALUES
('Maria Santos Silva',    '1980-03-15', 45, '123.456.789-00', '(11) 99999-9999', 'maria@email.com',   'São Paulo', 'SP', 'O+',  'maria',   '2025-06-20', 1),
('José Oliveira Costa',   '1963-07-22', 62, '987.654.321-00', '(11) 88888-8888', 'jose@email.com',    'São Paulo', 'SP', 'A+',  'jose',    '2025-06-15', 1),
('Ana Costa Pereira',     '1997-11-05', 28, '456.789.123-00', '(11) 77777-7777', 'ana@email.com',     'São Paulo', 'SP', 'B-',  'ana',     '2025-06-10', 1),
('Roberto Ferreira Lima', '1973-02-28', 52, '321.654.987-00', '(11) 66666-6666', 'roberto@email.com', 'São Paulo', 'SP', 'AB+', 'roberto', '2025-06-05', 1),
('Carla Mendes Souza',    '1987-09-14', 38, '159.753.486-00', '(11) 55555-5555', 'carla@email.com',   'São Paulo', 'SP', 'O-',  'carla',   '2025-06-01', 1);

INSERT INTO consultas (paciente_id, medico_id, nome_paciente, telefone, data, horario, duracao_min, tipo, status) VALUES
(1, 2, 'Maria Santos Silva',    '(11) 99999-1234', '2025-06-30', '08:00', 30, 'Consulta de rotina',    'confirmada'),
(2, 2, 'José Oliveira Costa',   '(11) 99999-5678', '2025-06-30', '09:00', 30, 'Retorno pós-cirúrgico', 'em_andamento'),
(3, 3, 'Ana Costa Pereira',     '(11) 99999-9012', '2025-06-30', '10:00', 30, 'Primeira consulta',     'agendada'),
(4, 3, 'Roberto Ferreira Lima', '(11) 99999-3456', '2025-07-01', '14:00', 30, 'Consulta cardiológica', 'confirmada'),
(5, 2, 'Carla Mendes Souza',    '(11) 99999-7890', '2025-07-01', '15:00', 30, 'Acompanhamento',        'agendada');

INSERT INTO exames (paciente_id, medico_id, nome_paciente, codigo_paciente, titulo, tipo, data, horario, status, local, indicacao, observacoes, resultado, tem_resultado) VALUES
(1, 2, 'Maria Santos Silva',    '#001', 'Hemograma Completo', 'laboratorio', '2025-06-30', '08:00', 'realizado',        'Lab Central',        'Rotina pré-operatória', 'Paciente em jejum de 12h',          'Valores dentro da normalidade',    1),
(2, 2, 'José Oliveira Costa',   '#002', 'Raio-X Tórax',       'imagem',      '2025-06-29', '10:00', 'resultado_pronto', 'Radiologia Central', 'Tosse persistente',     NULL,                                'Estruturas dentro da normalidade', 1),
(3, 3, 'Ana Costa Pereira',     '#003', 'Glicemia em Jejum',  'laboratorio', '2025-07-02', '07:30', 'agendado',         'Lab Central',        'Triagem metabólica',    'Paciente deve estar em jejum de 8h', NULL,                              0);

INSERT INTO receitas (paciente_id, medico_id, nome_paciente, cpf_paciente, data, diagnostico, status) VALUES
(1, 2, 'Maria Santos Silva',  '123.456.789-00', '2025-06-28', 'Infecção respiratória alta', 'Ativa'),
(2, 3, 'José Oliveira Costa', '987.654.321-00', '2025-06-25', 'Hipertensão arterial leve',  'Ativa');

INSERT INTO receita_medicamentos (receita_id, nome, dosagem, frequencia, duracao, instrucoes, ordem) VALUES
(1, 'Amoxicilina 500mg',      '1 cápsula',      'a cada 8 horas',                '7 dias',            'Tomar com alimento para reduzir irritação gástrica', 1),
(1, 'Dipirona 500mg',         '1 comprimido',   'a cada 6 horas se dor ou febre','conforme necessário','Não exceder 4 comprimidos por dia',                 2),
(2, 'Losartana 50mg',         '1 comprimido',   '1x ao dia',                     'uso contínuo',      'Tomar preferencialmente no mesmo horário',           1),
(2, 'Hidroclorotiazida 25mg', '1/2 comprimido', '1x ao dia',                     'uso contínuo',      'Tomar pela manhã',                                   2);
