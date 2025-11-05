-- Diz ao MySQL para usar o banco de dados que o Docker Compose criou
USE db_troca_livros;

-- Tabela 'livros' (sem dependências)
CREATE TABLE IF NOT EXISTS livros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    google_book_id VARCHAR(50),
    titulo VARCHAR(500) NOT NULL,
    autor VARCHAR(255),
    url_capa VARCHAR(1024),
    descricao_geral TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 'usuarios' (sem dependências)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(100),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 'negociacoes' (sem dependências)
CREATE TABLE IF NOT EXISTS negociacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(50) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 'inventario' (depende de 'usuarios' e 'livros')
CREATE TABLE IF NOT EXISTS inventario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    estado_conservacao VARCHAR(50),
    valor_troca DECIMAL(10, 2),
    descricao_usuario TEXT,
    disponivel_para_troca TINYINT(1) DEFAULT 1,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

-- Tabela 'negociacao_participantes' (depende de 'negociacoes' e 'usuarios')
CREATE TABLE IF NOT EXISTS negociacao_participantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    negociacao_id INT NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (negociacao_id) REFERENCES negociacoes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela 'mensagens' (depende de 'negociacoes' e 'usuarios')
CREATE TABLE IF NOT EXISTS mensagens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    negociacao_id INT NOT NULL,
    remetente_id INT NOT NULL,
    conteudo TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (negociacao_id) REFERENCES negociacoes(id) ON DELETE CASCADE,
    FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- --- NOVA TABELA: LISTA DE DESEJOS (FAVORITOS) ---
CREATE TABLE IF NOT EXISTS lista_desejos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,       -- ID do usuário que favoritou
  inventario_id INT NOT NULL,  -- ID do item no inventário que foi favoritado
  data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Chaves estrangeiras
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (inventario_id) REFERENCES inventario(id) ON DELETE CASCADE,

  -- Impede que um usuário favorite o mesmo item duas vezes
  UNIQUE KEY uk_usuario_item (usuario_id, inventario_id)
);