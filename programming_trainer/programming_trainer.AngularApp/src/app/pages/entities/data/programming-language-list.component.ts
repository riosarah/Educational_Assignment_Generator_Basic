//@CustomCode
import { IdType, IdDefault } from '@app/models/i-key-model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IProgrammingLanguage } from '@app-models/entities/data/i-programming-language';
import { ProgrammingLanguageBaseListComponent }from '@app/components/entities/data/programming-language-base-list.component';
import { ProgrammingLanguageEditComponent }from '@app/components/entities/data/programming-language-edit.component';
import { ProgrammingLanguageService } from '@app-services/http/entities/data/programming-language-service';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  standalone: true,
  selector:'app-programming-language-list',
  imports: [ CommonModule, FormsModule, TranslateModule, RouterModule ],
  templateUrl: './programming-language-list.component.html',
  styleUrl: './programming-language-list.component.css'
})
export class ProgrammingLanguageListComponent extends ProgrammingLanguageBaseListComponent {
  constructor(protected override dataAccessService: ProgrammingLanguageService)
  {
    super(dataAccessService);
  }
  override ngOnInit(): void {
    this._queryParams.filter = 'name.ToLower().Contains(@0) OR fileExtension.ToLower().Contains(@0)';
    this.reloadData();
  }
  protected override getItemKey(item: IProgrammingLanguage): IdType {
    return item?.id || IdDefault;
  }
  override get pageTitle(): string {
    return 'ProgrammingLanguages';
  }
  override getEditComponent() {
    return ProgrammingLanguageEditComponent;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
