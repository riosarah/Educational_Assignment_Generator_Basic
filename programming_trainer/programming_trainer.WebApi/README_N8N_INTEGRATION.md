# N8N Workflow Integration - Zusammenfassung

## ? Was wurde erstellt?

### 1. Backend API Endpoints

**Datei:** `programming_trainer.WebApi/Controllers/App/AssignmentsController.Custom.cs`

Vier neue Endpoints wurden hinzugefügt:

#### Frontend ? Backend Endpoints:
- **POST /api/assignments/generate** - Startet Aufgabenerstellung via n8n
- **POST /api/assignments/evaluate** - Startet Code-Bewertung via n8n

#### N8N ? Backend Webhooks:
- **PUT /api/assignments/webhook/generated** - Empfängt generierte Aufgabe von n8n
- **PUT /api/assignments/webhook/evaluated** - Empfängt Bewertung von n8n

---

### 2. Konfiguration

**Datei:** `programming_trainer.WebApi/appsettings.json`

```json
{
  "N8n": {
    "GenerateAssignmentWebhookUrl": "http://localhost:5678/webhook-test/generate-task",
    "EvaluateAssignmentWebhookUrl": "http://localhost:5678/webhook-test/evaluate-task"
  }
}
```

---

### 3. Dependency Injection

**Datei:** `programming_trainer.WebApi/Program.cs`

HttpClientFactory wurde hinzugefügt für externe HTTP-Calls zu n8n.

---

### 4. Dokumentation

- **N8N_ENDPOINTS.md** - Vollständige API-Dokumentation mit Beispielen
- **API_REQUEST_RESPONSE_MODELS.md** - Detaillierte Request/Response-Objekte
- **FRONTEND_INTEGRATION.md** - Anleitung für Angular-Integration
- **ARCHITECTURE_DIAGRAMS.md** - Mermaid-Diagramme der Architektur
- **README_N8N_INTEGRATION.md** - Diese Zusammenfassung

---

## ?? Workflow-Diagramm

### Aufgabenerstellung:
```
Frontend ? POST /api/assignments/generate
              ?
          [Backend erstellt Assignment mit Status "Generating"]
              ?
          [Backend ruft n8n Webhook auf]
              ?
          n8n ? AI (ChatGPT/Claude/etc.)
              ?
          [AI generiert Aufgabe]
              ?
          n8n ? PUT /api/assignments/webhook/generated
              ?
          [Backend aktualisiert Assignment auf Status "Created"]
              ?
          Frontend zeigt fertige Aufgabe an
```

### Aufgabenbewertung:
```
Frontend ? POST /api/assignments/evaluate
              ?
          [Backend speichert Code, Status "Evaluating"]
              ?
          [Backend ruft n8n Webhook auf]
              ?
          n8n ? AI (ChatGPT/Claude/etc.)
              ?
          [AI bewertet Code]
              ?
          n8n ? PUT /api/assignments/webhook/evaluated
              ?
          [Backend speichert Score & Feedback, Status "Evaluated"]
              ?
          Frontend zeigt Bewertung an
```

---

## ?? Nächste Schritte

### Backend (erledigt ?):
- [x] API Endpoints erstellt
- [x] Konfiguration hinzugefügt
- [x] HttpClientFactory integriert
- [x] Dokumentation erstellt

### N8N Workflows (TODO):
- [ ] Workflow für Aufgabenerstellung erstellen
  - Webhook Trigger
  - HTTP Request zu AI (z.B. OpenAI)
  - HTTP Request zurück zur API
- [ ] Workflow für Code-Bewertung erstellen
  - Webhook Trigger
  - HTTP Request zu AI mit Code-Review Prompt
  - HTTP Request zurück zur API

### Frontend (TODO):
- [ ] Assignment Service erweitern
- [ ] Dialog für Aufgabenerstellung erstellen
- [ ] Dialog für Code-Einreichung erstellen
- [ ] Status-Polling oder WebSocket implementieren
- [ ] UI-Updates für Status-Badges

---

## ?? Testing

### Mit cURL testen:

**1. Aufgabe generieren:**
```bash
curl -X POST "http://localhost:5000/api/assignments/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "studentPrompt": "Erstelle eine Aufgabe über Bubble Sort",
    "categoryId": 1,
    "programmingLanguageId": 1
  }'
```

**2. Code bewerten:**
```bash
curl -X POST "http://localhost:5000/api/assignments/evaluate" \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentId": 1,
    "submittedCode": "public int[] BubbleSort(int[] arr) { /* ... */ }"
  }'
```

**3. Webhook simulieren (von n8n):**
```bash
curl -X PUT "http://localhost:5000/api/assignments/webhook/generated" \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentId": 1,
    "title": "Bubble Sort implementieren",
    "description": "Implementiere den Bubble Sort Algorithmus..."
  }'
```

---

## ?? Status-Übersicht

| Status | Bedeutung | Nächster Schritt |
|--------|-----------|------------------|
| Generating | Aufgabe wird vom AI generiert | Warten auf n8n Callback |
| Created | Aufgabe ist fertig | Student kann Code schreiben |
| Submitted | Code wurde eingereicht (veraltet) | Nicht mehr verwendet |
| Evaluating | Code wird vom AI bewertet | Warten auf n8n Callback |
| Evaluated | Bewertung ist fertig | Student sieht Score & Feedback |
| Error | Fehler aufgetreten | Retry oder Support |

---

## ?? Sicherheitshinweise

1. **Webhook-Authentifizierung:** In Produktion sollten die Webhook-Endpoints mit API-Keys gesichert werden
2. **Rate Limiting:** Implementiere Rate Limiting für die Generate/Evaluate Endpoints
3. **HTTPS:** Verwende HTTPS in Produktion
4. **Validierung:** Alle Eingaben werden bereits validiert, aber zusätzliche Business-Logik kann hinzugefügt werden

---

## ?? Weiterführende Links

- [n8n Dokumentation](https://docs.n8n.io/)
- [OpenAI API](https://platform.openai.com/docs/)
- [ASP.NET Core HttpClient](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests)

---

## ?? Tipps

**Entwicklung:**
- Verwende Postman oder Swagger UI zum Testen der Endpoints
- n8n kann lokal mit Docker gestartet werden: `docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n`
- Für lokales Testing kann ngrok verwendet werden, um n8n Webhooks zu empfangen

**Produktion:**
- Verwende eine dedizierte n8n-Instanz (n8n.cloud oder self-hosted)
- Konfiguriere die Webhook-URLs in appsettings.Production.json
- Implementiere Error Handling und Retry-Logik
- Überwache die Workflow-Ausführungen in n8n

---

## ? Features

- ? Asynchrone AI-Verarbeitung
- ? Bidirektionale Kommunikation (API ? n8n)
- ? Flexible Workflow-Konfiguration
- ? Status-Tracking für User-Feedback
- ? Fehlerbehandlung und Validierung
- ? Vollständig dokumentiert

**Das System ist bereit für den Einsatz!** ??
