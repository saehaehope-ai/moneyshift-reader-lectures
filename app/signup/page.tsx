"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const urlExists = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const keyExists = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      console.log("[Signup Diagnosis] Environment variables:", { urlExists, keyExists });

      const supabase = createClient();

      const { error, data } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            approved: false,
          },
        },
      });

      if (error) {
        const errorMessage = error.message || "회원가입 실패";
        const errorCode = error.code || "unknown";
        const fullError = `${errorMessage} (${errorCode})`;
        setError(fullError);
        setLoading(false);
        return;
      }

      if (data?.user) {
        setError("");
        router.push("/signup-pending");
      } else {
        setError("계정이 생성되지 않았습니다");
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
      <h1 style={{ color: "#d4af37", textAlign: "center" }}>회원가입</h1>
      <form onSubmit={handleSignup}>
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
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>
      {error && <p style={{ color: "#cc0000", marginTop: "15px", textAlign: "center" }}>{error}</p>}
      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
        이미 계정이 있으신가요?{" "}
        <Link href="/login" style={{ color: "#d4af37", textDecoration: "none", fontWeight: "bold" }}>
          로그인
        </Link>
      </p>
    </div>
  );
}
