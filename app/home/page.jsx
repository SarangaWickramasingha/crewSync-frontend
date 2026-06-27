"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  const router = useRouter();

  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbType, setFbType] = useState("General Inquiry");
  const [fbMessage, setFbMessage] = useState("");
  const [fbSuccess, setFbSuccess] = useState(false);
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbError, setFbError] = useState("");

  const [stats, setStats] = useState({
    workers: null,
    projects: null,
    suppliers: null,
    avgSaved: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetch("http://localhost/CrewSync/backend/index.php/api/stats/summary");
        const data = await res.json();
        if (isMounted && data.success) {
          setStats({ workers: data.workers, projects: data.projects, suppliers: data.suppliers, avgSaved: data.avgSaved });
        }
      } catch (err) {
        console.error("Failed to load platform stats:", err);
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    }
    loadStats();
    return () => { isMounted = false; };
  }, []);

  function formatStat(value) {
    if (statsLoading) return "…";
    const num = Number(value);
    if (value === null || value === undefined || isNaN(num)) return "0";
    if (num <= 0) return "0";
    if (num < 100) return `${num}`;
    if (num < 10000) { const r = Math.floor(num / 100) * 100; return `${r.toLocaleString()}+`; }
    if (num < 1000000) { const r = Math.floor(num / 10000) * 10; return `${r}K+`; }
    return `${Math.floor(num / 1000000)}M+`;
  }

  async function submitFeedback() {
    const name = fbName.trim(), email = fbEmail.trim(), msg = fbMessage.trim();
    if (!name || !email || !msg) { alert("Please fill in your name, email, and message."); return; }
    setFbError(""); setFbSubmitting(true);
    try {
      const res = await fetch("http://localhost/CrewSync/backend/index.php/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message_type: fbType, message: msg }),
      });
      const data = await res.json();
      if (data.success) { setFbSuccess(true); setFbName(""); setFbEmail(""); setFbMessage(""); }
      else setFbError(data.message || "Something went wrong. Please try again.");
    } catch (err) {
      console.error(err);
      setFbError("Could not reach the server. Please check your connection and try again.");
    } finally { setFbSubmitting(false); }
  }

  const roles = [
    { icon: "🏠", title: "Property Owner", desc: "Plan, manage, and track your construction project from start to finish. Hire directly, save costs.", btnLabel: "Open Dashboard", route: "/property-owner", accent: "var(--color-owner)", iconBg: "var(--color-owner-light)", iconColor: "var(--color-owner-dark)", dark: "var(--color-owner-dark)" },
    { icon: "🔧", title: "Service Provider", desc: "Showcase your skills to hundreds of clients. Accept jobs on your schedule, get paid securely.", btnLabel: "View Provider Panel", route: "/service-provider", accent: "var(--color-provider)", iconBg: "var(--color-provider-light)", iconColor: "var(--color-provider-dark)", dark: "var(--color-provider-dark)" },
    { icon: "📦", title: "Material Supplier", desc: "List your products, manage inventory, and reach property owners island-wide.", btnLabel: "Supplier Portal", route: "/supplier", accent: "var(--color-supplier)", iconBg: "var(--color-supplier-light)", iconColor: "var(--color-supplier-dark)", dark: "var(--color-supplier-dark)" },
  ];

  const features = [
    { icon: "📅", title: "Smart Project Timeline", desc: "Auto-generate construction phases (foundation → walls → roofing → finishing). Fully customizable task schedules." },
    { icon: "💳", title: "Secure Escrow Payments", desc: "Payments are held securely and released to providers only after task completion — protecting both sides." },
    { icon: "⭐", title: "Ratings & Reviews", desc: "Verified reviews from real clients. Build trust and choose quality workers with confidence." },
    { icon: "💬", title: "In-platform Chat", desc: "Direct messaging with service providers and suppliers. No need for external apps." },
    { icon: "📄", title: "Downloadable Reports", desc: "Generate and download project reports, cost summaries, and task documentation at any stage." },
    { icon: "🔍", title: "Search & Filter", desc: "Find professionals and materials by district, city, rating, category, and price range." },
  ];

  return (
    <>
      <Navbar activeTab="Home" />

      <div className="font-sans bg-[var(--color-surface)] text-[var(--color-slate)] leading-relaxed [&_h1]:font-syne [&_h2]:font-syne [&_h3]:font-syne [&_h4]:font-syne [&_h5]:font-syne">
        {/* HERO */}
        <div className="relative overflow-hidden bg-[var(--color-slate)] px-6 pt-20 pb-16 text-center">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(232,130,12,0.15) 0%, transparent 70%)" }} />
          <div className="relative z-10 mb-6 inline-block rounded-full border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/15 px-3.5 py-1 text-xs font-medium tracking-wide text-[var(--color-amber)]">
            🇱🇰 Built for Sri Lanka&apos;s Construction Sector
          </div>
          <h1 className="relative z-10 mb-4 text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-[1.1] text-white">
            Manage Your Build,<br />
            <span className="text-[var(--color-amber)]">Without Middlemen</span>
          </h1>
          <p className="relative z-10 mx-auto mb-8 max-w-[520px] text-base text-white/60">
            CrewSync connects property owners directly with skilled tradespeople and material suppliers — with full project tracking, timelines, and transparent payments.
          </p>
          <div className="relative z-10 flex flex-wrap justify-center gap-3">
            <button className="rounded-lg bg-[var(--color-amber)] px-7 py-3 text-[0.95rem] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#b85a00]" onClick={() => router.push("/get-started")}>
              Start a Project →
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap justify-center border-b border-[var(--color-border)] bg-white">
          {[
            { num: formatStat(stats.workers), lbl: "Skilled Workers" },
            { num: formatStat(stats.projects), lbl: "Projects Done" },
            { num: formatStat(stats.suppliers), lbl: "Suppliers" },
            { num: statsLoading ? "…" : `${formatStat(stats.avgSaved)} LKR saved`, lbl: "Avg per 100 Spent" },
          ].map((s, i) => (
            <div key={s.lbl} className={`min-w-[120px] flex-1 px-8 py-5 text-center ${i !== 3 ? "border-r border-[var(--color-border)]" : ""}`}>
              <div className="font-syne text-[1.6rem] font-bold text-[var(--color-amber)]">{s.num}</div>
              <div className="mt-0.5 text-[0.72rem] uppercase tracking-wide text-[var(--color-muted)]">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* WHO IS CREWSYNC FOR */}
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <div className="mb-1.5 text-2xl font-bold text-[var(--color-slate)]">Who is CrewSync for?</div>
          <div className="mb-8 text-sm text-[var(--color-muted)]">Choose your role to explore the platform</div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {roles.map((r) => (
              <div key={r.title} className="group relative cursor-pointer overflow-hidden rounded-xl border border-[var(--color-border)] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_2px_16px_rgba(26,29,35,0.08)]" onClick={() => router.push(r.route)}>
                <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: r.accent }} />
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] text-[1.3rem]" style={{ background: r.iconBg, color: r.iconColor }}>{r.icon}</div>
                <h3 className="mb-1 text-base font-bold">{r.title}</h3>
                <p className="text-[0.8rem] leading-relaxed text-[var(--color-muted)]">{r.desc}</p>
                <button className="mt-4 rounded-md px-4 py-1.5 text-[0.78rem] font-semibold text-white transition-colors" style={{ background: r.accent }} onMouseEnter={(e) => (e.currentTarget.style.background = r.dark)} onMouseLeave={(e) => (e.currentTarget.style.background = r.accent)}>
                  {r.btnLabel}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PLATFORM FEATURES */}
        <div className="w-full bg-white px-6 py-10">
          <div className="mx-auto max-w-[1100px]">
            <div className="mb-1.5 text-2xl font-bold text-[var(--color-slate)]">Platform Features</div>
            <div className="mb-8 text-sm text-[var(--color-muted)]">Everything you need to run a successful construction project</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl border border-[var(--color-border)] bg-white p-5">
                  <div className="mb-3 text-[1.4rem]">{f.icon}</div>
                  <h4 className="mb-1.5 text-[0.92rem] font-bold">{f.title}</h4>
                  <p className="text-[0.8rem] leading-relaxed text-[var(--color-muted)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTACT / FEEDBACK */}
        <div className="w-full bg-white px-6 py-10">
          <div className="mx-auto max-w-[680px]">
            <div className="mb-1.5 text-center text-2xl font-bold text-[var(--color-slate)]">📬 Contact Admin / Send Feedback</div>
            <div className="mb-6 text-center text-sm text-[var(--color-muted)]">Have a question, issue, or suggestion? Send a message directly to the CrewSync admin team.</div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
              {["fbName", "fbEmail"].map((id) => (
                <div className="mb-4" key={id}>
                  <label className="mb-1.5 block text-[0.8rem] font-semibold text-[var(--color-slate-light)]" htmlFor={id}>
                    {id === "fbName" ? "Your Name" : "Email Address"}
                  </label>
                  <input type={id === "fbEmail" ? "email" : "text"} id={id}
                    placeholder={id === "fbName" ? "e.g. Nimal Kumarasinghe" : "your@email.com"}
                    value={id === "fbName" ? fbName : fbEmail}
                    onChange={(e) => id === "fbName" ? setFbName(e.target.value) : setFbEmail(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-[0.85rem] text-[var(--color-slate)] outline-none transition-colors focus:border-[var(--color-amber)]"
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="mb-1.5 block text-[0.8rem] font-semibold text-[var(--color-slate-light)]" htmlFor="fbType">Message Type</label>
                <select id="fbType" value={fbType} onChange={(e) => setFbType(e.target.value)} className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-[0.85rem] text-[var(--color-slate)] outline-none transition-colors focus:border-[var(--color-amber)]">
                  {["General Inquiry","Bug Report","Suggestion / Feature Request","Account Issue","Payment Problem","Other"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-1.5 block text-[0.8rem] font-semibold text-[var(--color-slate-light)]" htmlFor="fbMessage">Message</label>
                <textarea id="fbMessage" rows={4} placeholder="Describe your issue or suggestion…" value={fbMessage} onChange={(e) => setFbMessage(e.target.value)} className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-[0.85rem] text-[var(--color-slate)] outline-none transition-colors focus:border-[var(--color-amber)]" />
              </div>
              <button className="w-full rounded-lg bg-[var(--color-amber)] px-6 py-2.5 text-[0.88rem] font-semibold text-white transition-colors hover:bg-[#b85a00] disabled:opacity-70" onClick={submitFeedback} disabled={fbSubmitting}>
                {fbSubmitting ? "Sending…" : "Send Message to Admin"}
              </button>
              {fbSuccess && <div className="mt-4 rounded-lg bg-[var(--color-primary-light)] p-3 text-center text-[0.88rem] font-semibold text-[var(--color-primary)]">✓ Your message has been sent! The admin team will get back to you soon.</div>}
              {fbError && <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-[0.88rem] font-semibold text-[var(--color-danger)]">⚠ {fbError}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}