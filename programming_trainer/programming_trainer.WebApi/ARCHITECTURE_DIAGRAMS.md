# N8N Workflow Architecture

## System-Diagramm

```mermaid
graph TB
    subgraph Frontend["Angular Frontend"]
        UI[Student UI]
        GenerateBtn[Generate Assignment Button]
        SubmitBtn[Submit Code Button]
    end

    subgraph Backend["ASP.NET Core API"]
        GenEndpoint[POST /api/assignments/generate]
        EvalEndpoint[POST /api/assignments/evaluate]
        GenWebhook[PUT /api/assignments/webhook/generated]
        EvalWebhook[PUT /api/assignments/webhook/evaluated]
        DB[(SQL Database)]
    end

    subgraph N8N["N8N Workflows"]
        GenWorkflow[Generate Assignment Workflow]
        EvalWorkflow[Evaluate Assignment Workflow]
    end

    subgraph AI["AI Services"]
        OpenAI[OpenAI / ChatGPT]
        Claude[Claude]
        Other[Other AI Services]
    end

    %% Generate Flow
    UI -->|1. Click Generate| GenerateBtn
    GenerateBtn -->|2. POST Request| GenEndpoint
    GenEndpoint -->|3. Create Assignment\nStatus: Generating| DB
    GenEndpoint -->|4. Trigger Webhook| GenWorkflow
    GenWorkflow -->|5. Send Prompt| OpenAI
    OpenAI -->|6. Return Generated\nTitle & Description| GenWorkflow
    GenWorkflow -->|7. Callback| GenWebhook
    GenWebhook -->|8. Update Assignment\nStatus: Created| DB
    DB -->|9. Poll/WebSocket| UI

    %% Evaluate Flow
    UI -->|1. Click Submit| SubmitBtn
    SubmitBtn -->|2. POST Request| EvalEndpoint
    EvalEndpoint -->|3. Save Code\nStatus: Evaluating| DB
    EvalEndpoint -->|4. Trigger Webhook| EvalWorkflow
    EvalWorkflow -->|5. Send Code + Task| Claude
    Claude -->|6. Return Score\n& Feedback| EvalWorkflow
    EvalWorkflow -->|7. Callback| EvalWebhook
    EvalWebhook -->|8. Update Assignment\nStatus: Evaluated| DB
    DB -->|9. Poll/WebSocket| UI

    style Frontend fill:#e1f5ff
    style Backend fill:#fff4e1
    style N8N fill:#ffe1f5
    style AI fill:#e1ffe1
```

---

## Sequenzdiagramm: Aufgabenerstellung

```mermaid
sequenceDiagram
    actor Student
    participant Frontend
    participant API
    participant DB
    participant N8N
    participant AI

    Student->>Frontend: Klickt "Neue Aufgabe generieren"
    Frontend->>Student: Zeigt Dialog
    Student->>Frontend: Gibt Prompt ein + wählt Kategorie/Sprache
    Frontend->>API: POST /api/assignments/generate
    API->>DB: CREATE Assignment (Status: Generating)
    DB-->>API: Assignment ID
    API->>N8N: POST /webhook/generate-assignment
    API-->>Frontend: { assignmentId, success: true }
    Frontend->>Student: Zeigt "Generierung läuft..."
    
    N8N->>AI: Sende Prompt zur Aufgabengenerierung
    AI-->>N8N: Generierte Aufgabe (Title, Description)
    N8N->>API: PUT /api/assignments/webhook/generated
    API->>DB: UPDATE Assignment (Status: Created)
    
    loop Polling (alle 3 Sekunden)
        Frontend->>API: GET /api/assignments/{id}
        API->>DB: SELECT Assignment
        DB-->>API: Assignment Daten
        API-->>Frontend: Assignment mit Status
    end
    
    Frontend->>Student: Zeigt fertige Aufgabe an
```

---

## Sequenzdiagramm: Code-Bewertung

```mermaid
sequenceDiagram
    actor Student
    participant Frontend
    participant API
    participant DB
    participant N8N
    participant AI

    Student->>Frontend: Schreibt Code
    Student->>Frontend: Klickt "Einreichen & Bewerten"
    Frontend->>API: POST /api/assignments/evaluate
    API->>DB: UPDATE Assignment (Code, Status: Evaluating)
    API->>N8N: POST /webhook/evaluate-assignment
    API-->>Frontend: { assignmentId, success: true }
    Frontend->>Student: Zeigt "Bewertung läuft..."
    
    N8N->>AI: Sende Code + Aufgabenbeschreibung zur Bewertung
    AI-->>N8N: Bewertung (Score, Feedback)
    N8N->>API: PUT /api/assignments/webhook/evaluated
    API->>DB: UPDATE Assignment (Score, Feedback, Status: Evaluated)
    
    loop Polling (alle 3 Sekunden)
        Frontend->>API: GET /api/assignments/{id}
        API->>DB: SELECT Assignment
        DB-->>API: Assignment mit Bewertung
        API-->>Frontend: Assignment mit Score & Feedback
    end
    
    Frontend->>Student: Zeigt Bewertung an
```

---

## Zustandsdiagramm: Assignment Status

```mermaid
stateDiagram-v2
    [*] --> Generating: POST /generate aufgerufen

    Generating --> Created: n8n sendet generierte Aufgabe
    Generating --> Error: Fehler bei Generierung

    Created --> Evaluating: POST /evaluate aufgerufen
    
    Evaluating --> Evaluated: n8n sendet Bewertung
    Evaluating --> Error: Fehler bei Bewertung

    Evaluated --> [*]: Abgeschlossen
    Error --> [*]: Fehlerbehandlung

    note right of Generating
        Assignment wird vom AI generiert
        Title: "Generating..."
    end note

    note right of Created
        Aufgabe ist bereit
        Student kann Code schreiben
    end note

    note right of Evaluating
        Code wird bewertet
        SubmissionDate gesetzt
    end note

    note right of Evaluated
        Bewertung fertig
        Score & Feedback vorhanden
    end note
```

---

## Komponenten-Diagramm

```mermaid
graph LR
    subgraph "WebApi Layer"
        Controller[AssignmentsController]
        Custom[AssignmentsController.Custom]
        Config[appsettings.json]
    end

    subgraph "Business Logic Layer"
        Context[IContext]
        EntitySet[AssignmentSet]
        Entity[Assignment Entity]
    end

    subgraph "Database Layer"
        SQL[(SQL Database)]
    end

    subgraph "External Services"
        N8N[N8N Instance]
        HTTP[HttpClientFactory]
    end

    Controller --> Custom
    Custom --> HTTP
    Custom --> Context
    Custom --> Config
    Context --> EntitySet
    EntitySet --> Entity
    Entity --> SQL
    HTTP --> N8N
    N8N -.Callback.-> Custom

    style Custom fill:#ffd700
    style N8N fill:#ff69b4
    style SQL fill:#4169e1
```

---

## Deployment-Übersicht

```mermaid
graph TB
    subgraph "Development"
        DevFE[Angular Dev Server<br/>localhost:4200]
        DevBE[ASP.NET API<br/>localhost:5000]
        DevN8N[N8N Local<br/>localhost:5678]
        DevDB[(LocalDB)]
    end

    subgraph "Production"
        ProdFE[Angular App<br/>app.example.com]
        ProdBE[ASP.NET API<br/>api.example.com]
        ProdN8N[N8N Cloud<br/>n8n.cloud]
        ProdDB[(Azure SQL)]
    end

    DevFE --> DevBE
    DevBE --> DevN8N
    DevBE --> DevDB
    DevN8N -.-> DevBE

    ProdFE --> ProdBE
    ProdBE --> ProdN8N
    ProdBE --> ProdDB
    ProdN8N -.-> ProdBE

    style Development fill:#e1f5ff
    style Production fill:#ffe1e1
```

---

## API Endpoints Übersicht

```mermaid
graph TD
    API[API Base<br/>/api/assignments]
    
    API --> Gen[POST /generate<br/>Neue Aufgabe generieren]
    API --> Eval[POST /evaluate<br/>Code bewerten]
    API --> WebGen[PUT /webhook/generated<br/>Generierte Aufgabe empfangen]
    API --> WebEval[PUT /webhook/evaluated<br/>Bewertung empfangen]
    
    Gen -.->|Initiiert| N8NGen[N8N Generate Workflow]
    N8NGen -.->|Callback| WebGen
    
    Eval -.->|Initiiert| N8NEval[N8N Evaluate Workflow]
    N8NEval -.->|Callback| WebEval

    style Gen fill:#90EE90
    style Eval fill:#87CEEB
    style WebGen fill:#FFB6C1
    style WebEval fill:#DDA0DD
    style N8NGen fill:#FFA500
    style N8NEval fill:#FF6347
```

Diese Diagramme visualisieren die gesamte Architektur und helfen beim Verständnis der Workflow-Integration! ??
