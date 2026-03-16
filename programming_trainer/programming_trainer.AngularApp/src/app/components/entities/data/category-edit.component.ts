//@CustomCode
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryBaseEditComponent }from '@app/components/entities/data/category-base-edit.component';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-category-edit',
  imports: [ CommonModule, FormsModule, TranslateModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export class CategoryEditComponent extends CategoryBaseEditComponent {
//@CustomCodeBegin
//@CustomCodeEnd
}
