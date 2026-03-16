import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Student-Typ
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
}

export interface CreateStudentResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  message?: string;
  success: boolean;
}

// Request-Typen
export interface GenerateAssignmentRequest {
  studentId: number;
  studentPrompt: string;
  categoryName: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'de' | 'en';
  outputFormat: 'markdown';
}

export interface GenerateAssignmentResponse {
  assignmentId?: number;
  responseId?: number | null;
  title?: string;
  description?: string;
  markdown?: string;
  message?: string;
  success: boolean;
  score?: number | null;
  feedback?: string | null;
}

export interface EvaluateAssignmentRequest {
  assignmentId: number;
  submittedAnswer: string;
}

export interface EvaluateAssignmentResponse {
  assignmentId?: number;
  responseId?: number | null;
  title?: string | null;
  description?: string | null;
  score?: number;
  feedback?: string;
  message?: string;
  success: boolean;
}

// Webhook-Typen (nur für Dokumentation, werden vom Frontend nicht verwendet)
export interface AssignmentGeneratedUpdate {
  assignmentId: number;
  title: string;
  description: string;
}

export interface AssignmentEvaluatedUpdate {
  assignmentId: number;
  score: number;
  feedback: string;
}

// Assignment Statistics Types
export interface AssignmentWithStats {
  id: number;
  title: string;
  description: string;
  studentPrompt: string;
  status: string;
  createdDate: Date;
  
  // Student info
  studentId: number;
  studentName: string;
  studentEmail: string;
  
  // Category info
  categoryId: number;
  categoryName: string;
  
  // Statistics
  totalResponses: number;
  bestScore: number | null;
  latestScore: number | null;
  averageScore: number | null;
  
  // Latest response details
  latestResponseId: number | null;
  latestAnswer: string | null;
  latestFeedback: string | null;
  latestSubmissionDate: Date | null;
}

export interface StudentAssignmentStats {
  studentId: number;
  studentName: string;
  totalAssignments: number;
  completedAssignments: number;
  inProgressAssignments: number;
  createdAssignments: number;
  averageScore: number | null;
  bestScore: number | null;
  totalResponses: number;
  assignments: AssignmentWithStats[];
}

@Injectable({
  providedIn: 'root'
})
export class BotService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Sendet eine Anfrage an den Bot zur Generierung einer Aufgabenstellung
   * Triggert n8n Workflow: generate-task
   */
  generateAssignment(request: GenerateAssignmentRequest): Observable<GenerateAssignmentResponse> {
    return this.http.post<GenerateAssignmentResponse>(`${this.apiUrl}/assignments/generate`, request);
  }

  /**
   * Sendet Code zur Bewertung an den Bot
   * Triggert n8n Workflow: evaluate-task
   */
  evaluateSubmission(request: EvaluateAssignmentRequest): Observable<EvaluateAssignmentResponse> {
    return this.http.post<EvaluateAssignmentResponse>(`${this.apiUrl}/assignments/evaluate`, request);
  }

  /**
   * Lädt die Liste aller verfügbaren Students
   */
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
  }

  /**
   * Erstellt einen neuen Student
   */
  createStudent(request: CreateStudentRequest): Observable<CreateStudentResponse> {
    return this.http.post<CreateStudentResponse>(`${this.apiUrl}/students`, request);
  }

  /**
   * Lädt detaillierte Assignment-Statistiken für einen Student
   */
  getStudentAssignmentsWithStats(studentId: number): Observable<StudentAssignmentStats> {
    return this.http.get<StudentAssignmentStats>(`${this.apiUrl}/assignments/student/${studentId}/with-stats`);
  }
}
