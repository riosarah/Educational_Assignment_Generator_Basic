//@CustomCode
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AssignmentBaseEditComponent }from '@app/components/entities/app/assignment-base-edit.component';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-assignment-edit',
  imports: [ CommonModule, FormsModule, TranslateModule],
  templateUrl: './assignment-edit.component.html',
  styleUrl: './assignment-edit.component.css'
})
export class AssignmentEditComponent extends AssignmentBaseEditComponent {
//@CustomCodeBegin
//@CustomCodeEnd
}
