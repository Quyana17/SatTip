import React, { useState, useMemo } from "react";

var SATS = 100000000;
var BTC_USD = 70450;
var mono = "'JetBrains Mono', monospace";
var sans = "'Nunito', sans-serif";

var CURRENCIES = [
  { code: "USD", sym: "$", flag: "🇺🇸", rate: 1 },
  { code: "EUR", sym: "€", flag: "🇪🇺", rate: 0.92 },
  { code: "GBP", sym: "£", flag: "🇬🇧", rate: 0.79 },
  { code: "JPY", sym: "¥", flag: "🇯🇵", rate: 149.8 },
  { code: "INR", sym: "₹", flag: "🇮🇳", rate: 86.4 },
  { code: "BRL", sym: "R$", flag: "🇧🇷", rate: 5.78 },
  { code: "MXN", sym: "$", flag: "🇲🇽", rate: 20.15 },
  { code: "NGN", sym: "₦", flag: "🇳🇬", rate: 1540 },
  { code: "KES", sym: "KSh", flag: "🇰🇪", rate: 129 },
  { code: "PHP", sym: "₱", flag: "🇵🇭", rate: 56.2 },
  { code: "GYD", sym: "G$", flag: "🇬🇾", rate: 209 },
  { code: "ZAR", sym: "R", flag: "🇿🇦", rate: 18.4 },
  { code: "TRY", sym: "₺", flag: "🇹🇷", rate: 38.2 },
  { code: "ARS", sym: "$", flag: "🇦🇷", rate: 1065 },
  { code: "CAD", sym: "C$", flag: "🇨🇦", rate: 1.44 },
  { code: "AUD", sym: "A$", flag: "🇦🇺", rate: 1.58 },
  { code: "THB", sym: "฿", flag: "🇹🇭", rate: 33.8 },
  { code: "VND", sym: "₫", flag: "🇻🇳", rate: 25400 },
  { code: "IDR", sym: "Rp", flag: "🇮🇩", rate: 16280 },
  { code: "CHF", sym: "CHF", flag: "🇨🇭", rate: 0.88 },
];

var THEMES = [
  { id: "midnight", name: "Midnight", bg: "#0a0e18", card: "#111828", accent: "#f7931a", text: "#e0e4f0", dim: "#6878a0", border: "#1e2840", light: false },
  { id: "ocean", name: "Ocean", bg: "#041220", card: "#0a1e32", accent: "#00e5ff", text: "#d0e8f4", dim: "#5888a8", border: "#153048", light: false },
  { id: "ember", name: "Ember", bg: "#1a0a08", card: "#281410", accent: "#ff6b35", text: "#f0d8c8", dim: "#a07868", border: "#3a2018", light: false },
  { id: "forest", name: "Forest", bg: "#060e08", card: "#0e1c12", accent: "#34d399", text: "#d0e8d8", dim: "#5a8870", border: "#1a3020", light: false },
  { id: "royal", name: "Royal", bg: "#0e0818", card: "#1a1028", accent: "#bb86fc", text: "#e0d8f0", dim: "#7868a0", border: "#2a1840", light: false },
  { id: "neon", name: "Neon Cyber", bg: "#0a040e", card: "#14081c", accent: "#ff2d95", text: "#f0e0f4", dim: "#9860a8", border: "#2a1038", light: false },
  { id: "parchment", name: "Parchment", bg: "#f5f0e8", card: "#fefcf6", accent: "#8b6914", text: "#2a2010", dim: "#8a7a60", border: "#d8d0c0", light: true },
  { id: "sunset", name: "Sunset", bg: "#1a0810", card: "#280e18", accent: "#ff8c42", text: "#f4dce0", dim: "#a87080", border: "#3a1828", light: false },
  { id: "mono", name: "Monochrome", bg: "#0c0c0c", card: "#181818", accent: "#ffffff", text: "#e8e8e8", dim: "#888888", border: "#2a2a2a", light: false },
  { id: "tropical", name: "Tropical", bg: "#041a18", card: "#082a26", accent: "#00d4aa", text: "#d0f0e8", dim: "#58a890", border: "#104038", light: false },
  { id: "clean", name: "Clean White", bg: "#f8f9fc", card: "#ffffff", accent: "#f7931a", text: "#1a1a2e", dim: "#6878a0", border: "#e0e4f0", light: true },
  { id: "sakura", name: "Sakura", bg: "#1a0e14", card: "#281420", accent: "#f4a0c0", text: "#f0d8e4", dim: "#a07888", border: "#3a1830", light: false },
];

var ICONS = [
  { id: "music", label: "Musician", emoji: "🎵" },
  { id: "art", label: "Artist", emoji: "🎨" },
  { id: "code", label: "Developer", emoji: "💻" },
  { id: "write", label: "Writer", emoji: "✍️" },
  { id: "video", label: "Streamer", emoji: "📹" },
  { id: "teach", label: "Educator", emoji: "📚" },
  { id: "photo", label: "Photographer", emoji: "📸" },
  { id: "podcast", label: "Podcaster", emoji: "🎙️" },
  { id: "cook", label: "Chef", emoji: "👨‍🍳" },
  { id: "game", label: "Gamer", emoji: "🎮" },
  { id: "bitcoin", label: "Bitcoiner", emoji: "₿" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "film", label: "Filmmaker", emoji: "🎬" },
  { id: "dj", label: "DJ", emoji: "🎧" },
  { id: "general", label: "General", emoji: "⚡" },
];

var TIPPER_AVATARS = ["😊","🔥","💜","🎉","👏","🙌","💪","⭐","🌟","💎","🚀","🎸","☕","🌊","🦁","🐐","🌴","🎯","🧠","👾"];

var PRESETS = [100, 500, 1000, 5000, 10000, 21000];

function satsToLocal(sats, curCode) {
  var c = CURRENCIES.find(function(x) { return x.code === curCode; }) || CURRENCIES[0];
  var usd = (sats / SATS) * BTC_USD;
  var local = usd * c.rate;
  if (local >= 1000) return c.sym + Math.round(local).toLocaleString();
  if (local >= 1) return c.sym + local.toFixed(2);
  return c.sym + local.toFixed(4);
}

// ============ TIP PAGE (what fans see) ============
function TipPage(props) {
  var t = props.theme;
  var d = props.data;
  var cur = props.currency;
  var selAmt = props.selAmt;
  var setSelAmt = props.setSelAmt;
  var customAmt = props.customAmt;
  var setCustomAmt = props.setCustomAmt;
  var tipMsg = props.tipMsg;
  var setTipMsg = props.setTipMsg;
  var tipAvatar = props.tipAvatar;
  var setTipAvatar = props.setTipAvatar;
  var showAvatarPicker = props.showAvatarPicker;
  var setShowAvatarPicker = props.setShowAvatarPicker;
  var showSuccess = props.showSuccess;
  var onTip = props.onTip;
  var tipFeed = props.tipFeed;

  var iconObj = ICONS.find(function(i) { return i.id === d.icon; }) || ICONS[14];
  var amt = selAmt === "custom" ? (parseInt(customAmt) || 0) : selAmt;
  var goalPct = d.goalAmount > 0 ? Math.min((d.goalCurrent / d.goalAmount) * 100, 100) : 0;

  return (
    <div style={{ minHeight: "100%", background: t.bg, padding: "28px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Profile */}
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: t.accent + "20", border: "3px solid " + t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 12 }}>
        {iconObj.emoji}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 3, textAlign: "center" }}>{d.name || "Your Name"}</div>
      {d.tagline && <div style={{ fontSize: 13, color: t.dim, marginBottom: 14, textAlign: "center", maxWidth: 280, lineHeight: 1.5 }}>{d.tagline}</div>}

      {/* Goal bar */}
      {d.goalAmount > 0 && (
        <div style={{ width: "100%", maxWidth: 340, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: t.dim, fontFamily: mono }}>{d.goalLabel || "Tip Goal"}</span>
            <span style={{ fontSize: 11, color: t.accent, fontFamily: mono, fontWeight: 700 }}>{Math.round(goalPct)}%</span>
          </div>
          <div style={{ height: 8, background: t.border, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: goalPct + "%", height: "100%", background: t.accent, borderRadius: 4, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
            <span style={{ fontSize: 9, color: t.dim, fontFamily: mono }}>{d.goalCurrent.toLocaleString()} sats raised</span>
            <span style={{ fontSize: 9, color: t.dim, fontFamily: mono }}>{d.goalAmount.toLocaleString()} sats goal</span>
          </div>
        </div>
      )}

      {/* Tip card */}
      <div style={{ background: t.card, borderRadius: 14, padding: 20, width: "100%", maxWidth: 340, border: "1px solid " + t.border }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontFamily: mono, color: t.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Send a tip</div>
          <div style={{ fontSize: 32, fontWeight: 900, fontFamily: mono, color: t.accent }}>
            {amt > 0 ? amt.toLocaleString() : "0"}
            <span style={{ fontSize: 12, color: t.dim, marginLeft: 4 }}>sats</span>
          </div>
          {amt > 0 && <div style={{ fontSize: 11, color: t.dim, fontFamily: mono, marginTop: 2 }}>≈ {satsToLocal(amt, cur)}</div>}
        </div>

        {/* Amount grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 10 }}>
          {PRESETS.map(function(p) {
            var active = selAmt === p;
            return (
              <button key={p} onClick={function() { setSelAmt(p); }} style={{
                background: active ? t.accent : "transparent",
                border: "1px solid " + (active ? t.accent : t.border),
                borderRadius: 7, padding: "9px 4px", cursor: "pointer",
                color: active ? (t.light ? "#fff" : "#000") : t.dim,
                fontSize: 12, fontFamily: mono, fontWeight: 700,
              }}>
                {p >= 1000 ? (p / 1000) + "K" : p}
                <div style={{ fontSize: 8, opacity: 0.7, marginTop: 1 }}>{satsToLocal(p, cur)}</div>
              </button>
            );
          })}
        </div>

        {/* Custom amount */}
        <div onClick={function() { setSelAmt("custom"); }} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: selAmt === "custom" ? 6 : 10 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid " + (selAmt === "custom" ? t.accent : t.border), background: selAmt === "custom" ? t.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {selAmt === "custom" && <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.light ? "#fff" : "#000" }} />}
          </div>
          <span style={{ fontSize: 11, color: t.dim }}>Custom amount</span>
        </div>
        {selAmt === "custom" && (
          <input value={customAmt} onChange={function(e) { setCustomAmt(e.target.value.replace(/\D/g, "")); }} placeholder="Enter sats..." style={{ width: "100%", marginBottom: 10, background: t.bg, border: "1px solid " + t.border, borderRadius: 7, padding: "9px 10px", color: t.accent, fontSize: 15, fontFamily: mono, fontWeight: 700, textAlign: "center", outline: "none" }} />
        )}

        {/* Tipper identity */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div onClick={function() { setShowAvatarPicker(!showAvatarPicker); }} style={{ width: 30, height: 30, borderRadius: "50%", background: t.accent + "20", border: "1px solid " + t.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>
              {tipAvatar}
            </div>
            <input value={tipMsg} onChange={function(e) { setTipMsg(e.target.value.substring(0, 140)); }} placeholder="Add a message (optional)" style={{ flex: 1, background: t.bg, border: "1px solid " + t.border, borderRadius: 7, padding: "7px 10px", color: t.text, fontSize: 12, outline: "none" }} />
          </div>
          {showAvatarPicker && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 8, background: t.bg, borderRadius: 8, border: "1px solid " + t.border, marginBottom: 6 }}>
              {TIPPER_AVATARS.map(function(a) {
                return (
                  <button key={a} onClick={function() { setTipAvatar(a); setShowAvatarPicker(false); }} style={{ width: 32, height: 32, borderRadius: 6, border: tipAvatar === a ? "2px solid " + t.accent : "1px solid " + t.border, background: tipAvatar === a ? t.accent + "20" : "transparent", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {a}
                  </button>
                );
              })}
            </div>
          )}
          {tipMsg && <div style={{ color: t.dim, fontSize: 9, textAlign: "right", fontFamily: mono }}>{tipMsg.length}/140</div>}
        </div>

        {/* Tip button */}
        <button onClick={onTip} disabled={amt <= 0} style={{
          width: "100%", padding: "13px 16px",
          background: amt > 0 ? t.accent : t.border,
          border: "none", borderRadius: 9, cursor: amt > 0 ? "pointer" : "not-allowed",
          color: amt > 0 ? (t.light ? "#fff" : "#000") : t.dim,
          fontSize: 14, fontWeight: 800, fontFamily: sans,
          opacity: amt > 0 ? 1 : 0.5,
        }}>
          ⚡ Send {amt > 0 ? amt.toLocaleString() + " sats" : "Tip"}
        </button>

        {/* Success */}
        {showSuccess && (
          <div style={{ marginTop: 10, padding: 12, background: "#34d39920", borderRadius: 8, textAlign: "center", border: "1px solid #34d39940" }}>
            <div style={{ fontSize: 22, marginBottom: 3 }}>⚡</div>
            <div style={{ color: "#34d399", fontWeight: 700, fontSize: 13 }}>Tip sent!</div>
            <div style={{ color: t.dim, fontSize: 10, marginTop: 2 }}>{amt.toLocaleString()} sats delivered instantly</div>
          </div>
        )}

        {/* Personal message */}
        {d.message && (
          <div style={{ marginTop: 12, padding: 10, background: t.bg, borderRadius: 7, border: "1px solid " + t.border }}>
            <div style={{ color: t.dim, fontSize: 11, fontStyle: "italic", lineHeight: 1.5, textAlign: "center" }}>"{d.message}"</div>
          </div>
        )}
      </div>

      {/* Public tip feed */}
      {tipFeed.length > 0 && (
        <div style={{ width: "100%", maxWidth: 340, marginTop: 14 }}>
          <div style={{ fontSize: 10, fontFamily: mono, color: t.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Recent tips</div>
          {tipFeed.slice(0, 5).map(function(tip, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid " + t.border + "40" }}>
                <span style={{ fontSize: 16 }}>{tip.avatar}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ color: t.accent, fontFamily: mono, fontSize: 11, fontWeight: 700 }}>{tip.amount.toLocaleString()} sats</span>
                  {tip.msg && <span style={{ color: t.dim, fontSize: 10, marginLeft: 6 }}>"{tip.msg}"</span>}
                </div>
                <span style={{ color: t.dim, fontSize: 9, fontFamily: mono }}>{tip.time}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* QR placeholder */}
      <div style={{ marginTop: 18, padding: 12, background: t.card, borderRadius: 10, border: "1px solid " + t.border, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: "#fff", borderRadius: 6, margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 60, height: 60, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 1 }}>
            {Array.from({ length: 25 }).map(function(_, i) {
              return <div key={i} style={{ background: Math.random() > 0.4 ? "#000" : "#fff", borderRadius: 1 }} />;
            })}
          </div>
        </div>
        <div style={{ fontSize: 9, color: t.dim, fontFamily: mono }}>Scan to tip with any Lightning wallet</div>
      </div>

      <div style={{ marginTop: 14, color: t.dim, fontSize: 8, fontFamily: mono }}>
        powered by <span style={{ color: t.accent }}>SatTip</span> ⚡
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function SatTipApp() {
  var _view = useState("builder"); var view = _view[0]; var setView = _view[1];
  var _name = useState(""); var name = _name[0]; var setName = _name[1];
  var _tagline = useState(""); var tagline = _tagline[0]; var setTagline = _tagline[1];
  var _lnAddr = useState(""); var lnAddr = _lnAddr[0]; var setLnAddr = _lnAddr[1];
  var _message = useState(""); var message = _message[0]; var setMessage = _message[1];
  var _icon = useState("general"); var icon = _icon[0]; var setIcon = _icon[1];
  var _themeId = useState("midnight"); var themeId = _themeId[0]; var setThemeId = _themeId[1];
  var _goalLabel = useState(""); var goalLabel = _goalLabel[0]; var setGoalLabel = _goalLabel[1];
  var _goalAmt = useState(""); var goalAmt = _goalAmt[0]; var setGoalAmt = _goalAmt[1];
  var _selAmt = useState(1000); var selAmt = _selAmt[0]; var setSelAmt = _selAmt[1];
  var _customAmt = useState(""); var customAmt = _customAmt[0]; var setCustomAmt = _customAmt[1];
  var _tipMsg = useState(""); var tipMsg = _tipMsg[0]; var setTipMsg = _tipMsg[1];
  var _tipAvatar = useState("😊"); var tipAvatar = _tipAvatar[0]; var setTipAvatar = _tipAvatar[1];
  var _showAP = useState(false); var showAP = _showAP[0]; var setShowAP = _showAP[1];
  var _showSuccess = useState(false); var showSuccess = _showSuccess[0]; var setShowSuccess = _showSuccess[1];
  var _cur = useState("USD"); var cur = _cur[0]; var setCur = _cur[1];
  var _showCurPick = useState(false); var showCurPick = _showCurPick[0]; var setShowCurPick = _showCurPick[1];
  var _tipFeed = useState([]); var tipFeed = _tipFeed[0]; var setTipFeed = _tipFeed[1];
  var _totalTips = useState(0); var totalTips = _totalTips[0]; var setTotalTips = _totalTips[1];
  var _tipCount = useState(0); var tipCount = _tipCount[0]; var setTipCount = _tipCount[1];
  var _goalCurrent = useState(0); var goalCurrent = _goalCurrent[0]; var setGoalCurrent = _goalCurrent[1];

  var theme = THEMES.find(function(t) { return t.id === themeId; }) || THEMES[0];
  var curObj = CURRENCIES.find(function(c) { return c.code === cur; }) || CURRENCIES[0];
  var goalAmtNum = parseInt(goalAmt) || 0;

  var data = { name: name, tagline: tagline, lnAddress: lnAddr, message: message, icon: icon, goalLabel: goalLabel, goalAmount: goalAmtNum, goalCurrent: goalCurrent };

  function handleTip() {
    var amt = selAmt === "custom" ? (parseInt(customAmt) || 0) : selAmt;
    if (amt <= 0) return;
    setShowSuccess(true);
    setTotalTips(function(v) { return v + amt; });
    setTipCount(function(v) { return v + 1; });
    setGoalCurrent(function(v) { return v + amt; });
    var times = ["just now", "1m ago", "2m ago", "5m ago", "12m ago"];
    setTipFeed(function(prev) {
      var newTip = { avatar: tipAvatar, amount: amt, msg: tipMsg.substring(0, 50), time: times[0] };
      var updated = [newTip].concat(prev.slice(0, 9).map(function(tip, i) {
        return { avatar: tip.avatar, amount: tip.amount, msg: tip.msg, time: times[Math.min(i + 1, times.length - 1)] };
      }));
      return updated;
    });
    setTipMsg("");
    setTimeout(function() { setShowSuccess(false); }, 3000);
  }

  var sty = {
    bg: "#04060a", sf: "#0a0e16", sf2: "#0f1520", bd: "#162030",
    tx: "#c8d0e4", dm: "#5c6888", mt: "#2e3a52", or: "#f7931a",
    gn: "#00e676", rd: "#ff5252", cy: "#00e5ff",
  };

  var VIEWS = [
    { id: "builder", l: "⚡ Builder" }, { id: "preview", l: "👁️ Preview" },
    { id: "dashboard", l: "📊 Dashboard" }, { id: "howto", l: "❓ How It Works" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: sty.bg, fontFamily: sans, color: sty.tx }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box}input:focus,textarea:focus{outline:none;border-color:${sty.or}!important}::placeholder{color:${sty.mt}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${sty.bg}}::-webkit-scrollbar-thumb{background:${sty.bd};border-radius:3px}`}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid " + sty.bd, padding: "10px 14px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, " + sty.or + ", #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 15 }}>⚡</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900 }}>SAT<span style={{ color: sty.or }}>TIP</span></div>
              <div style={{ color: sty.mt, fontSize: 7, fontFamily: mono, letterSpacing: 1.5 }}>LIGHTNING TIP PAGES • BUILT FOR CREATORS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {/* Currency picker */}
            <div style={{ position: "relative" }}>
              <button onClick={function() { setShowCurPick(!showCurPick); }} style={{ background: sty.sf2, border: "1px solid " + sty.bd, borderRadius: 6, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: sty.tx, fontFamily: mono, fontSize: 11, fontWeight: 700 }}>
                {curObj.flag} {cur} <span style={{ color: sty.mt, fontSize: 8 }}>▼</span>
              </button>
              {showCurPick && (
                <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, zIndex: 100, background: sty.sf, border: "1px solid " + sty.bd, borderRadius: 10, padding: 4, maxHeight: 280, overflowY: "auto", width: 200, boxShadow: "0 12px 40px rgba(0,0,0,.6)" }}>
                  {CURRENCIES.map(function(c) {
                    return (
                      <button key={c.code} onClick={function() { setCur(c.code); setShowCurPick(false); }} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "5px 8px", background: cur === c.code ? sty.or + "18" : "transparent", border: "none", borderRadius: 5, cursor: "pointer", color: sty.tx, fontSize: 11, fontFamily: mono }}>
                        {c.flag} <strong>{c.code}</strong>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Nav */}
            {VIEWS.map(function(v) {
              return (
                <button key={v.id} onClick={function() { setView(v.id); }} style={{
                  background: view === v.id ? sty.or + "20" : "transparent",
                  border: "1px solid " + (view === v.id ? sty.or + "40" : "transparent"),
                  borderRadius: 5, padding: "5px 9px", cursor: "pointer",
                  color: view === v.id ? sty.or : sty.dm, fontSize: 10, fontWeight: 700, fontFamily: mono,
                }}>{v.l}</button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px" }}>

        {/* BUILDER */}
        {view === "builder" && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {/* Controls */}
            <div style={{ flex: "1 1 300px", minWidth: 280 }}>
              <div style={{ background: sty.sf, borderRadius: 12, padding: 18, border: "1px solid " + sty.bd, marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Create Your Tip Page</div>

                {[
                  { label: "YOUR NAME", val: name, set: setName, ph: "e.g. DJ Satoshi", font: sans },
                  { label: "TAGLINE", val: tagline, set: setTagline, ph: "e.g. Making beats for the culture", font: sans },
                  { label: "LIGHTNING ADDRESS", val: lnAddr, set: setLnAddr, ph: "yourname@getalby.com", font: mono },
                  { label: "PERSONAL MESSAGE (shown on page)", val: message, set: setMessage, ph: "Thanks for the support!", font: sans },
                ].map(function(f, i) {
                  return (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ color: sty.dm, fontSize: 9, fontFamily: mono, marginBottom: 3, letterSpacing: 0.5 }}>{f.label}</div>
                      <input value={f.val} onChange={function(e) { f.set(e.target.value); }} placeholder={f.ph} style={{ width: "100%", background: sty.sf2, border: "1px solid " + sty.bd, borderRadius: 7, padding: "8px 10px", color: sty.tx, fontSize: 13, fontFamily: f.font }} />
                    </div>
                  );
                })}

                {/* Goal */}
                <div style={{ marginBottom: 10, padding: 10, background: sty.sf2, borderRadius: 8, border: "1px solid " + sty.bd }}>
                  <div style={{ color: sty.dm, fontSize: 9, fontFamily: mono, marginBottom: 6 }}>TIP GOAL (optional)</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input value={goalLabel} onChange={function(e) { setGoalLabel(e.target.value); }} placeholder="e.g. New microphone" style={{ flex: 1, background: sty.bg, border: "1px solid " + sty.bd, borderRadius: 6, padding: "6px 8px", color: sty.tx, fontSize: 11 }} />
                    <input value={goalAmt} onChange={function(e) { setGoalAmt(e.target.value.replace(/\D/g, "")); }} placeholder="sats goal" style={{ width: 90, background: sty.bg, border: "1px solid " + sty.bd, borderRadius: 6, padding: "6px 8px", color: sty.or, fontSize: 11, fontFamily: mono, textAlign: "center" }} />
                  </div>
                </div>

                {/* Icons */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: sty.dm, fontSize: 9, fontFamily: mono, marginBottom: 4 }}>CATEGORY</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
                    {ICONS.map(function(ic) {
                      var active = icon === ic.id;
                      return (
                        <button key={ic.id} onClick={function() { setIcon(ic.id); }} style={{ background: active ? sty.or + "20" : sty.sf2, border: "1px solid " + (active ? sty.or + "50" : sty.bd), borderRadius: 5, padding: "5px 2px", cursor: "pointer", color: active ? sty.or : sty.dm, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                          <span style={{ fontSize: 16 }}>{ic.emoji}</span>
                          <span style={{ fontFamily: mono, fontSize: 7 }}>{ic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Themes */}
                <div>
                  <div style={{ color: sty.dm, fontSize: 9, fontFamily: mono, marginBottom: 4 }}>THEME</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
                    {THEMES.map(function(th) {
                      var active = themeId === th.id;
                      return (
                        <button key={th.id} onClick={function() { setThemeId(th.id); }} style={{ background: th.bg, border: "2px solid " + (active ? th.accent : th.border), borderRadius: 6, padding: "7px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                          <div style={{ display: "flex", gap: 2 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: th.accent }} />
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: th.card }} />
                          </div>
                          <span style={{ fontSize: 7, color: th.text, fontFamily: mono }}>{th.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div style={{ flex: "1 1 360px", minWidth: 320 }}>
              <div style={{ background: theme.bg, borderRadius: 14, border: "1px solid " + sty.bd, overflow: "hidden" }}>
                <div style={{ padding: "5px 10px", background: sty.sf, borderBottom: "1px solid " + sty.bd, display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ffbd2e" }} />
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
                  <div style={{ flex: 1, textAlign: "center", color: sty.mt, fontSize: 8, fontFamily: mono }}>
                    sattip.com/{(name || "yourname").toLowerCase().replace(/[^a-z0-9]/g, "")}
                  </div>
                </div>
                <TipPage theme={theme} data={data} currency={cur} selAmt={selAmt} setSelAmt={setSelAmt} customAmt={customAmt} setCustomAmt={setCustomAmt} tipMsg={tipMsg} setTipMsg={setTipMsg} tipAvatar={tipAvatar} setTipAvatar={setTipAvatar} showAvatarPicker={showAP} setShowAvatarPicker={setShowAP} showSuccess={showSuccess} onTip={handleTip} tipFeed={tipFeed} />
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW */}
        {view === "preview" && (
          <div>
            <button onClick={function() { setView("builder"); }} style={{ background: "transparent", border: "none", color: sty.dm, cursor: "pointer", fontFamily: mono, fontSize: 11, marginBottom: 10, padding: 0 }}>← back to builder</button>
            <div style={{ maxWidth: 400, margin: "0 auto", background: theme.bg, borderRadius: 14, overflow: "hidden", border: "1px solid " + sty.bd }}>
              <TipPage theme={theme} data={data} currency={cur} selAmt={selAmt} setSelAmt={setSelAmt} customAmt={customAmt} setCustomAmt={setCustomAmt} tipMsg={tipMsg} setTipMsg={setTipMsg} tipAvatar={tipAvatar} setTipAvatar={setTipAvatar} showAvatarPicker={showAP} setShowAvatarPicker={setShowAP} showSuccess={showSuccess} onTip={handleTip} tipFeed={tipFeed} />
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ background: sty.sf, borderRadius: 12, padding: 18, border: "1px solid " + sty.bd, marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Creator Dashboard</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {[
                  { l: "Total Received", v: totalTips.toLocaleString() + " sats", c: sty.or },
                  { l: "Tips", v: "" + tipCount, c: sty.cy },
                  { l: "Avg Tip", v: tipCount > 0 ? Math.round(totalTips / tipCount).toLocaleString() + " sats" : "—", c: sty.gn },
                  { l: "In " + cur, v: satsToLocal(totalTips, cur), c: sty.tx },
                ].map(function(s, i) {
                  return (
                    <div key={i} style={{ flex: "1 1 120px", background: sty.sf2, borderRadius: 8, padding: 10, border: "1px solid " + sty.bd }}>
                      <div style={{ color: sty.mt, fontSize: 8, fontFamily: mono }}>{s.l}</div>
                      <div style={{ color: s.c, fontSize: 18, fontWeight: 900, fontFamily: mono, marginTop: 3 }}>{s.v}</div>
                    </div>
                  );
                })}
              </div>
              {goalAmtNum > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: sty.dm }}>{goalLabel || "Goal"}</span>
                    <span style={{ fontSize: 11, color: sty.or, fontFamily: mono }}>{goalCurrent.toLocaleString()} / {goalAmtNum.toLocaleString()} sats</span>
                  </div>
                  <div style={{ height: 10, background: sty.bd, borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ width: Math.min((goalCurrent / goalAmtNum) * 100, 100) + "%", height: "100%", background: sty.or, borderRadius: 5 }} />
                  </div>
                </div>
              )}
              <div style={{ background: sty.sf2, borderRadius: 8, padding: 10, border: "1px solid " + sty.bd }}>
                <div style={{ color: sty.dm, fontSize: 9, fontFamily: mono, marginBottom: 6 }}>YOUR TIP PAGE LINK</div>
                <div style={{ fontFamily: mono, fontSize: 12, color: sty.cy }}>sattip.com/{(name || "yourname").toLowerCase().replace(/[^a-z0-9]/g, "")}</div>
                <div style={{ color: sty.mt, fontSize: 10, marginTop: 4, lineHeight: 1.5 }}>Share this anywhere — social bios, email signatures, show notes, merch, QR codes on physical tip jars.</div>
              </div>
            </div>

            {/* Recent tips */}
            {tipFeed.length > 0 && (
              <div style={{ background: sty.sf, borderRadius: 12, padding: 18, border: "1px solid " + sty.bd }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Recent Tips</div>
                {tipFeed.map(function(tip, i) {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid " + sty.bd + "40" }}>
                      <span style={{ fontSize: 20 }}>{tip.avatar}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: sty.or, fontFamily: mono, fontSize: 12, fontWeight: 700 }}>{tip.amount.toLocaleString()} sats <span style={{ color: sty.dm, fontWeight: 400 }}>({satsToLocal(tip.amount, cur)})</span></div>
                        {tip.msg && <div style={{ color: sty.dm, fontSize: 11, marginTop: 1 }}>"{tip.msg}"</div>}
                      </div>
                      <span style={{ color: sty.mt, fontSize: 9, fontFamily: mono }}>{tip.time}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* HOW IT WORKS */}
        {view === "howto" && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ background: sty.sf, borderRadius: 12, padding: 20, border: "1px solid " + sty.bd, marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>How SatTip Works</div>
              <div style={{ color: sty.dm, fontSize: 12, marginBottom: 18, lineHeight: 1.6 }}>Create a tip page in 60 seconds. Share it. Get paid in Bitcoin over Lightning. No subscriptions, no banks, no middlemen.</div>

              {[
                { s: "1", t: "Build", d: "Enter your name and Lightning address. Pick a theme and category. Set a tip goal if you want. Takes 60 seconds.", i: "🛠️" },
                { s: "2", t: "Share", d: "Get your unique link — sattip.com/yourname. Drop it in your bio, email signature, podcast notes, business card, or physical tip jar QR code.", i: "🔗" },
                { s: "3", t: "Earn", d: "Fans click, pick an amount, and send sats instantly. They can choose an avatar and leave a message. Tips arrive in your Lightning wallet in under 1 second.", i: "⚡" },
                { s: "4", t: "Keep Almost Everything", d: "SatTip takes a small percentage to operate the service. You keep the vast majority. No monthly fees, no minimums, no hidden charges.", i: "💰" },
              ].map(function(step, i) {
                return (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: sty.or + "15", border: "1px solid " + sty.or + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{step.i}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ background: sty.or + "20", color: sty.or, padding: "1px 6px", borderRadius: 3, fontSize: 9, fontFamily: mono, fontWeight: 700 }}>STEP {step.s}</span>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{step.t}</span>
                      </div>
                      <div style={{ color: sty.dm, fontSize: 11, lineHeight: 1.6 }}>{step.d}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparison */}
            <div style={{ background: sty.sf, borderRadius: 12, padding: 18, border: "1px solid " + sty.bd, marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>SatTip vs The Others</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr>
                      {["", "SatTip", "Buy Me a Coffee", "Patreon", "PayPal.me"].map(function(h, i) {
                        return <th key={i} style={{ padding: "7px 8px", textAlign: i === 0 ? "left" : "center", color: i === 1 ? sty.or : sty.mt, fontFamily: mono, fontSize: 9, borderBottom: "1px solid " + sty.bd }}>{h}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Payout Speed", "Instant ⚡", "1-5 days", "1-5 days", "Instant"],
                      ["Minimum Tip", "1 sat", "$1", "$1", "$1"],
                      ["Account for Fans", "No", "Optional", "Yes", "Yes"],
                      ["Bank Required", "No", "Yes", "Yes", "Yes"],
                      ["Works Globally", "Everywhere", "Limited", "Limited", "Limited"],
                      ["Fan Privacy", "Full", "None", "None", "None"],
                      ["Tip Messages", "Yes", "Yes", "Yes", "No"],
                      ["Tip Goals", "Yes", "Yes", "No", "No"],
                      ["Multi-Currency", "20+", "~10", "~10", "~25"],
                    ].map(function(row, i) {
                      return (
                        <tr key={i}>
                          {row.map(function(cell, j) {
                            var isGood = j === 1 && (cell.indexOf("Instant") >= 0 || cell === "1 sat" || cell === "No" || cell === "Everywhere" || cell === "Full" || cell === "Yes" || cell === "20+");
                            return <td key={j} style={{ padding: "6px 8px", textAlign: j === 0 ? "left" : "center", color: isGood ? sty.gn : sty.tx, fontWeight: isGood ? 700 : 400, borderBottom: "1px solid " + sty.bd + "40", background: isGood ? sty.gn + "06" : "transparent", fontFamily: j > 0 ? mono : sans, fontSize: 10 }}>{cell}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Features */}
            <div style={{ background: sty.sf, borderRadius: 12, padding: 18, border: "1px solid " + sty.bd }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Features</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { i: "🎨", t: "12 Themes", d: "From Neon Cyber to Parchment" },
                  { i: "💬", t: "Tip Messages", d: "Fans leave notes with tips" },
                  { i: "😊", t: "Fan Avatars", d: "20 emoji identities to choose" },
                  { i: "🎯", t: "Tip Goals", d: "Public fundraising with progress" },
                  { i: "📡", t: "Live Feed", d: "Social proof drives more tips" },
                  { i: "🌍", t: "20 Currencies", d: "Show sats in local money" },
                  { i: "📱", t: "QR Codes", d: "Print for physical tip jars" },
                  { i: "📊", t: "Dashboard", d: "Track tips and earnings" },
                ].map(function(f, i) {
                  return (
                    <div key={i} style={{ background: sty.sf2, borderRadius: 8, padding: 10, border: "1px solid " + sty.bd }}>
                      <div style={{ fontSize: 18, marginBottom: 3 }}>{f.i}</div>
                      <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 1 }}>{f.t}</div>
                      <div style={{ color: sty.dm, fontSize: 10 }}>{f.d}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid " + sty.bd, padding: "8px 14px", marginTop: 20 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ color: sty.mt, fontSize: 8, fontFamily: mono }}>⚡ SATTIP • instant payouts • no accounts needed • 20 currencies</div>
          <div style={{ color: sty.mt, fontSize: 8, fontFamily: mono }}>tips flow. creators eat. sats stack.</div>
        </div>
      </div>
    </div>
  );
}
