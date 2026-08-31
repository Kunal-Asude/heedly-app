// Aubade — "Your data" privacy screens + delete sheet. Exports YourDataScreen + YOURDATA to window.
(function () {
  const { useState } = React;

  function DIcon({ name }) {
    const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
    switch (name) {
      case "back":return <svg viewBox="0 0 24 24" {...s}><path d="M15 5l-7 7 7 7" /></svg>;
      case "chev":return <svg viewBox="0 0 24 24" {...s}><path d="M9 6l6 6-6 6" /></svg>;
      case "pulse":return <svg viewBox="0 0 24 24" {...s}><path d="M3 12h4l2-5 4 11 2-6h6" /></svg>;
      case "checkin":return <svg viewBox="0 0 24 24" {...s}><rect x="5" y="4" width="14" height="17" rx="2.5" /><path d="M9 4.5h6V7H9z" /><path d="M8.5 13l2.2 2.2L15 11" /></svg>;
      case "heart":return <svg viewBox="0 0 24 24" {...s}><path d="M12 20s-6.5-4.2-6.5-9A3.5 3.5 0 0 1 12 8.2 3.5 3.5 0 0 1 18.5 11c0 4.8-6.5 9-6.5 9z" /></svg>;
      case "moon":return <svg viewBox="0 0 24 24" {...s}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z" /></svg>;
      case "phone":return <svg viewBox="0 0 24 24" {...s}><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M10.5 18h3" /></svg>;
      case "lock":return <svg viewBox="0 0 24 24" {...s}><rect x="5.5" y="11" width="13" height="9" rx="2.4" /><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" /></svg>;
      default:return null;
    }
  }

  function DataHead() {
    return (
      <>
        <div className="sx-nav">
          <button className="sx-back" aria-label="Back"><DIcon name="back" /></button>
        </div>
        <p className="sx-eyebrow">Privacy</p>
        <h2 className="sx-title">Your data</h2>
        <p className="sx-intro">Here's everything heedly keeps, in plain English.</p>
      </>);

  }

  function KeepRow({ icon, title, desc }) {
    return (
      <div className="sx-keep">
        <span className="sx-badge coral"><DIcon name={icon} /></span>
        <span className="sx-keep-main">
          <span className="sx-row-title">{title}</span>
          <span className="sx-row-desc">{desc}</span>
        </span>
      </div>);

  }

  function LiveCard({ icon, title, desc }) {
    return (
      <div className="sx-live">
        <span className="sx-badge sage"><DIcon name={icon} /></span>
        <span className="sx-live-text">
          <span className="sx-live-title">{title}</span>
          <span className="sx-live-desc">{desc}</span>
        </span>
      </div>);

  }

  function KeepCard() {
    return (
      <>
        <p className="sx-sec">What heedly keeps</p>
        <div className="sx-card">
          <KeepRow icon="pulse" title="Wearable data" desc="Heart rate, HRV, sleep and activity from your connected device." />
          <KeepRow icon="checkin" title="Daily check-ins" desc="Your energy, body and the things you note each day." />
          <KeepRow icon="heart" title="Conditions" desc="What you're living with, to shape your patterns." />
          <KeepRow icon="moon" title="Period days" desc="The cycle days you've logged, if you've added any." />
        </div>
      </>);

  }

  function LivesRow() {
    return (
      <>
        <p className="sx-sec">Where it lives</p>
        <div className="sx-lives">
          <LiveCard icon="phone" title="On your device" desc="Patterns are detected here, on your phone." />
          <LiveCard icon="lock" title="Encrypted backup" desc="Stored privately in iCloud, so it's there when you change phones." />
        </div>
      </>);

  }

  function YourDataScreen({ data }) {
    if (data.key === "data-scroll") {
      return (
        <div className="screen">
          <div className="sx sx-data">
            <DataHead />
            <p className="sx-sec">Who else sees it</p>
            <div className="sx-card sx-card-pad">
              <p className="sx-nobody-title">Private by default.</p>
              <p className="sx-nobody-body">We don't sell your data. Everything is worked out on your phone — the only thing that leaves it is the optional AI insights: anonymized patterns (no name, no raw data) used to write your insights in plainer language. You can turn that off anytime in settings.</p>
            </div>
            <div className="sx-card sx-actions">
              <button className="sx-action"><span>Export my data</span><span className="sx-chev"><DIcon name="chev" /></span></button>
              <button className="sx-action danger"><span>Delete all my data</span></button>
              <button className="sx-action"><span>Read full privacy policy</span><span className="sx-chev"><DIcon name="chev" /></span></button>
            </div>
            <p className="sx-foot">Deleting asks you to confirm first — it can't be undone.</p>
          </div>
        </div>);

    }

    if (data.key === "data-delete") {
      return (
        <div className="screen">
          <div className="ci-behind">
            <div className="sx sx-data">
              <DataHead />
              <KeepCard />
            </div>
          </div>
          <div className="ci-scrim"></div>
          <div className="ci-sheet">
            <div className="ci-sheet-grip"></div>
            <div className="sx-sheet-h">Delete everything?</div>
            <p className="sx-sheet-body">This erases everything heedly keeps — every check-in and all your patterns, on this phone and in your iCloud backup. It can't be undone.</p>
            <p className="sx-sheet-note">If you have a subscription, cancel it separately in the App Store. Deleting here won't stop billing.</p>
            <button className="sx-sheet-btn danger">Delete everything</button>
            <button className="sx-sheet-btn keep">Keep my data</button>
          </div>
        </div>);

    }

    return (
      <div className="screen">
        <div className="sx sx-data">
          <DataHead />
          <KeepCard />
          <LivesRow />
        </div>
      </div>);

  }

  const YOURDATA = [
  { key: "data-top", label: "Your data" },
  { key: "data-scroll", label: "Your data · Scrolled" },
  { key: "data-delete", label: "Delete everything" }];


  Object.assign(window, { YourDataScreen, YOURDATA });
})();