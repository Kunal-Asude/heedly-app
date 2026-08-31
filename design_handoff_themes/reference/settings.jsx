// Aubade — Settings ("Your Heedly") screens. Exports SettingsScreen + SETTINGS to window.
(function () {
  const { useState } = React;

  function SIcon({ name }) {
    const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
    switch (name) {
      case "back":return <svg viewBox="0 0 24 24" {...s}><path d="M15 5l-7 7 7 7" /></svg>;
      case "chev":return <svg viewBox="0 0 24 24" {...s}><path d="M9 6l6 6-6 6" /></svg>;
      case "home":return <svg viewBox="0 0 24 24" {...s}><path d="M4 11.5 12 5l8 6.5" /><path d="M6 10.5V19h12v-8.5" /></svg>;
      case "pulse":return <svg viewBox="0 0 24 24" {...s}><path d="M3 12h4l2.5-6 4 13 2.5-7H21" /></svg>;
      case "notes":return <svg viewBox="0 0 24 24" {...s}><path d="M7 4h7l4 4v12H7z" /><path d="M14 4v4h4" /><path d="M10 13h5M10 16.5h5" /></svg>;
      case "plus":return <svg viewBox="0 0 24 24" {...s}><path d="M12 5v14M5 12h14" /></svg>;
      default:return null;
    }
  }

  function Toggle({ on, onClick }) {
    return (
      <button className={"sx-toggle" + (on ? " on" : "")} aria-pressed={on} onClick={onClick}>
        <span className="knob"></span>
      </button>);

  }

  function TabBar() {
    const tabs = [["home", "Today"], ["pulse", "Patterns"], ["notes", "Notes"]];
    return (
      <div className="tabbar">
        {tabs.map(([ic, lb], i) =>
        <button key={lb} className={"tab" + (i === 0 ? " active" : "")}>
            <SIcon name={ic} /><span className="tlabel">{lb}</span>
          </button>
        )}
      </div>);

  }

  function PageHead({ compact }) {
    return (
      <>
        <div className="sx-nav">
          <button className="sx-back" aria-label="Back"><SIcon name="back" /></button>
          <span className="sx-ver">V1.0</span>
        </div>
        {!compact &&
        <>
          <p className="sx-eyebrow">Settings</p>
          <h2 className="sx-title">Your heedly</h2>
        </>
        }
      </>);

  }

  function ToggleRow({ title, desc, on: initial, multiline }) {
    const [on, setOn] = useState(!!initial);
    return (
      <div className={"sx-row" + (multiline ? " sx-row--top" : "")}>
        <span className="sx-row-line">
          <span className="sx-row-title">{title}</span>
          <span className="sx-row-ctrl"><Toggle on={on} onClick={() => setOn((o) => !o)} /></span>
        </span>
        {desc && <span className="sx-row-desc">{desc}</span>}
      </div>);

  }

  function ThemeControl() {
    const [v, setV] = useState("System");
    const opts = ["System", "Light", "Dark"];
    const subs = {
      System: "Follows your device's light or dark setting automatically.",
      Light: "Always light, whatever your device does.",
      Dark: "Always dark, whatever your device does."
    };
    return (
      <div className="sx-row">
        <span className="sx-row-line">
          <span className="sx-row-title">Theme</span>
          <span className="sx-row-ctrl">
            <span className="sx-seg">
              {opts.map((o) =>
              <button key={o} className={"sx-seg-btn" + (v === o ? " on" : "")} onClick={() => setV(o)}>{o}</button>
              )}
            </span>
          </span>
        </span>
        <span className="sx-row-desc">{subs[v]}</span>
      </div>);

  }

  function AppearanceSection() {
    return (
      <>
        <p className="sx-sec">Appearance</p>
        <div className="sx-card" style={{ backgroundColor: "rgba(255, 252, 248, 0.72)" }}>
          <ThemeControl />
          <ToggleRow title="True black (OLED)" desc="For severe light sensitivity. Flattens dark mode to near-pure black. Applies whenever dark mode is on." on={false} />
          <ToggleRow title="Reduce motion" desc="Softer transitions, no drifting backgrounds" on={false} />
        </div>
      </>);

  }

  function WearableSection() {
    return (
      <>
        <p className="sx-sec">Wearable</p>
        <div className="sx-card">
          <div className="sx-row">
            <span className="sx-row-line">
              <span className="sx-row-title">Oura Ring</span>
              <span className="sx-row-ctrl">
                <button className="sx-change"><span className="sx-change-dot"></span>Change<span className="sx-change-chev"><SIcon name="chev" /></span></button>
              </span>
            </span>
            <span className="sx-row-desc">Connected · syncing in the background</span>
          </div>
          <button className="sx-row sx-row-link has-ic">
            <span className="sx-row-line">
              <span className="sx-row-ic"><SIcon name="plus" /></span>
              <span className="sx-row-title">Add another</span>
              <span className="sx-row-ctrl sx-chev"><SIcon name="chev" /></span>
            </span>
            <span className="sx-row-desc">Apple Watch, Garmin, Whoop, Apple Health …</span>
          </button>
        </div>
      </>);

  }

  function AiInsightsSection() {
    const [on, setOn] = useState(true);
    return (
      <>
        <p className="sx-sec">AI insights</p>
        <div className="sx-card">
          <div className="sx-row">
            <span className="sx-row-line">
              <span className="sx-row-title">AI insights</span>
              <span className="sx-row-ctrl"><Toggle on={on} onClick={() => setOn((o) => !o)} /></span>
            </span>
            <span className="sx-row-desc">On: short anonymized patterns (never your raw data) are sent to generate warmer, plain-language insights. Off: the same patterns are shown using on-device wording. Either way, pattern detection always runs on your phone.</span>
          </div>
        </div>
      </>);

  }

  function HormonalContextSection() {
    const OPTS = [
    "cycling regularly", "cycling irregularly", "on hormonal birth control",
    "pregnant", "postpartum", "perimenopausal or menopausal", "on HRT",
    "not applicable", "prefer not to say"];
    const [open, setOpen] = useState(false);
    const [val, setVal] = useState("cycling regularly");
    return (
      <>
        <p className="sx-sec">Hormonal context</p>
        <div className="sx-card">
          <div className="sx-row">
            <span className="sx-row-line">
              <span className="sx-row-title">Cycle &amp; hormones</span>
            </span>
            <button className="sx-select" onClick={() => setOpen((o) => !o)}>
              {val[0].toUpperCase() + val.slice(1)}<span className="sx-chev"><SIcon name="chev" /></span>
            </button>
            {open &&
            <div className="sx-opts">
                {OPTS.map((o) =>
              <button
                key={o}
                className={"sx-opt" + (val === o ? " on" : "")}
                onClick={() => {setVal(o);setOpen(false);}}>
                <span className="sx-optdot"></span>{o}
              </button>
              )}
              </div>
            }
          </div>
          <ToggleRow title="Don't predict phase from my periods" desc="For irregular or atypical cycles." on={false} />
        </div>
      </>);

  }

  function SubscriptionSection() {
    return (
      <>
        <p className="sx-sec">Subscription</p>
        <div className="sx-card">
          <button className="sx-row sx-row-link">
            <span className="sx-row-line">
              <span className="sx-row-title">Manage subscription</span>
              <span className="sx-row-ctrl sx-chev"><SIcon name="chev" /></span>
            </span>
            <span className="sx-row-desc">Update your plan or cancel anytime in the App Store. Your history stays on your phone either way.</span>
          </button>
        </div>
      </>);

  }

  function NotificationsSection() {
    const [daily, setDaily] = useState(true);
    return (
      <>
        <p className="sx-sec">Notifications</p>
        <div className="sx-card">
          <div className="sx-row">
            <span className="sx-row-line">
              <span className="sx-row-title">Daily check-in reminder</span>
              <span className="sx-row-ctrl"><Toggle on={daily} onClick={() => setDaily((o) => !o)} /></span>
            </span>
            <span className="sx-row-desc">A gentle nudge to check in — you pick the time.</span>
          </div>
          {daily &&
          <div className="sx-row">
              <span className="sx-row-line">
                <span className="sx-row-title">Reminder time</span>
                <span className="sx-row-ctrl">
                  <button className="sx-value">9:00 AM<span className="sx-chev"><SIcon name="chev" /></span></button>
                </span>
              </span>
            </div>
          }
          <ToggleRow title="Heads-up before harder days" desc="heedly lets you know when the next few days look heavier, so you can plan ahead." on={true} />
          <ToggleRow title="Weekly recap" desc="A short summary of what heedly noticed this week." on={false} />
        </div>
      </>);

  }

  function SettingsScreen({ data }) {
    if (data.key === "set-scroll") {
      return (
        <div className="screen">
          <div className="sx sx-tabbed">
            <PageHead compact />
            <AiInsightsSection />
            <HormonalContextSection />
            <SubscriptionSection />
            <NotificationsSection />
          </div>
          <TabBar />
        </div>);

    }
    return (
      <div className="screen">
        <div className="sx sx-tabbed">
          <PageHead />
          <AppearanceSection />
          <WearableSection />
          <AiInsightsSection />
        </div>
        <TabBar />
      </div>);

  }

  const SETTINGS = [
  { key: "set-top", label: "Settings" },
  { key: "set-scroll", label: "Settings · Scrolled" }];


  Object.assign(window, { SettingsScreen, SETTINGS });
})();