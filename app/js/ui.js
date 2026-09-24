/**
 * Pitstop — ui.js
 * Componentes e utilitários de UI reutilizáveis entre todas as páginas.
 */

// ── Toast ────────────────────────────────────────────────────
function showToast(msg, tipo = 'info', duracao = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span>${icons[tipo] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, duracao);
}

// ── Sidebar ativo ─────────────────────────────────────────────
function marcarNavAtivo() {
  const atual = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item[href]').forEach(el => {
    if (el.getAttribute('href') === atual) el.classList.add('active');
  });
}

// ── Sidebar mobile toggle ─────────────────────────────────────
function iniciarSidebarMobile() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

// ── Modal ─────────────────────────────────────────────────────
function abrirModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('active');
}

function fecharModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('active');
}

function iniciarModais() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay').classList.remove('active');
    });
  });
}

// ── Confirmação ───────────────────────────────────────────────
function confirmar(msg) {
  return confirm(msg);
}

// ── Render sidebar HTML ───────────────────────────────────────
function renderSidebar(paginaAtual) {
  const usuario = Auth.usuarioAtual();
  const perfil = usuario ? usuario.perfil : '';

  const navItems = [
    { href: 'dashboard.html', icon: '📊', label: 'Dashboard', perfis: ['admin', 'gerente'] },
    { href: 'roteiros.html', icon: '🗺️', label: 'Roteiros', perfis: ['admin', 'gerente', 'motorista'] },
    { href: 'pontos.html', icon: '📍', label: 'Pontos', perfis: ['admin', 'gerente'] },
    { divider: true, label: 'Cadastros', perfis: ['admin', 'gerente'] },
    { href: 'motoristas.html', icon: '🏍️', label: 'Motoristas', perfis: ['admin', 'gerente'] },
    { href: 'gerentes.html', icon: '👔', label: 'Gerentes', perfis: ['admin'] },
    { divider: true, label: 'Análise', perfis: ['admin', 'gerente'] },
    { href: 'historico.html', icon: '📋', label: 'Histórico', perfis: ['admin', 'gerente', 'motorista'] },
    { divider: true, label: 'Sistema', perfis: ['admin'] },
    { href: 'parametros.html', icon: '⚙️', label: 'Parâmetros', perfis: ['admin'] },
  ];

  const initials = usuario ? usuario.nome.split(' ').map(n => n[0]).slice(0, 2).join('') : '?';
  const badges = { admin: '🔴 Admin', gerente: '🟡 Gerente', motorista: '🟢 Motorista' };

  let navHtml = '';
  navItems.forEach(item => {
    if (!item.perfis.includes(perfil)) return;
    if (item.divider) {
      navHtml += `<div class="nav-section-label">${item.label}</div>`;
      return;
    }
    const isActive = item.href === paginaAtual ? 'active' : '';
    navHtml += `
      <a href="${item.href}" class="nav-item ${isActive}">
        <span class="nav-icon">${item.icon}</span>
        ${item.label}
      </a>
    `;
  });

  return `
    <div class="sidebar-logo">
      <div class="logo-icon">🚛</div>
      <div>
        <div class="logo-text">Pitstop</div>
        <span class="logo-tagline">Tempo parado = custo real</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      ${navHtml}
    </nav>
    <div class="sidebar-footer">
      <div class="user-info-sidebar">
        <div class="user-avatar">${initials}</div>
        <div class="user-details">
          <span class="user-name">${usuario ? usuario.nome.split(' ')[0] : '—'}</span>
          <span class="user-badge" id="usuario-info">${badges[perfil] || perfil}</span>
        </div>
        <button onclick="Auth.logout()" title="Sair" style="background:none;border:none;cursor:pointer;color:var(--clr-text-muted);font-size:1rem;transition:color .2s" onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='var(--clr-text-muted)'">⏻</button>
      </div>
    </div>
  `;
}

function iniciarPagina(paginaAtual) {
  Auth.exigirLogin();

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.innerHTML = renderSidebar(paginaAtual);

  marcarNavAtivo();
  iniciarSidebarMobile();
  iniciarModais();
}

// ── Exportar CSV ──────────────────────────────────────────────
function exportarCSV(dados, nomeArquivo) {
  if (!dados || dados.length === 0) {
    showToast('Nenhum dado para exportar.', 'warning');
    return;
  }
  const headers = Object.keys(dados[0]);
  const rows = dados.map(row => headers.map(h => `"${row[h] ?? ''}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nomeArquivo;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Relatório exportado com sucesso!', 'success');
}

// ── Tabs ──────────────────────────────────────────────────────
function iniciarTabs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}
