import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Search, 
  CheckCircle2, 
  Clock, 
  CircleDashed, 
  Award, 
  Edit3, 
  X, 
  MessageSquare,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Student, Assignment, Submission, SubmissionStatus, EvaluationGrade } from '../types';

interface ResultsTabProps {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  classes: string[];
  onSaveResult: (submission: Partial<Submission> & { studentId: string; assignmentId: string }) => void;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({
  students,
  assignments,
  submissions,
  classes,
  onSaveResult,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Grading Modal
  const [gradingModalData, setGradingModalData] = useState<{
    student: Student;
    assignment: Assignment;
    submission?: Submission;
  } | null>(null);

  const [scoreInput, setScoreInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<SubmissionStatus>('Đã hoàn thành');
  const [evaluationInput, setEvaluationInput] = useState<EvaluationGrade>('Đạt yêu cầu');
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // Overall Statistics for this view
  const overallStats = useMemo(() => {
    let completedCount = 0;
    let inProgressCount = 0;
    let notStartedCount = 0;
    let totalAssignmentsAssigned = 0;

    students.forEach(student => {
      // Find eligible assignments for student
      const eligible = assignments.filter(
        a => a.targetClass === 'Tất cả các lớp' || a.targetClass === student.classId
      );
      totalAssignmentsAssigned += eligible.length;

      eligible.forEach(assignment => {
        const sub = submissions.find(
          s => s.studentId === student.id && s.assignmentId === assignment.id
        );
        if (!sub || sub.status === 'Chưa làm') {
          notStartedCount++;
        } else if (sub.status === 'Đang thực hiện') {
          inProgressCount++;
        } else if (sub.status === 'Đã hoàn thành') {
          completedCount++;
        }
      });
    });

    const completionRate = totalAssignmentsAssigned > 0 
      ? Math.round((completedCount / totalAssignmentsAssigned) * 100) 
      : 0;

    return {
      completedCount,
      inProgressCount,
      notStartedCount,
      totalAssignmentsAssigned,
      completionRate
    };
  }, [students, assignments, submissions]);

  // Filtered list of students with their assignments
  const studentResults = useMemo(() => {
    return students
      .filter(student => {
        const matchQuery = 
          student.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          student.studentCode.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchClass = selectedClass === 'all' || student.classId === selectedClass;
        return matchQuery && matchClass;
      })
      .map(student => {
        // Assignments applicable to this student
        const studentAssignments = assignments.filter(a => {
          const matchTarget = a.targetClass === 'Tất cả các lớp' || a.targetClass === student.classId;
          const matchAssignmentFilter = selectedAssignmentId === 'all' || a.id === selectedAssignmentId;
          return matchTarget && matchAssignmentFilter;
        });

        // Submissions for this student
        const subList = studentAssignments.map(assignment => {
          const sub = submissions.find(
            s => s.studentId === student.id && s.assignmentId === assignment.id
          );
          return {
            assignment,
            submission: sub,
            status: sub?.status || ('Chưa làm' as SubmissionStatus),
            score: sub?.score ?? null,
            evaluation: sub?.evaluation || ('Chưa đánh giá' as EvaluationGrade),
            feedback: sub?.teacherFeedback || ''
          };
        }).filter(item => {
          if (selectedStatusFilter === 'all') return true;
          return item.status === selectedStatusFilter;
        });

        const totalAssigned = studentAssignments.length;
        const totalCompleted = subList.filter(item => item.status === 'Đã hoàn thành').length;
        const totalPending = totalAssigned - totalCompleted;

        return {
          student,
          totalAssigned,
          totalCompleted,
          totalPending,
          items: subList
        };
      })
      .filter(result => result.items.length > 0 || (selectedStatusFilter === 'all' && selectedAssignmentId === 'all'));
  }, [students, assignments, submissions, searchQuery, selectedClass, selectedAssignmentId, selectedStatusFilter]);

  // Open grading modal
  const handleOpenGrading = (student: Student, assignment: Assignment, submission?: Submission) => {
    setGradingModalData({ student, assignment, submission });
    setScoreInput(submission?.score !== undefined && submission.score !== null ? String(submission.score) : '');
    setStatusInput(submission?.status || 'Đã hoàn thành');
    setEvaluationInput(submission?.evaluation || 'Hoàn thành tốt');
    setFeedbackInput(submission?.teacherFeedback || '');
  };

  const handleSaveGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingModalData) return;

    const parsedScore = scoreInput.trim() !== '' ? Math.max(0, Math.min(10, parseFloat(scoreInput))) : null;

    onSaveResult({
      studentId: gradingModalData.student.id,
      assignmentId: gradingModalData.assignment.id,
      status: statusInput,
      score: isNaN(parsedScore as number) ? null : parsedScore,
      evaluation: evaluationInput,
      teacherFeedback: feedbackInput.trim(),
      submittedAt: statusInput === 'Đã hoàn thành' ? new Date().toISOString().split('T')[0] : undefined
    });

    setGradingModalData(null);
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Top Header & Overview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span>Theo dõi kết quả học tập & Tiến bộ</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đánh giá thực hành môn Công nghệ theo tiêu chí rèn luyện phẩm chất và kỹ năng thực tế
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-800 px-3.5 py-1.5 rounded-xl border border-blue-200/80">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Ưu tiên đồng hành, ghi nhận tiến bộ và động viên học sinh</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4">
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh, mã học sinh..."
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

          {/* Class Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map(cId => (
                <option key={cId} value={cId}>Lớp {cId}</option>
              ))}
            </select>
          </div>

          {/* Assignment Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            >
              <option value="all">Tất cả bài tập / nhiệm vụ</option>
              {assignments.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Mọi trạng thái</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Chưa làm">Chưa làm</option>
            </select>
          </div>
        </div>

        {/* Quick Stats Summary Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã hoàn thành: {overallStats.completedCount}</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Đang thực hiện: {overallStats.inProgressCount}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <CircleDashed className="w-4 h-4 text-slate-400" />
              <span>Chưa hoàn thành: {overallStats.notStartedCount}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Tỷ lệ hoàn thành chung:</span>
            <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {overallStats.completionRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Results Matrix by Student */}
      <div className="space-y-4">
        {studentResults.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Không tìm thấy kết quả phù hợp</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Hãy thử thay đổi điều kiện lọc theo lớp hoặc tên học sinh.
            </p>
          </div>
        ) : (
          studentResults.map(({ student, totalAssigned, totalCompleted, totalPending, items }) => {
            return (
              <div 
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden"
              >
                {/* Student Summary Bar */}
                <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${student.avatarColor || 'bg-blue-600'} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{student.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                          Lớp {student.classId}
                        </span>
                        <span className="text-xs font-mono text-slate-500 font-semibold">
                          {student.studentCode}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block">
                        Đánh giá chung: <strong className="text-slate-700">{student.status}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Task completion badge */}
                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
                    <div className="text-right">
                      <span className="text-slate-500 block">Tiến độ bài tập</span>
                      <strong className="text-slate-900 font-bold">
                        {totalCompleted} hoàn thành / {totalPending} chưa xong
                      </strong>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-2xs">
                      <span className="text-xs font-extrabold text-blue-600">
                        {totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submissions Table for this student */}
                <div className="divide-y divide-slate-100">
                  {items.map(({ assignment, submission, status, score, evaluation, feedback }) => (
                    <div
                      key={assignment.id}
                      className="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {assignment.category}
                          </span>
                          <span className="text-xs text-slate-400">Hạn nộp: {assignment.dueDate}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            status === 'Đã hoàn thành'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : status === 'Đang thực hiện'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900">{assignment.title}</h5>

                        {feedback ? (
                          <div className="text-xs text-slate-600 bg-blue-50/50 border border-blue-100/70 p-2 rounded-lg mt-1.5 flex items-start gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-blue-900 font-semibold">Lời nhận xét của Thầy Thuận:</strong> {feedback}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic block mt-1">Chưa có nhận xét chi tiết</span>
                        )}
                      </div>

                      {/* Score & Evaluation tag */}
                      <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-xs text-slate-500">Điểm:</span>
                            {score !== null ? (
                              <span className="text-base font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                                {score} / 10
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 font-mono">--</span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            {evaluation}
                          </span>
                        </div>

                        {/* Button to grade or edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenGrading(student, assignment, submission)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 text-xs font-semibold text-slate-700 rounded-xl shadow-2xs transition-all"
                          title="Chấm điểm và ghi nhận xét"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{score !== null || feedback ? 'Sửa đánh giá' : 'Chấm điểm / Nhận xét'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Grading / Evaluation Modal */}
      {gradingModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Đánh giá kết quả học tập</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Học sinh: <strong className="text-slate-800">{gradingModalData.student.name}</strong> ({gradingModalData.student.studentCode} - Lớp {gradingModalData.student.classId})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGradingModalData(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrading} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-0.5">Nhiệm vụ đánh giá:</span>
                <span className="font-bold text-slate-800 text-sm">{gradingModalData.assignment.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Trạng thái hoàn thành
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as SubmissionStatus)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Chưa làm">Chưa làm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Điểm số (Thang 10)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    placeholder="VD: 9.0"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mức độ đánh giá năng lực
                </label>
                <select
                  value={evaluationInput}
                  onChange={(e) => setEvaluationInput(e.target.value as EvaluationGrade)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Hoàn thành tốt">Hoàn thành tốt (Xuất sắc, sáng tạo)</option>
                  <option value="Đạt yêu cầu">Đạt yêu cầu (Đầy đủ tiêu chí chuẩn)</option>
                  <option value="Cần rèn luyện">Cần rèn luyện thêm (Cần thầy chỉ dẫn)</option>
                  <option value="Chưa đánh giá">Chưa đánh giá</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Lời nhận xét & động viên của Thầy Thuận</span>
                  <span className="text-slate-400 font-normal">Ghi chú tiến bộ</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Rất khen ngợi sự tỉ mỉ của em khi nối mạch. Cần lưu ý sắp xếp bàn thực hành gọn gàng hơn nhé!"
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingModalData(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-500/25 transition-all"
                >
                  Lưu kết quả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
