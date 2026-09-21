"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/src/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { FEEDBACK_TYPES, feedbackSchema, toFeedbackPayload } from "@/src/lib/validators/feedback";
import { useStatsSummary, useSubmitFeedback } from "@/src/hooks/home/useHome";
import { Flag, TriangleAlert, Check } from "lucide-react";

const FEEDBACK_DEFAULT_VALUES = { name: "", email: "", messageType: FEEDBACK_TYPES[0], message: "" };

export default function HomePage() {
  const router = useRouter();
  const { isGuest, isProvider, isSupplier, user, loading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useStatsSummary();
  const submitFeedback = useSubmitFeedback();
  const [fbSuccess, setFbSuccess] = useState(false);
  const [fbError, setFbError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: FEEDBACK_DEFAULT_VALUES,
  });

  function formatStat(value) {
    if (statsLoading) return "…";
    const num = Number(value);
    if (value === null || value === undefined || isNaN(num)) return "0";
    if (num <= 0) return "0";
    if (num < 100) return `${num}`;
    if (num < 10000) {
      const r = Math.floor(num / 100) * 100;
      return `${r.toLocaleString()}+`;
    }
    if (num < 1000000) {
      const r = Math.floor(num / 10000) * 10;
      return `${r}K+`;
    }
    return `${Math.floor(num / 1000000)}M+`;
  }

  async function onFeedbackSubmit(values) {
    setFbError("");
    setFbSuccess(false);
    try {
      await submitFeedback.mutateAsync(toFeedbackPayload(values));
      setFbSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      setFbError(err.message);
    }
  }

  const roles = [
    {
      icon: "/icons/owner.png",
      title: "Property Owner",
      tag: "For Homeowners & Builders",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
      desc: "Plan, manage, and track your construction project from start to finish. Hire directly, save costs.",
      perks: [
        "Post projects & track milestone stages",
        "Secure escrow-protected fund release",
        "Hire vetted providers & order materials",
      ],
      btnLabel: "Open Dashboard",
      route: "/dashboard/propertyowner",
      guestRoute: "/dashboard/propertyowner/timeline",
      roleKey: "property_owner",
      registerRole: "owner",
      accent: "bg-owner",
      hoverBg: "hover:bg-owner-dark",
      hoverBorder: "hover:border-owner/40",
      iconBg: "bg-owner-light border-owner/20",
      topBar: "from-emerald-500 via-green-600 to-emerald-700",
      glowColor: "rgba(22,163,74,0.15)",
    },
    {
      icon: "/icons/provider.png",
      title: "Service Provider",
      tag: "For Contractors & Trades",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/70",
      desc: "Showcase your skills to hundreds of clients. Accept jobs on your schedule, get paid securely.",
      perks: [
        "Browse local jobs & submit proposals",
        "Guaranteed payment on milestone approval",
        "Build a verified profile with real reviews",
      ],
      btnLabel: "View Provider Panel",
      route: "/dashboard/serviceprovider",
      roleKey: "service_provider",
      registerRole: "provider",
      accent: "bg-provider",
      hoverBg: "hover:bg-provider-dark",
      hoverBorder: "hover:border-provider/40",
      iconBg: "bg-provider-light border-provider/20",
      topBar: "from-blue-500 via-blue-600 to-indigo-600",
      glowColor: "rgba(37,99,235,0.15)",
    },
    {
      icon: "/icons/supplier.png",
      title: "Material Supplier",
      tag: "For Hardware & Stores",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-200/70",
      desc: "List your products, manage inventory, and reach property owners island-wide.",
      perks: [
        "List building materials & supplies online",
        "Direct purchase orders from active sites",
        "Manage inventory & fulfillment easily",
      ],
      btnLabel: "Supplier Portal",
      route: "/dashboard/supplier",
      roleKey: "material_supplier",
      registerRole: "supplier",
      accent: "bg-supplier",
      hoverBg: "hover:bg-supplier-dark",
      hoverBorder: "hover:border-supplier/40",
      iconBg: "bg-supplier-light border-supplier/20",
      topBar: "from-amber-500 via-orange-500 to-orange-600",
      glowColor: "rgba(249,115,22,0.15)",
    },
  ];

  function handleRoleClick(r) {
    if (loading) return;
    if (user && user.role === r.roleKey) {
      router.push(r.route);
    } else if (!user && r.guestRoute) {
      router.push(r.guestRoute);
    } else {
      router.push(`/register?role=${r.registerRole}`);
    }
  }

  const features = [
    {
      icon: "/icons/timeline.png",
      badge: "Planning",
      badgeColor: "bg-amber-50 text-amber-dark border-amber-200/70",
      iconBg: "bg-amber-500/10 border-amber-500/20 text-amber",
      title: "Smart Project Timeline",
      desc: "Auto-generate construction tasks (foundation, walls, roofing, finishing). Fully customizable task schedules.",
      highlight: "Auto-generated phases & milestones",
    },
    {
      icon: "/icons/home-page/escrow.png",
      badge: "Security",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
      iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
      title: "Secure Escrow Payments",
      desc: "Payments are held securely and released to providers only after task completion, protecting both sides.",
      highlight: "Milestone-based fund release",
    },
    {
      icon: "/icons/reviews.png",
      badge: "Verified",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/70",
      iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-600",
      title: "Ratings & Reviews",
      desc: "Verified reviews from real clients. Build trust and choose quality workers with confidence.",
      highlight: "Authentic client ratings & feedback",
    },
    {
      icon: "/icons/home-page/chat.png",
      badge: "Real-time",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
      iconBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600",
      title: "In-platform Chat",
      desc: "Direct messaging with service providers and suppliers. No need for external apps.",
      highlight: "Direct messaging & coordination",
    },
    {
      icon: "/icons/reports.png",
      badge: "Analytics",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
      iconBg: "bg-slate-500/10 border-slate-500/20 text-slate-700",
      title: "Downloadable Reports",
      desc: "Generate and download project reports, cost summaries, and task documentation at any stage.",
      highlight: "One-click PDF & cost breakdown",
    },
    {
      icon: "/icons/home-page/search.png",
      badge: "Discovery",
      badgeColor: "bg-amber-50 text-amber-dark border-amber-200/70",
      iconBg: "bg-amber-500/10 border-amber-500/20 text-amber",
      title: "Search & Filter",
      desc: "Find professionals and materials by district, city, rating, category, and price range.",
      highlight: "Filter by district, rate & trade",
    },
  ];

  return (
    <>
      <Navbar activeTab="Home" />

      <div className="font-sans bg-surface text-slate leading-relaxed min-h-screen [&_h1]:font-syne [&_h2]:font-syne [&_h3]:font-syne [&_h4]:font-syne [&_h5]:font-syne">
        {/* HERO */}
        <section className="relative overflow-hidden bg-slate px-4 py-16 sm:px-6 sm:py-20 lg:py-24 text-center">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full blur-2xl opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(232,130,12,0.22) 0%, rgba(232,130,12,0.05) 50%, transparent 75%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber backdrop-blur-xs">
              <Flag className="h-3.5 w-3.5" /> Built for Sri Lanka&apos;s Construction Sector
            </div>
            <h1 className="mb-5 text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.12] text-white tracking-tight">
              Manage Your Build,
              <br />
              <span className="text-amber">Without Middlemen</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-sm sm:text-base md:text-lg text-white/70 leading-relaxed px-2">
              CrewSync connects property owners directly with service providers
              and material suppliers. It helps users manage their projects easily
              by tracking progress, schedules, and costs in one place, with clear
              updates and transparent pricing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {!isProvider && !isSupplier && (
                <button
                  className="w-full sm:w-auto rounded-xl bg-amber px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-amber/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-dark hover:shadow-amber/30 active:translate-y-0 cursor-pointer"
                  onClick={() =>
                    isGuest
                      ? router.push("/register")
                      : router.push("/project-form")
                  }
                >
                  Start a Project
                </button>
              )}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-b border-border bg-white shadow-xs">
          <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {[
              { num: formatStat(stats?.workers), lbl: "Skilled Workers" },
              { num: formatStat(stats?.projects), lbl: "Projects Done" },
              { num: formatStat(stats?.suppliers), lbl: "Suppliers" },
              {
                num: statsLoading
                  ? "…"
                  : `${formatStat(stats?.avgSaved)} LKR saved`,
                lbl: "Avg Savings per Project",
              },
            ].map((s) => (
              <div
                key={s.lbl}
                className="px-4 py-6 sm:px-6 sm:py-7 text-center transition-colors hover:bg-surface/60"
              >
                <div className="font-syne text-2xl sm:text-3xl font-bold text-amber tracking-tight">
                  {s.num}
                </div>
                <div className="mt-1 text-[0.72rem] sm:text-xs font-medium uppercase tracking-wider text-muted">
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHO IS CREWSYNC FOR */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center sm:text-left mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate/15 bg-slate/5 px-3.5 py-1 text-xs font-semibold text-slate mb-3">
              Role-Based Experience
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate tracking-tight">
              Who is CrewSync for?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl">
              Choose your role to explore tailored features and tools built for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {roles.map((r) => (
              <div
                key={r.title}
                className={`group relative flex flex-col justify-between h-full rounded-2xl border border-border/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_38px_-12px_rgba(0,0,0,0.12)] ${r.hoverBorder} overflow-hidden cursor-pointer`}
                onClick={() => handleRoleClick(r)}
              >
                {/* Top Role Indicator Gradient Bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${r.topBar}`} />

                {/* Ambient Top Glow on Hover */}
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: r.glowColor }}
                />

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-6 sm:p-7">
                  {/* Top Row: Icon + Role Tag Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-2xl border shadow-xs transition-transform duration-300 group-hover:scale-105 ${r.iconBg}`}
                    >
                      <img
                        src={r.icon}
                        alt={r.title}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${r.badgeColor}`}>
                      {r.tag}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-slate tracking-tight">
                    {r.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted mb-5">
                    {r.desc}
                  </p>

                  {/* Role Perks Checklist */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-border/60">
                    {r.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate/80">
                        <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>

                  {/* Aligned Action Button at Bottom */}
                  <div className="mt-auto pt-2">
                    <button
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all shadow-xs group-hover:shadow-md active:scale-[0.99] cursor-pointer ${r.accent} ${r.hoverBg}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleClick(r);
                      }}
                    >
                      <span>{r.btnLabel}</span>
                      <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section className="w-full border-y border-border/80 bg-gradient-to-b from-surface/30 via-surface/70 to-surface/30 px-4 py-16 sm:px-6 sm:py-20 relative overflow-hidden">
          {/* Subtle background ambient glow */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] rounded-full blur-3xl opacity-25"
            style={{
              background: "radial-gradient(circle, rgba(232,130,12,0.2) 0%, transparent 70%)"
            }}
          />

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="text-center sm:text-left mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber/25 bg-amber/10 px-3.5 py-1 text-xs font-semibold text-amber mb-3">
                Built-in Platform Tools
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate tracking-tight">
                Platform Features
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl">
                Everything you need to run a successful construction project from start to finish
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl border border-border/80 bg-white shadow-xs hover:border-amber/40 hover:shadow-[0_14px_34px_-10px_rgba(232,130,12,0.14),0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle top corner ambient flare on hover */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-amber/15 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Top Row: Icon + Category Badge */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-2xs transition-transform duration-300 group-hover:scale-105 ${f.iconBg}`}>
                        <img
                          src={f.icon}
                          alt={f.title}
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${f.badgeColor}`}>
                        {f.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate group-hover:text-amber transition-colors duration-200 mb-2">
                      {f.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-muted">
                      {f.desc}
                    </p>
                  </div>

                  {/* Bottom Highlight Feature */}
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-medium text-slate/75">
                    <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{f.highlight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / FEEDBACK */}
        <section className="w-full bg-white px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center gap-2.5 text-2xl sm:text-3xl font-bold text-slate">
                <img
                  src="/icons/home-page/feedback.png"
                  alt="Feedback"
                  className="h-8 w-8 object-contain"
                />
                <h2>Contact Admin / Feedback</h2>
              </div>
              <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                Have a question, issue, or suggestion? Send a message directly to
                the CrewSync admin team.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onFeedbackSubmit)}
              className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs"
            >
              <div className="mb-4">
                <label
                  className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-light"
                  htmlFor="fbName"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="fbName"
                  placeholder="e.g. Nimal Kumarasinghe"
                  {...register("name")}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-slate placeholder:text-muted/60 outline-none transition-all focus:border-amber focus:ring-2 focus:ring-amber/20"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-light"
                  htmlFor="fbEmail"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="fbEmail"
                  placeholder="your@email.com"
                  {...register("email")}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-slate placeholder:text-muted/60 outline-none transition-all focus:border-amber focus:ring-2 focus:ring-amber/20"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-light"
                  htmlFor="fbType"
                >
                  Message Type
                </label>
                <select
                  id="fbType"
                  {...register("messageType")}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-slate outline-none transition-all focus:border-amber focus:ring-2 focus:ring-amber/20 cursor-pointer"
                >
                  {FEEDBACK_TYPES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label
                  className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-light"
                  htmlFor="fbMessage"
                >
                  Message
                </label>
                <textarea
                  id="fbMessage"
                  rows={4}
                  placeholder="Describe your issue or suggestion…"
                  {...register("message")}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-slate placeholder:text-muted/60 outline-none transition-all focus:border-amber focus:ring-2 focus:ring-amber/20 resize-y"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-danger">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-xs transition-all hover:bg-amber-dark hover:shadow-md active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                disabled={submitFeedback.isPending}
              >
                {submitFeedback.isPending ? "Sending…" : "Send Message to Admin"}
              </button>

              {fbSuccess && (
                <div className="mt-4 rounded-xl bg-primary-light border border-primary/20 p-3.5 text-center text-sm font-semibold text-primary">
                  <Check className="inline h-4 w-4" /> Your message has been sent! The admin team will get back to
                  you soon.
                </div>
              )}
              {fbError && (
                <div className="mt-4 rounded-xl bg-red-50 border border-danger/20 p-3.5 text-center text-sm font-semibold text-danger">
                  <TriangleAlert className="h-4 w-4 shrink-0" /> {fbError}
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
