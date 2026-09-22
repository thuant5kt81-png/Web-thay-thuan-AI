import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  PlusCircle, 
  Search, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  X, 
  AlertTriangle,
  Info,
  Clock,
  Send
} from 'lucide-react';
import { Announcement, AnnouncementPriority, UserRole } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface AnnouncementsTabProps {
  announcements: Announcement[];
  classes: string[];
  userRole: UserRole;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  onUpdateAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onToggleRead: (id: string) => void;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
  announcements,
  classes,
  userRole,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onToggleRead,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAudience, setFormAudience] = useState('Toàn trường');
  const [formPriority, setFormPriority] = useState<AnnouncementPriority>('Bình thường');
  const [formPostedDate, setFormPostedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState('');

  // Delete modal
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(item => {
      const matchQuery = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase().trim());
      
      const matchAudience = selectedAudience === 'all' || item.targetAudience === selectedAudience;
      const matchPriority = selectedPriority === 'all' || item.priority === selectedPriority;

      return matchQuery && matchAudience && matchPriority;
    });
  }, [announcements, searchQuery, selectedAudience, selectedPriority]);

  const handleOpenAdd = () => {
    setEditingAnnouncement(null);
    setFormTitle('');
    setFormContent('');
    setFormAudience('Toàn trường');
    setFormPriority('Bình thường');
    setFormPostedDate(new Date().toISOString().split('T')[0]);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setFormTitle(ann.title);
    setFormContent(ann.content);
    setFormAudience(ann.targetAudience);
    setFormPriority(ann.priority);
    setFormPostedDate(ann.postedDate);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Vui lòng nhập tiêu đề thông báo!');
      return;
    }
    if (!formContent.trim()) {
      setFormError('Vui lòng nhập nội dung thông báo!');
      return;
    }

    if (editingAnnouncement) {
      onUpdateAnnouncement({
        ...editingAnnouncement,
        title: formTitle.trim(),
        content: formContent.trim(),
        targetAudience: formAudience,
        priority: formPriority,
        postedDate: formPostedDate,
      });
    } else {
      onAddAnnouncement({
        title: formTitle.trim(),
        content: formContent.trim(),
        targetAudience: formAudience,
        priority: formPriority,
        postedDate: formPostedDate,
        author: 'Thầy Thuận Công nghệ',
        readByStudent: false
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" />
              <span>Bảng tin & Thông báo học tập</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gửi lời dặn dò, kế hoạch kiểm tra và nhắc nhở thực hành tới học sinh THCS
            </p>
          </div>

          <button
            id="create-announcement-btn"
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-500/25 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo thông báo mới</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm thông báo theo tiêu đề hoặc nội dung..."
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

          {/* Filter by Target Audience */}
          <div className="sm:col-span-3">
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả đối tượng nhận</option>
              <option value="Toàn trường">Toàn trường</option>
              <option value="Khối 6">Khối 6</option>
              <option value="Khối 7">Khối 7</option>
              <option value="Khối 8">Khối 8</option>
              <option value="Khối 9">Khối 9</option>
              {classes.map(cId => (
                <option key={cId} value={`Lớp ${cId}`}>Lớp {cId}</option>
              ))}
            </select>
          </div>

          {/* Filter by Priority */}
          <div className="sm:col-span-3">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="Bình thường">Bình thường</option>
              <option value="Quan trọng">Quan trọng</option>
              <option value="Khẩn cấp / Nhắc nhở">Khẩn cấp / Nhắc nhở</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Chưa có thông báo nào</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Thầy có thể tạo bài thông báo mới bằng nút &ldquo;Tạo thông báo mới&rdquo; phía trên.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => {
            const isRead = item.readByStudent;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs hover:shadow-md ${
                  item.priority === 'Quan trọng'
                    ? 'border-red-200/80 bg-gradient-to-r from-white via-white to-red-50/20'
                    : item.priority === 'Khẩn cấp / Nhắc nhở'
                    ? 'border-amber-200/80 bg-gradient-to-r from-white via-white to-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {item.priority === 'Quan trọng' && (
                        <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Quan trọng</span>
                        </span>
                      )}
                      {item.priority === 'Khẩn cấp / Nhắc nhở' && (
                        <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>Khẩn cấp / Nhắc nhở</span>
                        </span>
                      )}
                      {item.priority === 'Bình thường' && (
                        <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <Info className="w-3 h-3" />
                          <span>Thông báo chung</span>
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>Đối tượng: {item.targetAudience}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>Ngày đăng: {item.postedDate}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{item.title}</h3>

                    {/* Content */}
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <span>Người đăng:</span>
                        <strong className="text-slate-800 font-semibold">{item.author}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions for this announcement */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    {/* Mark as read / unread button */}
                    <button
                      type="button"
                      onClick={() => onToggleRead(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isRead
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={isRead ? 'Bấm để đánh dấu chưa đọc' : 'Bấm để đánh dấu đã đọc'}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isRead ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{isRead ? 'Đã xem' : 'Đánh dấu đã đọc'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Chỉnh sửa thông báo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnnouncementToDelete(item)}
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Xóa thông báo này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add or Edit Announcement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <span>{editingAnnouncement ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}</span>
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
                  Tiêu đề thông báo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nhắc nhở mang đồ dùng thực hành tiết Công nghệ tuần tới"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nội dung chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nội dung dặn dò, lưu ý an toàn, hạn nộp..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Đối tượng nhận
                  </label>
                  <select
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Toàn trường">Toàn trường</option>
                    <option value="Khối 6">Khối 6</option>
                    <option value="Khối 7">Khối 7</option>
                    <option value="Khối 8">Khối 8</option>
                    <option value="Khối 9">Khối 9</option>
                    {classes.map(cId => (
                      <option key={cId} value={`Lớp ${cId}`}>Lớp {cId}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as AnnouncementPriority)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bình thường">Bình thường</option>
                    <option value="Quan trọng">Quan trọng</option>
                    <option value="Khẩn cấp / Nhắc nhở">Khẩn cấp / Nhắc nhở</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ngày đăng
                  </label>
                  <input
                    type="date"
                    value={formPostedDate}
                    onChange={(e) => setFormPostedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
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
                  {editingAnnouncement ? 'Lưu thay đổi' : 'Đăng thông báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Announcement Modal */}
      <ConfirmModal
        isOpen={Boolean(announcementToDelete)}
        title="Xác nhận xóa thông báo"
        message={`Thầy có chắc chắn muốn xóa thông báo "${announcementToDelete?.title}" không? Học sinh sẽ không còn thấy thông báo này nữa.`}
        confirmText="Xác nhận xóa"
        cancelText="Giữ lại"
        isDanger={true}
        onCancel={() => setAnnouncementToDelete(null)}
        onConfirm={() => {
          if (announcementToDelete) {
            onDeleteAnnouncement(announcementToDelete.id);
            setAnnouncementToDelete(null);
          }
        }}
      />
    </div>
  );
};
