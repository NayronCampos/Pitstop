# Requisitos do Sistema — Pitstop

**Disciplina:** Engenharia de Software II  
**Professor:** Sandro Laudares  

---

## 1. Requisitos Funcionais

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| **RF01** | Cadastrar dados do motorista/motoboy (nome, telefone, documento, veículo). | Alta |
| **RF02** | Cadastrar dados do gerente/coordenador (nome, telefone, e-mail). | Alta |
| **RF03** | Cadastrar pontos com endereço e coordenadas. | Alta |
| **RF04** | Montar o roteiro diário associando pontos em ordem sequencial a um motorista e a uma data. | Alta |
| **RF05** | Registrar chegada e saída em cada ponto (data/hora) para coleta do tempo parado. | Alta |
| **RF06** | Calcular automaticamente o tempo parado por ponto e o total do roteiro. | Alta |
| **RF07** | Exibir histórico de pontos e tempos parados por período, com endereços. | Alta |
| **RF08** | Exibir dashboard com gráficos de tempo parado por dia, por mês e por período. | Alta |
| **RF09** | Parametrizar custos: valor do combustível, km/litro do veículo, custo por km percorrido. | Média |
| **RF10** | Parametrizar regras de cálculo do tempo parado e a jornada padrão (8 h/dia). | Média |
| **RF11** | Calcular o custo estimado do roteiro a partir dos parâmetros e da distância percorrida. | Média |
| **RF12** | Exportar relatórios do período consultado. | Baixa |

### Detalhamento dos Requisitos de Alta Prioridade

#### RF01 — Cadastro de Motorista/Motoboy
- **Atores:** Gerente/Coordenador, Administrador
- **Dados obrigatórios:** nome completo, telefone, número do documento (CPF/CNH), veículo associado
- **Dados opcionais:** rendimento km/litro do veículo
- **Regras:** um motorista pode ter vários roteiros ao longo do tempo (RN05)

#### RF04 — Montagem do Roteiro Diário
- **Atores:** Gerente/Coordenador, Administrador
- **Dados:** motorista responsável, data, lista de pontos em ordem sequencial (1, 2, 3…)
- **Regras:** RN05 (roteiro único por motorista/data), RN06 (ordenação sequencial dos pontos)

#### RF05 — Registro de Chegada e Saída
- **Atores:** Motorista/Motoboy
- **Dados:** data/hora de chegada ao ponto, data/hora de saída do ponto
- **Regras:** RN01 (ponto de partida não acumula tempo), RN02 (tempo parado = saída − chegada)

#### RF06 — Cálculo Automático de Tempo Parado
- **Dados calculados:** tempo parado por ponto, tempo total parado por roteiro
- **Regras:** RN01, RN02, RN03
- **Fórmula:** `tempo_parado_ponto = hora_saída − hora_chegada` (para pontos 2, 3, 4…)
- **Fórmula:** `tempo_total_roteiro = Σ tempo_parado_ponto[2..N]`

#### RF08 — Dashboard com Gráficos
- **Recortes obrigatórios:**
  - Por **dia:** tempo parado de cada roteiro em um dia específico
  - Por **mês:** agregado mensal de tempo parado por motorista ou geral
  - Por **período:** comparativo entre dois intervalos de datas
- **Tipo de gráficos sugeridos:** barras (por dia/mês) e linha (por período)

---

## 2. Requisitos Não Funcionais

| ID | Requisito |
|----|-----------|
| **RNF01** | Persistência dos dados em banco de dados, garantindo o histórico completo dos roteiros. |
| **RNF02** | Interface web responsiva, utilizável em desktop e em dispositivos móveis pelo entregador. |
| **RNF03** | Tempo de resposta do dashboard inferior a 3 segundos para consultas de até 12 meses. |
| **RNF04** | Controle de acesso por perfil: **motorista/motoboy**, **gerente/coordenador** e **administrador**. |
| **RNF05** | Registro de auditoria das alterações em pontos e horários. |
| **RNF06** | Aderência à LGPD no tratamento dos dados pessoais dos profissionais de campo. |

### Detalhamento dos RNFs

#### RNF04 — Controle de Acesso por Perfil

| Perfil | Permissões |
|--------|-----------|
| **Motorista/Motoboy** | Visualizar seus próprios roteiros; registrar chegada/saída nos pontos; consultar histórico próprio |
| **Gerente/Coordenador** | Todas as permissões do motorista + cadastrar motoristas e roteiros; visualizar dashboard; exportar relatórios |
| **Administrador** | Todas as permissões + parametrizar custos e jornada; gerenciar todos os usuários |

#### RNF06 — LGPD
- Dados pessoais (nome, telefone, documento) devem ser coletados com finalidade clara
- Possibilidade de exclusão de dados do profissional sob solicitação
- Acesso restrito a dados pessoais por perfil (RNF04)

![diagrama de requisitos](diagramas/requisitos.png)
