"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";

const SinglePageReader = dynamic(() => import("./single-page-reader"), {
  ssr: false,
});

const MobileReader = dynamic(() => import("./mobile-reader"), {
  ssr: false,
});

export default function EbookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>로딩 중...</div>;
  }

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#000000", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: isMobile ? "100%" : "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
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

        <h1 style={{ color: "#d4af37", marginBottom: "20px" }}>머니시프트 전자책</h1>

        {isMobile ? <MobileReader /> : <SinglePageReader />}
      </div>
    </div>
  );
}
