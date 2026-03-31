export default function WelcomeMessage() {
  return (
    <div style={{
      textAlign: "center",
      padding: "48px 24px 24px",
      fontFamily: "var(--font, 'Segoe UI', Arial, sans-serif)"
    }}>
      <h1 style={{
        color: "var(--maroon-dark, #5C1010)",
        fontSize: "2.4rem",
        fontWeight: 700,
        marginBottom: "12px",
        letterSpacing: "-0.5px"
      }}>
        College<span style={{ color: "var(--sandy, #C4A882)" }}>App</span>
      </h1>
      <p style={{
        color: "var(--grey-mid, #6E6666)",
        fontSize: "1.05rem",
        maxWidth: "440px",
        margin: "0 auto",
        lineHeight: 1.6
      }}>
        Track applications, research schools, and stay organized — all in one place.
      </p>
    </div>
  );
}
