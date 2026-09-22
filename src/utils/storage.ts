import { Student, Assignment, Submission, Announcement, Lesson } from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_LESSONS
} from '../data/initialData';

const STORAGE_KEYS = {
  STUDENTS: 'thaythuan_lms_students_v2',
  ASSIGNMENTS: 'thaythuan_lms_assignments_v2',
  SUBMISSIONS: 'thaythuan_lms_submissions_v2',
  ANNOUNCEMENTS: 'thaythuan_lms_announcements_v2',
  LESSONS: 'thaythuan_lms_lessons_v2',
  SOUND_ENABLED: 'thaythuan_lms_sound_v2',
  ROLE: 'thaythuan_lms_role_v2',
  CURRENT_STUDENT_ID: 'thaythuan_lms_current_student_v2',
};

export const storage = {
  getStudents: (): Student[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },
  saveStudents: (students: Student[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students:', e);
    }
  },

  getLessons: (): Lesson[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
      return data ? JSON.parse(data) : INITIAL_LESSONS;
    } catch {
      return INITIAL_LESSONS;
    }
  },
  saveLessons: (lessons: Lesson[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    } catch (e) {
      console.error('Failed to save lessons:', e);
    }
  },

  getAssignments: (): Assignment[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return data ? JSON.parse(data) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  },
  saveAssignments: (assignments: Assignment[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch (e) {
      console.error('Failed to save assignments:', e);
    }
  },

  getSubmissions: (): Submission[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return data ? JSON.parse(data) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },
  saveSubmissions: (submissions: Submission[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.error('Failed to save submissions:', e);
    }
  },

  getAnnouncements: (): Announcement[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return data ? JSON.parse(data) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  },
  saveAnnouncements: (announcements: Announcement[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch (e) {
      console.error('Failed to save announcements:', e);
    }
  },

  getSoundEnabled: (): boolean => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return data !== null ? JSON.parse(data) : false;
    } catch {
      return false;
    }
  },
  saveSoundEnabled: (enabled: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(enabled));
    } catch (e) {
      console.error('Failed to save sound preference:', e);
    }
  },

  resetAllToDefault: () => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    } catch (e) {
      console.error('Failed to reset storage:', e);
    }
  }
};
