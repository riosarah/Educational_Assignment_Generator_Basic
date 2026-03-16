//@GeneratedCode
import { IdType, IdDefault } from '@app-models/i-key-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEntityBaseService } from '@app-services/api-entity-base.service';
import { environment } from '@environment/environment';
import { IStudent } from '@app-models/entities/app/i-student';
//@CustomImportBegin
//@CustomImportEnd
@Injectable({
  providedIn: 'root',
})
export class StudentService extends ApiEntityBaseService<IStudent> {
  constructor(public override http: HttpClient) {
    super(http, environment.API_BASE_URL + '/students');
  }

  public override getItemKey(item: IStudent): IdType {
    return item?.id || IdDefault;
  }

//@CustomCodeBegin
//@CustomCodeEnd
}
