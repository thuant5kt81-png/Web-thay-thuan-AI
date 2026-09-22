/**
 * THẦY THUẬN CÔNG NGHỆ – QUẢN TRỊ HỌC TẬP
 * Đơn vị: Trường THCS THSP Lý Tự Trọng
 * Dành cho giáo viên và học sinh THCS
 */

import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { StudentsTab } from './components/StudentsTab';
import { AssignmentsTab } from './components/AssignmentsTab';
import { ResultsTab } from './components/ResultsTab';
import { AnnouncementsTab } from './components/AnnouncementsTab';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
  ActiveTab, 
  UserRole, 
  Student, 
  Assignment, 
  Submission, 
  Announcement, 
  SubmissionStatus,
  Lesson 
} from './types';
import { storage } from './utils/storage';
import { soundManager } from './utils/sound';

export default function App() {
  // Navigation & Role states
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => storage.getSoundEnabled());

  // Data states from localStorage
  const [students, setStudents] = useState<Student[]>(() => storage.getStudents());
  const [lessons, setLessons] = useState<Lesson[]>(() => storage.getLessons());
  const [assignments, setAssignments] = useState<Assignment[]>(() => storage.getAssignments());
  const [submissions, setSubmissions] = useState<Submission[]>(() => storage.getSubmissions());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => storage.getAnnouncements());

  // Toast feedback state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Reset confirmation modal state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Available classes computed dynamically
  const classes = Array.from(new Set(students.map(s => s.classId))).sort();

  // Helper to add toast
  const addToast = useCallback((message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Sync state changes with localStorage
  useEffect(() => {
    storage.saveStudents(students);
  }, [students]);

  useEffect(() => {
    storage.saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    storage.saveSubmissions(submissions);
  }, [submissions]);

  useEffect(() => {
    storage.saveAnnouncements(announcements);
  }, [announcements]);

  useEffect(() => {
    storage.saveSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Tab change handler with gentle sound tap
  const handleTabChange = (tab: ActiveTab) => {
    soundManager.playTap(soundEnabled);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sound toggle handler
  const handleSoundToggle = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      soundManager.playSuccess(true);
      addToast('Đã bật âm thanh phản hồi nhẹ nhàng', 'info');
    } else {
      addToast('Đã tắt âm thanh', 'info');
    }
  };

  // Role toggle handler
  const handleRoleToggle = () => {
    soundManager.playTap(soundEnabled);
    const newRole: UserRole = userRole === 'teacher' ? 'student' : 'teacher';
    setUserRole(newRole);
    addToast(
      newRole === 'teacher' 
        ? 'Đã chuyển về Chế độ Quản trị (Thầy Thuận)' 
        : 'Đã chuyển sang Chế độ Học sinh (Xem giao diện học sinh)',
      'info'
    );
  };

  // Reset to default sample data
  const handleConfirmReset = () => {
    storage.resetAllToDefault();
    setStudents(storage.getStudents());
    setLessons(storage.getLessons());
    setAssignments(storage.getAssignments());
    setSubmissions(storage.getSubmissions());
    setAnnouncements(storage.getAnnouncements());
    setIsResetConfirmOpen(false);
    soundManager.playSuccess(soundEnabled);
    addToast('Đã khôi phục toàn bộ dữ liệu mẫu ban đầu thành công!', 'success');
  };

  // --- Student operations ---
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'avatarColor'>) => {
    const avatarColors = [
      'bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-teal-600', 
      'bg-purple-600', 'bg-rose-600', 'bg-amber-600', 'bg-sky-600'
    ];
    const newStudent: Student = {
      ...studentData,
      id: 'hs-' + Date.now(),
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)]
    };
    setStudents(prev => [newStudent, ...prev]);
    soundManager.playSuccess(soundEnabled);
    addToast(`Đã thêm học sinh ${newStudent.name} (Lớp ${newStudent.classId}) thành công!`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    soundManager.playSuccess(soundEnabled);
    addToast(`Đã cập nhật thông tin học sinh ${updatedStudent.name}!`);
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    // Also remove related submissions
    setSubmissions(prev => prev.filter(s => s.studentId !== id));
    soundManager.playWarning(soundEnabled);
    addToast(`Đã xóa học sinh ${student?.name || ''} khỏi danh sách.`, 'warning');
  };

  // --- Assignment operations ---
  const handleAddAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: 'bt-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => [newAssignment, ...prev]);
    soundManager.playSuccess(soundEnabled);
    addToast(`Đã tạo nhiệm vụ "${newAssignment.title}" thành công!`);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(prev => prev.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
    soundManager.playSuccess(soundEnabled);
    addToast(`Đã cập nhật nhiệm vụ "${updatedAssignment.title}"!`);
  };

  const handleDeleteAssignment = (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    setAssignments(prev => prev.filter(a => a.id !== id));
    setSubmissions(prev => prev.filter(s => s.assignmentId !== id));
    soundManager.playWarning(soundEnabled);
    addToast(`Đã xóa nhiệm vụ "${assignment?.title || ''}".`, 'warning');
  };

  // Update submission status directly
  const handleUpdateSubmissionStatus = (studentId: string, assignmentId: string, newStatus: SubmissionStatus) => {
    setSubmissions(prev => {
      const existingIndex = prev.findIndex(s => s.studentId === studentId && s.assignmentId === assignmentId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status: newStatus,
          submittedAt: newStatus === 'Đã hoàn thành' ? new Date().toISOString().split('T')[0] : updated[existingIndex].submittedAt
        };
        return updated;
      } else {
        const newSubmission: Submission = {
          id: 'sub-' + Date.now() + Math.random().toString(),
          studentId,
          assignmentId,
          status: newStatus,
          score: null,
          evaluation: 'Chưa đánh giá',
          submittedAt: newStatus === 'Đã hoàn thành' ? new Date().toISOString().split('T')[0] : undefined
        };
        return [...prev, newSubmission];
      }
    });
    soundManager.playTap(soundEnabled);
    addToast(`Đã cập nhật tiến độ bài tập sang: ${newStatus}`, 'info');
  };

  // --- Results / Grading operations ---
  const handleSaveResult = (submissionData: Partial<Submission> & { studentId: string; assignmentId: string }) => {
    setSubmissions(prev => {
      const existingIndex = prev.findIndex(
        s => s.studentId === submissionData.studentId && s.assignmentId === submissionData.assignmentId
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...submissionData,
          status: submissionData.status || updated[existingIndex].status,
        };
        return updated;
      } else {
        const newSub: Submission = {
          id: 'sub-' + Date.now(),
          studentId: submissionData.studentId,
          assignmentId: submissionData.assignmentId,
          status: submissionData.status || 'Đã hoàn thành',
          score: submissionData.score ?? null,
          evaluation: submissionData.evaluation || 'Đạt yêu cầu',
          teacherFeedback: submissionData.teacherFeedback || '',
          submittedAt: submissionData.submittedAt || new Date().toISOString().split('T')[0]
        };
        return [...prev, newSub];
      }
    });
    soundManager.playSuccess(soundEnabled);
    addToast('Đã lưu điểm số và lời nhận xét đánh giá thành công!');
  };

  // --- Announcement operations ---
  const handleAddAnnouncement = (announcementData: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...announcementData,
      id: 'tb-' + Date.now(),
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    soundManager.playSuccess(soundEnabled);
    addToast(`Đã đăng thông báo mới: "${newAnn.title}"!`);
  };

  const handleUpdateAnnouncement = (updatedAnn: Announcement) => {
    setAnnouncements(prev => prev.map(a => a.id === updatedAnn.id ? updatedAnn : a));
    soundManager.playSuccess(soundEnabled);
    addToast(`Đã cập nhật thông báo "${updatedAnn.title}"!`);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const ann = announcements.find(a => a.id === id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    soundManager.playWarning(soundEnabled);
    addToast(`Đã xóa thông báo "${ann?.title || ''}".`, 'warning');
  };

  const handleToggleReadAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, readByStudent: !a.readByStudent } : a));
    soundManager.playTap(soundEnabled);
  };

  // Counts for badges
  const unreadAnnouncementsCount = announcements.filter(a => !a.readByStudent).length;
  const activeAssignmentsCount = assignments.filter(a => a.status === 'Đang mở').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. Header Navigation Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole={userRole}
        onRoleToggle={handleRoleToggle}
        soundEnabled={soundEnabled}
        onSoundToggle={handleSoundToggle}
        onResetData={() => setIsResetConfirmOpen(true)}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
        totalStudentsCount={students.length}
        activeAssignmentsCount={activeAssignmentsCount}
      />

      {/* 2. Main Tab View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Student View Banner notice if active */}
        {userRole === 'student' && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                <strong>Đang ở Chế độ Xem của Học sinh:</strong> Giao diện hiển thị trực quan nhiệm vụ, bảng tin và kết quả dành cho học sinh THCS theo dõi bài học.
              </span>
            </div>
            <button
              onClick={handleRoleToggle}
              className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-50"
            >
              Trở về góc nhìn Thầy Thuận
            </button>
          </div>
        )}

        {/* Tab 1: Tổng quan (Dashboard) */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            students={students}
            assignments={assignments}
            submissions={submissions}
            announcements={announcements}
            lessons={lessons}
            onNavigate={handleTabChange}
          />
        )}

        {/* Tab 2: Quản lý học sinh */}
        {activeTab === 'students' && (
          <StudentsTab
            students={students}
            submissions={submissions}
            classes={classes.length > 0 ? classes : ['6A1', '7A1', '8A1', '9A1']}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Tab 3: Giao nhiệm vụ / Bài tập */}
        {activeTab === 'assignments' && (
          <AssignmentsTab
            assignments={assignments}
            students={students}
            submissions={submissions}
            classes={classes.length > 0 ? classes : ['6A1', '7A1', '8A1', '9A1']}
            userRole={userRole}
            onAddAssignment={handleAddAssignment}
            onUpdateAssignment={handleUpdateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
          />
        )}

        {/* Tab 4: Theo dõi kết quả học tập */}
        {activeTab === 'results' && (
          <ResultsTab
            students={students}
            assignments={assignments}
            submissions={submissions}
            classes={classes.length > 0 ? classes : ['6A1', '7A1', '8A1', '9A1']}
            onSaveResult={handleSaveResult}
          />
        )}

        {/* Tab 5: Thông báo */}
        {activeTab === 'announcements' && (
          <AnnouncementsTab
            announcements={announcements}
            classes={classes.length > 0 ? classes : ['6A1', '7A1', '8A1', '9A1']}
            userRole={userRole}
            onAddAnnouncement={handleAddAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onToggleRead={handleToggleReadAnnouncement}
          />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-700">
            THẦY THUẬN CÔNG NGHỆ – QUẢN TRỊ HỌC TẬP • Trường THCS THSP Lý Tự Trọng
          </p>
          <p className="text-slate-400">
            Ứng dụng hỗ trợ giảng dạy môn Công nghệ THCS • Hoạt động ngoại tuyến &amp; lưu trữ tự động
          </p>
        </div>
      </footer>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Reset confirmation modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Khôi phục dữ liệu mẫu ban đầu?"
        message="Toàn bộ thông tin học sinh, nhiệm vụ, kết quả và thông báo sẽ được đặt lại về dữ liệu mặc định chuẩn của Thầy Thuận Công nghệ. Hành động này không thể hoàn tác."
        confirmText="Đồng ý khôi phục"
        cancelText="Hủy"
        isDanger={true}
        onCancel={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
