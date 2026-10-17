// `.dash-foot` is a page-level style in the design files (not in gildedglow.css),
// so its rules are inlined here.
export default function Footer() {
  return (
    <div
      className="dash-foot"
      style={{ color: "var(--gray-500)", fontSize: 13, padding: "var(--sp-8) 0 var(--sp-4)" }}
    >
      All Rights Reserved &copy; 2026{" "}
      <a href="#" style={{ fontWeight: 600 }}>
        GildedGlow
      </a>
    </div>
  );
}
