//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IdType, IdDefault, IKeyModel } from '@app/models/i-key-model';
import { GenericEditComponent } from '@app/components/base/generic-edit.component';
import { ICategory } from '@app-models/entities/data/i-category';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class CategoryBaseEditComponent extends GenericEditComponent<ICategory> implements OnInit {
  constructor()
  {
    super();
  }
  ngOnInit(): void {
  }

  public override getItemKey(item: ICategory): IdType {
    return item?.id || IdDefault;
  }

  public override get title(): string {
    return 'Category' + super.title;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
