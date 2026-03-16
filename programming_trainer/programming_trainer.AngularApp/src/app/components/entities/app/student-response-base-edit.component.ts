//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IdType, IdDefault, IKeyModel } from '@app/models/i-key-model';
import { GenericEditComponent } from '@app/components/base/generic-edit.component';
import { IStudentResponse } from '@app-models/entities/app/i-student-response';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class StudentResponseBaseEditComponent extends GenericEditComponent<IStudentResponse> implements OnInit {
  constructor()
  {
    super();
  }
  ngOnInit(): void {
  }

  public override getItemKey(item: IStudentResponse): IdType {
    return item?.id || IdDefault;
  }

  public override get title(): string {
    return 'StudentResponse' + super.title;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
