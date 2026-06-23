"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * CrewSync — Home page (converted from Home.html)
 *
 * - This page does NOT render its own <nav> or <footer>. It assumes
 *   a shared <Navbar /> (see Navbar.jsx) and <Footer /> are rendered
 *   in your layout — e.g. app/layout.jsx:
 *
 *     import Navbar from "@/components/Navbar";
 *     export default function RootLayout({ children }) {
 *       return (
 *         <html lang="en">
 *           <body>
 *             <Navbar />
 *             {children}
 *             <Footer />
 *           </body>
 *         </html>
 *       );
 *     }
 *
 * - "Join as Professional" button removed from the hero (only
 *   "Start a Project →" remains), matching the latest design direction.
 * - Routes referenced (router.push) are NOT implemented here:
 *   /get-started, /property-owner, /service-provider, /supplier, /admin
 * - Add the Syne + DM Sans Google Fonts link in your root layout:
 *   <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet" />
 */
export default function HomePage() {
  const router = useRouter();

  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbType, setFbType] = useState("General Inquiry");
  const [fbMessage, setFbMessage] = useState("");
  const [fbSuccess, setFbSuccess] = useState(false);

  function submitFeedback() {
    const name = fbName.trim();
    const email = fbEmail.trim();
    const msg = fbMessage.trim();
    if (!name || !email || !msg) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    setFbSuccess(true);
    setFbName("");
    setFbEmail("");
    setFbMessage("");
  }

  return (
    <div className="cs-home">
      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">🇱🇰 Built for Sri Lanka&apos;s Construction Sector</div>
        <h1>
          Manage Your Build,
          <br />
          <span>Without Middlemen</span>
        </h1>
        <p>
          CrewSync connects property owners directly with skilled tradespeople and
          material suppliers — with full project tracking, timelines, and
          transparent payments.
        </p>
        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={() => router.push("/get-started")}>
            Start a Project →
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">2,400+</div>
          <div className="stat-lbl">Skilled Workers</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">860+</div>
          <div className="stat-lbl">Projects Done</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">320+</div>
          <div className="stat-lbl">Suppliers</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">25 LKR saved</div>
          <div className="stat-lbl">Avg per 100 Spent</div>
        </div>
      </div>

      {/* WHO IS CREWSYNC FOR */}
      <div className="section">
        <div className="section-title">Who is CrewSync for?</div>
        <div className="section-sub">Choose your role to explore the platform</div>
        <div className="role-grid">
          <div
            className="role-card"
            style={{ "--accent": "#E8820C", "--icon-bg": "#FFF3E0", "--icon-color": "#E8820C" }}
            onClick={() => router.push("/property-owner")}
          >
            <div className="role-icon">🏠</div>
            <h3>Property Owner</h3>
            <p>
              Plan, manage, and track your construction project from start to
              finish. Hire directly, save costs.
            </p>
            <button className="role-btn">Open Dashboard</button>
          </div>

          <div
            className="role-card"
            style={{ "--accent": "#1B6E3A", "--icon-bg": "#E6F4EC", "--icon-color": "#1B6E3A" }}
            onClick={() => router.push("/service-provider")}
          >
            <div className="role-icon">🔧</div>
            <h3>Service Provider</h3>
            <p>
              Showcase your skills to hundreds of clients. Accept jobs on your
              schedule, get paid securely.
            </p>
            <button className="role-btn" style={{ background: "#1B6E3A" }}>
              View Provider Panel
            </button>
          </div>

          <div
            className="role-card"
            style={{ "--accent": "#1A56A0", "--icon-bg": "#E8F0FB", "--icon-color": "#1A56A0" }}
            onClick={() => router.push("/supplier")}
          >
            <div className="role-icon">📦</div>
            <h3>Material Supplier</h3>
            <p>List your products, manage inventory, and reach property owners island-wide.</p>
            <button className="role-btn" style={{ background: "#1A56A0" }}>
              Supplier Portal
            </button>
          </div>

          <div
            className="role-card"
            style={{ "--accent": "#6B3FA0", "--icon-bg": "#F0E8FB", "--icon-color": "#6B3FA0" }}
            onClick={() => router.push("/admin")}
          >
            <div className="role-icon">⚙️</div>
            <h3>Admin</h3>
            <p>
              Manage users, monitor platform activity, handle disputes and
              maintain system integrity.
            </p>
            <button className="role-btn" style={{ background: "#6B3FA0" }}>
              Admin Panel
            </button>
          </div>
        </div>
      </div>

      {/* PLATFORM FEATURES */}
      <div className="section" style={{ background: "var(--white)", maxWidth: "100%", padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="section-title">Platform Features</div>
          <div className="section-sub">Everything you need to run a successful construction project</div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h4>Smart Project Timeline</h4>
              <p>
                Auto-generate construction phases (foundation → walls → roofing →
                finishing). Fully customizable task schedules.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h4>Secure Escrow Payments</h4>
              <p>
                Payments are held securely and released to providers only after
                task completion — protecting both sides.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h4>Ratings &amp; Reviews</h4>
              <p>
                Verified reviews from real clients. Build trust and choose
                quality workers with confidence.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h4>In-platform Chat</h4>
              <p>Direct messaging with service providers and suppliers. No need for external apps.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h4>Downloadable Reports</h4>
              <p>
                Generate and download project reports, cost summaries, and task
                documentation at any stage.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h4>Search &amp; Filter</h4>
              <p>Find professionals and materials by district, city, rating, category, and price range.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT ADMIN / FEEDBACK */}
      <div className="section" style={{ background: "var(--white)", maxWidth: "100%", padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div className="section-title" style={{ textAlign: "center" }}>
            📬 Contact Admin / Send Feedback
          </div>
          <div className="section-sub" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            Have a question, issue, or suggestion? Send a message directly to the CrewSync admin team.
          </div>
          <div style={{ background: "var(--surface2)", borderRadius: "var(--radius)", padding: "2rem", border: "1px solid var(--border)" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="fbName">Your Name</label>
              <input
                type="text"
                className="form-input"
                id="fbName"
                placeholder="e.g. Nimal Kumarasinghe"
                value={fbName}
                onChange={(e) => setFbName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fbEmail">Email Address</label>
              <input
                type="email"
                className="form-input"
                id="fbEmail"
                placeholder="your@email.com"
                value={fbEmail}
                onChange={(e) => setFbEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fbType">Message Type</label>
              <select
                className="form-input"
                id="fbType"
                value={fbType}
                onChange={(e) => setFbType(e.target.value)}
              >
                <option>General Inquiry</option>
                <option>Bug Report</option>
                <option>Suggestion / Feature Request</option>
                <option>Account Issue</option>
                <option>Payment Problem</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fbMessage">Message</label>
              <textarea
                className="form-input"
                id="fbMessage"
                rows={4}
                placeholder="Describe your issue or suggestion…"
                value={fbMessage}
                onChange={(e) => setFbMessage(e.target.value)}
              />
            </div>
            <button className="form-submit" style={{ width: "100%" }} onClick={submitFeedback}>
              Send Message to Admin
            </button>
            {fbSuccess && (
              <div
                style={{
                  display: "block",
                  marginTop: "1rem",
                  padding: "12px",
                  background: "var(--green-light)",
                  color: "var(--green)",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontSize: ".88rem",
                  fontWeight: 600,
                }}
              >
                ✓ Your message has been sent! The admin team will get back to you soon.
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cs-home {
          --amber: #e8820c;
          --amber-light: #fff3e0;
          --amber-dark: #b85a00;
          --slate: #1a1d23;
          --slate-mid: #2e3340;
          --slate-light: #4a5068;
          --muted: #8a8fa8;
          --surface: #f7f6f2;
          --surface2: #eeecea;
          --white: #ffffff;
          --green: #1b6e3a;
          --green-light: #e6f4ec;
          --red: #c0392b;
          --red-light: #fdecea;
          --blue: #1a56a0;
          --blue-light: #e8f0fb;
          --border: rgba(26, 29, 35, 0.1);
          --radius: 12px;
          --radius-sm: 8px;
          --shadow: 0 2px 16px rgba(26, 29, 35, 0.08);

          font-family: "DM Sans", sans-serif;
          background: var(--surface);
          color: var(--slate);
          line-height: 1.6;
        }
        .cs-home h1,
        .cs-home h2,
        .cs-home h3,
        .cs-home h4,
        .cs-home h5 {
          font-family: "Syne", sans-serif;
        }

        /* HERO */
        .hero {
          background: var(--slate);
          padding: 5rem 1.5rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: "";
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(232, 130, 12, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(232, 130, 12, 0.15);
          color: var(--amber);
          border: 1px solid rgba(232, 130, 12, 0.3);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 4px 14px;
          margin-bottom: 1.5rem;
          letter-spacing: 0.5px;
        }
        .hero h1 {
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        .hero h1 span {
          color: var(--amber);
        }
        .hero p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1rem;
          max-width: 520px;
          margin: 0 auto 2rem;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-hero-primary {
          background: var(--amber);
          color: #fff;
          border: none;
          padding: 12px 28px;
          border-radius: 8px;
          font-family: "DM Sans", sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-hero-primary:hover {
          background: var(--amber-dark);
          transform: translateY(-1px);
        }

        /* STATS */
        .stats-bar {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .stat-item {
          padding: 1.2rem 2rem;
          text-align: center;
          border-right: 1px solid var(--border);
          flex: 1;
          min-width: 120px;
        }
        .stat-item:last-child {
          border-right: none;
        }
        .stat-num {
          font-family: "Syne", sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--amber);
        }
        .stat-lbl {
          font-size: 0.72rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        /* SECTION */
        .section {
          padding: 3rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--slate);
          margin-bottom: 0.4rem;
        }
        .section-sub {
          color: var(--muted);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }

        /* ROLE CARDS */
        .role-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .role-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .role-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent, var(--amber));
        }
        .role-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow);
        }
        .role-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          background: var(--icon-bg, var(--amber-light));
          color: var(--icon-color, var(--amber));
        }
        .role-card h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.3rem;
        }
        .role-card p {
          font-size: 0.8rem;
          color: var(--muted);
          line-height: 1.5;
        }
        .role-btn {
          margin-top: 1rem;
          background: var(--accent, var(--amber));
          color: #fff;
          border: none;
          padding: 7px 16px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: "DM Sans", sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .role-btn:hover {
          opacity: 0.88;
        }

        /* FEATURES */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        .feature-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.4rem;
        }
        .feature-icon {
          font-size: 1.4rem;
          margin-bottom: 0.8rem;
        }
        .feature-card h4 {
          font-size: 0.92rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }
        .feature-card p {
          font-size: 0.8rem;
          color: var(--muted);
          line-height: 1.5;
        }

        /* FEEDBACK FORM */
        .form-group {
          margin-bottom: 1rem;
        }
        .form-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--slate-light);
          margin-bottom: 5px;
        }
        .form-input {
          width: 100%;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 12px;
          font-family: "DM Sans", sans-serif;
          font-size: 0.85rem;
          color: var(--slate);
          outline: none;
          transition: border 0.2s;
        }
        .form-input:focus {
          border-color: var(--amber);
        }
        .form-submit {
          background: var(--amber);
          color: #fff;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-family: "DM Sans", sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .form-submit:hover {
          background: var(--amber-dark);
        }
      `}</style>
    </div>
  );
}