/**
 * EchelixBackground — fixed full-viewport canvas that mirrors the matte-
 * black + teal dotted-wave aesthetic of the Echelix promotional card.
 *
 * Visual layers (bottom → top):
 *   1. Dark vertical gradient: #020606 → #050b0b → #000
 *   2. Two soft teal radial glows (top-right + bottom-left)
 *   3. A perspective-tilted dotted mesh "wave" near the bottom edge,
 *      drop-shadowed with the glow-teal accent, masked to fade upward.
 *      Subtly animated via opacity pulse (respects prefers-reduced-motion).
 *
 * Purely presentational — no client interactivity, no scripts, no images.
 * Render once near the root of a page; positioning is fixed so it stays
 * behind content as the page scrolls.
 */
export function EchelixBackground() {
  return (
    <div className="echelix-bg" aria-hidden="true">
      <div className="echelix-wave" />
    </div>
  );
}
