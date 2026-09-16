"use client";

import Link from "next/link";

export default function SignupPendingPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", backgroundColor: "#ffffff", color: "#000000" }}>
      <h1 style={{ color: "#d4af37", textAlign: "center" }}>회원가입 완료</h1>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          계정이 생성되었습니다.
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#666" }}>
          등록하신 이메일을 확인해주세요.
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6", marginTop: "30px" }}>
          이메일의 인증 링크를 클릭하면 바로 콘텐츠를 이용할 수 있습니다.
        </p>
      </div>
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Link
          href="/login"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#d4af37",
            color: "#000000",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          로그인
        </Link>
      </div>
    </div>
  );
}
