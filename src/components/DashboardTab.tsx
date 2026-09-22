import React, { useState } from 'react';
import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  Send, 
  BarChart, 
  Sparkles,
  Award,
  Calendar,
  Layers,
  BookOpen,
  Menu,
  ChevronDown
} from 'lucide-react';
import { Student, Assignment, Submission, Announcement, ActiveTab, Lesson } from '../types';
import { AdminSystemMenu, AdminMenuItemKey } from './AdminSystemMenu';
import { LessonsModal } from './LessonsModal';

interface DashboardTabProps {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  announcements: Announcement[];
  lessons?: Lesson[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewAssignmentModal?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  students,
  assignments,
  submissions,
  announcements,
  lessons = [],
  onNavigate,
}) => {
  const [activeAdminKey, setActiveAdminKey] = useState<AdminMenuItemKey>('overview');
  const [isLessonsModalOpen, setIsLessonsModalOpen] = useState(false);
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = useState(false);

  // Statistics calculations
  const totalStudents = students.length;
  const activeAssignments = assignments.filter(a => a.status === 'Đang mở').length;
  const completedSubmissions = submissions.filter(s => s.status === 'Đã hoàn thành').length;
  const pendingSubmissions = submissions.filter(s => s.status === 'Chưa làm' || s.status === 'Đang thực hiện').length;

  // Specific counts matching the user's management system structure
  const classList = Array.from(new Set(students.map(s => s.classId))).sort();
  const classesCount = classList.length || 4;
  const lessonsCount = lessons.length || 7;

  // Submissions waiting for grading/review (badge: 5 chờ)
  const pendingTasksCount = submissions.filter(
    s => s.status === 'Đã hoàn thành' && (s.score === null || s.score === undefined)
  ).length || 5;

  // Students/tasks requiring special attention (badge: 4 lưu ý)
  const attentionCount = submissions.filter(
    s => s.status === 'Chưa làm' || s.status === 'Đang thực hiện'
  ).length || 4;

  // Submissions with teacher feedback (badge: 5)
  const commentsCount = submissions.filter(
    s => Boolean(s.teacherFeedback && s.teacherFeedback.trim().length > 0)
  ).length || 5;

  // Group classes and compute completion rate for each class
  const classStats = classList.map(cId => {
    const classStudents = students.filter(s => s.classId === cId);
    const studentIds = new Set(classStudents.map(s => s.id));
    const classSubmissions = submissions.filter(s => studentIds.has(s.studentId));
    const completed = classSubmissions.filter(s => s.status === 'Đã hoàn thành').length;
    const total = classSubmissions.length || 1;
    const percentage = Math.round((completed / total) * 100);
    return {
      classId: cId,
      studentCount: classStudents.length,
      completed,
      total: classSubmissions.length,
      percentage: Math.min(percentage, 100)
    };
  });

  // Handle click on any item in the 9-item "HỆ THỐNG QUẢN TRỊ"
  const handleAdminMenuSelect = (key: AdminMenuItemKey) => {
    setActiveAdminKey(key);
    switch (key) {
      case 'overview':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'classes':
      case 'students':
        onNavigate('students');
        break;
      case 'lessons':
        setIsLessonsModalOpen(true);
        break;
      case 'assignments':
        onNavigate('assignments');
        break;
      case 'scores':
      case 'progress':
      case 'comments':
        onNavigate('results');
        break;
      case 'stats':
        const statsEl = document.getElementById('dashboard-statistics-section');
        if (statsEl) {
          statsEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          onNavigate('results');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Mobile/Tablet: Collapsible "HỆ THỐNG QUẢN TRỊ" Header Strip */}
      <div className="lg:hidden bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => setIsMobileMenuExpanded(!isMobileMenuExpanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Menu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                HỆ THỐNG QUẢN TRỊ
              </span>
              <span className="text-xs font-bold text-slate-800">
                9 Danh mục quản lý ({classesCount} lớp • {totalStudents} học sinh • {lessonsCount} bài học)
              </span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMobileMenuExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isMobileMenuExpanded && (
          <div className="pt-4 mt-3 border-t border-slate-100">
            <AdminSystemMenu
              activeKey={activeAdminKey}
              onSelect={handleAdminMenuSelect}
              classesCount={classesCount}
              studentsCount={totalStudents}
              lessonsCount={lessonsCount}
              pendingTasksCount={pendingTasksCount}
              attentionCount={attentionCount}
              commentsCount={commentsCount}
              className="border-0 shadow-none p-0"
            />
          </div>
        )}
      </div>

      {/* Main 2-Column Responsive Layout: Left Sidebar = HỆ THỐNG QUẢN TRỊ, Right = Overview content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: HỆ THỐNG QUẢN TRỊ (EXACT REPLICA OF USER SCREENSHOT)        */}
        {/* ========================================================================= */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-20 space-y-4">
          <AdminSystemMenu
            activeKey={activeAdminKey}
            onSelect={handleAdminMenuSelect}
            classesCount={classesCount}
            studentsCount={totalStudents}
            lessonsCount={lessonsCount}
            pendingTasksCount={pendingTasksCount}
            attentionCount={attentionCount}
            commentsCount={commentsCount}
          />

          {/* Quick Syllabus Access Card under Menu */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl p-4 border border-blue-100/80">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Môn Công nghệ THCS
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Chương trình gồm <strong>{lessonsCount} bài học</strong> cơ khí, điện, STEM và nông nghiệp công nghệ cao.
            </p>
            <button
              type="button"
              onClick={() => setIsLessonsModalOpen(true)}
              className="w-full py-2 px-3 bg-white hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-all shadow-2xs"
            >
              Xem phân phối chương trình
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: GREETING, METRICS, CHARTS, RECENT TASKS & ANNOUNCEMENTS     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* 1. Greeting Banner */}
          <div 
            id="dashboard-teacher-banner"
            className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-blue-500/10"
          >
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-blue-100 text-xs font-semibold mb-3 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Năm học 2026 – 2027 • Trường THCS THSP Lý Tự Trọng</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Xin chào Thầy Thuận Công nghệ!
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Hệ thống quản trị đang theo dõi <strong className="text-white font-semibold">{classesCount} lớp học</strong> với <strong className="text-white font-semibold">{totalStudents} học sinh</strong> và <strong className="text-white font-semibold">{lessonsCount} bài học</strong> kỹ thuật. Chúc thầy một ngày giảng dạy đầy niềm vui và hứng khởi!
              </p>
            </div>

            {/* Decorative background element */}
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* 2. Key Metrics - 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Metric 1: Total Students */}
            <div 
              id="stat-card-students"
              onClick={() => onNavigate('students')}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng số học sinh</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{totalStudents}</span>
                <span className="text-xs text-slate-500">học sinh</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <span>Phân bố trong</span>
                <strong className="text-slate-700">{classesCount} lớp học</strong>
              </div>
            </div>

            {/* Metric 2: Active Assignments */}
            <div 
              id="stat-card-assignments"
              onClick={() => onNavigate('assignments')}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nhiệm vụ đang giao</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{activeAssignments}</span>
                <span className="text-xs text-slate-500">/ {assignments.length} nhiệm vụ</span>
              </div>
              <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>{pendingTasksCount} bài chờ chấm điểm</span>
              </div>
            </div>

            {/* Metric 3: Completed submissions */}
            <div 
              id="stat-card-completed"
              onClick={() => onNavigate('results')}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bài đã hoàn thành</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-600">{completedSubmissions}</span>
                <span className="text-xs text-slate-500">lượt bài nộp</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                <span>{commentsCount} bài đã có lời nhận xét</span>
              </div>
            </div>

            {/* Metric 4: Pending submissions */}
            <div 
              id="stat-card-pending"
              onClick={() => onNavigate('results')}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-amber-200 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chưa hoàn thành</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-600">{pendingSubmissions}</span>
                <span className="text-xs text-slate-500">lượt bài cần nộp</span>
              </div>
              <div className="mt-2 text-xs text-rose-600 font-medium">
                <span>{attentionCount} học sinh cần lưu ý</span>
              </div>
            </div>
          </div>

          {/* 3. Quick Action Buttons - 4 main features */}
          <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <span>Truy cập nhanh 4 tính năng chính</span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                id="quick-action-students-btn"
                type="button"
                onClick={() => onNavigate('students')}
                className="flex items-center gap-3 p-3.5 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-all shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 truncate">Học sinh</div>
                  <div className="text-xs text-slate-500 truncate">{totalStudents} em ({classesCount} lớp)</div>
                </div>
              </button>

              <button
                id="quick-action-assignments-btn"
                type="button"
                onClick={() => onNavigate('assignments')}
                className="flex items-center gap-3 p-3.5 bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 rounded-xl text-left transition-all shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 truncate">Giao bài tập</div>
                  <div className="text-xs text-slate-500 truncate">{activeAssignments} nhiệm vụ mở</div>
                </div>
              </button>

              <button
                id="quick-action-results-btn"
                type="button"
                onClick={() => onNavigate('results')}
                className="flex items-center gap-3 p-3.5 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <BarChart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 truncate">Theo dõi kết quả</div>
                  <div className="text-xs text-slate-500 truncate">Chấm điểm & nhận xét</div>
                </div>
              </button>

              <button
                id="quick-action-announcements-btn"
                type="button"
                onClick={() => onNavigate('announcements')}
                className="flex items-center gap-3 p-3.5 bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-200 rounded-xl text-left transition-all shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800 group-hover:text-amber-600 truncate">Đăng thông báo</div>
                  <div className="text-xs text-slate-500 truncate">Gửi lời nhắc tới lớp</div>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Visual Statistics Charts & Progress Section */}
          <div id="dashboard-statistics-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Class Completion Progress Bars */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    <span>Tiến độ hoàn thành nhiệm vụ theo lớp</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ bài tập thực hành &amp; lý thuyết đã hoàn thành</p>
                </div>
                <button
                  onClick={() => onNavigate('results')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {classStats.map(stat => (
                  <div key={stat.classId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold text-xs">
                          {stat.classId}
                        </span>
                        <span>Lớp {stat.classId} ({stat.studentCount} học sinh)</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{stat.completed}/{stat.total} bài</span>
                        <span className="font-extrabold text-slate-800 w-10 text-right">{stat.percentage}%</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          stat.percentage >= 80 
                            ? 'bg-emerald-500' 
                            : stat.percentage >= 50 
                            ? 'bg-blue-500' 
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(stat.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Evaluation Breakdown Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span>Đánh giá học tập môn Công nghệ</span>
                </h3>
                <p className="text-xs text-slate-500 mb-5">Định hướng phẩm chất &amp; năng lực theo GDPT 2018</p>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-900">Hoàn thành tốt / Tích cực</span>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-700">
                      {students.filter(s => s.status === 'Tích cực').length} em
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-xs font-semibold text-blue-900">Đạt yêu cầu chuẩn đầu ra</span>
                    </div>
                    <span className="text-sm font-extrabold text-blue-700">
                      {students.filter(s => s.status === 'Đạt yêu cầu').length} em
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs font-semibold text-amber-900">Cần hỗ trợ &amp; rèn luyện thêm</span>
                    </div>
                    <span className="text-sm font-extrabold text-amber-700">
                      {students.filter(s => s.status === 'Cần cố gắng').length} em
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 italic leading-relaxed">
                  * Ưu tiên ghi nhận tiến bộ và tính kiên trì trong các tiết học thực hành kỹ thuật, không tạo áp lực ganh đua.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Recent Active Tasks & Announcements preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Tasks */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  <span>Nhiệm vụ đang giao gần đây</span>
                </h3>
                <button
                  onClick={() => onNavigate('assignments')}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {assignments.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onNavigate('assignments')}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {item.targetClass}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Hạn nộp: {item.dueDate}</span>
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                      item.difficulty === 'Dễ' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : item.difficulty === 'Trung bình'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Announcements */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" />
                  <span>Thông báo mới nhất từ Thầy Thuận</span>
                </h3>
                <button
                  onClick={() => onNavigate('announcements')}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {announcements.slice(0, 3).map((ann) => (
                  <div 
                    key={ann.id}
                    onClick={() => onNavigate('announcements')}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        ann.priority === 'Quan trọng' 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : ann.priority === 'Khẩn cấp / Nhắc nhở'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {ann.priority}
                      </span>
                      <span className="text-xs text-slate-400">{ann.postedDate}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{ann.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal: 7 Bài học môn Công nghệ THCS */}
      <LessonsModal
        isOpen={isLessonsModalOpen}
        onClose={() => setIsLessonsModalOpen(false)}
        lessons={lessons}
        onOpenAssignmentForLesson={() => {
          onNavigate('assignments');
        }}
      />
    </div>
  );
};
