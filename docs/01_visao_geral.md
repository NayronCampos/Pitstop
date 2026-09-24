# Visão Geral — MVP: Pitstop

**Disciplina:** Engenharia de Software II  
**Professor:** Sandro Laudares  
**Equipe:** _(preencher nome dos integrantes)_  
**Data:** Setembro / 2026  

---

## 1. Contexto e Problema

Empresas de logística e entrega urbana precisam saber **onde e por quanto tempo** seus profissionais de campo ficam parados durante o roteiro diário. Hoje esse tempo é invisível: não há registro confiável de quanto tempo o entregador, motorista ou transportador permanece em cada ponto do trajeto.

Essa falta de visibilidade impede que as empresas:

- Identifiquem gargalos operacionais no roteiro diário;
- Renegociem prazos com clientes com base em dados reais;
- Calculem corretamente o custo real de cada rota.

O cliente solicitou um **painel (dashboard)** com gráficos que apresentem o tempo parado por dia, por mês e por período, sempre associado aos pontos do roteiro.

---

## 2. Objetivo do MVP

Construir um **Mínimo Produto Viável** capaz de:

- Identificar quanto tempo o entregador/motorista/transportador fica parado em cada ponto do seu roteiro diário;
- Registrar e persistir os pontos, roteiros e tempos coletados;
- Apresentar ao cliente um painel com gráficos de tempo parado **por dia**, **por mês** e **por período**;
- Calcular indicadores de custo associados ao trajeto (custo por km percorrido, consumo km/litro do veículo).

---

## 3. Escopo

### 3.1 Dentro do Escopo

| # | Funcionalidade |
|---|----------------|
| 1 | Cadastro de motoristas/motoboys, gerentes/coordenadores, pontos e roteiros |
| 2 | Coleta de dados dos pontos do roteiro (endereço, data/hora de chegada e saída) |
| 3 | Cálculo do tempo parado por ponto e do tempo total parado por roteiro |
| 4 | Histórico de pontos e tempos parados por período, com endereços |
| 5 | Dashboard com gráficos por dia, por mês e por período |
| 6 | Parametrização de custos e da jornada padrão de trabalho |

### 3.2 Fora do Escopo (não fazer)

| # | Funcionalidade excluída |
|---|------------------------|
| 1 | Roteirização automática ou otimização de rotas |
| 2 | Integração com sistemas de folha de pagamento ou ERP |
| 3 | Rastreamento em tempo real com telemetria embarcada no veículo |
| 4 | Aplicativo nativo publicado em lojas de aplicativos |

---

## 4. Regras de Negócio

| ID | Regra |
|----|-------|
| **RN01** | O ponto de partida **não** conta tempo parado: o cronômetro de parada só é considerado a partir do segundo ponto do roteiro. |
| **RN02** | O tempo parado em um ponto é a diferença entre o horário de saída e o horário de chegada naquele ponto. |
| **RN03** | O tempo total parado do roteiro é a soma dos tempos parados de todos os pontos, **exceto** o ponto de partida. |
| **RN04** | A jornada padrão de trabalho é de **8 horas por dia** e serve de base percentual para os indicadores de tempo parado. |
| **RN05** | Cada roteiro pertence a **um único motorista/motoboy** e a **uma única data**. |
| **RN06** | Os pontos de um roteiro possuem **ordem sequencial** (1, 2, 3, 4 …) que define o trajeto do dia. |
| **RN07** | O custo do trajeto é calculado a partir do **valor do combustível**, do **rendimento km/litro** do veículo e da **distância percorrida**. |

---

## 5. Exemplo de Roteiro

Os roteiros a seguir ilustram o modelo de coleta: cada ponto possui identificação sequencial, endereço e tempo parado. O ponto 1 (partida) **não** acumula tempo parado.

| Roteiro | Ponto / Endereço | Tempo Parado | Observação |
|---------|-------------------|--------------|------------|
| A | 1 — Seg. Família (partida) | — | Ponto de partida não conta tempo |
| A | 2 — Rua Peru, 55 | 15 min | Parada intermediária |
| A | 3 — Rua X, 5 | 10 min | Parada intermediária |
| A | 4 — Av. João César | 50 min | Ponto final elaborado |
| B | 1 — Partida | — | Não conta tempo |
| B | 2 | 10 min | |
| B | 3 | 5 min | |
| B | 4 | 26 min | |
| C | 1 — Partida | — | Não conta tempo |
| C | 2 | 5 min | |
| C | 3 | 10 min | |
| C | 4 | 30 min | |

> **Cálculo do Roteiro A:** Tempo total parado = 15 + 10 + 50 = **75 minutos** (1h15min), equivalente a **15,6%** da jornada padrão de 8h.
