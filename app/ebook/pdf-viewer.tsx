"use client";

export default function PDFViewer() {
  return (
    <>
      <div style={{
        backgroundColor: "#f0f0f0",
        border: "2px solid #d4af37",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
        minHeight: "600px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}>
        <iframe
          src="/ebook.pdf"
          style={{
            width: "100%",
            height: "600px",
            border: "none",
            borderRadius: "4px",
          }}
          title="머니시프트 전자책"
        />
      </div>

      <div style={{
        backgroundColor: "#f0f0f0",
        border: "2px solid #d4af37",
        borderRadius: "8px",
        padding: "15px",
        textAlign: "center",
        color: "#666",
        fontSize: "14px",
      }}>
        💡 브라우저 기본 PDF 뷰어를 사용합니다. 페이지 네비게이션은 PDF 뷰어의 컨트롤을 사용해주세요.
      </div>
    </>
  );
}
