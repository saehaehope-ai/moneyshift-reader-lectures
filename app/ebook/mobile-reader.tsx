"use client";

import { useEffect, useState } from "react";
import { useReadingProgress } from "@/lib/hooks/useReadingProgress";

const TOTAL_PAGES = 240;
const LOCAL_CACHE_KEY = "moneyshift_mobile_reading_cache";

export default function MobileReader() {
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(20);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { progress, loading: progressLoading, saveProgress } =
    useReadingProgress();
  const [pageInitialized, setPageInitialized] = useState(false);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [lastSavedPage, setLastSavedPage] = useState<number | null>(null);

  // Initialize page from reading progress
  useEffect(() => {
    if (!progressLoading && !pageInitialized) {
      // If we have a progress from this device, restore it
      if (progress && progress.device_type === "mobile") {
        const savedPage = Math.min(progress.page, TOTAL_PAGES);
        setCurrentPage(savedPage);
        setLastSavedPage(savedPage);
        // Show resume banner if not on first page
        if (savedPage > 1) {
          setShowResumeBanner(true);
        }
        setPageInitialized(true);
        setLoading(false);
      } else {
        // No mobile progress found, check localStorage cache
        try {
          const cached = localStorage.getItem(LOCAL_CACHE_KEY);
          if (cached) {
            const cachedPage = Math.min(parseInt(cached, 10), TOTAL_PAGES);
            if (cachedPage > 1) {
              setCurrentPage(cachedPage);
              setLastSavedPage(cachedPage);
              setShowResumeBanner(true);
            }
          }
        } catch (e) {
          // localStorage unavailable
        }
        setPageInitialized(true);
        setLoading(false);
      }
    }
  }, [progressLoading, progress, pageInitialized]);

  // Save progress when page changes (debounced)
  useEffect(() => {
    if (!pageInitialized) return;

    const timer = setTimeout(() => {
      // Update localStorage cache immediately (for offline fallback)
      try {
        localStorage.setItem(LOCAL_CACHE_KEY, String(currentPage));
      } catch (e) {
        // localStorage unavailable
      }

      // Save to server
      saveProgress(currentPage, "mobile")
        .then(() => {
          setLastSavedPage(currentPage);
          console.log(`[mobile-reader] Progress saved: page ${currentPage}`);
        })
        .catch((err) => {
          console.error("Failed to save mobile reading progress:", err);
          // localStorage is already updated as fallback
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, pageInitialized, saveProgress]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES) setCurrentPage(currentPage + 1);
  };

  const handleFontSizeDown = () => {
    setFontSize(Math.max(14, fontSize - 2));
  };

  const handleFontSizeUp = () => {
    setFontSize(Math.min(24, fontSize + 2));
  };

  const progressPercent = (currentPage / TOTAL_PAGES) * 100;
  const progressRatio = currentPage / TOTAL_PAGES;

  // Updated color palette (v2)
  const colors = {
    bg: "#F8F4EA",
    paper: "#FFFBF5",
    ink: "#1B1A17",
    inkSoft: "#4A473F",
    gold: "#A9812E",
    goldSoft: "#C9AE79",
    hairline: "#E4DCC8",
    resumeBg: "#F1EBDA",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "430px",
        margin: "0 auto",
        height: "100vh",
        backgroundColor: colors.paper,
        color: colors.ink,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 0 60px rgba(0,0,0,.05)",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          height: "54px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: `1px solid ${colors.hairline}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
          <span
            style={{
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: ".28em",
              color: colors.gold,
            }}
          >
            MONEY SHIFT
          </span>
          <span
            style={{
              fontFamily: '"Noto Serif KR", serif',
              fontWeight: 700,
              fontSize: "15px",
              marginTop: "2px",
            }}
          >
            머니시프트
          </span>
        </div>

        {/* Font Size Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <button
            onClick={handleFontSizeDown}
            disabled={fontSize <= 14}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: `1px solid ${colors.hairline}`,
              backgroundColor: colors.paper,
              color: colors.ink,
              fontFamily: '"Noto Sans KR", sans-serif',
              fontWeight: 700,
              cursor: fontSize <= 14 ? "default" : "pointer",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: fontSize <= 14 ? 0.35 : 1,
            }}
          >
            가⁻
          </button>
          <button
            onClick={handleFontSizeUp}
            disabled={fontSize >= 24}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: `1px solid ${colors.hairline}`,
              backgroundColor: colors.paper,
              color: colors.ink,
              fontFamily: '"Noto Sans KR", sans-serif',
              fontWeight: 700,
              cursor: fontSize >= 24 ? "default" : "pointer",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: fontSize >= 24 ? 0.35 : 1,
            }}
          >
            가⁺
          </button>
        </div>
      </div>

      {/* Resume Banner */}
      {showResumeBanner && lastSavedPage && lastSavedPage > 1 && (
        <div
          style={{
            backgroundColor: colors.resumeBg,
            borderBottom: `1px solid ${colors.hairline}`,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: colors.inkSoft,
              fontFamily: '"Noto Serif KR", serif',
            }}
          >
            {lastSavedPage}페이지에서 계속 읽기
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => {
                setCurrentPage(lastSavedPage);
                setShowResumeBanner(false);
              }}
              style={{
                fontFamily: '"Noto Serif KR", serif',
                fontSize: "13px",
                color: colors.paper,
                backgroundColor: colors.ink,
                border: "none",
                borderRadius: "3px",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              이어보기
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              style={{
                fontFamily: '"Noto Serif KR", serif',
                fontSize: "13px",
                color: colors.inkSoft,
                backgroundColor: "transparent",
                border: "none",
                padding: "6px 4px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div
        style={{
          height: "3px",
          backgroundColor: colors.hairline,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: colors.gold,
            width: `${progressPercent}%`,
            transition: "width 0.25s ease",
          }}
        />
      </div>

      {/* Page Display */}
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "auto",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
        }}
      >
        {imageError ? (
          <div
            style={{
              padding: "26px 24px",
              textAlign: "center",
              color: colors.gold,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>페이지를 불러올 수 없습니다.</p>
            <p style={{ fontSize: "12px", color: colors.inkSoft }}>
              {currentPage} / {TOTAL_PAGES}
            </p>
          </div>
        ) : (
          <img
            src={`/ebook-pages/page-${currentPage}.webp`}
            alt={`Page ${currentPage}`}
            onError={() => setImageError(true)}
            onLoad={() => {
              setImageError(false);
              setLoading(false);
            }}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              transform: `scale(${fontSize / 20})`,
              transformOrigin: "top center",
            }}
          />
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div
        style={{
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          borderTop: `1px solid ${colors.hairline}`,
          flexShrink: 0,
          backgroundColor: colors.paper,
        }}
      >
        <button
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "999px",
            border: `1px solid ${colors.hairline}`,
            backgroundColor: colors.paper,
            color: colors.ink,
            fontSize: "17px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: currentPage <= 1 ? "default" : "pointer",
            opacity: currentPage <= 1 ? 0.3 : 1,
          }}
        >
          ‹
        </button>

        <div
          style={{
            fontFamily: '"Noto Sans KR", sans-serif',
            fontSize: "12.5px",
            color: colors.inkSoft,
            fontVariantNumeric: "tabular-nums",
            minWidth: "64px",
            textAlign: "center",
          }}
        >
          {currentPage} / {TOTAL_PAGES}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage >= TOTAL_PAGES}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "999px",
            border: `1px solid ${colors.hairline}`,
            backgroundColor: colors.paper,
            color: colors.ink,
            fontSize: "17px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: currentPage >= TOTAL_PAGES ? "default" : "pointer",
            opacity: currentPage >= TOTAL_PAGES ? 0.3 : 1,
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
