"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VIDEOS, getVimeoEmbedUrl } from "@/app/videos-config";

export default function ContentPage() {
  const router = useRouter();
  const [selectedVideoId, setSelectedVideoId] = useState<string>(VIDEOS[0].id);

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#000000", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ color: "#d4af37", marginBottom: "40px" }}>콘텐츠</h1>

        <div style={{ marginBottom: "30px" }}>
          <button
            onClick={() => router.push("/ebook")}
            style={{
              width: "100%",
              padding: "40px 20px",
              backgroundColor: "#f0f0f0",
              border: "2px solid #d4af37",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#000000",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#e8e8e8";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#f0f0f0";
            }}
          >
            📖 전자책 읽기
          </button>
        </div>

        <div>
          <h2 style={{ color: "#d4af37", marginBottom: "20px" }}>강의</h2>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
              {VIDEOS.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideoId(video.id)}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: selectedVideoId === video.id ? "#d4af37" : "#f0f0f0",
                    color: selectedVideoId === video.id ? "#000000" : "#000000",
                    border: `2px solid ${selectedVideoId === video.id ? "#d4af37" : "#cccccc"}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: selectedVideoId === video.id ? "bold" : "normal",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedVideoId !== video.id) {
                      (e.target as HTMLButtonElement).style.backgroundColor = "#e8e8e8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedVideoId !== video.id) {
                      (e.target as HTMLButtonElement).style.backgroundColor = "#f0f0f0";
                    }
                  }}
                >
                  {video.title}
                </button>
              ))}
            </div>

            <div style={{
              backgroundColor: "#f0f0f0",
              border: "2px solid #d4af37",
              borderRadius: "8px",
              padding: "20px",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {(() => {
                const selectedVideo = VIDEOS.find(v => v.id === selectedVideoId);
                return selectedVideo ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={getVimeoEmbedUrl(selectedVideo.vimeoId, selectedVideo.vimeoHash)}
                    title={`${selectedVideo.title} - Vimeo video player`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ borderRadius: "4px" }}
                  />
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
