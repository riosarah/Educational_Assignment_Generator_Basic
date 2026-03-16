//@GeneratedCode
import { IKeyModel } from '@app-models/i-key-model';
import { IAssignment } from '@app-models/entities/app/i-assignment';
//@CustomImportBegin
//@CustomImportEnd
export interface IProgrammingLanguage extends IKeyModel {
  name: string | null;
  fileExtension: string | null;
  isActive: boolean;
  assignments: IAssignment[];
//@CustomCodeBegin
//@CustomCodeEnd
}
