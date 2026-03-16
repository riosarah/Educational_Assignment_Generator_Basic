# N8N Workflow Endpoints für Programming Trainer

Diese Dokumentation beschreibt die speziellen API-Endpoints für die Integration mit n8n Workflows zur Aufgabenerstellung und -bewertung.

---

## ?? Übersicht

Das System bietet vier Hauptendpoints für die n8n-Integration:

1. **POST /api/assignments/generate** - Startet die Aufgabenerstellung
2. **POST /api/assignments/evaluate** - Startet die Aufgabenbewertung
3. **PUT /api/assignments/webhook/generated** - Webhook für generierte Aufgaben (n8n ? API)
4. **PUT /api/assignments/webhook/evaluated** - Webhook für bewertete Aufgaben (n8n ? API)

---

## ?? Workflow 1: Aufgabenerstellung

### 1.1 Frontend ? Backend: Aufgabe generieren anfordern

**Endpoint:** `POST /api/assignments/generate`

**Request Body:**
```json
{
  "studentId": 1,
  "studentPrompt": "Erstelle eine Aufgabe über Sortieralgorithmen mit Bubble Sort",
  "categoryId": 2,
  "programmingLanguageId": 1
}
```

**Response (200 OK):**
```json
{
  "assignmentId": 42,
  "message": "Assignment generation workflow triggered successfully",
  "success": true,
  "workflowExecutionId": "abc123-workflow-id"
}
```

**Was passiert intern:**
1. Ein neues Assignment wird in der DB erstellt mit Status "Generating"
2. Der n8n Webhook wird aufgerufen mit allen relevanten Daten
3. Die AssignmentId wird zurückgegeben

---

### 1.2 N8N Workflow ? Backend: Generierte Aufgabe zurückgeben

**Endpoint:** `PUT /api/assignments/webhook/generated`

**Request Body (von n8n):**
```json
{
  "assignmentId": 42,
  "title": "Bubble Sort implementieren",
  "description": "Implementieren Sie den Bubble Sort Algorithmus in C#. Die Funktion soll ein int-Array sortieren und das sortierte Array zurückgeben. Achten Sie auf folgende Anforderungen:\n\n1. Die Funktion heißt BubbleSort\n2. Parameter: int[] array\n3. Rückgabe: int[] (sortiertes Array)\n4. Implementieren Sie den klassischen Bubble Sort mit verschachtelten Schleifen\n5. Optimieren Sie mit einem 'swapped' Flag\n\nBeispiel:\nInput: [64, 34, 25, 12, 22, 11, 90]\nOutput: [11, 12, 22, 25, 34, 64, 90]"
}
```

**Response (200 OK):**
```json
{
  "message": "Assignment updated successfully",
  "assignmentId": 42
}
```

**Was passiert intern:**
1. Das Assignment wird mit dem generierten Titel und Beschreibung aktualisiert
2. Der Status wird auf "Created" gesetzt
3. Der Student sieht nun die vollständige Aufgabe im Frontend

---

## ?? Workflow 2: Aufgabenbewertung

### 2.1 Frontend ? Backend: Code zur Bewertung einreichen

**Endpoint:** `POST /api/assignments/evaluate`

**Request Body:**
```json
{
  "assignmentId": 42,
  "submittedCode": "public int[] BubbleSort(int[] array)\n{\n    int n = array.Length;\n    for (int i = 0; i < n - 1; i++)\n    {\n        bool swapped = false;\n        for (int j = 0; j < n - i - 1; j++)\n        {\n            if (array[j] > array[j + 1])\n            {\n                int temp = array[j];\n                array[j] = array[j + 1];\n                array[j + 1] = temp;\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n    return array;\n}"
}
```

**Response (200 OK):**
```json
{
  "assignmentId": 42,
  "message": "Assignment evaluation workflow triggered successfully",
  "success": true,
  "workflowExecutionId": "xyz789-workflow-id"
}
```

**Was passiert intern:**
1. Das Assignment wird mit dem eingereichten Code aktualisiert
2. Der Status wird auf "Evaluating" gesetzt
3. SubmissionDate wird auf jetzt gesetzt
4. Der n8n Webhook wird mit Code und Aufgabenbeschreibung aufgerufen

---

### 2.2 N8N Workflow ? Backend: Bewertung zurückgeben

**Endpoint:** `PUT /api/assignments/webhook/evaluated`

**Request Body (von n8n):**
```json
{
  "assignmentId": 42,
  "score": 95,
  "feedback": "Ausgezeichnete Lösung! ?\n\nStärken:\n- Korrekte Implementierung des Bubble Sort Algorithmus\n- Optimierung mit 'swapped' Flag vorhanden\n- Code ist gut strukturiert und lesbar\n- Korrekte Rückgabe des sortierten Arrays\n\nVerbesserungsvorschläge:\n- Null-Check für den Input-Array wäre sinnvoll\n- Kommentare zur Erklärung der Logik könnten hilfreich sein\n\nPunkteabzug (5 Punkte):\n- Fehlende Validierung des Input-Parameters"
}
```

**Response (200 OK):**
```json
{
  "message": "Assignment evaluation updated successfully",
  "assignmentId": 42
}
```

**Was passiert intern:**
1. Das Assignment wird mit Score und Feedback aktualisiert
2. Der Status wird auf "Evaluated" gesetzt
3. Der Student sieht nun die Bewertung und das Feedback im Frontend

---

## ?? Konfiguration

Die n8n Webhook-URLs werden in der `appsettings.json` konfiguriert:

```json
{
  "N8n": {
    "GenerateAssignmentWebhookUrl": "http://localhost:5678/webhook-test/generate-task",
    "EvaluateAssignmentWebhookUrl": "http://localhost:5678/webhook-test/evaluate-task"
  }
}
```

Für Produktionsumgebungen sollten diese URLs entsprechend angepasst werden.

---

## ?? Status-Übersicht

Ein Assignment durchläuft folgende Status:

1. **"Generating"** - Aufgabe wird gerade vom AI generiert
2. **"Created"** - Aufgabe wurde erfolgreich generiert und ist bereit
3. **"Submitted"** - Student hat Code eingereicht
4. **"Evaluating"** - Code wird gerade vom AI bewertet
5. **"Evaluated"** - Bewertung ist abgeschlossen
6. **"Error"** - Fehler bei der Generierung oder Bewertung

---

## ?? Sicherheitshinweise

1. **Webhook-Authentifizierung:** Die Webhook-Endpoints sollten mit einem API-Key oder Token gesichert werden
2. **Rate Limiting:** Implementieren Sie Rate Limiting für die `/generate` und `/evaluate` Endpoints
3. **Validierung:** Alle Eingaben werden validiert, aber zusätzliche Business-Logik-Validierung kann sinnvoll sein
4. **HTTPS:** In Produktion sollten alle Endpoints über HTTPS kommunizieren

---

## ?? Testbeispiele

### Swagger UI testen

Die Endpoints sind in Swagger UI verfügbar unter:
- `http://localhost:5000/swagger` (oder der entsprechende Port)

### cURL Beispiele

**Aufgabe generieren:**
```bash
curl -X POST "http://localhost:5000/api/assignments/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "studentPrompt": "Erstelle eine Aufgabe über rekursive Funktionen",
    "categoryId": 1,
    "programmingLanguageId": 1
  }'
```

**Aufgabe bewerten:**
```bash
curl -X POST "http://localhost:5000/api/assignments/evaluate" \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentId": 42,
    "submittedCode": "public int Factorial(int n) { return n <= 1 ? 1 : n * Factorial(n - 1); }"
  }'
```

---

## ?? N8N Workflow-Setup

### Workflow für Aufgabenerstellung

1. **Webhook Trigger Node**
- Method: POST
- Path: `/webhook-test/generate-task`
   
2. **HTTP Request to AI (z.B. OpenAI)**
   - Prompt: Basierend auf `studentPrompt` und `categoryId`
   - Generate: Title und Description
   
3. **HTTP Request zurück zur API**
   - Method: PUT
   - URL: `http://your-api/api/assignments/webhook/generated`
   - Body: `{ assignmentId, title, description }`

### Workflow für Aufgabenbewertung

1. **Webhook Trigger Node**
- Method: POST
- Path: `/webhook-test/evaluate-task`
   
2. **HTTP Request to AI (z.B. OpenAI)**
   - Prompt: Code-Review basierend auf `submittedCode` und `description`
   - Generate: Score (0-100) und Feedback
   
3. **HTTP Request zurück zur API**
   - Method: PUT
   - URL: `http://your-api/api/assignments/webhook/evaluated`
   - Body: `{ assignmentId, score, feedback }`

---

## ?? Fehlerbehandlung

**Mögliche Fehlercodes:**

- **400 Bad Request:** Ungültige Request-Daten
- **404 Not Found:** Assignment nicht gefunden
- **500 Internal Server Error:** Serverfehler oder n8n nicht erreichbar

**Beispiel Fehlerantwort:**
```json
{
  "assignmentId": 0,
  "message": "Failed to trigger workflow: Connection refused",
  "success": false,
  "workflowExecutionId": null
}
```

---

## ?? Zusammenfassung

Die API bietet eine vollständige Bidirektionale Kommunikation mit n8n Workflows:

```
Frontend ? Backend ? n8n Workflow ? AI ? n8n ? Backend ? Frontend
```

Dies ermöglicht eine asynchrone Verarbeitung von AI-Aufgaben ohne dass das Frontend blockiert wird.
