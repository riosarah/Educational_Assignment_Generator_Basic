//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { GenericEntityListComponent } from '@app/components/base/generic-entity-list.component';
import { IStudent } from '@app-models/entities/app/i-student';
import { StudentService } from '@app-services/http/entities/app/student-service';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class StudentBaseListComponent extends GenericEntityListComponent<IStudent> implements OnInit {
  constructor(
              protected dataAccessService: StudentService
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
