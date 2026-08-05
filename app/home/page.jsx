"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/src/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { FEEDBACK_TYPES, feedbackSchema, toFeedbackPayload } from "@/src/lib/validators/feedback";
import { useStatsSummary, useSubmitFeedback } from "@/src/hooks/home/useHome";

const FEEDBACK_DEFAULT_VALUES = { name: "", email: "", messageType: FEEDBACK_TYPES[0], message: "" };

export default function HomePage() {
  const router = useRouter();
  const { isOwner, isGuest, isProvider, isSupplier, user, loading } = useAuth();
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
      desc: "Plan, manage, and track your construction project from start to finish. Hire directly, save costs.",
      btnLabel: "Open Dashboard",
      route: "/dashboard/propertyowner",
      roleKey: "property_owner",
      registerRole: "owner",
      accent: "bg-owner",
      hoverBg: "hover:bg-owner-dark",
      iconBg: "bg-owner-light",
    },
    {
      icon: "/icons/provider.png",
      title: "Service Provider",
      desc: "Showcase your skills to hundreds of clients. Accept jobs on your schedule, get paid securely.",
      btnLabel: "View Provider Panel",
      route: "/dashboard/serviceprovider",
      roleKey: "service_provider",
      registerRole: "provider",
      accent: "bg-provider",
      hoverBg: "hover:bg-provider-dark",
      iconBg: "bg-provider-light",
    },
    {
      icon: "/icons/supplier.png",
      title: "Material Supplier",
      desc: "List your products, manage inventory, and reach property owners island-wide.",
      btnLabel: "Supplier Portal",
      route: "/dashboard/supplier",
      roleKey: "material_supplier",
      registerRole: "supplier",
      accent: "bg-supplier",
      hoverBg: "hover:bg-supplier-dark",
      iconBg: "bg-supplier-light",
    },
  ];

  function handleRoleClick(r) {
    if (loading) return; // auth check still in progress, ignore the click
    if (user && user.role === r.roleKey) {
      router.push(r.route);
    } else {
      router.push(`/register?role=${r.registerRole}`);
    }
  }

  const features = [
    {
      icon: "/icons/timeline.png",
      title: "Smart Project Timeline",
      desc: "Auto-generate construction tasks (foundation → walls → roofing → finishing). Fully customizable task schedules.",
    },
    {
      icon: "/icons/home-page/escrow.png",
      title: "Secure Escrow Payments",
      desc: "Payments are held securely and released to providers only after task completion — protecting both sides.",
    },
    {
      icon: "/icons/reviews.png",
      title: "Ratings & Reviews",
      desc: "Verified reviews from real clients. Build trust and choose quality workers with confidence.",
    },
    {
      icon: "/icons/home-page/chat.png",
      title: "In-platform Chat",
      desc: "Direct messaging with service providers and suppliers. No need for external apps.",
    },
    {
      icon: "/icons/reports.png",
      title: "Downloadable Reports",
      desc: "Generate and download project reports, cost summaries, and task documentation at any stage.",
    },
    {
      icon: "/icons/home-page/search.png",
      title: "Search & Filter",
      desc: "Find professionals and materials by district, city, rating, category, and price range.",
    },
  ];

  return (
    <>
      <Navbar activeTab="Home" />

      <div className="font-sans bg-surface text-slate leading-relaxed [&_h1]:font-syne [&_h2]:font-syne [&_h3]:font-syne [&_h4]:font-syne [&_h5]:font-syne">
        {/* HERO */}
        <div className="relative overflow-hidden bg-slate px-6 pt-20 pb-16 text-center">
          <div
            className="pointer-events-none absolute -top-16 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(232,130,12,0.15) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 mb-6 inline-block rounded-full border border-amber/30 bg-amber/15 px-3.5 py-1 text-xs font-medium tracking-wide text-amber">
            🇱🇰 Built for Sri Lanka&apos;s Construction Sector
          </div>
          <h1 className="relative z-10 mb-4 text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-[1.1] text-white">
            Manage Your Build,
            <br />
            <span className="text-amber">Without Middlemen</span>
          </h1>
          <p className="relative z-10 mx-auto mb-8 max-w-[520px] text-base text-white/60">
            CrewSync connects property owners directly with skilled tradespeople
            and material suppliers — with full project tracking, timelines, and
            transparent payments.
          </p>
          <div className="relative z-10 flex flex-wrap justify-center gap-3">
            {!isProvider && !isSupplier && (
              <button
                className="rounded-lg bg-amber px-7 py-3 text-[0.95rem] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#b85a00]"
                onClick={() =>
                  isGuest
                    ? router.push("/register")
                    : router.push("/project-form")
                }
              >
                Start a Project →
              </button>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap justify-center border-b border-border bg-white">
          {[
            { num: formatStat(stats?.workers), lbl: "Skilled Workers" },
            { num: formatStat(stats?.projects), lbl: "Projects Done" },
            { num: formatStat(stats?.suppliers), lbl: "Suppliers" },
            {
              num: statsLoading
                ? "…"
                : `${formatStat(stats?.avgSaved)} LKR saved`,
              lbl: "Avg per 100 Spent",
            },
          ].map((s, i) => (
            <div
              key={s.lbl}
              className={`min-w-[120px] flex-1 px-8 py-5 text-center ${i !== 3 ? "border-r border-border" : ""}`}
            >
              <div className="font-syne text-[1.6rem] font-bold text-amber">
                {s.num}
              </div>
              <div className="mt-0.5 text-[0.72rem] uppercase tracking-wide text-muted">
                {s.lbl}
              </div>
            </div>
          ))}
        </div>

        {/* WHO IS CREWSYNC FOR */}
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <div className="mb-1.5 text-2xl font-bold text-slate">
            Who is CrewSync for?
          </div>
          <div className="mb-8 text-sm text-muted">
            Choose your role to explore the platform
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {roles.map((r) => (
              <div
                key={r.title}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_2px_16px_rgba(26,29,35,0.08)]"
                onClick={() => handleRoleClick(r)}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-[3px] ${r.accent}`}
                />
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] ${r.iconBg}`}
                >
                  <img
                    src={r.icon}
                    alt={r.title}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <h3 className="mb-1 text-base font-bold">{r.title}</h3>
                <p className="text-[0.8rem] leading-relaxed text-muted">
                  {r.desc}
                </p>
                <button
                  className={`mt-4 rounded-md px-4 py-1.5 text-[0.78rem] font-semibold text-white transition-colors ${r.accent} ${r.hoverBg}`}
                >
                  {r.btnLabel}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PLATFORM FEATURES */}
        <div className="w-full bg-white px-6 py-10">
          <div className="mx-auto max-w-[1100px]">
            <div className="mb-1.5 text-2xl font-bold text-slate">
              Platform Features
            </div>
            <div className="mb-8 text-sm text-muted">
              Everything you need to run a successful construction project
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-white p-5"
                >
                  <div className="mb-3 h-8 w-8">
                    <img
                      src={f.icon}
                      alt={f.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h4 className="mb-1.5 text-[0.92rem] font-bold">{f.title}</h4>
                  <p className="text-[0.8rem] leading-relaxed text-muted">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTACT / FEEDBACK */}
        <div className="w-full bg-white px-6 py-10">
          <div className="mx-auto max-w-[680px]">
            <div className="mb-1.5 text-center text-2xl font-bold text-slate flex items-center justify-center gap-2.5">
              <img
                src="/icons/home-page/feedback.png"
                alt="Feedback"
                className="h-7 w-7 object-contain"
              />
              Contact Admin / Send Feedback
            </div>
            <div className="mb-6 text-center text-sm text-muted">
              Have a question, issue, or suggestion? Send a message directly to
              the CrewSync admin team.
            </div>
            <form
              onSubmit={handleSubmit(onFeedbackSubmit)}
              className="rounded-xl border border-border bg-surface p-8"
            >
              <div className="mb-4">
                <label
                  className="mb-1.5 block text-[0.8rem] font-semibold text-slate-light"
                  htmlFor="fbName"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="fbName"
                  placeholder="e.g. Nimal Kumarasinghe"
                  {...register("name")}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[0.85rem] text-slate outline-none transition-colors focus:border-amber"
                />
                {errors.name && (
                  <p className="mt-1 text-[0.75rem] text-danger">{errors.name.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="mb-1.5 block text-[0.8rem] font-semibold text-slate-light"
                  htmlFor="fbEmail"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="fbEmail"
                  placeholder="your@email.com"
                  {...register("email")}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[0.85rem] text-slate outline-none transition-colors focus:border-amber"
                />
                {errors.email && (
                  <p className="mt-1 text-[0.75rem] text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="mb-1.5 block text-[0.8rem] font-semibold text-slate-light"
                  htmlFor="fbType"
                >
                  Message Type
                </label>
                <select
                  id="fbType"
                  {...register("messageType")}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[0.85rem] text-slate outline-none transition-colors focus:border-amber"
                >
                  {FEEDBACK_TYPES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="mb-1.5 block text-[0.8rem] font-semibold text-slate-light"
                  htmlFor="fbMessage"
                >
                  Message
                </label>
                <textarea
                  id="fbMessage"
                  rows={4}
                  placeholder="Describe your issue or suggestion…"
                  {...register("message")}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[0.85rem] text-slate outline-none transition-colors focus:border-amber"
                />
                {errors.message && (
                  <p className="mt-1 text-[0.75rem] text-danger">{errors.message.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-amber px-6 py-2.5 text-[0.88rem] font-semibold text-white transition-colors hover:bg-[#b85a00] disabled:opacity-70"
                disabled={submitFeedback.isPending}
              >
                {submitFeedback.isPending ? "Sending…" : "Send Message to Admin"}
              </button>
              {fbSuccess && (
                <div className="mt-4 rounded-lg bg-primary-light p-3 text-center text-[0.88rem] font-semibold text-primary">
                  ✓ Your message has been sent! The admin team will get back to
                  you soon.
                </div>
              )}
              {fbError && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-[0.88rem] font-semibold text-danger">
                  ⚠ {fbError}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
