"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EbookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div style={{ padding: "20px" }}>로딩 중...</div>;
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50px", backgroundColor: "#ffffff", zIndex: 100, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid #d4af37" }}>
        <button
          onClick={() => router.push("/content")}
          style={{
            backgroundColor: "#d4af37",
            color: "#000000",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          ← 돌아가기
        </button>
      </div>
      <iframe
        src="/lecture-ebook.html"
        style={{
          position: "absolute",
          top: "50px",
          left: 0,
          right: 0,
          bottom: 0,
          border: "none",
          width: "100%",
          height: "calc(100% - 50px)",
        }}
        title="강의용 전자책"
      />
    </div>
  );
}
