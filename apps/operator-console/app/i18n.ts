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
      }
    }
  },
  vn: {
    shell: {
      appName: "Content Management System",
      subtitle:
        "Bang dieu khien cuc bo cho cac du an noi dung co the tai su dung.",
      runtimeSuffix: "runtime cuc bo co luu tru ben vung.",
      projectLabel: "Du an dang hoat dong",
      projectAria: "Du an CMS dang hoat dong",
      projectSwitch: "Chuyen",
      languageLabel: "Ngon ngu",
      languageAria: "Ngon ngu van hanh"
    },
    nav: {
      primary: "Dieu huong chinh",
      overview: "Tong quan",
      sourceAssets: "Nguon & Tai san",
      contentProduction: "San xuat noi dung",
      workflow: "Quy trinh",
      review: "Duyet",
      publishing: "Chuan bi dang",
      performanceAnalytics: "Hieu suat & Phan tich",
      administration: "Quan tri"
    },
    common: {
      id: "ID",
      state: "Trang thai",
      next: "Tiep theo",
      code: "Ma",
      result: "Ket qua",
      passed: "dat",
      failed: "loi",
      openWorkspace: "Mo workspace",
      openOwnerWorkspace: "Mo workspace chu quan",
      openContext: "Mo ngu canh",
      bytes: "bytes",
      created: "Tao luc",
      manifest: "Manifest",
      present: "co",
      missing: "thieu",
      project: "Du an",
      scope: "Pham vi",
      save: "Luu",
      cancel: "Huy",
      edit: "Sua",
      close: "Dong",
      reset: "Dat lai"
    },
    pages: {
      overview: {
        title: "Tong quan van hanh",
        copy: "Cac khu vuc production-layer da duoc chap nhan duoc dua vao console cuc bo voi SQLite va luu tru media tren he thong tep.",
        noticeTitle: "Runtime cuc bo co luu tru",
        active: "dang hoat dong.",
        assetLibrary: "Thu vien tai san",
        localMedia: "Media cuc bo",
        noMedia: "Chua co media cuc bo nao duoc luu."
      },
      sourceAssets: {
        title: "Nguon & Tai san",
        copy: "Ghi nhan nguon thu cong da duoc chap thuan va dang ky tai san cho san xuat noi dung.",
        registerAsset: "Dang ky tai san",
        sourceUrl: "URL nguon",
        sourceUrlPlaceholder: "manual://source hoac https://...",
        assetLabel: "Nhan tai san",
        assetLabelPlaceholder: "Nhan tai san hien thi cho operator",
        evidence: "Bang chung",
        evidencePlaceholder: "Nguon goc thu cong hoac bang chung quyen su dung",
        registerReadyAsset: "Dang ky tai san san sang",
        readyAssets: "Tai san san sang",
        noAssets: "Chua co tai san nao duoc dang ky."
      },
      contentProduction: {
        title: "San xuat noi dung",
        copy: "Tao goi noi dung thu cong tu tai san nguon da san sang, roi danh dau phien ban san sang cho duyet nguoi.",
        createPackage: "Tao goi",
        noReadyAssets:
          "Khong co tai san san sang nao dang cho san xuat noi dung.",
        asset: "Tai san",
        packageTitle: "Tieu de",
        titlePlaceholder: "Tieu de brief thu cong",
        concept: "Y tuong",
        conceptPlaceholder: "Y tuong noi dung thu cong",
        caption: "Chu thich",
        captionPlaceholder: "Ban nhap chu thich",
        createContentPackage: "Tao goi noi dung",
        packages: "Goi noi dung",
        noPackages: "Chua co goi noi dung nao."
      },
      review: {
        title: "Duyet",
        copy: "Ghi nhan quyet dinh duyet thu cong. Van bat buoc co phe duyet truoc khi chuan bi dang.",
        approveContent: "Phe duyet noi dung",
        noPackages: "Khong co goi noi dung nao san sang de phe duyet.",
        contentPackage: "Goi noi dung",
        reviewer: "Nguoi duyet",
        decisionReason: "Ly do quyet dinh",
        reasonPlaceholder: "Ghi chu phe duyet thu cong",
        approveForPublishing: "Phe duyet de dang",
        reviewDecisions: "Quyet dinh duyet",
        noReviews: "Chua co quyet dinh duyet nao."
      },
      publishing: {
        title: "Chuan bi dang",
        copy: "Chuan bi noi dung da duoc phe duyet de dang thu cong. Khong co dang tu dong len nen tang.",
        preparePackage: "Chuan bi goi",
        noApprovedContent:
          "Khong co noi dung da duoc phe duyet dang cho chuan bi dang.",
        approvedContent: "Noi dung da duyet",
        destination: "Dich den",
        caption: "Chu thich",
        captionPlaceholder: "Chu thich thu cong cuoi cung",
        prepareManualPackage: "Chuan bi goi thu cong",
        manualPackages: "Goi thu cong",
        manualReferencePlaceholder: "manual://published/reference",
        recordComplete: "Ghi nhan hoan tat",
        noPublishingPackages: "Chua co goi dang nao."
      },
      performance: {
        title: "Hieu suat & Phan tich",
        copy: "Ghi nhan so lieu hieu suat thu cong cho cac goi da dang xong, roi viet bao cao va tong ket bai hoc bang hanh dong ro rang cua operator.",
        recordFeedback: "Ghi nhan phan hoi hieu suat",
        noCompleted:
          "Khong co goi dang hoan tat nao dang cho phan hoi hieu suat.",
        publishedContent: "Noi dung da dang",
        importSource: "Nguon import",
        views: "Luot xem",
        likes: "Luot thich",
        comments: "Binh luan",
        shares: "Chia se",
        watchMinutes: "Phut xem",
        importMetrics: "Import so lieu",
        createReport: "Tao bao cao phan tich",
        noImports: "Khong co import hieu suat nao dang cho bao cao phan tich.",
        performanceImport: "Import hieu suat",
        reportTitle: "Tieu de bao cao",
        reportTitlePlaceholder: "Tieu de bao cao phan tich thu cong",
        narrative: "Nhan dinh phan tich",
        narrativePlaceholder: "Dien giai thu cong ve cac facts da import",
        recordLearningSummary: "Ghi nhan tong ket bai hoc",
        noReports: "Khong co bao cao phan tich nao dang cho tong ket bai hoc.",
        analyticsReport: "Bao cao phan tich",
        learningSummary: "Tong ket bai hoc",
        learningPlaceholder: "Bai hoc thu cong de ap dung cho lan sau",
        recordLearning: "Ghi nhan bai hoc",
        performanceImports: "Import hieu suat",
        performanceFacts: "Facts hieu suat",
        analyticsReports: "Bao cao phan tich",
        learningSummaries: "Tong ket bai hoc",
        noPerformanceImports: "Chua co import hieu suat nao.",
        noPerformanceFacts: "Chua co fact hieu suat nao.",
        noAnalyticsReports: "Chua co bao cao phan tich nao.",
        noLearningSummaries: "Chua co tong ket bai hoc nao."
      },
      workflow: {
        title: "Quy trinh",
        copy: "Theo doi thuc thi theo du an, xem thao tac loi, va ghi nhan xac nhan phuc hoi thu cong ma khong tu dong thay doi business record cua service chu quan.",
        pending: "Hanh dong tiep theo dang cho",
        noPending: "Khong co hanh dong quy trinh dang cho.",
        failedOperations: "Thao tac bi loi",
        requiredAction: "Hanh dong bat buoc",
        recoveryPlaceholder: "Operator da xem hoac sua gi?",
        recordRecovery: "Ghi nhan xac nhan phuc hoi",
        recoveryGuidance:
          "Dong nay chi ghi nhan operator da xu ly loi. No khong retry hoac thay doi business record cua service chu quan.",
        recoveryRecorded: "Da ghi nhan xac nhan phuc hoi.",
        noFailures: "Khong co thao tac loi.",
        workflowRuns: "Lan chay quy trinh",
        recentOperations: "Thao tac gan day",
        noWorkflowRuns: "Chua co lan chay quy trinh nao duoc ghi nhan.",
        noRecentOperations: "Chua co thao tac gan day."
      },
      administration: {
        title: "Quan tri",
        copy: "Quan ly cau hinh du an thuoc CMS va thao tac runtime cuc bo ma khong nhan quyen so huu record noi dung, dang, duyet, hieu suat hay quy trinh.",
        canonical: "Cau hinh du an canonical",
        slug: "Slug",
        namespace: "Namespace",
        profile: "Profile",
        readOnlyIdentity:
          "Danh tinh duoc registry quan ly nay chi doc trong Administration.",
        preferences: "Tuy chon operator cuc bo",
        operatorLabel: "Nhan operator",
        defaultLocale: "Locale mac dinh",
        policyNote: "Ghi chu chinh sach",
        lastUpdated: "Cap nhat lan cuoi",
        saveProjectSettings: "Luu cau hinh du an",
        globalSettings: "Cau hinh CMS toan cuc",
        schema: "Schema",
        migration: "Migration",
        environment: "Moi truong",
        logLevel: "Muc log",
        knownProjects: "Du an da biet",
        runtimeHealth: "Suc khoe runtime",
        records: "Records",
        media: "Media",
        recentFailures: "Loi gan day",
        storage: "Luu tru cuc bo theo du an",
        database: "Database",
        base: "Thu muc goc",
        ready: "san sang",
        databaseBytes: "Database bytes",
        mediaBytes: "Media bytes",
        backups: "Backups",
        backupRestore: "Backup va restore theo du an",
        backupGuidance:
          "Danh sach backup duoc loc theo du an dang hoat dong. Chinh sach backup toan cuc chi doc tai day.",
        createBackup: "Tao backup cuc bo",
        noBackups: "Chua co backup cuc bo nao duoc ghi nhan."
      },
      assetLibrary: {
        searchPlaceholder: "Tim tai san...",
        searchAria: "Tim tai san",
        filterAria: "Loc tai san theo trang thai",
        sortAria: "Sap xep tai san",
        allStatuses: "Tat ca trang thai",
        labelAsc: "Nhan A-Z",
        labelDesc: "Nhan Z-A",
        statusAsc: "Trang thai A-Z",
        idAsc: "ID A-Z",
        showing: "Dang hien thi",
        of: "tren",
        assets: "tai san",
        noAssetsFound: "Khong tim thay tai san.",
        detail: "Chi tiet tai san",
        label: "Nhan",
        authority: "Service chu quan",
        entityType: "Loai thuc the",
        status: "Trang thai",
        editStatus: "Sua trang thai tai san",
        cmsService: "CMS service"
      },
      localActions: {
        title: "Thao tac qua service chu quan",
        copy: "Cac hanh dong nay goi bien ung dung cuc bo, roi bien nay goi cac service chu quan da duoc chap nhan.",
        submitting: "Dang gui...",
        submitAsset: "Gui intake tai san",
        checking: "Dang kiem tra...",
        checkInvalid: "Kiem tra cong chan publishing khong hop le",
        storing: "Dang luu...",
        addMedia: "Them media cuc bo",
        requestFailedTitle: "Request cuc bo bi loi",
        requestFailedMessage:
          "Console operator cuc bo khong the hoan tat request.",
        empty: "Chua co thao tac nao duoc gui tu man hinh nay."
      }
    }
  }
} as const;

export type OperatorCopy = (typeof copy)[OperatorLanguage];

const valueTranslations: Record<string, string> = {
  "Asset must be ready": "Tai san phai san sang",
  attention: "can chu y",
  healthy: "khoe",
  "Content package created": "Da tao goi noi dung",
  "Create analytics report": "Tao bao cao phan tich",
  "Create content package": "Tao goi noi dung",
  "Complete publishing preparation": "Hoan tat chuan bi dang",
  "Content package ready for review": "Goi noi dung san sang cho duyet",
  "Human review approved": "Duyet nguoi da phe duyet",
  "Learning summary recorded": "Da ghi nhan tong ket bai hoc",
  "Local CMS operator preferences for the active project. These do not change the canonical project registry.":
    "Tuy chon operator cuc bo cho du an dang hoat dong. Cac gia tri nay khong thay doi registry du an canonical.",
  "Local runtime database is available for the active project.":
    "Database runtime cuc bo san sang cho du an dang hoat dong.",
  "Local runtime database is missing. Run local setup before operating this project.":
    "Thieu database runtime cuc bo. Hay chay local setup truoc khi van hanh du an nay.",
  "Manual publishing recorded": "Da ghi nhan dang thu cong",
  "Restore remains a guarded local operator action through npm run restore -- <backup-dir>; backup manifests must match the active project.":
    "Restore van la hanh dong operator cuc bo duoc bao ve qua npm run restore -- <backup-dir>; manifest backup phai khop voi du an dang hoat dong.",
  "Performance feedback recorded": "Da ghi nhan phan hoi hieu suat",
  "Prepare publishing package": "Chuan bi goi dang",
  "Publishing package prepared": "Da chuan bi goi dang",
  "Publishing package ready": "Goi dang da san sang",
  "Ready for publishing preparation": "San sang chuan bi dang",
  "Record learning summary": "Ghi nhan tong ket bai hoc",
  "Record manual completion": "Ghi nhan hoan tat thu cong",
  "Record performance feedback": "Ghi nhan phan hoi hieu suat",
  "Record review approval": "Ghi nhan phe duyet",
  "Waiting for review": "Dang cho duyet",
  "Workflow complete": "Quy trinh hoan tat",
  "Global CMS runtime metadata is read-only here and applies across project selection.":
    "Metadata runtime CMS toan cuc chi doc tai day va ap dung tren moi lua chon du an.",
  "Review source/asset details in the owner workspace, correct the manual input if needed, then record recovery confirmation.":
    "Xem chi tiet nguon/tai san trong workspace chu quan, sua input thu cong neu can, roi ghi nhan xac nhan phuc hoi.",
  "Review the content production record in the owner workspace, complete the valid owner-service action if needed, then record recovery confirmation.":
    "Xem record san xuat noi dung trong workspace chu quan, hoan tat hanh dong hop le cua owner-service neu can, roi ghi nhan xac nhan phuc hoi.",
  "Review the human approval state in the owner workspace, complete the valid manual approval action if needed, then record recovery confirmation.":
    "Xem trang thai phe duyet nguoi trong workspace chu quan, hoan tat hanh dong phe duyet thu cong hop le neu can, roi ghi nhan xac nhan phuc hoi.",
  "Review publishing preparation in the owner workspace, complete only the valid manual publishing action if needed, then record recovery confirmation.":
    "Xem chuan bi dang trong workspace chu quan, chi hoan tat hanh dong dang thu cong hop le neu can, roi ghi nhan xac nhan phuc hoi.",
  "Review the performance workspace, complete the valid manual feedback/report/learning action if needed, then record recovery confirmation.":
    "Xem workspace hieu suat, hoan tat hanh dong phan hoi/bao cao/bai hoc thu cong hop le neu can, roi ghi nhan xac nhan phuc hoi.",
  "Review the failed operation and record recovery confirmation only after the operator has handled the issue outside workflow ownership.":
    "Xem thao tac loi va chi ghi nhan xac nhan phuc hoi sau khi operator da xu ly van de ben ngoai quyen so huu cua Workflow.",
  "Open the owner workspace, complete the valid manual action if needed, then record recovery confirmation.":
    "Mo workspace chu quan, hoan tat hanh dong thu cong hop le neu can, roi ghi nhan xac nhan phuc hoi.",
  "The local runtime uses SQLite and local filesystem storage. Data and media persist across local restarts.":
    "Runtime cuc bo dung SQLite va luu tru tren he thong tep. Du lieu va media duoc giu lai qua cac lan khoi dong lai cuc bo.",
  "Manual recovery confirmation recorded": "Da ghi nhan xac nhan phuc hoi",
  "Administration settings updated": "Da cap nhat cau hinh Administration",
  "Local backup created": "Da tao backup cuc bo",
  "Local media stored": "Da luu media cuc bo",
  "Local media rejected": "Media cuc bo bi tu choi",
  "Unexpected publishing acceptance": "Publishing duoc chap nhan bat ngo",
  "Workflow recovery confirmation recorded":
    "Da ghi nhan xac nhan phuc hoi quy trinh",
  "Performance metrics imported": "Da import so lieu hieu suat",
  "Analytics report recorded": "Da ghi nhan bao cao phan tich"
};

export function localizeValue(
  value: string | undefined,
  language: OperatorLanguage
): string {
  if (!value || language === "en") return value ?? "";

  const exact = valueTranslations[value];
  if (exact) return exact;

  return value
    .replace(/^Review for /, "Duyet cho ")
    .replace(/^Manual package for /, "Goi thu cong cho ")
    .replace(/^Performance import for /, "Import hieu suat cho ")
    .replace(/^Learning summary for /, "Tong ket bai hoc cho ")
    .replace(/^Recovery for /, "Phuc hoi cho ")
    .replace(/^Created /, "Da tao ")
    .replace(/^Recorded /, "Da ghi nhan ")
    .replace(
      /^Updated CMS project settings for /,
      "Da cap nhat cau hinh CMS cho "
    )
    .replace(/^Stored /, "Da luu ");
}
