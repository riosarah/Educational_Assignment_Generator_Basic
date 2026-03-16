//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { GenericEntityListComponent } from '@app/components/base/generic-entity-list.component';
import { IProgrammingLanguage } from '@app-models/entities/data/i-programming-language';
import { ProgrammingLanguageService } from '@app-services/http/entities/data/programming-language-service';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class ProgrammingLanguageBaseListComponent extends GenericEntityListComponent<IProgrammingLanguage> implements OnInit {
  constructor(
              protected dataAccessService: ProgrammingLanguageService
            )
  {
    super(dataAccessService);
  }
  ngOnInit(): void {
    this.reloadData();
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
