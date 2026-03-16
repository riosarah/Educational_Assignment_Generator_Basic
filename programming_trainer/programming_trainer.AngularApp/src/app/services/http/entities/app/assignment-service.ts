//@GeneratedCode
import { IdType, IdDefault } from '@app-models/i-key-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEntityBaseService } from '@app-services/api-entity-base.service';
import { environment } from '@environment/environment';
import { IAssignment } from '@app-models/entities/app/i-assignment';
//@CustomImportBegin
//@CustomImportEnd
@Injectable({
  providedIn: 'root',
})
export class AssignmentService extends ApiEntityBaseService<IAssignment> {
  constructor(public override http: HttpClient) {
    super(http, environment.API_BASE_URL + '/assignments');
  }

  public override getItemKey(item: IAssignment): IdType {
    return item?.id || IdDefault;
  }

//@CustomCodeBegin
//@CustomCodeEnd
}
