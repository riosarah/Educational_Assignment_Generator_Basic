//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IdType, IdDefault, IKeyModel } from '@app/models/i-key-model';
import { GenericEditComponent } from '@app/components/base/generic-edit.component';
import { IStudent } from '@app-models/entities/app/i-student';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class StudentBaseEditComponent extends GenericEditComponent<IStudent> implements OnInit {
  constructor()
  {
    super();
  }
  ngOnInit(): void {
  }

  public override getItemKey(item: IStudent): IdType {
    return item?.id || IdDefault;
  }

  public override get title(): string {
    return 'Student' + super.title;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
