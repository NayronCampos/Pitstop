/**
 * Pitstop — db.js
 * Camada de persistência usando localStorage como banco de dados.
 * Simula um banco relacional com entidades separadas.
 */

const DB_KEYS = {
  motoristas: 'rw_motoristas',
  gerentes: 'rw_gerentes',
  pontos: 'rw_pontos_cadastro',
  roteiros: 'rw_roteiros',
  parametros: 'rw_parametros',
  usuarios: 'rw_usuarios',
  auditoria: 'rw_auditoria',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function _get(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

function _getObj(key, defaultVal = {}) {
  try { return JSON.parse(localStorage.getItem(key)) || defaultVal; }
  catch { return defaultVal; }
}

function _set(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function _nextId(list) {
  return list.length === 0 ? 1 : Math.max(...list.map(x => x.id)) + 1;
}

function _audit(acao, entidade, id, dados) {
  const log = _get(DB_KEYS.auditoria);
  log.push({ id: _nextId(log), acao, entidade, entidadeId: id, dados, ts: new Date().toISOString() });
  _set(DB_KEYS.auditoria, log);
}

// ── Motoristas ─────────────────────────────────────────────────────────────

const DB = {

  // ── Motoristas ────────────────────────────────────────────────────────
  motoristas: {
    listar() { return _get(DB_KEYS.motoristas); },

    buscar(id) { return this.listar().find(m => m.id === id) || null; },

    salvar(dados) {
      const lista = this.listar();
      const obj = { ...dados, id: _nextId(lista), criadoEm: new Date().toISOString() };
      lista.push(obj);
      _set(DB_KEYS.motoristas, lista);
      _audit('CREATE', 'motorista', obj.id, obj);
      return obj;
    },

    atualizar(id, dados) {
      const lista = this.listar();
      const idx = lista.findIndex(m => m.id === id);
      if (idx === -1) throw new Error('Motorista não encontrado');
      lista[idx] = { ...lista[idx], ...dados, atualizadoEm: new Date().toISOString() };
      _set(DB_KEYS.motoristas, lista);
      _audit('UPDATE', 'motorista', id, dados);
      return lista[idx];
    },

    excluir(id) {
      const lista = this.listar().filter(m => m.id !== id);
      _set(DB_KEYS.motoristas, lista);
      _audit('DELETE', 'motorista', id, {});
    },
  },

  // ── Gerentes ──────────────────────────────────────────────────────────
  gerentes: {
    listar() { return _get(DB_KEYS.gerentes); },
    buscar(id) { return this.listar().find(g => g.id === id) || null; },

    salvar(dados) {
      const lista = this.listar();
      const obj = { ...dados, id: _nextId(lista), criadoEm: new Date().toISOString() };
      lista.push(obj);
      _set(DB_KEYS.gerentes, lista);
      _audit('CREATE', 'gerente', obj.id, obj);
      return obj;
    },

    atualizar(id, dados) {
      const lista = this.listar();
      const idx = lista.findIndex(g => g.id === id);
      if (idx === -1) throw new Error('Gerente não encontrado');
      lista[idx] = { ...lista[idx], ...dados, atualizadoEm: new Date().toISOString() };
      _set(DB_KEYS.gerentes, lista);
      _audit('UPDATE', 'gerente', id, dados);
      return lista[idx];
    },

    excluir(id) {
      const lista = this.listar().filter(g => g.id !== id);
      _set(DB_KEYS.gerentes, lista);
      _audit('DELETE', 'gerente', id, {});
    },
  },

  // ── Pontos (cadastro base) ────────────────────────────────────────────
  pontos: {
    listar() { return _get(DB_KEYS.pontos); },
    buscar(id) { return this.listar().find(p => p.id === id) || null; },

    salvar(dados) {
      const lista = this.listar();
      const obj = { ...dados, id: _nextId(lista), criadoEm: new Date().toISOString() };
      lista.push(obj);
      _set(DB_KEYS.pontos, lista);
      _audit('CREATE', 'ponto', obj.id, obj);
      return obj;
    },

    atualizar(id, dados) {
      const lista = this.listar();
      const idx = lista.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Ponto não encontrado');
      lista[idx] = { ...lista[idx], ...dados, atualizadoEm: new Date().toISOString() };
      _set(DB_KEYS.pontos, lista);
      _audit('UPDATE', 'ponto', id, dados);
      return lista[idx];
    },

    excluir(id) {
      const lista = this.listar().filter(p => p.id !== id);
      _set(DB_KEYS.pontos, lista);
      _audit('DELETE', 'ponto', id, {});
    },
  },

  // ── Roteiros ──────────────────────────────────────────────────────────
  roteiros: {
    listar() { return _get(DB_KEYS.roteiros); },

    buscar(id) { return this.listar().find(r => r.id === id) || null; },

    buscarPorMotoristaData(motoristaId, data) {
      return this.listar().find(r => r.motoristaId === motoristaId && r.data === data) || null;
    },

    listarPorMotorista(motoristaId) {
      return this.listar().filter(r => r.motoristaId === motoristaId);
    },

    listarPorPeriodo(dataInicio, dataFim) {
      return this.listar().filter(r => r.data >= dataInicio && r.data <= dataFim);
    },

    salvar(dados) {
      // RN05: validar unicidade motorista+data
      const existente = this.buscarPorMotoristaData(dados.motoristaId, dados.data);
      if (existente) throw new Error('Já existe um roteiro para este motorista nesta data. (RN05)');

      const lista = this.listar();
      const obj = {
        ...dados,
        id: _nextId(lista),
        pontos: dados.pontos || [],          // array de pontos do roteiro
        tempoTotalParadoMin: dados.tempoTotalParadoMin ?? 0,
        custoEstimado: dados.custoEstimado ?? 0,
        criadoEm: new Date().toISOString(),
      };
      lista.push(obj);
      _set(DB_KEYS.roteiros, lista);
      _audit('CREATE', 'roteiro', obj.id, obj);
      return obj;
    },

    atualizar(id, dados) {
      const lista = this.listar();
      const idx = lista.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('Roteiro não encontrado');
      lista[idx] = { ...lista[idx], ...dados, atualizadoEm: new Date().toISOString() };
      _set(DB_KEYS.roteiros, lista);
      _audit('UPDATE', 'roteiro', id, dados);
      return lista[idx];
    },

    excluir(id) {
      const lista = this.listar().filter(r => r.id !== id);
      _set(DB_KEYS.roteiros, lista);
      _audit('DELETE', 'roteiro', id, {});
    },

    // Registra chegada em um ponto do roteiro
    registrarChegada(roteiroId, ordemPonto) {
      const roteiro = this.buscar(roteiroId);
      if (!roteiro) throw new Error('Roteiro não encontrado');
      const ponto = roteiro.pontos.find(p => p.ordem === ordemPonto);
      if (!ponto) throw new Error('Ponto não encontrado no roteiro');
      ponto.dataHoraChegada = new Date().toISOString();
      this.atualizar(roteiroId, { pontos: roteiro.pontos });
      _audit('CHECKIN', 'roteiro_ponto', roteiroId, { ordemPonto, chegada: ponto.dataHoraChegada });
      return ponto;
    },

    // Registra saída em um ponto e calcula tempo parado
    registrarSaida(roteiroId, ordemPonto) {
      const roteiro = this.buscar(roteiroId);
      if (!roteiro) throw new Error('Roteiro não encontrado');
      const ponto = roteiro.pontos.find(p => p.ordem === ordemPonto);
      if (!ponto) throw new Error('Ponto não encontrado no roteiro');

      ponto.dataHoraSaida = new Date().toISOString();

      // RN01 + RN02
      ponto.tempoParadoMin = Calculos.tempoParadoPonto(ponto);

      // RN03 — recalcular total
      roteiro.tempoTotalParadoMin = Calculos.tempoTotalRoteiro(roteiro.pontos);

      // RN07 — recalcular custo
      const params = DB.parametros.get();
      roteiro.custoEstimado = Calculos.custoRoteiro(roteiro.distanciaKm || 0, params);

      this.atualizar(roteiroId, {
        pontos: roteiro.pontos,
        tempoTotalParadoMin: roteiro.tempoTotalParadoMin,
        custoEstimado: roteiro.custoEstimado,
      });

      _audit('CHECKOUT', 'roteiro_ponto', roteiroId, { ordemPonto, saida: ponto.dataHoraSaida, tempoMin: ponto.tempoParadoMin });
      return ponto;
    },
  },

  // ── Parâmetros (singleton) ────────────────────────────────────────────
  parametros: {
    DEFAULTS: {
      valorCombustivel: 6.00,
      kmPorLitro: 12.0,
      custoPorKm: 0.50,
      jornadaPadraoHoras: 8,
      regraTempoParado: 'saida_menos_chegada',
    },

    get() {
      return _getObj(DB_KEYS.parametros, this.DEFAULTS);
    },

    salvar(dados) {
      const atual = this.get();
      const novo = { ...atual, ...dados, atualizadoEm: new Date().toISOString() };
      localStorage.setItem(DB_KEYS.parametros, JSON.stringify(novo));
      _audit('UPDATE', 'parametros', 1, dados);
      return novo;
    },
  },

  // ── Usuários (autenticação) ───────────────────────────────────────────
  usuarios: {
    listar() { return _get(DB_KEYS.usuarios); },

    init() {
      let lista = this.listar();
      const demoUsers = [
        { id: 1, nome: 'Administrador', email: 'admin@Pitstop.com', senha: 'admin123', perfil: 'admin', ativo: true },
        { id: 2, nome: 'Gerente Demo', email: 'gerente@Pitstop.com', senha: 'gerente123', perfil: 'gerente', ativo: true },
        { id: 3, nome: 'João Silva', email: 'joao@Pitstop.com', senha: 'motor123', perfil: 'motorista', motoristaId: 1, ativo: true },
      ];

      if (lista.length === 0) {
        _set(DB_KEYS.usuarios, demoUsers);
      } else {
        let changed = false;
        demoUsers.forEach(demo => {
          const u = lista.find(user => user.email.toLowerCase() === demo.email.toLowerCase());
          if (u) {
            if (u.senha !== demo.senha) {
              u.senha = demo.senha;
              changed = true;
            }
          } else {
            lista.push(demo);
            changed = true;
          }
        });
        if (changed) _set(DB_KEYS.usuarios, lista);
      }
    },

    autenticar(email, senha) {
      const emailLower = email.toLowerCase();
      return this.listar().find(u => u.email.toLowerCase() === emailLower && u.senha === senha && u.ativo) || null;
    },

    salvar(dados) {
      const lista = this.listar();
      const obj = { ...dados, id: _nextId(lista) };
      lista.push(obj);
      _set(DB_KEYS.usuarios, lista);
      return obj;
    },
  },

  // ── Auditoria ─────────────────────────────────────────────────────────
  auditoria: {
    listar() { return _get(DB_KEYS.auditoria); },
  },

  // ── Seed de dados de exemplo ──────────────────────────────────────────
  seed() {
    DB.usuarios.init();

    if (DB.motoristas.listar().length === 0) {
      DB.motoristas.salvar({ nome: 'João Silva', telefone: '31 98888-1111', documento: '123.456.789-00', veiculo: 'Honda CG 160 — Branca', rendimentoKmLitro: 40 });
      DB.motoristas.salvar({ nome: 'Maria Santos', telefone: '31 97777-2222', documento: '987.654.321-00', veiculo: 'Yamaha Factor 150 — Vermelha', rendimentoKmLitro: 38 });
      DB.gerentes.salvar({ nome: 'Carlos Gerente', telefone: '31 96666-3333', email: 'carlos@transportadora.com' });
      DB.pontos.salvar({ endereco: 'Seg. Família — R. das Flores, 100, BH', latitude: -19.9245, longitude: -43.9352 });
      DB.pontos.salvar({ endereco: 'Rua Peru, 55, Santa Efigênia, BH', latitude: -19.9300, longitude: -43.9200 });
      DB.pontos.salvar({ endereco: 'Rua X, 5, Lagoinha, BH', latitude: -19.9180, longitude: -43.9500 });
      DB.pontos.salvar({ endereco: 'Av. João César, 800, Caiçara, BH', latitude: -19.9100, longitude: -43.9600 });
    }

    DB._garantirDemoJoao();
  },

  _dataLocalISO(offsetDias = 0) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + offsetDias);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  _montarPontosDemo(pontosBase, data, temposMin, aberto = false) {
    const horarios = [
      { chegada: '07:00', saida: '07:00' },
      { chegada: '07:45', saida: '08:00' },
      { chegada: '08:30', saida: '08:40' },
      { chegada: '09:10', saida: '10:00' },
    ];
    return pontosBase.map((p, i) => {
      const ordem = i + 1;
      if (aberto) {
        return {
          ordem, pontoId: p.id, endereco: p.endereco,
          dataHoraChegada: null, dataHoraSaida: null,
          tempoParadoMin: ordem === 1 ? 0 : null,
        };
      }
      const h = horarios[i] || horarios[horarios.length - 1];
      const saidaMin = ordem === 1 ? 0 : (temposMin[i] || 0);
      const [ch, cm] = h.chegada.split(':').map(Number);
      const saidaTotal = ch * 60 + cm + saidaMin;
      const sh = String(Math.floor(saidaTotal / 60)).padStart(2, '0');
      const sm = String(saidaTotal % 60).padStart(2, '0');
      return {
        ordem, pontoId: p.id, endereco: p.endereco,
        dataHoraChegada: `${data}T${h.chegada}:00`,
        dataHoraSaida: `${data}T${sh}:${sm}:00`,
        tempoParadoMin: saidaMin,
      };
    });
  },

  _garantirRoteiroDemo(motoristaId, data, distanciaKm, pontos, aberto = false) {
    const params = DB.parametros.get();
    const tempoTotalParadoMin = aberto ? 0 : Calculos.tempoTotalRoteiro(pontos);
    const custoEstimado = Calculos.custoRoteiro(distanciaKm || 0, params);
    const existente = DB.roteiros.buscarPorMotoristaData(motoristaId, data);

    if (existente) {
      const tempoAtual = Calculos.tempoTotalRoteiro(existente.pontos || []);
      const precisaAtualizar = !aberto && (existente.tempoTotalParadoMin || 0) === 0 && tempoAtual > 0;
      if (precisaAtualizar) {
        DB.roteiros.atualizar(existente.id, {
          tempoTotalParadoMin: tempoAtual,
          custoEstimado: Calculos.custoRoteiro(existente.distanciaKm || distanciaKm || 0, params),
        });
      }
      return existente;
    }

    return DB.roteiros.salvar({
      motoristaId, data, distanciaKm, pontos, tempoTotalParadoMin, custoEstimado,
    });
  },

  /**
   * Garante dados fictícios do motorista João visíveis para motorista, gerente e admin.
   * Também vincula o login joao@Pitstop.com ao cadastro de João Silva.
   */
  _garantirDemoJoao() {
    const motoristas = DB.motoristas.listar();
    const joao = motoristas.find(m => m.documento === '123.456.789-00' || m.nome === 'João Silva');
    const maria = motoristas.find(m => m.documento === '987.654.321-00' || m.nome === 'Maria Santos');
    if (!joao) return;

    const usuarios = DB.usuarios.listar();
    const usuarioJoao = usuarios.find(u => u.email === 'joao@Pitstop.com');
    if (usuarioJoao && usuarioJoao.motoristaId !== joao.id) {
      usuarioJoao.motoristaId = joao.id;
      usuarioJoao.nome = 'João Silva';
      _set(DB_KEYS.usuarios, usuarios);
    }

    try {
      const sess = JSON.parse(sessionStorage.getItem('rw_usuario_logado'));
      if (sess && sess.email === 'joao@Pitstop.com' && sess.motoristaId !== joao.id) {
        sess.motoristaId = joao.id;
        sess.nome = 'João Silva';
        sessionStorage.setItem('rw_usuario_logado', JSON.stringify(sess));
      }
    } catch { /* sessão ausente */ }

    const pontosBase = DB.pontos.listar().slice(0, 4);
    if (pontosBase.length < 4) return;

    const rotasJoao = [
      { offset: -8, dist: 16.2, tempos: [0, 12, 8, 22] },
      { offset: -7, dist: 19.0, tempos: [0, 18, 14, 40] },
      { offset: -6, dist: 14.4, tempos: [0, 9, 11, 20] },
      { offset: -5, dist: 21.8, tempos: [0, 25, 16, 45] },
      { offset: -4, dist: 17.5, tempos: [0, 14, 10, 28] },
      { offset: -3, dist: 20.1, tempos: [0, 22, 18, 33] },
      { offset: -2, dist: 15.0, tempos: [0, 10, 7, 19] },
      { offset: -1, dist: 18.5, tempos: [0, 15, 10, 50] },
    ];

    rotasJoao.forEach(rota => {
      const data = DB._dataLocalISO(rota.offset);
      const pontos = DB._montarPontosDemo(pontosBase, data, rota.tempos);
      DB._garantirRoteiroDemo(joao.id, data, rota.dist, pontos);
    });

    const hoje = DB._dataLocalISO(0);
    const pontosHoje = DB._montarPontosDemo(pontosBase, hoje, [], true);
    DB._garantirRoteiroDemo(joao.id, hoje, 16.0, pontosHoje, true);

    if (maria) {
      const rotasMaria = [
        { offset: -3, dist: 11.5, tempos: [0, 8, 6, 18] },
        { offset: -1, dist: 12.0, tempos: [0, 10, 5, 26] },
      ];
      rotasMaria.forEach(rota => {
        const data = DB._dataLocalISO(rota.offset);
        const pontos = DB._montarPontosDemo(pontosBase, data, rota.tempos);
        DB._garantirRoteiroDemo(maria.id, data, rota.dist, pontos);
      });
    }
  },
};
