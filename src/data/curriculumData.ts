import { Chapter, Lesson } from '../types';
import { chaptersPart1 } from './chaptersPart1';
import { chaptersPart2 } from './chaptersPart2';
import { chaptersPart3 } from './chaptersPart3';

export const allChapters: Chapter[] = [
  ...chaptersPart1,
  ...chaptersPart2,
  ...chaptersPart3
];

export function getLessonById(lessonId: string): { lesson: Lesson; chapter: Chapter } | null {
  for (const chapter of allChapters) {
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    if (lesson) {
      return { lesson, chapter };
    }
  }
  return null;
}

export function getChapterById(chapterId: number): Chapter | undefined {
  return allChapters.find(c => c.id === chapterId);
}

export function getTotalCurriculumStats() {
  let totalLessons = 0;
  let totalHours = 0;
  let totalQuizzes = 0;

  for (const chapter of allChapters) {
    totalLessons += chapter.lessons.length;
    totalHours += chapter.estimatedHours;
    totalQuizzes += chapter.quiz.length;
  }

  return {
    totalChapters: allChapters.length,
    totalLessons,
    totalHours,
    totalQuizzes
  };
}
