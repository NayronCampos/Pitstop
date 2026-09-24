# Critérios de Aceitação e Pontos Extras — Pitstop

**Disciplina:** Engenharia de Software II  
**Professor:** Sandro Laudares  

---

## 1. Critérios de Aceitação

| # | Critério | Como verificar |
|---|----------|---------------|
| **CA01** | O sistema **não** computa tempo parado no ponto de partida do roteiro. | Criar roteiro com 4 pontos; verificar que o ponto 1 exibe tempo = 0 e não entra no total. |
| **CA02** | O dashboard apresenta os **três recortes** solicitados: dia, mês e período. | Acessar dashboard; confirmar presença de gráficos "por dia", "por mês" e "por período". |
| **CA03** | Todo tempo parado exibido está vinculado a um **endereço** e a uma **data/hora** registrados. | No histórico, verificar que cada linha mostra endereço + data/hora de chegada e saída. |
| **CA04** | Os parâmetros de custo e de jornada podem ser **alterados sem alteração de código**. | Admin acessa tela de parâmetros, altera valor do combustível; roteiro recalcula automaticamente. |

---

## 2. Pontos Extras

### 2.1 Nome do Produto

**🚛 Pitstop**

> *"Cada minuto parado tem um custo. Você já sabe o seu?"*

**Justificativa:**  
- **Route** — remete diretamente a roteiros/rotas, core do produto  
- **Watch** — duplo sentido: *monitorar* (watchdog) e *relógio/tempo*, sinalizando a função de rastrear tempo parado  
- Nome curto, internacionalizável, fácil de pronunciar e memorizar  
- Domínio e identidade visual coerentes com o segmento de logística urbana

---

### 2.2 Campanha de Divulgação

#### Conceito da Campanha: *"Tempo Parado = Dinheiro Perdido"*

**Slogan principal:**  
> **"Pitstop: Você sabe quantas horas sua frota ficou parada hoje?"**

---

#### Peça 1 — Post para LinkedIn / Instagram B2B

> 📦 **Sua operação de entrega tem um inimigo invisível.**
>
> Cada minuto que seu motorista fica parado em um ponto do roteiro **custa dinheiro real** — combustível, salário, prazo.
>
> Com o **Pitstop**, você:
> ✅ Sabe exatamente onde e por quanto tempo cada entregador ficou parado  
> ✅ Visualiza gráficos de tempo parado por dia, mês e período  
> ✅ Calcula o custo real de cada rota  
> ✅ Toma decisões baseadas em dados, não em achismo  
>
> **Transforme tempo invisível em vantagem competitiva.**  
> 👉 Conheça o Pitstop — *monitoramento de roteiros para logística urbana*
>
> `#logistica #entregaurbana #gestaodetransporte #Pitstop #KPIs`

---

#### Peça 2 — E-mail Marketing (assunto do e-mail)

**Assunto:** `Você sabia que sua frota pode estar perdendo até 2h/dia invisíveis?`

> Olá, [Nome do Gestor],
>
> Empresas de logística urbana perdem, em média, **15% a 25% da jornada diária** em tempo parado não monitorado — filas, aguardando destinatário, trânsito.
>
> O problema: **você não sabe onde está esse tempo.**
>
> O Pitstop resolve isso com um painel simples e direto ao ponto:
>
> | O que você vê | O que isso significa |
> |---------------|----------------------|
> | Tempo parado por ponto | Gargalos identificados por endereço |
> | Gráfico por dia/mês | Tendências e comparativos |
> | Custo estimado do roteiro | Decisão baseada em R$ reais |
>
> **Experimente gratuitamente.** Sem instalação, funciona no navegador.  
> 👉 [Acessar Pitstop]
>
> Atenciosamente,  
> Equipe Pitstop

---

#### Peça 3 — Card de Apresentação (formato pitch 30 segundos)

> "Você já se perguntou por que seus roteiros demoram mais do que o planejado?
>
> Com o **Pitstop**, seus motoristas registram chegada e saída em cada ponto do roteiro diário. O sistema calcula automaticamente quanto tempo ficou parado em cada endereço e exibe tudo em um dashboard visual — por dia, por mês, por período.
>
> Resultado: você identifica gargalos, renegocia prazos com clientes e reduz custos com dados reais na mão.
>
> Pitstop. **Porque tempo parado é custo visível."**

---

## 3. Resumo dos Entregáveis

| Entregável | Status | Arquivo |
|-----------|--------|---------|
| Documento de especificação — Visão Geral | ✅ | `docs/01_visao_geral.md` |
| Documento de especificação — Requisitos | ✅ | `docs/02_requisitos.md` |
| Modelo de dados + Diagrama de Classes | ✅ | `docs/03_modelo_de_dados.md` |
| Diagrama de Casos de Uso | ✅ | `docs/04_casos_de_uso.md` |
| Diagrama de Robustez | ✅ | `docs/05_diagrama_robustez.md` |
| Critérios de Aceitação + Pontos Extras | ✅ | `docs/06_criterios_aceitacao.md` |
| MVP — Implementação Web | ✅ | `app/` |
