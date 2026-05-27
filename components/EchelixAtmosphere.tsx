/**
 * EchelixAtmosphere — global background that mirrors the Echelix card art.
 *
 * Visual stack (back → front):
 *   1. Dark gradient base (#000 → #020505)
 *   2. Two large soft teal/mint radial glows (top-right + bottom-left)
 *   3. Faint diagonal teal light streaks, slowly drifting
 *   4. Subtle noise/texture overlay via inline SVG turbulence
 *   5. Back dotted wave — sparser, dimmer, more receded (sits deeper)
 *   6. Front dotted wave — denser, brighter, glowing
 *
 * All CSS — no images, no canvas, no JS. Renders once at the root of
 * the layout. Position: fixed, z-index: -10 so it sits behind every
 * page's content. Animations respect prefers-reduced-motion.
 */
export function EchelixAtmosphere() {
  return (
    <div className="echelix-atmosphere" aria-hidden="true">
      <div className="echelix-streaks" />
      <div className="echelix-noise" />
      <div className="echelix-wave-back" />
      <div className="echelix-wave-front" />
    </div>
  );
}
