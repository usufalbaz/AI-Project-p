export interface Section {
  id: string;
  title: string;
  content: string;
  mathFormulas?: string[];
  architectureDiagram?: string;
  takeaway: string;
}

export interface PythonCodeSnippet {
  title: string;
  filename: string;
  code: string;
  explanation: string;
  runnablePreset?: string;
}

export interface VideoResource {
  title: string;
  instructor: string;
  duration: string;
  videoUrl: string;
  embedId?: string;
  platform: 'YouTube' | 'Stanford' | 'MIT' | 'Conference';
  summary: string;
  keyTakeaways: string[];
}

export interface ReferencePaper {
  title: string;
  authors: string;
  year: number;
  arxivUrl: string;
  githubUrl?: string;
  badge: string;
  citation: string;
}

export interface PracticalExercise {
  prompt: string;
  initialCode: string;
  expectedOutputHint: string;
  solutionCode: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  readTime: string;
  sections: Section[];
  pythonCode: PythonCodeSnippet;
  videoResources: VideoResource[];
  referencePapers: ReferencePaper[];
  practicalExercise: PracticalExercise;
  interviewTips: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  estimatedHours: number;
  badge: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export interface UserProgress {
  completedLessons: string[];
  completedQuizzes: Record<number, { score: number; total: number; passed: boolean }>;
  activeChapterId: number;
  activeLessonId: string;
  savedNotes: Record<string, string>;
  studentName?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isThinking?: boolean;
}
