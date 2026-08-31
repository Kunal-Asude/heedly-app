// Aubade — Patterns insight screens. Exports PatternsScreen + PATTERNS to window.
(function () {
  const { useState } = React;

  function PIcon({ name }) {
    const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
    switch (name) {
      case "back":return <svg viewBox="0 0 24 24" {...s}><path d="M15 5l-7 7 7 7" /></svg>;
      case "home":return <svg viewBox="0 0 24 24" {...s}><path d="M4 11.5 12 5l8 6.5" /><path d="M6 10.5V19h12v-8.5" /></svg>;
      case "pulse":return <svg viewBox="0 0 24 24" {...s}><path d="M3 12h4l2.5-6 4 13 2.5-7H21" /></svg>;
      case "notes":return <svg viewBox="0 0 24 24" {...s}><path d="M7 4h7l4 4v12H7z" /><path d="M14 4v4h4" /><path d="M10 13h5M10 16.5h5" /></svg>;
      case "moon":return <svg viewBox="0 0 24 24" {...s}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z" /></svg>;
      case "clock":return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.4V12l3 1.8" /></svg>;
      case "social":return <svg viewBox="0 0 24 24" {...s}><circle cx="9" cy="9" r="3" /><circle cx="16.5" cy="10" r="2.4" /><path d="M3.5 18.5c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" /><path d="M16 14c2.4 0 4.5 1.2 4.5 4" /></svg>;
      case "mental":return <svg viewBox="0 0 24 24" {...s}><path d="M13 3 5 13.5h5L9 21l8-10.5h-5z" /></svg>;
      case "heat":return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3.6" /><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" /></svg>;
      default:return null;
    }
  }

  function TabBar() {
    const tabs = [["home", "Today"], ["pulse", "Patterns"], ["notes", "Notes"]];
    return (
      <div className="tabbar">
        {tabs.map(([ic, lb], i) =>
        <button key={lb} className={"tab" + (i === 1 ? " active" : "")}>
            <PIcon name={ic} /><span className="tlabel">{lb}</span>
          </button>
        )}
      </div>);

  }

  function PageHead() {
    return (
      <>
        <div className="sx-nav">
          <button className="sx-back" aria-label="Back"><PIcon name="back" /></button>
        </div>
        <p className="sx-eyebrow">Patterns</p>
        <h2 className="sx-title">What we've noticed</h2>
        <div className="pt-sub">
          <p className="pt-sub-text">A few small things we're learning about you.</p>
          <p className="pt-since">Learning since March 14</p>
        </div>
      </>);

  }

  // Plain cream insight card mirroring "What Heedly keeps" on Your Data:
  // a small filled circular icon (sage = help, coral = cost), top-aligned, text to the right.
  function Card({ tone, icon, text, evidence }) {
    return (
      <div className="pt-card3">
        <span className={"sx-badge " + (tone === "help" ? "sage" : "coral")}><PIcon name={icon} /></span>
        <div className="pt-card3-main">
          <p className="pt-card3-text">{text}</p>
          <p className="pt-card3-ev">{evidence}</p>
        </div>
      </div>);

  }

  const STATE = {
    steady: "#6E9678",
    caution: "#C29A5F",
    rest: "#BE6A5C"
  };
  const WEEK = [
  { d: "M", state: "steady", energy: 0.92 },
  { d: "T", state: "steady", energy: 0.84 },
  { d: "W", state: "caution", energy: 0.62 },
  { d: "T", state: "caution", energy: 0.5 },
  { d: "F", state: "caution", energy: 0.4 },
  { d: "S", state: "rest", energy: 0.24 },
  { d: "S", state: "rest", energy: 0.14 }];

  // color carries state, size carries energy amount
  // smallest dot stays clearly legible (min 17px), largest fills the zone (max 36px)
  const dotSize = (energy) => 17 + energy * 19;


  function ThisWeek({ popover }) {
    return (
      <div className="pt-week">
        <div className="pt-week-head">
          <h3 className="pt-week-title">This week</h3>
          <div className="pt-week-meta">
            <span className="pt-week-days">7 days</span>
            <button className={"pt-info" + (popover ? " active" : "")} aria-label="How is the tank measured?">i</button>
          </div>
        </div>
        <div className="pt-chart">
          {WEEK.map((day, i) =>
          <div className="pt-col" key={i}>
              <span className="pt-dot-zone">
                <span className="pt-dot" style={{ background: STATE[day.state], width: dotSize(day.energy) + "px", height: dotSize(day.energy) + "px" }}></span>
              </span>
              <span className="pt-day">{day.d}</span>
            </div>
          )}
        </div>
        <div className="pt-legend">
          <span><i style={{ background: STATE.steady }}></i>Steady</span>
          <span><i style={{ background: STATE.caution }}></i>Caution</span>
          <span><i style={{ background: STATE.rest }}></i>Rest day</span>
        </div>
        <div className="pt-legend">
          <span>Bigger dot = more energy.</span>
        </div>
        <p className="pt-foot">Your tank reflects your recent weeks, not a fixed ceiling.</p>

        {popover &&
        <div className="pt-popover">
            <div className="pt-popover-head">
              <span className="pt-popover-title">How is the tank measured?</span>
              <button className="pt-popover-close" aria-label="Close">×</button>
            </div>
            <p className="pt-popover-body">Your tank is measured against your own recent weeks, not a fixed target — so as your baseline shifts, what a 'full tank' means shifts with it.</p>
          </div>
        }
      </div>);

  }

  function PatternsScreen({ data }) {
    if (data.key === "pt-triggers") {
      return (
        <div className="screen">
          <div className="pt">
            <PageHead />
            <p className="pt-sec">What seems to cost you</p>
            <Card tone="cost" icon="social" text="Social time tends to show up in your body two days later, not the same evening." evidence="Noticed across 6 of your last 7 social days." />
            <Card tone="cost" icon="mental" text="Long screen stretches — work, admin, anything mentally heavy — seem to drain you almost as fast as standing does." evidence="Strongest on days over 4 hours of screen time." />
            <Card tone="cost" icon="heat" text="Even mildly warm rooms above 25°C pull your tank down quickly, especially in the afternoon." evidence="9 hot days noticed so far — a stronger pattern than most." />
            <p className="pt-foot">We only share patterns we're reasonably sure about. Tap a card to see the days behind it.</p>
          </div>
          <TabBar />
        </div>);

    }

    const popover = data.key === "pt-popover";
    return (
      <div className="screen">
        <div className="pt">
          <PageHead />
          <ThisWeek popover={popover} />
          <p className="pt-sec">What seems to help</p>
          <Card tone="help" icon="moon" text="Your energy tends to be steadiest on mornings after eight or more hours of sleep." evidence="Based on 38 mornings." />
          <Card tone="help" icon="clock" text="On nights you fall asleep before 11pm, your tank tends to start the next day about a quarter fuller." evidence="Across 6 of the last 8 weeks." />
        </div>
        <TabBar />
      </div>);

  }

  const PATTERNS = [
  { key: "pt-top", label: "Patterns" },
  { key: "pt-popover", label: "Patterns · Tank info" },
  { key: "pt-triggers", label: "Patterns · Triggers" }];


  Object.assign(window, { PatternsScreen, PATTERNS });
})();