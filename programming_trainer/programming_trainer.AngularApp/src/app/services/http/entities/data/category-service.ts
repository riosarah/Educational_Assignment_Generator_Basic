//@GeneratedCode
import { IdType, IdDefault } from '@app-models/i-key-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEntityBaseService } from '@app-services/api-entity-base.service';
import { environment } from '@environment/environment';
import { ICategory } from '@app-models/entities/data/i-category';
//@CustomImportBegin
//@CustomImportEnd
@Injectable({
  providedIn: 'root',
})
export class CategoryService extends ApiEntityBaseService<ICategory> {
  constructor(public override http: HttpClient) {
    super(http, environment.API_BASE_URL + '/categories');
  }

  public override getItemKey(item: ICategory): IdType {
    return item?.id || IdDefault;
  }

//@CustomCodeBegin
//@CustomCodeEnd
}
