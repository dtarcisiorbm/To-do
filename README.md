    # 🧠 To-Do com Integração de IA (LLaMA 3) – Projeto Fullstack

Este projeto é um sistema de gerenciamento de tarefas (To-Do) com autenticação, criação de tarefas e integração com IA utilizando o modelo **LLaMA 3 via Ollama**.

A IA é utilizada para:
- 📌 Gerar automaticamente descrições curtas das tarefas
- 🕐 Sugerir horários disponíveis com base nas tarefas existentes

---

## ⚙️ Tecnologias Utilizadas

| Camada       | Ferramenta                     |
|--------------|---------------------------------|
| Backend      | Java + Spring Boot+React        |
| IA           | LLaMA 3 via Ollama              |
| Frontend     | React (pode ser adaptado)       |
| Autenticação | JWT / OAuth2                    |
| Comunicação  | `HttpClient` com JSON           |

---

## 📊 Fluxo Geral do Sistema

```mermaid
flowchart TD
    A[👤 Usuário acessa aplicação] --> B[🔐 Login]
    B -->|Autenticado| C[📋 Dashboard]
    C --> D[➕ Criar nova tarefa]

    D --> E[📝 Preencher título, data]
    E --> F{🤖 Deseja ajuda da IA?}

    F -- Sim --> G[📨 Enviar dados para API Java]
    G --> H[🧠 API envia prompt para LLaMA 3 via Ollama]
    H --> I[📥 Receber descrição ou sugestão de horário]
    I --> J[✅ Salvar tarefa com sugestão da IA]

    F -- Não --> J[✅ Salvar tarefa manualmente]

    J --> K[🔄 Atualizar lista de tarefas]

    K --> L{📅 Já existem tarefas nesse dia?}
    L -- Sim --> M[🧮 Verificar horários ocupados]
    M --> N[🧠 Chamar IA para sugerir intervalo livre]
    N --> O[🕑 Mostrar horários disponíveis]
    O --> C
```

---

## 🔌 Como Executar

### 🐘 Backend (Java + Spring Boot)
```bash
./mvnw spring-boot:run
```

### 🧠 LLaMA 3 com Ollama
```bash
ollama run llama3
```

> Garanta que sua API está acessando: `http://localhost:11434/api/generate`

### 💻 Frontend (exemplo com React)
```bash
npm install
npm run dev
```

---

## 📬 Exemplo de Prompt para IA

```text
Você é um assistente de agenda. Dado que os horários ocupados no dia 2024-05-20 são: 09:00, 11:00, 13:00,
responda apenas com os horários disponíveis desse dia (sem explicações, só os intervalos livres em formato HH:mm - HH:mm).
Retorne um array de strings.
```

---
    
