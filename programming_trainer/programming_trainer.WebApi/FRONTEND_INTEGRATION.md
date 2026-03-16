# Frontend Integration für N8N Workflows

## ?? Service-Integration

### 1. Assignment Service erweitern

Erweitere den Angular Assignment-Service um die neuen Endpoints:

```typescript
// src/app/services/http/entities/app/assignment-service.ts

/**
 * Triggers the n8n workflow to generate a new assignment
 */
public generateAssignment(
  studentId: IdType,
  studentPrompt: string,
  categoryId: IdType,
  programmingLanguageId: IdType
): Observable<any> {
  const url = `${this.baseUrl}/generate`;
  const body = {
    studentId,
    studentPrompt,
    categoryId,
    programmingLanguageId
  };
  return this.http.post(url, body);
}

/**
 * Triggers the n8n workflow to evaluate an assignment
 */
public evaluateAssignment(
  assignmentId: IdType,
  submittedCode: string
): Observable<any> {
  const url = `${this.baseUrl}/evaluate`;
  const body = {
    assignmentId,
    submittedCode
  };
  return this.http.post(url, body);
}
```

---

## ?? UI-Komponenten

### 2. Aufgaben-Generierungs-Dialog

Erstelle eine Komponente für die Aufgabengenerierung:

```typescript
// src/app/components/entities/app/assignment-generate-dialog.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignmentService } from '@app-services/http/entities/app/assignment-service';
import { CategoryService } from '@app-services/http/entities/data/category-service';
import { ProgrammingLanguageService } from '@app-services/http/entities/data/programming-language-service';

@Component({
  selector: 'app-assignment-generate-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Neue Aufgabe generieren</h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <form #generateForm="ngForm">
        <div class="mb-3">
          <label class="form-label">Kategorie</label>
          <select class="form-select" [(ngModel)]="categoryId" name="category" required>
            <option [ngValue]="0">Bitte wählen...</option>
            <option *ngFor="let cat of categories" [ngValue]="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Programmiersprache</label>
          <select class="form-select" [(ngModel)]="programmingLanguageId" name="language" required>
            <option [ngValue]="0">Bitte wählen...</option>
            <option *ngFor="let lang of languages" [ngValue]="lang.id">
              {{ lang.name }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Was möchtest du lernen?</label>
          <textarea 
            class="form-control" 
            [(ngModel)]="studentPrompt" 
            name="prompt"
            rows="4"
            placeholder="z.B. Erstelle eine Aufgabe über Sortieralgorithmen..."
            required>
          </textarea>
          <small class="text-muted">
            Beschreibe, welches Thema oder welche Aufgabe du bearbeiten möchtest.
          </small>
        </div>

        <div *ngIf="isGenerating" class="alert alert-info">
          <div class="d-flex align-items-center">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            <span>Aufgabe wird generiert... Bitte warten.</span>
          </div>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button 
        type="button" 
        class="btn btn-secondary" 
        (click)="activeModal.dismiss()"
        [disabled]="isGenerating">
        Abbrechen
      </button>
      <button 
        type="button" 
        class="btn btn-primary"
        (click)="generate()"
        [disabled]="!generateForm.valid || isGenerating">
        <i class="bi bi-stars me-1"></i>
        Generieren
      </button>
    </div>
  `
})
export class AssignmentGenerateDialogComponent {
  public studentId: IdType = 1; // Aus Session/Auth holen
  public studentPrompt: string = '';
  public categoryId: IdType = 0;
  public programmingLanguageId: IdType = 0;
  public categories: any[] = [];
  public languages: any[] = [];
  public isGenerating: boolean = false;
  public error: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private assignmentService: AssignmentService,
    private categoryService: CategoryService,
    private languageService: ProgrammingLanguageService
  ) {
    this.loadData();
  }

  private loadData(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
    this.languageService.getAll().subscribe(langs => this.languages = langs);
  }

  public generate(): void {
    this.isGenerating = true;
    this.error = '';

    this.assignmentService.generateAssignment(
      this.studentId,
      this.studentPrompt,
      this.categoryId,
      this.programmingLanguageId
    ).subscribe({
      next: (response) => {
        this.isGenerating = false;
        this.activeModal.close(response.assignmentId);
      },
      error: (err) => {
        this.isGenerating = false;
        this.error = err.error?.message || 'Fehler beim Generieren der Aufgabe';
      }
    });
  }
}
```

---

### 3. Code-Einreichungs-Dialog

Erstelle eine Komponente für die Code-Einreichung:

```typescript
// src/app/components/entities/app/assignment-submit-dialog.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignmentService } from '@app-services/http/entities/app/assignment-service';

@Component({
  selector: 'app-assignment-submit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Code einreichen</h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="mb-3">
        <h5>{{ assignment?.title }}</h5>
        <p class="text-muted">{{ assignment?.description }}</p>
      </div>

      <div class="mb-3">
        <label class="form-label">Dein Code</label>
        <textarea 
          class="form-control font-monospace" 
          [(ngModel)]="submittedCode" 
          rows="15"
          placeholder="Füge hier deinen Code ein..."
          required>
        </textarea>
      </div>

      <div *ngIf="isEvaluating" class="alert alert-info">
        <div class="d-flex align-items-center">
          <div class="spinner-border spinner-border-sm me-2" role="status"></div>
          <span>Code wird bewertet... Bitte warten.</span>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>
    </div>
    <div class="modal-footer">
      <button 
        type="button" 
        class="btn btn-secondary" 
        (click)="activeModal.dismiss()"
        [disabled]="isEvaluating">
        Abbrechen
      </button>
      <button 
        type="button" 
        class="btn btn-success"
        (click)="submit()"
        [disabled]="!submittedCode || isEvaluating">
        <i class="bi bi-check-circle me-1"></i>
        Einreichen & Bewerten
      </button>
    </div>
  `
})
export class AssignmentSubmitDialogComponent {
  @Input() assignment: any;
  public submittedCode: string = '';
  public isEvaluating: boolean = false;
  public error: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private assignmentService: AssignmentService
  ) {}

  public submit(): void {
    this.isEvaluating = true;
    this.error = '';

    this.assignmentService.evaluateAssignment(
      this.assignment.id,
      this.submittedCode
    ).subscribe({
      next: (response) => {
        this.isEvaluating = false;
        this.activeModal.close(response.assignmentId);
      },
      error: (err) => {
        this.isEvaluating = false;
        this.error = err.error?.message || 'Fehler beim Bewerten des Codes';
      }
    });
  }
}
```

---

### 4. Integration in Assignment-List

Erweitere die Assignment-List-Komponente:

```typescript
// src/app/pages/entities/app/assignment-list.component.ts

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignmentGenerateDialogComponent } from '@app/components/...';
import { AssignmentSubmitDialogComponent } from '@app/components/...';

export class AssignmentListComponent implements OnInit {
  
  constructor(
    private assignmentService: AssignmentService,
    private modalService: NgbModal
  ) {}

  public openGenerateDialog(): void {
    const modalRef = this.modalService.open(AssignmentGenerateDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.result.then(
      (assignmentId) => {
        if (assignmentId) {
          // Polling starten oder WebSocket verwenden
          this.pollAssignmentStatus(assignmentId);
        }
      },
      () => {} // dismissed
    );
  }

  public openSubmitDialog(assignment: any): void {
    const modalRef = this.modalService.open(AssignmentSubmitDialogComponent, {
      size: 'xl',
      centered: true
    });
    modalRef.componentInstance.assignment = assignment;

    modalRef.result.then(
      (assignmentId) => {
        if (assignmentId) {
          // Polling starten oder WebSocket verwenden
          this.pollAssignmentStatus(assignmentId);
        }
      },
      () => {} // dismissed
    );
  }

  private pollAssignmentStatus(assignmentId: IdType): void {
    const interval = setInterval(() => {
      this.assignmentService.getById(assignmentId).subscribe(assignment => {
        if (assignment.status !== 'Generating' && assignment.status !== 'Evaluating') {
          clearInterval(interval);
          this.loadAssignments(); // Refresh list
        }
      });
    }, 3000); // Poll every 3 seconds
  }
}
```

---

### 5. Status-Badges

Füge Status-Badges im Template hinzu:

```html
<!-- assignment-list.component.html -->

<span class="badge" [ngClass]="{
  'bg-secondary': assignment.status === 'Generating',
  'bg-info': assignment.status === 'Created',
  'bg-warning': assignment.status === 'Submitted',
  'bg-primary': assignment.status === 'Evaluating',
  'bg-success': assignment.status === 'Evaluated',
  'bg-danger': assignment.status === 'Error'
}">
  {{ assignment.status }}
</span>
```

---

## ?? WebSocket Alternative (Optional)

Für Echtzeit-Updates ohne Polling:

```typescript
// src/app/services/assignment-status.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssignmentStatusService {
  private statusUpdates = new Subject<any>();
  public statusUpdates$ = this.statusUpdates.asObservable();

  constructor() {
    // SignalR oder WebSocket Connection hier initialisieren
  }

  public subscribeToAssignment(assignmentId: IdType): void {
    // Subscribe to specific assignment updates
  }
}
```

---

## ?? Zusammenfassung

**Flow:**
1. Student klickt "Neue Aufgabe generieren"
2. Dialog öffnet sich ? Student gibt Prompt ein
3. API-Call zu `/api/assignments/generate`
4. Frontend zeigt "Generating..." Status
5. Polling oder WebSocket wartet auf Status-Änderung zu "Created"
6. Student sieht die fertige Aufgabe
7. Student schreibt Code und klickt "Einreichen"
8. API-Call zu `/api/assignments/evaluate`
9. Frontend zeigt "Evaluating..." Status
10. Nach Abschluss: Status "Evaluated" + Score & Feedback anzeigen

**Vorteile:**
- ? Asynchrone Verarbeitung (Backend blockiert nicht)
- ? Flexibilität durch n8n (einfache Workflow-Änderungen)
- ? Saubere Trennung (API ? n8n ? AI)
- ? Echtzeit-Feedback für User
