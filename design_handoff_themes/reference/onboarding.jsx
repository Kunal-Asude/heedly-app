// Aubade — Onboarding screens (Aubade style). Exports OnboardingScreen + ONBOARDING to window.
(function () {
  const { useState } = React;

  // ── Brand / step icons (soft line glyphs) ──────────────────
  function OIcon({ name }) {
    const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
    switch (name) {
      case "ring":  return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3.4" /></svg>;
      case "watch": return <svg viewBox="0 0 24 24" {...s}><rect x="6.5" y="6.5" width="11" height="11" rx="3.2" /><path d="M9 6.5l.6-2.2h4.8L15 6.5M9 17.5l.6 2.2h4.8l.6-2.2" /></svg>;
      case "heart": return <svg viewBox="0 0 24 24" {...s}><path d="M12 19s-6.2-3.8-8-7.6C2.4 8.1 4 5.3 7 5.3c1.9 0 3 1.1 5 3.2 2-2.1 3.1-3.2 5-3.2 3 0 4.6 2.8 3 6.1-1.8 3.8-8 7.6-8 7.6z" /></svg>;
      case "clock": return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="7.5" /><path d="M12 8v4.4l2.8 1.8" /></svg>;
      case "band":  return <svg viewBox="0 0 24 24" {...s}><rect x="3.5" y="8.5" width="17" height="7" rx="3.5" /><path d="M8 8.5v7M16 8.5v7" /></svg>;
      case "wave":  return <svg viewBox="0 0 24 24" {...s}><path d="M3 12h3l2-5 4 11 2.5-7H21" /></svg>;
      case "check": return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
      case "arrow": return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 5l7 7-7 7" /></svg>;
      default: return null;
    }
  }

  // ── The shared signature glass orb (the brand's "default tank") ──
  function OrbPlain() {
    const Orb = window.Orb;
    return (
      <div className="ob-orb">
        <Orb />
      </div>
    );
  }

  function Progress({ step }) {
    // 3 mid-flow steps: wearable(0), wearable(0), condition(1)
    return (
      <div className="ob-progress" aria-hidden="true">
        {[0, 1, 2].map((i) => <i key={i} className={i === step ? "on" : ""}></i>)}
      </div>
    );
  }

  const WEARABLES = [
    { id: "oura", name: "Oura", icon: "ring" },
    { id: "watch", name: "Apple Watch", icon: "watch" },
    { id: "health", name: "Apple Health", icon: "heart", meta: "Fitbit, Polar, Withings & more" },
    { id: "garmin", name: "Garmin", icon: "clock" },
    { id: "whoop", name: "Whoop", icon: "band" },
    { id: "other", name: "Other", icon: "wave" },
  ];

  const CONDITIONS = ["ME/CFS", "Long COVID", "POTS", "Fibromyalgia", "Dysautonomia", "MCAS", "Something else"];

  function WearableGrid({ connectedId, waitingId }) {
    const [conn, setConn] = useState(connectedId || null);
    return (
      <div className="ob-grid">
        {WEARABLES.map((w) => {
          const isOn = conn === w.id;
          const isWaiting = waitingId === w.id;
          return (
            <button key={w.id} className={"ob-card" + (isOn ? " connected" : "") + (isWaiting ? " waiting" : "")} onClick={() => setConn(isOn ? null : w.id)}>
              <span className="ic"><OIcon name={w.icon} /></span>
              <span className="nm">{w.name}</span>
              {w.meta && <span className="meta">{w.meta}</span>}
              <span className="act">{isWaiting ? "No data yet" : isOn ? <><OIcon name="check" /> Connected</> : "Connect"}</span>
            </button>
          );
        })}
      </div>
    );
  }

  function ConditionChips({ initial }) {
    const [sel, setSel] = useState(new Set(initial));
    const toggle = (c) => { const n = new Set(sel); n.has(c) ? n.delete(c) : n.add(c); setSel(n); };
    return (
      <div className="ob-chips">
        {CONDITIONS.map((c) => {
          const on = sel.has(c);
          return (
            <button key={c} className={"ob-chip" + (on ? " sel" : "")} aria-pressed={on} onClick={() => toggle(c)}>
              <span className="ring">{on && <OIcon name="check" />}</span>
              <span>{c}</span>
            </button>
          );
        })}
      </div>
    );
  }

  function OnboardingScreen({ data }) {
    switch (data.key) {
      case "welcome":
        return (
          <div className="screen">
            <div className="ob center">
              <OrbPlain />
              <img className="wordmark" src="uploads/heedly-warm-ink.png" alt="heedly" style={{ flexGrow: 0.05 }} />
              <div className="tagline">Works lying down.</div>
              <p className="lead">Your energy companion for ME/CFS, Long&nbsp;COVID, POTS, Fibromyalgia and related conditions.</p>
              <button className="ob-cta">Get started<span className="arr"><OIcon name="arrow" /></span></button>
              <p className="ob-foot">No account needed. Your data is private by default, and we don't sell your data.</p>
            </div>
          </div>
        );

      case "wearable":
      case "connected": {
        const isConnected = data.key === "connected";
        return (
          <div className="screen">
            <div className="ob">
              <Progress step={0} />
              <h2 className="ob-h">Connect your <em>wearable.</em></h2>
              <p className="ob-sub">heedly reads your data quietly in the background.</p>
              <WearableGrid connectedId={isConnected ? "oura" : null} />
              <p className="ob-foot" style={{ marginTop: "26px" }}>
                Skip for now — <span className="ob-link">you can connect later</span>
              </p>
            </div>
          </div>
        );
      }

      case "nodata":
        return (
          <div className="screen">
            <div className="ob nd-behind">
              <Progress step={0} />
              <h2 className="ob-h">Connect your <em>wearable.</em></h2>
              <p className="ob-sub">heedly reads your data quietly in the background.</p>
              <WearableGrid waitingId="oura" />
            </div>
            <div className="nd-scrim"></div>
            <div className="nd-sheet">
              <div className="nd-grip"></div>
              <h3>No data <em>coming through.</em></h3>
              <p className="nd-body">heedly reads your Oura data through <b>Apple Health</b>, and nothing has arrived yet.</p>
              <ul className="nd-steps">
                <li><span className="n">1</span><p>In <b>Apple Health → Sharing → Apps → heedly</b>, turn on sleep, heart rate and activity.</p></li>
                <li><span className="n">2</span><p>Open the <b>Oura app</b> once so it writes today's data across.</p></li>
              </ul>
              <button className="ob-cta">Open Apple Health</button>
              <button className="nd-skip">Check again</button>
            </div>
          </div>
        );

      case "conditions":
        return (
          <div className="screen">
            <div className="ob">
              <Progress step={2} />
              <h2 className="ob-h">What are you<br /><em>living with?</em></h2>
              <p className="ob-sub">Select all that apply. You can change this later.</p>
              <ConditionChips initial={["ME/CFS", "POTS"]} />
              <p className="ob-help">This helps heedly understand your experience and personalize your patterns. You can update this any time.</p>
              <button className="ob-cta">Continue<span className="arr"><OIcon name="arrow" /></span></button>
            </div>
          </div>
        );

      case "ready":
        return (
          <div className="screen">
            <div className="ob center">
              <OrbPlain />
              <h2 className="ob-h center-h"><img className="wordmark-inline" src="uploads/heedly-warm-ink.png" alt="heedly" /> is <em>ready.</em></h2>
              <p className="lead">The more days you check in, the clearer your patterns become. We'll do the rest quietly.</p>
              <button className="ob-cta">Go to today<span className="arr"><OIcon name="arrow" /></span></button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  const ONBOARDING = [
    { key: "welcome", label: "Welcome" },
    { key: "wearable", label: "Connect wearable" },
    { key: "connected", label: "Wearable connected" },
    { key: "nodata", label: "No data coming through" },
    { key: "conditions", label: "Conditions" },
    { key: "ready", label: "Ready" },
  ];

  Object.assign(window, { OnboardingScreen, ONBOARDING });
})();
