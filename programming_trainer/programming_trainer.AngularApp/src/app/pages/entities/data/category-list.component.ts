//@CustomCode
import { IdType, IdDefault } from '@app/models/i-key-model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ICategory } from '@app-models/entities/data/i-category';
import { CategoryBaseListComponent }from '@app/components/entities/data/category-base-list.component';
import { CategoryEditComponent }from '@app/components/entities/data/category-edit.component';
import { CategoryService } from '@app-services/http/entities/data/category-service';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  standalone: true,
  selector:'app-category-list',
  imports: [ CommonModule, FormsModule, TranslateModule, RouterModule ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent extends CategoryBaseListComponent {
  constructor(protected override dataAccessService: CategoryService)
  {
    super(dataAccessService);
  }
  override ngOnInit(): void {
    this._queryParams.filter = 'name.ToLower().Contains(@0) OR description.ToLower().Contains(@0)';
    this.reloadData();
  }
  protected override getItemKey(item: ICategory): IdType {
    return item?.id || IdDefault;
  }
  override get pageTitle(): string {
    return 'Categories';
  }
  override getEditComponent() {
    return CategoryEditComponent;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
