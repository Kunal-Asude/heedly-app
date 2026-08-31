// Aubade — the shared signature orb (the brand's "default tank" glass sphere).
// Welcome, Today, and Paywall ALL render this one component so the orb can't drift.
//   • Omit `water`  → the full, luminous default orb (Welcome + Paywall logo orb).
//   • Pass `water`  → the same sphere with Today's per-state tank fill layered in.
// Size is controlled by the wrapper CSS (.ob-orb / .orb-wrap / .pw-orb), never here.
function Orb({ water, bubbles }) {
  const bb = bubbles || [
    { w: 7, left: "44%", dur: "5.8s", delay: ".4s" },
    { w: 5, left: "56%", dur: "6.8s", delay: "2.4s" }];

  return (
    <div className="orb">
      <div className="glass"></div>
      <div className="liquid">
        {water ? <div className="water-host" dangerouslySetInnerHTML={{ __html: water }}></div> : null}
        {bb.map((b, i) =>
        <span key={i} className="bubble" style={{ width: b.w + "px", height: b.w + "px", left: b.left, animationDuration: b.dur, animationDelay: b.delay }}></span>
        )}
      </div>
      <div className="blooms"><span className="b1"></span><span className="b2"></span><span className="b3"></span></div>
    </div>);

}

window.Orb = Orb;
