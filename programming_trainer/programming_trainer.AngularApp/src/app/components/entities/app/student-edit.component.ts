//@CustomCode
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StudentBaseEditComponent }from '@app/components/entities/app/student-base-edit.component';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-student-edit',
  imports: [ CommonModule, FormsModule, TranslateModule],
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent extends StudentBaseEditComponent {
//@CustomCodeBegin
//@CustomCodeEnd
}
