/**
 * Định nghĩa kiểu dữ liệu cho Web App:
 * THẦY THUẬN CÔNG NGHỆ – QUẢN TRỊ HỌC TẬP
 * Trường THCS THSP Lý Tự Trọng
 */

export type StudentStatus = 'Tích cực' | 'Đạt yêu cầu' | 'Cần cố gắng';

export interface Student {
  id: string;
  name: string;
  classId: string;
  studentCode: string;
  status: StudentStatus;
  avatarColor: string;
  contact?: string;
  notes?: string;
}

export type AssignmentDifficulty = 'Dễ' | 'Trung bình' | 'Nâng cao';
export type AssignmentStatus = 'Đang mở' | 'Đã đóng' | 'Bản nháp';
export type AssignmentCategory = 'Thực hành' | 'Lý thuyết' | 'Dự án STEM' | 'Bản vẽ kỹ thuật';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  targetClass: string; // Tên lớp hoặc 'Tất cả các lớp'
  dueDate: string; // ISO date string YYYY-MM-DD
  difficulty: AssignmentDifficulty;
  status: AssignmentStatus;
  category: AssignmentCategory;
  createdAt: string;
}

export type SubmissionStatus = 'Chưa làm' | 'Đang thực hiện' | 'Đã hoàn thành';
export type EvaluationGrade = 'Hoàn thành tốt' | 'Đạt yêu cầu' | 'Cần rèn luyện' | 'Chưa đánh giá';

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  status: SubmissionStatus;
  score?: number | null; // Điểm số thang 10
  evaluation?: EvaluationGrade;
  teacherFeedback?: string; // Nhận xét của Thầy Thuận
  submittedAt?: string;
}

export type AnnouncementPriority = 'Bình thường' | 'Quan trọng' | 'Khẩn cấp / Nhắc nhở';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: string; // 'Toàn trường' | 'Khối 6' | 'Lớp 8A1' ...
  priority: AnnouncementPriority;
  postedDate: string;
  author: string;
  readByStudent: boolean;
}

export type ActiveTab = 'dashboard' | 'students' | 'assignments' | 'results' | 'announcements';

export type UserRole = 'teacher' | 'student';

export interface Lesson {
  id: string;
  order: number;
  title: string;
  grade: string;
  chapter: string;
  durationPeriods: number;
  objectives: string;
  practicalWork: string;
}
