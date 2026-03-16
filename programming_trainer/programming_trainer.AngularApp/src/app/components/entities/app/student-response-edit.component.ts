//@CustomCode
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StudentResponseBaseEditComponent }from '@app/components/entities/app/student-response-base-edit.component';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-student-response-edit',
  imports: [ CommonModule, FormsModule, TranslateModule],
  templateUrl: './student-response-edit.component.html',
  styleUrl: './student-response-edit.component.css'
})
export class StudentResponseEditComponent extends StudentResponseBaseEditComponent {
//@CustomCodeBegin
//@CustomCodeEnd
}
