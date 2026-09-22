import React from 'react';
import { 
  LayoutGrid, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CheckSquare, 
  Award, 
  TrendingUp, 
  MessageSquare, 
  BarChart3 
} from 'lucide-react';

export type AdminMenuItemKey = 
  | 'overview' 
  | 'classes' 
  | 'students' 
  | 'lessons' 
  | 'assignments' 
  | 'scores' 
  | 'progress' 
  | 'comments' 
  | 'stats';

interface AdminSystemMenuProps {
  activeKey?: AdminMenuItemKey;
  onSelect: (key: AdminMenuItemKey) => void;
  classesCount?: number;
  studentsCount?: number;
  lessonsCount?: number;
  pendingTasksCount?: number;
  attentionCount?: number;
  commentsCount?: number;
  className?: string;
}

export const AdminSystemMenu: React.FC<AdminSystemMenuProps> = ({
  activeKey = 'overview',
  onSelect,
  classesCount = 4,
  studentsCount = 21,
  lessonsCount = 7,
  pendingTasksCount = 5,
  attentionCount = 4,
  commentsCount = 5,
  className = ''
}) => {
  const menuItems = [
    {
      key: 'overview' as AdminMenuItemKey,
      label: '1. Tổng quan',
      icon: LayoutGrid,
      badge: null,
      badgeColor: '',
    },
    {
      key: 'classes' as AdminMenuItemKey,
      label: '2. Lớp học',
      icon: Users,
      badge: classesCount.toString(),
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      key: 'students' as AdminMenuItemKey,
      label: '3. Học sinh',
      icon: GraduationCap,
      badge: studentsCount.toString(),
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      key: 'lessons' as AdminMenuItemKey,
      label: '4. Bài học',
      icon: BookOpen,
      badge: lessonsCount.toString(),
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      key: 'assignments' as AdminMenuItemKey,
      label: '5. Nhiệm vụ',
      icon: CheckSquare,
      badge: `${pendingTasksCount} chờ`,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      key: 'scores' as AdminMenuItemKey,
      label: '6. Điểm số',
      icon: Award,
      badge: null,
      badgeColor: '',
    },
    {
      key: 'progress' as AdminMenuItemKey,
      label: '7. Tiến độ học tập',
      icon: TrendingUp,
      badge: `${attentionCount} lưu ý`,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold',
    },
    {
      key: 'comments' as AdminMenuItemKey,
      label: '8. Nhận xét',
      icon: MessageSquare,
      badge: commentsCount.toString(),
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      key: 'stats' as AdminMenuItemKey,
      label: '9. Thống kê',
      icon: BarChart3,
      badge: null,
      badgeColor: '',
    },
  ];

  return (
    <div className={`bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs ${className}`}>
      {/* Title as in the screenshot */}
      <div className="px-3 pt-1 pb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
        HỆ THỐNG QUẢN TRỊ
      </div>

      {/* Menu items list */}
      <nav className="space-y-1.5" aria-label="Hệ thống quản trị">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;

          if (isActive) {
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item.key)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25 transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-5 h-5 shrink-0 text-white" />
                  <span className="text-sm truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold shrink-0 ml-2">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600 shrink-0 transition-colors" />
                <span className="text-sm font-semibold group-hover:font-bold transition-all truncate">
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className={`text-[11px] px-2 py-0.5 rounded-md shrink-0 ml-2 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
