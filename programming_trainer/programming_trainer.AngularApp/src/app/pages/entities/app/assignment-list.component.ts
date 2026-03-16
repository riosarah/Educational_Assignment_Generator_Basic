//@CustomCode
import { IdType, IdDefault } from '@app/models/i-key-model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IAssignment } from '@app-models/entities/app/i-assignment';
import { AssignmentBaseListComponent }from '@app/components/entities/app/assignment-base-list.component';
import { AssignmentEditComponent }from '@app/components/entities/app/assignment-edit.component';
import { AssignmentService } from '@app-services/http/entities/app/assignment-service';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  standalone: true,
  selector:'app-assignment-list',
  imports: [ CommonModule, FormsModule, TranslateModule, RouterModule ],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.css'
})
export class AssignmentListComponent extends AssignmentBaseListComponent {
  constructor(protected override dataAccessService: AssignmentService)
  {
    super(dataAccessService);
  }
  override ngOnInit(): void {
    this._queryParams.filter = 'title.ToLower().Contains(@0) OR description.ToLower().Contains(@0) OR studentPrompt.ToLower().Contains(@0) OR status.ToLower().Contains(@0)';
    this.reloadData();
  }
  protected override getItemKey(item: IAssignment): IdType {
    return item?.id || IdDefault;
  }
  override get pageTitle(): string {
    return 'Assignments';
  }
  override getEditComponent() {
    return AssignmentEditComponent;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
