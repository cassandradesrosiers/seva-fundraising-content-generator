import { useState, useEffect, useRef } from "react";

// Zeffy direct donation link — used for QR code on print graphics
const ZEFFY_URL = "https://www.zeffy.com/en-US/donation-form/south-end-village-academy-seva";

const CAMPAIGN = {
  schoolName: "South End Village Academy", shortName: "SEVA",
  tagline: "Our Kids Love This School. Help Us Save It.",
  goal: "$1,500,000", raised: "$665,612", matchAmount: "$300,000",
  matchDeadline: "April 6, 2026", campaignDeadline: "June 12, 2026",
  donationURL: "southendvillageacademy.org",
  stats: { students: "117 students at our South End campus", financialAid: "over one-third of families receive financial aid" },
  amountAnchors: ["$25 covers a day of classroom supplies","$100 keeps the lights on for two days","$500 supports a teacher for a month"],
  // ─── SEVA Design System (extracted from southendvillageacademy.org) ───────
  // Primary
  // teal       — hero bg, nav, all section headings, icon fills
  // tealDark   — hover/pressed teal
  // tealMid    — lighter teal (progress fill, pale overlays)
  // tealPale   — very light teal tint (card icon bg, subtle section tint)
  // Orange
  // orange     — every CTA button, progress bar fill, match announcement bar
  // orangeDark — hover/pressed orange
  // orangePale — stat callout bg, info pill bg
  // Neutrals
  // navy       — footer, darkest text, QR module dark color
  // cream      — warm section bg ("Where Your Money Goes", "Stay Updated")
  // white      — card bg, main content bg
  // borderLight— card borders, dividers
  // Text
  // textHeading— section headings = teal
  // textBody   — paragraphs = dark gray
  // textMuted  — labels, captions
  // On-dark
  // onDark     — white text on teal bg
  // onDarkMuted— 55% opacity white on teal bg
  // Decorative
  // circle     — hero large circle overlays (white 6% opacity)
  // progressBg — unfilled progress bar track
  brand: {
    teal:         "#1e7878",
    tealDark:     "#155f5f",
    tealMid:      "#2a9292",
    tealPale:     "#e6f5f5",
    orange:       "#e07818",
    orangeDark:   "#b85e10",
    orangePale:   "#fef3e2",
    navy:         "#1a2535",
    cream:        "#faf5ee",
    white:        "#ffffff",
    borderLight:  "#e5e7eb",
    textHeading:  "#1e7878",
    textBody:     "#374151",
    textMuted:    "#6b7280",
    onDark:       "rgba(255,255,255,0.90)",
    onDarkMuted:  "rgba(255,255,255,0.55)",
    circle:       "rgba(255,255,255,0.06)",
    progressBg:   "#d1e8e8",
  },
};

// ─── AUDIENCES (Final approved — SEVA Content Brief) ─────────────────────────
const AUDIENCES = {
  // ── Internal ──────────────────────────────────────────────────────────────
  "Leadership Circle ($50K–$100K+)": {
    tier: "Internal",
    emotional: "Permanent legacy, founding-level commitment, exclusive early impact",
    approach: "Private, relationship-based — never mass-campaign language. Invite to join a named Leadership Circle as a founding-level supporter. Frame the gift as a statement of values and a permanent community decision, not a crisis response. Warm, specific, written as if for this person alone.",
    key: "A small group of families has the chance to be the founding architects of a school that will outlast this moment. You are one of them.",
  },
  "Mid-Level Parents ($5K–$20K)": {
    tier: "Internal",
    emotional: "Meaningful contribution, leadership within the community, setting the pace",
    approach: "Frame as the backbone of the campaign — the gifts that make other gifts possible. Their level of giving gives the broad base confidence. Not the largest gift, but the most consequential for momentum. Acknowledge their leadership position without pressure.",
    key: "Your gift at this level doesn't just contribute — it gives every other family in the school the confidence to step up.",
  },
  "Broad Parent Base ($25–$5K)": {
    tier: "Internal",
    emotional: "Participation, belonging, shared ownership of the outcome",
    approach: "Every amount matters and every family belongs in this. Make it about showing up, not the size of the gift. The story is the collective action of the whole community. Never imply a hierarchy between giving levels.",
    key: "This campaign works when every family plays their part — at whatever level makes sense for them.",
  },
  "Pledge Converters": {
    tier: "Internal",
    emotional: "Accountability, completing what they started, community trust",
    approach: "They pledged but haven't given yet. Warm and direct — the deadline is real and their pledge is already counted in the community's confidence. Make it easy to act. One clear link. No shame, just urgency.",
    key: "You pledged your support. The deadline is real — and your gift is the one we're counting on.",
  },
  // ── Relational ────────────────────────────────────────────────────────────
  "Grandparents": {
    tier: "Relational",
    emotional: "Legacy, love for grandchildren, preserving something irreplaceable",
    approach: "Lead with the grandchild's specific experience — their teachers know them by name, their classroom is their world. Simple CTAs. The ask is a legacy gift, not a campaign donation. Warm, personal, no jargon.",
    key: "Your grandchild's teachers know them by name. Help make sure that doesn't end.",
  },
  "Extended Family (aunts, uncles, cousins)": {
    tier: "Relational",
    emotional: "Family loyalty, backing someone you love through a hard moment",
    approach: "They're giving because a family member they care about is going through this. Lead with the family member's stake. Keep it simple and direct — their motivation is personal loyalty, not school policy.",
    key: "Someone you love is fighting to keep their child's school open. Here's how you can back them up.",
  },
  "Friends, Neighbors & Local Community": {
    tier: "Relational",
    emotional: "Neighborhood investment, South End pride, civic action",
    approach: "Frame as community investment in the South End. This school anchors the neighborhood and serves families who need it most. Lead with local belonging, not crisis.",
    key: "This school is part of what makes the South End the South End. Help keep it that way.",
  },
  "Friends & Family of Teachers and Staff": {
    tier: "Relational",
    emotional: "Solidarity with the educator they love",
    approach: "Their person stayed when they didn't have to — chose their students over certainty. Support the community that has their back. The ask is to help the people who support the person you love.",
    key: "The teacher you know chose their students over certainty. Help make sure that was the right call.",
  },
  "Former Families & Staff": {
    tier: "Relational",
    emotional: "Nostalgia, affinity, duty to the community that shaped their family",
    approach: "They know exactly what this school means — their child lived it or they built it. Lead with memory and continuity. Brief story of the crisis, immediate pivot to the opportunity to protect what they valued. Invite them back as supporters.",
    key: "Your family was part of building this community. The parents fighting to save it now need your help.",
  },
  "New Families & Staff": {
    tier: "Relational",
    emotional: "Welcome, belonging, protecting the thing they chose",
    approach: "They chose this school deliberately and have the most at stake for next year. Frame as protecting the thing they specifically decided to join. The SEVA reinvention is directly in their interest.",
    key: "You chose this school for a reason. Now you have the chance to help secure its future.",
  },
  // ── Corporate ─────────────────────────────────────────────────────────────
  "Parent Employers (matching programs)": {
    tier: "Corporate",
    emotional: "Practical multiplication, supporting an employee's community",
    approach: "Very specific and action-oriented: does your employer match charitable donations? SEVA's 501(c)(3) is pending, retroactive from March 23. Walk them through the exact steps to submit a match request. Make it feel easy and immediate.",
    key: "Your employer might double your gift. Many do. Here's how to check and submit in under five minutes.",
  },
  "Local Businesses": {
    tier: "Corporate",
    emotional: "Neighborhood belonging, mutual investment, community visibility",
    approach: "You serve these families every day. Partnership framing, not charity. Multiple entry points: sponsorship, donation night, goods/services. Specific co-marketing: your name in front of every family that walks through these doors.",
    key: "Your business is part of this neighborhood. So is our school. When you support SEVA, every family knows you showed up.",
  },
  "Parent-Connected Companies": {
    tier: "Corporate",
    emotional: "Professional network, brand alignment, supporting an employee",
    approach: "A parent at this school is connected to your company. Lead with that personal link. Frame as community investment with brand visibility. The gift connects your company to your own employee's values.",
    key: "Someone at your company has kids at this school. A gift from your organization puts your brand alongside theirs.",
  },
  "Foundations & DAFs": {
    tier: "Corporate",
    emotional: "Mission alignment, education access, community-driven governance",
    approach: "Formal but warm. SEVA's 501(c)(3) is pending (retroactive to March 23). Lead with mission alignment: expanding access to excellent, inclusive education for families who need it most. Governance story is the trust signal. DAF distribution available once 501(c)(3) is confirmed.",
    key: "SEVA's mission — expanding access to excellent, inclusive education — aligns with your giving priorities.",
  },
  "Corporate Event Sponsors": {
    tier: "Corporate",
    emotional: "Visibility, co-branding, community presence at a defining moment",
    approach: "Sponsor a campaign event (gala, auction, challenge). Named recognition, branded presence, specific packages. Your brand in the room when this community celebrates winning.",
    key: "Sponsor our end-of-year gala and put your brand in front of every SEVA family — as the company that helped save their school.",
  },
  "Pro Bono Professionals": {
    tier: "Corporate",
    emotional: "Professional purpose, skills that matter, joining a real team",
    approach: "We need skills, not just money. Accountants, lawyers, marketers, web developers, event planners. Your professional time has real dollar value to this campaign. Frame as joining a team, not volunteering.",
    key: "We don't just need donations — we need people who can do what you do. Your skills have real value here.",
  },
};

const CHANNEL_RULES = {
  "Instagram post":           "Visual-first. 1–3 sentence caption. One CTA. Hashtags: #SEVAstrong #SouthEndVillage",
  "Instagram story":          "4 slides, fast and scannable. Each slide = one idea. Urgency slide 3, CTA slide 4.",
  "Facebook post":            "2–4 sentences standard, up to 12 for updates. Warm, conversational, neighborhood tone.",
  "Email":                    "Subject under 50 chars. Body 150–250 words. Hook → Stakes → Progress → Ask → CTA → P.S.",
  "WhatsApp / group message": "2–4 short conversational paragraphs. Like a trusted neighbor texting the group. One ask, shareable link at the end. No corporate language.",
  "Slack":                    "Slack-native: use *bold* for key words. Short punchy paragraphs. Clear action with link. Friendly urgency. Appropriate for a parent or volunteer channel.",
  "LinkedIn post":            "3–6 sentences. Professional warmth. Frame as community investment. Outcome-focused.",
  "Donor outreach email":     "Story-led, 200–300 words. Build trust before asking. Specific impact by gift level.",
  "Corporate sponsorship":    "Lead with partnership. Name visibility/recognition. Under 250 words. One specific ask.",
};

const EVENT_CONTEXTS = {
  "General / None":                  "No specific campaign moment. Lead with the school's core story and ongoing need. Steady, warm, and clear.",
  "Match Week":                      `MATCH WEEK IS LIVE through ${CAMPAIGN.matchDeadline}. Every dollar matched dollar-for-dollar up to ${CAMPAIGN.matchAmount}. The match must be prominent in every output — it is the single most powerful urgency lever available. Deadline is real and imminent.`,
  "Hourly Giving Challenge":         "Short-window urgency burst. Example: donate in the next 2 hours and your class wins X, or we unlock a specific milestone. High-energy, social, fun. The window being tiny is the point. Specific incentive language is essential.",
  "Pizza Party / 100% Participation":"Classroom challenge: the class that hits 100% participation (any gift level, any form of contribution) wins a pizza party. Fun, competitive, low-pressure. Lead with class pride. Not about dollars — about every family showing up in some way.",
  "Leadership Circle Outreach":      "Private, relationship-based cultivation for Leadership Circle prospects ($50K–$100K+). NOT a mass message. Quiet, specific, co-founder framing. Written as if for this person alone. The ask is a named invitation to be a founding-level supporter, not a response to a general campaign.",
  "Grandparent Day":                 "Outreach timed around grandparents. Legacy gift angle: the grandchild's experience, their teachers who know them by name, and the impact of keeping their world stable through the end of the year.",
};

// ─── MESSAGING OBJECTIVES (multi-select checklist) ────────────────────────────
const OBJECTIVES = [
  { id: "donate",        label: "General donation",  framing: "Give what you can, every dollar goes directly to the school",                               desc: "Give what you can — every dollar goes directly to teacher salaries, rent, and classroom supplies. Zero platform fees via Zeffy." },
  { id: "reframe",       label: "Reframe",            framing: "Community protecting education access for all backgrounds",                                  desc: "Community protecting education access — not private school rescue. Over one-third of families receive financial aid. Built to expand access." },
  { id: "trust",         label: "Build trust",        framing: "Independent board, clean governance, separate accounts",                                     desc: "Independent board, separate accounts, clean governance. The previous management is gone. SEVA has no affiliation with Oxford Street." },
  { id: "match",         label: "Match",              framing: "Every dollar doubled through April 6, don't let it go unmet",                               desc: "Every dollar doubled through April 6 — the match must not go unmet. Most powerful urgency multiplier in the campaign." },
  { id: "participation", label: "Participation",      framing: "Showing up matters more than the gift size",                                                 desc: "Showing up matters more than gift size. Every family can play a role. Sharing and mobilizing others counts as fully as giving." },
  { id: "impact",        label: "Impact",             framing: "X dollars gets us Y, student stability, first step in long-term sustainability",             desc: "$25 = a day of supplies · $100 = two days of lights · $500 = a teacher for a month. Tie every dollar to a real, visible outcome." },
  { id: "vision",        label: "Vision",             framing: "Parent-led 501c3 to support student education and access in the South End",                  desc: "SEVA is a reinvention, not just a rescue. Nonprofit governance, community ownership, financial aid preserved — something better than before." },
  { id: "story",         label: "Personal story",     framing: "Specific human story matched to the audience",                                               desc: "Grandchild angle for family audiences. Teacher's story for educator networks. Parent testimonial for the general public. Real and specific." },
  { id: "sharing",       label: "Sharing",            framing: "One share equals new donors, valid when giving isn't possible",                              desc: "One share = new donors. A valid, complete ask when financial giving isn't possible. Frame sharing as its own form of participation." },
  { id: "corporate",     label: "Corporate unlock",   framing: "Match programs, DAF access, sponsorship as community investment",                            desc: "Match program steps, DAF access once 501(c)(3) confirmed, sponsorship as community investment with named visibility." },
];

const TONE_RULES = {
  Urgent:          "Concrete deadlines and numbers. Urgency through specificity, never alarm.",
  Hopeful:         "Lead with momentum. Show what's already working. Community is stepping up.",
  "Community-led": "Heavy 'we' and 'our'. Collective action. No single hero — a village.",
  Grateful:        "Warm and specific. Immediate impact. Make the reader feel like a hero.",
  Direct:          "No preamble. One clear ask. Specific outcome. Respects the reader's time.",
  Inspirational:   "Human story first. Emotional arc carries naturally to the ask.",
};

const TABS = [
  { id: "social",    label: "Social",    icon: "◈" },
  { id: "email",     label: "Email",     icon: "✉" },
  { id: "whatsapp",  label: "WhatsApp",  icon: "◎" },
  { id: "slack",     label: "Slack",     icon: "⊛" },
  { id: "graphic",   label: "Graphic",   icon: "⊞" },
];

const GRAPHIC_SIZES = [
  { id: "square",   label: "Square",    sub: "1080 × 1080", aspectW: 1,  aspectH: 1,    icon: "■" },
  { id: "vertical", label: "Vertical",  sub: "1080 × 1920", aspectW: 9,  aspectH: 16,   icon: "▐" },
  { id: "letter",   label: "8.5 × 11",  sub: "Letter",      aspectW: 85, aspectH: 110,  icon: "▬" },
];

// ─── PROMPT BUILDERS ──────────────────────────────────────────────────────────
function buildMainPrompt(form, raised) {
  const aud = AUDIENCES[form.audience] ?? {
    tier: "General", emotional: "Community connection", approach: "Warm, direct, community-powered.", key: "Our kids need our school to stay open.",
  };
  return `You are a fundraising communications expert for South End Village Academy (SEVA).

CAMPAIGN FACTS — use only these, never invent numbers:
• School: Croft School South End / ${CAMPAIGN.schoolName} (${CAMPAIGN.shortName}) — South End campus only
• Tagline: "${CAMPAIGN.tagline}"
• Goal: ${CAMPAIGN.goal} | Raised: ${raised}
• Match: ${CAMPAIGN.matchAmount} dollar-for-dollar through ${CAMPAIGN.matchDeadline}
• School year ends: ${CAMPAIGN.campaignDeadline}
• Donation URL: ${CAMPAIGN.donationURL}
• ${CAMPAIGN.stats.financialAid}
• ${CAMPAIGN.stats.students} could be displaced
• Amount anchors: ${CAMPAIGN.amountAnchors.join(" | ")}

VOICE PILLARS:
1. Urgent but hopeful — lead with what is possible
2. Warm and direct — neighbor, not corporate fundraiser  
3. Parent-first — children and teachers are always the reason
4. Community-powered — collective action, no single hero

SCHOOL NAMING — strictly enforced:
✓ "save our school" | "ensure our school's future" | "keep our school open"
✓ "save the Croft South End school with a gift to SEVA"
✗ NEVER "save SEVA" — SEVA is the nonprofit, not the school itself
✗ NEVER "keep SEVA open" — same reason
✗ NEVER reference other Croft locations — South End campus only

EQUITABLE MESSAGING:
✓ "Every family can play a role" | "Participation at every level matters"
✗ Never: "If every family just gives…" | "Families who care will donate" | assume financial capacity

BANNED: stakeholders, leverage, optimize, synergy, at-risk children, underprivileged, intersectionality, equity framework, click here, submit, URGENT!!!, "save SEVA", "keep SEVA open"

AUDIENCE: ${form.audience} [${aud.tier}]
Emotional need: ${aud.emotional}
Approach: ${aud.approach}
Anchor message: "${aud.key}"

${form.audience === "Leadership Circle ($50K–$100K+)" ? "⚠️ LEADERSHIP CIRCLE: Private, relationship-based. Never mass-campaign language. Written for this person alone. Invitation to co-found, not a donation ask." : ""}
${form.audience.includes("Pledge") ? "⚠️ PLEDGE CONVERTERS: They committed already — the ask is completing the pledge, not starting a new decision. Warm but direct. Easy one-click action." : ""}
${["Parent Employers (matching programs)","Foundations & DAFs"].includes(form.audience) ? "⚠️ 501(c)(3) STATUS: SEVA's 501(c)(3) application is pending, retroactive to March 23, 2026. DAF distributions and employer match programs available once confirmed. Note this accurately." : ""}

CHANNEL GUIDANCE: Each output type in the JSON schema below has its own format and voice. Match the tone, length, and structure to the specific channel (email = structured, WhatsApp = conversational, Slack = punchy, social = visual-first). Do not apply a single channel's constraints across all outputs.

ACTIVE MESSAGING OBJECTIVES (weave all of these in, prioritizing in the order listed):
${form.objectives.map((id, i) => { const o = OBJECTIVES.find(x => x.id === id); return o ? `${i+1}. ${o.label}: ${o.desc}` : ""; }).filter(Boolean).join("\n") || "General: drive awareness and a donation."}

TONE: ${form.tone} — ${TONE_RULES[form.tone]}
URGENCY: ${form.urgency}

EVENT: ${form.event}
${EVENT_CONTEXTS[form.event]}
${form.customNotes ? `\nCUSTOM NOTES:\n${form.customNotes}` : ""}

Return ONLY valid JSON, no code fences:
{
  "headlines": ["A","B","C"],
  "ctas": ["CTA1","CTA2","CTA3"],
  "shortCaption": "under 100 chars",
  "longCaption": "150–250 chars",
  "instagramStory": ["Slide1","Slide2","Slide3","Slide4"],
  "emailSubjects": ["S1","S2","S3"],
  "emailDraft": "full email — paragraphs separated by \\n\\n",
  "whatsappMessage": "2–4 short warm conversational paragraphs for a WhatsApp group. End with the donation link on its own line. No corporate language, no jargon.",
  "slackMessage": "Slack message using *bold* for key words. Short paragraphs. Friendly urgency. Clear link. For a parent or volunteer channel."
}`;
}

function buildGraphicPrompt(form, outputs, size, format, raised) {
  const sizeLabel = { square: "square social post 1080×1080", vertical: "vertical story/reel 1080×1920", letter: `8.5×11 letter — ${format}` }[size];
  return `Create structured content for a SEVA fundraising graphic (${sizeLabel}).

CAMPAIGN FACTS:
School: Croft School South End / South End Village Academy (SEVA)
Goal: ${CAMPAIGN.goal} | Raised: ${raised} | Match: ${CAMPAIGN.matchAmount} through ${CAMPAIGN.matchDeadline}
URL: ${CAMPAIGN.donationURL} | ${CAMPAIGN.stats.students} at stake | ${CAMPAIGN.stats.financialAid}

AUDIENCE: ${form.audience} | OBJECTIVES: ${form.objectives?.map(id => OBJECTIVES.find(o => o.id === id)?.label).filter(Boolean).join(", ") || "General donation"} | TONE: ${form.tone} | URGENCY: ${form.urgency} | EVENT: ${form.event}

DRAW FROM APPROVED CONTENT (use if available, otherwise write standalone):
Headlines: ${outputs?.headlines?.join(" | ") || "none yet — write fresh graphic headline"}
CTAs: ${outputs?.ctas?.join(" | ") || "none yet — write fresh CTA"}

RULES:
• "save our school" or "ensure our school's future" — NEVER "save SEVA" or "keep SEVA open"
• South End campus only — no other Croft locations
• Warm, direct, community-powered voice
• ${format === "print" ? "Print — slightly more detail, include contact/URL prominently" : "Digital screen — punchy and scannable"}

Return ONLY valid JSON, no fences:
{
  "headline": "punchy headline under 10 words",
  "subheadline": "supporting line under 15 words",
  "stat": "key stat to highlight visually — e.g. '117 kids. One school. Help us now.'",
  "bodyText": "1–2 sentences of supporting context",
  "cta": "action phrase 3–5 words no punctuation",
  "url": "${CAMPAIGN.donationURL}",
  "matchLine": "one-line match urgency e.g. 'Gifts doubled through Apr 6'",
  "colorScheme": "primary OR urgent OR hopeful"
}`;
}

// ─── QR CODE ─────────────────────────────────────────────────────────────────
function QRBlock({ url, size = 88, fgColor = "#1c2535" }) {
  const ref = useRef(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let cancelled = false;
    import("qrcode").then(mod => {
      if (cancelled || !ref.current) return;
      const QR = mod.default || mod;
      QR.toCanvas(ref.current, url, {
        width: size, margin: 1,
        color: { dark: fgColor, light: "#ffffff" },
      }).catch(() => { if (!cancelled) setErr(true); });
    }).catch(() => { if (!cancelled) setErr(true); });
    return () => { cancelled = true; };
  }, [url, size, fgColor]);

  if (err) return (
    <div style={{ width:size, height:size, border:"1px solid #ccc", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", color:"#888", textAlign:"center", padding:"4px" }}>
      QR code
    </div>
  );
  return <canvas ref={ref} style={{ borderRadius:"4px", display:"block" }} />;
}

function GraphicPreview({ content, size, format, raised: raisedAmount }) {
  const B = CAMPAIGN.brand;
  const isPrint = format === "print";
  // Font loaded globally via next/font/google in app/layout.tsx
  const font = "var(--font-nunito), 'DM Sans', system-ui, sans-serif";
  const ctaBg = content.colorScheme === "hopeful" ? B.teal : B.orange;
  const displayRaised = raisedAmount || CAMPAIGN.raised;

  // ── Shared: Logo mark ──────────────────────────────────────────────────────
  const Logo = ({ size: s = "sm" }) => (
    <div style={{ display:"flex", alignItems:"center", gap: s==="lg" ? "9px" : "6px" }}>
      <span style={{ color:B.orange, fontSize: s==="lg" ? "clamp(16px,3.5vw,22px)" : "clamp(12px,2.5vw,16px)", lineHeight:1 }}>♥</span>
      <span style={{ color:B.onDark, fontWeight:800, fontSize: s==="lg" ? "clamp(12px,2.5vw,16px)" : "clamp(9px,1.8vw,12px)", letterSpacing:"0.05em" }}>SEVA</span>
      <span style={{ color:B.onDarkMuted, fontWeight:600, fontSize: s==="lg" ? "clamp(9px,1.8vw,12px)" : "clamp(7px,1.4vw,9px)", letterSpacing:"0.06em" }}>· SOUTH END</span>
    </div>
  );

  // ── Shared: Orange pill CTA ────────────────────────────────────────────────
  const CTAPill = ({ label, full = false }) => (
    <div style={{ background:ctaBg, color:"white", padding:"clamp(6px,1.4vw,9px) clamp(12px,3vw,20px)", borderRadius:"9999px", fontSize:"clamp(9px,1.9vw,13px)", fontWeight:800, letterSpacing:"0.04em", display: full ? "block" : "inline-block", textAlign: full ? "center" : undefined }}>
      {label?.toUpperCase()}
    </div>
  );

  // ── Shared: match pill ─────────────────────────────────────────────────────
  const MatchPill = () => content.matchLine ? (
    <div style={{ background:B.orange, color:"white", padding:"2px 9px", borderRadius:"9999px", fontSize:"clamp(7px,1.4vw,10px)", fontWeight:700, whiteSpace:"nowrap", letterSpacing:"0.02em" }}>
      {content.matchLine}
    </div>
  ) : null;

  // ── Shared: decorative hero circles (matching website hero) ───────────────
  const HeroCircles = () => (
    <>
      <div style={{ position:"absolute", top:"-18%", right:"-12%", width:"55%", paddingBottom:"55%", borderRadius:"50%", background:B.circle, pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"8%", right:"5%", width:"30%", paddingBottom:"30%", borderRadius:"50%", background:B.circle, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-10%", left:"-8%", width:"40%", paddingBottom:"40%", borderRadius:"50%", background:B.circle, pointerEvents:"none" }} />
    </>
  );

  // ── Shared: mini progress bar (matching website progress) ─────────────────
  const ProgressBar = () => {
    const raisedNum = parseFloat(displayRaised.replace(/[$,]/g,""));
    const goalNum   = parseFloat(CAMPAIGN.goal.replace(/[$,]/g,""));
    const pct = Math.min(100, Math.round((raisedNum / goalNum) * 100));
    return (
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
          <span style={{ fontSize:"clamp(9px,1.8vw,12px)", fontWeight:800, color:B.onDark }}>{displayRaised}</span>
          <span style={{ fontSize:"clamp(8px,1.5vw,10px)", color:B.onDarkMuted }}>of {CAMPAIGN.goal}</span>
        </div>
        <div style={{ height:"clamp(4px,0.8vw,6px)", background:"rgba(255,255,255,0.15)", borderRadius:"9999px", overflow:"hidden" }}>
          <div style={{ width:`${pct}%`, height:"100%", background:B.orange, borderRadius:"9999px" }} />
        </div>
      </div>
    );
  };

  // ══ SQUARE 1:1 ═══════════════════════════════════════════════════════════
  if (size === "square") return (
    <div style={{ width:"100%", aspectRatio:"1/1", background:B.teal, borderRadius:"10px", overflow:"hidden", display:"flex", flexDirection:"column", fontFamily:font, position:"relative" }}>
      <HeroCircles />
      {/* Nav bar */}
      <div style={{ position:"relative", zIndex:1, padding:"5% 6% 2%", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Logo />
        <MatchPill />
      </div>
      {/* Hero body */}
      <div style={{ position:"relative", zIndex:1, flex:1, padding:"2% 6% 4%", display:"flex", flexDirection:"column", justifyContent:"center", gap:"clamp(8px,1.8vw,13px)" }}>
        <div style={{ fontSize:"clamp(19px,5.2vw,32px)", fontWeight:900, color:B.onDark, lineHeight:1.1, letterSpacing:"-0.02em" }}>
          {content.headline}
        </div>
        <div style={{ fontSize:"clamp(11px,2.4vw,15px)", color:B.onDarkMuted, lineHeight:1.5, fontWeight:400 }}>
          {content.subheadline}
        </div>
        {content.stat && (
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"clamp(2px,0.4vw,3px)", alignSelf:"stretch", background:B.orange, borderRadius:"2px", flexShrink:0 }} />
            <span style={{ fontSize:"clamp(9px,1.9vw,13px)", color:B.onDark, fontStyle:"italic", lineHeight:1.4 }}>{content.stat}</span>
          </div>
        )}
      </div>
      {/* Footer CTA + progress */}
      <div style={{ position:"relative", zIndex:1, padding:"3% 6% 5%", display:"flex", flexDirection:"column", gap:"clamp(6px,1.2vw,9px)", borderTop:"1px solid rgba(255,255,255,0.10)" }}>
        <ProgressBar />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <CTAPill label={content.cta} />
          <span style={{ color:B.onDarkMuted, fontSize:"clamp(7px,1.3vw,10px)", fontWeight:600 }}>{content.url}</span>
        </div>
      </div>
    </div>
  );

  // ══ VERTICAL 9:16 ════════════════════════════════════════════════════════
  if (size === "vertical") return (
    <div style={{ width:"100%", aspectRatio:"9/16", background:B.teal, borderRadius:"10px", overflow:"hidden", display:"flex", flexDirection:"column", fontFamily:font, position:"relative" }}>
      <HeroCircles />
      {/* Top — teal hero zone */}
      <div style={{ position:"relative", zIndex:1, flex:"0 0 54%", padding:"8% 8% 4%", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Logo />
          <MatchPill />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"clamp(6px,1.5vw,10px)" }}>
          <div style={{ fontSize:"clamp(16px,5.2vw,26px)", fontWeight:900, color:B.onDark, lineHeight:1.1, letterSpacing:"-0.02em" }}>{content.headline}</div>
          <div style={{ fontSize:"clamp(10px,2.4vw,14px)", color:B.onDarkMuted, lineHeight:1.5, fontWeight:400 }}>{content.subheadline}</div>
        </div>
      </div>
      {/* Orange stat banner — mirrors progress bar / announcement */}
      <div style={{ position:"relative", zIndex:1, background:B.orange, padding:"clamp(7px,1.6vw,11px) 8%", display:"flex", alignItems:"center" }}>
        <span style={{ fontSize:"clamp(9px,2.1vw,12px)", color:"white", fontStyle:"italic", fontWeight:700, lineHeight:1.4 }}>{content.stat}</span>
      </div>
      {/* Bottom — cream content zone */}
      <div style={{ position:"relative", zIndex:1, flex:1, background:B.cream, padding:"6% 8%", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"clamp(5px,1.2vw,8px)" }}>
          <div style={{ fontSize:"clamp(9px,1.9vw,12px)", color:B.textBody, lineHeight:1.6 }}>{content.bodyText}</div>
          {content.matchLine && (
            <div style={{ fontSize:"clamp(8px,1.7vw,11px)", color:B.orange, fontWeight:800 }}>{content.matchLine}</div>
          )}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"clamp(4px,0.8vw,6px)" }}>
          <CTAPill label={content.cta} full />
          <div style={{ textAlign:"center", fontSize:"clamp(7px,1.5vw,10px)", color:B.textMuted, fontWeight:600 }}>{content.url}</div>
        </div>
      </div>
    </div>
  );

  // ══ LETTER 8.5 × 11 ══════════════════════════════════════════════════════
  return (
    <div style={{ width:"100%", aspectRatio:"85/110", background:B.white, borderRadius:"10px", overflow:"hidden", display:"flex", flexDirection:"column", fontFamily:font, border:`1px solid ${B.borderLight}` }}>

      {/* ── Header — teal hero bar ── */}
      <div style={{ background:B.teal, padding:"4% 6% 3.5%", position:"relative", overflow:"hidden" }}>
        {/* Subtle circles */}
        <div style={{ position:"absolute", top:"-40%", right:"-8%", width:"40%", paddingBottom:"40%", borderRadius:"50%", background:B.circle }} />
        <div style={{ position:"absolute", bottom:"-60%", right:"12%", width:"25%", paddingBottom:"25%", borderRadius:"50%", background:B.circle }} />
        <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"4%" }}>
          <Logo size="lg" />
          <MatchPill />
        </div>
        <div style={{ position:"relative", zIndex:1, fontSize:"clamp(15px,4.2vw,26px)", fontWeight:900, color:B.onDark, lineHeight:1.1, letterSpacing:"-0.02em", marginBottom:"2%" }}>
          {content.headline}
        </div>
        <div style={{ position:"relative", zIndex:1, fontSize:"clamp(9px,2vw,12px)", color:B.onDarkMuted, lineHeight:1.5 }}>
          {content.subheadline}
        </div>
      </div>

      {/* ── Stat callout bar — cream bg, orange left-border ── */}
      <div style={{ background:B.cream, padding:"2.5% 6%", display:"flex", alignItems:"center", gap:"10px", borderBottom:`1px solid ${B.borderLight}` }}>
        <div style={{ width:"clamp(2px,0.4vw,3px)", alignSelf:"stretch", background:B.orange, borderRadius:"2px", flexShrink:0 }} />
        <span style={{ fontSize:"clamp(9px,1.9vw,12px)", color:B.textBody, fontStyle:"italic", lineHeight:1.5 }}>{content.stat}</span>
      </div>

      {/* ── Body copy ── */}
      <div style={{ flex:1, padding:"3% 6%", display:"flex", flexDirection:"column", justifyContent:"center", gap:"3%" }}>
        {/* Section heading styled like website section headings */}
        <div style={{ fontSize:"clamp(10px,2.3vw,14px)", color:B.textHeading, fontWeight:800, lineHeight:1.4 }}>
          Where your support goes
        </div>
        <div style={{ fontSize:"clamp(9px,1.9vw,12px)", color:B.textBody, lineHeight:1.7 }}>
          {content.bodyText}
        </div>
        {/* Three icon cards matching website "Where Your Money Goes" */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"clamp(4px,1vw,8px)" }}>
          {[["👩‍🏫","Teacher salaries"],["🏫","Keeping doors open"],["📚","Books & materials"]].map(([ic,lbl]) => (
            <div key={lbl} style={{ background:B.cream, border:`1px solid ${B.borderLight}`, borderRadius:"5px", padding:"6px 5px", textAlign:"center" }}>
              <div style={{ fontSize:"clamp(11px,2.4vw,15px)", marginBottom:"3px" }}>{ic}</div>
              <div style={{ fontSize:"clamp(7px,1.4vw,9px)", color:B.textHeading, fontWeight:700, lineHeight:1.3 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer — navy with CTA + QR ── */}
      <div style={{ background:B.navy, padding:"3% 6%", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"10px" }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"clamp(3px,0.7vw,5px)" }}>
          <CTAPill label={content.cta} />
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"clamp(7px,1.4vw,10px)", fontWeight:600, marginTop:"2px" }}>
            {isPrint ? ZEFFY_URL : content.url}
          </div>
          {isPrint && (
            <div style={{ color:"rgba(255,255,255,0.32)", fontSize:"clamp(6px,1.2vw,8px)", marginTop:"1px" }}>Or scan QR code →</div>
          )}
        </div>
        {isPrint && (
          <div style={{ background:"white", borderRadius:"6px", padding:"4px", flexShrink:0 }}>
            <QRBlock url={ZEFFY_URL} size={68} fgColor={B.navy} />
          </div>
        )}
        {!isPrint && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }}>
            <span style={{ color:B.orange, fontSize:"clamp(12px,2.5vw,16px)", lineHeight:1 }}>♥</span>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"clamp(6px,1.1vw,8px)", fontWeight:700, letterSpacing:"0.06em" }}>SEVA</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SEVAGenerator() {
  const [form, setForm] = useState({
    audience: "Broad Parent Base ($25–$5K)",
    objectives: ["donate", "match", "participation"],
    tone: "Urgent",
    urgency: "High",
    event: "Match Week",
    customNotes: "",
  });
  const [raisedOverride, setRaisedOverride] = useState("");
  const [outputs, setOutputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState({});
  const [showConfig, setShowConfig] = useState(false);
  const [activeTab, setActiveTab] = useState("social");
  const [graphicSize, setGraphicSize] = useState("square");
  const [graphicFormat, setGraphicFormat] = useState("digital");
  const [graphicContent, setGraphicContent] = useState(null);
  const [graphicLoading, setGraphicLoading] = useState(false);
  const [graphicError, setGraphicError] = useState(null);
  const [canvaRequested, setCanvaRequested] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const graphicRef = useRef(null);

  const [syncing, setSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState(null);   // timestamp of last successful sync
  const [syncError, setSyncError] = useState(null); // error message if sync failed
  const [isLive, setIsLive] = useState(false);       // true when raisedOverride came from a live sync

  const setF = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const raised = raisedOverride || CAMPAIGN.raised;

  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  };

  const callAPI = async (prompt, maxTokens) => {
    const r = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, maxTokens }),
    });
    if (!r.ok) throw new Error(`API error ${r.status}`);
    return r.json();
  };

  const syncRaisedAmount = async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/sync");
      const data = await res.json();
      if (data.raised) {
        setRaisedOverride(data.raised);
        setIsLive(true);
        setSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } else {
        setSyncError(data.error || "Could not parse amount — enter manually.");
      }
    } catch (e) {
      setSyncError("Sync failed — check your connection.");
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const generate = async () => {
    setLoading(true); setError(null); setOutputs(null); setGraphicContent(null); setCanvaRequested(false);
    try { const r = await callAPI(buildMainPrompt(form, raised), 3500); setOutputs(r); setActiveTab("social"); }
    catch (e) { setError("Generation failed — please try again."); console.error(e); }
    finally { setLoading(false); }
  };

  const toggleObjective = id => setForm(p => ({
    ...p,
    objectives: p.objectives.includes(id) ? p.objectives.filter(o => o !== id) : [...p.objectives, id],
  }));

  const downloadGraphic = async () => {
    if (!graphicRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(graphicRef.current, { scale: 2.5, useCORS: true, allowTaint: true, backgroundColor: null, logging: false });
      const sizeName = { square:"1080x1080", vertical:"1080x1920", letter:"8.5x11" }[graphicSize] || graphicSize;
      const a = document.createElement("a");
      a.download = `seva-${sizeName}-${Date.now()}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) { console.error("Download failed:", e); }
    finally { setDownloading(false); }
  };

  const generateGraphic = async () => {
    setGraphicLoading(true); setGraphicError(null); setGraphicContent(null); setCanvaRequested(false);
    try { const r = await callAPI(buildGraphicPrompt(form, outputs, graphicSize, graphicFormat, raised), 800); setGraphicContent(r); }
    catch (e) { setGraphicError("Graphic generation failed — please try again."); console.error(e); }
    finally { setGraphicLoading(false); }
  };

  const handleEditInCanva = async () => {
    if (!graphicContent) return;
    const sz = GRAPHIC_SIZES.find(s => s.id === graphicSize);
    const B = CAMPAIGN.brand;
    const brief = [
      `SEVA Canva Design Brief`,
      `FORMAT: ${sz.label} (${sz.sub})${graphicSize === "letter" ? ` — ${graphicFormat}` : ""}`,
      ``,
      `HEADLINE: ${graphicContent.headline}`,
      `SUBHEADLINE: ${graphicContent.subheadline}`,
      `STAT: ${graphicContent.stat}`,
      `BODY: ${graphicContent.bodyText}`,
      `CTA: ${graphicContent.cta}`,
      `URL: ${graphicContent.url}`,
      `MATCH LINE: ${graphicContent.matchLine}`,
      ``,
      `Brand: teal ${B.teal} (primary) · orange ${B.orange} (CTAs) · navy ${B.navy} (footer) · cream ${B.cream} (bg)`,
      `Font: Nunito, bold. Warm, community-centered, urgent-hopeful.`,
    ].join("\n");
    try { await navigator.clipboard.writeText(brief); } catch {}
    setCanvaRequested(true);
    const canvaUrl = graphicSize === "square"
      ? "https://www.canva.com/create/instagram-posts/"
      : graphicSize === "vertical"
      ? "https://www.canva.com/create/instagram-stories/"
      : "https://www.canva.com/create/flyers/";
    window.open(canvaUrl, "_blank", "noopener");
  };

  const urgBg = { Low:"#e8f5e9", Medium:"#fff8e1", High:"#fff3e0", "Final push":"#fce4ec" };
  const urgFg = { Low:"#2e7d32", Medium:"#f57f17", High:"#e65100", "Final push":"#ad1457" };
  const urgBo = { Low:"#a5d6a7", Medium:"#ffe082", High:"#ffcc80", "Final push":"#f48fb1" };

  return (
    <div style={{ minHeight:"100vh", background:"var(--color-background-tertiary)", fontFamily:"var(--font-sans)", display:"flex", flexDirection:"column" }}>
      <style>{`.st:hover{color:#e07818!important}.gr:hover:not(:disabled){opacity:.85!important}.sz:hover{border-color:#1e7878!important}.cr:hover{background:var(--color-background-secondary)!important}@keyframes sp{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header — matches website nav */}
      <header style={{ background:"#1e7878", color:"white", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"50px", borderBottom:"2px solid #e07818", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ color:"#e07818", fontSize:"18px", lineHeight:1 }}>♥</span>
          <div>
            <div style={{ fontSize:"13px", fontWeight:"800", letterSpacing:"0.03em" }}>SEVA Content Generator</div>
            <div style={{ fontSize:"9px", opacity:.42, marginTop:"1px", fontWeight:400 }}>South End Village Academy · Internal Fundraising Tool</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
          <div style={{ background:"#e07818", color:"white", padding:"3px 12px", borderRadius:"9999px", fontSize:"10px", fontWeight:"800" }}>Match Week · thru Apr 6</div>
          <div style={{ border:"0.5px solid rgba(255,255,255,0.25)", padding:"3px 10px", borderRadius:"9999px", fontSize:"10px", fontWeight:600, display:"flex", alignItems:"center", gap:"5px" }}>
            {isLive && <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#4ade80", display:"inline-block", flexShrink:0 }} title="Live from website" />}
            {raised} raised
          </div>
        </div>
      </header>

      {/* Layout */}
      <div style={{ display:"grid", gridTemplateColumns:"290px 1fr", flex:1, minHeight:0 }}>

        {/* Sidebar */}
        <aside style={{ background:"#f4f4f2", borderRight:"0.5px solid var(--color-border-tertiary)", padding:"14px", overflowY:"auto", display:"flex", flexDirection:"column", gap:"10px" }}>
          <Lbl>Generate Content</Lbl>

          <FF label="Audience">
            <select value={form.audience} onChange={setF("audience")} style={SS}>
              <optgroup label="── Internal">
                {["Leadership Circle ($50K–$100K+)","Mid-Level Parents ($5K–$20K)","Broad Parent Base ($25–$5K)","Pledge Converters"].map(a => <option key={a}>{a}</option>)}
              </optgroup>
              <optgroup label="── Relational">
                {["Grandparents","Extended Family (aunts, uncles, cousins)","Friends, Neighbors & Local Community","Friends & Family of Teachers and Staff","Former Families & Staff","New Families & Staff"].map(a => <option key={a}>{a}</option>)}
              </optgroup>
              <optgroup label="── Corporate">
                {["Parent Employers (matching programs)","Local Businesses","Parent-Connected Companies","Foundations & DAFs","Corporate Event Sponsors","Pro Bono Professionals"].map(a => <option key={a}>{a}</option>)}
              </optgroup>
            </select>
            <div style={{ fontSize:"10px", color:"var(--color-text-secondary)", marginTop:"2px", lineHeight:"1.35" }}>
              {AUDIENCES[form.audience]?.tier && <span style={{ color:"#1e7878", fontWeight:700 }}>{AUDIENCES[form.audience].tier} · </span>}
              {AUDIENCES[form.audience]?.emotional}
            </div>
          </FF>

          <FF label="Messaging Objectives">
            <div style={{ display:"flex", flexDirection:"column", gap:"3px", background:"var(--color-background-primary)", borderRadius:"6px", padding:"7px 8px", border:"0.5px solid var(--color-border-tertiary)" }}>
              {OBJECTIVES.map(o => {
                const on = form.objectives.includes(o.id);
                return (
                  <label key={o.id} title={o.desc} style={{ display:"flex", alignItems:"flex-start", gap:"7px", cursor:"pointer", padding:"2px 0" }}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleObjective(o.id)}
                      style={{ marginTop:"2px", accentColor:"#1e7878", flexShrink:0 }}
                    />
                    <span style={{ fontSize:"11px", lineHeight:"1.4" }}>
                      <span style={{ color: on ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: on ? "700" : "500" }}>{o.label}</span>
                      <span style={{ fontWeight:400, color:"var(--color-text-secondary)", marginLeft:"4px" }}>— {o.framing}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <div style={{ fontSize:"9px", color:"var(--color-text-secondary)", marginTop:"3px" }}>
              {form.objectives.length} selected · hover any item to see full guidance
            </div>
          </FF>

          <FF label="Tone">
            <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
              {Object.keys(TONE_RULES).map(t => (
                <button key={t} onClick={() => setForm(p => ({...p, tone:t}))} style={{ padding:"3px 8px", borderRadius:"9999px", border:"0.5px solid", fontSize:"11px", cursor:"pointer", transition:"all 0.1s", background:form.tone===t?"#1e7878":"transparent", color:form.tone===t?"white":"var(--color-text-secondary)", borderColor:form.tone===t?"#1e7878":"var(--color-border-secondary)" }}>{t}</button>
              ))}
            </div>
          </FF>

          <FF label="Urgency">
            <div style={{ display:"flex", gap:"3px" }}>
              {["Low","Medium","High","Final push"].map(u => (
                <button key={u} onClick={() => setForm(p => ({...p, urgency:u}))} style={{ flex:1, padding:"4px 2px", borderRadius:"4px", border:"0.5px solid", fontSize:"10px", fontWeight:"500", cursor:"pointer", background:form.urgency===u?urgBg[u]:"transparent", color:form.urgency===u?urgFg[u]:"var(--color-text-secondary)", borderColor:form.urgency===u?urgBo[u]:"var(--color-border-tertiary)", transition:"all 0.1s", fontFamily:"var(--font-sans)" }}>{u}</button>
              ))}
            </div>
          </FF>

          <FF label="Event / Campaign Moment">
            <select value={form.event} onChange={setF("event")} style={SS}>
              {Object.keys(EVENT_CONTEXTS).map(e => <option key={e}>{e}</option>)}
            </select>
          </FF>

          <FF label="Custom Notes">
            <textarea value={form.customNotes} onChange={setF("customNotes")} placeholder="Angles, facts to include, phrases to avoid…" rows={3} style={{ ...SS, resize:"vertical", lineHeight:"1.5", fontSize:"11px" }} />
          </FF>

          <button onClick={generate} disabled={loading} className="gr" style={{ width:"100%", padding:"10px", background:loading?"var(--color-background-secondary)":"#e07818", color:loading?"var(--color-text-secondary)":"white", border:"none", borderRadius:"9999px", fontSize:"13px", fontWeight:"800", cursor:loading?"not-allowed":"pointer", fontFamily:"var(--font-sans)", transition:"opacity 0.15s" }}>
            {loading ? "Generating…" : "Generate Content"}
          </button>

          {error && <div style={{ padding:"7px 9px", background:"var(--color-background-danger)", border:"0.5px solid var(--color-border-danger)", borderRadius:"5px", fontSize:"11px", color:"var(--color-text-danger)" }}>{error}</div>}

          <div style={{ paddingTop:"8px", borderTop:"0.5px solid var(--color-border-tertiary)" }}>
            <button onClick={() => setShowConfig(p => !p)} style={{ fontSize:"10px", color:"var(--color-text-secondary)", background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"var(--font-sans)", display:"flex", gap:"4px", alignItems:"center" }}>
              <span style={{ fontSize:"8px" }}>{showConfig ? "▼" : "▶"}</span> Campaign Settings
            </button>

            {showConfig && (
              <div style={{ marginTop:"10px", display:"flex", flexDirection:"column", gap:"10px" }}>

                {/* ── Live sync card ── */}
                <div style={{ background: isLive ? "var(--color-background-success)" : "var(--color-background-secondary)", border: `0.5px solid ${isLive ? "var(--color-border-success)" : "var(--color-border-tertiary)"}`, borderRadius:"7px", padding:"10px 11px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"7px" }}>
                    <div>
                      <div style={{ fontSize:"11px", fontWeight:"700", color:"var(--color-text-primary)", display:"flex", alignItems:"center", gap:"5px" }}>
                        <span style={{ width:"6px", height:"6px", borderRadius:"50%", background: isLive ? "#22c55e" : "var(--color-text-secondary)", display:"inline-block", flexShrink:0 }} />
                        Amount Raised
                      </div>
                      <div style={{ fontSize:"10px", color:"var(--color-text-secondary)", marginTop:"2px" }}>
                        {isLive && syncTime ? `Synced from website · ${syncTime}` : "Using default — sync for live figure"}
                      </div>
                    </div>
                    <div style={{ fontSize:"17px", fontWeight:"800", color: isLive ? "var(--color-text-success)" : "var(--color-text-primary)", letterSpacing:"-0.02em" }}>
                      {raised}
                    </div>
                  </div>

                  <button
                    onClick={syncRaisedAmount}
                    disabled={syncing}
                    style={{ width:"100%", padding:"6px", background: syncing ? "var(--color-background-secondary)" : "#1e7878", color: syncing ? "var(--color-text-secondary)" : "white", border:"none", borderRadius:"9999px", fontSize:"11px", fontWeight:"700", cursor: syncing ? "not-allowed" : "pointer", fontFamily:"var(--font-sans)", transition:"opacity 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}
                  >
                    {syncing ? (
                      <>
                        <span style={{ display:"inline-block", width:"8px", height:"8px", border:"1.5px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                        Fetching from southendvillageacademy.org…
                      </>
                    ) : (
                      <>{isLive ? "↻ Re-sync" : "↻ Sync from website"}</>
                    )}
                  </button>

                  {syncError && (
                    <div style={{ fontSize:"10px", color:"var(--color-text-danger)", marginTop:"6px", padding:"5px 7px", background:"var(--color-background-danger)", borderRadius:"4px", border:"0.5px solid var(--color-border-danger)" }}>
                      {syncError}
                    </div>
                  )}
                </div>

                {/* ── Manual override ── */}
                <div>
                  <label style={{ fontSize:"10px", color:"var(--color-text-secondary)", fontWeight:"600", display:"block", marginBottom:"3px" }}>
                    Manual override
                  </label>
                  <input
                    value={raisedOverride}
                    onChange={e => { setRaisedOverride(e.target.value); setIsLive(false); setSyncTime(null); }}
                    placeholder={CAMPAIGN.raised}
                    style={{ ...SS, padding:"5px 7px", fontSize:"11px" }}
                  />
                  <div style={{ fontSize:"9px", color:"var(--color-text-secondary)", marginTop:"2px" }}>
                    Typing here clears the live sync. Use for announcements, not regular updates.
                  </div>
                </div>

                {/* ── Static campaign facts ── */}
                <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                  {[["Goal", CAMPAIGN.goal], ["Match", `${CAMPAIGN.matchAmount} thru ${CAMPAIGN.matchDeadline}`], ["School year ends", CAMPAIGN.campaignDeadline], ["Donation URL", CAMPAIGN.donationURL]].map(([l, v]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", gap:"8px" }}>
                      <span style={{ color:"var(--color-text-secondary)", flexShrink:0 }}>{l}</span>
                      <span style={{ fontWeight:"600", textAlign:"right", color:"var(--color-text-primary)" }}>{v}</span>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <main style={{ padding:"18px", overflowY:"auto" }}>
          {!outputs && !loading && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"340px", gap:"10px", color:"var(--color-text-secondary)" }}>
              <div style={{ width:"40px", height:"40px", background:"var(--color-background-secondary)", borderRadius:"9px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>✍️</div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"14px", fontWeight:"500", color:"var(--color-text-primary)", marginBottom:"3px" }}>Ready to generate</div>
                <div style={{ fontSize:"12px" }}>Select your parameters, then click Generate Content.</div>
              </div>
            </div>
          )}

          {loading && <Dots label="Crafting your content" />}

          {outputs && (
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

              {/* Context pills */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                {[form.audience, form.tone, form.urgency, form.event].map(p => (
                  <span key={p} style={{ padding:"2px 7px", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"20px", fontSize:"10px", color:"var(--color-text-secondary)" }}>{p}</span>
                ))}
                {form.objectives.map(id => {
                  const o = OBJECTIVES.find(x => x.id === id);
                  return o ? (
                    <span key={id} style={{ padding:"2px 7px", background:"#e6f5f5", border:"0.5px solid #1e7878", borderRadius:"20px", fontSize:"10px", color:"#1e7878", fontWeight:600 }}>{o.label}</span>
                  ) : null;
                })}
              </div>

              {/* Always-visible: Headlines + CTAs */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                <Card title="Headlines" ca={() => copy(outputs.headlines?.join("\n\n"),"h-all")} cop={copied["h-all"]}>
                  {outputs.headlines?.map((h,i) => <CR key={i} text={h} onCopy={() => copy(h,`h${i}`)} copied={copied[`h${i}`]} n={i+1} />)}
                </Card>
                <Card title="CTAs" ca={() => copy(outputs.ctas?.join("\n"),"c-all")} cop={copied["c-all"]}>
                  {outputs.ctas?.map((c,i) => <CR key={i} text={c} onCopy={() => copy(c,`c${i}`)} copied={copied[`c${i}`]} n={i+1} />)}
                </Card>
              </div>

              {/* Tabs */}
              <div style={{ borderBottom:"1.5px solid var(--color-border-tertiary)" }}>
                <div style={{ display:"flex" }}>
                  {TABS.map(t => {
                    const on = activeTab === t.id;
                    return (
                      <button key={t.id} onClick={() => setActiveTab(t.id)} className="st" style={{ padding:"8px 15px", border:"none", borderBottom:on?"2px solid #e07818":"2px solid transparent", marginBottom:"-1.5px", background:"transparent", cursor:"pointer", fontSize:"12px", fontWeight:on?"800":"400", color:on?"#e07818":"var(--color-text-secondary)", fontFamily:"var(--font-sans)", transition:"all 0.12s", display:"flex", alignItems:"center", gap:"5px", whiteSpace:"nowrap" }}>
                        <span style={{ fontSize:"9px", opacity:on?1:0.45 }}>{t.icon}</span>{t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Social ── */}
              {activeTab==="social" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                    <Card title="Short caption" ca={() => copy(outputs.shortCaption,"sc")} cop={copied["sc"]}>
                      <p style={{ fontSize:"13px", lineHeight:"1.6", color:"var(--color-text-primary)", margin:0 }}>{outputs.shortCaption}</p>
                      <div style={{ fontSize:"10px", color:"var(--color-text-secondary)", marginTop:"5px" }}>{outputs.shortCaption?.length} chars</div>
                    </Card>
                    <Card title="Long caption" ca={() => copy(outputs.longCaption,"lc")} cop={copied["lc"]}>
                      <p style={{ fontSize:"13px", lineHeight:"1.6", color:"var(--color-text-primary)", margin:0 }}>{outputs.longCaption}</p>
                      <div style={{ fontSize:"10px", color:"var(--color-text-secondary)", marginTop:"5px" }}>{outputs.longCaption?.length} chars</div>
                    </Card>
                  </div>
                  <Card title="Instagram Story — 4 slides" ca={() => copy(outputs.instagramStory?.join("\n\n---\n\n"),"is-all")} cop={copied["is-all"]}>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"7px" }}>
                      {outputs.instagramStory?.map((s,i) => (
                        <div key={i} onClick={() => copy(s,`is${i}`)} style={{ background:"var(--color-background-secondary)", borderRadius:"5px", padding:"9px", fontSize:"11px", lineHeight:"1.5", cursor:"pointer", border:copied[`is${i}`]?"0.5px solid var(--color-border-success)":"0.5px solid var(--color-border-tertiary)", position:"relative", transition:"border 0.1s", color:"var(--color-text-primary)" }}>
                          <div style={{ fontSize:"9px", fontWeight:"500", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--color-text-secondary)", marginBottom:"4px" }}>Slide {i+1}</div>
                          {s}
                          {copied[`is${i}`] && <span style={{ position:"absolute", top:"5px", right:"6px", fontSize:"9px", color:"var(--color-text-success)", fontWeight:"500" }}>✓</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:"10px", color:"var(--color-text-secondary)", marginTop:"5px" }}>Click any slide to copy.</div>
                  </Card>
                </div>
              )}

              {/* ── Email ── */}
              {activeTab==="email" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  <Card title="Subject lines" ca={() => copy(outputs.emailSubjects?.join("\n"),"es-all")} cop={copied["es-all"]}>
                    {outputs.emailSubjects?.map((s,i) => <CR key={i} text={s} onCopy={() => copy(s,`es${i}`)} copied={copied[`es${i}`]} n={i+1} mono />)}
                  </Card>
                  <Card title="Email draft" ca={() => copy(outputs.emailDraft,"ed")} cop={copied["ed"]}>
                    <pre style={{ fontFamily:"var(--font-sans)", fontSize:"13px", lineHeight:"1.7", whiteSpace:"pre-wrap", margin:0, color:"var(--color-text-primary)" }}>{outputs.emailDraft}</pre>
                    <div style={{ fontSize:"10px", color:"var(--color-text-secondary)", marginTop:"7px", paddingTop:"7px", borderTop:"0.5px solid var(--color-border-tertiary)" }}>
                      {outputs.emailDraft ? outputs.emailDraft.trim().split(/\s+/).filter(Boolean).length : 0} words
                    </div>
                  </Card>
                </div>
              )}

              {/* ── WhatsApp ── */}
              {activeTab==="whatsapp" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  <Card title="WhatsApp group message" ca={() => copy(outputs.whatsappMessage,"wa")} cop={copied["wa"]}>
                    <div style={{ background:"#f0fdf4", border:"0.5px solid #bbf7d0", borderRadius:"7px", padding:"13px 15px" }}>
                      <pre style={{ fontFamily:"var(--font-sans)", fontSize:"13px", lineHeight:"1.7", whiteSpace:"pre-wrap", margin:0, color:"#14532d" }}>{outputs.whatsappMessage}</pre>
                    </div>
                    <div style={{ fontSize:"10px", color:"var(--color-text-secondary)", marginTop:"5px" }}>{outputs.whatsappMessage?.length} chars</div>
                  </Card>
                  <Card title="Tips for WhatsApp groups">
                    {["Send as a personal message — add the recipient group name in the opening line to personalise it","Put the donation link on its own line at the end so it's easy to tap","Pin key messages in the group so they stay visible above the scroll","Follow up 24–48 h before the April 6 match deadline with a short reminder"].map((tip,i) => (
                      <div key={i} style={{ display:"flex", gap:"7px", fontSize:"12px", color:"var(--color-text-primary)", lineHeight:"1.5", marginBottom:"5px" }}>
                        <span style={{ color:"#e07818", flexShrink:0 }}>·</span>{tip}
                      </div>
                    ))}
                  </Card>
                </div>
              )}

              {/* ── Slack ── */}
              {activeTab==="slack" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  <Card title="Slack message" ca={() => copy(outputs.slackMessage,"sl")} cop={copied["sl"]}>
                    <div style={{ background:"#1a1d21", borderRadius:"7px", padding:"13px 15px", border:"0.5px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display:"flex", gap:"10px" }}>
                        <div style={{ width:"28px", height:"28px", background:"#1e7878", borderRadius:"5px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"700", color:"white" }}>S</div>
                        <div>
                          <div style={{ display:"flex", gap:"7px", alignItems:"baseline", marginBottom:"4px" }}>
                            <span style={{ fontWeight:"600", fontSize:"12px", color:"#e0e0e0" }}>SEVA Team</span>
                            <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.28)" }}>Today</span>
                          </div>
                          <pre style={{ fontFamily:"var(--font-sans)", fontSize:"12px", lineHeight:"1.6", whiteSpace:"pre-wrap", margin:0, color:"#c8c8c8" }}>{outputs.slackMessage}</pre>
                          <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.28)", marginTop:"5px" }}>*bold* renders in Slack when pasted</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Card title="Slack tips">
                    {["Post to #general or a parent channel — avoid #random for time-sensitive asks","Tag @channel only if truly urgent and close to the deadline","Add a reply in the thread with just the link, so it's easy to find","Consider posting 3–4 days before April 6 and again 24 h before"].map((tip,i) => (
                      <div key={i} style={{ display:"flex", gap:"7px", fontSize:"12px", color:"var(--color-text-primary)", lineHeight:"1.5", marginBottom:"5px" }}>
                        <span style={{ color:"#e07818", flexShrink:0 }}>·</span>{tip}
                      </div>
                    ))}
                  </Card>
                </div>
              )}

              {/* ── Graphic ── */}
              {activeTab==="graphic" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>

                  {/* Settings card */}
                  <Card title="Graphic settings">
                    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                      <div>
                        <div style={{ fontSize:"10px", fontWeight:"500", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--color-text-secondary)", marginBottom:"7px" }}>Size</div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"7px" }}>
                          {GRAPHIC_SIZES.map(s => (
                            <button key={s.id} onClick={() => setGraphicSize(s.id)} className="sz" style={{ padding:"9px 6px", border:"0.5px solid", borderRadius:"7px", cursor:"pointer", textAlign:"center", transition:"all 0.12s", background:graphicSize===s.id?"var(--color-background-info)":"var(--color-background-secondary)", borderColor:graphicSize===s.id?"#1e7878":"var(--color-border-tertiary)", fontFamily:"var(--font-sans)" }}>
                              <div style={{ fontSize:"18px", marginBottom:"3px", opacity:graphicSize===s.id?1:0.35 }}>{s.icon}</div>
                              <div style={{ fontSize:"12px", fontWeight:"800", color:graphicSize===s.id?"#1e7878":"var(--color-text-primary)" }}>{s.label}</div>
                              <div style={{ fontSize:"9px", color:"var(--color-text-secondary)", marginTop:"1px" }}>{s.sub}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {graphicSize==="letter" && (
                        <div>
                          <div style={{ fontSize:"10px", fontWeight:"500", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--color-text-secondary)", marginBottom:"6px" }}>Format</div>
                          <div style={{ display:"flex", gap:"6px" }}>
                            {[["digital","Digital (screen)"],["print","Print (distributed)"]].map(([f,l]) => (
                              <button key={f} onClick={() => setGraphicFormat(f)} style={{ flex:1, padding:"7px", border:"0.5px solid", borderRadius:"9999px", cursor:"pointer", fontSize:"11px", fontWeight:"700", transition:"all 0.12s", background:graphicFormat===f?"#1e7878":"transparent", color:graphicFormat===f?"white":"var(--color-text-secondary)", borderColor:graphicFormat===f?"#1e7878":"var(--color-border-secondary)", fontFamily:"var(--font-sans)" }}>{l}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button onClick={generateGraphic} disabled={graphicLoading} className="gr" style={{ width:"100%", padding:"9px", background:graphicLoading?"var(--color-background-secondary)":"#1e7878", color:graphicLoading?"var(--color-text-secondary)":"white", border:"none", borderRadius:"9999px", fontSize:"12px", fontWeight:"800", cursor:graphicLoading?"not-allowed":"pointer", fontFamily:"var(--font-sans)", transition:"opacity 0.15s" }}>
                        {graphicLoading ? "Generating graphic…" : graphicContent ? "Regenerate Graphic" : "Generate Graphic"}
                      </button>
                      {graphicError && <div style={{ fontSize:"11px", color:"var(--color-text-danger)", padding:"6px 8px", background:"var(--color-background-danger)", borderRadius:"4px" }}>{graphicError}</div>}
                    </div>
                  </Card>

                  {graphicLoading && <Dots label="Building your graphic" />}

                  {graphicContent && !graphicLoading && (
                    <>
                      {/* Preview */}
                      <div style={{ maxWidth:graphicSize==="vertical"?"320px":graphicSize==="letter"?"460px":"440px", margin:"0 auto", width:"100%" }}>
                        <div ref={graphicRef}>
                          <GraphicPreview content={graphicContent} size={graphicSize} format={graphicFormat} raised={raised} />
                        </div>
                      </div>

                      {/* Field chips */}
                      <Card title="Graphic text layers — click to copy">
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
                          {[["Headline",graphicContent.headline,"gl"],["Subheadline",graphicContent.subheadline,"gs"],["Stat",graphicContent.stat,"gst"],["Body",graphicContent.bodyText,"gb"],["CTA",graphicContent.cta,"gc"],["Match line",graphicContent.matchLine,"gm"]].map(([lbl,val,k]) => val ? (
                            <div key={k} onClick={() => copy(val,`gf-${k}`)} style={{ background:"var(--color-background-secondary)", borderRadius:"5px", padding:"7px 9px", cursor:"pointer", border:copied[`gf-${k}`]?"0.5px solid var(--color-border-success)":"0.5px solid transparent", transition:"border 0.1s" }}>
                              <div style={{ fontSize:"9px", fontWeight:"500", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--color-text-secondary)", marginBottom:"2px" }}>{lbl}</div>
                              <div style={{ fontSize:"11px", color:"var(--color-text-primary)", lineHeight:"1.35" }}>{val}</div>
                              {copied[`gf-${k}`] && <div style={{ fontSize:"9px", color:"var(--color-text-success)", marginTop:"2px" }}>Copied ✓</div>}
                            </div>
                          ) : null)}
                        </div>
                      </Card>

                      {/* Download + Edit in Canva */}
                      {!canvaRequested ? (
                        <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"16px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"13px", fontWeight:"700", color:"var(--color-text-primary)", marginBottom:"2px" }}>Export this graphic</div>
                            <div style={{ fontSize:"11px", color:"var(--color-text-secondary)" }}>Download as PNG or open in Canva to edit with your brand.</div>
                          </div>
                          <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
                            <button
                              onClick={downloadGraphic}
                              disabled={downloading}
                              style={{ padding:"8px 16px", background:downloading?"var(--color-background-secondary)":"#1e7878", color:downloading?"var(--color-text-secondary)":"white", border:"none", borderRadius:"9999px", fontSize:"12px", fontWeight:"700", cursor:downloading?"not-allowed":"pointer", fontFamily:"var(--font-sans)", whiteSpace:"nowrap", transition:"opacity 0.15s", display:"flex", alignItems:"center", gap:"5px" }}
                            >
                              {downloading ? (
                                <><span style={{ display:"inline-block", width:"10px", height:"10px", border:"1.5px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> Saving…</>
                              ) : "↓ Download PNG"}
                            </button>
                            <button
                              onClick={handleEditInCanva}
                              style={{ padding:"8px 16px", background:"#7c3aed", color:"white", border:"none", borderRadius:"9999px", fontSize:"12px", fontWeight:"700", cursor:"pointer", fontFamily:"var(--font-sans)", whiteSpace:"nowrap", transition:"opacity 0.15s" }}
                            >
                              Edit in Canva ↗
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ background:"var(--color-background-success)", border:"0.5px solid var(--color-border-success)", borderRadius:"var(--border-radius-lg)", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
                          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                            <span style={{ fontSize:"15px" }}>✓</span>
                            <div>
                              <div style={{ fontSize:"13px", fontWeight:"700", color:"var(--color-text-success)" }}>Design brief copied to clipboard</div>
                              <div style={{ fontSize:"11px", color:"var(--color-text-success)", opacity:.85 }}>Canva opened in a new tab — paste the brief to get started.</div>
                            </div>
                          </div>
                          <button
                            onClick={downloadGraphic}
                            disabled={downloading}
                            style={{ padding:"7px 14px", background:"transparent", color:"var(--color-text-success)", border:"0.5px solid var(--color-border-success)", borderRadius:"9999px", fontSize:"11px", fontWeight:"700", cursor:"pointer", fontFamily:"var(--font-sans)", whiteSpace:"nowrap" }}
                          >
                            {downloading ? "Saving…" : "↓ Download PNG"}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
function Lbl({ children }) {
  return <div style={{ fontSize:"10px", fontWeight:"500", letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--color-text-secondary)", paddingBottom:"6px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>{children}</div>;
}
function FF({ label, children }) {
  return (
    <div>
      <label style={{ fontSize:"10px", fontWeight:"500", letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--color-text-secondary)", display:"block", marginBottom:"3px" }}>{label}</label>
      {children}
    </div>
  );
}
const SS = { width:"100%", padding:"5px 7px", border:"0.5px solid var(--color-border-secondary)", borderRadius:"5px", fontSize:"12px", background:"var(--color-background-primary)", color:"var(--color-text-primary)", fontFamily:"var(--font-sans)", outline:"none" };
function Card({ title, children, ca, cop }) {
  return (
    <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"12px 14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"9px" }}>
        <div style={{ fontSize:"10px", fontWeight:"500", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--color-text-secondary)" }}>{title}</div>
        {ca && <button onClick={ca} style={{ fontSize:"10px", padding:"2px 6px", border:"0.5px solid var(--color-border-secondary)", borderRadius:"3px", background:cop?"var(--color-background-success)":"transparent", color:cop?"var(--color-text-success)":"var(--color-text-secondary)", cursor:"pointer", fontFamily:"var(--font-sans)", transition:"all 0.1s" }}>{cop?"Copied ✓":"Copy all"}</button>}
      </div>
      {children}
    </div>
  );
}
function CR({ text, onCopy, copied, n, mono }) {
  return (
    <div onClick={onCopy} className="cr" style={{ display:"flex", gap:"7px", padding:"5px 6px", borderRadius:"4px", cursor:"pointer", marginBottom:"2px", background:copied?"var(--color-background-success)":"transparent", transition:"background 0.1s" }}>
      <span style={{ fontSize:"9px", color:"var(--color-text-secondary)", width:"12px", flexShrink:0, marginTop:"2px" }}>{n}</span>
      <span style={{ fontSize:"12px", lineHeight:"1.5", color:"var(--color-text-primary)", flex:1, fontFamily:mono?"var(--font-mono)":"var(--font-sans)" }}>{text}</span>
      <span style={{ fontSize:"9px", flexShrink:0, color:copied?"var(--color-text-success)":"var(--color-text-secondary)", marginTop:"2px" }}>{copied?"✓":"copy"}</span>
    </div>
  );
}
function Dots({ label }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", padding:"36px 0" }}>
      <div style={{ display:"flex", gap:"5px" }}>
        {[0,1,2].map(i => <div key={i} style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#1e7878", animation:`sp 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
      </div>
      <div style={{ fontSize:"12px", color:"var(--color-text-secondary)" }}>{label}…</div>
    </div>
  );
}
