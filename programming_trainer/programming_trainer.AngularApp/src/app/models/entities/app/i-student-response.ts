//@GeneratedCode
import { IKeyModel } from '@app-models/i-key-model';
import { IAssignment } from '@app-models/entities/app/i-assignment';
//@CustomImportBegin
//@CustomImportEnd
export interface IStudentResponse extends IKeyModel {
  assignmentId: number;
  submittedAnswer: string | null;
  score: number | null;
  feedback: string | null;
  submissionDate: Date;
  assignment: IAssignment | null;
//@CustomCodeBegin
//@CustomCodeEnd
}
