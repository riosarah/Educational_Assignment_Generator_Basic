//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IdType, IdDefault, IKeyModel } from '@app/models/i-key-model';
import { GenericEditComponent } from '@app/components/base/generic-edit.component';
import { IProgrammingLanguage } from '@app-models/entities/data/i-programming-language';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class ProgrammingLanguageBaseEditComponent extends GenericEditComponent<IProgrammingLanguage> implements OnInit {
  constructor()
  {
    super();
  }
  ngOnInit(): void {
  }

  public override getItemKey(item: IProgrammingLanguage): IdType {
    return item?.id || IdDefault;
  }

  public override get title(): string {
    return 'ProgrammingLanguage' + super.title;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
