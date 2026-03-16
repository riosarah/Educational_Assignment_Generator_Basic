import { Component, OnInit } from '@angular/core';
import { IAssignment } from '../../models/entities/app/i-assignment';
import { IStudentResponse } from '../../models/entities/app/i-student-response';
import { ICategory } from '../../models/entities/data/i-category';
import { BotService, Student, StudentAssignmentStats, AssignmentWithStats } from '../../services/bot.service';

@Component({
  selector: 'app-student-portfolio',
  standalone: false,
  templateUrl: './student-portfolio.component.html',
  styleUrl: './student-portfolio.component.css'
})
export class StudentPortfolioComponent implements OnInit {
  assignments: IAssignment[] = [];
  filteredAssignments: IAssignment[] = [];
  selectedAssignment: IAssignment | null = null;
  
  // Filter options
  filterStatus: string = 'all';
  filterCategory: number | null = null;
  filterStudentId: number | null = null;
  searchTerm: string = '';
  
  // Reference data
  categories: ICategory[] = [];
  students: Student[] = [];
  isLoadingStudents: boolean = false;
  isLoadingAssignments: boolean = false;
  
  // Statistics
  stats = {
    total: 0,
    completed: 0,
    pending: 0,
    averageScore: 0
  };

  constructor(private botService: BotService) { }

  ngOnInit(): void {
    this.loadStudents();
    this.loadMockCategories();
  }

  loadStudents(): void {
    this.isLoadingStudents = true;
    this.botService.getStudents().subscribe({
      next: (students: Student[]) => {
        this.students = students;
        this.isLoadingStudents = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.isLoadingStudents = false;
      }
    });
  }

  loadMockCategories(): void {
    // Mock categories - in real app, load from API
    this.categories = [
      { id: 1, name: 'Mathematik', description: 'Rechnen, Algebra, Geometrie', assignments: [] },
      { id: 2, name: 'Sprachen', description: 'Grammatik, Vokabeln, Schreiben', assignments: [] },
      { id: 3, name: 'Naturwissenschaften', description: 'Physik, Chemie, Biologie', assignments: [] },
      { id: 4, name: 'Geschichte', description: 'Epochen, Quellen, Zusammenhaenge', assignments: [] }
    ];
  }

  loadStudentData(studentId: number): void {
    this.isLoadingAssignments = true;
    this.botService.getStudentAssignmentsWithStats(studentId).subscribe({
      next: (stats: StudentAssignmentStats) => {
        // Convert API data to local format
        this.assignments = stats.assignments.map(apiAssignment => this.convertToIAssignment(apiAssignment));
        
        // Update statistics from API
        this.stats = {
          total: stats.totalAssignments,
          completed: stats.completedAssignments,
          pending: stats.inProgressAssignments + stats.createdAssignments,
          averageScore: stats.averageScore || 0
        };

        // Apply filters
        this.applyFilters();
        this.isLoadingAssignments = false;
      },
      error: (error) => {
        console.error('Error loading student assignments:', error);
        this.isLoadingAssignments = false;
        // Fallback to empty data
        this.assignments = [];
        this.filteredAssignments = [];
        this.stats = {
          total: 0,
          completed: 0,
          pending: 0,
          averageScore: 0
        };
      }
    });
  }

  convertToIAssignment(apiAssignment: AssignmentWithStats): IAssignment {
    const assignment: IAssignment = {
      id: apiAssignment.id,
      title: apiAssignment.title,
      description: apiAssignment.description,
      studentPrompt: apiAssignment.studentPrompt,
      createdDate: new Date(apiAssignment.createdDate),
      status: apiAssignment.status,
      studentId: apiAssignment.studentId,
      student: null,
      categoryId: apiAssignment.categoryId,
      category: null,
      studentResponses: []
    };

    // Add latest response if available
    if (apiAssignment.latestResponseId) {
      const response: IStudentResponse = {
        id: apiAssignment.latestResponseId,
        assignmentId: apiAssignment.id,
        submittedAnswer: apiAssignment.latestAnswer || '',
        score: apiAssignment.latestScore || null,
        feedback: apiAssignment.latestFeedback || '',
        submissionDate: apiAssignment.latestSubmissionDate ? new Date(apiAssignment.latestSubmissionDate) : new Date(),
        assignment: null
      };
      assignment.studentResponses = [response];
    }

    return assignment;
  }

  applyFilters(): void {
    // Load student data when student filter changes
    if (this.filterStudentId && this.filterStudentId !== null) {
      this.loadStudentData(this.filterStudentId);
      return;
    }

    // If no student selected, apply other filters to existing data
    this.filteredAssignments = this.assignments.filter(assignment => {
      // Status filter
      if (this.filterStatus === 'completed' && assignment.status !== 'Completed') {
        return false;
      }
      if (this.filterStatus === 'open' && assignment.status === 'Completed') {
        return false;
      }
      
      // Category filter
      if (this.filterCategory && assignment.categoryId !== this.filterCategory) {
        return false;
      }
      
      // Search term
      if (this.searchTerm) {
        const search = this.searchTerm.toLowerCase();
        return assignment.title?.toLowerCase().includes(search) ||
               assignment.description?.toLowerCase().includes(search) ||
               assignment.studentPrompt?.toLowerCase().includes(search);
      }
      
      return true;
    });
    
    // Recalculate stats based on filtered assignments
    this.calculateFilteredStats();
  }

  calculateFilteredStats(): void {
    this.stats.total = this.filteredAssignments.length;
    this.stats.completed = this.filteredAssignments.filter(a => a.status === 'Completed').length;
    this.stats.pending = this.filteredAssignments.filter(a => a.status !== 'Completed').length;

    const completedWithScores = this.filteredAssignments
      .filter(a => a.status === 'Completed')
      .map(a => this.getLatestResponse(a))
      .filter((response): response is IStudentResponse => !!response && response.score !== null);
    if (completedWithScores.length > 0) {
      const totalScore = completedWithScores.reduce((sum, response) => sum + (response.score || 0), 0);
      this.stats.averageScore = Math.round(totalScore / completedWithScores.length);
    } else {
      this.stats.averageScore = 0;
    }
  }

  selectAssignment(assignment: IAssignment): void {
    this.selectedAssignment = assignment;
  }

  closeDetails(): void {
    this.selectedAssignment = null;
  }

  getStatusBadgeClass(status: string | null): string {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'InProgress': return 'badge-warning';
      case 'Created': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  getStatusLabel(status: string | null): string {
    switch (status) {
      case 'Completed': return 'Abgeschlossen';
      case 'InProgress': return 'In Bearbeitung';
      case 'Created': return 'Neu';
      default: return 'Unbekannt';
    }
  }

  getScoreBadgeClass(score: number | null): string {
    if (!score) return 'badge-secondary';
    if (score >= 80) return 'badge-success';
    if (score >= 50) return 'badge-warning';
    return 'badge-danger';
  }

  getCategoryName(id: number): string {
    return this.categories.find(c => c.id === id)?.name || 'Unbekannt';
  }

  getLatestResponse(assignment: IAssignment): IStudentResponse | null {
    if (!assignment.studentResponses || assignment.studentResponses.length === 0) {
      return null;
    }
    return [...assignment.studentResponses].sort((a, b) => {
      return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
    })[0];
  }

  getLatestAnswer(assignment: IAssignment): string | null {
    return this.getLatestResponse(assignment)?.submittedAnswer || null;
  }

  getLatestScore(assignment: IAssignment): number | null {
    const score = this.getLatestResponse(assignment)?.score;
    return score ?? null;
  }

  getLatestFeedback(assignment: IAssignment): string | null {
    return this.getLatestResponse(assignment)?.feedback || null;
  }

  getLatestSubmissionDate(assignment: IAssignment): Date | null {
    return this.getLatestResponse(assignment)?.submissionDate || null;
  }

  deleteAssignment(assignment: IAssignment, event: Event): void {
    event.stopPropagation();
    if (confirm(`Möchtest du die Aufgabe "${assignment.title}" wirklich löschen?`)) {
      this.assignments = this.assignments.filter(a => a.id !== assignment.id);
      this.applyFilters();
      if (this.selectedAssignment?.id === assignment.id) {
        this.closeDetails();
      }
    }
  }
}

