// Aubade — Daily check-in screens (Aubade style). Exports CheckinScreen + CHECKIN to window.
(function () {
  const { useState } = React;

  function CIcon({ name }) {
    const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
    switch (name) {
      case "back":return <svg viewBox="0 0 24 24" {...s}><path d="M15 5l-7 7 7 7" /></svg>;
      case "arrow":return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 5l7 7-7 7" /></svg>;
      case "search":return <svg viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-3.6-3.6" /></svg>;
      case "check":return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
      case "moon":return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z" /></svg>;
      case "chev":return <svg viewBox="0 0 24 24" {...s}><path d="M6 9l6 6 6-6" /></svg>;
      case "x":return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>;
      case "sliders":return <svg viewBox="0 0 24 24" {...s}><line x1="4" y1="7" x2="14" y2="7" /><line x1="18" y1="7" x2="20" y2="7" /><circle cx="16" cy="7" r="2.2" /><line x1="4" y1="17" x2="6" y2="17" /><line x1="10" y1="17" x2="20" y2="17" /><circle cx="8" cy="17" r="2.2" /></svg>;
      default:return null;
    }
  }

  // Scale dot colors live in CSS (.ci-dot-0 … .ci-dot-4) so each shade is directly
  // editable and stable — text labels always present, never color alone.

  function CIHeader({ step }) {
    return (
      <div className="ci-head">
        <button className="ci-back" aria-label="Back"><CIcon name="back" /></button>
        <div className="ci-dots" aria-hidden="true">
          {[0, 1, 2].map((i) => <i key={i} className={i === step ? "on" : ""}></i>)}
        </div>
        <button className="ci-skip">Skip</button>
      </div>);

  }

  function Scale({ scale, initial }) {
    const [sel, setSel] = useState(initial);
    return (
      <div className="ci-scalewrap">
        <div className="ci-scale">
          {scale.map((word, i) =>
          <button
            key={word}
            className={"ci-dot ci-dot-" + i + (i === sel ? " sel" : "")}
            aria-label={word}
            aria-pressed={i === sel}
            onClick={() => setSel(i)}>
          </button>
          )}
        </div>
        <div className="ci-labels">
          <span className="ci-lab">{scale[0]}</span>
          <span className="ci-pill"><span className="pdot"></span>{scale[sel]}</span>
          <span className="ci-lab">{scale[scale.length - 1]}</span>
        </div>
      </div>);

  }

  // full tag taxonomy — 6 categories
  const TAXONOMY = [
  { cat: "Activities", tags: ["social interaction", "deep focus", "physical activity", "standing", "walking", "cooking", "phone/video call", "driving/passenger", "housework"] },
  { cat: "Mind & mood", tags: ["stress", "anxiety", "low mood", "overwhelm", "calm"] },
  { cat: "Environment", tags: ["screens", "warm room", "heat exposure", "cold", "noise", "bright light"] },
  { cat: "Symptoms", tags: ["brain fog", "headache", "poor sleep", "sore throat", "nausea", "dizziness", "breathlessness"] },
  { cat: "Body", tags: ["muscle pain", "joint pain", "pain flare", "heart racing", "palpitations"] },
  { cat: "Other", tags: ["alcohol", "caffeine", "missed meds", "period"] }];

  const PRESELECTED = ["social interaction", "screens", "warm room"];

  function TagPill({ label, on, onClick }) {
    return (
      <button className={"ci-tag" + (on ? " coral" : "")} aria-pressed={on} onClick={onClick}>
        {on && <span className="tcheck"><CIcon name="check" /></span>}{label}
      </button>);

  }

  function SearchBar() {
    const [q, setQ] = useState("");
    return (
      <div className="ci-search">
        <span className="ci-search-ic"><CIcon name="search" /></span>
        <input className="ci-search-in" placeholder="Search tags…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>);

  }

  // Q3 — ONE consolidated screen, two states. Filter (sliders) button sits left of the search bar
  // in both states; tapping it reveals/hides the "Browse by category" card below the search row.
  function TagsNotable({ initialOpen }) {
    const [sel, setSel] = useState(new Set(PRESELECTED));
    const [open, setOpen] = useState(!!initialOpen);
    const [cat, setCat] = useState(null);
    const toggle = (t) => {const n = new Set(sel);n.has(t) ? n.delete(t) : n.add(t);setSel(n);};
    const common = [
    "social interaction", "screens", "warm room", "deep focus", "physical activity",
    "heat exposure", "standing", "walking", "brain fog", "headache", "poor sleep",
    "pain flare", "joint pain", "sore throat", "heart racing", "breathlessness",
    "nausea", "dizziness", "noise"];

    // selecting a category filters the tag list; otherwise show the common list
    const shown = cat ? (TAXONOMY.find((c) => c.cat === cat) || { tags: [] }).tags : common;
    return (
      <>
        <div className="ci-tagscroll">
          <div className="ci-find">
            <button
              className={"ci-filter-btn" + (open ? " on" : "")}
              aria-label="Filter by category" aria-pressed={open}
              onClick={() => setOpen((o) => !o)}>
              
              <CIcon name="sliders" />
            </button>
            <SearchBar />
          </div>
          {open &&
          <div className="ci-browse">
              <div className="ci-browse-label">Browse by category</div>
              <div className="ci-browse-grid">
                {TAXONOMY.map((c) =>
              <button
                key={c.cat}
                className={"ci-browse-chip" + (cat === c.cat ? " on" : "")}
                onClick={() => setCat(cat === c.cat ? null : c.cat)}>
                {c.cat}</button>
              )}
              </div>
            </div>
          }
          <div className="ci-tags">
            {shown.map((t) => <TagPill key={t} label={t} on={sel.has(t)} onClick={() => toggle(t)} />)}
          </div>
        </div>
      </>);

  }

  function PeriodPicker() {
    const [day, setDay] = useState(3);
    return (
      <>
        <div className="ci-daygrid">
          {[1, 2, 3, 4, 5, 6, 7].map((d) =>
          <button key={d} className={"ci-day" + (d === day ? " sel" : "")} onClick={() => setDay(d)}>{d}</button>
          )}
        </div>
        <button className="ob-cta">Save<span className="arr"><CIcon name="arrow" /></span></button>
        <button className="ci-sheet-skip">Skip</button>
      </>);

  }

  function SummaryRow({ k, word, sel, total }) {
    return (
      <div className="ci-srow">
        <span className="ci-skey">{k}</span>
        <span className="ci-sval">
          {word}
          {sel != null &&
          <span className="ci-sdots">
              {Array.from({ length: total }).map((_, i) => <i key={i} className={i <= sel ? "on" : ""}></i>)}
            </span>
          }
        </span>
      </div>);

  }

  function YesterdayPills() {
    const [sel, setSel] = useState(null);
    const OPTS = [
    { key: "lighter", label: "Lighter than usual", tone: "sage" },
    { key: "same", label: "About the same", tone: "oat" },
    { key: "heavier", label: "Heavier than usual", tone: "coral" }];
    return (
      <>
        <div className="ci-yp">
          {OPTS.map((o) =>
          <button
            key={o.key}
            className={"ci-ypill " + o.tone + (sel === o.key ? " sel" : "")}
            aria-pressed={sel === o.key}
            onClick={() => setSel(o.key)}>
            <span className="yp-dot"></span>{o.label}
          </button>
          )}
        </div>
        <button className="ci-yp-skip">Skip — not sure yet.</button>
      </>);

  }

  function CheckinScreen({ data }) {
    switch (data.key) {
      case "yesterday":
        return (
          <div className="screen">
            <div className="ci">
              <CIHeader step={-1} />
              <h2 className="ob-h">How did <em>yesterday land?</em></h2>
              <p className="ob-sub">Just a quick look back — it helps the patterns make sense.</p>
              <YesterdayPills />
              <p className="ob-foot">You can do this lying down.</p>
            </div>
          </div>);

      case "q1feel":
        return (
          <div className="screen">
            <div className="ci">
              <CIHeader step={0} />
              <p className="ci-eyebrow">Question 1 of 3</p>
              <h2 className="ob-h">How are you <br /><em>feeling?</em></h2>
              <p className="ob-sub">No need to think hard — go with your gut.</p>
              <Scale scale={["awful", "rough", "okay", "good", "great"]} initial={2} />
              <button className="ci-crash">I'm in a crash</button>
              <button className="ob-cta">Next<span className="arr"><CIcon name="arrow" /></span></button>
              <p className="ob-foot">You can do this lying down.</p>
            </div>
          </div>);


      case "q1energy":
        return (
          <div className="screen">
            <div className="ci">
              <CIHeader step={0} />
              <p className="ci-eyebrow">Question 1 of 3</p>
              <h2 className="ob-h">How's your <em>energy right now?</em></h2>
              <p className="ob-sub">No need to think hard — go with your gut.</p>
              <Scale scale={["drained", "low", "middling", "steady", "high"]} initial={2} />
              <button className="ci-crash">I'm in a crash</button>
              <button className="ob-cta">Next<span className="arr"><CIcon name="arrow" /></span></button>
              <p className="ob-foot">You can do this lying down.</p>
            </div>
          </div>);


      case "q2":
        return (
          <div className="screen">
            <div className="ci">
              <CIHeader step={1} />
              <p className="ci-eyebrow">Question 2 of 3</p>
              <h2 className="ob-h">How does your <br /><em>body feel?</em></h2>
              <p className="ob-sub">No need to think hard — go with your gut.</p>
              <Scale scale={["in pain", "sore", "tender", "okay", "easy"]} initial={2} />
              <button className="ci-crash">I'm in a crash</button>
              <button className="ob-cta">Next<span className="arr"><CIcon name="arrow" /></span></button>
              <p className="ob-foot">You can do this lying down.</p>
            </div>
          </div>);


      case "q3tags":
        return (
          <div className="screen">
            <div className="ci">
              <CIHeader step={2} />
              <p className="ci-eyebrow">Question 3 of 3</p>
              <h2 className="ob-h">Anything from <em>today worth noting?</em></h2>
              <p className="ob-sub">Tap any that apply. Skip if nothing fits.</p>
              <TagsNotable />
              <button className="ob-cta">Save<span className="arr"><CIcon name="arrow" /></span></button>
              <p className="ob-foot">You can do this lying down.</p>
            </div>
          </div>);


      case "q3open":
        return (
          <div className="screen">
            <div className="ci">
              <CIHeader step={2} />
              <p className="ci-eyebrow">Question 3 of 3</p>
              <h2 className="ob-h">Anything from <em>today worth noting?</em></h2>
              <p className="ob-sub">Tap any that apply. Skip if nothing fits.</p>
              <TagsNotable initialOpen />
              <button className="ob-cta">Save<span className="arr"><CIcon name="arrow" /></span></button>
              <p className="ob-foot">You can do this lying down.</p>
            </div>
          </div>);


      case "period":
        return (
          <div className="screen">
            <div className="ci-behind">
              <div className="ci">
                <CIHeader step={2} />
                <p className="ci-eyebrow">Question 3 of 3</p>
                <h2 className="ob-h">Anything from <em>today worth noting?</em></h2>
              </div>
            </div>
            <div className="ci-scrim"></div>
            <div className="ci-sheet">
              <div className="ci-sheet-grip"></div>
              <h3>What day of your <em>period?</em></h3>
              <p className="sub">Day 1 = first day of bleeding. This helps heedly understand your cycle over time. Skippable anytime.</p>
              <PeriodPicker />
            </div>
          </div>);


      case "donefirst":
        return (
          <div className="screen">
            <div className="ci-done">
              <div className="ci-done-icon check"><CIcon name="check" /></div>
              <h2 className="ob-h">Thank you, <em>Sam.</em></h2>
              <p className="lead">That's your first piece of the picture. Each check-in teaches heedly a little more about you.</p>
              <div className="ci-summary">
                <SummaryRow k="Feeling" word="okay" sel={2} total={5} />
                <SummaryRow k="Body" word="tender" sel={2} total={5} />
                <SummaryRow k="Notable" word="social · screens · warm room" />
              </div>
              <p className="ci-edit-hint">Tap any line to edit before you go.</p>
              <button className="ci-secondary">Back to today</button>
            </div>
          </div>);


      case "donereg":
        return (
          <div className="screen">
            <div className="ci-done">
              <div className="ci-done-icon check"><CIcon name="check" /></div>
              <h2 className="ob-h">Saved.<br /><em>Rest well, Sam.</em></h2>
              <p className="lead">We'll quietly watch for patterns and only ping you if something matters.</p>
              <div className="ci-summary">
                <SummaryRow k="Energy" word="middling" sel={2} total={5} />
                <SummaryRow k="Body" word="tender" sel={2} total={5} />
                <SummaryRow k="Notable" word="social · screens · warm room" />
                <SummaryRow k="Yesterday" word="About the same" />
              </div>
              <p className="ci-edit-hint">Tap any line to edit before you go.</p>
              <button className="ci-secondary">Back to today</button>
            </div>
          </div>);


      case "donecrash":
        return (
          <div className="screen">
            <div className="ci-done">
              <div className="ci-done-icon moon"><CIcon name="moon" /></div>
              <h2 className="ob-h">Logged.<br /><em>Rest now, Sam.</em></h2>
              <p className="lead">We've noted this as a crash day. No more questions.</p>
              <button className="ci-secondary">Back to today</button>
            </div>
          </div>);


      default:
        return null;
    }
  }

  const CHECKIN = [
  { key: "q1feel", label: "Q1 · First time" },
  { key: "yesterday", label: "Yesterday · Recurring intro" },
  { key: "q1energy", label: "Q1 · Recurring" },
  { key: "q2", label: "Q2 · Body" },
  { key: "q3tags", label: "Q3 · Notable" },
  { key: "q3open", label: "Q3 · Notable · Filter open" },
  { key: "period", label: "Period day" },
  { key: "donefirst", label: "Done · First time" },
  { key: "donereg", label: "Done · Regular" },
  { key: "donecrash", label: "Done · Crash" }];


  Object.assign(window, { CheckinScreen, CHECKIN });
})();