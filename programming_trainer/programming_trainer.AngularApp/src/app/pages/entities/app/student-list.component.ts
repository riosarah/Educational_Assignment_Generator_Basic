//@CustomCode
import { IdType, IdDefault } from '@app/models/i-key-model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IStudent } from '@app-models/entities/app/i-student';
import { StudentBaseListComponent }from '@app/components/entities/app/student-base-list.component';
import { StudentEditComponent }from '@app/components/entities/app/student-edit.component';
import { StudentService } from '@app-services/http/entities/app/student-service';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  standalone: true,
  selector:'app-student-list',
  imports: [ CommonModule, FormsModule, TranslateModule, RouterModule ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent extends StudentBaseListComponent {
  constructor(protected override dataAccessService: StudentService)
  {
    super(dataAccessService);
  }
  override ngOnInit(): void {
    this._queryParams.filter = 'firstName.ToLower().Contains(@0) OR lastName.ToLower().Contains(@0) OR email.ToLower().Contains(@0) OR studentNumber.ToLower().Contains(@0)';
    this.reloadData();
  }
  protected override getItemKey(item: IStudent): IdType {
    return item?.id || IdDefault;
  }
  override get pageTitle(): string {
    return 'Students';
  }
  override getEditComponent() {
    return StudentEditComponent;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
