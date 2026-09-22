import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  PlusCircle, 
  Search, 
  Calendar, 
  Layers, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  CircleDashed,
  X,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  Assignment, 
  AssignmentDifficulty, 
  AssignmentStatus, 
  AssignmentCategory, 
  Student, 
  Submission, 
  SubmissionStatus, 
  UserRole 
} from '../types';
import { ConfirmModal } from './ConfirmModal';

interface AssignmentsTabProps {
  assignments: Assignment[];
  students: Student[];
  submissions: Submission[];
  classes: string[];
  userRole: UserRole;
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  onUpdateSubmissionStatus: (studentId: string, assignmentId: string, newStatus: SubmissionStatus) => void;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments,
  students,
  submissions,
  classes,
  userRole,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onUpdateSubmissionStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Expanded assignment view for viewing submission breakdown
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTargetClass, setFormTargetClass] = useState('Tất cả các lớp');
  const [formDueDate, setFormDueDate] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<AssignmentDifficulty>('Trung bình');
  const [formStatus, setFormStatus] = useState<AssignmentStatus>('Đang mở');
  const [formCategory, setFormCategory] = useState<AssignmentCategory>('Thực hành');
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchQuery = 
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase().trim());
      
      const matchClass = selectedClass === 'all' || assignment.targetClass === selectedClass || assignment.targetClass === 'Tất cả các lớp';
      const matchStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
      const matchDifficulty = selectedDifficulty === 'all' || assignment.difficulty === selectedDifficulty;

      return matchQuery && matchClass && matchStatus && matchDifficulty;
    });
  }, [assignments, searchQuery, selectedClass, selectedStatus, selectedDifficulty]);

  // Open modal to add
  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setFormTitle('');
    setFormDescription('');
    setFormTargetClass('Tất cả các lớp');
    // Default due date: 7 days from today
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setFormDueDate(nextWeek.toISOString().split('T')[0]);
    setFormDifficulty('Trung bình');
    setFormStatus('Đang mở');
    setFormCategory('Thực hành');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal to edit
  const handleOpenEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormTitle(assignment.title);
    setFormDescription(assignment.description);
    setFormTargetClass(assignment.targetClass);
    setFormDueDate(assignment.dueDate);
    setFormDifficulty(assignment.difficulty);
    setFormStatus(assignment.status);
    setFormCategory(assignment.category);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Vui lòng nhập tên nhiệm vụ / bài tập!');
      return;
    }
    if (!formDueDate) {
      setFormError('Vui lòng chọn hạn hoàn thành!');
      return;
    }

    if (editingAssignment) {
      onUpdateAssignment({
        ...editingAssignment,
        title: formTitle.trim(),
        description: formDescription.trim(),
        targetClass: formTargetClass,
        dueDate: formDueDate,
        difficulty: formDifficulty,
        status: formStatus,
        category: formCategory,
      });
    } else {
      onAddAssignment({
        title: formTitle.trim(),
        description: formDescription.trim(),
        targetClass: formTargetClass,
        dueDate: formDueDate,
        difficulty: formDifficulty,
        status: formStatus,
        category: formCategory,
      });
    }

    setIsModalOpen(false);
  };

  // Get eligible students for an assignment
  const getEligibleStudents = (assignment: Assignment) => {
    if (assignment.targetClass === 'Tất cả các lớp') {
      return students;
    }
    return students.filter(s => s.classId === assignment.targetClass);
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              <span>Giao nhiệm vụ & Bài tập Công nghệ</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi và giao nhiệm vụ thực hành, dự án STEM, bản vẽ kỹ thuật môn Công nghệ
            </p>
          </div>

          <button
            id="create-assignment-btn"
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-500/25 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo nhiệm vụ mới</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="assignment-search-input"
              type="text"
              placeholder="Tìm theo tên nhiệm vụ hoặc nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter by Target Class */}
          <div className="sm:col-span-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả lớp áp dụng</option>
              <option value="Tất cả các lớp">Tất cả các lớp</option>
              {classes.map(cId => (
                <option key={cId} value={cId}>Lớp {cId}</option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang mở">Đang mở</option>
              <option value="Đã đóng">Đã đóng</option>
              <option value="Bản nháp">Bản nháp</option>
            </select>
          </div>

          {/* Filter by Difficulty */}
          <div className="sm:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="Dễ">Dễ</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Nâng cao">Nâng cao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Cards List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Chưa có nhiệm vụ nào phù hợp</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Thầy có thể tạo bài tập mới hoặc thay đổi bộ lọc tìm kiếm ở phía trên.
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const isExpanded = expandedAssignmentId === assignment.id;
            const eligibleStudents = getEligibleStudents(assignment);
            
            // Submissions statistics for this assignment
            const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
            const completedCount = assignmentSubmissions.filter(s => s.status === 'Đã hoàn thành').length;
            const inProgressCount = assignmentSubmissions.filter(s => s.status === 'Đang thực hiện').length;
            const notStartedCount = Math.max(eligibleStudents.length - completedCount - inProgressCount, 0);

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Main Card Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                          {assignment.targetClass}
                        </span>
                        <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {assignment.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                          assignment.difficulty === 'Dễ'
                            ? 'bg-emerald-50 text-emerald-700'
                            : assignment.difficulty === 'Trung bình'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}>
                          Mức độ: {assignment.difficulty}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                          assignment.status === 'Đang mở'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : assignment.status === 'Đã đóng'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {assignment.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 flex-wrap">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Hạn nộp: <strong className="text-slate-800">{assignment.dueDate}</strong></span>
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>Tổng học sinh áp dụng: <strong className="text-slate-800">{eligibleStudents.length} em</strong></span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons on card header */}
                    <div className="flex items-center gap-2 self-end lg:self-start shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(assignment)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAssignmentToDelete(assignment)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>

                  {/* Submission Status Progress Ribbon */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4 flex-wrap text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Đã hoàn thành: {completedCount} em</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Đang thực hiện: {inProgressCount} em</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <CircleDashed className="w-4 h-4 text-slate-400" />
                        <span>Chưa làm: {notStartedCount} em</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedAssignmentId(isExpanded ? null : assignment.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <span>{isExpanded ? 'Thu gọn danh sách học sinh' : 'Xem & cập nhật bài nộp của học sinh'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Student Submission Matrix */}
                {isExpanded && (
                  <div className="bg-slate-50/70 border-t border-slate-200 p-5 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>Trạng thái làm bài của học sinh (Bấm để đổi nhanh trạng thái)</span>
                      </h4>
                      <span className="text-xs text-slate-500 italic">
                        {userRole === 'teacher' ? 'Thầy có thể bấm để cập nhật tiến độ' : 'Góc nhìn học sinh'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {eligibleStudents.map(student => {
                        const submission = submissions.find(
                          s => s.assignmentId === assignment.id && s.studentId === student.id
                        );
                        const status: SubmissionStatus = submission?.status || 'Chưa làm';

                        return (
                          <div
                            key={student.id}
                            className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 text-xs block truncate">
                                {student.name}
                              </span>
                              <span className="text-xs text-slate-400">
                                Lớp {student.classId} • {student.studentCode}
                              </span>
                            </div>

                            {/* Status Quick Switcher Buttons */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => onUpdateSubmissionStatus(student.id, assignment.id, 'Chưa làm')}
                                className={`px-1.5 py-1 text-xs rounded font-medium transition-all ${
                                  status === 'Chưa làm'
                                    ? 'bg-slate-200 text-slate-800 font-bold'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                }`}
                                title="Chưa làm"
                              >
                                Chưa
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateSubmissionStatus(student.id, assignment.id, 'Đang thực hiện')}
                                className={`px-1.5 py-1 text-xs rounded font-medium transition-all ${
                                  status === 'Đang thực hiện'
                                    ? 'bg-amber-100 text-amber-800 font-bold'
                                    : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                }`}
                                title="Đang thực hiện"
                              >
                                Đang
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateSubmissionStatus(student.id, assignment.id, 'Đã hoàn thành')}
                                className={`px-1.5 py-1 text-xs rounded font-medium transition-all ${
                                  status === 'Đã hoàn thành'
                                    ? 'bg-emerald-600 text-white font-bold'
                                    : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                }`}
                                title="Đã hoàn thành"
                              >
                                Xong
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add or Edit Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <span>{editingAssignment ? 'Chỉnh sửa nhiệm vụ' : 'Giao nhiệm vụ / Bài tập mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên nhiệm vụ / Bài tập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lắp ráp mạch điện điều khiển cảm biến ánh sáng"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mô tả chi tiết yêu cầu
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả các bước thực hành, dụng cụ cần chuẩn bị, tiêu chí đánh giá..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Lớp áp dụng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formTargetClass}
                    onChange={(e) => setFormTargetClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Tất cả các lớp">Tất cả các lớp</option>
                    {classes.map(cId => (
                      <option key={cId} value={cId}>Lớp {cId}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hạn hoàn thành <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Thể loại
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as AssignmentCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Thực hành">Thực hành</option>
                    <option value="Bản vẽ kỹ thuật">Bản vẽ kỹ thuật</option>
                    <option value="Dự án STEM">Dự án STEM</option>
                    <option value="Lý thuyết">Lý thuyết</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mức độ
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as AssignmentDifficulty)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nâng cao">Nâng cao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Trạng thái
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as AssignmentStatus)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Đang mở">Đang mở</option>
                    <option value="Đã đóng">Đã đóng</option>
                    <option value="Bản nháp">Bản nháp</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-500/25 transition-all"
                >
                  {editingAssignment ? 'Lưu thay đổi' : 'Tạo nhiệm vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Assignment Modal */}
      <ConfirmModal
        isOpen={Boolean(assignmentToDelete)}
        title="Xác nhận xóa nhiệm vụ"
        message={`Thầy có chắc chắn muốn xóa bài tập "${assignmentToDelete?.title}" không? Hành động này cũng sẽ xóa toàn bộ trạng thái nộp bài của học sinh đối với bài tập này.`}
        confirmText="Xác nhận xóa"
        cancelText="Giữ lại"
        isDanger={true}
        onCancel={() => setAssignmentToDelete(null)}
        onConfirm={() => {
          if (assignmentToDelete) {
            onDeleteAssignment(assignmentToDelete.id);
            setAssignmentToDelete(null);
          }
        }}
      />
    </div>
  );
};
