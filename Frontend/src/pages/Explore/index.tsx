import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function syncVibes() {
      if (!user) return;
      const raw = localStorage.getItem("selected_vibes");
      if (!raw) return;
      try {
        const selected = JSON.parse(raw);
        if (Array.isArray(selected) && selected.length >= 3) {
          // Delete existing user vibes
          await supabase.from("user_vibes").delete().eq("user_id", user.id);
          // Insert new user vibes
          const rows = selected.map((vibe) => ({
            user_id: user.id,
            vibe,
          }));
          await supabase.from("user_vibes").insert(rows);
          localStorage.removeItem("selected_vibes");
        }
      } catch (e) {
        console.error("Error syncing vibes on explore load:", e);
      }
    }
    syncVibes();
  }, [user]);

  const mockCategories = ["All", "Projects", "Communities", "Events", "Collaborators"];
  const [activeCategory, setActiveCategory] = useState("All");

  const mockCards = [
    {
      title: "Decentralized AI Agents Collective",
      type: "Projects",
      vibe: "AI",
      members: "142 members",
      gradient: "from-[#FFB26B]/20 to-[#251e19]",
    },
    {
      title: "TEDx Campus Pitch Night",
      type: "Events",
      vibe: "Public Speaking",
      members: "80 attending",
      gradient: "from-[#FF8A2A]/20 to-[#251e19]",
    },
    {
      title: "Kernel Hackathon Incubator",
      type: "Projects",
      vibe: "Coding",
      members: "64 creators",
      gradient: "from-[#FFB26B]/20 to-[#251e19]",
    },
    {
      title: "Visual Storytellers Workshop",
      type: "Events",
      vibe: "Photography",
      members: "28 attending",
      gradient: "from-[#FF8A2A]/20 to-[#251e19]",
    },
    {
      title: "NextGen Founders Summit",
      type: "Communities",
      vibe: "Startups",
      members: "310 members",
      gradient: "from-[#FFB26B]/20 to-[#251e19]",
    },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundColor: "#18120d",
        color: "#F6F3EF",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center w-full px-16 py-6 border-b border-white/[0.03]">
        <div
          className="uppercase tracking-widest cursor-pointer"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "28px",
            fontWeight: 500,
            color: "#ede0d8",
          }}
          onClick={() => navigate("/")}
        >
          Collexa
        </div>
        <div className="flex items-center gap-6">
          <span className="text-white/60 text-sm">Welcome back, Explorer</span>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow px-16 py-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[#FFB26B] font-semibold text-xs tracking-[0.2em] uppercase block mb-3">
            Your Personalized Portal
          </span>
          <h1
            className="text-5xl font-semibold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "#F6F3EF" }}
          >
            Explore your ecosystem.
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            Opportunities, communities, and events tailored around your active vibes.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10 w-full">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search nodes, projects, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#251e19] border border-white/5 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFB26B] transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {mockCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#FFB26B] text-black"
                    : "bg-[#251e19] text-white/60 border border-white/5 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCards
            .filter((c) => activeCategory === "All" || c.type === activeCategory)
            .map((card, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl border border-white/5 overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:shadow-2xl flex flex-col justify-between min-h-[220px]"
                style={{ backgroundColor: "#251e19" }}
              >
                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-tr"
                  style={{
                    backgroundImage: "radial-gradient(circle at 70% 30%, #FFB26B 0%, transparent 60%)",
                  }}
                />

                <div className="z-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-semibold text-[#FFB26B] uppercase tracking-widest">
                      {card.type}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">
                      {card.vibe}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-medium leading-snug group-hover:text-[#FFB26B] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {card.title}
                  </h3>
                </div>

                <div className="flex justify-between items-center mt-6 z-10 pt-4 border-t border-white/[0.03]">
                  <span className="text-xs text-white/50">{card.members}</span>
                  <button className="text-xs text-[#FFB26B] font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Connect
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>

      

      {/* Footer */}
      <footer className="w-full px-16 py-8 border-t border-white/[0.03] flex justify-between items-center mt-20">
        <span className="text-xs text-white/40">© 2024 COLLEXA EDITORIAL</span>
        <span className="text-xs text-[#FFB26B]">PERSONALIZED EXPLORE PORTAL</span>
      </footer>
    </div>
  );
}
