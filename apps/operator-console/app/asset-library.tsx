"use client";

import { useEffect, useMemo, useState } from "react";
import type { OperatorCopy, OperatorLanguage } from "./i18n.js";

type Asset = {
  id: string;
  ownerServiceId: string;
  entityType: string;
  label: string;
  status: string;
};

type AssetLibraryProps = {
  assets: Asset[];
  language: OperatorLanguage;
  text: OperatorCopy;
};
const STATUS_OPTIONS = ["draft", "ready", "published", "archived"] as const;

type SortOption = "label-asc" | "label-desc" | "status-asc" | "id-asc";

export function AssetLibrary({ assets, text }: AssetLibraryProps) {
  const [editableAssets, setEditableAssets] = useState(assets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("label-asc");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");

  const availableStatuses = useMemo(() => {
    return Array.from(
      new Set(
        editableAssets
          .map((asset) => asset.status.trim())
          .filter((status) => status.length > 0)
      )
    ).sort((firstStatus, secondStatus) =>
      firstStatus.localeCompare(secondStatus)
    );
  }, [assets]);

  const normalizedSearch = search.trim().toLowerCase();

  const visibleAssets = useMemo(() => {
    const filteredAssets = editableAssets.filter((asset) => {
      const searchableText = [
        asset.label,
        asset.id,
        asset.ownerServiceId,
        asset.status
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || asset.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filteredAssets].sort((firstAsset, secondAsset) => {
      switch (sortOption) {
        case "label-desc":
          return secondAsset.label.localeCompare(firstAsset.label);

        case "status-asc":
          return firstAsset.status.localeCompare(secondAsset.status);

        case "id-asc":
          return firstAsset.id.localeCompare(secondAsset.id);

        case "label-asc":
        default:
          return firstAsset.label.localeCompare(secondAsset.label);
      }
    });
  }, [editableAssets, normalizedSearch, statusFilter, sortOption]);

  const selectedAsset =
    editableAssets.find((asset) => asset.id === selectedAssetId) ?? null;
  useEffect(() => {
    if (selectedAssetId === null) {
      return;
    }

    const isStillVisible = visibleAssets.some(
      (asset) => asset.id === selectedAssetId
    );

    if (!isStillVisible) {
      setSelectedAssetId(null);
      setIsEditing(false);
      setDraftStatus("");
    }
  }, [selectedAssetId, visibleAssets]);

  const hasActiveControls =
    search.length > 0 || statusFilter !== "all" || sortOption !== "label-asc";

  function handleReset() {
    setSearch("");
    setStatusFilter("all");
    setSortOption("label-asc");
  }

  function handleSelectAsset(assetId: string) {
    setSelectedAssetId(assetId);
    setIsEditing(false);
    setDraftStatus("");
  }

  function handleCloseDetail() {
    setSelectedAssetId(null);
    setIsEditing(false);
    setDraftStatus("");
  }
  function handleStartEdit() {
    if (!selectedAsset) {
      return;
    }

    setDraftStatus(selectedAsset.status);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setDraftStatus("");
    setIsEditing(false);
  }

  function handleSaveEdit() {
    if (!selectedAsset) {
      return;
    }

    setEditableAssets((previousAssets) =>
      previousAssets.map((asset) =>
        asset.id === selectedAsset.id
          ? {
              ...asset,
              status: draftStatus
            }
          : asset
      )
    );

    setDraftStatus("");
    setIsEditing(false);
  }
  return (
    <>
      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          marginBottom: "1rem"
        }}
      >
        <input
          type="search"
          placeholder={text.pages.assetLibrary.searchPlaceholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label={text.pages.assetLibrary.searchAria}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #d0d7de",
            fontSize: "0.95rem"
          }}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label={text.pages.assetLibrary.filterAria}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #d0d7de",
            background: "#ffffff",
            fontSize: "0.95rem"
          }}
        >
          <option value="all">{text.pages.assetLibrary.allStatuses}</option>

          {availableStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value as SortOption)}
          aria-label={text.pages.assetLibrary.sortAria}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #d0d7de",
            background: "#ffffff",
            fontSize: "0.95rem"
          }}
        >
          <option value="label-asc">{text.pages.assetLibrary.labelAsc}</option>
          <option value="label-desc">
            {text.pages.assetLibrary.labelDesc}
          </option>
          <option value="status-asc">
            {text.pages.assetLibrary.statusAsc}
          </option>
          <option value="id-asc">{text.pages.assetLibrary.idAsc}</option>
        </select>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap"
          }}
        >
          <div className="meta">
            {text.pages.assetLibrary.showing} {visibleAssets.length}{" "}
            {text.pages.assetLibrary.of} {editableAssets.length}{" "}
            {text.pages.assetLibrary.assets}
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={!hasActiveControls}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              border: "1px solid #d0d7de",
              background: hasActiveControls ? "#ffffff" : "#f6f8fa",
              cursor: hasActiveControls ? "pointer" : "not-allowed",
              opacity: hasActiveControls ? 1 : 0.6,
              fontSize: "0.9rem",
              fontWeight: 600
            }}
          >
            {text.common.reset}
          </button>
        </div>
      </div>

      {visibleAssets.length > 0 ? (
        <div className="record-list">
          {visibleAssets.map((record) => {
            const isSelected = record.id === selectedAssetId;

            return (
              <button
                type="button"
                key={`${record.ownerServiceId}:${record.id}`}
                onClick={() => handleSelectAsset(record.id)}
                aria-pressed={isSelected}
                style={{
                  width: "100%",
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <article
                  className="record"
                  style={{
                    outline: isSelected ? "2px solid #0969da" : "none",
                    outlineOffset: isSelected ? "2px" : "0"
                  }}
                >
                  <strong>{record.label}</strong>

                  <div className="meta">{record.id}</div>

                  <div className="meta">
                    {authorityLabel(record.ownerServiceId, text)} -{" "}
                    {record.status}
                  </div>
                </article>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="empty">{text.pages.assetLibrary.noAssetsFound}</div>
      )}

      {selectedAsset ? (
        <section
          aria-labelledby="asset-detail-title"
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #d0d7de",
            borderRadius: "10px",
            background: "#f6f8fa"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              marginBottom: "1rem"
            }}
          >
            <h3
              id="asset-detail-title"
              style={{
                margin: 0,
                fontSize: "1rem"
              }}
            >
              {text.pages.assetLibrary.detail}
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexWrap: "wrap"
              }}
            >
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={draftStatus === selectedAsset.status}
                    style={{
                      padding: "0.55rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #0969da",
                      background:
                        draftStatus === selectedAsset.status
                          ? "#f6f8fa"
                          : "#0969da",
                      color:
                        draftStatus === selectedAsset.status
                          ? "#57606a"
                          : "#ffffff",
                      cursor:
                        draftStatus === selectedAsset.status
                          ? "not-allowed"
                          : "pointer",
                      opacity: draftStatus === selectedAsset.status ? 0.65 : 1,
                      fontSize: "0.85rem",
                      fontWeight: 600
                    }}
                  >
                    {text.common.save}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      padding: "0.55rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #d0d7de",
                      background: "#ffffff",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600
                    }}
                  >
                    {text.common.cancel}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  style={{
                    padding: "0.55rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #0969da",
                    background: "#0969da",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}
                >
                  {text.common.edit}
                </button>
              )}

              <button
                type="button"
                onClick={handleCloseDetail}
                style={{
                  padding: "0.55rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid #d0d7de",
                  background: "#ffffff",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600
                }}
              >
                {text.common.close}
              </button>
            </div>
          </div>

          <dl
            style={{
              display: "grid",
              gap: "0.75rem",
              margin: 0
            }}
          >
            <div>
              <dt
                style={{
                  fontWeight: 700,
                  marginBottom: "0.2rem"
                }}
              >
                {text.pages.assetLibrary.label}
              </dt>
              <dd style={{ margin: 0 }}>{selectedAsset.label}</dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: 700,
                  marginBottom: "0.2rem"
                }}
              >
                {text.common.id}
              </dt>
              <dd style={{ margin: 0 }}>{selectedAsset.id}</dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: 700,
                  marginBottom: "0.2rem"
                }}
              >
                {text.pages.assetLibrary.authority}
              </dt>
              <dd style={{ margin: 0 }}>
                {authorityLabel(selectedAsset.ownerServiceId, text)}
              </dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: 700,
                  marginBottom: "0.2rem"
                }}
              >
                {text.pages.assetLibrary.entityType}
              </dt>
              <dd style={{ margin: 0 }}>{selectedAsset.entityType}</dd>
            </div>

            <div>
              <dt
                style={{
                  fontWeight: 700,
                  marginBottom: "0.2rem"
                }}
              >
                {text.pages.assetLibrary.status}
              </dt>
              <dd style={{ margin: 0 }}>
                {isEditing ? (
                  <select
                    value={draftStatus}
                    onChange={(event) => setDraftStatus(event.target.value)}
                    aria-label={text.pages.assetLibrary.editStatus}
                    style={{
                      marginTop: "0.25rem",
                      padding: "0.55rem",
                      borderRadius: "8px",
                      border: "1px solid #d0d7de",
                      background: "#ffffff",
                      minWidth: "180px"
                    }}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  selectedAsset.status
                )}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}
    </>
  );
}

function authorityLabel(ownerServiceId: string, text: OperatorCopy): string {
  const labels: Record<string, string> = {
    "FTV-SVC-01": "Source & Asset Registry",
    "FTV-SVC-02": "Media Management",
    "FTV-SVC-03": "Content Production",
    "FTV-SVC-04": "Publishing Preparation",
    "FTV-SVC-05": "Human Review",
    "FTV-SVC-06": "Performance Data",
    "FTV-SVC-07": "Analytics Reporting",
    "FTV-SVC-08": "Workflow Orchestration",
    "FTV-SVC-09": "Governance",
    "FTV-SVC-10": "Configuration",
    "FTV-SVC-11": "Core Data Administration"
  };

  return labels[ownerServiceId] ?? text.pages.assetLibrary.cmsService;
}
