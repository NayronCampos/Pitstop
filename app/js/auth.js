/**
 * Pitstop — auth.js
 * Controle de acesso por perfil (RNF04).
 * Perfis: motorista, gerente, admin
 */

const Auth = {
  STORAGE_KEY: 'rw_usuario_logado',

  // Retorna o usuário logado ou null
  usuarioAtual() {
    try { return JSON.parse(sessionStorage.getItem(this.STORAGE_KEY)); }
    catch { return null; }
  },

  // Realiza o login
  login(email, senha) {
    const usuario = DB.usuarios.autenticar(email, senha);
    if (!usuario) return false;
    const { senha: _, ...semSenha } = usuario;
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(semSenha));
    return semSenha;
  },

  // Logout
  logout() {
    sessionStorage.removeItem(this.STORAGE_KEY);
    window.location.href = 'index.html';
  },

  // Verifica se está logado, redireciona para login se não
  exigirLogin() {
    if (!this.usuarioAtual()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  // Verifica se o perfil tem acesso a determinada ação
  temPermissao(acao) {
    const usuario = this.usuarioAtual();
    if (!usuario) return false;

    const permissoes = {
      motorista: ['ver_roteiro_proprio', 'registrar_checkin', 'ver_historico_proprio'],
      gerente: [
        'ver_roteiro_proprio', 'registrar_checkin', 'ver_historico_proprio',
        'cadastrar_motorista', 'cadastrar_ponto', 'montar_roteiro',
        'ver_dashboard', 'ver_historico_todos', 'exportar_relatorio'
      ],
      admin: ['*'], // acesso total
    };

    if (usuario.perfil === 'admin') return true;
    return (permissoes[usuario.perfil] || []).includes(acao);
  },

  // Exige perfil mínimo, redireciona se não tiver
  exigirPerfil(...perfisPermitidos) {
    const usuario = this.usuarioAtual();
    if (!usuario || !perfisPermitidos.includes(usuario.perfil)) {
      alert('Acesso negado. Você não tem permissão para acessar esta página.');
      window.history.back();
      return false;
    }
    return true;
  },

  // Renderiza nome e perfil do usuário no header
  renderizarUsuario() {
    const usuario = this.usuarioAtual();
    if (!usuario) return;

    const el = document.getElementById('usuario-info');
    if (el) {
      const badges = { admin: '🔴 Admin', gerente: '🟡 Gerente', motorista: '🟢 Motorista' };
      el.innerHTML = `
        <span class="user-name">${usuario.nome}</span>
        <span class="user-badge">${badges[usuario.perfil] || usuario.perfil}</span>
      `;
    }

    // Oculta elementos baseados no perfil
    document.querySelectorAll('[data-perfil]').forEach(el => {
      const perfis = el.dataset.perfil.split(',');
      if (!perfis.includes(usuario.perfil) && !perfis.includes('*')) {
        el.style.display = 'none';
      }
    });
  },
};
