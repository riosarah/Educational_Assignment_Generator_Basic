# Programming Trainer UI

Ein modernes, spartanisches UI für die Programming Trainer Anwendung mit Bot-Integration.

## Funktionalitäten

### 1. Bot-Chat (`/bot-chat`)
Die Hauptfunktionalität der Anwendung - Interaktion mit dem AI Bot.

**Features:**
- **Aufgabe Generieren Modus**: 
  - Auswahl von Programmiersprache und Kategorie
  - Beschreibung der gewünschten Aufgabe eingeben
  - Bot generiert eine detaillierte Aufgabenstellung
  
- **Lösung Bewerten Modus**:
  - Code-Eingabe in Textarea
  - Bot analysiert den Code
  - Erhält Bewertung (Score in %) und detailliertes Feedback

**Beispiel-Ablauf:**
1. Student wählt "C#" und "Sortieralgorithmen"
2. Student fragt: "Erstelle einen Sortieralgorithmus von Zahlen"
3. Bot generiert Aufgabenstellung
4. Student arbeitet die Lösung aus
5. Student wechselt zu "Lösung Bewerten"
6. Student fügt Code ein und lässt bewerten
7. Bot liefert Score und Feedback

### 2. Portfolio (`/portfolio`)
Verwaltung aller Aufgaben und Bewertungen des Students.

**Features:**
- **Statistik-Dashboard**: Zeigt Gesamtanzahl, abgeschlossene, offene Aufgaben und Durchschnittsscore
- **Filterung**:
  - Nach Status (Alle, Abgeschlossen, Offen)
  - Nach Programmiersprache
  - Nach Kategorie
  - Textsuche in Titel und Beschreibung
- **Aufgaben-Karten**: Übersichtliche Darstellung mit Badges für Sprache, Kategorie und Status
- **Detail-Ansicht**: Klick auf Karte öffnet Modal mit:
  - Vollständiger Beschreibung
  - Metadaten (Erstelldatum, Eingabedatum)
  - Eingereichtem Code
  - Bewertung und Feedback
- **Löschen**: Aufgaben können gelöscht werden

### 3. Dashboard (`/dashboard`)
Bestehende Dashboard-Komponente (falls vorhanden)

## Design

### Farbschema
- **Primärfarbe**: Blau (`#2563eb`)
- **Hintergrund**: Dunkel (`#0f172a`, `#1e293b`, `#334155`)
- **Text**: Hell (`#f1f5f9`, `#cbd5e1`)
- **Akzente**: 
  - Success: Grün (`#10b981`)
  - Warning: Gelb (`#f59e0b`)
  - Danger: Rot (`#ef4444`)

### Design-Prinzipien
- **Spartanisch**: Klare Linien, minimalistisches Design
- **Modern**: Abgerundete Ecken, sanfte Übergänge, subtile Schatten
- **Dark Theme**: Dunkler Hintergrund mit hohem Kontrast
- **Responsive**: Funktioniert auf Desktop, Tablet und Mobile

## Komponenten-Struktur

```
src/app/
├── pages/
│   ├── bot-chat/
│   │   ├── bot-chat.component.ts       # Logik für Chat und Bot-Interaktion
│   │   ├── bot-chat.component.html     # Chat-Interface
│   │   └── bot-chat.component.css      # Chat-spezifisches Styling
│   └── student-portfolio/
│       ├── student-portfolio.component.ts    # Portfolio-Logik
│       ├── student-portfolio.component.html  # Portfolio-UI
│       └── student-portfolio.component.css   # Portfolio-Styling
├── services/
│   └── bot.service.ts                  # API-Calls zum Bot-Backend
└── styles.css                          # Globale Styles
```

## Services

### BotService
Kommunikation mit dem Backend Bot-API.

**Methoden:**
- `generateAssignment(request: AssignmentRequest)`: Generiert neue Aufgabe
- `evaluateSubmission(request: EvaluationRequest)`: Bewertet eingereichten Code

## API-Endpunkte (Backend)

Die folgenden Endpunkte sind im Backend implementiert:

### POST `/api/assignments/generate`
Triggert den n8n Workflow `generate-task`.

**Request:**
```json
{
  "studentId": 1,
  "studentPrompt": "Erstelle einen Sortieralgorithmus von Zahlen",
  "categoryId": 1,
  "programmingLanguageId": 1
}
```

**Response:**
```json
{
  "assignmentId": 42,
  "message": "Assignment generation workflow triggered successfully",
  "success": true,
  "workflowExecutionId": "abc123-workflow-id"
}
```

### POST `/api/assignments/evaluate`
Triggert den n8n Workflow `evaluate-task`.

**Request:**
```json
{
  "assignmentId": 1,
  "submittedCode": "public void BubbleSort(int[] arr) { ... }"
}
```

**Response:**
```json
{
  "assignmentId": 1,
  "message": "Assignment evaluation workflow triggered successfully",
  "success": true,
  "workflowExecutionId": "xyz789-workflow-id"
}
```

### Webhook-Endpoints (n8n → Backend)
Diese Endpoints werden **nicht** vom Frontend aufgerufen:
- `PUT /api/assignments/webhook/generated` - Empfängt generierte Aufgabe von n8n
- `PUT /api/assignments/webhook/evaluated` - Empfängt Bewertung von n8n

## Verwendete Technologien

- **Angular 18+**
- **TypeScript**
- **Bootstrap Icons**
- **ngx-translate** (i18n)
- **ng-bootstrap** (Dropdown-Komponenten)

## Entwicklung

### Starten der Anwendung
```bash
npm start
```

### Build
```bash
npm run build
```

## Nächste Schritte

1. Backend-API für Bot-Integration implementieren
2. Echte Daten von API laden (aktuell Mock-Daten)
3. Authentifizierung integrieren (AuthGuard ist bereits vorbereitet)
4. Assignment CRUD-Operationen mit Backend verbinden
5. Persistierung der Chat-Historie
6. Code-Syntax-Highlighting in der Portfolio-Ansicht

## Notes

- Mock-Daten werden aktuell in den Komponenten verwendet
- API-URL ist in `environment.ts` konfiguriert (`https://localhost:7074/api`)
- AuthGuard ist für alle Routen aktiviert, kann aber über `loginRequired` in environment.ts deaktiviert werden
