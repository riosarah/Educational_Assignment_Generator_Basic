//@GeneratedCode
import { IKeyModel } from '@app-models/i-key-model';
import { IAssignment } from '@app-models/entities/app/i-assignment';
//@CustomImportBegin
//@CustomImportEnd
export interface IStudent extends IKeyModel {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  studentNumber: string | null;
  registrationDate: Date;
  assignments: IAssignment[];
//@CustomCodeBegin
//@CustomCodeEnd
}
