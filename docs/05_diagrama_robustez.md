# Diagrama de Robustez — Pitstop

**Disciplina:** Engenharia de Software II  
**Professor:** Sandro Laudares  

---

## 1. Introdução

O diagrama de robustez detalha a interação entre **atores**, **objetos de fronteira (boundary)**, **objetos de controle (control)** e **entidades (entity)** para os principais casos de uso do sistema. É uma ponte entre os casos de uso e o diagrama de classes, mostrando como a lógica de negócio flui da interface até a persistência.

---

## 2. Diagrama de Robustez — Fluxo Completo

```plantuml
@startuml
skinparam packageStyle rectangle
skinparam shadowing false
left to right direction

actor "Motorista /\nMotoboy" as Motorista
actor "Gerente /\nCoordenador" as Gerente
actor "Administrador" as Admin

' ─── BOUNDARY ───────────────────────────────────────────────
package "Fronteira (Boundary)" {
    boundary "Tela de Login /\nControle de Acesso" as TelaLogin
    boundary "Tela de Cadastro\nde Motoristas" as TelaMotoristas
    boundary "Tela de Cadastro\nde Gerentes" as TelaGerentes
    boundary "Tela de Cadastro\nde Pontos" as TelaPontos
    boundary "Tela de Montagem\nde Roteiro" as TelaRoteiro
    boundary "Tela de Execução\ndo Roteiro (Check-in)" as TelaExecucao
    boundary "Tela de Dashboard" as TelaDashboard
    boundary "Tela de Histórico" as TelaHistorico
    boundary "Tela de Parâmetros" as TelaParametros
}

' ─── CONTROL ────────────────────────────────────────────────
package "Controle (Control)" {
    control "Ctrl. de Autenticação\ne Perfil" as CtrlAuth
    control "Ctrl. de Motoristas" as CtrlMotoristas
    control "Ctrl. de Gerentes" as CtrlGerentes
    control "Ctrl. de Pontos" as CtrlPontos
    control "Ctrl. de Roteiro" as CtrlRoteiro
    control "Ctrl. de Tempo\nParado" as CtrlTempo
    control "Ctrl. de Custo" as CtrlCusto
    control "Ctrl. de Dashboard" as CtrlDashboard
    control "Ctrl. de Histórico" as CtrlHistorico
    control "Ctrl. de Parâmetros" as CtrlParametros
}

' ─── ENTITY ─────────────────────────────────────────────────
package "Entidades (Entity)" {
    entity "Motorista" as EntMotorista
    entity "Gerente" as EntGerente
    entity "Ponto" as EntPonto
    entity "Roteiro" as EntRoteiro
    entity "Parâmetro" as EntParametro
}

' ─── ATORES → BOUNDARY ──────────────────────────────────────
Motorista --> TelaLogin
Motorista --> TelaExecucao
Motorista --> TelaHistorico

Gerente --> TelaLogin
Gerente --> TelaMotoristas
Gerente --> TelaPontos
Gerente --> TelaRoteiro
Gerente --> TelaDashboard
Gerente --> TelaHistorico

Admin --> TelaLogin
Admin --> TelaMotoristas
Admin --> TelaGerentes
Admin --> TelaPontos
Admin --> TelaRoteiro
Admin --> TelaDashboard
Admin --> TelaHistorico
Admin --> TelaParametros

' ─── LOGIN → CTRL AUTH ──────────────────────────────────────
TelaLogin --> CtrlAuth
CtrlAuth --> EntMotorista
CtrlAuth --> EntGerente

' ─── CADASTRO MOTORISTAS ────────────────────────────────────
TelaMotoristas --> CtrlMotoristas
CtrlMotoristas --> EntMotorista

' ─── CADASTRO GERENTES ──────────────────────────────────────
TelaGerentes --> CtrlGerentes
CtrlGerentes --> EntGerente

' ─── CADASTRO PONTOS ────────────────────────────────────────
TelaPontos --> CtrlPontos
CtrlPontos --> EntPonto

' ─── MONTAGEM DO ROTEIRO ────────────────────────────────────
TelaRoteiro --> CtrlRoteiro
CtrlRoteiro --> EntRoteiro
CtrlRoteiro --> EntMotorista
CtrlRoteiro --> EntPonto

' ─── EXECUÇÃO DO ROTEIRO (CHECK-IN) ────────────────────────
TelaExecucao --> CtrlRoteiro
CtrlRoteiro --> CtrlTempo
CtrlTempo --> EntPonto
CtrlTempo --> EntRoteiro

' ─── CÁLCULO DE CUSTO ───────────────────────────────────────
CtrlTempo --> CtrlCusto
CtrlCusto --> EntParametro
CtrlCusto --> EntRoteiro

' ─── DASHBOARD ──────────────────────────────────────────────
TelaDashboard --> CtrlDashboard
CtrlDashboard --> EntRoteiro
CtrlDashboard --> EntPonto
CtrlDashboard --> EntMotorista

' ─── HISTÓRICO ──────────────────────────────────────────────
TelaHistorico --> CtrlHistorico
CtrlHistorico --> EntRoteiro
CtrlHistorico --> EntPonto
CtrlHistorico --> EntMotorista

' ─── PARÂMETROS ─────────────────────────────────────────────
TelaParametros --> CtrlParametros
CtrlParametros --> EntParametro

@enduml
```

---

## 3. Descrição dos Objetos

### Objetos de Fronteira (Boundary)

| Boundary | Responsabilidade |
|----------|-----------------|
| **Tela de Login / Controle de Acesso** | Autenticação de usuários e redirecionamento por perfil (RNF04) |
| **Tela de Cadastro de Motoristas** | Formulário CRUD para motoristas/motoboys |
| **Tela de Cadastro de Gerentes** | Formulário CRUD para gerentes/coordenadores |
| **Tela de Cadastro de Pontos** | Formulário para pontos com endereço e coordenadas |
| **Tela de Montagem de Roteiro** | Interface para montar roteiro diário (motorista + data + pontos ordenados) |
| **Tela de Execução do Roteiro** | Interface de check-in/check-out usada pelo motorista em campo |
| **Tela de Dashboard** | Painel com gráficos de tempo parado (dia/mês/período) |
| **Tela de Histórico** | Listagem filtrável de roteiros e pontos com tempos parados |
| **Tela de Parâmetros** | Configurações de custo e jornada (acesso restrito ao Admin) |

### Objetos de Controle (Control)

| Control | Responsabilidade |
|---------|-----------------|
| **Ctrl. de Autenticação e Perfil** | Valida credenciais; define permissões por perfil (RNF04) |
| **Ctrl. de Motoristas** | Lógica CRUD de motoristas; validações de documento e veículo |
| **Ctrl. de Gerentes** | Lógica CRUD de gerentes; associação com equipe |
| **Ctrl. de Pontos** | Lógica CRUD de pontos; validação de endereço e coordenadas |
| **Ctrl. de Roteiro** | Criação/edição de roteiros; validação de unicidade motorista/data (RN05); ordenação de pontos (RN06) |
| **Ctrl. de Tempo Parado** | Executa RN01, RN02, RN03: calcula tempo parado por ponto e total do roteiro |
| **Ctrl. de Custo** | Executa RN07: calcula custo estimado usando parâmetros e distância |
| **Ctrl. de Dashboard** | Agrega dados de roteiros/pontos para geração dos gráficos (dia, mês, período) |
| **Ctrl. de Histórico** | Filtra e ordena roteiros/pontos por período; formata para exibição |
| **Ctrl. de Parâmetros** | Persiste e recupera parâmetros globais de custo e jornada |

### Entidades (Entity)

| Entity | Responsabilidade |
|--------|-----------------|
| **Motorista** | Armazena dados pessoais e do veículo dos profissionais de campo |
| **Gerente** | Armazena dados do gestor e associação com equipe |
| **Ponto** | Armazena endereço, coordenadas, timestamps e tempo parado calculado |
| **Roteiro** | Agrega pontos em ordem, data, motorista, distância, tempo total e custo |
| **Parâmetro** | Configurações globais de custo e jornada (alteráveis sem mudança de código) |

---

## 4. Fluxos Detalhados

### Fluxo: Registrar Chegada + Saída → Calcular Tempo Parado

```
Motorista
  → TelaExecucao (seleciona ponto, clica "Chegada")
    → CtrlRoteiro (busca roteiro do dia)
      → CtrlTempo (registra dataHoraChegada no EntPonto)

Motorista
  → TelaExecucao (clica "Saída")
    → CtrlRoteiro
      → CtrlTempo
        → EntPonto (verifica ordemNoRoteiro)
          → [se ordem == 1]: tempoParado = 0          ← RN01
          → [se ordem > 1]: tempoParado = saída − chegada ← RN02
        → EntRoteiro (recalcula tempoTotalParado)       ← RN03
        → CtrlCusto (recalcula custoEstimado)
          → EntParametro (lê valorCombustivel, kmPorLitro) ← RN07
          → EntRoteiro (atualiza custoEstimado)
```

### Fluxo: Consultar Dashboard

```
Gerente/Admin
  → TelaDashboard (seleciona recorte: dia / mês / período)
    → CtrlDashboard
      → EntRoteiro (filtra por data/período)
      → EntPonto (agrega temposParados)
      → EntMotorista (para filtro opcional por motorista)
    → TelaDashboard (renderiza gráficos via Chart.js)
```
![diagrama de robustez](diagramas/robustez.png)