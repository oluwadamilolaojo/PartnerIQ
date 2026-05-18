import { useState, useEffect, useMemo } from "react";

// ════════════════════════════════════════════════════════════════
//  DATA MODEL — pillars, criteria, weights, HDD phase mapping
// ════════════════════════════════════════════════════════════════

const PILLARS = [
  {
    id: "values", label: "Values", weight: 15, tier: "core", hddPhase: 2,
    description: "The bedrock predictors of long-term character.",
    criteria: [
      { id: "integrity", label: "Integrity", anchors: ["Frequently lies or avoids truth", "Sometimes dishonest under pressure", "Mostly honest, occasional white lies", "Honest in most situations", "Always honest, even when inconvenient"] },
      { id: "kindness", label: "Kindness", anchors: ["Rude or dismissive regularly", "Inconsistent kindness", "Kind to close circle only", "Generally kind to others", "Consistently kind to everyone"] },
      { id: "emotional_maturity", label: "Emotional maturity", anchors: ["Overreacts or blames", "Sometimes lashes out", "Manages emotions sometimes", "Usually calm and reflective", "Always calm, resolves issues thoughtfully"] },
      { id: "accountability", label: "Accountability", anchors: ["Avoids responsibility", "Blames others often", "Accepts responsibility sometimes", "Usually owns mistakes", "Always owns mistakes and actively fixes them"] },
      { id: "respect", label: "Respect", anchors: ["Disregards boundaries", "Sometimes disregards boundaries", "Respects basic boundaries", "Mostly respectful of time/space", "Fully respects boundaries, time, and ambitions"] },
      { id: "moral_compass", label: "Faith / Moral compass", anchors: ["No guiding principles", "Principles sometimes ignored", "Mostly consistent morals", "Acts morally in most situations", "Strong ethics guide all actions consistently"] },
    ]
  },
  {
    id: "eq", label: "Emotional Intelligence", weight: 10, tier: "mid", hddPhase: 3,
    description: "How they navigate the emotional landscape of partnership.",
    criteria: [
      { id: "communication", label: "Communication", anchors: ["Avoids communicating", "Often unclear", "Communicates occasionally well", "Clear most of the time", "Always clear and actively listens"] },
      { id: "conflict", label: "Conflict resolution", anchors: ["Escalates arguments", "Sometimes listens but fights", "Can compromise sometimes", "Usually solution-focused", "Always calm, solution-oriented"] },
      { id: "empathy", label: "Empathy", anchors: ["Shows no empathy", "Limited empathy", "Empathetic sometimes", "Mostly empathetic", "Deeply understands others' emotions consistently"] },
      { id: "emotional_safety", label: "Emotional safety", anchors: ["Often dismissive", "Occasionally dismissive", "Neutral environment", "Usually safe space", "Always makes others feel heard and safe"] },
      { id: "consistency", label: "Consistency", anchors: ["Erratic behavior", "Inconsistent effort", "Usually stable", "Mostly reliable", "Always stable, predictable energy"] },
    ]
  },
  {
    id: "lifestyle", label: "Lifestyle", weight: 7.5, tier: "low", hddPhase: 2,
    description: "Day-to-day operational compatibility.",
    criteria: [
      { id: "ambition", label: "Ambition", anchors: ["No goals", "Minimal or vague goals", "Some goals with effort", "Clear goals pursued", "Clear goals pursued consistently and strategically"] },
      { id: "financial_mindset", label: "Financial mindset", anchors: ["Irresponsible", "Needs guidance often", "Mostly responsible", "Good planning and saving", "Fully responsible and future-oriented"] },
      { id: "time_management", label: "Time management", anchors: ["Frequently late, disorganized", "Sometimes late", "Mostly organized", "Usually punctual and planned", "Always punctual, plans effectively"] },
      { id: "health_habits", label: "Health habits", anchors: ["Neglects health", "Rarely exercises or cares", "Occasionally healthy choices", "Mostly maintains health", "Fully maintains physical and mental health"] },
      { id: "social_alignment", label: "Social alignment", anchors: ["Causes friction in social circles", "Often mismatched", "Sometimes compatible", "Usually fits in", "Fully aligned socially and culturally"] },
    ]
  },
  {
    id: "partnership", label: "Partnership", weight: 10, tier: "mid", hddPhase: 3,
    description: "How they show up as a co-investor in shared life.",
    criteria: [
      { id: "growth_mindset", label: "Growth mindset", anchors: ["Resists feedback", "Rarely takes feedback", "Accepts feedback sometimes", "Usually learns from feedback", "Always seeks growth and feedback"] },
      { id: "supportiveness", label: "Supportiveness", anchors: ["Unsupportive", "Inconsistent support", "Supports sometimes", "Mostly supportive", "Fully supportive consistently"] },
      { id: "independence", label: "Independence", anchors: ["Fully dependent", "Frequently dependent", "Some independence", "Mostly independent", "Fully self-sufficient and strong"] },
      { id: "problem_solving", label: "Problem-solving", anchors: ["Avoids problems", "Blames or delays", "Helps sometimes", "Usually solution-focused", "Always tackles problems as a team"] },
      { id: "long_term", label: "Long-term thinking", anchors: ["Only short-term view", "Occasionally plans ahead", "Plans sometimes", "Mostly future-focused", "Always plans long-term for self and relationship"] },
    ]
  },
  {
    id: "chemistry", label: "Chemistry", weight: 7.5, tier: "low", hddPhase: 1,
    description: "Attraction, presence, and intimate compatibility.",
    criteria: [
      { id: "physical", label: "Physical attraction", anchors: ["No attraction", "Minimal", "Moderate", "Usually attracted", "Strong, mutual, and consistent"] },
      { id: "presence", label: "Presence", anchors: ["Distracted, disengaged", "Sometimes attentive", "Occasionally present", "Mostly engaged", "Fully present, attentive, and warm"] },
      { id: "playfulness", label: "Playfulness", anchors: ["Never playful", "Rarely playful", "Occasionally playful", "Mostly fun", "Brings joy and fun consistently"] },
      { id: "intimacy", label: "Intimacy alignment", anchors: ["Completely misaligned", "Occasionally misaligned", "Sometimes aligned", "Mostly aligned", "Fully aligned and comfortable with expectations"] },
    ]
  },
  {
    id: "family", label: "Family & Background", weight: 10, tier: "mid", hddPhase: 4,
    description: "Inherited patterns that shape future relationship structure.",
    criteria: [
      { id: "parents", label: "Relationship with parents", anchors: ["Toxic or overly dependent", "Strained or inconsistent", "Neutral", "Mostly healthy", "Fully healthy, respectful, independent"] },
      { id: "boundaries", label: "Boundary-setting with family", anchors: ["No boundaries", "Rarely sets boundaries", "Sometimes enforces", "Usually enforces", "Always enforces healthy boundaries"] },
      { id: "fam_financial", label: "Family financial expectations", anchors: ["Creates strain", "Occasionally unrealistic", "Sometimes manageable", "Mostly reasonable", "Fully realistic, no hidden obligations"] },
      { id: "cultural", label: "Cultural / traditional pressure", anchors: ["Overly influenced", "Sometimes influenced", "Balanced occasionally", "Mostly independent", "Fully respects culture but prioritizes shared decisions"] },
      { id: "conflict_patterns", label: "Conflict patterns learned growing up", anchors: ["Repeats harmful patterns", "Sometimes repeats patterns", "Occasionally improves", "Mostly self-aware", "Fully self-aware and actively improves"] },
    ]
  },
  {
    id: "vup", label: "Values Under Pressure", weight: 15, tier: "core", hddPhase: 3,
    description: "Character revealed when stakes are real. The most predictive pillar.",
    criteria: [
      { id: "stress_response", label: "Stress response", anchors: ["Panics or withdraws", "Often overwhelmed", "Sometimes composed", "Usually composed", "Remains calm, communicative, solution-focused"] },
      { id: "crisis_accountability", label: "Accountability in crisis", anchors: ["Blames others", "Sometimes accepts blame", "Occasionally accountable", "Mostly accountable", "Fully accountable, owns mistakes immediately"] },
      { id: "decision_uncertainty", label: "Decision-making under uncertainty", anchors: ["Impulsive or freezes", "Poor decisions often", "Some sound choices", "Usually clear thinking", "Always thoughtful and measured"] },
      { id: "emotional_regulation", label: "Emotional regulation", anchors: ["Loses control", "Sometimes loses control", "Occasionally self-regulates", "Mostly controlled", "Always regulates emotions effectively"] },
      { id: "values_consistency", label: "Consistency of values", anchors: ["Changes often", "Inconsistent under stress", "Sometimes consistent", "Mostly consistent", "Fully consistent even when costly"] },
    ]
  },
  {
    id: "vision", label: "Vision & Life Design", weight: 15, tier: "core", hddPhase: 4,
    description: "The structural alignment that determines whether the lives can fit together.",
    criteria: [
      { id: "location", label: "Long-term location vision", anchors: ["No plan", "Vague plan", "Some clarity", "Mostly clear", "Fully clear and flexible vision"] },
      { id: "career_family", label: "Career vs family balance", anchors: ["Ignores trade-offs", "Poor balance", "Sometimes balanced", "Mostly balanced", "Fully understands and balances priorities"] },
      { id: "children", label: "Children philosophy", anchors: ["Misaligned", "Minimal alignment", "Some alignment", "Mostly aligned", "Fully aligned on values and plans"] },
      { id: "lifestyle_ambition", label: "Lifestyle ambition", anchors: ["Unrealistic", "Often misaligned", "Sometimes realistic", "Mostly realistic", "Fully realistic, achievable, and intentional"] },
      { id: "adaptability", label: "Adaptability as life evolves", anchors: ["Resists change", "Rarely adapts", "Sometimes adapts", "Usually adapts", "Fully flexible, adjusts gracefully"] },
    ]
  },
  {
    id: "financial", label: "Financial Compatibility", weight: 10, tier: "mid", hddPhase: 4,
    description: "Money operating model — the most material source of recurring friction.",
    criteria: [
      { id: "income", label: "Income stability or trajectory", anchors: ["Unstable, unpredictable", "Occasionally stable", "Mostly stable", "Stable with minor fluctuations", "Very stable or clear, credible growth plan"] },
      { id: "spending", label: "Spending discipline", anchors: ["Spends impulsively", "Rarely controls spending", "Sometimes controlled", "Mostly disciplined", "Fully disciplined, intentional spending"] },
      { id: "saving", label: "Saving & investing mindset", anchors: ["No savings or planning", "Little effort", "Occasionally saves", "Mostly saves and invests", "Regularly saves and invests strategically"] },
      { id: "debt", label: "Debt philosophy", anchors: ["Mismanaged debt", "Often risky debt", "Manages moderately", "Mostly responsible debt", "Uses debt intentionally, low risk"] },
      { id: "transparency", label: "Financial transparency", anchors: ["Secretive", "Sometimes hides info", "Mostly open", "Mostly transparent", "Fully open about finances"] },
      { id: "lifestyle_reality", label: "Lifestyle expectations vs reality", anchors: ["Unrealistic", "Occasionally mismatched", "Sometimes aligned", "Mostly aligned", "Fully aligned, realistic lifestyle"] },
      { id: "generosity", label: "Generosity vs responsibility balance", anchors: ["Over-giving or stingy", "Sometimes misbalanced", "Occasionally balanced", "Mostly balanced", "Fully balanced and sustainable"] },
    ]
  },
];

const HDD_PHASES = [
  { id: 1, name: "Mutual Interest", days: 14, hypothesis: "This person is genuinely interested in spending time with me.", color: "#1A6B5E" },
  { id: 2, name: "Baseline Character", days: 42, hypothesis: "Honest, respectful, consistent across public and private contexts.", color: "#1B2A4A" },
  { id: 3, name: "Emotional Architecture", days: 70, hypothesis: "Emotionally available, self-aware, healthy in conflict.", color: "#1A6B5E" },
  { id: 4, name: "Values Alignment", days: 120, hypothesis: "Core values on children, money, family, career are compatible.", color: "#C9A84C" },
  { id: 5, name: "Long-Term Fit", days: 210, hypothesis: "We are better together than apart across all material dimensions.", color: "#B84A2E" },
];

const RED_FLAGS = [
  { id: "dishonesty", label: "Pattern of repeated dishonesty" },
  { id: "contempt", label: "Disrespect or contempt observed" },
  { id: "volatility", label: "Emotional volatility / instability" },
  { id: "values_mismatch", label: "Hard value mismatch (kids, core beliefs)" },
];

// ════════════════════════════════════════════════════════════════
//  STORAGE
// ════════════════════════════════════════════════════════════════

const STORAGE_KEY = "partneriq_pro_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { candidates: [], selfScores: {}, activeId: null };
    return JSON.parse(raw);
  } catch { return { candidates: [], selfScores: {}, activeId: null }; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.error("Storage write failed", e); }
}

// ════════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════════

function uid() { return Math.random().toString(36).slice(2, 10); }
function now() { return new Date().toISOString(); }
function daysSince(iso) { return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000); }
function fmtDate(iso) { const d = new Date(iso); return `${d.getDate()} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getFullYear()}`; }
function fmtDateTime(iso) { const d = new Date(iso); return `${fmtDate(iso)} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; }

function newCandidate(name) {
  return {
    id: uid(),
    name,
    photoEmoji: "💼",
    howMet: "",
    addedAt: now(),
    status: "active",
    currentPhase: 1,
    phaseStartedAt: now(),
    phaseHistory: [{ phase: 1, startedAt: now(), endedAt: null, verdict: null }],
    criteria: {},
    criteriaHistory: {},
    snapshots: [],
    observations: [],
    vetos: [],
    redFlags: {},
  };
}

function computeScore(candidate) {
  if (!candidate) return null;
  const hasVeto = Object.values(candidate.redFlags || {}).some(Boolean);
  if (hasVeto) return { total: 0, byPillar: {}, vetoed: true, scoredPillars: 0 };

  const byPillar = {};
  let totalWeighted = 0;
  let totalAvailableWeight = 0;
  let scoredPillarCount = 0;

  for (const pillar of PILLARS) {
    if (pillar.hddPhase > candidate.currentPhase) {
      byPillar[pillar.id] = { locked: true };
      continue;
    }
    const scores = pillar.criteria.map(c => candidate.criteria[`${pillar.id}_${c.id}`]).filter(v => v != null);
    if (scores.length === 0) {
      byPillar[pillar.id] = { unrated: true };
      continue;
    }
    const avg = scores.reduce((a,b) => a+b, 0) / scores.length;
    const pct = (avg / 5) * 100;
    const weightedContribution = (pct / 100) * pillar.weight;
    byPillar[pillar.id] = { avg, pct, weight: pillar.weight, score: weightedContribution, scoredCount: scores.length, totalCount: pillar.criteria.length };
    totalWeighted += weightedContribution;
    totalAvailableWeight += pillar.weight;
    scoredPillarCount++;
  }

  const total = totalAvailableWeight > 0 ? (totalWeighted / totalAvailableWeight) * 100 : 0;
  return { total, byPillar, vetoed: false, scoredPillars: scoredPillarCount, totalAvailableWeight };
}

function getVerdict(score) {
  if (!score) return null;
  if (score.vetoed) return { label: "VETO — POSITION DEAD", color: "#B84A2E", bg: "#FDF2EE" };
  if (score.scoredPillars < 3) return { label: "INSUFFICIENT DATA", color: "#6B7280", bg: "#F4F6FA" };
  if (score.total >= 85) return { label: "STRONG BUY", color: "#1A6B5E", bg: "#E6F4F1" };
  if (score.total >= 70) return { label: "HIGH CONVICTION", color: "#1B2A4A", bg: "#EAF0F8" };
  if (score.total >= 55) return { label: "INVESTIGATE GAPS", color: "#C9A84C", bg: "#FDF8EC" };
  return { label: "PASS — EXIT POSITION", color: "#B84A2E", bg: "#FDF2EE" };
}

// ════════════════════════════════════════════════════════════════
//  COMPONENTS
// ════════════════════════════════════════════════════════════════

function Sidebar({ candidates, activeId, onSelect, onAdd, onShowSelf }) {
  const [newName, setNewName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const active = candidates.filter(c => c.status === "active");
  const archived = candidates.filter(c => c.status !== "active");
  const [showArchived, setShowArchived] = useState(false);

  function handleAdd() {
    if (newName.trim()) { onAdd(newName.trim()); setNewName(""); setShowInput(false); }
  }

  return (
    <div style={{ width: 280, background: "#F4F6FA", borderRight: "1px solid #D0DCF0", display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ padding: "20px 18px", borderBottom: "1px solid #D0DCF0", background: "#1B2A4A" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: "bold", color: "#FFFFFF", lineHeight: 1 }}>PartnerIQ™</div>
        <div style={{ fontFamily: "Calibri, sans-serif", fontSize: 10, color: "#C9A84C", letterSpacing: 3, marginTop: 6 }}>DUE DILIGENCE PLATFORM</div>
      </div>

      <div style={{ padding: "14px 16px", borderBottom: "1px solid #D0DCF0" }}>
        <button onClick={onShowSelf} style={{ width: "100%", padding: "10px 12px", background: "transparent", color: "#1B2A4A", border: "1px solid #1B2A4A", borderRadius: 4, fontFamily: "Calibri, sans-serif", fontSize: 13, fontWeight: "bold", cursor: "pointer", letterSpacing: 1 }}>
          ⊙ INTROSPECTIVE PANEL
        </button>
      </div>

      <div style={{ padding: "16px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#6B7280", letterSpacing: 2, fontWeight: "bold" }}>ACTIVE PIPELINE ({active.length})</div>
        {!showInput && (
          <button onClick={() => setShowInput(true)} style={{ background: "#C9A84C", color: "#FFF", border: "none", padding: "3px 8px", fontSize: 11, borderRadius: 2, cursor: "pointer", fontFamily: "Calibri", fontWeight: "bold" }}>+ NEW</button>
        )}
      </div>

      {showInput && (
        <div style={{ padding: "0 16px 12px" }}>
          <input
            autoFocus value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowInput(false); }}
            placeholder="Candidate name..."
            style={{ width: "100%", padding: "6px 8px", border: "1px solid #C9A84C", fontFamily: "Calibri", fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        {active.length === 0 && (
          <div style={{ padding: "20px 16px", fontFamily: "Calibri", fontSize: 12, color: "#6B7280", fontStyle: "italic", textAlign: "center" }}>
            No active candidates. Click + NEW to begin.
          </div>
        )}
        {active.map(c => <CandidateRow key={c.id} candidate={c} active={c.id === activeId} onClick={() => onSelect(c.id)} />)}

        {archived.length > 0 && (
          <div style={{ padding: "16px 16px 8px", borderTop: "1px solid #D0DCF0", marginTop: 8 }}>
            <button onClick={() => setShowArchived(s => !s)} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span style={{ fontFamily: "Calibri", fontSize: 10, color: "#6B7280", letterSpacing: 2, fontWeight: "bold" }}>ARCHIVED ({archived.length})</span>
              <span style={{ color: "#6B7280", fontSize: 11 }}>{showArchived ? "▾" : "▸"}</span>
            </button>
          </div>
        )}
        {showArchived && archived.map(c => <CandidateRow key={c.id} candidate={c} active={c.id === activeId} onClick={() => onSelect(c.id)} archived />)}
      </div>

      <div style={{ padding: "10px 16px", borderTop: "1px solid #D0DCF0", fontFamily: "Calibri", fontSize: 10, color: "#6B7280", textAlign: "center" }}>
        Private. Local-only. No backend.
      </div>
    </div>
  );
}

function CandidateRow({ candidate, active, onClick, archived }) {
  const score = computeScore(candidate);
  const verdict = getVerdict(score);
  const phase = HDD_PHASES.find(p => p.id === candidate.currentPhase);
  const phaseDays = daysSince(candidate.phaseStartedAt);
  const phasePct = Math.min(100, (phaseDays / phase.days) * 100);
  const stale = !candidate.observations.length || daysSince(candidate.observations[0]?.at || candidate.addedAt) > 14;

  return (
    <div onClick={onClick} style={{
      padding: "12px 16px", cursor: "pointer",
      background: active ? "#FFFFFF" : "transparent",
      borderLeft: active ? "3px solid #C9A84C" : "3px solid transparent",
      borderBottom: "1px solid #EAF0F8",
      opacity: archived ? 0.55 : 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: "Georgia", fontSize: 15, fontWeight: "bold", color: "#1B2A4A" }}>{candidate.name}</div>
        {score && !score.vetoed && score.scoredPillars >= 3 && (
          <div style={{ fontFamily: "Georgia", fontSize: 15, fontWeight: "bold", color: verdict.color }}>{score.total.toFixed(0)}</div>
        )}
        {score?.vetoed && <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#B84A2E", fontWeight: "bold" }}>VETO</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <div style={{ fontFamily: "Calibri", fontSize: 10, color: phase.color, fontWeight: "bold", letterSpacing: 0.5 }}>P{phase.id} · {phase.name}</div>
        {stale && <div style={{ fontFamily: "Calibri", fontSize: 9, color: "#B84A2E", fontStyle: "italic" }}>STALE</div>}
      </div>
      <div style={{ marginTop: 6, background: "#EAF0F8", height: 3, borderRadius: 1 }}>
        <div style={{ width: `${phasePct}%`, height: "100%", background: phase.color, transition: "width 0.3s" }} />
      </div>
      <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#6B7280", marginTop: 4 }}>
        Day {phaseDays} of {phase.days}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Main candidate view
// ────────────────────────────────────────────────────────────────

function CandidateView({ candidate, onUpdate, onArchive, selfScores }) {
  const [tab, setTab] = useState("profile");

  useEffect(() => { setTab("profile"); }, [candidate.id]);
  const score = computeScore(candidate);
  const verdict = getVerdict(score);
  const phase = HDD_PHASES.find(p => p.id === candidate.currentPhase);

  return (
    <div style={{ flex: 1, background: "#FFFFFF", overflowY: "auto", height: "100vh" }}>
      {/* Top header */}
      <div style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #2A3F6B 100%)", color: "#FFFFFF", padding: "24px 36px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#C9A84C", letterSpacing: 3, fontWeight: "bold" }}>CANDIDATE FILE</div>
            <div style={{ fontFamily: "Georgia", fontSize: 32, fontWeight: "bold", marginTop: 4 }}>{candidate.name}</div>
            <div style={{ fontFamily: "Calibri", fontSize: 12, color: "#D0DCF0", marginTop: 4 }}>
              Phase {phase.id} · {phase.name} · Day {daysSince(candidate.phaseStartedAt)} of {phase.days}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            {score && !score.vetoed && score.scoredPillars >= 3 ? (
              <>
                <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#C9A84C", letterSpacing: 2, fontWeight: "bold" }}>COMPOSITE SCORE</div>
                <div style={{ fontFamily: "Georgia", fontSize: 48, fontWeight: "bold", lineHeight: 1, color: verdict.color === "#1B2A4A" ? "#FFFFFF" : verdict.color }}>{score.total.toFixed(1)}</div>
                <div style={{ fontFamily: "Calibri", fontSize: 11, letterSpacing: 2, fontWeight: "bold", marginTop: 4, color: verdict.color === "#1B2A4A" ? "#C9A84C" : verdict.color }}>{verdict.label}</div>
              </>
            ) : score?.vetoed ? (
              <>
                <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#B84A2E", letterSpacing: 2, fontWeight: "bold" }}>STATUS</div>
                <div style={{ fontFamily: "Georgia", fontSize: 28, fontWeight: "bold", color: "#FDF2EE" }}>VETOED</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#C9A84C", letterSpacing: 2, fontWeight: "bold" }}>STATUS</div>
                <div style={{ fontFamily: "Georgia", fontSize: 18, color: "#D0DCF0", marginTop: 4 }}>Insufficient data</div>
                <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#D0DCF0", marginTop: 4 }}>Score {score?.scoredPillars || 0}/3 pillars minimum</div>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginTop: 24 }}>
          {[
            { id: "profile", label: "Profile" },
            { id: "phase", label: "Phase & Criteria" },
            { id: "score", label: "Score" },
            { id: "observations", label: `Observations (${candidate.observations.length})` },
            { id: "history", label: "History & Memo" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 18px",
              background: tab === t.id ? "#C9A84C" : "transparent",
              color: tab === t.id ? "#1B2A4A" : "#D0DCF0",
              border: "none",
              borderBottom: tab === t.id ? "none" : "1px solid transparent",
              fontFamily: "Calibri", fontSize: 13, fontWeight: "bold",
              letterSpacing: 1, cursor: "pointer",
              transition: "all 0.15s",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px 36px 80px" }}>
        {tab === "profile" && <ProfileTab candidate={candidate} onUpdate={onUpdate} onArchive={onArchive} />}
        {tab === "phase" && <PhaseTab candidate={candidate} onUpdate={onUpdate} />}
        {tab === "score" && <ScoreTab candidate={candidate} onUpdate={onUpdate} selfScores={selfScores} score={score} />}
        {tab === "observations" && <ObservationsTab candidate={candidate} onUpdate={onUpdate} />}
        {tab === "history" && <HistoryTab candidate={candidate} score={score} />}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Profile Tab
// ────────────────────────────────────────────────────────────────

function ProfileTab({ candidate, onUpdate, onArchive }) {
  const [howMet, setHowMet] = useState(candidate.howMet);
  const [name, setName] = useState(candidate.name);

  useEffect(() => {
    setName(candidate.name);
    setHowMet(candidate.howMet);
  }, [candidate.id]);

  function save() { onUpdate({ ...candidate, name: name.trim() || candidate.name, howMet }); }

  return (
    <div style={{ maxWidth: 900 }}>
      <SectionLabel>SUBJECT IDENTIFICATION</SectionLabel>
      <div style={{ background: "#F4F6FA", padding: 24, borderLeft: "3px solid #C9A84C", marginBottom: 24 }}>
        <Field label="NAME">
          <input value={name} onChange={e => setName(e.target.value)} onBlur={save} style={inputStyle} />
        </Field>
        <Field label="HOW MET">
          <textarea value={howMet} onChange={e => setHowMet(e.target.value)} onBlur={save} rows={2} style={{ ...inputStyle, resize: "vertical", fontFamily: "Calibri" }} />
        </Field>
        <Field label="ADDED">
          <div style={readonlyStyle}>{fmtDate(candidate.addedAt)} · {daysSince(candidate.addedAt)} days ago</div>
        </Field>
      </div>

      <SectionLabel>PHASE PROGRESSION</SectionLabel>
      <div style={{ background: "#FFF", border: "1px solid #D0DCF0", padding: 24, marginBottom: 24 }}>
        {candidate.phaseHistory.map((ph, i) => {
          const phaseDef = HDD_PHASES.find(p => p.id === ph.phase);
          const isCurrent = i === candidate.phaseHistory.length - 1 && !ph.endedAt;
          return (
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: i < candidate.phaseHistory.length - 1 ? "1px solid #EAF0F8" : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: phaseDef.color, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia", fontSize: 18, fontWeight: "bold", flexShrink: 0 }}>{ph.phase}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Georgia", fontSize: 16, fontWeight: "bold", color: "#1B2A4A" }}>{phaseDef.name}{isCurrent && <span style={{ marginLeft: 8, fontFamily: "Calibri", fontSize: 10, color: "#C9A84C", letterSpacing: 2 }}>CURRENT</span>}</div>
                <div style={{ fontFamily: "Calibri", fontSize: 12, color: "#6B7280", marginTop: 4, fontStyle: "italic" }}>{phaseDef.hypothesis}</div>
                <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280", marginTop: 6 }}>
                  Started {fmtDate(ph.startedAt)}
                  {ph.endedAt && ` · Ended ${fmtDate(ph.endedAt)} · Verdict: `}
                  {ph.verdict && <span style={{ color: ph.verdict === "confirmed" ? "#1A6B5E" : "#B84A2E", fontWeight: "bold", textTransform: "uppercase" }}>{ph.verdict}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SectionLabel>POSITION MANAGEMENT</SectionLabel>
      {candidate.status === "active" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {candidate.currentPhase < 5 && (
            <div style={{ background: "#EAF0F8", border: "1px solid #D0DCF0", padding: 16, borderRadius: 4 }}>
              <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#1B2A4A", letterSpacing: 1, fontWeight: "bold", marginBottom: 6 }}>PHASE ADVANCEMENT</div>
              <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
                Gate decisions belong in the <strong style={{ color: "#1B2A4A" }}>Phase & Criteria tab</strong> once your observation window has elapsed. Confirm or refute the hypothesis there — advancing phases is a deliberate, evidence-based decision, not a profile action.
              </div>
              <button
                onClick={() => {
                  const nextPhase = candidate.currentPhase + 1;
                  onUpdate({
                    ...candidate,
                    currentPhase: nextPhase,
                    phaseStartedAt: now(),
                    phaseHistory: [
                      ...candidate.phaseHistory.slice(0, -1),
                      { ...candidate.phaseHistory[candidate.phaseHistory.length - 1], endedAt: now(), verdict: "confirmed" },
                      { phase: nextPhase, startedAt: now(), endedAt: null, verdict: null },
                    ],
                  });
                }}
                style={{ ...buttonStyle, background: "#1A6B5E", color: "#FFF" }}
              >
                ✓ ADVANCE TO PHASE {candidate.currentPhase + 1}
              </button>
            </div>
          )}

          {candidate.currentPhase === 5 && (
            <div style={{ background: "#E6F4F1", border: "1px solid #1A6B5E", padding: 16, borderRadius: 4 }}>
              <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#1A6B5E", letterSpacing: 1, fontWeight: "bold", marginBottom: 6 }}>TERMINAL COMMITMENT</div>
              <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
                Phase 5 confirmed. All five phases cleared. Stop testing — start building. This closes the file and marks the candidate as committed.
              </div>
              <button
                onClick={() => onArchive(candidate.id, "committed")}
                style={{ ...buttonStyle, background: "#1A6B5E", color: "#FFF" }}
              >
                ✓ COMMIT — STOP TESTING
              </button>
            </div>
          )}

          <div style={{ background: "#FDF2EE", border: "1px solid #B84A2E", padding: 16, borderRadius: 4 }}>
            <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#B84A2E", letterSpacing: 1, fontWeight: "bold", marginBottom: 6 }}>EXIT POSITION</div>
            <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
              Refutation confirmed or position no longer viable. Exit cleanly. File moves to archive. Emotional capital reallocated.
            </div>
            <button onClick={() => onArchive(candidate.id, "exited")} style={{ ...buttonStyle, background: "#B84A2E", color: "#FFF" }}>
              ✕ EXIT POSITION
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => onArchive(candidate.id, "active")} style={{ ...buttonStyle, background: "#1B2A4A", color: "#FFF" }}>REACTIVATE</button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Phase & Criteria Tab
// ────────────────────────────────────────────────────────────────

function PhaseTab({ candidate, onUpdate }) {
  const phase = HDD_PHASES.find(p => p.id === candidate.currentPhase);
  const phaseDays = daysSince(candidate.phaseStartedAt);
  const phasePct = Math.min(100, (phaseDays / phase.days) * 100);
  const windowExpired = phaseDays >= phase.days;

  const criteriaKey = `phase_${phase.id}`;
  const current = candidate.criteria[criteriaKey] || { confirm: "", refute: "", lockedAt: null };
  const history = candidate.criteriaHistory[criteriaKey] || [];

  const [confirm, setConfirm] = useState(current.confirm);
  const [refute, setRefute] = useState(current.refute);
  const [editing, setEditing] = useState(!current.lockedAt);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const key = `phase_${HDD_PHASES.find(p => p.id === candidate.currentPhase)?.id}`;
    const c = candidate.criteria[key] || { confirm: "", refute: "", lockedAt: null };
    setConfirm(c.confirm);
    setRefute(c.refute);
    setEditing(!c.lockedAt);
    setShowHistory(false);
  }, [candidate.id, candidate.currentPhase]);

  function lock() {
    if (!confirm.trim() || !refute.trim()) { alert("Both confirmation and refutation criteria must be written before locking."); return; }
    const updatedCriteria = { ...candidate.criteria, [criteriaKey]: { confirm: confirm.trim(), refute: refute.trim(), lockedAt: now() } };
    onUpdate({ ...candidate, criteria: updatedCriteria });
    setEditing(false);
  }

  function startEdit() {
    if (current.lockedAt) {
      const updatedHistory = { ...candidate.criteriaHistory, [criteriaKey]: [...history, { ...current, replacedAt: now() }] };
      onUpdate({ ...candidate, criteriaHistory: updatedHistory });
    }
    setEditing(true);
  }

  function advance(verdict) {
    if (verdict === "confirmed" && phase.id < 5) {
      const nextPhase = phase.id + 1;
      const updated = {
        ...candidate,
        currentPhase: nextPhase,
        phaseStartedAt: now(),
        phaseHistory: [
          ...candidate.phaseHistory.slice(0, -1),
          { ...candidate.phaseHistory[candidate.phaseHistory.length - 1], endedAt: now(), verdict: "confirmed" },
          { phase: nextPhase, startedAt: now(), endedAt: null, verdict: null },
        ],
      };
      onUpdate(updated);
    } else if (verdict === "refuted") {
      const updated = {
        ...candidate,
        status: "exited",
        phaseHistory: [
          ...candidate.phaseHistory.slice(0, -1),
          { ...candidate.phaseHistory[candidate.phaseHistory.length - 1], endedAt: now(), verdict: "refuted" },
        ],
      };
      onUpdate(updated);
    } else if (verdict === "confirmed" && phase.id === 5) {
      onUpdate({ ...candidate, status: "committed", phaseHistory: [...candidate.phaseHistory.slice(0, -1), { ...candidate.phaseHistory[candidate.phaseHistory.length - 1], endedAt: now(), verdict: "confirmed" }] });
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <SectionLabel>CURRENT PHASE</SectionLabel>
      <div style={{ background: phase.color, color: "#FFF", padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: "Calibri", fontSize: 11, letterSpacing: 3, opacity: 0.8 }}>PHASE {phase.id}</div>
            <div style={{ fontFamily: "Georgia", fontSize: 28, fontWeight: "bold" }}>{phase.name}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Georgia", fontSize: 32, fontWeight: "bold" }}>{phaseDays}<span style={{ fontSize: 18, opacity: 0.7 }}> / {phase.days}</span></div>
            <div style={{ fontFamily: "Calibri", fontSize: 11, opacity: 0.8 }}>DAYS ELAPSED</div>
          </div>
        </div>
        <div style={{ fontFamily: "Calibri", fontSize: 14, fontStyle: "italic", opacity: 0.95, marginBottom: 16 }}>{phase.hypothesis}</div>
        <div style={{ background: "rgba(255,255,255,0.2)", height: 6, borderRadius: 2 }}>
          <div style={{ width: `${phasePct}%`, height: "100%", background: "#C9A84C", transition: "width 0.4s" }} />
        </div>
      </div>

      {windowExpired && (
        <div style={{ background: "#FDF8EC", border: "2px solid #C9A84C", padding: 20, marginBottom: 24 }}>
          <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#C9A84C", letterSpacing: 3, fontWeight: "bold", marginBottom: 8 }}>⚠ WINDOW EXPIRED — GATE DECISION REQUIRED</div>
          <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#1B2A4A", marginBottom: 16 }}>The observation window for this phase has elapsed. Review your pre-committed criteria and observation log, then issue a verdict.</div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => advance("confirmed")} style={{ ...buttonStyle, background: "#1A6B5E", color: "#FFF" }}>{phase.id === 5 ? "✓ CONFIRMED → COMMIT" : "✓ CONFIRMED → ADVANCE TO PHASE " + (phase.id + 1)}</button>
            <button onClick={() => advance("refuted")} style={{ ...buttonStyle, background: "#B84A2E", color: "#FFF" }}>✕ REFUTED → EXIT</button>
          </div>
        </div>
      )}

      <SectionLabel>PRE-COMMITTED CRITERIA</SectionLabel>
      {current.lockedAt && !editing && (
        <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280", fontStyle: "italic", marginBottom: 12 }}>
          Locked {fmtDateTime(current.lockedAt)}.
          <button onClick={startEdit} style={{ marginLeft: 12, background: "transparent", border: "none", color: "#C9A84C", fontFamily: "Calibri", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Edit (creates audit trail)</button>
          {history.length > 0 && <button onClick={() => setShowHistory(s => !s)} style={{ marginLeft: 12, background: "transparent", border: "none", color: "#6B7280", fontFamily: "Calibri", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>{showHistory ? "Hide" : "Show"} edit history ({history.length})</button>}
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div style={{ background: "#FDF2EE", border: "1px solid #B84A2E", padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#B84A2E", letterSpacing: 2, fontWeight: "bold", marginBottom: 12 }}>EDIT HISTORY — GOALPOST MOVEMENT LOG</div>
          {history.map((h, i) => (
            <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < history.length - 1 ? "1px solid #D0DCF0" : "none" }}>
              <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#6B7280" }}>Replaced {fmtDateTime(h.replacedAt)}</div>
              <div style={{ fontFamily: "Calibri", fontSize: 12, color: "#1B2A4A", marginTop: 6, textDecoration: "line-through", opacity: 0.7 }}><b>Confirm:</b> {h.confirm}</div>
              <div style={{ fontFamily: "Calibri", fontSize: 12, color: "#1B2A4A", marginTop: 4, textDecoration: "line-through", opacity: 0.7 }}><b>Refute:</b> {h.refute}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#E6F4F1", border: "1px solid #1A6B5E", padding: 20 }}>
          <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#1A6B5E", letterSpacing: 2, fontWeight: "bold", marginBottom: 12 }}>✓ HYPOTHESIS CONFIRMED IF...</div>
          {editing ? (
            <textarea value={confirm} onChange={e => setConfirm(e.target.value)} rows={6} placeholder="Specific, observable evidence that would confirm this phase's hypothesis. Write this BEFORE you have feelings about the candidate." style={{ ...inputStyle, fontFamily: "Calibri", fontSize: 13, resize: "vertical" }} />
          ) : (
            <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#1B2A4A", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{current.confirm || <em style={{ color: "#6B7280" }}>Not yet written.</em>}</div>
          )}
        </div>
        <div style={{ background: "#FDF2EE", border: "1px solid #B84A2E", padding: 20 }}>
          <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#B84A2E", letterSpacing: 2, fontWeight: "bold", marginBottom: 12 }}>✕ HYPOTHESIS REFUTED IF...</div>
          {editing ? (
            <textarea value={refute} onChange={e => setRefute(e.target.value)} rows={6} placeholder="Specific, observable evidence that would refute this phase's hypothesis. Be precise. You will not be allowed to move these goalposts later without leaving a paper trail." style={{ ...inputStyle, fontFamily: "Calibri", fontSize: 13, resize: "vertical" }} />
          ) : (
            <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#1B2A4A", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{current.refute || <em style={{ color: "#6B7280" }}>Not yet written.</em>}</div>
          )}
        </div>
      </div>

      {editing && (
        <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={lock} style={{ ...buttonStyle, background: "#C9A84C", color: "#FFF" }}>🔒 LOCK CRITERIA</button>
          <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280", fontStyle: "italic" }}>Locking commits you. Future edits will be visible in an audit trail.</div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Score Tab
// ────────────────────────────────────────────────────────────────

function ScoreTab({ candidate, onUpdate, selfScores, score }) {
  const [expandedPillar, setExpandedPillar] = useState(null);

  function rate(pillarId, criterionId, value) {
    const key = `${pillarId}_${criterionId}`;
    const updated = { ...candidate, criteria: { ...candidate.criteria, [key]: value } };
    onUpdate(updated);
  }

  function snapshot() {
    const s = computeScore(candidate);
    if (!s || s.scoredPillars < 3) { alert("Score at least 3 pillars before taking a snapshot."); return; }
    const snap = { at: now(), total: s.total, byPillar: Object.fromEntries(Object.entries(s.byPillar).filter(([, v]) => v.pct != null).map(([k, v]) => [k, v.pct])) };
    onUpdate({ ...candidate, snapshots: [...candidate.snapshots, snap] });
  }

  function toggleRedFlag(id) {
    const updated = !candidate.redFlags[id];
    const vetos = updated ? [...candidate.vetos, { id, at: now(), label: RED_FLAGS.find(f => f.id === id).label }] : candidate.vetos;
    onUpdate({ ...candidate, redFlags: { ...candidate.redFlags, [id]: updated }, vetos });
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <SectionLabel>RED FLAG VETO LAYER</SectionLabel>
      <div style={{ background: "#FDF2EE", border: "1px solid #B84A2E", padding: 20, marginBottom: 24 }}>
        <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#B84A2E", fontStyle: "italic", marginBottom: 12 }}>Triggering any of these voids the composite score regardless of pillar performance. Veto events are permanently logged.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {RED_FLAGS.map(rf => {
            const checked = !!candidate.redFlags[rf.id];
            return (
              <label key={rf.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: 6 }}>
                <div onClick={() => toggleRedFlag(rf.id)} style={{ width: 16, height: 16, border: `2px solid ${checked ? "#B84A2E" : "#D0DCF0"}`, background: checked ? "#B84A2E" : "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
                  {checked && <span style={{ color: "#FFF", fontSize: 11, lineHeight: 1, fontWeight: "bold" }}>✕</span>}
                </div>
                <span style={{ fontFamily: "Calibri", fontSize: 13, color: checked ? "#B84A2E" : "#1B2A4A", fontWeight: checked ? "bold" : "normal" }}>{rf.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <SectionLabel>PILLAR ASSESSMENT</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {PILLARS.map(pillar => {
          const pData = score?.byPillar[pillar.id];
          const locked = pillar.hddPhase > candidate.currentPhase;
          const isExpanded = expandedPillar === pillar.id;
          const pillarColor = pillar.tier === "core" ? "#C9A84C" : pillar.tier === "mid" ? "#1B2A4A" : "#6B7280";

          return (
            <div key={pillar.id} style={{ background: locked ? "#F4F6FA" : "#FFF", border: `1px solid ${locked ? "#D0DCF0" : pillarColor}`, opacity: locked ? 0.6 : 1 }}>
              <div onClick={() => !locked && setExpandedPillar(isExpanded ? null : pillar.id)} style={{ padding: 18, cursor: locked ? "default" : "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <div style={{ fontFamily: "Calibri", fontSize: 9, color: pillarColor, letterSpacing: 2, fontWeight: "bold" }}>{pillar.tier === "core" ? "★ CORE" : pillar.tier === "mid" ? "● MID" : "○ SUPPORT"}</div>
                    <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#6B7280", letterSpacing: 1 }}>WEIGHT {pillar.weight}%</div>
                    <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#6B7280", letterSpacing: 1 }}>UNLOCKS PHASE {pillar.hddPhase}</div>
                  </div>
                  <div style={{ fontFamily: "Georgia", fontSize: 18, fontWeight: "bold", color: "#1B2A4A", marginTop: 4 }}>{pillar.label}</div>
                  <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280", fontStyle: "italic", marginTop: 2 }}>{pillar.description}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {locked ? (
                    <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280", fontStyle: "italic" }}>🔒 Locked<br/>until Phase {pillar.hddPhase}</div>
                  ) : pData?.pct != null ? (
                    <>
                      <div style={{ fontFamily: "Georgia", fontSize: 28, fontWeight: "bold", color: pData.pct >= 75 ? "#1A6B5E" : pData.pct >= 50 ? "#C9A84C" : "#B84A2E" }}>{pData.avg.toFixed(1)}<span style={{ fontSize: 14, color: "#6B7280" }}>/5</span></div>
                      <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#6B7280" }}>{pData.scoredCount}/{pData.totalCount} criteria</div>
                    </>
                  ) : (
                    <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280", fontStyle: "italic" }}>Not yet scored</div>
                  )}
                </div>
              </div>

              {pData?.pct != null && !locked && (
                <div style={{ padding: "0 18px 18px" }}>
                  <div style={{ background: "#EAF0F8", height: 4 }}>
                    <div style={{ width: `${pData.pct}%`, height: "100%", background: pData.pct >= 75 ? "#1A6B5E" : pData.pct >= 50 ? "#C9A84C" : "#B84A2E", transition: "width 0.3s" }} />
                  </div>
                </div>
              )}

              {isExpanded && !locked && (
                <div style={{ borderTop: "1px solid #EAF0F8", background: "#F4F6FA", padding: 20 }}>
                  {pillar.criteria.map(c => {
                    const key = `${pillar.id}_${c.id}`;
                    const value = candidate.criteria[key];
                    const selfKey = `${pillar.id}_${c.id}`;
                    const selfValue = selfScores[selfKey];
                    return (
                      <div key={c.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #EAF0F8" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#1B2A4A", fontWeight: "bold" }}>{c.label}</div>
                          {selfValue && (
                            <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#6B7280", fontStyle: "italic" }}>
                              Your self-score: <b style={{ color: "#1B2A4A" }}>{selfValue}/5</b>
                              {value && <span style={{ marginLeft: 8, color: Math.abs(value - selfValue) >= 2 ? "#B84A2E" : "#1A6B5E", fontWeight: "bold" }}>Δ {value - selfValue > 0 ? "+" : ""}{value - selfValue}</span>}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                          {c.anchors.map((anchor, i) => {
                            const rating = i + 1;
                            const selected = value === rating;
                            const anchorColor = rating <= 2 ? "#B84A2E" : rating === 3 ? "#C9A84C" : "#1A6B5E";
                            return (
                              <button key={i} onClick={() => rate(pillar.id, c.id, rating)} style={{
                                padding: "8px 6px",
                                background: selected ? anchorColor : "#FFF",
                                color: selected ? "#FFF" : "#1B2A4A",
                                border: `1px solid ${selected ? anchorColor : "#D0DCF0"}`,
                                fontFamily: "Calibri", fontSize: 10, cursor: "pointer",
                                textAlign: "left", lineHeight: 1.3,
                                transition: "all 0.15s",
                              }}>
                                <div style={{ fontWeight: "bold", marginBottom: 2 }}>{rating}</div>
                                <div style={{ fontSize: 10 }}>{anchor}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20, background: "#F4F6FA", borderLeft: "3px solid #C9A84C" }}>
        <div>
          <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280", letterSpacing: 2, fontWeight: "bold" }}>SNAPSHOTS TAKEN</div>
          <div style={{ fontFamily: "Georgia", fontSize: 24, fontWeight: "bold", color: "#1B2A4A" }}>{candidate.snapshots.length}</div>
        </div>
        <button onClick={snapshot} style={{ ...buttonStyle, background: "#C9A84C", color: "#FFF" }}>📸 TAKE SCORE SNAPSHOT</button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Observations Tab
// ────────────────────────────────────────────────────────────────

function ObservationsTab({ candidate, onUpdate }) {
  const [what, setWhat] = useState("");
  const [meaning, setMeaning] = useState("");

  function add() {
    if (!what.trim()) return;
    const obs = { id: uid(), at: now(), what: what.trim(), meaning: meaning.trim() };
    onUpdate({ ...candidate, observations: [obs, ...candidate.observations] });
    setWhat(""); setMeaning("");
  }

  function del(id) { onUpdate({ ...candidate, observations: candidate.observations.filter(o => o.id !== id) }); }

  return (
    <div style={{ maxWidth: 900 }}>
      <SectionLabel>NEW OBSERVATION</SectionLabel>
      <div style={{ background: "#F4F6FA", padding: 20, marginBottom: 32, borderLeft: "3px solid #C9A84C" }}>
        <Field label="WHAT HAPPENED (BEHAVIOUR, NOT INTERPRETATION)">
          <textarea value={what} onChange={e => setWhat(e.target.value)} rows={3} placeholder='Specific. Observable. Example: "Was 35 minutes late to dinner. Did not message ahead. Did not apologise on arrival."' style={{ ...inputStyle, fontFamily: "Calibri", resize: "vertical" }} />
        </Field>
        <Field label="WHAT I MADE IT MEAN (OPTIONAL — KEEP SEPARATE FROM OBSERVATION)">
          <textarea value={meaning} onChange={e => setMeaning(e.target.value)} rows={2} placeholder='Your interpretation. Example: "Possible pattern around respect for my time. Or possible one-off — check against future occurrences."' style={{ ...inputStyle, fontFamily: "Calibri", resize: "vertical" }} />
        </Field>
        <button onClick={add} disabled={!what.trim()} style={{ ...buttonStyle, background: what.trim() ? "#1B2A4A" : "#D0DCF0", color: "#FFF" }}>+ ADD ENTRY</button>
      </div>

      <SectionLabel>OBSERVATION LOG ({candidate.observations.length})</SectionLabel>
      {candidate.observations.length === 0 ? (
        <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#6B7280", fontStyle: "italic", padding: 20, textAlign: "center", background: "#F4F6FA" }}>
          No observations yet. Start logging — even small things. The log becomes your evidence base at gate decisions.
        </div>
      ) : (
        candidate.observations.map(o => (
          <div key={o.id} style={{ background: "#FFF", border: "1px solid #D0DCF0", borderLeft: "3px solid #1B2A4A", padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280", fontWeight: "bold", letterSpacing: 1 }}>{fmtDateTime(o.at)} · {daysSince(o.at)}d ago</div>
              <button onClick={() => del(o.id)} style={{ background: "transparent", border: "none", color: "#B84A2E", cursor: "pointer", fontFamily: "Calibri", fontSize: 11 }}>delete</button>
            </div>
            <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#1B2A4A", lineHeight: 1.6, marginBottom: o.meaning ? 12 : 0 }}>
              <b>What happened:</b> {o.what}
            </div>
            {o.meaning && (
              <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#6B7280", lineHeight: 1.6, fontStyle: "italic", paddingLeft: 12, borderLeft: "2px solid #EAF0F8" }}>
                <b style={{ color: "#1B2A4A" }}>Interpretation:</b> {o.meaning}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  History & Memo Tab
// ────────────────────────────────────────────────────────────────

function HistoryTab({ candidate, score }) {
  return (
    <div style={{ maxWidth: 1000 }}>
      <SectionLabel>SCORE TRAJECTORY</SectionLabel>
      <TrajectoryChart snapshots={candidate.snapshots} />

      {score && !score.vetoed && score.scoredPillars >= 3 && (
        <>
          <div style={{ marginTop: 32 }}><SectionLabel>PILLAR RADAR (CURRENT)</SectionLabel></div>
          <Radar score={score} />
        </>
      )}

      {candidate.vetos.length > 0 && (
        <>
          <div style={{ marginTop: 32 }}><SectionLabel>VETO EVENT LOG</SectionLabel></div>
          <div style={{ background: "#FDF2EE", border: "1px solid #B84A2E", padding: 16 }}>
            {candidate.vetos.map((v, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < candidate.vetos.length - 1 ? "1px solid #FCD9CC" : "none" }}>
                <div style={{ fontFamily: "Calibri", fontSize: 12, color: "#B84A2E", fontWeight: "bold" }}>{v.label}</div>
                <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280" }}>{fmtDateTime(v.at)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 32 }}><SectionLabel>INVESTMENT COMMITTEE MEMO</SectionLabel></div>
      <ICMemo candidate={candidate} score={score} />
    </div>
  );
}

function TrajectoryChart({ snapshots }) {
  if (snapshots.length === 0) return <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#6B7280", fontStyle: "italic", padding: 20, textAlign: "center", background: "#F4F6FA" }}>No snapshots yet. Take a snapshot in the Score tab to begin building trajectory data.</div>;

  const w = 800, h = 240, pad = 50;
  const minT = new Date(snapshots[0].at).getTime();
  const maxT = new Date(snapshots[snapshots.length - 1].at).getTime();
  const tRange = Math.max(1, maxT - minT);

  const points = snapshots.map(s => ({
    x: pad + ((new Date(s.at).getTime() - minT) / tRange) * (w - 2 * pad),
    y: h - pad - (s.total / 100) * (h - 2 * pad),
    total: s.total,
    at: s.at,
  }));

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div style={{ background: "#FFF", border: "1px solid #D0DCF0", padding: 20 }}>
      <svg width={w} height={h} style={{ maxWidth: "100%" }}>
        {[0, 25, 50, 70, 85, 100].map(v => {
          const y = h - pad - (v / 100) * (h - 2 * pad);
          return (
            <g key={v}>
              <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="#EAF0F8" strokeDasharray={v === 70 || v === 85 ? "" : "2 4"} />
              <text x={pad - 8} y={y + 4} textAnchor="end" fontFamily="Calibri" fontSize="10" fill="#6B7280">{v}</text>
              {(v === 70 || v === 85) && <text x={w - pad + 6} y={y + 4} fontFamily="Calibri" fontSize="9" fill={v === 85 ? "#1A6B5E" : "#1B2A4A"} fontWeight="bold">{v === 85 ? "STRONG BUY" : "HIGH CONV."}</text>}
            </g>
          );
        })}
        <path d={path} stroke="#C9A84C" strokeWidth="2" fill="none" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#FFF" stroke="#C9A84C" strokeWidth="2" />
            <text x={p.x} y={p.y - 12} textAnchor="middle" fontFamily="Calibri" fontSize="10" fill="#1B2A4A" fontWeight="bold">{p.total.toFixed(1)}</text>
            <text x={p.x} y={h - pad + 16} textAnchor="middle" fontFamily="Calibri" fontSize="9" fill="#6B7280">{fmtDate(p.at).replace(/\d{4}/, '').trim()}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Radar({ score }) {
  const pillarsWithData = PILLARS.filter(p => score.byPillar[p.id]?.pct != null);
  if (pillarsWithData.length < 3) return null;

  const size = 360, cx = size / 2, cy = size / 2, r = 130;
  const n = pillarsWithData.length;

  const pts = pillarsWithData.map((p, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const ratio = score.byPillar[p.id].pct / 100;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
      lx: cx + (r + 30) * Math.cos(angle),
      ly: cy + (r + 30) * Math.sin(angle),
      label: p.label,
      pct: score.byPillar[p.id].pct,
    };
  });

  const grid = [0.25, 0.5, 0.75, 1.0].map(ratio => pillarsWithData.map((_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${cx + r * ratio * Math.cos(a)},${cy + r * ratio * Math.sin(a)}`;
  }).join(" "));

  return (
    <div style={{ background: "#FFF", border: "1px solid #D0DCF0", padding: 20, display: "flex", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {grid.map((p, i) => <polygon key={i} points={p} fill="none" stroke="#EAF0F8" strokeWidth="1" />)}
        {pts.map((_, i) => {
          const a = (Math.PI * 2 * i) / n - Math.PI / 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#EAF0F8" />;
        })}
        <polygon points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="rgba(201,168,76,0.2)" stroke="#C9A84C" strokeWidth="2" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#C9A84C" />
            <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fontFamily="Calibri" fontSize="11" fill="#1B2A4A" fontWeight="bold">{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ICMemo({ candidate, score }) {
  const memo = useMemo(() => {
    if (!score) return "Memo unavailable.";
    const phase = HDD_PHASES.find(p => p.id === candidate.currentPhase);

    if (score.vetoed) {
      const triggered = candidate.vetos.map(v => v.label).join("; ");
      return `DEAL MEMO — VETO OVERRIDE\n\nFollowing diligence on ${candidate.name}, the Investment Committee has identified non-negotiable risk factors triggering automatic veto. Specifically: ${triggered}. The presence of any one of these constitutes a material breach of minimum investment criteria.\n\nRECOMMENDATION: Position exit. File closed. Reallocate emotional capital to higher-conviction pipeline.`;
    }

    if (score.scoredPillars < 3) {
      return `DEAL MEMO — PRELIMINARY ASSESSMENT\n\nCandidate ${candidate.name} entered the pipeline ${daysSince(candidate.addedAt)} days ago and is currently in ${phase.name} (Phase ${phase.id}). Diligence is in progress; ${score.scoredPillars} of 9 pillars scored to date.\n\nInsufficient data for IC recommendation. Continue observation and complete pillar scoring as phase progression permits.`;
    }

    const sorted = Object.entries(score.byPillar)
      .filter(([, v]) => v.pct != null)
      .sort((a, b) => b[1].pct - a[1].pct);
    const top = sorted.slice(0, 2).map(([id]) => PILLARS.find(p => p.id === id).label);
    const bottom = sorted.slice(-2).reverse().map(([id]) => PILLARS.find(p => p.id === id).label);

    const verdict = score.total >= 85 ? "STRONG BUY" : score.total >= 70 ? "HIGH CONVICTION HOLD" : score.total >= 55 ? "INVESTIGATE GAPS" : "PASS";
    const obs = candidate.observations.length;
    const snaps = candidate.snapshots.length;

    let trajectory = "";
    if (snaps >= 2) {
      const first = candidate.snapshots[0].total;
      const last = candidate.snapshots[snaps - 1].total;
      const delta = last - first;
      trajectory = ` Score trajectory across ${snaps} snapshots: ${first.toFixed(1)} → ${last.toFixed(1)} (Δ ${delta > 0 ? "+" : ""}${delta.toFixed(1)}). `;
    }

    return `DEAL MEMO — ${candidate.name.toUpperCase()}\nIC VERDICT: ${verdict}\n\nSubject entered diligence ${daysSince(candidate.addedAt)} days ago. Currently in ${phase.name} (Phase ${phase.id}), day ${daysSince(candidate.phaseStartedAt)} of ${phase.days}. Composite score: ${score.total.toFixed(1)}/100 across ${score.scoredPillars} scored pillars.\n\nPILLAR ASSESSMENT: Strongest performance in ${top.join(" and ")}. Material weakness or unrated data in ${bottom.join(" and ")}.${trajectory}\n\nEVIDENCE BASE: ${obs} observation log entries, ${snaps} score snapshots, ${candidate.phaseHistory.length - 1} phase advancements completed.\n\nRECOMMENDATION: ${score.total >= 85 ? "Phase 5 confirmation imminent. Begin commitment-readiness conversations." : score.total >= 70 ? "Continue diligence with high conviction. Initiate alignment dialogue on identified gap areas." : score.total >= 55 ? "Targeted diligence on bottom pillars required. Do not escalate emotional capital until gaps close or fundamental reassessment is conducted." : "Position exit recommended. Reallocate to higher-quality pipeline opportunities."}`;
  }, [candidate, score]);

  return (
    <div style={{ background: "#1B2A4A", color: "#FFF", padding: 24, borderLeft: "4px solid #C9A84C" }}>
      <pre style={{ fontFamily: "Calibri, sans-serif", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>{memo}</pre>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Introspective Panel
// ────────────────────────────────────────────────────────────────

function IntrospectivePanel({ selfScores, onClose, onUpdate }) {
  const [expanded, setExpanded] = useState(null);

  function rate(pillarId, criterionId, value) {
    onUpdate({ ...selfScores, [`${pillarId}_${criterionId}`]: value });
  }

  const totalScored = Object.keys(selfScores).length;
  const totalAvailable = PILLARS.reduce((acc, p) => acc + p.criteria.length, 0);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27, 42, 74, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: "#FFF", width: "100%", maxWidth: 900, maxHeight: "90vh", overflow: "auto", borderTop: "4px solid #C9A84C" }}>
        <div style={{ position: "sticky", top: 0, background: "#1B2A4A", color: "#FFF", padding: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#C9A84C", letterSpacing: 3, fontWeight: "bold" }}>SELF-AUDIT</div>
            <div style={{ fontFamily: "Georgia", fontSize: 26, fontWeight: "bold", marginTop: 4 }}>Introspective Panel</div>
            <div style={{ fontFamily: "Calibri", fontSize: 12, color: "#D0DCF0", marginTop: 6, fontStyle: "italic" }}>The mirror sheet. Rate yourself honestly — these scores surface as deltas when you rate candidates, exposing asymmetries you might otherwise miss.</div>
            <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#C9A84C", marginTop: 8 }}>{totalScored} of {totalAvailable} criteria self-rated</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid #FFF", color: "#FFF", padding: "6px 14px", cursor: "pointer", fontFamily: "Calibri", fontSize: 12, fontWeight: "bold" }}>CLOSE</button>
        </div>

        <div style={{ padding: 24 }}>
          {PILLARS.map(pillar => {
            const isExp = expanded === pillar.id;
            const rated = pillar.criteria.filter(c => selfScores[`${pillar.id}_${c.id}`]).length;
            return (
              <div key={pillar.id} style={{ marginBottom: 8, border: "1px solid #D0DCF0" }}>
                <div onClick={() => setExpanded(isExp ? null : pillar.id)} style={{ padding: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "Georgia", fontSize: 15, fontWeight: "bold", color: "#1B2A4A" }}>{pillar.label}</div>
                  <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#6B7280" }}>{rated}/{pillar.criteria.length} rated {isExp ? "▾" : "▸"}</div>
                </div>
                {isExp && (
                  <div style={{ padding: 16, background: "#F4F6FA", borderTop: "1px solid #D0DCF0" }}>
                    {pillar.criteria.map(c => {
                      const val = selfScores[`${pillar.id}_${c.id}`];
                      return (
                        <div key={c.id} style={{ marginBottom: 14 }}>
                          <div style={{ fontFamily: "Calibri", fontSize: 12, color: "#1B2A4A", fontWeight: "bold", marginBottom: 6 }}>{c.label}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
                            {c.anchors.map((a, i) => {
                              const r = i + 1;
                              const selected = val === r;
                              const col = r <= 2 ? "#B84A2E" : r === 3 ? "#C9A84C" : "#1A6B5E";
                              return (
                                <button key={i} onClick={() => rate(pillar.id, c.id, r)} style={{
                                  padding: "6px", background: selected ? col : "#FFF",
                                  color: selected ? "#FFF" : "#1B2A4A",
                                  border: `1px solid ${selected ? col : "#D0DCF0"}`,
                                  fontFamily: "Calibri", fontSize: 9, cursor: "pointer", lineHeight: 1.3, textAlign: "left",
                                }}>
                                  <div style={{ fontWeight: "bold" }}>{r}</div>
                                  <div>{a}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Empty state
// ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{ flex: 1, background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#C9A84C", letterSpacing: 4, fontWeight: "bold" }}>PARTNERIQ™ DUE DILIGENCE PLATFORM</div>
        <div style={{ fontFamily: "Georgia", fontSize: 40, fontWeight: "bold", color: "#1B2A4A", marginTop: 12, lineHeight: 1.1 }}>Where romance meets methodology.</div>
        <div style={{ fontFamily: "Calibri", fontSize: 15, color: "#6B7280", lineHeight: 1.7, marginTop: 20 }}>
          Add your first candidate from the sidebar to begin. Each candidate moves through five HDD phases — Mutual Interest, Baseline Character, Emotional Architecture, Values Alignment, Long-Term Fit — with pillars unlocking as the phases progress.
        </div>
        <div style={{ marginTop: 32, padding: 20, background: "#F4F6FA", borderLeft: "3px solid #C9A84C", textAlign: "left" }}>
          <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#C9A84C", letterSpacing: 2, fontWeight: "bold" }}>BEFORE YOU BEGIN</div>
          <div style={{ fontFamily: "Calibri", fontSize: 13, color: "#1B2A4A", marginTop: 8, lineHeight: 1.6 }}>Open the Introspective Panel and rate yourself on the criteria first. Self-scores become reference points when you score candidates — exposing asymmetries between what you ask for and what you offer.</div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Style primitives
// ────────────────────────────────────────────────────────────────

const inputStyle = { width: "100%", padding: "8px 10px", border: "1px solid #D0DCF0", fontFamily: "Georgia, serif", fontSize: 14, color: "#1B2A4A", outline: "none", boxSizing: "border-box", background: "#FFF" };
const readonlyStyle = { padding: "8px 10px", fontFamily: "Calibri", fontSize: 13, color: "#6B7280", background: "#EAF0F8" };
const buttonStyle = { padding: "10px 18px", border: "none", fontFamily: "Calibri", fontSize: 12, fontWeight: "bold", letterSpacing: 1, cursor: "pointer", textTransform: "uppercase" };

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: "Calibri", fontSize: 10, color: "#6B7280", letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: "Calibri", fontSize: 11, color: "#C9A84C", letterSpacing: 3, fontWeight: "bold", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #EAF0F8" }}>{children}</div>;
}

// ════════════════════════════════════════════════════════════════
//  ROOT APP
// ════════════════════════════════════════════════════════════════

export default function App() {
  const [state, setState] = useState(loadState);
  const [showSelf, setShowSelf] = useState(false);

  useEffect(() => { saveState(state); }, [state]);

  const activeCandidate = state.candidates.find(c => c.id === state.activeId);

  function addCandidate(name) {
    const c = newCandidate(name);
    setState(s => ({ ...s, candidates: [c, ...s.candidates], activeId: c.id }));
  }

  function updateCandidate(updated) {
    setState(s => ({ ...s, candidates: s.candidates.map(c => c.id === updated.id ? updated : c) }));
  }

  function archiveCandidate(id, status) {
    setState(s => ({ ...s, candidates: s.candidates.map(c => c.id === id ? { ...c, status } : c) }));
  }

  function selectCandidate(id) {
    setState(s => ({ ...s, activeId: id }));
  }

  function updateSelfScores(scores) {
    setState(s => ({ ...s, selfScores: scores }));
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F4F6FA", fontFamily: "Calibri, sans-serif" }}>
      <Sidebar candidates={state.candidates} activeId={state.activeId} onSelect={selectCandidate} onAdd={addCandidate} onShowSelf={() => setShowSelf(true)} />
      {activeCandidate ? (
        <CandidateView key={activeCandidate.id} candidate={activeCandidate} onUpdate={updateCandidate} onArchive={archiveCandidate} selfScores={state.selfScores} />
      ) : (
        <EmptyState />
      )}
      {showSelf && <IntrospectivePanel selfScores={state.selfScores} onUpdate={updateSelfScores} onClose={() => setShowSelf(false)} />}
    </div>
  );
}
