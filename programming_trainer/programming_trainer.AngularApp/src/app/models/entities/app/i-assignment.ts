//@GeneratedCode
import { IKeyModel } from '@app-models/i-key-model';
import { IStudentResponse } from '@app-models/entities/app/i-student-response';
import { IStudent } from '@app-models/entities/app/i-student';
import { ICategory } from '@app-models/entities/data/i-category';
//@CustomImportBegin
//@CustomImportEnd
export interface IAssignment extends IKeyModel {
  studentId: number;
  studentPrompt: string | null;
  categoryId: number;
  title: string | null;
  description: string | null;
  status: string | null;
  createdDate: Date;
  student: IStudent | null;
  category: ICategory | null;
  studentResponses: IStudentResponse[];
//@CustomCodeBegin
//@CustomCodeEnd
}
