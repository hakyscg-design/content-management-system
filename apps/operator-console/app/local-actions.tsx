"use client";

import { useState } from "react";

interface OperationResult {
  readonly ok: boolean;
  readonly title: string;
  readonly message: string;
  readonly code?: string;
  readonly category?: string;
}

async function postOperation(path: string): Promise<OperationResult> {
  const response = await fetch(path, { method: "POST" });
  return (await response.json()) as OperationResult;
}

export function LocalActions() {
  const [result, setResult] = useState<OperationResult | undefined>();
  const [loading, setLoading] = useState<
    "asset" | "invalid" | "media" | undefined
  >();

  async function run(path: string, key: "asset" | "invalid" | "media") {
    setLoading(key);
    try {
      setResult(await postOperation(path));
    } catch {
      setResult({
        ok: false,
        title: "Local request failed",
        message: "The local operator console could not complete the request."
      });
    } finally {
      setLoading(undefined);
    }
  }

  return (
    <section className="panel" aria-labelledby="operations-title">
      <h2 className="panel-title" id="operations-title">
        Owner-routed operations
      </h2>
      <p className="meta">
        These actions call the local application boundary, which calls the
        accepted owning services.
      </p>
      <div className="actions">
        <button
          className="button"
          type="button"
          disabled={Boolean(loading)}
          onClick={() => void run("/api/local/asset-intake", "asset")}
        >
          {loading === "asset" ? "Submitting..." : "Submit Asset Intake"}
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={Boolean(loading)}
          onClick={() => void run("/api/local/invalid-publishing", "invalid")}
        >
          {loading === "invalid"
            ? "Checking..."
            : "Check Invalid Publishing Gate"}
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={Boolean(loading)}
          onClick={() => void run("/api/local/media-fixture", "media")}
        >
          {loading === "media" ? "Storing..." : "Add Local Media"}
        </button>
      </div>
      {result ? (
        <div
          className={`notice ${result.ok ? "success" : "error"}`}
          role="status"
        >
          <strong>{result.title}</strong>
          <div>{result.message}</div>
          {result.code ? <div className="meta">Code: {result.code}</div> : null}
        </div>
      ) : (
        <div className="empty">
          No operation has been submitted from this screen yet.
        </div>
      )}
    </section>
  );
}
