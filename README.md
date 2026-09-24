# 🚛 Pitstop
### *Sistema de Monitoramento de Tempo Parado em Roteiros*

> **"Cada minuto parado tem um custo. Você já sabe o seu?"**

---

**Disciplina:** Engenharia de Software II — PUC Minas  
**Professor:** Sandro Laudares  
**Equipe:** _(preencher nome dos integrantes)_  

---

## Sobre o Produto

O **Pitstop** é um MVP para empresas de logística e entrega urbana que precisam saber **onde** e **por quanto tempo** seus profissionais de campo ficam parados durante o roteiro diário.

O sistema permite registrar chegada e saída em cada ponto do roteiro, calcula automaticamente o tempo parado e apresenta dashboards com gráficos por dia, mês e período.

---

## Estrutura do Repositório

```
Projeto-ENG-II/
├── enunciado/
│   └── Especificação de Requisitos — Trabalho2.pdf
│
├── docs/                          ← 1ª Parte: Projeto Preliminar
│   ├── 01_visao_geral.md          ← Contexto, objetivo, escopo, RNs
│   ├── 02_requisitos.md           ← RF01–RF12, RNF01–RNF06
│   ├── 03_modelo_de_dados.md      ← Modelo de dados + Diagrama de Classes (PlantUML)
│   ├── 04_casos_de_uso.md         ← Atores, UCs, Diagrama de Casos de Uso (PlantUML)
│   ├── 05_diagrama_robustez.md    ← Diagrama de Robustez (PlantUML)
│   └── 06_criterios_aceitacao.md  ← Critérios de aceitação + Pontos Extras
│
└── app/                           ← 2ª Parte: Implementação do MVP
    ├── index.html                 ← Login
    ├── dashboard.html             ← Dashboard com gráficos
    ├── roteiros.html              ← Montagem e execução de roteiros
    ├── motoristas.html            ← CRUD motoristas
    ├── gerentes.html              ← CRUD gerentes
    ├── pontos.html                ← CRUD pontos
    ├── historico.html             ← Histórico por período
    ├── parametros.html            ← Parametrização de custos
    ├── css/
    │   └── style.css              ← Design system global (dark mode)
    └── js/
        ├── db.js                  ← Camada de persistência (localStorage)
        ├── calculos.js            ← Lógica de negócio (RN01–RN07)
        ├── auth.js                ← Controle de acesso por perfil
        └── ui.js                  ← Utilitários de UI
```

---

## Como Executar o MVP

1. Abra a pasta `app/` no seu explorador de arquivos
2. Abra o arquivo `app/index.html` no navegador (Chrome ou Firefox)
3. Use uma das contas de demonstração:

| Perfil | E-mail | Senha |
|--------|--------|-------|
| 🔴 Admin | `admin@Pitstop.com` | `admin123` |
| 🟡 Gerente | `gerente@Pitstop.com` | `gerente123` |
| 🟢 Motorista | `joao@Pitstop.com` | `motor123` |

> **Nota:** Os dados são persistidos no `localStorage` do navegador. Na primeira execução, dados de exemplo são carregados automaticamente.

---

## Funcionalidades Implementadas

| Requisito | Descrição | Status |
|-----------|-----------|--------|
| RF01 | CRUD Motoristas/Motoboys | ✅ |
| RF02 | CRUD Gerentes/Coordenadores | ✅ |
| RF03 | CRUD Pontos com endereço e coordenadas | ✅ |
| RF04 | Montagem de roteiro diário com pontos ordenados | ✅ |
| RF05 | Registro de chegada e saída (check-in/out) | ✅ |
| RF06 | Cálculo automático de tempo parado (RN01–RN03) | ✅ |
| RF07 | Histórico por período com endereços | ✅ |
| RF08 | Dashboard com gráficos dia/mês/período | ✅ |
| RF09 | Parâmetros: combustível, km/litro, custo/km | ✅ |
| RF10 | Parâmetros: jornada padrão 8h/dia | ✅ |
| RF11 | Cálculo de custo estimado do roteiro (RN07) | ✅ |
| RF12 | Exportação de relatórios CSV | ✅ |
| RNF02 | Interface responsiva desktop + mobile | ✅ |
| RNF04 | Controle de acesso por perfil | ✅ |
| RNF05 | Log de auditoria | ✅ |

---

## Regras de Negócio Implementadas

| ID | Regra | Implementação |
|----|-------|--------------|
| RN01 | Ponto de partida não conta tempo parado | `calculos.js` → `tempoParadoPonto()` |
| RN02 | Tempo parado = saída − chegada | `calculos.js` → `tempoParadoPonto()` |
| RN03 | Tempo total = soma exceto ponto 1 | `calculos.js` → `tempoTotalRoteiro()` |
| RN04 | Base percentual: 8h/dia | `calculos.js` → `percentualJornada()` |
| RN05 | 1 roteiro por motorista/data | `db.js` → `roteiros.salvar()` |
| RN06 | Pontos em ordem sequencial | `roteiros.html` → seleção ordenada |
| RN07 | Custo = distância × parâmetros | `calculos.js` → `custoRoteiro()` |

---

## Documentação de Especificação (1ª Parte)

| Documento | Link |
|-----------|------|
| Visão Geral, Contexto e Regras de Negócio | [docs/01_visao_geral.md](docs/01_visao_geral.md) |
| Requisitos Funcionais e Não Funcionais | [docs/02_requisitos.md](docs/02_requisitos.md) |
| Modelo de Dados + Diagrama de Classes | [docs/03_modelo_de_dados.md](docs/03_modelo_de_dados.md) |
| Diagrama de Casos de Uso | [docs/04_casos_de_uso.md](docs/04_casos_de_uso.md) |
| Diagrama de Robustez | [docs/05_diagrama_robustez.md](docs/05_diagrama_robustez.md) |
| Critérios de Aceitação + Pontos Extras | [docs/06_criterios_aceitacao.md](docs/06_criterios_aceitacao.md) |

---

## Pontos Extras

### Nome do Produto: **Pitstop** 🚛
- **Route** = roteiro/rota (core do negócio)
- **Watch** = monitorar + relógio/tempo (duplo sentido)

### Slogan: *"Tempo parado é custo visível."*

> Veja a campanha de divulgação completa em [`docs/06_criterios_aceitacao.md`](docs/06_criterios_aceitacao.md)

---

## Tecnologias

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript ES6+
- **Gráficos:** Chart.js 4.x (CDN)
- **Tipografia:** Google Fonts — Inter
- **Persistência:** localStorage (banco de dados em JSON)
- **Diagramas:** PlantUML (arquivos `.md` com blocos `plantuml`)
