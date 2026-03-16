import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  BotService,
  GenerateAssignmentRequest,
  GenerateAssignmentResponse,
  EvaluateAssignmentRequest,
  EvaluateAssignmentResponse,
  Student,
  CreateStudentRequest,
  CreateStudentResponse
} from '../../services/bot.service';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';

interface TopicArea {
  id: number;
  name: string;
  topics: string[];
}

interface SelectOption<T> {
  value: T;
  label: string;
}

const CUSTOM_TOPIC_VALUE = '__custom__';

@Component({
  selector: 'app-bot-chat',
  standalone: false,
  templateUrl: './bot-chat.component.html',
  styleUrl: './bot-chat.component.css'
})
export class BotChatComponent implements OnInit {
  // Students
  students: Student[] = [];
  selectedStudentId: number | null = null;
  isLoadingStudents: boolean = false;

  // Create Student Modal
  showCreateStudentModal: boolean = false;
  newStudent: CreateStudentRequest = {
    firstName: '',
    lastName: '',
    email: '',
    studentNumber: ''
  };
  isCreatingStudent: boolean = false;
  createStudentMessage: string = '';

  topicAreas: TopicArea[] = [];
  selectedTopicAreaId: number | null = null;
  selectedTopicAreaName: string = '';
  selectedTopic: string | null = null;
  customTopic: string = '';

  difficultyOptions: SelectOption<'easy' | 'medium' | 'hard'>[] = [
    { value: 'easy', label: 'Einfach' },
    { value: 'medium', label: 'Mittel' },
    { value: 'hard', label: 'Schwer' }
  ];
  selectedDifficulty: 'easy' | 'medium' | 'hard' | null = null;

  languageOptions: SelectOption<'de' | 'en'>[] = [
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'Englisch' }
  ];
  selectedLanguage: 'de' | 'en' | null = null;

  outputFormat: 'markdown' = 'markdown';

  additionalRequirements: string = '';

  isGenerating: boolean = false;
  isEvaluating: boolean = false;

  assignmentId: number | null = null;
  assignmentTitle: string = '';
  assignmentMarkdown: string = '';
  assignmentHtml: string = '';
  assignmentMessage: string = '';
  generatedAt: Date | null = null;

  answerText: string = '';
  evaluationScore: number | null = null;
  evaluationFeedback: string = '';
  evaluationFeedbackHtml: string = '';
  evaluationMessage: string = '';

  @ViewChild('assignmentPreview') assignmentPreviewRef?: ElementRef<HTMLElement>;

  constructor(private botService: BotService) { }

  ngOnInit(): void {
    this.loadStudents();
    this.loadMockData();
  }

  private loadStudents(): void {
    this.isLoadingStudents = true;
    this.botService.getStudents().subscribe({
      next: (students: Student[]) => {
        this.students = students;
        this.isLoadingStudents = false;
        // Auto-select first student if available
        if (this.students.length > 0) {
          this.selectedStudentId = this.students[0].id;
        }
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.isLoadingStudents = false;
      }
    });
  }

  openCreateStudentModal(): void {
    this.newStudent = {
      firstName: '',
      lastName: '',
      email: '',
      studentNumber: ''
    };
    this.createStudentMessage = '';
    this.showCreateStudentModal = true;
  }

  closeCreateStudentModal(): void {
    this.showCreateStudentModal = false;
    this.newStudent = {
      firstName: '',
      lastName: '',
      email: '',
      studentNumber: ''
    };
    this.createStudentMessage = '';
  }

  createNewStudent(): void {
    if (!this.newStudent.firstName.trim()) {
      this.createStudentMessage = 'Bitte gebe einen Vornamen an.';
      return;
    }
    if (!this.newStudent.lastName.trim()) {
      this.createStudentMessage = 'Bitte gebe einen Nachnamen an.';
      return;
    }
    if (!this.newStudent.email.trim() || !this.isValidEmail(this.newStudent.email)) {
      this.createStudentMessage = 'Bitte gebe eine gültige E-Mail an.';
      return;
    }
    if (!this.newStudent.studentNumber.trim()) {
      this.createStudentMessage = 'Bitte gebe eine Matrikelnummer an.';
      return;
    }

    this.isCreatingStudent = true;
    this.createStudentMessage = '';

    this.botService.createStudent(this.newStudent).subscribe({
      next: (response: CreateStudentResponse) => {
        this.isCreatingStudent = false;
        if (response.success) {
          // Reload students list
          this.loadStudents();
          this.closeCreateStudentModal();
        } else {
          this.createStudentMessage = response.message || 'Fehler beim Erstellen des Students.';
        }
      },
      error: (error) => {
        this.isCreatingStudent = false;
        console.error('Error creating student:', error);
        this.createStudentMessage = 'Es gab einen Fehler beim Erstellen des Students. Versuche es erneut.';
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  loadMockData(): void {
    this.topicAreas = [
      {
        id: 1,
        name: 'Mathematik',
        topics: ['Lineare Gleichungen', 'Bruchrechnung', 'Geometrie', 'Wahrscheinlichkeit']
      },
      {
        id: 2,
        name: 'Sprachen',
        topics: ['Grammatik', 'Vokabeln', 'Textverstaendnis', 'Schreiben']
      },
      {
        id: 3,
        name: 'Naturwissenschaften',
        topics: ['Physik', 'Chemie', 'Biologie', 'Astronomie']
      },
      {
        id: 4,
        name: 'Geschichte',
        topics: ['Antike', 'Mittelalter', 'Neuzeit', 'Zeitgeschichte']
      }
    ];
  }

  get availableTopics(): string[] {
    const area = this.topicAreas.find(item => item.id === this.selectedTopicAreaId);
    return area?.topics ?? [];
  }

  get isCustomTopicSelected(): boolean {
    return this.selectedTopic === CUSTOM_TOPIC_VALUE;
  }

  get canGenerate(): boolean {
    const topicValue = this.getTopicValue();
    return !!(
      this.selectedTopicAreaId &&
      topicValue &&
      this.selectedDifficulty &&
      this.selectedLanguage
    );
  }

  onTopicAreaChange(): void {
    const areaId = this.selectedTopicAreaId !== null ? Number(this.selectedTopicAreaId) : null;
    const area = this.topicAreas.find(item => item.id === areaId);

    this.selectedTopicAreaName = area?.name || '';
    this.selectedTopic = null;
    this.customTopic = '';
  }

  generateAssignment(): void {
    if (!this.selectedStudentId) {
      this.assignmentMessage = 'Bitte waehle einen Student aus.';
      return;
    }

    if (!this.canGenerate) {
      this.assignmentMessage = 'Bitte waehle Themenbereich, Thema, Schwierigkeit und Sprache.';
      return;
    }

    const topicValue = this.getTopicValue();
    if (!topicValue) {
      this.assignmentMessage = 'Bitte waehle ein gueltiges Thema.';
      return;
    }

    const categoryName = this.getCategoryName();
    if (!categoryName) {
      this.assignmentMessage = 'Bitte waehle einen gueltigen Themenbereich.';
      return;
    }

    this.isGenerating = true;
    this.assignmentMessage = '';
    this.resetGeneratedAssignment();
    this.resetEvaluation();

    const request: GenerateAssignmentRequest = {
      studentId: this.selectedStudentId,
      studentPrompt: this.buildStudentPrompt(),
      categoryName,
      topic: topicValue,
      difficulty: this.selectedDifficulty as 'easy' | 'medium' | 'hard',
      language: this.selectedLanguage as 'de' | 'en',
      outputFormat: this.outputFormat
    };

    this.botService.generateAssignment(request).subscribe({
      next: (response: GenerateAssignmentResponse) => {
        this.isGenerating = false;
        if (response.success) {
          this.assignmentId = response.assignmentId ?? null;
          this.assignmentTitle = response.title || 'Aufgabe';
          this.assignmentMarkdown = response.description || response.markdown || response.message || 'Aufgabe wurde erstellt.';
          this.assignmentHtml = this.renderMarkdown(this.assignmentMarkdown);
          this.generatedAt = new Date();
        } else {
          this.assignmentMessage = response.message || 'Fehler beim Erstellen der Aufgabe.';
        }
      },
      error: (error) => {
        this.isGenerating = false;
        console.error('Generate assignment error:', error);
        this.assignmentMessage = 'Es gab einen Fehler beim Generieren der Aufgabe. Versuche es erneut.';
      }
    });
  }

  submitAnswerForEvaluation(): void {
    if (!this.answerText.trim()) {
      this.evaluationMessage = 'Bitte fuege deine Antwort ein.';
      return;
    }

    if (!this.assignmentId) {
      this.evaluationMessage = 'Bitte generiere zuerst eine Aufgabe.';
      return;
    }

    this.isEvaluating = true;
    this.evaluationMessage = '';
    this.evaluationScore = null;
    this.evaluationFeedback = '';

    const request: EvaluateAssignmentRequest = {
      assignmentId: this.assignmentId,
      submittedAnswer: this.answerText
    };

    this.botService.evaluateSubmission(request).subscribe({
      next: (response: EvaluateAssignmentResponse) => {
        this.isEvaluating = false;
        if (response.success) {
          this.evaluationScore = response.score ?? null;
          this.evaluationFeedback = response.feedback || '';
          this.evaluationFeedbackHtml = this.evaluationFeedback
            ? this.renderMarkdown(this.evaluationFeedback)
            : '';
          this.evaluationMessage = response.message || 'Bewertung wurde angefragt.';
        } else {
          this.evaluationMessage = response.message || 'Fehler bei der Bewertung.';
        }
      },
      error: (error) => {
        this.isEvaluating = false;
        console.error('Evaluate submission error:', error);
        this.evaluationMessage = 'Es gab einen Fehler bei der Bewertung. Versuche es erneut.';
      }
    });
  }

  downloadPdf(): void {
    if (!this.assignmentPreviewRef?.nativeElement) {
      return;
    }

    const fileName = this.buildPdfFileName();
    const element = this.assignmentPreviewRef.nativeElement;

    html2pdf()
      .set({
        margin: 10,
        filename: fileName,
        html2canvas: { scale: 2, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save();
  }

  private renderMarkdown(markdown: string): string {
    return marked.parse(markdown, { gfm: true, breaks: true }) as string;
  }

  private getCategoryName(): string {
    if (this.selectedTopicAreaName) {
      return this.selectedTopicAreaName.trim();
    }

    const areaId = this.selectedTopicAreaId !== null ? Number(this.selectedTopicAreaId) : null;
    return this.topicAreas.find(item => item.id === areaId)?.name || '';
  }

  private buildStudentPrompt(): string {
    const topicArea = this.getCategoryName() || 'Allgemein';
    const topicValue = this.getTopicValue() || 'Unbekanntes Thema';
    const difficultyLabel = this.difficultyOptions.find(item => item.value === this.selectedDifficulty)?.label || 'Unbekannt';
    const languageLabel = this.languageOptions.find(item => item.value === this.selectedLanguage)?.label || 'Unbekannt';
    const extra = this.additionalRequirements.trim();

    if (extra) {
      return extra;
    }

    return `Erstelle eine Lernaufgabe. Themenbereich: ${topicArea}. Thema: ${topicValue}. Schwierigkeit: ${difficultyLabel}. Sprache: ${languageLabel}. Ausgabeformat: Markdown.`;
  }

  private getTopicValue(): string {
    if (this.selectedTopic === CUSTOM_TOPIC_VALUE) {
      return this.customTopic.trim();
    }
    return (this.selectedTopic || '').trim();
  }

  private buildPdfFileName(): string {
    const base = this.assignmentTitle || 'aufgabe';
    const safeName = base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40);
    return `${safeName || 'aufgabe'}.pdf`;
  }

  private resetGeneratedAssignment(): void {
    this.assignmentId = null;
    this.assignmentTitle = '';
    this.assignmentMarkdown = '';
    this.assignmentHtml = '';
    this.generatedAt = null;
  }

  private resetEvaluation(): void {
    this.answerText = '';
    this.evaluationScore = null;
    this.evaluationFeedback = '';
    this.evaluationFeedbackHtml = '';
    this.evaluationMessage = '';
  }
}

