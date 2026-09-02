import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LessonView } from './components/LessonView';
import { AiMentorDrawer } from './components/AiMentorDrawer';
import { QuizModal } from './components/QuizModal';
import { VramCalculatorModal } from './components/VramCalculatorModal';
import { CertificateModal } from './components/CertificateModal';
import { ApiKeyModal, API_KEY_STORAGE_KEY } from './components/ApiKeyModal';
import { DiplomaBanner } from './components/DiplomaBanner';
import { DiplomaSyllabusModal } from './components/DiplomaSyllabusModal';
import { StudentNotesDrawer } from './components/StudentNotesDrawer';
import { allChapters, getLessonById } from './data/curriculumData';
import { UserProgress } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const PROGRESS_STORAGE_KEY = 'ai_systems_platform_progress_v1';

function AppContent() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Load progress from localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
    return {
      completedLessons: ['1-1'],
      completedQuizzes: {},
      studentName: ''
    };
  });

  // Load API Key from localStorage
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  // Current Active Lesson and Chapter
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);
  const [currentLessonId, setCurrentLessonId] = useState<string>('1-1');

  // Modals & Drawers state
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [activeQuizChapterId, setActiveQuizChapterId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    try {
      if (newKey) {
        localStorage.setItem(API_KEY_STORAGE_KEY, newKey);
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save api key to localStorage", e);
    }
  };

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  }, [progress]);

  // Current lesson & chapter details
  const resolved = getLessonById(currentLessonId) || {
    lesson: allChapters[0].lessons[0],
    chapter: allChapters[0]
  };
  const { lesson: currentLesson, chapter: currentChapter } = resolved;

  // Flattened list of all lessons for linear navigation
  const allLessonsFlat = allChapters.flatMap(c => c.lessons.map(l => ({ lessonId: l.id, chapterId: c.id })));
  const currentIndex = allLessonsFlat.findIndex(x => x.lessonId === currentLessonId);
  const hasNext = currentIndex < allLessonsFlat.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNextLesson = () => {
    if (hasNext) {
      const next = allLessonsFlat[currentIndex + 1];
      setCurrentChapterId(next.chapterId);
      setCurrentLessonId(next.lessonId);
    }
  };

  const handlePrevLesson = () => {
    if (hasPrev) {
      const prev = allLessonsFlat[currentIndex - 1];
      setCurrentChapterId(prev.chapterId);
      setCurrentLessonId(prev.lessonId);
    }
  };

  const handleSelectLesson = (chapterId: number, lessonId: string) => {
    setCurrentChapterId(chapterId);
    setCurrentLessonId(lessonId);
  };

  const handleToggleCompleteLesson = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.completedLessons.includes(lessonId);
      const updated = exists
        ? prev.completedLessons.filter(id => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      return { ...prev, completedLessons: updated };
    });
  };

  const handleSaveQuizScore = (chapterId: number, score: number, total: number) => {
    const passed = score >= Math.ceil(total * 0.7);
    setProgress(prev => ({
      ...prev,
      completedQuizzes: {
        ...prev.completedQuizzes,
        [chapterId]: { score, total, passed }
      }
    }));
  };

  const handleSaveStudentName = (name: string) => {
    setProgress(prev => ({
      ...prev,
      studentName: name
    }));
  };

  const activeQuizChapter = activeQuizChapterId ? allChapters.find(c => c.id === activeQuizChapterId) : null;

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors ${
      isLight 
        ? 'bg-[#F8FAFC] text-slate-900 selection:bg-blue-200 selection:text-blue-900' 
        : 'bg-[#0A0A0C] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200'
    }`} dir="rtl">
      {/* Top Navigation Header */}
      <Header
        progress={progress}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onToggleAiMentor={() => setIsAiMentorOpen(prev => !prev)}
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
        isApiKeyConfigured={!!apiKey}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* edX / Coursera Style Accredited Diploma Banner */}
      <DiplomaBanner
        progress={progress}
        onOpenSyllabus={() => setIsSyllabusOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chapters & Lessons Sidebar */}
        <Sidebar
          chapters={allChapters}
          currentChapterId={currentChapterId}
          currentLessonId={currentLessonId}
          progress={progress}
          onSelectLesson={handleSelectLesson}
          onOpenQuiz={(chapterId) => setActiveQuizChapterId(chapterId)}
          searchQuery={searchQuery}
        />

        {/* Core Lesson Display & Code Playground */}
        <LessonView
          lesson={currentLesson}
          chapter={currentChapter}
          isCompleted={progress.completedLessons.includes(currentLesson.id)}
          onToggleComplete={handleToggleCompleteLesson}
          onOpenAiMentor={() => setIsAiMentorOpen(true)}
          onOpenNotes={() => setIsNotesOpen(true)}
          onNextLesson={handleNextLesson}
          onPrevLesson={handlePrevLesson}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      </div>

      {/* Slide-over AI Mentor Drawer */}
      <AiMentorDrawer
        isOpen={isAiMentorOpen}
        onClose={() => setIsAiMentorOpen(false)}
        currentLesson={currentLesson}
        currentChapter={currentChapter}
        apiKey={apiKey}
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
      />

      {/* API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Student Notes Drawer */}
      <StudentNotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        currentLesson={currentLesson}
        currentChapter={currentChapter}
      />

      {/* Diploma Curriculum & Roadmap Modal */}
      <DiplomaSyllabusModal
        isOpen={isSyllabusOpen}
        onClose={() => setIsSyllabusOpen(false)}
        onSelectChapter={(chapterId, lessonId) => {
          setCurrentChapterId(chapterId);
          setCurrentLessonId(lessonId);
          setIsSyllabusOpen(false);
        }}
      />

      {/* Chapter Quiz Assessment Modal */}
      {activeQuizChapter && (
        <QuizModal
          chapter={activeQuizChapter}
          onClose={() => setActiveQuizChapterId(null)}
          onSaveScore={(score, total) => handleSaveQuizScore(activeQuizChapter.id, score, total)}
          initialPassed={progress.completedQuizzes[activeQuizChapter.id]?.passed}
        />
      )}

      {/* GPU & VRAM Memory Budgeter Modal */}
      <VramCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Certificate of Completion Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        progress={progress}
        onSaveName={handleSaveStudentName}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
