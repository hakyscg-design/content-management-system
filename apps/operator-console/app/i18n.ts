export const OPERATOR_LANGUAGE_COOKIE = "cms-operator-language";

export type OperatorLanguage = "en" | "vn";

export const operatorLanguages = [
  { id: "en", label: "EN" },
  { id: "vn", label: "VN" }
] as const;

export function resolveOperatorLanguage(
  candidate: string | null | undefined
): OperatorLanguage {
  return candidate === "vn" ? "vn" : "en";
}

export const copy = {
  en: {
    shell: {
      appName: "Content Management System",
      subtitle: "Local operator console for reusable content projects.",
      runtimeSuffix: "persistent local runtime.",
      projectLabel: "Active project",
      projectAria: "Active CMS project",
      projectSwitch: "Switch",
      languageLabel: "Language",
      languageAria: "Operator language"
    },
    nav: {
      primary: "Primary",
      overview: "Overview",
      sourceAssets: "Source & Assets",
      contentProduction: "Content Production",
      workflow: "Workflow",
      review: "Review",
      publishing: "Publishing",
      performanceAnalytics: "Performance & Analytics",
      administration: "Administration"
    },
    common: {
      id: "ID",
      state: "State",
      next: "Next",
      code: "Code",
      result: "Result",
      passed: "passed",
      failed: "failed",
      openWorkspace: "Open Workspace",
      openOwnerWorkspace: "Open Owner Workspace",
      openContext: "Open Context",
      bytes: "bytes",
      created: "Created",
      manifest: "Manifest",
      present: "present",
      missing: "missing",
      project: "Project",
      scope: "Scope",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      close: "Close",
      reset: "Reset"
    },
    api: {
      administrationRejectedTitle: "Administration action rejected",
      administrationRejectedMessage: "Unknown administration action.",
      unknownProject: "Unknown CMS project."
    },
    pages: {
      overview: {
        title: "Operational Overview",
        copy: "Accepted production-layer areas are assembled into a local browser shell with local SQLite persistence and filesystem media storage.",
        noticeTitle: "Persistent local runtime",
        active: "is active.",
        assetLibrary: "Asset Library",
        localMedia: "Local media",
        noMedia: "No local media is stored yet."
      },
      sourceAssets: {
        title: "Source & Assets",
        copy: "Capture approved manual sources and register assets for content production.",
        registerAsset: "Register asset",
        sourceUrl: "Source URL",
        sourceUrlPlaceholder: "manual://source or https://...",
        assetLabel: "Asset label",
        assetLabelPlaceholder: "Operator-facing asset label",
        evidence: "Evidence",
        evidencePlaceholder: "Manual provenance or rights evidence",
        registerReadyAsset: "Register Ready Asset",
        readyAssets: "Ready assets",
        noAssets: "No assets are registered yet."
      },
      contentProduction: {
        title: "Content Production",
        copy: "Create manual content packages from ready source assets, then mark versions ready for human review.",
        createPackage: "Create package",
        noReadyAssets: "No ready assets are waiting for content production.",
        asset: "Asset",
        packageTitle: "Title",
        titlePlaceholder: "Manual brief title",
        concept: "Concept",
        conceptPlaceholder: "Manual content concept",
        caption: "Caption",
        captionPlaceholder: "Draft caption",
        createContentPackage: "Create Content Package",
        packages: "Packages",
        noPackages: "No content packages yet."
      },
      review: {
        title: "Review",
        copy: "Record manual review decisions. Approval remains required before publishing preparation.",
        approveContent: "Approve content",
        noPackages: "No content packages are ready for review approval.",
        contentPackage: "Content package",
        reviewer: "Reviewer",
        reviewerPlaceholder: "local-operator",
        decisionReason: "Decision reason",
        reasonPlaceholder: "Manual approval note",
        approveForPublishing: "Approve For Publishing",
        reviewDecisions: "Review decisions",
        noReviews: "No review decisions yet."
      },
      publishing: {
        title: "Publishing",
        copy: "Prepare approved content for manual publishing. No autonomous platform publishing is performed.",
        preparePackage: "Prepare package",
        noApprovedContent:
          "No approved content is waiting for publishing preparation.",
        approvedContent: "Approved content",
        destination: "Destination",
        caption: "Caption",
        captionPlaceholder: "Final manual caption",
        prepareManualPackage: "Prepare Manual Package",
        manualPackages: "Manual packages",
        manualReferencePlaceholder: "manual://published/reference",
        recordComplete: "Record Complete",
        noPublishingPackages: "No publishing packages yet."
      },
      performance: {
        title: "Performance & Analytics",
        copy: "Record manual performance facts for completed publishing packages, then write reports and learning summaries as explicit operator actions.",
        recordFeedback: "Record performance feedback",
        noCompleted:
          "No completed publishing packages are waiting for performance feedback.",
        publishedContent: "Published content",
        importSource: "Import source",
        views: "Views",
        likes: "Likes",
        comments: "Comments",
        shares: "Shares",
        watchMinutes: "Watch minutes",
        importMetrics: "Import Metrics",
        createReport: "Create analytics report",
        noImports:
          "No performance imports are waiting for an analytics report.",
        performanceImport: "Performance import",
        reportTitle: "Report title",
        reportTitlePlaceholder: "Manual analytics report title",
        narrative: "Analytics narrative",
        narrativePlaceholder: "Manual interpretation of the imported facts",
        recordLearningSummary: "Record learning summary",
        noReports: "No analytics reports are waiting for a learning summary.",
        analyticsReport: "Analytics report",
        learningSummary: "Learning summary",
        learningPlaceholder: "Manual learning to carry into future work",
        recordLearning: "Record Learning",
        performanceImports: "Performance imports",
        performanceFacts: "Performance facts",
        analyticsReports: "Analytics reports",
        learningSummaries: "Learning summaries",
        noPerformanceImports: "No performance imports yet.",
        noPerformanceFacts: "No performance facts yet.",
        noAnalyticsReports: "No analytics reports yet.",
        noLearningSummaries: "No learning summaries yet."
      },
      workflow: {
        title: "Workflow",
        copy: "Monitor project-scoped execution, review failed operations, and record manual recovery confirmation without changing owner-service business records automatically.",
        pending: "Pending next actions",
        noPending: "No pending workflow actions.",
        failedOperations: "Failed operations",
        requiredAction: "Required action",
        recoveryPlaceholder: "What did the operator review or correct?",
        recordRecovery: "Record Recovery Confirmation",
        recoveryGuidance:
          "This records that the operator handled the failure. It does not retry or alter the owner-service business record.",
        recoveryRecorded: "Recovery confirmation already recorded.",
        noFailures: "No failed operations.",
        workflowRuns: "Workflow runs",
        recentOperations: "Recent operations",
        noWorkflowRuns: "No workflow runs are recorded yet.",
        noRecentOperations: "No recent operations."
      },
      administration: {
        title: "Administration",
        copy: "Manage CMS-owned project settings and local runtime operations without taking ownership of content, publishing, review, performance, or workflow business records.",
        canonical: "Canonical Project Configuration",
        slug: "Slug",
        namespace: "Namespace",
        profile: "Profile",
        readOnlyIdentity:
          "This registry-backed identity is read-only in Administration.",
        preferences: "Local Operator Preferences",
        operatorLabel: "Operator label",
        defaultLocale: "Default locale",
        policyNote: "Policy note",
        lastUpdated: "Last updated",
        saveProjectSettings: "Save Project Settings",
        globalSettings: "Global CMS Settings",
        schema: "Schema",
        migration: "Migration",
        environment: "Environment",
        logLevel: "Log level",
        knownProjects: "Known projects",
        runtimeHealth: "Runtime Health",
        records: "Records",
        media: "Media",
        recentFailures: "Recent failures",
        storage: "Project-Scoped Local Storage",
        database: "Database",
        base: "Base",
        ready: "ready",
        databaseBytes: "Database bytes",
        mediaBytes: "Media bytes",
        backups: "Backups",
        backupRestore: "Project Backup And Restore",
        backupGuidance:
          "Backup visibility is filtered to the active project. Global backup policy is read-only here.",
        createBackup: "Create Local Backup",
        noBackups: "No local backups are recorded yet."
      },
      assetLibrary: {
        searchPlaceholder: "Search assets...",
        searchAria: "Search assets",
        filterAria: "Filter assets by status",
        sortAria: "Sort assets",
        allStatuses: "All statuses",
        labelAsc: "Label A-Z",
        labelDesc: "Label Z-A",
        statusAsc: "Status A-Z",
        idAsc: "ID A-Z",
        showing: "Showing",
        of: "of",
        assets: "assets",
        noAssetsFound: "No assets found.",
        detail: "Asset Detail",
        label: "Label",
        authority: "Authority",
        entityType: "Entity type",
        status: "Status",
        editStatus: "Edit asset status",
        cmsService: "CMS service"
      },
      localActions: {
        title: "Owner-routed operations",
        copy: "These actions call the local application boundary, which calls the accepted owning services.",
        submitting: "Submitting...",
        submitAsset: "Submit Asset Intake",
        checking: "Checking...",
        checkInvalid: "Check Invalid Publishing Gate",
        storing: "Storing...",
        addMedia: "Add Local Media",
        requestFailedTitle: "Local request failed",
        requestFailedMessage:
          "The local operator console could not complete the request.",
        empty: "No operation has been submitted from this screen yet."
      },
      traceability: {
        title: "Route traceability",
        owner: "Owner",
        status: "Status",
        empty: "No traceability row exists for this route."
      }
    }
  },
  vn: {
    shell: {
      appName: "Content Management System",
      subtitle:
        "Bảng điều khiển cục bộ cho các dự án nội dung có thể tái sử dụng.",
      runtimeSuffix: "môi trường chạy cục bộ có lưu trữ bền vững.",
      projectLabel: "Dự án đang hoạt động",
      projectAria: "Dự án CMS đang hoạt động",
      projectSwitch: "Chuyển",
      languageLabel: "Ngôn ngữ",
      languageAria: "Ngôn ngữ vận hành"
    },
    nav: {
      primary: "Điều hướng chính",
      overview: "Tổng quan",
      sourceAssets: "Nguồn & Tài sản",
      contentProduction: "Sản xuất nội dung",
      workflow: "Quy trình",
      review: "Duyệt",
      publishing: "Chuẩn bị đăng",
      performanceAnalytics: "Hiệu suất & Phân tích",
      administration: "Quản trị"
    },
    common: {
      id: "ID",
      state: "Trạng thái",
      next: "Tiếp theo",
      code: "Mã",
      result: "Kết quả",
      passed: "đạt",
      failed: "lỗi",
      openWorkspace: "Mở không gian làm việc",
      openOwnerWorkspace: "Mở không gian làm việc chủ quản",
      openContext: "Mở ngữ cảnh",
      bytes: "bytes",
      created: "Tạo lúc",
      manifest: "Manifest",
      present: "có",
      missing: "thiếu",
      project: "Dự án",
      scope: "Phạm vi",
      save: "Lưu",
      cancel: "Hủy",
      edit: "Sửa",
      close: "Đóng",
      reset: "Đặt lại"
    },
    api: {
      administrationRejectedTitle: "Hành động quản trị bị từ chối",
      administrationRejectedMessage: "Không rõ hành động quản trị.",
      unknownProject: "Không rõ dự án CMS."
    },
    pages: {
      overview: {
        title: "Tổng quan vận hành",
        copy: "Các khu vực lớp sản xuất đã được chấp nhận được đưa vào bảng điều khiển cục bộ với SQLite và lưu trữ tệp phương tiện trên hệ thống tệp.",
        noticeTitle: "Môi trường chạy cục bộ có lưu trữ",
        active: "đang hoạt động.",
        assetLibrary: "Thư viện tài sản",
        localMedia: "Phương tiện cục bộ",
        noMedia: "Chưa có phương tiện cục bộ nào được lưu."
      },
      sourceAssets: {
        title: "Nguồn & Tài sản",
        copy: "Ghi nhận nguồn thủ công đã được chấp thuận và đăng ký tài sản cho sản xuất nội dung.",
        registerAsset: "Đăng ký tài sản",
        sourceUrl: "URL nguồn",
        sourceUrlPlaceholder: "manual://source hoặc https://...",
        assetLabel: "Nhãn tài sản",
        assetLabelPlaceholder: "Nhãn tài sản hiển thị cho người vận hành",
        evidence: "Bằng chứng",
        evidencePlaceholder: "Nguồn gốc thủ công hoặc bằng chứng quyền sử dụng",
        registerReadyAsset: "Đăng ký tài sản sẵn sàng",
        readyAssets: "Tài sản sẵn sàng",
        noAssets: "Chưa có tài sản nào được đăng ký."
      },
      contentProduction: {
        title: "Sản xuất nội dung",
        copy: "Tạo gói nội dung thủ công từ tài sản nguồn đã sẵn sàng, rồi đánh dấu phiên bản sẵn sàng cho người duyệt.",
        createPackage: "Tạo gói",
        noReadyAssets:
          "Không có tài sản sẵn sàng nào đang chờ sản xuất nội dung.",
        asset: "Tài sản",
        packageTitle: "Tiêu đề",
        titlePlaceholder: "Tiêu đề bản tóm tắt thủ công",
        concept: "Ý tưởng",
        conceptPlaceholder: "Ý tưởng nội dung thủ công",
        caption: "Chú thích",
        captionPlaceholder: "Bản nháp chú thích",
        createContentPackage: "Tạo gói nội dung",
        packages: "Gói nội dung",
        noPackages: "Chưa có gói nội dung nào."
      },
      review: {
        title: "Duyệt",
        copy: "Ghi nhận quyết định duyệt thủ công. Vẫn bắt buộc có phê duyệt trước khi chuẩn bị đăng.",
        approveContent: "Phê duyệt nội dung",
        noPackages: "Không có gói nội dung nào sẵn sàng để phê duyệt.",
        contentPackage: "Gói nội dung",
        reviewer: "Người duyệt",
        reviewerPlaceholder: "nguoi-duyet-cuc-bo",
        decisionReason: "Lý do quyết định",
        reasonPlaceholder: "Ghi chú phê duyệt thủ công",
        approveForPublishing: "Phê duyệt để đăng",
        reviewDecisions: "Quyết định duyệt",
        noReviews: "Chưa có quyết định duyệt nào."
      },
      publishing: {
        title: "Chuẩn bị đăng",
        copy: "Chuẩn bị nội dung đã được phê duyệt để đăng thủ công. Không thực hiện đăng tự động lên nền tảng.",
        preparePackage: "Chuẩn bị gói",
        noApprovedContent:
          "Không có nội dung đã được phê duyệt đang chờ chuẩn bị đăng.",
        approvedContent: "Nội dung đã duyệt",
        destination: "Đích đến",
        caption: "Chú thích",
        captionPlaceholder: "Chú thích thủ công cuối cùng",
        prepareManualPackage: "Chuẩn bị gói thủ công",
        manualPackages: "Gói thủ công",
        manualReferencePlaceholder: "manual://published/reference",
        recordComplete: "Ghi nhận hoàn tất",
        noPublishingPackages: "Chưa có gói đăng nào."
      },
      performance: {
        title: "Hiệu suất & Phân tích",
        copy: "Ghi nhận số liệu hiệu suất thủ công cho các gói đã đăng xong, rồi viết báo cáo và tổng kết bài học bằng hành động rõ ràng của người vận hành.",
        recordFeedback: "Ghi nhận phản hồi hiệu suất",
        noCompleted:
          "Không có gói đăng đã hoàn tất nào đang chờ phản hồi hiệu suất.",
        publishedContent: "Nội dung đã đăng",
        importSource: "Nguồn nhập",
        views: "Lượt xem",
        likes: "Lượt thích",
        comments: "Bình luận",
        shares: "Chia sẻ",
        watchMinutes: "Phút xem",
        importMetrics: "Nhập số liệu",
        createReport: "Tạo báo cáo phân tích",
        noImports:
          "Không có lần nhập hiệu suất nào đang chờ báo cáo phân tích.",
        performanceImport: "Lần nhập hiệu suất",
        reportTitle: "Tiêu đề báo cáo",
        reportTitlePlaceholder: "Tiêu đề báo cáo phân tích thủ công",
        narrative: "Nhận định phân tích",
        narrativePlaceholder: "Diễn giải thủ công về các dữ kiện đã nhập",
        recordLearningSummary: "Ghi nhận tổng kết bài học",
        noReports: "Không có báo cáo phân tích nào đang chờ tổng kết bài học.",
        analyticsReport: "Báo cáo phân tích",
        learningSummary: "Tổng kết bài học",
        learningPlaceholder: "Bài học thủ công để áp dụng cho lần sau",
        recordLearning: "Ghi nhận bài học",
        performanceImports: "Lần nhập hiệu suất",
        performanceFacts: "Dữ kiện hiệu suất",
        analyticsReports: "Báo cáo phân tích",
        learningSummaries: "Tổng kết bài học",
        noPerformanceImports: "Chưa có lần nhập hiệu suất nào.",
        noPerformanceFacts: "Chưa có dữ kiện hiệu suất nào.",
        noAnalyticsReports: "Chưa có báo cáo phân tích nào.",
        noLearningSummaries: "Chưa có tổng kết bài học nào."
      },
      workflow: {
        title: "Quy trình",
        copy: "Theo dõi thực thi theo dự án, xem thao tác lỗi, và ghi nhận xác nhận phục hồi thủ công mà không tự động thay đổi bản ghi nghiệp vụ của dịch vụ chủ quản.",
        pending: "Hành động tiếp theo đang chờ",
        noPending: "Không có hành động quy trình đang chờ.",
        failedOperations: "Thao tác bị lỗi",
        requiredAction: "Hành động bắt buộc",
        recoveryPlaceholder: "Người vận hành đã xem hoặc sửa gì?",
        recordRecovery: "Ghi nhận xác nhận phục hồi",
        recoveryGuidance:
          "Dòng này chỉ ghi nhận người vận hành đã xử lý lỗi. Nó không thử lại hoặc thay đổi bản ghi nghiệp vụ của dịch vụ chủ quản.",
        recoveryRecorded: "Đã ghi nhận xác nhận phục hồi.",
        noFailures: "Không có thao tác lỗi.",
        workflowRuns: "Lần chạy quy trình",
        recentOperations: "Thao tác gần đây",
        noWorkflowRuns: "Chưa có lần chạy quy trình nào được ghi nhận.",
        noRecentOperations: "Chưa có thao tác gần đây."
      },
      administration: {
        title: "Quản trị",
        copy: "Quản lý cấu hình dự án thuộc CMS và thao tác môi trường chạy cục bộ mà không nhận quyền sở hữu bản ghi nội dung, đăng, duyệt, hiệu suất hay quy trình.",
        canonical: "Cấu hình dự án chuẩn",
        slug: "Slug",
        namespace: "Namespace",
        profile: "Profile",
        readOnlyIdentity:
          "Danh tính do sổ đăng ký quản lý này chỉ đọc trong Quản trị.",
        preferences: "Tùy chọn người vận hành cục bộ",
        operatorLabel: "Nhãn người vận hành",
        defaultLocale: "Locale mặc định",
        policyNote: "Ghi chú chính sách",
        lastUpdated: "Cập nhật lần cuối",
        saveProjectSettings: "Lưu cấu hình dự án",
        globalSettings: "Cấu hình CMS toàn cục",
        schema: "Schema",
        migration: "Migration",
        environment: "Môi trường",
        logLevel: "Mức log",
        knownProjects: "Dự án đã biết",
        runtimeHealth: "Tình trạng môi trường chạy",
        records: "Bản ghi",
        media: "Phương tiện",
        recentFailures: "Lỗi gần đây",
        storage: "Lưu trữ cục bộ theo dự án",
        database: "Cơ sở dữ liệu",
        base: "Thư mục gốc",
        ready: "sẵn sàng",
        databaseBytes: "Dung lượng cơ sở dữ liệu",
        mediaBytes: "Dung lượng phương tiện",
        backups: "Bản sao lưu",
        backupRestore: "Sao lưu và khôi phục theo dự án",
        backupGuidance:
          "Danh sách sao lưu được lọc theo dự án đang hoạt động. Chính sách sao lưu toàn cục chỉ đọc tại đây.",
        createBackup: "Tạo bản sao lưu cục bộ",
        noBackups: "Chưa có bản sao lưu cục bộ nào được ghi nhận."
      },
      assetLibrary: {
        searchPlaceholder: "Tìm tài sản...",
        searchAria: "Tìm tài sản",
        filterAria: "Lọc tài sản theo trạng thái",
        sortAria: "Sắp xếp tài sản",
        allStatuses: "Tất cả trạng thái",
        labelAsc: "Nhãn A-Z",
        labelDesc: "Nhãn Z-A",
        statusAsc: "Trạng thái A-Z",
        idAsc: "ID A-Z",
        showing: "Đang hiển thị",
        of: "trên",
        assets: "tài sản",
        noAssetsFound: "Không tìm thấy tài sản.",
        detail: "Chi tiết tài sản",
        label: "Nhãn",
        authority: "Dịch vụ chủ quản",
        entityType: "Loại thực thể",
        status: "Trạng thái",
        editStatus: "Sửa trạng thái tài sản",
        cmsService: "Dịch vụ CMS"
      },
      localActions: {
        title: "Thao tác qua dịch vụ chủ quản",
        copy: "Các hành động này gọi ranh giới ứng dụng cục bộ, rồi ranh giới này gọi các dịch vụ chủ quản đã được chấp nhận.",
        submitting: "Đang gửi...",
        submitAsset: "Gửi tiếp nhận tài sản",
        checking: "Đang kiểm tra...",
        checkInvalid: "Kiểm tra cổng chặn đăng không hợp lệ",
        storing: "Đang lưu...",
        addMedia: "Thêm phương tiện cục bộ",
        requestFailedTitle: "Yêu cầu cục bộ bị lỗi",
        requestFailedMessage:
          "Bảng điều khiển người vận hành cục bộ không thể hoàn tất yêu cầu.",
        empty: "Chưa có thao tác nào được gửi từ màn hình này."
      },
      traceability: {
        title: "Truy vết route",
        owner: "Chủ quản",
        status: "Trạng thái",
        empty: "Không có dòng truy vết nào cho route này."
      }
    }
  }
} as const;

export type OperatorCopy = (typeof copy)[OperatorLanguage];

const valueTranslations: Record<string, string> = {
  archived: "đã lưu trữ",
  attention: "cần chú ý",
  blocked: "bị chặn",
  cancelled: "đã hủy",
  completed: "đã hoàn tất",
  draft: "bản nháp",
  failed: "lỗi",
  healthy: "khỏe",
  imported: "đã nhập",
  implemented: "đã triển khai",
  passed: "đạt",
  preparing: "đang chuẩn bị",
  published: "đã đăng",
  ready: "sẵn sàng",
  "ready-for-review": "sẵn sàng để duyệt",
  staged: "đã xếp hàng",
  "Asset must be ready": "Tài sản phải sẵn sàng",
  "Content package created": "Đã tạo gói nội dung",
  "Create analytics report": "Tạo báo cáo phân tích",
  "Create content package": "Tạo gói nội dung",
  "Complete publishing preparation": "Hoàn tất chuẩn bị đăng",
  "Content package ready for review": "Gói nội dung sẵn sàng để duyệt",
  "Human review approved": "Người duyệt đã phê duyệt",
  "Learning summary recorded": "Đã ghi nhận tổng kết bài học",
  "Local CMS operator preferences for the active project. These do not change the canonical project registry.":
    "Tùy chọn người vận hành cục bộ cho dự án đang hoạt động. Các giá trị này không thay đổi sổ đăng ký dự án chuẩn.",
  "Local runtime database is available for the active project.":
    "Cơ sở dữ liệu của môi trường chạy cục bộ sẵn sàng cho dự án đang hoạt động.",
  "Local runtime database is missing. Run local setup before operating this project.":
    "Thiếu cơ sở dữ liệu của môi trường chạy cục bộ. Hãy chạy thiết lập cục bộ trước khi vận hành dự án này.",
  "Manual publishing recorded": "Đã ghi nhận đăng thủ công",
  "Restore remains a guarded local operator action through npm run restore -- <backup-dir>; backup manifests must match the active project.":
    "Khôi phục vẫn là hành động cục bộ có kiểm soát của người vận hành qua npm run restore -- <backup-dir>; manifest bản sao lưu phải khớp với dự án đang hoạt động.",
  "Performance feedback recorded": "Đã ghi nhận phản hồi hiệu suất",
  "Prepare publishing package": "Chuẩn bị gói đăng",
  "Publishing package prepared": "Đã chuẩn bị gói đăng",
  "Publishing package ready": "Gói đăng đã sẵn sàng",
  "Ready for publishing preparation": "Sẵn sàng chuẩn bị đăng",
  "Record learning summary": "Ghi nhận tổng kết bài học",
  "Record manual completion": "Ghi nhận hoàn tất thủ công",
  "Record performance feedback": "Ghi nhận phản hồi hiệu suất",
  "Record review approval": "Ghi nhận phê duyệt",
  "Waiting for review": "Đang chờ duyệt",
  "Workflow complete": "Quy trình hoàn tất",
  "Global CMS runtime metadata is read-only here and applies across project selection.":
    "Siêu dữ liệu môi trường chạy CMS toàn cục chỉ đọc tại đây và áp dụng trên mọi lựa chọn dự án.",
  "Review source/asset details in the owner workspace, correct the manual input if needed, then record recovery confirmation.":
    "Xem chi tiết nguồn/tài sản trong không gian làm việc chủ quản, sửa đầu vào thủ công nếu cần, rồi ghi nhận xác nhận phục hồi.",
  "Review the content production record in the owner workspace, complete the valid owner-service action if needed, then record recovery confirmation.":
    "Xem bản ghi sản xuất nội dung trong không gian làm việc chủ quản, hoàn tất hành động hợp lệ của dịch vụ chủ quản nếu cần, rồi ghi nhận xác nhận phục hồi.",
  "Review the human approval state in the owner workspace, complete the valid manual approval action if needed, then record recovery confirmation.":
    "Xem trạng thái phê duyệt của người duyệt trong không gian làm việc chủ quản, hoàn tất hành động phê duyệt thủ công hợp lệ nếu cần, rồi ghi nhận xác nhận phục hồi.",
  "Review publishing preparation in the owner workspace, complete only the valid manual publishing action if needed, then record recovery confirmation.":
    "Xem phần chuẩn bị đăng trong không gian làm việc chủ quản, chỉ hoàn tất hành động đăng thủ công hợp lệ nếu cần, rồi ghi nhận xác nhận phục hồi.",
  "Review the performance workspace, complete the valid manual feedback/report/learning action if needed, then record recovery confirmation.":
    "Xem không gian làm việc hiệu suất, hoàn tất hành động phản hồi/báo cáo/bài học thủ công hợp lệ nếu cần, rồi ghi nhận xác nhận phục hồi.",
  "Review the failed operation and record recovery confirmation only after the operator has handled the issue outside workflow ownership.":
    "Xem thao tác lỗi và chỉ ghi nhận xác nhận phục hồi sau khi người vận hành đã xử lý vấn đề bên ngoài quyền sở hữu của Quy trình.",
  "Open the owner workspace, complete the valid manual action if needed, then record recovery confirmation.":
    "Mở không gian làm việc chủ quản, hoàn tất hành động thủ công hợp lệ nếu cần, rồi ghi nhận xác nhận phục hồi.",
  "The local runtime uses SQLite and local filesystem storage. Data and media persist across local restarts.":
    "Môi trường chạy cục bộ dùng SQLite và lưu trữ trên hệ thống tệp. Dữ liệu và phương tiện được giữ lại qua các lần khởi động lại cục bộ.",
  "Manual recovery confirmation recorded": "Đã ghi nhận xác nhận phục hồi",
  "Administration settings updated": "Đã cập nhật cấu hình quản trị",
  "Local backup created": "Đã tạo bản sao lưu cục bộ",
  "Local media stored": "Đã lưu phương tiện cục bộ",
  "Local media rejected": "Phương tiện cục bộ bị từ chối",
  "Unexpected publishing acceptance":
    "Đăng nội dung được chấp nhận ngoài dự kiến",
  "Workflow recovery confirmation recorded":
    "Đã ghi nhận xác nhận phục hồi quy trình",
  "Performance metrics imported": "Đã nhập số liệu hiệu suất",
  "Analytics report recorded": "Đã ghi nhận báo cáo phân tích"
};

const recordLabelTranslations: Record<string, string> = {
  "Asset intake workflow": "Quy trình tiếp nhận tài sản",
  "Content package": "Gói nội dung",
  "Human review": "Duyệt thủ công",
  "Local media file": "Tệp phương tiện cục bộ",
  "Ready asset": "Tài sản sẵn sàng"
};

const serviceLabelTranslations: Record<string, string> = {
  "FTV-SVC-01": "Đăng ký Nguồn & Tài sản",
  "FTV-SVC-02": "Quản lý Phương tiện",
  "FTV-SVC-03": "Sản xuất Nội dung",
  "FTV-SVC-04": "Chuẩn bị Đăng",
  "FTV-SVC-05": "Duyệt thủ công",
  "FTV-SVC-06": "Dữ liệu Hiệu suất",
  "FTV-SVC-07": "Báo cáo Phân tích",
  "FTV-SVC-08": "Điều phối Quy trình",
  "FTV-SVC-09": "Quản trị Quy tắc",
  "FTV-SVC-10": "Cấu hình",
  "FTV-SVC-11": "Quản trị Dữ liệu lõi"
};

export function localizeValue(
  value: string | undefined,
  language: OperatorLanguage
): string {
  if (!value || language === "en") return value ?? "";

  const exact = valueTranslations[value];
  if (exact) return exact;

  const patterns: Array<[RegExp, (...matches: string[]) => string]> = [
    [
      /^Created (.+) through (FTV-SVC-\d+) and persisted locally\.$/,
      (id, serviceId) =>
        `Đã tạo ${id} qua ${serviceId} và lưu bền vững trong cục bộ.`
    ],
    [
      /^Created (.+) through (FTV-SVC-\d+) for (.+)\.$/,
      (id, serviceId, targetId) =>
        `Đã tạo ${id} qua ${serviceId} cho ${targetId}.`
    ],
    [
      /^Approved (.+) through (FTV-SVC-\d+)\.$/,
      (id, serviceId) => `Đã phê duyệt ${id} qua ${serviceId}.`
    ],
    [
      /^Prepared (.+) through (FTV-SVC-\d+) for manual publishing\.$/,
      (id, serviceId) => `Đã chuẩn bị ${id} qua ${serviceId} để đăng thủ công.`
    ],
    [
      /^Recorded manual publishing completion for (.+)\.$/,
      (id) => `Đã ghi nhận hoàn tất đăng thủ công cho ${id}.`
    ],
    [
      /^Recorded performance import and (.+) facts for (.+)\.$/,
      (count, id) =>
        `Đã ghi nhận lần nhập hiệu suất và ${count} dữ kiện cho ${id}.`
    ],
    [
      /^Created analytics report (.+) for (.+)\.$/,
      (reportId, importId) =>
        `Đã tạo báo cáo phân tích ${reportId} cho ${importId}.`
    ],
    [
      /^Recorded learning summary for (.+)\.$/,
      (id) => `Đã ghi nhận tổng kết bài học cho ${id}.`
    ],
    [
      /^Recorded operator recovery confirmation for failed operation (.+); no owner-service business record was automatically changed\.$/,
      (id) =>
        `Đã ghi nhận xác nhận phục hồi của người vận hành cho thao tác lỗi ${id}; không có bản ghi nghiệp vụ nào của dịch vụ chủ quản bị tự động thay đổi.`
    ],
    [
      /^Media file already exists: (.+)$/,
      (path) => `Tệp phương tiện đã tồn tại: ${path}`
    ],
    [
      /^Stored (.+) in local filesystem storage\.$/,
      (path) => `Đã lưu ${path} trong lưu trữ hệ thống tệp cục bộ.`
    ],
    [
      /^Updated CMS project settings for (.+)\.$/,
      (projectName) => `Đã cập nhật cấu hình dự án CMS cho ${projectName}.`
    ],
    [
      /^Created project backup (.+)\.$/,
      (name) => `Đã tạo bản sao lưu dự án ${name}.`
    ]
  ];

  for (const [pattern, translate] of patterns) {
    const match = value.match(pattern);
    if (match) return translate(...match.slice(1));
  }

  return value
    .replace(/^Review for /, "Duyệt cho ")
    .replace(/^Manual package for /, "Gói thủ công cho ")
    .replace(/^Performance import for /, "Lần nhập hiệu suất cho ")
    .replace(/^Learning summary for /, "Tổng kết bài học cho ")
    .replace(/^Recovery for /, "Phục hồi cho ")
    .replace(/^Created /, "Đã tạo ")
    .replace(/^Recorded /, "Đã ghi nhận ")
    .replace(
      /^Updated CMS project settings for /,
      "Đã cập nhật cấu hình CMS cho "
    )
    .replace(/^Stored /, "Đã lưu ");
}

export function localizeRecordLabel(
  value: string,
  language: OperatorLanguage
): string {
  if (language === "en") return value;
  return recordLabelTranslations[value] ?? localizeValue(value, language);
}

export function localizeServiceLabel(
  ownerServiceId: string,
  fallback: string,
  language: OperatorLanguage
): string {
  if (language === "en") return fallback;
  return serviceLabelTranslations[ownerServiceId] ?? fallback;
}

export function resolveRequestLanguage(request: Request): OperatorLanguage {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${OPERATOR_LANGUAGE_COOKIE}=`));
  return resolveOperatorLanguage(cookie?.split("=").slice(1).join("="));
}
