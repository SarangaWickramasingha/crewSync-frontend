"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * CrewSync — Navbar (extracted from Home.html)
 *
 * Render this once in your root layout (e.g. app/layout.jsx) so it
 * appears above every page, instead of repeating it per-page:
 *
 *   import Navbar from "@/components/Navbar";
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="en">
 *         <body>
 *           <Navbar />
 *           {children}
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * - "Log In" routes to /sign-in — update if your route differs.
 * - "Get Started" routes to /get-started.
 * - "Home" tab routes to / — pass `activeTab` if you want to highlight
 *   a different tab on other pages (optional, see prop below).
 * - Add the Syne + DM Sans Google Fonts link in your root layout:
 *   <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet" />
 */
export default function Navbar({ activeTab = "Home" }) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="cs-nav">
      <div className="nav-logo" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
        Crew<span>Sync</span>
      </div>

      <div className={`nav-tabs ${navOpen ? "open" : ""}`}>
        <button
          className={`nav-tab ${activeTab === "Home" ? "active" : ""}`}
          onClick={() => {
            router.push("/");
            setNavOpen(false);
          }}
        >
          Home
        </button>
      </div>

      <div className="nav-right">
        <button className="btn-sm btn-outline" onClick={() => router.push("/sign-in")}>
          Log In
        </button>
        <button className="btn-sm btn-amber" onClick={() => router.push("/get-started")}>
          Get Started
        </button>
        <button className="mobile-nav-toggle" onClick={() => setNavOpen((v) => !v)}>
          ☰
        </button>
      </div>

      <style jsx>{`
        .cs-nav {
          --amber: #e8820c;
          --amber-dark: #b85a00;
          --slate: #1a1d23;
          --slate-mid: #2e3340;

          font-family: "DM Sans", sans-serif;
          background: var(--slate);
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo {
          color: var(--amber);
          font-family: "Syne", sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .nav-logo span {
          color: #fff;
        }
        .nav-tabs {
          display: flex;
          gap: 4px;
        }
        .nav-tab {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.55);
          font-family: "DM Sans", sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-tab.active,
        .nav-tab:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .nav-tab.active {
          color: var(--amber);
        }
        .nav-right {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .btn-sm {
          padding: 6px 14px;
          border-radius: 6px;
          font-family: "DM Sans", sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .btn-amber {
          background: var(--amber);
          color: #fff;
        }
        .btn-amber:hover {
          background: var(--amber-dark);
        }

        /* MOBILE NAV */
        .mobile-nav-toggle {
          display: none;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.3rem;
          cursor: pointer;
        }
        @media (max-width: 640px) {
          .mobile-nav-toggle {
            display: block;
          }
          .nav-tabs {
            display: none;
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            background: var(--slate-mid);
            flex-direction: column;
            padding: 0.5rem;
            z-index: 200;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .nav-tabs.open {
            display: flex;
          }
          .nav-tab {
            width: 100%;
            text-align: left;
            padding: 10px 14px;
          }
          .nav-right .btn-outline {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}