import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  LayoutGrid, 
  List, 
  X,
  Phone,
  FileText
} from 'lucide-react';
import { Student, StudentStatus, Submission } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface StudentsTabProps {
  students: Student[];
  submissions: Submission[];
  classes: string[];
  onAddStudent: (student: Omit<Student, 'id' | 'avatarColor'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  soundEnabled: boolean;
}

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-purple-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-sky-600'
];

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  submissions,
  classes,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formClassId, setFormClassId] = useState(classes[0] || '8A1');
  const [formStudentCode, setFormStudentCode] = useState('');
  const [formStatus, setFormStatus] = useState<StudentStatus>('Tích cực');
  const [formContact, setFormContact] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Delete confirm modal state
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchQuery = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        student.studentCode.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        student.classId.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchClass = selectedClass === 'all' || student.classId === selectedClass;
      const matchStatus = selectedStatus === 'all' || student.status === selectedStatus;

      return matchQuery && matchClass && matchStatus;
    });
  }, [students, searchQuery, selectedClass, selectedStatus]);

  // Open modal for adding
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormName('');
    setFormClassId(classes[0] || '8A1');
    const randomNum = Math.floor(10 + Math.random() * 90);
    setFormStudentCode(`HS${(classes[0] || '8A1').replace(/[^0-9]/g, '')}-${randomNum}`);
    setFormStatus('Đạt yêu cầu');
    setFormContact('');
    setFormNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.name);
    setFormClassId(student.classId);
    setFormStudentCode(student.studentCode);
    setFormStatus(student.status);
    setFormContact(student.contact || '');
    setFormNotes(student.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Vui lòng nhập họ và tên học sinh!');
      return;
    }
    if (!formStudentCode.trim()) {
      setFormError('Vui lòng nhập mã học sinh!');
      return;
    }

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        name: formName.trim(),
        classId: formClassId,
        studentCode: formStudentCode.trim(),
        status: formStatus,
        contact: formContact.trim(),
        notes: formNotes.trim(),
      });
    } else {
      onAddStudent({
        name: formName.trim(),
        classId: formClassId,
        studentCode: formStudentCode.trim(),
        status: formStatus,
        contact: formContact.trim(),
        notes: formNotes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  // Submission count helper
  const getStudentStats = (studentId: string) => {
    const studentSubmissions = submissions.filter(s => s.studentId === studentId);
    const completed = studentSubmissions.filter(s => s.status === 'Đã hoàn thành').length;
    return {
      completed,
      total: studentSubmissions.length
    };
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span>Quản lý học sinh THCS</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Danh sách học sinh các lớp phụ trách môn Công nghệ • Trường THCS THSP Lý Tự Trọng
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Table / Cards */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                id="toggle-view-table-btn"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Xem dạng bảng danh sách"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Dạng bảng</span>
              </button>
              <button
                type="button"
                id="toggle-view-cards-btn"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'cards' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Xem dạng thẻ học sinh"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Dạng thẻ</span>
              </button>
            </div>

            {/* Add Student Button */}
            <button
              id="add-student-btn"
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-500/25 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="student-search-input"
              type="text"
              placeholder="Tìm theo họ tên, mã học sinh, lớp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
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

          {/* Filter by Class */}
          <div className="sm:col-span-3">
            <select
              id="student-class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả các lớp ({students.length})</option>
              {classes.map(cId => {
                const count = students.filter(s => s.classId === cId).length;
                return (
                  <option key={cId} value={cId}>Lớp {cId} ({count} em)</option>
                );
              })}
            </select>
          </div>

          {/* Filter by Status */}
          <div className="sm:col-span-3">
            <select
              id="student-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Tích cực">Tích cực</option>
              <option value="Đạt yêu cầu">Đạt yêu cầu</option>
              <option value="Cần cố gắng">Cần cố gắng</option>
            </select>
          </div>
        </div>

        {/* Filter stats bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
          <span>
            Tìm thấy <strong className="text-slate-800">{filteredStudents.length}</strong> học sinh
          </span>
          {(searchQuery || selectedClass !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedClass('all');
                setSelectedStatus('all');
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Student List View */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Không tìm thấy học sinh nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Không có kết quả phù hợp với từ khóa hoặc bộ lọc đã chọn. Hãy thử tìm kiếm với thông tin khác hoặc thêm học sinh mới.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" id="students-table">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-14 text-center">STT</th>
                  <th className="py-3.5 px-4">Họ và tên</th>
                  <th className="py-3.5 px-4">Mã học sinh</th>
                  <th className="py-3.5 px-4">Lớp</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Tiến độ bài</th>
                  <th className="py-3.5 px-4">Ghi chú của thầy</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student, index) => {
                  const stats = getStudentStats(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4 text-center text-xs font-bold text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${student.avatarColor || 'bg-blue-600'} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}>
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{student.name}</span>
                            {student.contact && (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {student.contact}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-600">
                        {student.studentCode}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200/60">
                          {student.classId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          student.status === 'Tích cực'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : student.status === 'Đạt yêu cầu'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xs font-semibold text-slate-700">
                          {stats.completed}/{stats.total} bài
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-xs text-slate-500">
                        {student.notes || <span className="text-slate-300 italic">Chưa có</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa thông tin học sinh"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setStudentToDelete(student)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa học sinh này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="students-cards-container">
          {filteredStudents.map((student, index) => {
            const stats = getStudentStats(student.id);
            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl ${student.avatarColor || 'bg-blue-600'} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{student.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs text-slate-500 font-semibold">{student.studentCode}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            Lớp {student.classId}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-slate-300">#{index + 1}</span>
                  </div>

                  <div className="space-y-2 py-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Trạng thái học tập:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                        student.status === 'Tích cực'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : student.status === 'Đạt yêu cầu'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {student.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Bài tập hoàn thành:</span>
                      <span className="font-bold text-slate-700">{stats.completed}/{stats.total} bài</span>
                    </div>

                    {student.notes && (
                      <div className="pt-1 text-slate-600 bg-slate-50 p-2 rounded-lg text-xs leading-relaxed">
                        <span className="font-semibold text-slate-700 block mb-0.5 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-slate-400" />
                          Ghi chú:
                        </span>
                        {student.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(student)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentToDelete(student)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add or Edit Student */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{editingStudent ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Họ và tên học sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Lớp <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {classes.map(cId => (
                      <option key={cId} value={cId}>Lớp {cId}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mã học sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: HS801-15"
                    value={formStudentCode}
                    onChange={(e) => setFormStudentCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Trạng thái học tập
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as StudentStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tích cực">Tích cực (Hoàn thành bài sớm, nhiệt tình)</option>
                  <option value="Đạt yêu cầu">Đạt yêu cầu (Đúng tiến độ)</option>
                  <option value="Cần cố gắng">Cần cố gắng (Cần thầy hỗ trợ thêm)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Liên hệ phụ huynh (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: PH: 0912.xxx.xxx"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ghi chú của Thầy Thuận (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Nắm chắc kỹ thuật hàn mạch, chăm chỉ..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Student Deletion */}
      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        title="Xác nhận xóa học sinh"
        message={`Thầy có chắc chắn muốn xóa học sinh "${studentToDelete?.name}" (${studentToDelete?.studentCode} - Lớp ${studentToDelete?.classId}) khỏi danh sách lớp học môn Công nghệ không?`}
        confirmText="Xác nhận xóa"
        cancelText="Giữ lại"
        isDanger={true}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={() => {
          if (studentToDelete) {
            onDeleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }
        }}
      />
    </div>
  );
};
