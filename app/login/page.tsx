"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error, data } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const errorMessage = error.message || "로그인 실패";
        const errorCode = error.code || "unknown";
        const fullError = `${errorMessage} (${errorCode})`;
        setError(fullError);
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.push("/content");
      } else {
        setError("세션이 생성되지 않았습니다");
        setLoading(false);
      }
    } catch (err: any) {
      const errorMsg = err?.message || err?.toString() || "알 수 없는 오류";
      setError(`오류: ${errorMsg}`);
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", backgroundColor: "#ffffff", color: "#000000" }}>
      <h1 style={{ color: "#d4af37", textAlign: "center" }}>로그인</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              boxSizing: "border-box",
              border: "1px solid #cccccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              boxSizing: "border-box",
              border: "1px solid #cccccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            backgroundColor: loading ? "#cccccc" : "#d4af37",
            color: "#000000",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      {error && <p style={{ color: "#cc0000", marginTop: "15px", textAlign: "center" }}>{error}</p>}
      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
        계정이 없으신가요?{" "}
        <Link href="/signup" style={{ color: "#d4af37", textDecoration: "none", fontWeight: "bold" }}>
          회원가입
        </Link>
      </p>
    </div>
  );
}
