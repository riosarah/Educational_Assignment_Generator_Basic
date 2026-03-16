//@GeneratedCode
import { IdType, IdDefault } from '@app-models/i-key-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEntityBaseService } from '@app-services/api-entity-base.service';
import { environment } from '@environment/environment';
import { IProgrammingLanguage } from '@app-models/entities/data/i-programming-language';
//@CustomImportBegin
//@CustomImportEnd
@Injectable({
  providedIn: 'root',
})
export class ProgrammingLanguageService extends ApiEntityBaseService<IProgrammingLanguage> {
  constructor(public override http: HttpClient) {
    super(http, environment.API_BASE_URL + '/programminglanguages');
  }

  public override getItemKey(item: IProgrammingLanguage): IdType {
    return item?.id || IdDefault;
  }

//@CustomCodeBegin
//@CustomCodeEnd
}
