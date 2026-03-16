//@CustomCode
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProgrammingLanguageBaseEditComponent }from '@app/components/entities/data/programming-language-base-edit.component';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-programming-language-edit',
  imports: [ CommonModule, FormsModule, TranslateModule],
  templateUrl: './programming-language-edit.component.html',
  styleUrl: './programming-language-edit.component.css'
})
export class ProgrammingLanguageEditComponent extends ProgrammingLanguageBaseEditComponent {
//@CustomCodeBegin
//@CustomCodeEnd
}
