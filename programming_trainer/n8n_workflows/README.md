# N8N Workflows für Programming Trainer

Dieser Ordner enthält die n8n Workflow-Definitionen für die AI-gestützte Aufgabengenerierung und Code-Bewertung.

---

## ?? Dateien

| Datei | Beschreibung |
|-------|--------------|
| `C# Aufgaben Generator.json` | n8n Workflow für die Generierung von Programmieraufgaben via OpenAI GPT-4o |
| `C# Code Bewerter.json` | n8n Workflow für die Bewertung von eingereichten Code-Lösungen via OpenAI GPT-4o |
| `README_SETUP.md` | Detaillierte Installations- und Setup-Anleitung |
| `TEST_PAYLOADS.md` | Beispiel-Payloads für manuelle Tests und Debugging |

---

## ?? Quick Start

### 1. n8n starten

```bash
# Option 1: npm
npm install -g n8n
n8n start

# Option 2: Docker
docker run -it --rm -p 5678:5678 n8nio/n8n
```

### 2. Workflows importieren

1. Öffne `http://localhost:5678`
2. Gehe zu **Workflows ? Import from File**
3. Importiere beide JSON-Dateien

### 3. OpenAI Credentials konfigurieren

1. **Settings ? Credentials ? Add Credential**
2. Wähle **OpenAI**
3. Gib deinen API Key ein
4. Verknüpfe die Credentials mit den Workflow-Nodes

### 4. Workflows aktivieren

Aktiviere beide Workflows über den **Active**-Toggle.

### 5. Backend konfigurieren

Aktualisiere `programming_trainer.WebApi/appsettings.json`:

```json
{
  "N8n": {
    "GenerateAssignmentWebhookUrl": "http://localhost:5678/webhook/generate-assignment",
    "EvaluateAssignmentWebhookUrl": "http://localhost:5678/webhook/evaluate-assignment"
  }
}
```

---

## ?? Workflow-Übersicht

### Workflow 1: C# Aufgaben Generator

**Trigger:** Webhook `POST /webhook/generate-assignment`

**Input:**
```json
{
  "assignmentId": 42,
  "studentId": 1,
  "studentPrompt": "Erstelle eine Aufgabe über ...",
  "categoryId": 2,
  "programmingLanguageId": 1
}
```

**Output (an Backend):**
```json
{
  "assignmentId": 42,
  "title": "Generierter Titel",
  "description": "Vollständige Aufgabenbeschreibung..."
}
```

**Backend Webhook:** `PUT /api/assignments/webhook/generated`

---

### Workflow 2: C# Code Bewerter

**Trigger:** Webhook `POST /webhook/evaluate-assignment`

**Input:**
```json
{
  "assignmentId": 42,
  "submittedCode": "public int[] BubbleSort(...) {...}",
  "description": "Aufgabenstellung...",
  "programmingLanguageId": 1
}
```

**Output (an Backend):**
```json
{
  "assignmentId": 42,
  "score": 95,
  "feedback": "# Bewertung\n\n## ? Stärken:\n..."
}
```

**Backend Webhook:** `PUT /api/assignments/webhook/evaluated`

---

## ?? Testen

### Via Backend API

```bash
# Aufgabe generieren
curl -X POST http://localhost:5000/api/assignments/generate \
  -H "Content-Type: application/json" \
  -d '{"studentId":1,"studentPrompt":"Bubble Sort","categoryId":2,"programmingLanguageId":1}'

# Code bewerten
curl -X POST http://localhost:5000/api/assignments/evaluate \
  -H "Content-Type: application/json" \
  -d '{"assignmentId":42,"submittedCode":"public int[] BubbleSort(...){...}"}'
```

### Direkt an n8n (für Debugging)

```bash
# Test-Webhook aufrufen
curl -X POST http://localhost:5678/webhook-test/generate-assignment \
  -H "Content-Type: application/json" \
  -d '{"assignmentId":42,"studentId":1,"studentPrompt":"...","categoryId":2,"programmingLanguageId":1}'
```

Mehr Beispiele in `TEST_PAYLOADS.md`

---

## ?? Anpassungen

### Andere Programmiersprachen

In beiden Workflows, Node **"Request Validierung & Preparation"**, Zeile ~20:

```javascript
const programmingLanguages = {
  1: 'C#',
  2: 'JavaScript',
  3: 'Python',
  4: 'Java',
  5: 'TypeScript'
};
```

Füge neue Sprachen hinzu oder ändere IDs.

### OpenAI Modell

In den Nodes **"OpenAI - ..."**:
- Model: `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`
- Temperature: `0.3` - `0.9` (deterministisch vs. kreativ)
- Max Tokens: `2000` - `4000`

### Backend URL

In den Nodes **"Backend Webhook - ..."** ? **URL**:
```
http://your-backend-host:port/api/assignments/webhook/...
```

---

## ?? Monitoring

### n8n Executions

1. Öffne n8n: `http://localhost:5678`
2. Gehe zu **Executions**
3. Filter nach Workflow-Name
4. Klicke auf Execution für Details

### Backend Logs

Prüfe ob Webhooks ankommen:
```bash
# Backend Logs ansehen
dotnet run --project programming_trainer.WebApi
```

---

## ?? Troubleshooting

| Problem | Lösung |
|---------|--------|
| Workflow startet nicht | Prüfe ob Workflow aktiviert ist |
| OpenAI Error | Prüfe API Key und Credentials |
| Backend empfängt keine Webhooks | Prüfe Backend URL in Workflows |
| JSON Parsing Error | Schaue Execution Details in n8n an |

Siehe `README_SETUP.md` für detailliertes Troubleshooting.

---

## ?? Dokumentation

- [README_SETUP.md](./README_SETUP.md) - Komplette Setup-Anleitung
- [TEST_PAYLOADS.md](./TEST_PAYLOADS.md) - Test-Beispiele
- [../programming_trainer.WebApi/API_REQUEST_RESPONSE_MODELS.md](../programming_trainer.WebApi/API_REQUEST_RESPONSE_MODELS.md) - API-Dokumentation
- [n8n Dokumentation](https://docs.n8n.io/)
- [OpenAI API Dokumentation](https://platform.openai.com/docs)

---

## ? Requirements

- **n8n** 1.0+ (npm oder Docker)
- **OpenAI Account** mit API Key
- **.NET 8 Backend** läuft auf Port 5000
- **Node.js** 18+ (falls npm-Installation)

---

## ?? Nächste Schritte

1. [ ] Lies `README_SETUP.md` für detaillierte Installation
2. [ ] Importiere beide Workflows in n8n
3. [ ] Konfiguriere OpenAI Credentials
4. [ ] Teste mit Payloads aus `TEST_PAYLOADS.md`
5. [ ] Integriere in dein Frontend

---

**Viel Erfolg! ??**
