# N8N Workflows - Setup & Installation Guide

## ?? Übersicht

Diese Anleitung beschreibt die Installation und Konfiguration der beiden n8n Workflows für das Programming Trainer Backend:

1. **C# Aufgaben Generator** - Generiert Programmieraufgaben basierend auf Student-Prompts
2. **C# Code Bewerter** - Bewertet eingereichten Code und gibt Feedback

---

## ?? Voraussetzungen

### Software
- **n8n** (Version 1.0+)
  - Installation: `npm install -g n8n`
  - Oder Docker: `docker run -it --rm -p 5678:5678 n8nio/n8n`
- **OpenAI Account** mit API-Key
- **.NET 8 Backend** (muss laufen auf `http://localhost:5000`)

### Ports
- n8n: `http://localhost:5678`
- Backend API: `http://localhost:5000`

---

## ?? Installation

### Schritt 1: n8n starten

```bash
# Option 1: npm
n8n start

# Option 2: Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

n8n ist nun verfügbar unter: `http://localhost:5678`

### Schritt 2: OpenAI Credentials hinzufügen

1. Öffne n8n: `http://localhost:5678`
2. Gehe zu **Settings ? Credentials**
3. Klicke auf **Add Credential**
4. Wähle **OpenAI**
5. Gib deinen OpenAI API Key ein
6. Speichere die Credentials

**Wichtig:** Notiere dir die **Credential ID** (z.B. `iMe6LlMtPdK2T4G0`)

### Schritt 3: Workflows importieren

#### Workflow 1: C# Aufgaben Generator

1. Gehe zu **Workflows**
2. Klicke auf **Import from File**
3. Wähle `n8n_workflows/C# Aufgaben Generator.json`
4. Der Workflow wird importiert

#### Workflow 2: C# Code Bewerter

1. Gehe zu **Workflows**
2. Klicke auf **Import from File**
3. Wähle `n8n_workflows/C# Code Bewerter.json`
4. Der Workflow wird importiert

### Schritt 4: OpenAI Credentials in Workflows eintragen

Für **beide Workflows**:

1. Öffne den Workflow
2. Klicke auf den Node **"OpenAI - ..."**
3. Im Credentials-Dropdown wähle deine OpenAI Credentials
4. Speichere den Workflow

### Schritt 5: Workflows aktivieren

1. Öffne **C# Aufgaben Generator**
2. Klicke auf **Active** (Toggle oben rechts)
3. Wiederhole für **C# Code Bewerter**

---

## ?? Webhook URLs

Nach der Aktivierung erhältst du folgende Webhook URLs:

### Production URLs (wenn aktiviert)

```
Aufgaben Generator:
http://localhost:5678/webhook/generate-assignment

Code Bewerter:
http://localhost:5678/webhook/evaluate-assignment
```

### Test URLs (für manuelle Tests)

```
Aufgaben Generator:
http://localhost:5678/webhook-test/generate-assignment

Code Bewerter:
http://localhost:5678/webhook-test/evaluate-assignment
```

---

## ?? Backend Konfiguration

Aktualisiere die `appsettings.json` im Backend:

```json
{
  "N8n": {
    "GenerateAssignmentWebhookUrl": "http://localhost:5678/webhook/generate-assignment",
    "EvaluateAssignmentWebhookUrl": "http://localhost:5678/webhook/evaluate-assignment"
  }
}
```

**Wichtig:** Falls n8n auf einem anderen Host/Port läuft, passe die URLs an!

---

## ?? Testen der Workflows

### Test 1: Aufgabe generieren

```bash
# Backend-Endpoint aufrufen
curl -X POST http://localhost:5000/api/assignments/generate \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "studentPrompt": "Erstelle eine Aufgabe über Sortieralgorithmen mit Bubble Sort",
    "categoryId": 2,
    "programmingLanguageId": 1
  }'
```

**Erwartete Response:**
```json
{
  "assignmentId": 42,
  "message": "Assignment generation workflow triggered successfully",
  "success": true,
  "workflowExecutionId": "abc123"
}
```

**Prüfen in n8n:**
1. Gehe zu **Executions**
2. Du solltest eine erfolgreiche Ausführung sehen
3. Klicke darauf um Details zu sehen

**Prüfen im Backend:**
```bash
curl http://localhost:5000/api/assignments/42
```

Das Assignment sollte jetzt `title` und `description` enthalten (Status: "Created").

### Test 2: Code bewerten

```bash
# Code einreichen
curl -X POST http://localhost:5000/api/assignments/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentId": 42,
    "submittedCode": "public int[] BubbleSort(int[] array)\n{\n    int n = array.Length;\n    for (int i = 0; i < n - 1; i++)\n    {\n        for (int j = 0; j < n - i - 1; j++)\n        {\n            if (array[j] > array[j + 1])\n            {\n                int temp = array[j];\n                array[j] = array[j + 1];\n                array[j + 1] = temp;\n            }\n        }\n    }\n    return array;\n}"
  }'
```

**Erwartete Response:**
```json
{
  "assignmentId": 42,
  "message": "Assignment evaluation workflow triggered successfully",
  "success": true,
  "workflowExecutionId": "xyz789"
}
```

**Prüfen:**
```bash
curl http://localhost:5000/api/assignments/42
```

Das Assignment sollte jetzt `score` und `feedback` enthalten (Status: "Evaluated").

---

## ?? Workflow-Logik

### Workflow 1: C# Aufgaben Generator

```
1. Webhook - Generate Assignment
   ??> Empfängt: { assignmentId, studentId, studentPrompt, categoryId, programmingLanguageId }

2. Request Validierung & Preparation
   ??> Validiert Input, erstellt System-/User-Prompt

3. OpenAI - Aufgabe generieren
   ??> Ruft GPT-4o auf mit den Prompts

4. Response Parsing & Formatting
   ??> Extrahiert JSON aus AI-Response
   ??> Formatiert für Backend-Webhook

5. Backend Webhook - Assignment Generated
   ??> PUT http://localhost:5000/api/assignments/webhook/generated
   ??> Body: { assignmentId, title, description }

6. Response - Success
   ??> Gibt executionId und Status zurück
```

### Workflow 2: C# Code Bewerter

```
1. Webhook - Evaluate Assignment
   ??> Empfängt: { assignmentId, submittedCode, description, programmingLanguageId }

2. Request Validierung & Preparation
   ??> Validiert Input, erstellt Bewertungs-Prompts

3. OpenAI - Code bewerten
   ??> Ruft GPT-4o auf mit Code und Aufgabenstellung

4. Response Parsing & Formatting
   ??> Extrahiert JSON aus AI-Response
   ??> Validiert Score (0-100)

5. Backend Webhook - Assignment Evaluated
   ??> PUT http://localhost:5000/api/assignments/webhook/evaluated
   ??> Body: { assignmentId, score, feedback }

6. Response - Success
   ??> Gibt executionId und Status zurück
```

---

## ??? Anpassungen

### Andere Programmiersprachen hinzufügen

In beiden Workflows, Node **"Request Validierung & Preparation"**:

```javascript
const programmingLanguages = {
  1: 'C#',
  2: 'JavaScript',
  3: 'Python',
  4: 'Java',
  5: 'TypeScript',
  6: 'Go',      // Neu hinzufügen
  7: 'Rust'     // Neu hinzufügen
};
```

### OpenAI Model ändern

In den Nodes **"OpenAI - ..."**:
- Wähle ein anderes Modell (z.B. `gpt-4-turbo`, `gpt-3.5-turbo`)
- Passe `temperature` an (0.0 = deterministisch, 1.0 = kreativ)
- Passe `maxTokens` an (max. Länge der Response)

### Backend URL ändern

In den Nodes **"Backend Webhook - ..."**:
- Passe die URL an, falls Backend auf anderem Host/Port läuft
- Beispiel: `http://192.168.1.100:5000/api/assignments/webhook/generated`

### Timeout anpassen

In den Nodes **"Backend Webhook - ..."** ? **Options** ? **Timeout**:
- Standard: 10000ms (10 Sekunden)
- Erhöhen falls Backend langsam reagiert

---

## ?? Troubleshooting

### Problem: Workflow startet nicht

**Symptom:** Backend bekommt Fehler beim Triggern des Workflows

**Lösung:**
1. Prüfe ob n8n läuft: `http://localhost:5678`
2. Prüfe ob Workflow **aktiviert** ist (Active Toggle)
3. Prüfe die Webhook-URL im Backend (`appsettings.json`)

### Problem: OpenAI Fehler

**Symptom:** `Error: Unauthorized` oder `API Key invalid`

**Lösung:**
1. Prüfe OpenAI Credentials in n8n
2. Prüfe ob API Key gültig ist
3. Prüfe OpenAI Account Limit/Billing

### Problem: Backend empfängt keine Webhooks

**Symptom:** Assignment Status bleibt "Generating" oder "Evaluating"

**Lösung:**
1. Prüfe n8n Executions ? Suche Fehler
2. Prüfe Backend Logs
3. Prüfe ob Backend erreichbar ist: `curl http://localhost:5000/api/assignments`
4. Prüfe Firewall/Netzwerk zwischen n8n und Backend

### Problem: JSON Parsing Fehler

**Symptom:** `Fehler beim Parsen der AI Response`

**Lösung:**
1. Öffne die fehlerhafte Execution in n8n
2. Schaue dir die "Raw Response" vom OpenAI Node an
3. Passe den Prompt im Node "Request Validierung & Preparation" an
4. Füge mehr Beispiele hinzu oder ändere `temperature` auf 0.3

### Problem: Score ist ungültig

**Symptom:** `Ungültiger Score`

**Lösung:**
1. Im Workflow "C# Code Bewerter" ? Node "Response Parsing & Formatting"
2. Prüfe ob AI einen Score zwischen 0-100 zurückgibt
3. Passe den System-Prompt an: "Score MUSS eine Ganzzahl zwischen 0 und 100 sein"

---

## ?? Monitoring

### n8n Executions überwachen

1. Gehe zu **Executions** in n8n
2. Filter nach:
   - **Workflow:** "C# Aufgaben Generator" / "C# Code Bewerter"
   - **Status:** Success / Error
   - **Zeitraum:** Last 24h / Last 7 days

### Execution Details ansehen

1. Klicke auf eine Execution
2. Siehst du alle Nodes und ihre Daten
3. Bei Fehlern: Roter Node mit Fehlermeldung

### Webhook-Statistiken

n8n zeigt für jeden Webhook:
- Anzahl der Aufrufe
- Durchschnittliche Ausführungszeit
- Fehlerrate

---

## ?? Production Deployment

### n8n mit Docker Compose

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    container_name: n8n-programming-trainer
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-secure-password
      - WEBHOOK_URL=https://n8n.yourdomain.com/
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

volumes:
  n8n_data:
```

```bash
docker-compose up -d
```

### SSL/HTTPS für Webhooks

Falls n8n hinter einem Reverse Proxy (nginx, Traefik):

```
https://n8n.yourdomain.com/webhook/generate-assignment
https://n8n.yourdomain.com/webhook/evaluate-assignment
```

Passe `appsettings.json` entsprechend an!

### Umgebungsvariablen

Für Production:

```json
{
  "N8n": {
    "GenerateAssignmentWebhookUrl": "${N8N_GENERATE_WEBHOOK_URL}",
    "EvaluateAssignmentWebhookUrl": "${N8N_EVALUATE_WEBHOOK_URL}"
  }
}
```

---

## ?? Weitere Ressourcen

- [n8n Dokumentation](https://docs.n8n.io/)
- [OpenAI API Dokumentation](https://platform.openai.com/docs)
- [n8n Community Forum](https://community.n8n.io/)

---

## ? Checkliste

- [ ] n8n installiert und läuft auf `http://localhost:5678`
- [ ] OpenAI Credentials in n8n hinzugefügt
- [ ] Beide Workflows importiert
- [ ] OpenAI Credentials in Workflows eingetragen
- [ ] Workflows aktiviert
- [ ] Backend `appsettings.json` aktualisiert
- [ ] Backend neu gestartet
- [ ] Test 1: Aufgabe generieren erfolgreich
- [ ] Test 2: Code bewerten erfolgreich
- [ ] Monitoring/Executions geprüft

---

**Bei Fragen oder Problemen:** Öffne ein Issue im Repository oder kontaktiere das Entwicklerteam.
