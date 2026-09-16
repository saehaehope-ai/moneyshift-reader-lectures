"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReadingProgress } from "@/lib/hooks/useReadingProgress";

interface PDFDocument {
  numPages: number;
  getPage: (num: number) => Promise<{
    getViewport: (opts: { scale: number }) => { width: number; height: number };
    render: (opts: {
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
    }) => { promise: Promise<void> };
  }>;
}

declare global {
  interface Window {
    pdfjsLib?: {
      getDocument: (src: string | ArrayBuffer) => { promise: Promise<PDFDocument> };
      GlobalWorkerOptions: { workerSrc: string };
    };
  }
}

export default function SinglePageReader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(2.0);
  const [loading, setLoading] = useState(true);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [error, setError] = useState("");
  const { progress, loading: progressLoading, saveProgress } =
    useReadingProgress();
  const [pageInitialized, setPageInitialized] = useState(false);
  const lastSavedPageRef = useRef(1);

  // Load PDF.js library
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
    };
    document.head.appendChild(script);
  }, []);

  // Load PDF document
  useEffect(() => {
    const loadPDF = async () => {
      try {
        if (!window.pdfjsLib) {
          setError("PDF library not loaded");
          return;
        }

        const response = await fetch("/ebook.pdf");
        if (!response.ok) throw new Error("Failed to load PDF");

        const arrayBuffer = await response.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load PDF");
        setLoading(false);
      }
    };

    loadPDF();
  }, []);

  // Initialize page from reading progress
  useEffect(() => {
    if (!loading && !progressLoading && progress && !pageInitialized) {
      setCurrentPage(Math.min(progress.page, totalPages || 240));
      lastSavedPageRef.current = progress.page;
      setPageInitialized(true);
    }
  }, [loading, progressLoading, progress, pageInitialized, totalPages]);

  // Save reading progress (debounced)
  useEffect(() => {
    if (!pageInitialized || currentPage === lastSavedPageRef.current) return;

    const timer = setTimeout(() => {
      saveProgress(currentPage, "pc").catch((err) => {
        console.error("Failed to save progress:", err);
      });
      lastSavedPageRef.current = currentPage;
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, pageInitialized, saveProgress]);

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || loading) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext("2d");
        if (!context) return;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Render failed");
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale, loading]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#d4af37" }}>
        PDF 로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#d4af37" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* Controls */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          border: "1px solid #d4af37",
          borderRadius: "8px",
          padding: "12px 20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* Navigation */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            style={{
              padding: "8px 12px",
              backgroundColor: currentPage <= 1 ? "#cccccc" : "#d4af37",
              color: "#000000",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage <= 1 ? "default" : "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            ← 이전
          </button>

          <span style={{ fontSize: "14px", fontWeight: "bold", minWidth: "60px", textAlign: "center" }}>
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            style={{
              padding: "8px 12px",
              backgroundColor: currentPage >= totalPages ? "#cccccc" : "#d4af37",
              color: "#000000",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage >= totalPages ? "default" : "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            다음 →
          </button>
        </div>

        {/* Zoom */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setScale(Math.max(0.8, scale - 0.2))}
            style={{
              padding: "8px 12px",
              backgroundColor: "#d4af37",
              color: "#000000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            −
          </button>

          <span style={{ fontSize: "14px", minWidth: "50px", textAlign: "center" }}>
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={() => setScale(Math.min(3, scale + 0.2))}
            style={{
              padding: "8px 12px",
              backgroundColor: "#d4af37",
              color: "#000000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            +
          </button>

          {Math.abs(scale - 2.0) > 0.01 && (
            <button
              onClick={() => setScale(2.0)}
              style={{
                padding: "8px 12px",
                backgroundColor: "#d4af37",
                color: "#000000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          border: "2px solid #d4af37",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "600px",
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: "12px", color: "#666" }}>
        페이지 {currentPage} / {totalPages}
      </div>
    </div>
  );
}
