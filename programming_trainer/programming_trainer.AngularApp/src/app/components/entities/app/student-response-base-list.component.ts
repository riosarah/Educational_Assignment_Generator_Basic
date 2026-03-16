//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { GenericEntityListComponent } from '@app/components/base/generic-entity-list.component';
import { IStudentResponse } from '@app-models/entities/app/i-student-response';
import { StudentResponseService } from '@app-services/http/entities/app/student-response-service';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class StudentResponseBaseListComponent extends GenericEntityListComponent<IStudentResponse> implements OnInit {
  constructor(
              protected dataAccessService: StudentResponseService
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
