import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Bell, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  UserCheck,
  School,
  Download
} from 'lucide-react';
import { ActiveTab, UserRole } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userRole: UserRole;
  onRoleToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onResetData: () => void;
  unreadAnnouncementsCount: number;
  totalStudentsCount: number;
  activeAssignmentsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  userRole,
  onRoleToggle,
  soundEnabled,
  onSoundToggle,
  onResetData,
  unreadAnnouncementsCount,
  totalStudentsCount,
  activeAssignmentsCount,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'students',
      label: 'Học sinh',
      icon: <Users className="w-4 h-4" />,
      badge: totalStudentsCount
    },
    {
      id: 'assignments',
      label: 'Nhiệm vụ',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: activeAssignmentsCount
    },
    {
      id: 'results',
      label: 'Kết quả',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'announcements',
      label: 'Thông báo',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : undefined
    }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner: Branding & Utilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3 border-b border-slate-100">
          {/* Logo & Teacher / School Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wider">
                  Môn Công nghệ THCS
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  THCS THSP Lý Tự Trọng
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                THẦY THUẬN CÔNG NGHỆ
                <span className="text-slate-400 font-normal hidden sm:inline">–</span>
                <span className="text-blue-600 font-semibold text-base sm:text-lg hidden sm:inline">Quản Trị Học Tập</span>
              </h1>
            </div>
          </div>

          {/* Controls: Audio, Reset, View Mode */}
          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            {/* Sound Toggle */}
            <button
              id="header-sound-toggle-btn"
              type="button"
              onClick={onSoundToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                soundEnabled 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={soundEnabled ? 'Bấm để tắt âm thanh phản hồi' : 'Bấm để bật âm thanh phản hồi'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>Âm thanh: Bật</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Âm thanh: Tắt</span>
                </>
              )}
            </button>

            {/* Reset Data Button */}
            <button
              id="header-reset-data-btn"
              type="button"
              onClick={onResetData}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              title="Khôi phục lại dữ liệu mẫu ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Khôi phục</span> mẫu
            </button>

            {/* Download Standalone HTML for offline USB stick use */}
            <a
              id="header-download-offline-html"
              href="/thay-thuan-quan-tri-hoc-tap.html"
              download="thay-thuan-quan-tri-hoc-tap.html"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              title="Tải file HTML duy nhất để mở trực tiếp offline trên máy tính hoặc USB không cần internet"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Tải</span> file HTML offline
            </a>

            {/* Role switcher: Teacher vs Student preview */}
            <button
              id="header-role-toggle-btn"
              type="button"
              onClick={onRoleToggle}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-2xs transition-all ${
                userRole === 'teacher'
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
              title="Chuyển đổi góc nhìn Giáo viên / Học sinh"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{userRole === 'teacher' ? 'Góc nhìn: Thầy Thuận' : 'Góc nhìn: Học sinh'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Menu (5 main tabs) */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none" aria-label="Tabs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold leading-none ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
