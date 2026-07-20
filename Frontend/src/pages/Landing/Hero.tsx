import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CollexaHero() {
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Smooth nav entry
    const nav = navRef.current;
    if (nav) {
      nav.style.opacity = "0";
      nav.style.transform = "translateY(-12px)";
      const timer = setTimeout(() => {
        nav.style.transition = "all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)";
        nav.style.opacity = "1";
        nav.style.transform = "translateY(0)";
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);



  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #353534; }

        .vignette-overlay {
          background: radial-gradient(circle, transparent 60%, rgba(0,0,0,0.4) 100%);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.8s; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50%       { transform: translateY(-8px) translateX(-50%); }
        }
        .animate-bounce-custom {
          animation: bounce 1.8s ease-in-out infinite;
        }
      `}</style>

      <section
        className="relative h-screen w-full overflow-hidden flex items-center"
        style={{ backgroundColor: "#131313", color: "#e5e2e1" }}
      >
        {/* ── Background ── */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Creative environment"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdH2Kxhxia8kWt6HcKUuxLdHe7XMG-NhtniUoVmIazfc_9vcns-BwxS1TLac5pb0JE_BLTllFFFc2Bpvx6AiLTyOMV8cq_sg4QXF_HWq3CAgVP9pVPtCCoEO62_lcx0iicVR7CT31XxsIH_DEylV-quk_N0rS3kLt9-0BEqF6Q8PAiyqgBkBJSTe22u3G-A7JAMzd20mJrj1BZnoIxmi3bY4R7yQya5k_T5uBBJUuIsc4W-F_ANpUQwXnUFa7XHAkNW32IJuXkOWc"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transform: "scale(1.08)",
            }}
          />
          <div className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.5)" }} />
          <div className="absolute inset-0 vignette-overlay z-20" />
        </div>

        {/* ── Navbar ── */}
        <header
          ref={navRef}
          style={{
            position: "fixed",
            top: "2rem",
            left: 0,
            right: 0,
            zIndex: 50,
            display: "flex",
            justifyContent: "center",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "1280px",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "9999px",
              padding: "1.25rem 2.5rem",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "border-color 0.5s",
            }}
          >
            {/* Logo */}
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "#e5e2e1",
                letterSpacing: "-0.04em",
                cursor: "pointer",
              }}
            >
              Collexa
            </div>

            {/* Nav links */}
            <nav style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
              {[
                { label: "Explore", active: true },
                { label: "Events",  active: false },
                { label: "Communities", active: false },
              ].map(({ label, active }) => (
                <a
                  key={label}
                  href="#"
                  style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: active ? "#ff8a34" : "#ddc1b1",
                    borderBottom: active ? "1px solid #ff8a34" : "none",
                    paddingBottom: active ? "2px" : undefined,
                    transition: "color 0.3s",
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <button
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.15em",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "#e5e2e1",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "0.625rem 1.75rem",
                borderRadius: "9999px",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                btn.style.background = "#fff";
                btn.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.background = "transparent";
                btn.style.color = "#e5e2e1";
              }}
              onClick={() => navigate("/vibes")}
            >
              Get started
            </button>
          </div>
        </header>

        {/* ── Hero Content ── */}
        <div style={{ position: "relative", zIndex: 30, padding: "6rem 64px 0", maxWidth: "1200px" }}>
          <div style={{ maxWidth: "56rem" }}>

            {/* Eyebrow */}
            <div className="fade-in-up" style={{ marginBottom: "2rem" }}>
              <span
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.4em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "rgba(221,193,177,0.8)",
                }}
              >
                DISCOVER
              </span>
            </div>

            {/* Headline */}
            <h1
              className="fade-in-up delay-1"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(40px, 7vw, 88px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 700,
                color: "#F5F5F3",
                marginBottom: "2.5rem",
                maxWidth: "48rem",
              }}
            >
              Discover opportunities that match your{" "}
              <span style={{ color: "#ff8a34", fontStyle: "italic", fontWeight: 500 }}>
                vibe.
              </span>
            </h1>

            {/* Subtext */}
            <p
              className="fade-in-up delay-2"
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "18px",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
                fontWeight: 300,
                color: "#ddc1b1",
                maxWidth: "36rem",
                marginBottom: "3.5rem",
                opacity: 0.9,
              }}
            >
              Find projects, communities, events and experiences curated around your interests.
              Join the next generation of creators and thinkers.
            </p>

            {/* CTA Buttons */}
            <div
              className="fade-in-up delay-3"
              style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2rem" }}
            >
              <button
                style={{
                  background: "#FF8A34",
                  color: "#fff",
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  padding: "1.25rem 3rem",
                  borderRadius: "2px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
                  transition: "opacity 0.3s, transform 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Explore
              </button>

              <button
                onClick={() => navigate("/vibes")}
                style={{
                  background: "transparent",
                  color: "#e5e2e1",
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  padding: "1.25rem 3rem",
                  borderRadius: "2px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Choose Your Vibe
              </button>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}