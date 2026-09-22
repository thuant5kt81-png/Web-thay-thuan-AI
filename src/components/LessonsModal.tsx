import React from 'react';
import { BookOpen, X, Clock, Target, Wrench, CheckCircle } from 'lucide-react';
import { Lesson } from '../types';

interface LessonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  onOpenAssignmentForLesson?: (lessonTitle: string) => void;
}

export const LessonsModal: React.FC<LessonsModalProps> = ({
  isOpen,
  onClose,
  lessons,
  onOpenAssignmentForLesson
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  {lessons.length} Bài học
                </span>
                <span className="text-xs text-slate-500 font-medium">Chương trình Công nghệ THCS</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Phân phối chương trình &amp; Bài học môn Công nghệ
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-slate-500">
            Kế hoạch bài dạy và nội dung thực hành kỹ thuật theo chương trình Giáo dục phổ thông môn Công nghệ THCS.
          </p>

          <div className="space-y-3">
            {lessons.map((ls) => (
              <div 
                key={ls.id} 
                className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-xs transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center border border-blue-200 shrink-0">
                      {ls.order}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{ls.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700">
                      {ls.grade}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ls.durationPeriods} tiết</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Mục tiêu:</strong> {ls.objectives}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Nội dung thực hành:</strong> {ls.practicalWork}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400 italic text-[11px]">{ls.chapter}</span>
                  {onOpenAssignmentForLesson && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAssignmentForLesson(ls.title);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Xem nhiệm vụ liên quan</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
