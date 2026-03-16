# Entity Changes - General Learning Trainer

## Änderungen Übersicht

Das System wurde von einem **Programming Trainer** zu einem **General Learning Trainer** umgebaut.

---

## 1. Assignment Entity (überarbeitet)

**Datei:** `programming_trainer.Logic/Entities/App/Assignment.cs`

### Entfernte Properties:
- ? `ProgrammingLanguageId` (Foreign Key)
- ? `ProgrammingLanguage` (Navigation Property)
- ? `SubmittedCode` (verschoben nach StudentResponse)
- ? `SubmissionDate` (verschoben nach StudentResponse)
- ? `Score` (verschoben nach StudentResponse)
- ? `Feedback` (verschoben nach StudentResponse)

### Behaltene Properties:
- ? `StudentId` (Foreign Key)
- ? `CategoryId` (Foreign Key - kann jetzt beliebige Lernthemen sein)
- ? `StudentPrompt` (Original-Anfrage vom Schüler)
- ? `Title` (Titel der Aufgabe)
- ? `Description` (Beschreibung der Aufgabe)
- ? `Status` (aktueller Status)
- ? `CreatedDate` (Erstellungsdatum)

### Neue Navigation Properties:
- ? `StudentResponses` (List<StudentResponse>) - 1:n Beziehung

### Status-Werte (geändert):
- `"Created"` - Aufgabe wurde erstellt
- `"InProgress"` - Schüler arbeitet daran
- `"Completed"` - Aufgabe abgeschlossen

---

## 2. StudentResponse Entity (NEU)

**Datei:** `programming_trainer.Logic/Entities/App/StudentResponse.cs`

### Properties:
- `Id` (Primary Key, von EntityObject geerbt)
- `AssignmentId` (Foreign Key zu Assignment)
- `SubmittedAnswer` (string, die Antwort/Lösung des Schülers)
- `Score` (int, Note 0-100)
- `Feedback` (string, Verbesserungsvorschläge vom AI)
- `SubmissionDate` (DateTime, wann wurde eingereicht)

### Navigation Properties:
- `Assignment` (Assignment?, zurück zum Assignment)

### Beziehung:
- **1 Assignment : n StudentResponses**
- Ein Schüler kann **mehrere Antworten** für die gleiche Aufgabe einreichen
- Die **letzte Note zählt** (neueste SubmissionDate)

---

## 3. Category Entity (unverändert)

**Datei:** `programming_trainer.Logic/Entities/Data/Category.cs`

### Kann jetzt beliebige Lernthemen enthalten:
- "Programming - C#"
- "Programming - JavaScript"
- "Mathematics - Algebra"
- "History - World War II"
- "Languages - English Grammar"
- etc.

---

## 4. Validation Files

Beide Validation-Dateien sind mit `#if GENERATEDCODE_ON` gesichert:
- `Assignment.Validation.cs`
- `StudentResponse.Validation.cs`

---

## 5. Datenbank Schema (nach Code-Generierung)

### Tabelle: Assignment
```
Id              (int, PK)
StudentId       (int, FK -> Student)
CategoryId      (int, FK -> Category)
StudentPrompt   (string, max 500)
Title           (string, max 100)
Description     (string, unbegrenzt)
Status          (string, max 50)
CreatedDate     (DateTime)
```

### Tabelle: StudentResponse (NEU)
```
Id              (int, PK)
AssignmentId    (int, FK -> Assignment)
SubmittedAnswer (string, unbegrenzt)
Score           (int, 0-100)
Feedback        (string, unbegrenzt)
SubmissionDate  (DateTime)
```

---

## 6. Workflow-Änderungen erforderlich

### Backend Controller muss angepasst werden:

#### POST /api/assignments/generate
**Request:**
```json
{
  "studentId": 1,
  "studentPrompt": "Erstelle eine Aufgabe über...",
  "categoryId": 2
}
```
? Entfernt: `programmingLanguageId`

#### POST /api/assignments/evaluate (NEU: arbeitet mit StudentResponse)
**Request:**
```json
{
  "assignmentId": 42,
  "submittedAnswer": "Die Antwort des Schülers..."
}
```

**Response:**
```json
{
  "success": true,
  "responseId": 123,
  "score": 95,
  "feedback": "Sehr gut! Verbesserungsvorschläge: ..."
}
```

---

## 7. n8n Workflows müssen angepasst werden

### Workflow 1: Generate Assignment
**Änderung:** `programmingLanguageId` entfernen aus Request

### Workflow 2: Evaluate Assignment
**Änderung:** 
- Payload-Feld: `submittedCode` ? `submittedAnswer`
- Keine spezifische Sprache mehr, AI muss anhand der Kategorie erkennen

---

## 8. Nächste Schritte

1. ? **Entitäten erstellt** (Assignment überarbeitet, StudentResponse neu)
2. ? **Validations gesichert** mit `#if GENERATEDCODE_ON`
3. ? **Jetzt: Code Generator starten**
4. ? **Danach: Controller anpassen**
5. ? **Danach: n8n Workflows anpassen**
6. ? **Danach: Frontend anpassen**

---

## 9. Beispiel-Szenario

### Schüler arbeitet an einer Aufgabe:

1. **Assignment erstellen:**
   - Student: "Ich möchte etwas über die französische Revolution lernen"
   - Category: "History - French Revolution"
   - ? AI generiert Aufgabe mit Title + Description

2. **Erste Antwort einreichen:**
   - StudentResponse #1: "Die französische Revolution war 1789..."
   - AI bewertet: Score 65, Feedback "Gut, aber mehr Details..."
   
3. **Verbesserte Antwort einreichen:**
   - StudentResponse #2: "Die französische Revolution begann 1789 mit dem Sturm auf die Bastille..."
   - AI bewertet: Score 85, Feedback "Sehr gut! Noch präziser wäre..."

4. **Letzte Note zählt:** Score 85 ist die aktuelle Note

---

## 10. Datenbank-Migration erforderlich

Nach dem Code-Generator:

```bash
# Alte Datenbank löschen (falls vorhanden)
dotnet run --project programming_trainer.ConApp -- AppArg=1,1,x

# Neue Datenbank erstellen mit neuen Entitäten
dotnet run --project programming_trainer.ConApp -- AppArg=1,2,x
```

---

**Bereit für Code-Generator!** ??
