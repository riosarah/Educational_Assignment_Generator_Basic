//@GeneratedCode
import { IdType, IdDefault } from '@app-models/i-key-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEntityBaseService } from '@app-services/api-entity-base.service';
import { environment } from '@environment/environment';
import { IVersionEntityObject } from '@app-models/entities/i-version-entity-object';
//@CustomImportBegin
//@CustomImportEnd
@Injectable({
  providedIn: 'root',
})
export class VersionEntityObjectService extends ApiEntityBaseService<IVersionEntityObject> {
  constructor(public override http: HttpClient) {
    super(http, environment.API_BASE_URL + '/versionentityobjects');
  }

  public override getItemKey(item: IVersionEntityObject): IdType {
    return item?.id || IdDefault;
  }

//@CustomCodeBegin
//@CustomCodeEnd
}
