"use client";

import { useEffect, useCallback, useState } from "react";

interface ReadingProgress {
  page: number;
  device_type: string;
  last_read_at?: string;
}

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reading-progress");

      if (response.status === 401) {
        setProgress(null);
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error("Failed to load reading progress");

      const data = await response.json();
      setProgress(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProgress = useCallback(
    async (page: number, deviceType: string = "pc") => {
      try {
        const response = await fetch("/api/reading-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_number: page,
            device_type: deviceType,
          }),
        });

        if (!response.ok) throw new Error("Failed to save reading progress");

        const data = await response.json();
        setProgress({
          page: data.page,
          device_type: deviceType,
          last_read_at: new Date().toISOString(),
        });
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save progress";
        setError(message);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    loading,
    error,
    saveProgress,
    loadProgress,
  };
}
