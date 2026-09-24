/**
 * Pitstop — calculos.js
 * Lógica de negócio: cálculos de tempo parado e custo.
 * Implementa as Regras de Negócio RN01–RN07.
 */

const Calculos = {

  /**
   * RN01 + RN02: Tempo parado em um ponto específico.
   * Se ordem == 1 (partida), retorna 0.
   * Caso contrário, retorna diferença saída − chegada em minutos.
   * @param {Object} ponto - { ordem, dataHoraChegada, dataHoraSaida }
   * @returns {number} minutos parados
   */
  tempoParadoPonto(ponto) {
    // RN01: ponto de partida não acumula tempo
    if (ponto.ordem === 1) return 0;
    if (!ponto.dataHoraChegada || !ponto.dataHoraSaida) return 0;

    // RN02: tempo parado = saída − chegada
    const chegada = new Date(ponto.dataHoraChegada);
    const saida = new Date(ponto.dataHoraSaida);
    const diffMs = saida - chegada;
    return Math.max(0, Math.round(diffMs / 60000)); // retorna em minutos
  },

  /**
   * RN03: Tempo total parado do roteiro.
   * Soma dos tempos parados de todos os pontos, exceto o ponto de partida.
   * @param {Array} pontos - lista de pontos do roteiro
   * @returns {number} total em minutos
   */
  tempoTotalRoteiro(pontos) {
    return pontos.reduce((total, p) => {
      if (p.ordem === 1) return total; // RN01
      return total + (p.tempoParadoMin || 0);
    }, 0);
  },

  /**
   * RN04: Percentual do tempo parado em relação à jornada padrão.
   * @param {number} tempoParadoMin - tempo parado em minutos
   * @param {number} jornadaHoras - jornada padrão em horas (padrão: 8)
   * @returns {number} percentual (0–100+)
   */
  percentualJornada(tempoParadoMin, jornadaHoras = 8) {
    const jornadaMin = jornadaHoras * 60;
    return parseFloat(((tempoParadoMin / jornadaMin) * 100).toFixed(1));
  },

  /**
   * RN07: Custo estimado do roteiro.
   * custo = (distancia / kmPorLitro) * valorCombustivel
   * @param {number} distanciaKm
   * @param {Object} params - { valorCombustivel, kmPorLitro, custoPorKm }
   * @returns {number} custo em R$
   */
  custoRoteiro(distanciaKm, params) {
    if (!distanciaKm || distanciaKm <= 0) return 0;
    const { valorCombustivel = 6, kmPorLitro = 12, custoPorKm = 0.5 } = params;
    const litros = distanciaKm / kmPorLitro;
    const custoCombustivel = litros * valorCombustivel;
    const custoKm = distanciaKm * custoPorKm;
    return parseFloat((custoCombustivel + custoKm).toFixed(2));
  },

  // ── Formatadores ───────────────────────────────────────────────────────

  /**
   * Formata minutos como "Xh Ymin" ou "Ymin"
   * @param {number} minutos
   * @returns {string}
   */
  formatarTempo(minutos) {
    if (minutos == null || minutos === 0) return '0 min';
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  },

  /**
   * Formata valor monetário em BRL
   * @param {number} valor
   * @returns {string}
   */
  formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  },

  /**
   * Formata data ISO para dd/mm/aaaa
   * @param {string} isoDate
   * @returns {string}
   */
  formatarData(isoDate) {
    if (!isoDate) return '—';
    const [y, m, d] = isoDate.split('T')[0].split('-');
    return `${d}/${m}/${y}`;
  },

  /**
   * Formata datetime ISO para dd/mm/aaaa HH:MM
   * @param {string} isoDateTime
   * @returns {string}
   */
  formatarDataHora(isoDateTime) {
    if (!isoDateTime) return '—';
    const dt = new Date(isoDateTime);
    return `${dt.toLocaleDateString('pt-BR')} ${dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  },

  // ── Agregações para Dashboard ──────────────────────────────────────────

  /**
   * Agrega tempo parado por dia a partir de uma lista de roteiros.
   * @param {Array} roteiros
   * @returns {Object} { 'YYYY-MM-DD': totalMinutos }
   */
  agregarPorDia(roteiros) {
    const resultado = {};
    roteiros.forEach(r => {
      resultado[r.data] = (resultado[r.data] || 0) + (r.tempoTotalParadoMin || 0);
    });
    return resultado;
  },

  /**
   * Agrega tempo parado por mês.
   * @param {Array} roteiros
   * @returns {Object} { 'YYYY-MM': totalMinutos }
   */
  agregarPorMes(roteiros) {
    const resultado = {};
    roteiros.forEach(r => {
      const mes = r.data.substring(0, 7); // 'YYYY-MM'
      resultado[mes] = (resultado[mes] || 0) + (r.tempoTotalParadoMin || 0);
    });
    return resultado;
  },

  /**
   * Retorna nome do mês em português a partir de 'YYYY-MM'
   * @param {string} mesAno
   * @returns {string}
   */
  nomeMes(mesAno) {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const [, m] = mesAno.split('-');
    return `${meses[parseInt(m, 10) - 1]}/${mesAno.slice(2, 4)}`;
  },
};
