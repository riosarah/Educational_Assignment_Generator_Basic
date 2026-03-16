//@CustomCode
import { IdType, IdDefault } from '@app/models/i-key-model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IStudentResponse } from '@app-models/entities/app/i-student-response';
import { StudentResponseBaseListComponent }from '@app/components/entities/app/student-response-base-list.component';
import { StudentResponseEditComponent }from '@app/components/entities/app/student-response-edit.component';
import { StudentResponseService } from '@app-services/http/entities/app/student-response-service';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  standalone: true,
  selector:'app-student-response-list',
  imports: [ CommonModule, FormsModule, TranslateModule, RouterModule ],
  templateUrl: './student-response-list.component.html',
  styleUrl: './student-response-list.component.css'
})
export class StudentResponseListComponent extends StudentResponseBaseListComponent {
  constructor(protected override dataAccessService: StudentResponseService)
  {
    super(dataAccessService);
  }
  override ngOnInit(): void {
    this._queryParams.filter = 'submittedAnswer.ToLower().Contains(@0) OR feedback.ToLower().Contains(@0)';
    this.reloadData();
  }
  protected override getItemKey(item: IStudentResponse): IdType {
    return item?.id || IdDefault;
  }
  override get pageTitle(): string {
    return 'StudentResponses';
  }
  override getEditComponent() {
    return StudentResponseEditComponent;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
