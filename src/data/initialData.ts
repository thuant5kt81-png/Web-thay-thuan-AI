import { Student, Assignment, Submission, Announcement, Lesson } from '../types';

export const INITIAL_CLASSES = ['6A1', '7A1', '8A1', '8A2'];

export const INITIAL_STUDENTS: Student[] = [
  // Lớp 8A1 (6 học sinh)
  {
    id: 'hs-01',
    name: 'Nguyễn Hoàng An',
    classId: '8A1',
    studentCode: 'HS801-01',
    status: 'Tích cực',
    avatarColor: 'bg-blue-600',
    contact: 'PH: 0912.345.678',
    notes: 'Kỹ năng thực hành mạch điện rất khéo léo, chăm chỉ.',
  },
  {
    id: 'hs-02',
    name: 'Trần Thị Mai Anh',
    classId: '8A1',
    studentCode: 'HS801-02',
    status: 'Tích cực',
    avatarColor: 'bg-emerald-600',
    contact: 'PH: 0983.112.233',
    notes: 'Bản vẽ kỹ thuật chi tiết, sạch đẹp đúng quy chuẩn TCVN.',
  },
  {
    id: 'hs-03',
    name: 'Lê Minh Bảo',
    classId: '8A1',
    studentCode: 'HS801-03',
    status: 'Cần cố gắng',
    avatarColor: 'bg-amber-600',
    contact: 'PH: 0905.778.899',
    notes: 'Cần chú ý an toàn khi đấu nối nguồn điện gia dụng.',
  },
  {
    id: 'hs-04',
    name: 'Trần Đình Trọng',
    classId: '8A1',
    studentCode: 'HS801-04',
    status: 'Đạt yêu cầu',
    avatarColor: 'bg-indigo-600',
    contact: 'PH: 0938.121.232',
    notes: 'Lắp ráp mạch điện đúng sơ đồ nguyên lý.',
  },
  {
    id: 'hs-05',
    name: 'Nguyễn Ngọc Diệp',
    classId: '8A1',
    studentCode: 'HS801-05',
    status: 'Tích cực',
    avatarColor: 'bg-rose-600',
    contact: 'PH: 0947.665.544',
    notes: 'Ý tưởng thiết kế mô hình cơ khí sáng tạo.',
  },
  {
    id: 'hs-06',
    name: 'Phan Quốc Việt',
    classId: '8A1',
    studentCode: 'HS801-06',
    status: 'Đạt yêu cầu',
    avatarColor: 'bg-teal-600',
    contact: 'PH: 0916.789.012',
    notes: 'Hoàn thành tốt bài kiểm tra 15 phút về vật liệu cơ khí.',
  },

  // Lớp 8A2 (5 học sinh)
  {
    id: 'hs-07',
    name: 'Phạm Gia Hưng',
    classId: '8A2',
    studentCode: 'HS802-07',
    status: 'Đạt yêu cầu',
    avatarColor: 'bg-indigo-600',
    contact: 'PH: 0974.556.677',
    notes: 'Nắm vững lý thuyết, cần tích cực phát biểu xây dựng bài.',
  },
  {
    id: 'hs-08',
    name: 'Vũ Thảo Linh',
    classId: '8A2',
    studentCode: 'HS802-08',
    status: 'Tích cực',
    avatarColor: 'bg-purple-600',
    contact: 'PH: 0932.445.566',
    notes: 'Trưởng nhóm Dự án STEM đèn tự động, tinh thần trách nhiệm cao.',
  },
  {
    id: 'hs-09',
    name: 'Đặng Minh Khang',
    classId: '8A2',
    studentCode: 'HS802-09',
    status: 'Tích cực',
    avatarColor: 'bg-blue-600',
    contact: 'PH: 0922.334.455',
    notes: 'Vẽ hình chiếu phối cảnh đẹp và sắc nét.',
  },
  {
    id: 'hs-10',
    name: 'Nguyễn Thúy Hằng',
    classId: '8A2',
    studentCode: 'HS802-10',
    status: 'Cần cố gắng',
    avatarColor: 'bg-amber-600',
    contact: 'PH: 0909.112.233',
    notes: 'Cần nộp bù bản vẽ chi tiết gá lỗ tròn.',
  },
  {
    id: 'hs-11',
    name: 'Lê Thanh Tùng',
    classId: '8A2',
    studentCode: 'HS802-11',
    status: 'Đạt yêu cầu',
    avatarColor: 'bg-emerald-600',
    contact: 'PH: 0914.887.766',
    notes: 'Thực hành thao tác dũa kim loại cẩn thận.',
  },

  // Lớp 7A1 (5 học sinh)
  {
    id: 'hs-12',
    name: 'Đặng Tuấn Kiệt',
    classId: '7A1',
    studentCode: 'HS701-12',
    status: 'Đạt yêu cầu',
    avatarColor: 'bg-teal-600',
    contact: 'PH: 0968.991.122',
    notes: 'Hoàn thành tốt mô hình giàn thủy canh tuần hoàn.',
  },
  {
    id: 'hs-13',
    name: 'Bùi Ngọc Ánh',
    classId: '7A1',
    studentCode: 'HS701-13',
    status: 'Tích cực',
    avatarColor: 'bg-purple-600',
    contact: 'PH: 0918.334.455',
    notes: 'Ghi chép nhật ký sinh trưởng của rau mầm rất chi tiết.',
  },
  {
    id: 'hs-14',
    name: 'Hoàng Quốc Đạt',
    classId: '7A1',
    studentCode: 'HS701-14',
    status: 'Cần cố gắng',
    avatarColor: 'bg-orange-600',
    contact: 'PH: 0903.667.788',
    notes: 'Chưa nộp bài thu hoạch thực hành cắm hom giâm cành.',
  },
  {
    id: 'hs-15',
    name: 'Trịnh Cẩm Ly',
    classId: '7A1',
    studentCode: 'HS701-15',
    status: 'Tích cực',
    avatarColor: 'bg-pink-600',
    contact: 'PH: 0935.678.901',
    notes: 'Khéo tay trong việc phối trộn giá thể hữu cơ.',
  },
  {
    id: 'hs-16',
    name: 'Võ Minh Quân',
    classId: '7A1',
    studentCode: 'HS701-16',
    status: 'Đạt yêu cầu',
    avatarColor: 'bg-sky-600',
    contact: 'PH: 0942.345.678',
    notes: 'Tích cực tham gia chăm sóc vườn thực nghiệm của trường.',
  },

  // Lớp 6A1 (5 học sinh)
  {
    id: 'hs-17',
    name: 'Đỗ Hải Đăng',
    classId: '6A1',
    studentCode: 'HS601-17',
    status: 'Tích cực',
    avatarColor: 'bg-sky-600',
    contact: 'PH: 0945.123.789',
    notes: 'Hào hứng với các giải pháp tiết kiệm năng lượng điện trong nhà.',
  },
  {
    id: 'hs-18',
    name: 'Ngô Phương Thảo',
    classId: '6A1',
    studentCode: 'HS601-18',
    status: 'Đạt yêu cầu',
    avatarColor: 'bg-pink-600',
    contact: 'PH: 0977.889.900',
    notes: 'Ý tưởng trang trí phòng học thông minh rất đẹp.',
  },
  {
    id: 'hs-19',
    name: 'Lâm Tuấn Hưng',
    classId: '6A1',
    studentCode: 'HS601-19',
    status: 'Đạt yêu cầu',
    avatarColor: 'bg-teal-600',
    contact: 'PH: 0928.776.655',
    notes: 'Nắm vững quy tắc phân loại rác thải tái chế.',
  },
  {
    id: 'hs-20',
    name: 'Hà Kiều Anh',
    classId: '6A1',
    studentCode: 'HS601-20',
    status: 'Tích cực',
    avatarColor: 'bg-indigo-600',
    contact: 'PH: 0919.445.566',
    notes: 'Vẽ sơ đồ ngôi nhà thông minh với nhiều tiện ích.',
  },
  {
    id: 'hs-21',
    name: 'Mai Văn Nam',
    classId: '6A1',
    studentCode: 'HS601-21',
    status: 'Cần cố gắng',
    avatarColor: 'bg-amber-600',
    contact: 'PH: 0984.321.654',
    notes: 'Cần hoàn thành bảng thống kê điện năng tiêu thụ.',
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'ls-01',
    order: 1,
    title: 'Tiêu chuẩn trình bày bản vẽ kỹ thuật (TCVN)',
    grade: 'Khối 8',
    chapter: 'Chương I: Bản vẽ kỹ thuật cơ sở',
    durationPeriods: 2,
    objectives: 'Hiểu các khổ giấy A0-A4, tỷ lệ, nét vẽ và ghi kích thước chuẩn kỹ thuật.',
    practicalWork: 'Kẻ khung bản vẽ và khung tên TCVN trên giấy khổ A4.'
  },
  {
    id: 'ls-02',
    order: 2,
    title: 'Hình chiếu vuông góc của vật thể đơn giản',
    grade: 'Khối 8',
    chapter: 'Chương I: Bản vẽ kỹ thuật cơ sở',
    durationPeriods: 3,
    objectives: 'Biết vị trí 3 mặt phẳng chiếu: đứng, bằng, cạnh và phương pháp chiếu.',
    practicalWork: 'Vẽ 3 hình chiếu vuông góc của khối đa diện và khối tròn xoay.'
  },
  {
    id: 'ls-03',
    order: 3,
    title: 'Vật liệu cơ khí và dụng cụ gia công cơ khí',
    grade: 'Khối 8',
    chapter: 'Chương II: Cơ khí chế tạo',
    durationPeriods: 2,
    objectives: 'Phân loại kim loại đen, kim loại màu; sử dụng thước cặp, cưa, dũa an toàn.',
    practicalWork: 'Thao tác cưa và dũa kim loại tấm đúng tư thế và an toàn lao động.'
  },
  {
    id: 'ls-04',
    order: 4,
    title: 'Cơ cấu truyền và biến đổi chuyển động',
    grade: 'Khối 8',
    chapter: 'Chương II: Cơ khí chế tạo',
    durationPeriods: 3,
    objectives: 'Tìm hiểu bộ truyền đai, xích, bánh răng; tính tỷ số truyền i.',
    practicalWork: 'Lắp ráp mô hình truyền động bánh răng ăn khớp.'
  },
  {
    id: 'ls-05',
    order: 5,
    title: 'An toàn điện và tiết kiệm điện năng gia đình',
    grade: 'Khối 6 & 8',
    chapter: 'Chương III: Kỹ thuật điện',
    durationPeriods: 2,
    objectives: 'Nắm vững quy tắc an toàn khi sử dụng điện, sơ cứu người bị điện giật.',
    practicalWork: 'Lập bảng tính điện năng tiêu thụ và đề xuất giải pháp tiết kiệm điện.'
  },
  {
    id: 'ls-06',
    order: 6,
    title: 'Lắp ráp mạch điện điều khiển cảm biến (Ánh sáng & Nhiệt độ)',
    grade: 'Khối 8',
    chapter: 'Chương III: Kỹ thuật điện',
    durationPeriods: 4,
    objectives: 'Hiểu nguyên lý hoạt động của quang điện trở LDR, cảm biến nhiệt, Transistor.',
    practicalWork: 'Lắp mạch đèn tự động bật khi trời tối trên bảng cắm testboard.'
  },
  {
    id: 'ls-07',
    order: 7,
    title: 'Dự án STEM: Trồng rau thủy canh từ vật liệu tái chế',
    grade: 'Khối 7',
    chapter: 'Chương IV: Nông nghiệp công nghệ cao',
    durationPeriods: 4,
    objectives: 'Ứng dụng tưới mao dẫn, tái chế chai nhựa và đo pH dung dịch dinh dưỡng.',
    practicalWork: 'Chế tạo giàn trồng rau mầm tự dưỡng từ chai nhựa và ghi nhật ký 7 ngày.'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'bt-01',
    title: 'Thực hành: Lắp ráp mạch điện điều khiển cảm biến ánh sáng',
    description: 'Học sinh chuẩn bị quang điện trở (LDR), transistor, điện trở và bóng LED. Lắp ráp trên testboard và kiểm tra độ nhạy khi che tối.',
    targetClass: '8A1',
    dueDate: '2026-10-05',
    difficulty: 'Trung bình',
    status: 'Đang mở',
    category: 'Thực hành',
    createdAt: '2026-09-18'
  },
  {
    id: 'bt-02',
    title: 'Bản vẽ kỹ thuật: Lập bản vẽ phác chi tiết gá lỗ tròn',
    description: 'Sử dụng khổ giấy A4, kẻ khung bản vẽ và khung tên đúng tiêu chuẩn TCVN. Thể hiện hình chiếu đứng, hình chiếu bằng và hình chiếu cạnh có ghi kích thước.',
    targetClass: '8A1',
    dueDate: '2026-09-30',
    difficulty: 'Nâng cao',
    status: 'Đang mở',
    category: 'Bản vẽ kỹ thuật',
    createdAt: '2026-09-15'
  },
  {
    id: 'bt-03',
    title: 'Dự án STEM: Mô hình trồng rau mầm thủy canh từ chai nhựa tái chế',
    description: 'Tận dụng vỏ chai nhựa đã qua sử dụng, thiết kế hệ thống tưới mao dẫn trồng rau cải mầm. Chụp ảnh nhật ký nảy mầm sau 5 ngày chăm sóc.',
    targetClass: '7A1',
    dueDate: '2026-10-10',
    difficulty: 'Dễ',
    status: 'Đang mở',
    category: 'Dự án STEM',
    createdAt: '2026-09-20'
  },
  {
    id: 'bt-04',
    title: 'Tìm hiểu: Quy tắc an toàn và tiết kiệm điện năng trong gia đình',
    description: 'Lập bảng thống kê công suất tiêu thụ của các thiết bị điện trong nhà (tủ lạnh, quạt, nồi cơm, tivi). Đề xuất 3 giải pháp giảm tiền điện tháng.',
    targetClass: 'Tất cả các lớp',
    dueDate: '2026-09-28',
    difficulty: 'Dễ',
    status: 'Đang mở',
    category: 'Lý thuyết',
    createdAt: '2026-09-10'
  },
  {
    id: 'bt-05',
    title: 'Khảo sát và phân loại các loại vật liệu cơ khí thông dụng',
    description: 'Thu thập mẫu kim loại đen, kim loại màu và phi kim loại (chất dẻo, cao su). Trình bày tính chất cơ học và ứng dụng thực tế.',
    targetClass: '8A2',
    dueDate: '2026-09-25',
    difficulty: 'Trung bình',
    status: 'Đang mở',
    category: 'Lý thuyết',
    createdAt: '2026-09-05'
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  // 5 bài đã chấm có nhận xét hoàn chỉnh (5 Nhận xét)
  {
    id: 'sub-01',
    studentId: 'hs-01',
    assignmentId: 'bt-01',
    status: 'Đã hoàn thành',
    score: 9.5,
    evaluation: 'Hoàn thành tốt',
    teacherFeedback: 'Mạch đấu gọn gàng, LED sáng nhạy khi che tối. Thầy rất khen ngợi tính tỉ mỉ và an toàn của em!',
    submittedAt: '2026-09-21'
  },
  {
    id: 'sub-02',
    studentId: 'hs-02',
    assignmentId: 'bt-01',
    status: 'Đã hoàn thành',
    score: 9.0,
    evaluation: 'Hoàn thành tốt',
    teacherFeedback: 'Bố trí linh kiện đẹp trên testboard, giải thích rõ nguyên lý quang trở biến thiên.',
    submittedAt: '2026-09-21'
  },
  {
    id: 'sub-03',
    studentId: 'hs-02',
    assignmentId: 'bt-02',
    status: 'Đã hoàn thành',
    score: 10.0,
    evaluation: 'Hoàn thành tốt',
    teacherFeedback: 'Bản vẽ xuất sắc! Nét vẽ sắc sảo, đường gióng kích thước chuẩn mực theo tiêu chuẩn TCVN.',
    submittedAt: '2026-09-20'
  },
  {
    id: 'sub-04',
    studentId: 'hs-12',
    assignmentId: 'bt-03',
    status: 'Đã hoàn thành',
    score: 9.0,
    evaluation: 'Hoàn thành tốt',
    teacherFeedback: 'Rau mầm xanh tốt, tái chế chai nhựa thông minh và có tính thẩm mỹ cao.',
    submittedAt: '2026-09-22'
  },
  {
    id: 'sub-05',
    studentId: 'hs-17',
    assignmentId: 'bt-04',
    status: 'Đã hoàn thành',
    score: 9.5,
    evaluation: 'Hoàn thành tốt',
    teacherFeedback: 'Bảng tính công suất chi tiết, ý thức tiết kiệm điện năng gia đình rất đáng biểu dương.',
    submittedAt: '2026-09-21'
  },

  // 5 bài đang chờ chấm / chờ duyệt (5 chờ)
  {
    id: 'sub-06',
    studentId: 'hs-04',
    assignmentId: 'bt-01',
    status: 'Đã hoàn thành',
    score: null,
    evaluation: 'Chưa đánh giá',
    teacherFeedback: '',
    submittedAt: '2026-09-22'
  },
  {
    id: 'sub-07',
    studentId: 'hs-05',
    assignmentId: 'bt-01',
    status: 'Đã hoàn thành',
    score: null,
    evaluation: 'Chưa đánh giá',
    teacherFeedback: '',
    submittedAt: '2026-09-22'
  },
  {
    id: 'sub-08',
    studentId: 'hs-08',
    assignmentId: 'bt-05',
    status: 'Đã hoàn thành',
    score: null,
    evaluation: 'Chưa đánh giá',
    teacherFeedback: '',
    submittedAt: '2026-09-22'
  },
  {
    id: 'sub-09',
    studentId: 'hs-13',
    assignmentId: 'bt-03',
    status: 'Đã hoàn thành',
    score: null,
    evaluation: 'Chưa đánh giá',
    teacherFeedback: '',
    submittedAt: '2026-09-22'
  },
  {
    id: 'sub-10',
    studentId: 'hs-18',
    assignmentId: 'bt-04',
    status: 'Đã hoàn thành',
    score: null,
    evaluation: 'Chưa đánh giá',
    teacherFeedback: '',
    submittedAt: '2026-09-22'
  },

  // 4 bài cần lưu ý đôn đốc / chưa hoàn thành (4 lưu ý)
  {
    id: 'sub-11',
    studentId: 'hs-03',
    assignmentId: 'bt-01',
    status: 'Đang thực hiện',
    score: null,
    evaluation: 'Cần rèn luyện',
    teacherFeedback: 'Lưu ý kiểm tra lại chân cực B-C-E của Transistor để không bị ngược cực nhé.',
    submittedAt: undefined
  },
  {
    id: 'sub-12',
    studentId: 'hs-10',
    assignmentId: 'bt-02',
    status: 'Chưa làm',
    score: null,
    evaluation: 'Chưa đánh giá',
    teacherFeedback: 'Lưu ý: Hạn nộp bản vẽ chi tiết gá lỗ tròn sắp tới, em cần hoàn thành sớm.',
    submittedAt: undefined
  },
  {
    id: 'sub-13',
    studentId: 'hs-14',
    assignmentId: 'bt-03',
    status: 'Chưa làm',
    score: null,
    evaluation: 'Chưa đánh giá',
    teacherFeedback: 'Lưu ý: Chưa nộp ảnh nhật ký gieo hạt rau mầm thủy canh.',
    submittedAt: undefined
  },
  {
    id: 'sub-14',
    studentId: 'hs-21',
    assignmentId: 'bt-04',
    status: 'Đang thực hiện',
    score: null,
    evaluation: 'Cần rèn luyện',
    teacherFeedback: 'Lưu ý: Cần bổ sung giải pháp tiết kiệm điện cho thiết bị chiếu sáng.',
    submittedAt: undefined
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'tb-01',
    title: 'Thông báo: Quy định an toàn trong phòng thực hành Công nghệ học kỳ 1',
    content: 'Chào các em học sinh! Khi vào phòng thực hành Công nghệ, các em chú ý: 1. Tuyệt đối không tự ý cắm nguồn điện khi chưa có sự cho phép của thầy. 2. Kiểm tra dây dẫn và kẹp cá sấu cẩn thận. 3. Thu dọn kìm, kéo, mỏ hàn và dọn sạch bàn thực hành sau mỗi buổi học. Chúc các em có những tiết học thực hành say mê và bổ ích!',
    targetAudience: 'Toàn trường',
    priority: 'Quan trọng',
    postedDate: '2026-09-20',
    author: 'Thầy Thuận Công nghệ',
    readByStudent: true
  },
  {
    id: 'tb-02',
    title: 'Nhắc nhở: Hạn nộp Dự án STEM Mô hình trồng rau thủy canh tái chế',
    content: 'Các bạn học sinh khối 7 chú ý: Hạn chót nộp ảnh chụp nhật ký sinh trưởng và trưng bày sản phẩm mô hình rau mầm tại phòng bộ môn là thứ Sáu ngày 10/10. Lớp trưởng và nhóm trưởng nhắc các bạn nộp đầy đủ để thầy chấm điểm đánh giá thường xuyên nhé.',
    targetAudience: 'Khối 7',
    priority: 'Khẩn cấp / Nhắc nhở',
    postedDate: '2026-09-22',
    author: 'Thầy Thuận Công nghệ',
    readByStudent: false
  },
  {
    id: 'tb-03',
    title: 'Khen ngợi nhóm học sinh lớp 8A1 hoàn thành xuất sắc bản vẽ kỹ thuật',
    content: 'Thầy gửi lời biểu dương đặc biệt đến bạn Trần Thị Mai Anh và Nguyễn Hoàng An (8A1) đã hoàn thành bản vẽ kỹ thuật chi tiết gá lỗ tròn với độ chính xác cao, nét vẽ sạch sẽ theo tiêu chuẩn TCVN. Bản vẽ của các bạn đã được thầy lưu giữ làm tư liệu học tập mẫu cho toàn khối!',
    targetAudience: 'Khối 8',
    priority: 'Bình thường',
    postedDate: '2026-09-21',
    author: 'Thầy Thuận Công nghệ',
    readByStudent: true
  }
];
