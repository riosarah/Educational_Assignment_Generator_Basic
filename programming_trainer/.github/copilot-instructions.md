# GitHub Copilot Instructions für ProjectManagement

## Projektübersicht

ProjectManagement ist ein Basis-Template für die Erstellung der Anwendung mit Code-Generierung:
- **Backend**: .NET 8.0 mit Entity Framework Core
- **Frontend**: Angular 18 mit Bootstrap und standalone Komponenten
- **Code-Generierung**: Template-gesteuerte Erstellung aller CRUD-Operationen
- **Architektur**: Clean Architecture mit strikter Trennung von manuellen und generierten Code

## Kernprinzipien

### 1. Authentifizierung und Autorisierung

Im Template sind bereits grundlegende Authentifizierungs- und Autorisierungsmechanismen implementiert. Diese sollten jedoch an die spezifischen Anforderungen der Anwendung angepasst werden. Die Authentifizierung kann über das TemplateTools-Projekt eingestellt werden.

```bash
# Ein- und Ausschalten der Authentifizierung:
dotnet run --project TemplateTools.ConApp -- AppArg=3,2,x,x
```

### 2. Code-Generierung First

**⚠️ NIEMALS manuell Controllers, Services oder CRUD-Operationen erstellen!**

```bash
# Code-Generierung ausführen:
dotnet run --project TemplateTools.ConApp -- AppArg=4,9,x,x
```

### 3. Code-Marker System

- `//@AiCode` - Generierter Code, nicht bearbeiten
- `//@GeneratedCode` - Zeigt an, dass dieser Code vom Generator generiert wurde und bei der nächsten Generierung überschrieben wird.
- `//@CustomCode` - Falls in einer generierten Datei (@GeneratedCode) eine Änderung erfolgt, dann wird der Label @GeneratedCode zu @CustomCode geändert. Damit wird verhindert, dass der Code vom Generator überschrieben wird.
- `#if GENERATEDCODE_ON` - Conditional Compilation für Features

## Entity-Entwicklung

Die Entitäten werden immer mit englischen Bezeichner benannt.

### Dateistruktur
- **Stammdaten**: `ProjectManagement.Logic/Entities/Data/`
- **Anwendungsdaten**: `ProjectManagement.Logic/Entities/App/`
- **Account**: `ProjectManagement.Logic/Entities/Account/`

### Entity Template

- Erstelle die Klasse mit dem Modifier *public* und *partial*.
- Die Klasse erbt von `EntityObject`.  
- Dateiname: **EntityName.cs**.  

Beispielformat:
```csharp
//@Ai_Code
namespace AiKita_BE.Logic.Entities
{
    [Table("Entity")]
    [Index(nameof(propertyOne), isUnique = true, Name = "EntityName_Index")]
    public partial class EntityName : EntityObject
    {
      #region properties

      [MaxLength(Number)]
      [Required]   
      string AutoNameOne {get;set;} = string.empty;
      [MaxLength(Number)]
      public string[] AutoArray {get;set;} = Array.Empty<string>();

      #endregion properties

      #region navigationalProperties

      [ForeignKey("OtherTableName")]
      public IdType OtherTableId {get;set;}

      #endregion navigationalProperties

      #region constructor

      public EntityName(){}

      #endregion constructor

      #region overrides

      public override ToString(){
      return $"{AutoNameOne} {AutoNameTwo}...."
      }
      #endregion overrides
    }
}

```



## Struktur für Validierungsklassen

- Lege eine separate *partial* Klasse für die Validierung im **gleichen Namespace** wie die Entität an.  
- Die Klasse implementiert `IValidatableEntity`.  
- Dateiname: **EntityName.Validation.cs**.  
- Erkennbare Validierungsregeln aus der Beschreibung müssen implementiert werden.

BeispielFormat:
```csharp

namespace AiKita_BE.Logic.Entities
{
    public partial class EntityName :IValidatableEntity
    {
        private const int DefinitionLength = 4;       

        public void Validate(IContext context, EntityState entityState)
        {
            var errors = new List<string>();


            if (string.IsNullOrEmpty(AutoNameOne[0]))
                errors.Add($"{nameof(AutoNameOne)} Definition must not be empty");
            if (AutoNameTwo.Length < DefinitionLength)
                errors.Add($"{nameof(AutoNameTwo)} must be longer than {DefinitionLength} letters");
            if (OtherTableId == 0 || OtherTableId < 0)
            {
                errors.Add($"{nameof(OtherTableId)} reference must not be null or negative.");
            }

            if (errors.Any())
                throw new ValidationException(string.Join(" | ", errors));
        }
    }
}


```

## Validierungsregeln

- Keine Validierungen für Id-Felder (werden von der Datenbank verwaltet).

## Using-Regeln

- `using System` wird **nicht** explizit angegeben.

## Entity-Regeln

- Kommentar-Tags (`/// <summary>` usw.) sind für jede Entität erforderlich.  
- `ProjectManagement.Logic` ist fixer Bestandteil des Namespace.  
- `[.SubFolder]` ist optional und dient der Strukturierung.

## Property-Regeln

- Primärschlüssel `Id` wird von `EntityObject` geerbt.  
- **Auto-Properties**, wenn keine zusätzliche Logik benötigt wird.  
- **Full-Properties**, wenn Lese-/Schreiblogik erforderlich ist.  
- Für Id-Felder: Typ `IdType`.  
- Bei Längenangabe: `[MaxLength(n)]`.  
- Nicht-nullable `string`: `= string.Empty`.  
- Nullable `string?`: keine Initialisierung.

## Navigation Properties-Regeln

- In der Many-Entität: `EntityNameId`.  
- Navigation Properties immer vollqualifiziert:  
  `ProjectName.Entities.EntityName EntityName`  
- **1:n**:

```csharp
  public List<Type> EntityNames { get; set; } = [];
```  

- **1:1 / n:1**:  

```csharp
  Type? EntityName { get; set; }
```

## Dokumentation

- Jede Entität und Property erhält englische XML-Kommentare.

**Beispiel:**

```csharp
/// <summary>
/// Name of the entity.
/// </summary>
public string Name { get; set; } = string.Empty;
```


1. 
## Angular Komponenten

Die Generierung der Komponenten erfolgt für die Listen die sich im Ordner 'src/app/pages/entities/' befinden. Die dazugehörigen Edit Komponenten befinden sich im Ordner 'src/app/components/entities'.

### List Component Template




```html
<div class="container mt-4">
  <!-- Header -->
  <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-secondary text-white shadow-sm rounded">
    <h3 class="mb-0 flex-grow-1">
      {{ 'ENTITYNAME_LIST.TITLE_PLURAL' | translate }}
    </h3>
    <button
      class="btn btn-outline-light"
      (click)="navigateBack()"
      title="{{ 'ENTITYNAME_LIST.BACK' | translate }}"
      data-bs-toggle="tooltip"
      data-bs-placement="top">
      <i class="bi bi-arrow-left-circle"></i>
    </button>
  </div>

  <!-- Search and Add Section -->
  <div class="card p-3 mb-4 shadow-sm">
    <div class="d-flex flex-column flex-md-row align-items-md-center gap-2">
      <div class="input-group">
        <span class="input-group-text">
          <i class="bi bi-search"></i>
        </span>
        <input
          type="text"
          class="form-control"
          placeholder="{{ 'ENTITYNAME_LIST.SEARCH_PLACEHOLDER' | translate }}"
          [(ngModel)]="searchTerm"
          (input)="onSearchChange()" />
      </div>

      <button
        class="btn btn-primary ms-md-2"
        (click)="openCreateModal()"
        [title]="'ENTITYNAME_LIST.ADD' | translate">
        <i class="bi bi-plus-lg"></i>
        {{ 'ENTITYNAME_LIST.ADD' | translate }}
      </button>
    </div>
  </div>

  <!-- Entity List -->
  <ul class="list-group">
    <li
      *ngFor="let entity of filteredEntities"
      class="list-group-item list-group-item-action flex-column flex-md-row d-flex align-items-start align-items-md-center justify-content-between mb-2 shadow-sm">

      <!-- Entity Information -->
      <div class="flex-grow-1">
        <div class="fw-bold mb-1">
          <i class="bi bi-collection"></i>
          <span class="ms-1">
            {{ entity.name || ('ENTITYNAME_LIST.NO_NAME' | translate) }}
          </span>
        </div>
        <div class="small text-muted mb-2" *ngIf="entity.id">
          <i class="bi bi-card-text"></i>
          <span class="ms-1">
            ID: {{ entity.id }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex gap-2">
        <button
          class="btn btn-sm btn-outline-success"
          (click)="openUpdateModal(entity)"
          [title]="'ENTITYNAME_LIST.UPDATE' | translate">
          <i class="bi bi-pencil-square"></i>
        </button>

        <button
          class="btn btn-sm btn-outline-danger"
          (click)="deleteEntity(entity)"
          [title]="'ENTITYNAME_LIST.DELETE' | translate">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </li>

    <!-- No Results -->
    <li *ngIf="filteredEntities.length === 0" class="list-group-item text-muted text-center">
      {{ 'ENTITYNAME_LIST.NO_RESULTS' | translate }}
    </li>
  </ul>
</div>


```

### Bearbeitungsansicht (Edit-Formular)

* Für die Ansicht ist eine **Bootstrap-Card-Ansicht** zu verwenden.
* Die Komponenten sind bereits erstellt und befinden sich im Ordner `src/app/components/entities`.
* Alle Komponenten sind `standalone` Komponenten.
* **Dateiname:** `entity-name-edit.component.html`
* **Übersetzungen:** Ergänze die beiden Übersetzungsdateien `de.json` und `en.json` um die hinzugefügten Labels.
* Beispielstruktur:

```html

<div *ngIf="dataItem" class="card mt-4 shadow-sm">
  <!-- Header -->
  <div class="card-header d-flex justify-content-between align-items-center">
    <h3 class="mb-0">
      {{
        (editMode
          ? 'ENTITYNAME_EDIT.TITLE_EDIT'
          : 'ENTITYNAME_EDIT.TITLE_CREATE') | translate
      }}
    </h3>
    <button
      type="button"
      class="btn btn-sm btn-danger"
      aria-label="Close"
      (click)="dismiss()"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>

  <!-- Body -->
  <div class="card-body">
    <form (ngSubmit)="submitForm()" #editForm="ngForm">
      <!-- Name -->
      <div class="mb-3">
        <label class="form-label">{{
          'ENTITYNAME_EDIT.LABEL_NAME' | translate
        }}</label>
        <input
          class="form-control"
          [(ngModel)]="dataItem.name"
          name="name"
          required
        />
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label class="form-label">{{
          'ENTITYNAME_EDIT.LABEL_DESCRIPTION' | translate
        }}</label>
        <textarea
          class="form-control"
          [(ngModel)]="dataItem.description"
          name="description"
          rows="3"
        ></textarea>
      </div>

      <!-- Optional: Dropdown für abhängige Entitäten -->
      <div class="mb-3" *ngIf="relatedEntities.length > 0">
        <label class="form-label">{{
          'ENTITYNAME_EDIT.LABEL_RELATED' | translate
        }}</label>
        <select
          class="form-select"
          [(ngModel)]="dataItem.relatedEntityId"
          name="relatedEntityId"
        >
          <option [ngValue]="null">
            {{ 'ENTITYNAME_EDIT.SELECT_RELATED' | translate }}
          </option>
          <option
            *ngFor="let related of relatedEntities"
            [ngValue]="related.id"
          >
            {{ related.name }}
          </option>
        </select>
      </div>

      <!-- Optional: Datum -->
      <div class="mb-3" *ngIf="dataItem.date !== undefined">
        <label class="form-label">{{
          'ENTITYNAME_EDIT.LABEL_DATE' | translate
        }}</label>
        <input
          type="date"
          class="form-control"
          [(ngModel)]="dateString"
          name="date"
        />
      </div>

      <!-- Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button
          type="submit"
          class="btn btn-success"
          [disabled]="editForm.invalid || saveData"
        >
          <i class="bi bi-check-circle me-1"></i>
          {{ 'COMMON.SAVE' | translate }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          (click)="cancelForm()"
          [disabled]="saveData"
        >
          <i class="bi bi-x-circle me-1"></i>
          {{ 'COMMON.CANCEL' | translate }}
        </button>
      </div>
    </form>
  </div>
</div>


```

### Master-Details

In manchen Fällen ist eine Master/Details Ansicht sehr hilfreich. Diese Anzeige besteht aus einer Master-Ansicht. Diese kann nicht bearbeitet werden. Die Details zu diesem Master werden unter der Master-Ansicht als 'List-group' angezeigt. Die Generierung soll nur nach Aufforderung des Benutzers erfolgen. Nachfolgend ist die Struktur skizziert:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IdType } from '@app/models/i-key-model';
import { IMasterEntity } from '@app-models/entities/app/i-master-entity';
import { IDetailEntity } from '@app-models/entities/app/i-detail-entity';

import { MasterService } from '@app-services/http/entities/app/master-service';
import { DetailService } from '@app-services/http/entities/app/detail-service';
import { MasterXDetailService } from '@app-services/http/entities/app/master-x-detail-service';
import { DetailEditComponent } from '@app/components/entities/app/detail-edit.component';

@Component({
  selector: 'app-master-detail-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './master-detail-list.component.html',
  styleUrl: './master-detail-list.component.css',
})
export class MasterDetailListComponent implements OnInit {
  public masterEntity: IMasterEntity = {} as IMasterEntity;
  public masterDetails: IDetailEntity[] = [];
  public availableDetails: IDetailEntity[] = [];
  public selectedDetailId: IdType = 0;

  private masterId: IdType = 0;

  constructor(
    private masterService: MasterService,
    private detailService: DetailService,
    private masterDetailService: MasterXDetailService,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.masterId = Number(window.location.pathname.split('/').pop() || '0');
    if (isNaN(this.masterId) || this.masterId <= 0) {
      console.error('Invalid masterId in URL:', this.masterId);
      return;
    }
    this.loadMaster(this.masterId);
    this.loadMasterDetails(this.masterId);
    this.loadAvailableDetails(this.masterId);
  }

  private loadMaster(masterId: IdType): void {
    this.masterService.getById(masterId).subscribe((entity) => {
      this.masterEntity = entity;
    });
  }

  private loadMasterDetails(masterId: IdType): void {
    this.masterDetailService.detailsByMasterId(masterId).subscribe((details) => {
      this.masterDetails = details || [];
    });
  }

  private loadAvailableDetails(masterId: IdType): void {
    this.masterDetailService.availableDetails(masterId).subscribe((details) => {
      this.availableDetails = details || [];
    });
  }

  public addDetailToMaster(): void {
    if (this.selectedDetailId === 0) return;
    this.masterDetailService
      .addDetailToMaster(this.masterId, this.selectedDetailId)
      .subscribe({
        next: () => {
          this.loadMasterDetails(this.masterId);
          this.loadAvailableDetails(this.masterId);
          this.selectedDetailId = 0;
        },
        error: (err) => console.error('Error adding detail:', err),
      });
  }

  public openCreateDetailModal(): void {
    this.detailService.getTemplate().subscribe({
      next: (template) => {
        const ref = this.modal.open(DetailEditComponent, {
          size: 'lg',
          centered: true,
        });
        ref.componentInstance.dataItem = template;

        if (ref.componentInstance.save) {
          ref.componentInstance.save.subscribe((item: IDetailEntity) => {
            ref.componentInstance.saveData = true;
            this.detailService.create(item).subscribe({
              next: () => {
                this.loadAvailableDetails(this.masterId);
                this.loadMasterDetails(this.masterId);
                ref.close();
                ref.componentInstance.saveData = false;
              },
              error: (err) => {
                console.error('Error creating detail:', err);
                ref.componentInstance.saveData = false;
              },
            });
          });
        }
      },
    });
  }

  public removeDetailFromMaster(item: IDetailEntity): void {
    this.masterDetailService
      .removeDetailFromMaster(item.id, this.masterId)
      .subscribe({
        next: () => {
          this.loadMasterDetails(this.masterId);
          this.loadAvailableDetails(this.masterId);
        },
        error: (err) => console.error('Error removing detail:', err),
      });
  }
}

```

```html
<div class="container mt-4">
  <!-- Header -->
  <div
    class="d-flex justify-content-between align-items-center mb-4 p-3 bg-secondary text-white shadow-sm rounded"
  >
    <h3 class="mb-0 flex-grow-1">
      {{ 'MASTERDETAIL_LIST.TITLE' | translate }}
      {{ masterEntity?.displayName || '' }}
    </h3>

    <a
      routerLink="/{{ masterEntityPlural }}"
      class="btn btn-outline-light"
      title="{{ 'MASTERDETAIL_LIST.BACK' | translate }}"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
    >
      <i class="bi bi-arrow-left-circle"></i>
    </a>
  </div>

  <!-- Add Detail Section -->
  <div class="card p-3 mb-4 shadow-sm">
    <div class="d-flex flex-column flex-md-row align-items-md-center gap-2">
      <select
        id="detailSelect"
        name="detailSelect"
        class="form-select"
        [(ngModel)]="selectedDetailId"
      >
        <option [ngValue]="0">
          {{ 'MASTERDETAIL_LIST.SELECT_DETAIL' | translate }}
        </option>
        <option *ngFor="let detail of availableDetails" [ngValue]="detail.id">
          {{ detail.displayName || ('MASTERDETAIL_LIST.NO_NAME' | translate) }}
        </option>
      </select>

      <button
        class="btn btn-primary"
        (click)="addDetailToMaster()"
        [disabled]="selectedDetailId === 0"
        [title]="'MASTERDETAIL_LIST.ADD_DETAIL' | translate"
      >
        <i class="bi bi-plus-lg"></i>
        {{ 'MASTERDETAIL_LIST.ADD_DETAIL' | translate }}
      </button>

      <button
        class="btn btn-outline-success"
        (click)="openCreateDetailModal()"
        [title]="'MASTERDETAIL_LIST.CREATE_DETAIL' | translate"
      >
        <i class="bi bi-plus-circle"></i>
        {{ 'MASTERDETAIL_LIST.CREATE_DETAIL' | translate }}
      </button>
    </div>

    <div class="invalid-feedback d-block mt-1" *ngIf="selectedDetailId === 0">
      {{ 'MASTERDETAIL_LIST.SELECT_DETAIL_REQUIRED' | translate }}
    </div>
  </div>

  <!-- Master Detail List -->
  <ul class="list-group">
    <li
      *ngFor="let item of masterDetails"
      class="list-group-item list-group-item-action flex-column flex-md-row d-flex align-items-start align-items-md-center justify-content-between mb-2 shadow-sm"
    >
      <div class="flex-grow-1">
        <div class="fw-bold mb-1">
          <i class="bi bi-card-checklist"></i>
          <span class="ms-1">
            {{ item.displayName || ('MASTERDETAIL_LIST.NO_NAME' | translate) }}
          </span>
        </div>
        <div class="small text-muted mb-2" *ngIf="item.id">
          <i class="bi bi-card-text"></i>
          <span class="ms-1">
            {{ 'MASTERDETAIL_LIST.DETAIL_ID' | translate }}: {{ item.id }}
          </span>
        </div>
      </div>

      <button
        class="btn btn-sm btn-outline-danger"
        (click)="removeDetailFromMaster(item)"
        [title]="'MASTERDETAIL_LIST.REMOVE' | translate"
      >
        <i class="bi bi-trash"></i>
      </button>
    </li>

    <li
      *ngIf="masterDetails.length === 0"
      class="list-group-item text-center text-muted"
    >
      {{ 'MASTERDETAIL_LIST.NO_DETAILS' | translate }}
    </li>
  </ul>
</div>


```

## Entwicklungs-Workflow


## Von Entity zu vollständiger UI - Kompletter Workflow

### Phase 1: Entity-Definition bestätigen
1. **Benutzer beschreibt Entität(en)** im definierten Format
2. **Copilot erstellt Entity-Klasse(n)** nach Template
3. **Copilot erstellt Validierungs-Klasse(n)**
4. **Benutzer bestätigt Entity-Modell** → Weiter zu Phase 



Wenn der Benutzer Entitäten beschreibt, folge diesem Ablauf:

#### ✅ Phase 1: Anforderungen klären
- [ ] Entitätsbeschreibung vollständig? (Name, Type, Properties, Relations, Validation)
- [ ] Authentifizierung benötigt? (Ja/Nein)
- [ ] Master-Detail-Ansicht gewünscht? (Ja/Nein)
- [ ] Import-Daten vorhanden? (CSV-Dateien)
- [ ] Spezielle UI-Anforderungen? (z.B. Filtering, Sorting, Pagination)

#### ✅ Phase 2: Backend erstellen
1. **Entity-Klassen erstellen:**
   - Datei: `ProjectName.Logic/Entities/{Data|App|Account}/EntityName.cs`
   - Template verwenden (siehe "Entity Template")
   - XML-Dokumentation hinzufügen
   
2. **Validierungs-Klassen erstellen:**
   - Datei: `ProjectName.Logic/Entities/{Data|App|Account}/EntityName.Validation.cs`
   - `IValidatableEntity` implementieren
   - Validierungsregeln aus Beschreibung umsetzen

3. **Benutzer-Bestätigung einholen:**


2. **Datenbank erstellen:**
   - `dotnet run --project ProjectName.ConApp -- AppArg=1,2,x`

### 1. Authentifizierung einstellen
1. Die Standard-Einstellung ist ohne Authentifizierung. 
2. Frage den Benutzer, ob Authentifizierung benötigt wird.
3. Authentifizierung ausführen: `dotnet run --project TemplateTools.ConApp -- AppArg=3,2,x,x`

### 2. Entity erstellen
1. Entity-Klasse in `Logic/Entities/{Data|App}/` erstellen
2. Validierung in separater `.Validation.cs` Datei
3. Das Entity-Modell mit dem Benutzer abklären und bestätigen lassen.

### 2. Code-Generierung
1. Code-Generierung ausführen: `dotnet run --project TemplateTools.ConApp -- AppArg=4,9,x,x`

### 3. Daten-Import
1. CSV-Datei in `ConApp/data/entityname_set.csv` erstellen
2. Einstellen, dass die CSV-Datei ins Ausgabeverzeichnis kopiert wird
3. Import-Logic in `StarterApp.Import.cs` hinzufügen
4. Console-App ausführen und Import starten


### 4. Datenbank erstellen und Import starten
1. Code-Generierung ausführen: `dotnet run --project ProjectManagement.ConApp -- AppArg=1,2,x`

### 5. Angular-Komponenten
1. Erstelle für alle Entitäten die List-Komponente
   - Die List-Komponenten wurden vom Generator erstellt und befinden sich im Ordner 'src/app/pages/entities/'
   - Immer mit HTML-Templates in einer separaten Datei arbeiten.
   - Immer mit CSS-Templates in einer separaten Datei arbeiten.
   - **List Components anpassen:**
   - Suchfelder konfigurieren
   - Anzeige-Properties definieren
   - Filter/Sorting implementieren (falls benötigt)
2. Erstelle für alle List-Komponenten das Routing in `app-routing.module.ts`.
3. Trage alle List-Komponenten in das Dashboard für die Navigation ein.
4. **Routing hinzufügen:**
   - Routes in `app.routes.ts` eintragen
   - Navigation im Dashboard ergänzen
5. Erstelle für alle Entitäten die Edit-Komponente
   - Die Edit-Komponenten wurden vom Generator erstellt und befinden sich im Ordner 'src/app/components/entities/'
   - Verweise auf andere Entities als Dropdowns umsetzen.
   - Immer mit HTML-Templates in einer separaten Datei arbeiten.
   - Immer mit CSS-Templates in einer separaten Datei arbeiten.
   - **Edit Components anpassen:**
   - Formularfelder basierend auf Property-Typen generieren
   - Dropdowns für Foreign Keys implementieren
   - Enum-Selects hinzufügen
   - Date-Picker konfigurieren
4. Übersetzungen `de.json` und `en.json` für alle neuen Labels ergänzen
   - Format: `ENTITYNAME_LIST.*` und `ENTITYNAME_EDIT.*`

### mermaid UML
1. Erstelle mir mermaid uml in markdown files um die projektstructur darzustellen.

### 6. Anpassungen
- Custom Code in `//@CustomCode` Bereichen
- Separate `.Custom.cs` Dateien für erweiterte Logik
- `editMode` boolean für Create/Edit-Unterscheidung

### 7. Änderungen und Erweiterungen
- Änderungen die die Entitäten betreffen
  - Zuerst die generierten Klassen entfernen:
    1. Delete generierte Klassen: 
    `dotnet run --project TemplateTools.ConApp -- AppArg=4,7,x,x`
- Dannach starte wieder beim Workflow bei Punkt 1.


## TemplateTools.ConApp - Komplette Kommando-Referenz


### Übersicht der AppArg-Parameter
Format: `dotnet run --project TemplateTools.ConApp -- AppArg=X,Y,Z,W`

| Kommando | Beschreibung | Wann verwenden |
|----------|--------------|----------------|
| `3,2,x,x` | Authentifizierung ein/ausschalten | Zu Beginn des Projekts |
| `4,9,x,x` | Vollständige Code-Generierung | Nach jeder Entity-Änderung |
| `4,7,x,x` | Generierte Klassen löschen | Vor größeren Entity-Änderungen |
| `1,2,x` | Datenbank erstellen + Migration + Import | Nach Code-Generierung |




## Konventionen

### Naming
- Entities: PascalCase, Englisch
- Properties: PascalCase mit XML-Dokumentation
- Navigation Properties: Vollqualifiziert

### Validierung
- Keine Validierung für Id-Felder
- BusinessRuleException für Geschäftsregeln
- Async-Pattern mit RejectChangesAsync()

### Internationalisierung
- Alle Labels in i18n-Dateien
- Format: `ENTITYNAME_LIST.TITLE`
- Unterstützung für DE/EN

## Troubleshooting

### Häufige Probleme
- **Build-Fehler**: Code-Generierung ausführen nach Entity-Änderungen
- **Import-Fehler**: CSV-Format und Beziehungen prüfen
- **Routing**: Komponenten in `app-routing.module.ts` registrieren

### Debugging
- Generated Code über `//@AiCode` Marker identifizieren
- Custom Code in separaten Bereichen isolieren
- Console-App für Datenbank-Tests nutzen



### Übersetzungen

#### Deutsche und englische Übersetzungen

Hinzufügen von Übersetzungen für die neue Entität in die Datei `de.json` und `en.json` :
```json
{
  "ENTITYNAME_LIST": {
    "TITLE_PLURAL": "EntityNames",
    "BACK": "Zurück",
    "SEARCH_PLACEHOLDER": "Suchen...",
    "ADD": "Hinzufügen",
    "NO_NAME": "Kein Name",
    "UPDATE": "Bearbeiten",
    "DELETE": "Löschen",
    "NO_RESULTS": "Keine Ergebnisse gefunden"
  },
  "ENTITYNAME_EDIT": {
    "TITLE_EDIT": "EntityName bearbeiten",
    "TITLE_CREATE": "Neue EntityName erstellen",
    "LABEL_NAME": "Name",
    "LABEL_DESCRIPTION": "Beschreibung",
    "LABEL_RELATED": "Verwandte Entität",
    "SELECT_RELATED": "Verwandte Entität auswählen"
  }
}
```


### Phase 7: Testen

#### Checkliste:
- [ ] Backend: API-Endpoints funktionieren (Swagger UI)
- [ ] Frontend: List Component zeigt Daten
- [ ] Frontend: Create-Modal öffnet und speichert
- [ ] Frontend: Edit-Modal lädt Daten und speichert
- [ ] Frontend: Delete funktioniert mit Bestätigung
- [ ] Frontend: Suche filtert korrekt
- [ ] Übersetzungen: DE/EN wechseln funktioniert
- [ ] Validierung: Frontend- und Backend-Validierung greifen
- [ ] Relations: Dropdowns zeigen Daten, Foreign Keys werden gespeichert

### Bei Änderungen
Bevor Änderungen am Projekt durchgeführt werden können, 
müssen generierte Klassen mit TemplateTools.ConApp gelöscht und 
anschließend wieder neu generiert werden.
