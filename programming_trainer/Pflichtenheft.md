# Pflichtenheft: SEeProjectTime - Zeiterfassungsanwendung

**Projektbezeichnung:** SEeProjectTime  
**Version:** 1.0.0  
**Datum:** 04.11.2025  
**Status:** Produktiv

---

## 1. Zielsetzung

### 1.1 Zweck des Dokuments

Dieses Pflichtenheft beschreibt die funktionalen und nicht-funktionalen Anforderungen an die Zeiterfassungsanwendung SEeProjectTime. Es dient als verbindliche Grundlage für die Entwicklung, Implementierung und Wartung des Systems.

### 1.2 Projektziel

Entwicklung einer modernen, webbasierten Zeiterfassungslösung für Unternehmen zur effizienten Verwaltung von:

- Projekten mit definierten Laufzeiten
- Mitarbeiterstammdaten
- Tätigkeitskatalogen mit konfigurierbaren Stundensätzen
- Zeiteinträgen mit automatischer Kostenberechnung

### 1.3 Zielgruppe

- **Endnutzer:** Mitarbeiter zur Zeiterfassung
- **Administratoren:** Projektleiter und HR-Abteilung
- **Entwickler:** IT-Abteilung für Wartung und Erweiterung

---

## 2. Ausgangssituation

### 2.1 Ist-Zustand

- Manuelle oder Excel-basierte Zeiterfassung
- Fehlende Integration zwischen Projektverwaltung und Zeiterfassung
- Keine automatische Kostenberechnung
- Inkonsistente Datenstrukturen

### 2.2 Soll-Zustand

- Zentrale, webbasierte Zeiterfassungslösung
- Automatische Kostenberechnung basierend auf Stundensätzen
- Validierte Dateneingabe
- Mehrsprachige Benutzeroberfläche
- Moderne, responsive UI für Desktop und Mobile

---

## 3. Systemübersicht

### 3.1 Architektur

**3-Schichten-Architektur:**

```text
┌─────────────────────────────────┐
│   Frontend (Angular 19)         │
│   - Standalone Components       │
│   - Bootstrap UI                │
│   - i18n (DE/EN)                │
└──────────────┬──────────────────┘
               │ REST API
┌──────────────┴──────────────────┐
│   Backend (.NET 8.0)            │
│   - Clean Architecture          │
│   - Web API                     │
│   - Business Logic              │
└──────────────┬──────────────────┘
               │ Entity Framework
┌──────────────┴──────────────────┐
│   Datenbank                     │
│   - SQLite (Standard)           │
│   - SQL Server (Option)         │
│   - PostgreSQL (Option)         │
└─────────────────────────────────┘
```

### 3.2 Technologie-Stack

#### Backend

- **.NET 8.0** - Framework
- **Entity Framework Core** - ORM
- **ASP.NET Core Web API** - REST-Services
- **Newtonsoft.Json** - JSON-Serialisierung

#### Frontend

- **Angular 19** - Framework
- **TypeScript 5.6** - Programmiersprache
- **Bootstrap 5.3** - UI-Framework
- **ngx-translate** - Internationalisierung
- **RxJS** - Reactive Programming

#### Datenbank

- **SQLite** - Standard (Entwicklung)
- **SQL Server** - Enterprise-Option
- **PostgreSQL** - Enterprise-Option

---

## 4. Funktionale Anforderungen

### 4.1 Stammdatenverwaltung

#### 4.1.1 Projektverwaltung (F-01)

**Beschreibung:** Verwaltung aller Projekte im System

**Funktionen:**

- Projekt anlegen, bearbeiten, löschen
- Projekt aktivieren/deaktivieren
- Projektzeiträume definieren

**Datenfelder:**

| Feld | Typ | Pflicht | Validierung |
|------|-----|---------|-------------|
| Name | String(100) | Ja | Eindeutig |
| Beschreibung | String(500) | Nein | - |
| Startdatum | DateTime | Nein | - |
| Enddatum | DateTime | Nein | >= Startdatum |
| Aktiv | Boolean | Ja | Standard: true |

**Geschäftsregeln:**

- Projektname muss eindeutig sein
- Enddatum darf nicht vor Startdatum liegen
- Inaktive Projekte können nicht für neue Zeiteinträge verwendet werden

#### 4.1.2 Mitarbeiterverwaltung (F-02)

**Beschreibung:** Verwaltung aller Mitarbeiter im System

**Funktionen:**

- Mitarbeiter anlegen, bearbeiten, löschen
- Mitarbeiter aktivieren/deaktivieren

**Datenfelder:**

| Feld | Typ | Pflicht | Validierung |
|------|-----|---------|-------------|
| Vorname | String(50) | Ja | - |
| Nachname | String(50) | Ja | - |
| E-Mail | String(100) | Nein | Eindeutig, gültiges Format |
| Mitarbeiternummer | String(20) | Ja | Eindeutig |
| Aktiv | Boolean | Ja | Standard: true |

**Geschäftsregeln:**

- Mitarbeiternummer muss eindeutig sein
- E-Mail-Adresse muss gültig und eindeutig sein
- Inaktive Mitarbeiter können keine neuen Zeiteinträge erfassen

#### 4.1.3 Tätigkeitsverwaltung (F-03)

**Beschreibung:** Verwaltung aller Tätigkeiten und deren Stundensätze

**Funktionen:**

- Tätigkeit anlegen, bearbeiten, löschen
- Tätigkeit aktivieren/deaktivieren
- Stundensätze konfigurieren

**Datenfelder:**

| Feld | Typ | Pflicht | Validierung |
|------|-----|---------|-------------|
| Name | String(100) | Ja | Eindeutig |
| Beschreibung | String(500) | Nein | - |
| Stundensatz | Decimal(10,2) | Nein | >= 0 |
| Aktiv | Boolean | Ja | Standard: true |

**Geschäftsregeln:**

- Tätigkeitsname muss eindeutig sein
- Stundensatz muss >= 0 sein
- Inaktive Tätigkeiten können nicht für neue Zeiteinträge verwendet werden

### 4.2 Zeiterfassung

#### 4.2.1 Zeiteintrag erfassen (F-04)

**Beschreibung:** Erfassung von Arbeitszeiten für Projekte

**Funktionen:**

- Neuen Zeiteintrag erstellen
- Zeiteintrag bearbeiten
- Zeiteintrag löschen
- Automatische Dauerberechnung
- Automatische Kostenberechnung

**Datenfelder:**

| Feld | Typ | Pflicht | Validierung |
|------|-----|---------|-------------|
| Projekt | Reference | Ja | Aktives Projekt |
| Mitarbeiter | Reference | Ja | Aktiver Mitarbeiter |
| Tätigkeit | Reference | Ja | Aktive Tätigkeit |
| Startzeit | DateTime | Ja | - |
| Endzeit | DateTime | Nein | > Startzeit |
| Dauer | TimeSpan | Nein | Berechnet |
| Beschreibung | String(1000) | Nein | - |
| Berechnete Kosten | Decimal(10,2) | Nein | Berechnet |

**Geschäftsregeln:**

- Endzeit muss nach Startzeit liegen
- Dauer = Endzeit - Startzeit (automatisch)
- Kosten = Dauer * Stundensatz der Tätigkeit (automatisch)
- Nur aktive Projekte, Mitarbeiter und Tätigkeiten können ausgewählt werden

**Berechnungslogik:**

```text
WENN Endzeit vorhanden DANN
    Dauer = Endzeit - Startzeit
    Kosten = Dauer.TotalHours * Tätigkeit.Stundensatz
SONST
    Dauer = NULL
    Kosten = NULL
ENDE
```

### 4.3 Listenansichten und Filterung

#### 4.3.1 Datenlisten (F-05)

**Beschreibung:** Übersichtsdarstellung aller Entitäten

**Funktionen:**

- Paginierung (20 Einträge pro Seite)
- Sortierung nach Spalten
- Filterung nach Status (Aktiv/Inaktiv)
- Suchfunktion
- Export-Funktion (optional)

**Für alle Entitäten:**

- Projekte
- Mitarbeiter
- Tätigkeiten
- Zeiteinträge

### 4.4 Import/Export

#### 4.4.1 CSV-Import (F-06)

**Beschreibung:** Massenimport von Daten über CSV-Dateien

**Funktionen:**

- Import von Projekten
- Import von Mitarbeitern
- Import von Tätigkeiten
- Import von Zeiteinträgen
- Validierung während des Imports
- Fehlerprotokollierung
- Rollback bei Fehlern

**Unterstützte Formate:**

```csv
# Projekte
Name,Description,StartDate,EndDate,IsActive

# Mitarbeiter
FirstName,LastName,Email,EmployeeNumber,IsActive

# Tätigkeiten
Name,Description,HourlyRate,IsActive

# Zeiteinträge
ProjectName,EmployeeNumber,ActivityName,StartTime,EndTime,Description
```

### 4.5 Benutzerverwaltung (Optional)

#### 4.5.1 Account-System (F-07)

**Beschreibung:** Benutzerauthentifizierung und -autorisierung

**Entitäten:**

- User (Benutzer)
- Role (Rollen)
- Identity (Identitäten)
- LoginSession (Sitzungen)

**Funktionen:**

- Login/Logout
- Rollenverwaltung
- Rechteverwaltung

---

## 5. Nicht-funktionale Anforderungen

### 5.1 Benutzerfreundlichkeit (NF-01)

**Anforderungen:**

- Intuitive Navigation ohne Schulungsaufwand
- Responsive Design für Desktop, Tablet, Mobile
- Konsistente Benutzeroberfläche
- Mehrsprachigkeit (Deutsch, Englisch)
- Barrierefreiheit nach WCAG 2.1 Level AA (empfohlen)

**Akzeptanzkriterien:**

- Neue Benutzer können innerhalb von 15 Minuten einen Zeiteintrag erfassen
- UI funktioniert auf Bildschirmgrößen ab 320px Breite
- Alle UI-Texte sind übersetzbar

### 5.2 Performance (NF-02)

**Anforderungen:**

- Seitenladezeit < 2 Sekunden (bei 1000 Datensätzen)
- API-Response-Zeit < 500ms (95. Perzentil)
- Unterstützung von min. 100 gleichzeitigen Benutzern

**Akzeptanzkriterien:**

- Listenansichten laden in < 1 Sekunde
- Speichervorgänge erfolgen in < 500ms
- Keine spürbare Verzögerung bei Benutzerinteraktionen

### 5.3 Skalierbarkeit (NF-03)

**Anforderungen:**

- Unterstützung von min. 10.000 Zeiteinträgen
- Unterstützung von min. 500 Mitarbeitern
- Unterstützung von min. 200 Projekten

**Strategie:**

- Datenbankindizierung für häufige Abfragen
- Paginierung für große Datenmengen
- Lazy Loading für Detailansichten

### 5.4 Zuverlässigkeit (NF-04)

**Anforderungen:**

- Verfügbarkeit: 99% (8,7 Stunden Ausfall/Jahr)
- Datenintegrität: 100%
- Automatische Fehlerbehandlung

**Maßnahmen:**

- Transaktionale Datenbankoperationen
- Validierung auf Client- und Server-Seite
- Fehlerprotokollierung
- Regelmäßige Backups (täglich)

### 5.5 Wartbarkeit (NF-05)

**Anforderungen:**

- Code-Generierung für CRUD-Operationen
- Modulare Architektur
- Umfassende Code-Dokumentation
- Automatisierte Tests (empfohlen)

**Entwicklungsstandards:**

- Clean Architecture Prinzipien
- Code-Marker-System für generierten Code
- Versionskontrolle mit Git
- Semantic Versioning

### 5.6 Sicherheit (NF-06)

**Anforderungen:**

- HTTPS-Verschlüsselung
- SQL-Injection-Schutz (EF Core)
- XSS-Schutz (Angular Sanitization)
- CORS-Konfiguration
- Authentifizierung/Autorisierung (optional)

**Maßnahmen:**

- Parameterisierte Datenbankabfragen
- Input-Validierung
- Output-Encoding
- Security Headers

### 5.7 Kompatibilität (NF-07)

**Browser-Unterstützung:**

- Chrome (aktuelle Version und -1)
- Firefox (aktuelle Version und -1)
- Edge (aktuelle Version und -1)
- Safari (aktuelle Version und -1)

**Server-Anforderungen:**

- .NET 8.0 Runtime
- 2 GB RAM (minimal)
- 10 GB Festplattenspeicher

---

## 6. Datenmodell

### 6.1 Entity-Relationship-Diagramm

```
┌─────────────────┐
│    Project      │
│─────────────────│
│ Id (PK)         │
│ Name*           │
│ Description     │
│ StartDate       │
│ EndDate         │
│ IsActive        │
└────────┬────────┘
         │
         │ 1
         │
         │ n
┌────────┴────────┐
│   TimeEntry     │◄──────┐
│─────────────────│       │
│ Id (PK)         │       │ n
│ ProjectId (FK)  │       │
│ EmployeeId (FK) │       │
│ ActivityId (FK) │       │ 1
│ StartTime*      │  ┌────┴────────┐
│ EndTime         │  │  Employee   │
│ Duration        │  │─────────────│
│ Description     │  │ Id (PK)     │
│ CalculatedCost  │  │ FirstName*  │
└────────┬────────┘  │ LastName*   │
         │           │ Email       │
         │ n         │ EmployeeNr* │
         │           │ IsActive    │
         │ 1         └─────────────┘
┌────────┴────────┐
│   Activity      │
│─────────────────│
│ Id (PK)         │
│ Name*           │
│ Description     │
│ HourlyRate      │
│ IsActive        │
└─────────────────┘

* = Pflichtfeld
```

### 6.2 Datenbank-Schema

#### Tabelle: Projects (data.Projects)
```sql
CREATE TABLE Projects (
    Id INTEGER PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    Description VARCHAR(500),
    StartDate DATETIME,
    EndDate DATETIME,
    IsActive BOOLEAN NOT NULL DEFAULT 1,
    -- Audit-Felder
    CreatedAt DATETIME,
    ModifiedAt DATETIME,
    RowVersion TIMESTAMP
);

CREATE INDEX IX_Projects_Name ON Projects(Name);
CREATE INDEX IX_Projects_IsActive ON Projects(IsActive);
```

#### Tabelle: Employees (data.Employees)
```sql
CREATE TABLE Employees (
    Id INTEGER PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    EmployeeNumber VARCHAR(20) NOT NULL UNIQUE,
    IsActive BOOLEAN NOT NULL DEFAULT 1,
    -- Audit-Felder
    CreatedAt DATETIME,
    ModifiedAt DATETIME,
    RowVersion TIMESTAMP
);

CREATE INDEX IX_Employees_EmployeeNumber ON Employees(EmployeeNumber);
CREATE INDEX IX_Employees_Email ON Employees(Email);
```

#### Tabelle: Activities (data.Activities)
```sql
CREATE TABLE Activities (
    Id INTEGER PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    Description VARCHAR(500),
    HourlyRate DECIMAL(10,2),
    IsActive BOOLEAN NOT NULL DEFAULT 1,
    -- Audit-Felder
    CreatedAt DATETIME,
    ModifiedAt DATETIME,
    RowVersion TIMESTAMP
);

CREATE INDEX IX_Activities_Name ON Activities(Name);
```

#### Tabelle: TimeEntries (app.TimeEntries)
```sql
CREATE TABLE TimeEntries (
    Id INTEGER PRIMARY KEY,
    ProjectId INTEGER NOT NULL,
    EmployeeId INTEGER NOT NULL,
    ActivityId INTEGER NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME,
    Duration TIME,
    Description VARCHAR(1000),
    CalculatedCost DECIMAL(10,2),
    -- Audit-Felder
    CreatedAt DATETIME,
    ModifiedAt DATETIME,
    RowVersion TIMESTAMP,
    -- Foreign Keys
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id),
    FOREIGN KEY (EmployeeId) REFERENCES Employees(Id),
    FOREIGN KEY (ActivityId) REFERENCES Activities(Id)
);

CREATE INDEX IX_TimeEntries_Project_Employee_Start 
    ON TimeEntries(ProjectId, EmployeeId, StartTime);
CREATE INDEX IX_TimeEntries_Employee ON TimeEntries(EmployeeId);
CREATE INDEX IX_TimeEntries_Activity ON TimeEntries(ActivityId);
```

### 6.3 Datenintegrität

**Validierungsregeln:**

1. **Referentielle Integrität**
   - Alle Foreign Keys müssen auf existierende Datensätze verweisen
   - Cascade-Delete für abhängige Datensätze (konfigurierbar)

2. **Eindeutigkeit**
   - Project.Name: Eindeutig
   - Employee.EmployeeNumber: Eindeutig
   - Employee.Email: Eindeutig (wenn vorhanden)
   - Activity.Name: Eindeutig

3. **Wertebereichs-Validierung**
   - Stundensatz >= 0
   - Enddatum >= Startdatum
   - EndTime > StartTime

4. **Audit-Trail**
   - Alle Entitäten haben CreatedAt, ModifiedAt
   - Optimistic Concurrency mit RowVersion

---

## 7. Benutzeroberfläche

### 7.1 Navigationsstruktur

```
Dashboard
├── Stammdaten
│   ├── Projekte
│   ├── Mitarbeiter
│   └── Tätigkeiten
├── Zeiterfassung
│   └── Zeiteinträge
└── System (optional)
    └── Benutzerverwaltung
```

### 7.2 Bildschirmmasken

#### 7.2.1 Dashboard
- Übersicht aktiver Projekte
- Aktuelle Zeiteinträge
- Schnellzugriff auf Hauptfunktionen

#### 7.2.2 Projektliste
- Tabellarische Darstellung aller Projekte
- Filter: Aktiv/Inaktiv
- Sortierung nach Name, Startdatum
- Aktionen: Neu, Bearbeiten, Löschen

#### 7.2.3 Projekt-Formular
**Felder:**
- Name* (Textfeld, max. 100 Zeichen)
- Beschreibung (Textarea, max. 500 Zeichen)
- Startdatum (Datepicker)
- Enddatum (Datepicker)
- Aktiv (Checkbox)

**Buttons:**
- Speichern
- Abbrechen
- Löschen (nur bei Bearbeitung)

#### 7.2.4 Zeiteintrag-Formular
**Felder:**
- Projekt* (Dropdown, nur aktive)
- Mitarbeiter* (Dropdown, nur aktive)
- Tätigkeit* (Dropdown, nur aktive)
- Startzeit* (DateTime-Picker)
- Endzeit (DateTime-Picker)
- Dauer (Readonly, berechnet)
- Beschreibung (Textarea, max. 1000 Zeichen)
- Kosten (Readonly, berechnet)

**Buttons:**
- Speichern
- Abbrechen
- Löschen (nur bei Bearbeitung)

### 7.3 Responsive Design

**Breakpoints:**
- Mobile: < 576px
- Tablet: 576px - 991px
- Desktop: >= 992px

**Anpassungen:**
- Mobile: Einspaltige Formulare, vereinfachte Navigation
- Tablet: Zweispaltige Formulare
- Desktop: Mehrspaltiges Layout, Sidebar-Navigation

### 7.4 Mehrsprachigkeit

**Unterstützte Sprachen:**
- Deutsch (Standard)
- Englisch

**Übersetzungsschlüssel:**
```json
{
  "project": {
    "title": "Projekte",
    "name": "Projektname",
    "description": "Beschreibung",
    "startDate": "Startdatum",
    "endDate": "Enddatum"
  },
  "employee": {
    "title": "Mitarbeiter",
    "firstName": "Vorname",
    "lastName": "Nachname"
  }
}
```

---

## 8. Schnittstellen

### 8.1 REST API

**Base URL:** `http://localhost:5000/api`

#### 8.1.1 Projects API

**GET /api/projects**
- Beschreibung: Alle Projekte abrufen
- Response: Array<Project>

**GET /api/projects/{id}**
- Beschreibung: Projekt nach ID abrufen
- Response: Project

**POST /api/projects**
- Beschreibung: Neues Projekt erstellen
- Request Body: Project
- Response: Project (mit generierter ID)

**PUT /api/projects/{id}**
- Beschreibung: Projekt aktualisieren
- Request Body: Project
- Response: Project

**DELETE /api/projects/{id}**
- Beschreibung: Projekt löschen
- Response: 204 No Content

#### 8.1.2 TimeEntries API

Analog zu Projects API für:
- /api/timeentries
- /api/employees
- /api/activities

**API-Konventionen:**
- Content-Type: application/json
- Datumsformat: ISO 8601 (UTC)
- Fehlerformat: RFC 7807 Problem Details
- Pagination: Query-Parameter (page, pageSize)
- Sortierung: Query-Parameter (sortBy, sortOrder)

### 8.2 Datenbank-Schnittstelle

**Entity Framework Core:**
- Code-First-Ansatz
- Migrations für Schema-Änderungen
- DbContext: ProjectTimeDbContext

**Unterstützte Provider:**
```xml
<!-- SQLite -->
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" />

<!-- SQL Server -->
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" />

<!-- PostgreSQL -->
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" />
```

---

## 9. Code-Generierung

### 9.1 Zweck

Automatisierung der Erstellung von:
- Entity Framework Entities
- Web API Controllers
- Angular Models
- Angular Components (List/Edit)
- CRUD-Services

### 9.2 Code-Marker-System

**Marker-Typen:**
- `//@AiCode` - Manuell erstellter Code (bleibt unverändert)
- `//@GeneratedCode` - Generierter Code (wird überschrieben)
- `//@CustomCode` - Angepasster generierter Code (bleibt erhalten)

### 9.3 Generierungs-Prozess

**Befehl:**
```bash
dotnet run --project TemplateTools.ConApp -- AppArg=4,9,x,x
```

**Parameter:**
- 4 = Entities generieren
- 9 = Alle Komponenten generieren
- x = Alle Entitäten
- x = Alle Operationen

**Generierte Dateien:**
```
Backend:
├── Controllers/ProjectsController.cs
├── Controllers/EmployeesController.cs
├── Controllers/ActivitiesController.cs
└── Controllers/TimeEntriesController.cs

Frontend:
├── models/project.model.ts
├── components/entities/project-edit/
├── pages/entities/project-list/
└── services/project.service.ts
```

### 9.4 Templates

**Verfügbare Templates:**
- `entities_template.md` - Entity-Struktur
- `forms_template.md` - Formular-Komponenten
- `import_template.md` - CSV-Import
- `readme_template.md` - Dokumentation

---

## 10. Testkonzept

### 10.1 Teststufen

#### 10.1.1 Unit Tests
- **Ziel:** Einzelne Methoden und Klassen
- **Framework:** xUnit (.NET), Jasmine (Angular)
- **Coverage:** > 70% (empfohlen)

#### 10.1.2 Integrationstests
- **Ziel:** API-Endpoints
- **Framework:** xUnit mit WebApplicationFactory
- **Szenarien:** CRUD-Operationen, Validierung, Fehlerbehandlung

#### 10.1.3 E2E-Tests (Optional)
- **Ziel:** Komplette User-Journeys
- **Framework:** Cypress oder Playwright
- **Szenarien:** Zeiteintrag erfassen, Projekt anlegen

### 10.2 Testdaten

**Vorgefertigte Testdaten:**
- 7 Beispielprojekte
- 10 Mitarbeiter
- 12 Tätigkeiten (Stundensätze: 55€ - 100€)
- 15 Zeiteinträge

**Import-Dateien:**
```
SEeProjectTime.ConApp/data/
├── Projects.csv
├── Employees.csv
├── Activities.csv
└── TimeEntries.csv
```

**Import-Befehl:**
```bash
dotnet run --project SEeProjectTime.ConApp
# Option 2: "Import data" wählen
```

### 10.3 Testszenarien

#### Szenario 1: Zeiteintrag erfassen
1. Projekt auswählen (aktiv)
2. Mitarbeiter auswählen (aktiv)
3. Tätigkeit auswählen (aktiv)
4. Startzeit eingeben
5. Endzeit eingeben
6. Dauer wird berechnet
7. Kosten werden berechnet
8. Speichern erfolgreich

**Erwartetes Ergebnis:**
- Zeiteintrag in Datenbank
- Dauer = Endzeit - Startzeit
- Kosten = Dauer * Stundensatz

#### Szenario 2: Validierungsfehler
1. Projekt-Formular öffnen
2. Leeren Namen eingeben
3. Speichern versuchen

**Erwartetes Ergebnis:**
- Fehlermeldung: "Name ist erforderlich"
- Speichern wird verhindert
- Formular bleibt geöffnet

---

## 11. Deployment

### 11.1 Entwicklungsumgebung

**Voraussetzungen:**
- .NET 8.0 SDK
- Node.js 18+
- Angular CLI 19+
- Git

**Setup:**
```bash
# Repository klonen
git clone <repository-url>
cd SEeProjectTime

# Backend Dependencies
dotnet restore

# Datenbank initialisieren
dotnet run --project SEeProjectTime.ConApp
# Option 1: "Init database"

# Frontend Dependencies
cd SEeProjectTime.AngularApp
npm install

# Backend starten (Terminal 1)
cd ..
dotnet run --project SEeProjectTime.WebApi

# Frontend starten (Terminal 2)
cd SEeProjectTime.AngularApp
ng serve
```

**URLs:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

### 11.2 Produktionsumgebung

#### Backend (Docker)
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY ./publish .
ENTRYPOINT ["dotnet", "SEeProjectTime.WebApi.dll"]
```

**Build:**
```bash
dotnet publish -c Release -o ./publish
docker build -t seeprojecttime-api .
docker run -p 5000:80 seeprojecttime-api
```

#### Frontend
```bash
cd SEeProjectTime.AngularApp
ng build --configuration production
# Output: dist/programming_trainer.angular-app/
```

**Webserver:**
- Nginx oder Apache
- Gzip-Komprimierung aktiviert
- Cache-Headers für statische Assets

### 11.3 Konfiguration

**Backend (appsettings.json):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=SEeProjectTime.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Cors": {
    "AllowedOrigins": ["https://app.example.com"]
  }
}
```

**Frontend (environment.prod.ts):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com'
};
```

---

## 12. Wartung und Support

### 12.1 Backup-Strategie

**Datenbank:**
- Tägliches Backup (automatisch)
- Wöchentliches Full-Backup
- Retention: 30 Tage

**Backup-Befehl (SQLite):**
```bash
# Datenbank kopieren
cp SEeProjectTime.db SEeProjectTime_backup_$(date +%Y%m%d).db
```

### 12.2 Monitoring

**Zu überwachen:**
- API-Verfügbarkeit
- Response-Zeiten
- Fehlerrate
- Datenbankgröße
- Festplattenspeicher

**Tools (empfohlen):**
- Application Insights
- Serilog für strukturiertes Logging
- Health-Check-Endpoints

### 12.3 Updates

**Versionierung:**
- Semantic Versioning (MAJOR.MINOR.PATCH)
- Git Tags für Releases
- Changelog.md pflegen

**Update-Prozess:**
1. Backup erstellen
2. Code aktualisieren
3. Datenbank-Migrations ausführen
4. Tests durchführen
5. Deployment durchführen
6. Verifizierung

---

## 13. Projektorganisation

### 13.1 Projektstruktur

```
SEeProjectTime/
│
├── SEeProjectTime.sln                    # Solution-Datei
│
├── SEeProjectTime.Logic/                 # Business Logic Layer
│   ├── Entities/                         # Domain-Entitäten
│   │   ├── Data/                        # Stammdaten
│   │   │   ├── Project.cs
│   │   │   ├── Employee.cs
│   │   │   └── Activity.cs
│   │   ├── App/                         # Bewegungsdaten
│   │   │   └── TimeEntry.cs
│   │   └── Account/                     # Benutzerverwaltung
│   ├── Contracts/                       # Interfaces
│   ├── DataContext/                     # EF DbContext
│   └── Modules/                         # Business-Module
│
├── SEeProjectTime.WebApi/               # REST API
│   ├── Controllers/                     # API-Controller
│   ├── Models/                          # DTO-Modelle
│   └── Program.cs                       # API-Konfiguration
│
├── SEeProjectTime.AngularApp/           # Frontend
│   └── src/
│       ├── app/
│       │   ├── components/entities/     # Edit-Komponenten
│       │   ├── pages/entities/          # List-Komponenten
│       │   ├── models/                  # TypeScript-Interfaces
│       │   └── services/                # HTTP-Services
│       └── assets/i18n/                 # Übersetzungen
│
├── SEeProjectTime.ConApp/               # Console Tools
│   ├── Apps/                            # Import/Export-Apps
│   └── data/                            # CSV-Dateien
│
├── TemplateTools.ConApp/                # Code-Generator
│   └── templates/                       # Generierungs-Templates
│
└── Documentation/                       # Dokumentation
    ├── Pflichtenheft.md                # Dieses Dokument
    ├── entities_template.md
    ├── forms_template.md
    └── import_template.md
```

### 13.2 Entwicklungs-Workflow

**Entwicklungszyklus:**

1. **Anforderung definieren**
   - Feature in Task-Management erfassen
   - Akzeptanzkriterien festlegen

2. **Entität erstellen**
   - Entität in `Entities/Data/` oder `Entities/App/` anlegen
   - Validierung in `.Validation.cs` implementieren
   - Migration erstellen

3. **Code generieren**
   ```bash
   dotnet run --project TemplateTools.ConApp -- AppArg=4,9,x,x
   ```

4. **Frontend anpassen**
   - Komponenten in Routing eintragen
   - Dashboard aktualisieren
   - Übersetzungen hinzufügen

5. **Testen**
   - Unit Tests schreiben
   - Manuelles Testing
   - Code Review

6. **Deployment**
   - Merge in master
   - Version-Tag erstellen
   - Release-Notes aktualisieren

### 13.3 Coding-Standards

**C# (.NET):**
- PascalCase für Klassen, Methoden, Properties
- camelCase für private Felder (mit _ Präfix)
- Async-Suffix für asynchrone Methoden
- XML-Dokumentation für öffentliche APIs

**TypeScript (Angular):**
- camelCase für Variablen und Methoden
- PascalCase für Klassen und Interfaces
- kebab-case für Dateinamen
- Interfaces mit "I" Präfix (optional)

**Allgemein:**
- Maximale Zeilenlänge: 120 Zeichen
- Einrückung: 4 Spaces (C#), 2 Spaces (TypeScript)
- UTF-8 Encoding
- LF Line Endings

---

## 14. Risikomanagement

### 14.1 Identifizierte Risiken

| ID | Risiko | Wahrscheinlichkeit | Auswirkung | Maßnahme |
|----|--------|-------------------|------------|----------|
| R-01 | Datenverlust durch Hardware-Ausfall | Niedrig | Hoch | Tägliche Backups |
| R-02 | Performance-Probleme bei großen Datenmengen | Mittel | Mittel | Indizierung, Paginierung |
| R-03 | Browser-Inkompatibilität | Niedrig | Mittel | Cross-Browser-Testing |
| R-04 | Sicherheitslücken | Niedrig | Hoch | Security-Audits, Updates |
| R-05 | Ausfall Code-Generierung | Niedrig | Mittel | Manuelle Fallback-Prozesse |

### 14.2 Mitigationsstrategien

**R-01: Datenverlust**
- Automatische tägliche Backups
- Geo-Redundanz (Produktion)
- Disaster-Recovery-Plan

**R-02: Performance**
- Datenbank-Indizierung
- Query-Optimierung
- Caching-Strategie
- Load-Testing vor Release

**R-03: Browser-Inkompatibilität**
- Polyfills für ältere Browser
- Progressives Enhancement
- Automatisiertes Cross-Browser-Testing

**R-04: Sicherheit**
- Regelmäßige Dependency-Updates
- Penetration-Tests
- Security-Headers
- OWASP-Guidelines befolgen

---

## 15. Glossar

| Begriff | Definition |
|---------|------------|
| **Clean Architecture** | Architekturmuster mit strikter Schichttrennung und Dependency Inversion |
| **CRUD** | Create, Read, Update, Delete - Basis-Operationen |
| **EF Core** | Entity Framework Core - ORM für .NET |
| **i18n** | Internationalization - Mehrsprachigkeit |
| **ORM** | Object-Relational Mapping - Datenbankzugriff |
| **REST** | Representational State Transfer - API-Architektur |
| **SPA** | Single Page Application - Angular-Anwendung |
| **DTO** | Data Transfer Object - Datenübertragungsmodell |
| **Lazy Loading** | Verzögertes Laden von Daten |
| **Optimistic Concurrency** | Konfliktbehandlung durch RowVersion |

---

## 16. Anhänge

### 16.1 Referenzen

- **ASP.NET Core:** https://docs.microsoft.com/aspnet/core
- **Entity Framework Core:** https://docs.microsoft.com/ef/core
- **Angular:** https://angular.io/docs
- **Bootstrap:** https://getbootstrap.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

### 16.2 Kontakte

**Projektleitung:**
- Name: [Projektleiter]
- E-Mail: [email]

**Technische Leitung:**
- Name: [Tech Lead]
- E-Mail: [email]

**Support:**
- GitHub Issues: https://github.com/[owner]/SEeProjectTime/issues
- E-Mail: support@example.com

---

## Änderungshistorie

| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.0.0 | 04.11.2025 | [Autor] | Initiale Version des Pflichtenhefts |

---

**Freigabe:**

| Rolle | Name | Unterschrift | Datum |
|-------|------|--------------|-------|
| Projektleiter | | | |
| Technische Leitung | | | |
| Fachbereich | | | |

---

*Ende des Pflichtenhefts*
