# Assignment Statistics Endpoint

## ?? Übersicht

Dieser Endpoint liefert **detaillierte Statistiken** über alle Assignments eines Studenten, inklusive:
- Alle Assignments mit vollständigen Details
- Statistiken zu jeder einzelnen Aufgabe (Antworten, Scores, etc.)
- Gesamtstatistiken für den Studenten
- Latest Response Details für jedes Assignment

---

## ?? Endpoint

### **GET** `/api/assignments/student/{studentId}/with-stats`

Liefert alle Assignments eines Studenten mit detaillierten Statistiken.

---

## ?? Request

### URL-Parameter

| Parameter | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `studentId` | `number` | ? Ja | ID des Studenten |

### Beispiel-Request

```http
GET /api/assignments/student/1/with-stats HTTP/1.1
Host: localhost:7074
```

---

## ?? Response

### ? **Erfolg (200 OK)**

```json
{
  "studentId": 1,
  "studentName": "Max Mustermann",
  "totalAssignments": 5,
  "completedAssignments": 2,
  "inProgressAssignments": 2,
  "createdAssignments": 1,
  "averageScore": 87.5,
  "bestScore": 95,
  "totalResponses": 8,
  "assignments": [
    {
      "id": 42,
      "title": "Die Planeten unseres Sonnensystems",
      "description": "# Aufgabe: Die Planeten\n\nNenne alle 8 Planeten...",
      "studentPrompt": "Erstelle eine Lernaufgabe über Astronomie",
      "status": "Completed",
      "createdDate": "2026-02-10T14:30:00Z",
      
      "studentId": 1,
      "studentName": "Max Mustermann",
      "studentEmail": "max@example.com",
      
      "categoryId": 3,
      "categoryName": "Naturwissenschaften",
      
      "totalResponses": 3,
      "bestScore": 92,
      "latestScore": 85,
      "averageScore": 88.33,
      
      "latestResponseId": 15,
      "latestAnswer": "Die 8 Planeten sind: Merkur, Venus, Erde...",
      "latestFeedback": "# Sehr gute Antwort! ?\n\n## Stärken:\n- Alle Planeten genannt...",
      "latestSubmissionDate": "2026-02-10T15:45:00Z"
    },
    {
      "id": 43,
      "title": "Lineare Gleichungen lösen",
      "description": "# Aufgabe: Gleichungen\n\nLöse folgende Gleichungen...",
      "studentPrompt": "Ich brauche Übungen zu linearen Gleichungen",
      "status": "InProgress",
      "createdDate": "2026-02-09T10:00:00Z",
      
      "studentId": 1,
      "studentName": "Max Mustermann",
      "studentEmail": "max@example.com",
      
      "categoryId": 1,
      "categoryName": "Mathematik",
      
      "totalResponses": 2,
      "bestScore": 78,
      "latestScore": 78,
      "averageScore": 75.5,
      
      "latestResponseId": 12,
      "latestAnswer": "x = 3, da 2x + 4 = 10...",
      "latestFeedback": "Gute Herleitung. Achte auf das Umformen...",
      "latestSubmissionDate": "2026-02-09T11:20:00Z"
    },
    {
      "id": 44,
      "title": "Englische Zeitformen",
      "description": "# Aufgabe: Present Perfect\n\nBilde Sätze...",
      "studentPrompt": "Ich möchte Present Perfect üben",
      "status": "Created",
      "createdDate": "2026-02-08T16:00:00Z",
      
      "studentId": 1,
      "studentName": "Max Mustermann",
      "studentEmail": "max@example.com",
      
      "categoryId": 2,
      "categoryName": "Sprachen",
      
      "totalResponses": 0,
      "bestScore": null,
      "latestScore": null,
      "averageScore": null,
      
      "latestResponseId": null,
      "latestAnswer": null,
      "latestFeedback": null,
      "latestSubmissionDate": null
    }
  ]
}
```

---

## ?? Response-Struktur

### **StudentAssignmentStats**

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `studentId` | `number` | ID des Studenten |
| `studentName` | `string` | Vollständiger Name (Vorname + Nachname) |
| `totalAssignments` | `number` | Gesamtanzahl aller Assignments |
| `completedAssignments` | `number` | Anzahl abgeschlossener Assignments |
| `inProgressAssignments` | `number` | Anzahl laufender Assignments |
| `createdAssignments` | `number` | Anzahl neuer (noch nicht bearbeiteter) Assignments |
| `averageScore` | `number \| null` | Durchschnittsscore über alle Responses (0-100) |
| `bestScore` | `number \| null` | Bester Score aller Responses |
| `totalResponses` | `number` | Gesamtanzahl aller Responses über alle Assignments |
| `assignments` | `AssignmentWithStats[]` | Liste aller Assignments mit Details |

### **AssignmentWithStats**

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | `number` | Assignment-ID |
| `title` | `string` | Titel der Aufgabe |
| `description` | `string` | Vollständige Aufgabenbeschreibung (Markdown) |
| `studentPrompt` | `string` | Original-Prompt vom Studenten |
| `status` | `string` | Status: "Created", "InProgress", "Completed" |
| `createdDate` | `string` | ISO 8601 Datum/Zeit der Erstellung |
| **Student Info** | | |
| `studentId` | `number` | ID des Studenten |
| `studentName` | `string` | Name des Studenten |
| `studentEmail` | `string` | E-Mail des Studenten |
| **Category Info** | | |
| `categoryId` | `number` | ID der Kategorie |
| `categoryName` | `string` | Name der Kategorie |
| **Statistics** | | |
| `totalResponses` | `number` | Anzahl der Responses zu diesem Assignment |
| `bestScore` | `number \| null` | Bester Score für dieses Assignment |
| `latestScore` | `number \| null` | Score der letzten Response |
| `averageScore` | `number \| null` | Durchschnittsscore aller Responses |
| **Latest Response** | | |
| `latestResponseId` | `number \| null` | ID der neuesten Response |
| `latestAnswer` | `string \| null` | Eingereichte Antwort |
| `latestFeedback` | `string \| null` | Feedback vom AI (Markdown) |
| `latestSubmissionDate` | `string \| null` | Datum/Zeit der letzten Einreichung |

---

## ? Error-Responses

### **404 Not Found**

```json
"Student with ID 999 not found"
```

**Wann:** Student existiert nicht in der Datenbank.

### **500 Internal Server Error**

```json
"Error: Database connection failed"
```

**Wann:** Datenbankfehler oder unerwartete Ausnahme.

---

## ?? Use Cases

### 1. **Student-Portfolio anzeigen**
```typescript
botService.getStudentAssignmentsWithStats(studentId).subscribe(stats => {
  console.log(`${stats.studentName} hat ${stats.totalAssignments} Aufgaben`);
  console.log(`Durchschnittsscore: ${stats.averageScore}/100`);
});
```

### 2. **Fortschritt visualisieren**
```typescript
const completionRate = (stats.completedAssignments / stats.totalAssignments) * 100;
console.log(`Fortschritt: ${completionRate.toFixed(1)}%`);
```

### 3. **Beste Leistungen finden**
```typescript
const bestAssignment = stats.assignments
  .filter(a => a.bestScore !== null)
  .sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0))[0];
console.log(`Beste Aufgabe: ${bestAssignment.title} (${bestAssignment.bestScore} Punkte)`);
```

### 4. **Offene Aufgaben anzeigen**
```typescript
const openAssignments = stats.assignments.filter(a => 
  a.status === 'Created' || a.status === 'InProgress'
);
console.log(`${openAssignments.length} offene Aufgaben`);
```

---

## ?? Frontend-Integration

### **TypeScript Service**

```typescript
import { BotService, StudentAssignmentStats } from './bot.service';

export class StudentPortfolioComponent implements OnInit {
  stats: StudentAssignmentStats | null = null;
  
  constructor(private botService: BotService) {}
  
  ngOnInit(): void {
    const studentId = 1; // Aus Route oder Auth-Service
    this.loadStats(studentId);
  }
  
  loadStats(studentId: number): void {
    this.botService.getStudentAssignmentsWithStats(studentId).subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log('Assignments geladen:', stats.assignments.length);
      },
      error: (error) => {
        console.error('Fehler beim Laden:', error);
      }
    });
  }
}
```

### **HTML Template**

```html
<div *ngIf="stats" class="student-stats">
  <h2>{{ stats.studentName }}</h2>
  
  <div class="stats-overview">
    <div class="stat-card">
      <h3>{{ stats.totalAssignments }}</h3>
      <p>Aufgaben gesamt</p>
    </div>
    <div class="stat-card">
      <h3>{{ stats.averageScore || '-' }}</h3>
      <p>Durchschnitt</p>
    </div>
    <div class="stat-card">
      <h3>{{ stats.bestScore || '-' }}</h3>
      <p>Bester Score</p>
    </div>
  </div>
  
  <div class="assignments-list">
    <div *ngFor="let assignment of stats.assignments" class="assignment-card">
      <h4>{{ assignment.title }}</h4>
      <span class="badge" [ngClass]="getStatusClass(assignment.status)">
        {{ assignment.status }}
      </span>
      <p>Versuche: {{ assignment.totalResponses }}</p>
      <p *ngIf="assignment.latestScore !== null">
        Letzter Score: {{ assignment.latestScore }}/100
      </p>
    </div>
  </div>
</div>
```

---

## ? Vorteile dieses Endpoints

1. **Alle Daten in einem Request** - Keine multiple API-Calls nötig
2. **Vollständige Statistiken** - Scores, Durchschnitte, Versuche
3. **Latest Response Details** - Direkter Zugriff auf neueste Antwort
4. **Performance-Optimiert** - Grouped Queries für schnelle Abfragen
5. **Frontend-Ready** - Direkt verwendbar ohne zusätzliche Berechnungen

---

## ?? Nächste Schritte

1. **Frontend-Komponente aktualisieren**: `student-portfolio.component.ts`
2. **Alte Mock-Daten ersetzen**: Durch API-Call ersetzen
3. **Loading-States hinzufügen**: Während API-Call
4. **Error-Handling**: Für 404/500 Fehler

---

## ?? Changelog

| Datum | Version | Änderung |
|-------|---------|----------|
| 2026-02-10 | 1.0.0 | Initial Release - Assignment Statistics Endpoint |
