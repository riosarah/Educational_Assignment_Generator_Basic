//@GeneratedCode
import { IdType, IdDefault } from '@app-models/i-key-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEntityBaseService } from '@app-services/api-entity-base.service';
import { environment } from '@environment/environment';
import { IStudentResponse } from '@app-models/entities/app/i-student-response';
//@CustomImportBegin
//@CustomImportEnd
@Injectable({
  providedIn: 'root',
})
export class StudentResponseService extends ApiEntityBaseService<IStudentResponse> {
  constructor(public override http: HttpClient) {
    super(http, environment.API_BASE_URL + '/studentresponses');
  }

  public override getItemKey(item: IStudentResponse): IdType {
    return item?.id || IdDefault;
  }

//@CustomCodeBegin
//@CustomCodeEnd
}
