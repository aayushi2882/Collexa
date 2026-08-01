import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [userVibes, setUserVibes] = useState<string[]>([]);
  const [userName, setUserName] = useState("Explorer");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    async function fetchVibesAndEvents() {
      if (!user) return;
      setLoading(true);

      // Try to fetch name from user metadata or profiles
      let name = user.user_metadata?.full_name || user.user_metadata?.name;
      if (!name) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();
        if (profileData?.name) {
          name = profileData.name;
        }
      }
      if (!name && user.email) {
        const emailPrefix = user.email.split("@")[0];
        name = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      }
      if (name) {
        setUserName(name);
      }

      // 1. Fetch user vibes
      const { data: vibesData, error: vibesError } = await supabase
        .from("user_vibes")
        .select("vibe")
        .eq("user_id", user.id);

      let activeVibes: string[] = [];
      if (vibesError) {
        console.error("Error fetching user vibes:", vibesError);
      } else if (vibesData) {
        activeVibes = vibesData.map((v) => v.vibe);
        setUserVibes(activeVibes);
      }

      // 2. Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
      } else if (eventsData) {
        const matching = eventsData.filter((e) => activeVibes.includes(e.category));
        const nonMatching = eventsData.filter((e) => !activeVibes.includes(e.category));
        setEvents([...matching, ...nonMatching]);
      }

      setLoading(false);
    }

    fetchVibesAndEvents();
  }, [user]);

  const categories = [
    "All",
    "Hackathon",
    "Workshop",
    "Coding",
    "Entrepreneurship",
    "Design",
    "Cultural",
    "Photography",
    "Talk",
    "AI",
    "Development",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  // ─── Event Placeholders ───
  const getPlaceholderImage = (category: string) => {
    const placeholders: Record<string, string> = {
      AI: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMEh6QRxogQhxDxIkdxsvSaYF4KOzXV8meZX3GNawOw_aopmsvQKZJ5ypvfU1Qm-Puqzkr_LNrP3tn11UKs4IqSpKpw18uZ5odBm5QqsQvvcgG_zb3PtBru3MVgw0jRLIPX_4TAOEdpfMtHbrmHOSCpWRkgPH42uuibDl3vkivXkti1i2N4wBJD67nEAWwm2m8hCrWJmdMN9mX9UcqFVzHGrWMquQmFGNG1EXkVz6hlJLPPC-4aV1D",
      Coding: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9NhrU_QRwFjjdP6biUE2mYyh07LPwau0U1CWxeY6H7OewywRUSFWbe6G8qRdF5V4nlppNLyq-fY4IDvOsiKAywhuytF88cYwuXo0H3FyG2GOnxBPccZkiF2HH0Xw5xOoFutD7Rba6i667Q8ryXLqkQADwF9tvH5AwiUviM9SVMXSKeiRpVajtKTYxWo0KZQfSVz1REaR8OoptOBPLABxhRqOi1_UGvlDgI21a-TvW2jVC7IV6eJbu",
      Photography: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWgpznFQKYpcXNj7AuMw0zlBRu6PQEbL9DPPLHAYGxp4wlv-jbHeGJ7DdqnfD8Ce6AdolGrWOn2uxAtwYDeb1bSyyOS-ZV_9SpxcknYT-H9Ia7uXIq-ojaE0sUrrMZ6WexUFaN6eeLX2aCvKuLdcx-sYgfqpktkLvGbT6aWJ5mAJ1l1q4FXz8dGgaA9boe7W2VJJaZO-AojegqCelCO1oQn7wXSqD_VdLPL9rMrnzEM6PBnbEOIh0v",
      Hackathon: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3xfKrYxdZufBwzvMweUixlIgqBSUSrc4oGsNAdzg5YCs2PcnxkZC0WRSowjLnyAO0GlwlLNpcOqx6lXdLKzjPkNvJT1NP0pSMUtuuh7m0NoCOTr2SzD5knPXbNK8q3aszQc9axPVIa9-Bh07cZ2ob87O-lsPw8uhJ3TjK3UbH-CFwWqjs-DEclopKx3nilDsvlHv9gZ0KUBj77xizJKofk-8lETROWJ8MttBfPeXvOvv1-Os1Sbkp",
      Workshop: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbdapr5T0fcmRpnmwUxSljGTNc5s5PoCNLGyJ3-VZvjFnXiqExHVIUcJ-FWWNf7PoIBfzt_OaOapzzLPYo8LxKxsEM1dQLLZoG8yQ1M-A6Yy_mvK8g2Zj0FOolE7dzv19gKkO8SrgjJ9eB8v3BYp4O04sGuYqXxtpLUc28DPJod9bw7BbHHzhk17Ed0Tn9jUeDiqkAic46L2kKrmXITofrPlsnHgnO46pOjekORs6rqXoy8QJDpXzK",
      Default: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaCH2XwdXDX2FZUBvYZ7_ueImWJCir3grpLpIVQixyf-4oWe8I8XjPAeDUJBiLkSheyqEO_LUHFAQBL8nLB-2G71ugZFuQ6ScTJsNFDdxYDACN505jinfd1I5kgpHeHvo-93CElZRA-QZNGNGV3D1gZwmumG_HH57s0x_jt7Wy9yQRFTHY-8Xkw5o5ThlJXAriMiOhlktU_TD_1PiBdL4HrK7vPP1uwAMl3pHlgQAfUdMGpZx5Qyqy",
    };
    return placeholders[category] || placeholders.Default;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#17130f] text-[#ebe1d9]">
        Loading events...
      </div>
    );
  }

  const recommendedEvents = events.filter((e) => userVibes.includes(e.category));
  const featuredEvent = recommendedEvents.length > 0 ? recommendedEvents[0] : (events.length > 0 ? events[0] : null);
  const recommendedRowEvents = recommendedEvents.length > 0 ? recommendedEvents.slice(0, 3) : events.slice(0, 3);
  const filteredEvents = events
    .filter((e) => activeCategory === "All" || e.category === activeCategory)
    .filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div
      data-vibes={userVibes.join(",")}
      className="min-h-screen w-full flex flex-col font-body-md text-body-md"
      style={{
        backgroundColor: "#17130f",
        color: "#ebe1d9",
      }}
    >
      {/* Top AppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#17130f]/80 backdrop-blur-md border-b border-white/[0.03]">
        <nav className="flex justify-between items-center px-6 md:px-12 py-unit max-w-[1536px] mx-auto h-24 w-full">
          <div
            onClick={() => {
              navigate("/explore");
            }}
            className="font-editorial text-[40px] font-bold text-on-background tracking-[0.02em] cursor-pointer select-none"
          >
            Collexa
          </div>
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-xl relative items-center">
            <span className="material-symbols-outlined absolute left-4 text-on-surface-variant">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-label-md focus:outline-none focus:border-primary transition-all placeholder:text-on-surface-variant/50 text-[#ebe1d9]"
              placeholder="What do you want to discover today?"
              type="text"
            />
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signOut();
                  if (error) throw error;
                  navigate("/", { replace: true });
                } catch (err) {
                  console.error("Sign-out error:", err);
                  navigate("/", { replace: true });
                }
              }}
              className="px-6 py-2 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              Sign Out
            </button>
            <button className="material-symbols-outlined text-primary hover:scale-95 duration-200" data-icon="notifications">
              notifications
            </button>
            <button
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signOut();
                  if (error) throw error;
                  navigate("/", { replace: true });
                } catch (err) {
                  console.error("Sign-out error:", err);
                  navigate("/", { replace: true });
                }
              }}
              className="material-symbols-outlined text-primary hover:scale-95 duration-200"
              data-icon="account_circle"
            >
              account_circle
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-24 flex-grow max-w-[1536px] mx-auto w-full px-6 md:px-12">
        {/* Section 1: Hero Greeting */}
        <section className="relative flex flex-col justify-center pt-8 pb-4 overflow-hidden min-h-[140px]">
          <div className="relative z-10 max-w-3xl">
            <h1 className="font-display-lg text-4xl md:text-[52px] leading-[1.15] mb-2 font-bold font-editorial text-white">
              {getGreeting()}, {userName}.
            </h1>
            <p className="font-body-lg text-body-lg text-[#d6c3b4]/80 max-w-[500px]">
              Curated around the interests you selected.
            </p>
          </div>
        </section>

        {/* Section 2: Featured Recommendation */}
        {featuredEvent && (
          <section className="mb-12 mt-2">
            <div
              onClick={() => window.open(featuredEvent.registration_url, "_blank")}
              className="relative w-full aspect-[21/9] md:aspect-[2.35/1] lg:aspect-[2.5/1] rounded-xl overflow-hidden group hover:cursor-pointer shadow-2xl"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${featuredEvent.image_url || getPlaceholderImage(featuredEvent.category)})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17130f] via-[#17130f]/60 to-transparent z-10" />
              <div className="absolute bottom-10 left-12 right-12 flex justify-between items-end z-20">
                <div className="max-w-2xl">
                  <span className="uppercase tracking-widest text-xs text-[#FFB26B] font-semibold mb-3 block">
                    Recommended For You
                  </span>
                  <h2 className="text-3xl md:text-[44px] font-bold font-editorial text-white leading-tight mb-2">
                    {featuredEvent.title}
                  </h2>
                  <p className="text-base text-[#d6c3b4] font-medium font-sans">
                    Hosted by {featuredEvent.club}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(featuredEvent.registration_url, "_blank");
                  }}
                  className="bg-primary text-background px-10 py-4 font-semibold uppercase tracking-widest text-xs rounded-full hover:brightness-110 transition-all active:scale-95 cursor-pointer shadow-lg mb-1"
                >
                  Register
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Floating Glass Filter Chips */}
        <section className="mb-10 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 glass rounded-full text-label-md whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#FFB26B]/10 text-primary border border-primary/40 font-bold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Section 4: Recommended For You Row */}
        <section className="mb-16 mt-16 md:mt-24">
          <div className="flex justify-between items-end mb-8">
            <h3 className="font-editorial text-3xl md:text-[34px] font-bold text-white tracking-tight leading-tight">Recommended For You</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {recommendedRowEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => window.open(event.registration_url, "_blank")}
                className="hover-lift group cursor-pointer"
              >
                <div
                  className="aspect-square bg-cover bg-center rounded-xl relative overflow-hidden mb-4"
                  style={{
                    backgroundImage: `url(${event.image_url || getPlaceholderImage(event.category)})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <p className="text-label-sm text-primary uppercase font-bold tracking-widest mb-1 text-xs">
                  {event.category}
                </p>
                <h4 className="font-headline-sm text-headline-sm text-lg font-bold group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <p className="text-body-md text-[#ebe1d9]/80 text-sm mt-1 line-clamp-2">
                  {event.description || `Hosted by ${event.club}. Explore this dynamic vibe.`}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Trending This Week Asymmetric Grid */}
        <section className="mb-16 mt-16 md:mt-24">
          <h3 className="font-editorial text-3xl md:text-[34px] font-bold text-white tracking-tight leading-tight mb-8">Trending This Week</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter auto-rows-[200px]">
            {/* Tall Card */}
            <div className="md:col-span-2 md:row-span-3 hover-lift relative rounded-xl overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_PNLTkNCdxNfVB5nKnOmsK0DKLRQEV8jmok9aUZ2qZHlvNzHNAADTpspXzgTadKhXH_chfW0a5w9TsUm_P7s3sgRTGuSYqaVNGiQDsuQyZUNp2L8jjaJSikhopnBiPcmMM12IUQIQanEB-tbJgNTeRYQlZnJDgwDhmvArhO1tomRwHAhwR7a8EDv_vntH_SDGtL6i-hJEDOfIhvjvifFcKvh0jCXlTLiK7GOI92HlBtyR87e-Rofs')",
                }}
              />
              <div className="absolute inset-0 cinematic-gradient opacity-90"></div>
              <div className="absolute bottom-8 left-8">
                <span className="text-label-sm text-primary uppercase font-bold tracking-widest mb-2 block">
                  Entrepreneurship
                </span>
                <h4 className="font-headline-md text-headline-md text-white italic leading-tight">
                  Trending This Week
                  <br />
                  Student Founder Pitch
                </h4>
              </div>
            </div>
            {/* Small Cards */}
            <div className="md:col-span-2 md:row-span-1 glass rounded-xl flex items-center p-6 gap-6 hover-lift">
              <div className="h-full aspect-square bg-[#231f1a] rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
              </div>
              <div>
                <h5 className="font-headline-sm text-headline-sm leading-none mb-1">Neuro-Aesthetics</h5>
                <p className="text-label-sm text-on-surface-variant">1.2k Readers Today</p>
              </div>
            </div>
            <div className="md:col-span-1 md:row-span-2 hover-lift relative rounded-xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCaCH2XwdXDX2FZUBvYZ7_ueImWJCir3grpLpIVQixyf-4oWe8I8XjPAeDUJBiLkSheyqEO_LUHFAQBL8nLB-2G71ugZFuQ6ScTJsNFDdxYDACN505jinfd1I5kgpHeHvo-93CElZRA-QZNGNGV3D1gZwmumG_HH57s0x_jt7Wy9yQRFTHY-8Xkw5o5ThlJXAriMiOhlktU_TD_1PiBdL4HrK7vPP1uwAMl3pHlgQAfUdMGpZx5Qyqy')",
                }}
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h5 className="font-headline-sm text-white">Liquid Gold: Digital Art</h5>
              </div>
            </div>
            <div className="md:col-span-1 md:row-span-2 glass rounded-xl p-8 flex flex-col justify-between hover-lift">
              <span className="material-symbols-outlined text-primary text-4xl">edit_square</span>
              <div>
                <h5 className="font-headline-sm mb-2">Write for Us</h5>
                <p className="text-body-md text-on-surface-variant/80">Submit your editorial pieces to Collexa.</p>
                <button className="mt-4 text-primary font-bold text-label-md flex items-center gap-2 cursor-pointer">
                  Learn More <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Upcoming Events Grid */}
        <section className="mb-16 mt-16 md:mt-24">
          <h3 className="font-editorial text-3xl md:text-[34px] font-bold text-white tracking-tight leading-tight mb-8">Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="glass rounded-xl overflow-hidden hover-lift group flex flex-col justify-between min-h-[380px]"
              >
                <div>
                  <div
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${event.image_url || getPlaceholderImage(event.category)})`,
                    }}
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-label-sm text-primary uppercase font-bold tracking-widest text-[10px]">
                        {event.category} • {event.club}
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-base font-bold mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-body-md text-on-surface-variant/80 text-xs mb-2 line-clamp-2">
                      {event.description}
                    </p>
                    <p className="text-label-md text-on-surface-variant/70 text-xs mb-4">
                      📍 {event.venue || "Block A Auditorium"}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex justify-between items-center">
                  <span className="text-xs text-white/50">
                    📅 {new Date(event.event_date).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => window.open(event.registration_url, "_blank")}
                    className="text-xs text-[#FFB26B] font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Register
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl mt-xl bg-[#110d0a] border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-md max-w-[1536px] mx-auto w-full">
          <div className="font-headline-sm text-headline-sm font-bold text-on-surface">Collexa</div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Archive", "Submit", "Contact"].map((label) => (
              <a
                key={label}
                className="text-on-surface-variant font-label-md hover:text-primary transition-colors opacity-80 hover:opacity-100 text-xs"
                href="#"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="text-on-surface-variant font-label-md opacity-60 text-xs">
            © 2024 Collexa Editorial. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
