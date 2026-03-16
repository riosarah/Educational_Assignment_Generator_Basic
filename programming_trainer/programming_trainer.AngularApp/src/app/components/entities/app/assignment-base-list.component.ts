//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { GenericEntityListComponent } from '@app/components/base/generic-entity-list.component';
import { IAssignment } from '@app-models/entities/app/i-assignment';
import { AssignmentService } from '@app-services/http/entities/app/assignment-service';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class AssignmentBaseListComponent extends GenericEntityListComponent<IAssignment> implements OnInit {
  constructor(
              protected dataAccessService: AssignmentService
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
