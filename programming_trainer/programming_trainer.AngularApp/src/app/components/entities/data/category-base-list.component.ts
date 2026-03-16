//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { GenericEntityListComponent } from '@app/components/base/generic-entity-list.component';
import { ICategory } from '@app-models/entities/data/i-category';
import { CategoryService } from '@app-services/http/entities/data/category-service';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class CategoryBaseListComponent extends GenericEntityListComponent<ICategory> implements OnInit {
  constructor(
              protected dataAccessService: CategoryService
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
