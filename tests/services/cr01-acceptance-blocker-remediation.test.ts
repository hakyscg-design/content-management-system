import { describe, expect, test } from "vitest";
import {
  createEntityReference,
  createVerifiedEntityReference,
  type EntityReference
} from "../../packages/identifiers/src/index.js";
import { AnalyticsReportingService } from "../../services/analytics-reporting/src/index.js";
import { HumanReviewApprovalService } from "../../services/human-review-approval/src/index.js";
import { MediaProcessingService } from "../../services/media-processing/src/index.js";
import { PerformanceDataService } from "../../services/performance-data/src/index.js";
import { PublishingPreparationService } from "../../services/publishing-preparation/src/index.js";

const manualAction = Object.freeze({
  actorId: "operator-cr01",
  reason: "CR-01 acceptance blocker remediation validation"
});

const contentVersionRef = createVerifiedEntityReference({
  id: "content-001:v1",
  ownerServiceId: "FTV-SVC-03",
  entityType: "ContentVersion"
});

function createApprovedApprovalRef(reviewId = "review-001"): EntityReference {
  const review = new HumanReviewApprovalService();
  review.requestReview(reviewId, contentVersionRef, manualAction);
  review.assignReviewer(reviewId, "reviewer-001", manualAction);
  review.recordDecision(reviewId, "approved", manualAction);
  return review.approvalStatusReference(reviewId);
}

function createCompletedPublishingRef(id = "publishing-001"): EntityReference {
  const publishing = new PublishingPreparationService();
  publishing.createPublishingPackage({
    id,
    contentVersionRef,
    approvalStatusRef: createApprovedApprovalRef(`${id}-review`),
    metadata: { destination: "manual" },
    action: manualAction
  });
  publishing.updateChecklist(
    id,
    {
      metadataReviewed: true,
      rightsReviewed: true,
      approvalConfirmed: true,
      exportPrepared: true
    },
    manualAction
  );
  publishing.markReady(id, manualAction);
  publishing.recordManualPublishingComplete(
    id,
    "manual-publishing-ref",
    manualAction
  );
  return publishing.publishingPackageReference(id);
}

function createPerformanceFactRef(id = "fact-001"): EntityReference {
  const performance = new PerformanceDataService();
  const publishingRef = createCompletedPublishingRef(`${id}-publishing`);
  performance.defineMetric("metric-views", "Views", "count", manualAction);
  performance.stageImport(
    "import-001",
    "manual-csv",
    publishingRef,
    manualAction
  );
  performance.recordFact(
    id,
    "import-001",
    "metric-views",
    1,
    publishingRef,
    manualAction
  );
  performance.completeImport("import-001", manualAction);
  return performance.performanceFactReference(id);
}

describe("CR-01 invalid reference remediation", () => {
  test("AT04-BLOCKER-001 rejects processing jobs for unverified asset references", () => {
    const mediaProcessing = new MediaProcessingService();
    const unknownAssetRef = createEntityReference({
      id: "missing-asset",
      ownerServiceId: "FTV-SVC-01",
      entityType: "Asset"
    });

    expect(() =>
      mediaProcessing.createJob(
        "job-orphan",
        unknownAssetRef,
        "thumbnail",
        manualAction
      )
    ).toThrow("verified by its owner service");
  });

  test("AT03 and AT04 approval blockers reject fabricated and pending approval references", () => {
    const publishing = new PublishingPreparationService();
    const fabricatedApprovalRef = createEntityReference({
      id: "missing-approval:approval",
      ownerServiceId: "FTV-SVC-05",
      entityType: "ApprovalStatus"
    });
    const review = new HumanReviewApprovalService();
    review.requestReview("review-pending", contentVersionRef, manualAction);
    const pendingApprovalRef = review.approvalStatusReference("review-pending");

    expect(() =>
      publishing.createPublishingPackage({
        id: "pub-fake-approval",
        contentVersionRef,
        approvalStatusRef: fabricatedApprovalRef,
        metadata: {},
        action: manualAction
      })
    ).toThrow("verified by its owner service");

    expect(() =>
      publishing.createPublishingPackage({
        id: "pub-pending-bypass",
        contentVersionRef,
        approvalStatusRef: pendingApprovalRef,
        metadata: {},
        action: manualAction
      })
    ).toThrow("approved approval status");
  });

  test("AT04-BLOCKER-003 rejects performance imports for unverified publishing references", () => {
    const performance = new PerformanceDataService();
    const unknownPublishingRef = createEntityReference({
      id: "missing-publishing",
      ownerServiceId: "FTV-SVC-04",
      entityType: "PublishingPackage"
    });

    expect(() =>
      performance.stageImport(
        "import-orphan",
        "manual-csv",
        unknownPublishingRef,
        manualAction
      )
    ).toThrow("verified by its owner service");
  });

  test("AT04-BLOCKER-004 rejects analytics reports for unverified performance fact references", () => {
    const analytics = new AnalyticsReportingService();
    const unknownFactRef = createEntityReference({
      id: "missing-fact",
      ownerServiceId: "FTV-SVC-06",
      entityType: "PerformanceFact"
    });

    expect(() =>
      analytics.createReport(
        "report-orphan",
        "Orphan report",
        [unknownFactRef],
        "Manual narrative",
        manualAction
      )
    ).toThrow("verified by its owner service");
  });
});

describe("CR-01 duplicate retry remediation", () => {
  test("AT04-BLOCKER-006 rejects duplicate performance facts instead of overwriting", () => {
    const performance = new PerformanceDataService();
    const publishingRef = createCompletedPublishingRef("publishing-fact-retry");
    performance.defineMetric("metric-views", "Views", "count", manualAction);
    performance.stageImport(
      "import-retry",
      "manual-csv",
      publishingRef,
      manualAction
    );
    performance.recordFact(
      "fact-retry",
      "import-retry",
      "metric-views",
      1,
      publishingRef,
      manualAction
    );

    expect(() =>
      performance.recordFact(
        "fact-retry",
        "import-retry",
        "metric-views",
        2,
        publishingRef,
        manualAction
      )
    ).toThrow("Performance fact already exists");
  });

  test("AT04-BLOCKER-007 rejects duplicate analytics reports instead of overwriting", () => {
    const analytics = new AnalyticsReportingService();
    const factRef = createPerformanceFactRef("report-retry-fact");
    analytics.createReport(
      "report-retry",
      "Initial report",
      [factRef],
      "Initial narrative",
      manualAction
    );

    expect(() =>
      analytics.createReport(
        "report-retry",
        "Replacement report",
        [factRef],
        "Replacement narrative",
        manualAction
      )
    ).toThrow("Analytics report already exists");
  });
});
