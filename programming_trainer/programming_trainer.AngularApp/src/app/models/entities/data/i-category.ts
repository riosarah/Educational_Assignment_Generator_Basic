//@GeneratedCode
import { IKeyModel } from '@app-models/i-key-model';
import { IAssignment } from '@app-models/entities/app/i-assignment';
//@CustomImportBegin
//@CustomImportEnd
export interface ICategory extends IKeyModel {
  name: string | null;
  description: string | null;
  assignments: IAssignment[];
//@CustomCodeBegin
//@CustomCodeEnd
}
