"use client";

import { useState } from "react";
import {
  localizeValue,
  type OperatorCopy,
  type OperatorLanguage
} from "./i18n.js";

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

export function LocalActions({
  language,
  text
}: {
  readonly language: OperatorLanguage;
  readonly text: OperatorCopy;
}) {
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
        title: text.pages.localActions.requestFailedTitle,
        message: text.pages.localActions.requestFailedMessage
      });
    } finally {
      setLoading(undefined);
    }
  }

  return (
    <section className="panel" aria-labelledby="operations-title">
      <h2 className="panel-title" id="operations-title">
        {text.pages.localActions.title}
      </h2>
      <p className="meta">{text.pages.localActions.copy}</p>
      <div className="actions">
        <button
          className="button"
          type="button"
          disabled={Boolean(loading)}
          onClick={() => void run("/api/local/asset-intake", "asset")}
        >
          {loading === "asset"
            ? text.pages.localActions.submitting
            : text.pages.localActions.submitAsset}
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={Boolean(loading)}
          onClick={() => void run("/api/local/invalid-publishing", "invalid")}
        >
          {loading === "invalid"
            ? text.pages.localActions.checking
            : text.pages.localActions.checkInvalid}
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={Boolean(loading)}
          onClick={() => void run("/api/local/media-fixture", "media")}
        >
          {loading === "media"
            ? text.pages.localActions.storing
            : text.pages.localActions.addMedia}
        </button>
      </div>
      {result ? (
        <div
          className={`notice ${result.ok ? "success" : "error"}`}
          role="status"
        >
          <strong>{localizeValue(result.title, language)}</strong>
          <div>{localizeValue(result.message, language)}</div>
          {result.code ? (
            <div className="meta">
              {text.common.code}: {result.code}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="empty">{text.pages.localActions.empty}</div>
      )}
    </section>
  );
}
