import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "../../services/auth";
import VibeCard from "./VibeCard";
import type { VibeCardData } from "./VibeCard";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VIBE_CARDS: VibeCardData[] = [
  {
    vibe: "AI",
    category: "Innovation",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlV1Sc9Jk_qK5k9iGMW4cjiWz5mLKBfxP_2s0wCerTryxRs0a1FBRIHicr2GeEDwJ7D87oPsgNV2UKWwzy1VquLwBvvsAnJ1-vVwq3aly-374Z0N2X1eacH7U4MjdQ8paawaFHwCAAE3mwiAi5ZgkT-UIiu59wzgruFrkElrOyAmJq4r8rEshFeD9TTjnW3rs60wv12yGGyu4Wc90xOAvg97DgYz9Pww943Ur4MI_rN2T3o9q1d-vlPtuP7hO4O6k89VEqJJ5ctgg",
    height: "280px",
  },
  {
    vibe: "Public Speaking",
    category: "Soft Skills",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCd1fqFEanw1VpnYBYfHocwSR8P2MldyQdFtvG383fSpsRNyy-SzDW6OPG_tX4RPzmS-xNM6QOtfZCyPO4WykjiYbprDSasdjqOlGwipYYoL3g4o5n9f_m6vQeley8QvByRTab2Ze3hgqglc1xXH013LkiHd_MNpFMA8DfC-xXhlkR0pRpgGT-3qVkzywcHgsR0JHaCjePHRg03YJh6ifLs9e95V29LSk2jZdu07pDCEYwcTvhKUyjZfcmVaxwHox5C1j6256rgVFc",
    height: "240px",
  },
  {
    vibe: "Coding",
    category: "Engineering",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgQuwsi_OYTM4gcL48RmlUwVBw2c7-DdqY7cfvd6ltuLSyRgYEv3urm9bwrsqQwF_WtPefItTTryjml_D7KFSR78NWIPmQtw4B9nrCUg-Gzze0-tKr_cTwi2k8yuwCBtZTizOm9MIfnqI_iN68QmgeXDv8Pk47T1kxipgtZVG2T4XhwqSpnDS4mm-IZ1U5brHUKJklbZ-Zx_8RWbm51tZwvZOsdP1g4Ku_jehheeidu5DvtDa4e_vSbaNnGOnckV4T5z-cOuWWbmc",
    height: "320px",
  },
  {
    vibe: "Photography",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxq0ij7Q8j1otuROk9BiC8Hdai1YIJyKELYfk0JMWf7WMv9hDOHEJBsfDquEZnoJiUnUBA-j7wsrCVFAOiJZdxZ-tuf-biiyhPvIN-McERjXWy5sO95gP4aJRrtRvDx42ENuZ_FOxyolTYMber8QlVIsL8QCzZlVpHQOkmfe3Lp-EBunYiDL2MI24_xjtUG2-tZ5EwelkGhtZU6mBgw7aaeBzHdS8uYxSFTojuWmCqUliI3FgTF6hnViCpRxl1Jk-f1ttu3SsRxNg",
    height: "360px",
  },
  {
    vibe: "Design",
    note: "UI/UX, Graphics, Systems.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOEji1e6Mn64lPnPkKn-cqAh4hG7y1Uuw5zlW7DrlrAuV9Bt6CyuYVKMbkQ4pgzFrHXx6NegcqEovBCERL0yl3wh04ZHS1A6ZPQ0Cb1MKRVANE255fPuX1Ck97EYQDKpVJ4xAEIkbjrNl1DtEXqheZ_e8bO_BW6TjB5Y1Cb9sZWUOajI0t-7LvpKXJKCSszx7ub2bK0XsW11xGWuNQU0R7fNvpmGzyukXGSGek9WSxPAewlsdhnGHMuCQsWuGdwc3626a3azS2mSM",
    height: "280px",
  },
  {
    vibe: "Startups",
    accent: "01",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbfk-xhCYdGcjO4tWMS6zNnTRDQpDjrxApDouG9PvB1y9hf5NX7dMMZLuj1gjc2HRUyZFFZQIn112M1sySbLYxPibLpgx8iSyJ1jGQre09o_kzJX7lx17zmoelemeJ0xaWjif9ahyAATfG4Mw0V1pQSf3oEii-2cR13XWJ_MTGjQPZvcevRxWhvz66WBcrBFL0V5d8LL8gR8vCAXIpBX86_LhK6hyJDrlZbVhBtWbF1AWYvHdrnAZbOAtl1cfB8xUkE71K9pIOc4s",
    height: "300px",
  },
  {
    vibe: "Music",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuArCxKqMT4PoROEqGrbJZEmFpKis-nULmatA6QGsAe6wRqINKO-P0LLEPx984z5k1TjeqQYTO-pO_jqGULcn8-7YzQa7Qt1RgL1Z4b98JRmLpmwWunUoiCwKdpssPzHM1l2L6_6q2eiKi5SglqcuGRah_5YNySrqJWRglAJ5iGT6ogQLebRxy85comeEw2nN_BdBlX1ZZlq20L9iiaMNjK5uDcJEr9AZE5dpkykNgTalGd9GTm4v2lR8JfmvC2XncEMH7wrdKe1KbA",
    height: "260px",
  },
  {
    vibe: "Debate",
    note: "Critical Thinking",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDipAM7KEOu8mI4xs_FedPgnce5-G2_Jyh8w4DF-DLT-MFjvSDTEjPXpXqSF9zYf7_7aIpC8bfacR73GDcDgSxyjew4UEdB6d47WY2mGLll3q1thsN0513simCL2kmKvpKazkMkVKWgCNihMZEPpNIg2P46L8tq_WetLv1wRw5DdZBII7AJ8uNilM_lhdi5K8xABL4Mqh7VNLZ_3zMVnu6yaLkhwGzLpFhAoSMCMHSAB-3lW59LMOo2xzPQMFh4lQrgUPJ0wnDttHQ",
    height: "340px",
  },
  {
    vibe: "Dance",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjYthpc4fDYh1dBovAUSNmerLPRPgixFCReg-h-40gaFLt5Z07hAEH5oL5kL-51WgPyfd-9CT2mQjafOqvmeUfJfLCuOKYukLmyc4A_fuaUDaGwpPtIfPt21YgkCq-nHhrDSP6ZIv3txGs0iycGL5tjPkCleOupfN26sFLd4mxGjY8RVbBU91azqHdyVsz2lyi9K7bFCihGtu_pwWW1UocFIbILz_bAywCT3oH0nPLlJN59mRnSZ1rcrhYBSQBeHE_leYZ5xD1Wmc",
    height: "280px",
  },
  {
    vibe: "Hackathons",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDrvB91Sf-xvGJyiM_tAnZP924Wk_CA4CFfgMl0s5ZnRMVXWhYgAzr1BmS0Lp54NAyAr-bp-gvhCgVKu87TA96w7qIQqZEViO_zbH1jB7ABcotfdfr96ul4XiCaGNuQTxcTr_-AZQlwFyyq8dEgf_AZuDyeFaau7To950psap-t05C0Cf97BEexUiNs974NPuVxQGb_6gaK3KLwgWZHmFvNAZbv-M5zWfc4RCcok1LdBOWQmIcijTDx6vMhcZ2zRdqiSx5abbQ75Y",
    height: "240px",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CollexaChooseVibe() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(() => {
    try {
      const savedVibes = JSON.parse(localStorage.getItem("selected_vibes") ?? "[]");
      return new Set(Array.isArray(savedVibes) ? savedVibes : []);
    } catch {
      return new Set();
    }
  });
  const gridRef = useRef<HTMLDivElement>(null);

  // Transition Phase Management
  type Phase = "selection" | "centering" | "tasks" | "auth" | "logging-in";
  const [phase, setPhase] = useState<Phase>("selection");
  const [taskIndex, setTaskIndex] = useState(-1);
  const [loginStep, setLoginStep] = useState(0);

  // Email form sub-phases: "buttons", "press", "expanding", "form"
  type AuthSubPhase = "buttons" | "press" | "expanding" | "form";
  const [authSubPhase, setAuthSubPhase] = useState<AuthSubPhase>("buttons");
  const [authFormState, setAuthFormState] = useState<"login" | "signup">("login");
  const [staggerIndex, setStaggerIndex] = useState(-1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation Steps: 0 = Original, 1 = Normalized, 2 = Centered Deck, 3 = Left Stack
  const [animationStep, setAnimationStep] = useState(0);
  const [transitionCards, setTransitionCards] = useState<any[]>([]);
  const [stackCenter, setStackCenter] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 - 120 });

  const cardRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const placeholderRef = useRef<HTMLDivElement>(null);

  const tasks = [
    "Capturing your interests",
    "Matching communities",
    "Finding opportunities",
    "Personalizing recommendations"
  ];

  const loginSteps = [
    "Creating profile...",
    "Saving your interests...",
    "Preparing recommendations...",
    "Almost ready..."
  ];

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }, 300);
  };

  const handleCardClick = useCallback((vibe: string) => {
    if (phase !== "selection") return;
    setSelectedVibes((prev) => {
      const next = new Set(prev);
      if (next.has(vibe)) {
        next.delete(vibe);
      } else {
        next.add(vibe);
      }
      return next;
    });
  }, [phase]);

  const handleScroll = useCallback(() => {
    if (!gridRef.current || phase !== "selection") return;
    const scroll = gridRef.current.scrollTop;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".vibe-card");
    cards.forEach((card, index) => {
      const speed = ((index % 3) + 1) * 0.05;
      card.style.transform = `translateY(${scroll * speed}px)`;
    });
  }, [phase]);

  const startTransition = () => {
    const selected = Array.from(selectedVibes);
    if (selected.length < 3) return;

    // Capture initial bounding rects of selected grid cards relative to viewport
    const tCards = selected.map((vibeName) => {
      const cardData = VIBE_CARDS.find((c) => c.vibe === vibeName);
      const el = cardRefs.current[vibeName];
      let rect = { top: 0, left: 0, width: 240, height: 320 };
      if (el) {
        const r = el.getBoundingClientRect();
        rect = {
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
        };
      }
      return {
        ...cardData,
        rect,
      };
    });

    setTransitionCards(tCards);
    setPhase("centering");
    setAnimationStep(0); // Start overlay cards exactly on top of grid cards

    // Lock scroll on the grid container
    if (gridRef.current) {
      gridRef.current.style.overflowY = "hidden";
    }

    // Step 1: Normalize dimension sizes in place (to 240x320)
    setTimeout(() => {
      setAnimationStep(1);

      // Measure the exact position of the centered card stack placeholder now that it's rendered
      const placeholderEl = placeholderRef.current;
      if (placeholderEl) {
        const pRect = placeholderEl.getBoundingClientRect();
        setStackCenter({
          x: pRect.left + pRect.width / 2,
          y: pRect.top + pRect.height / 2,
        });
      }
    }, 50);

    // Step 2: Translate and overlap cards in center of the layout placeholder
    setTimeout(() => {
      setAnimationStep(2);
    }, 650);

    // Centering is complete at 2.45s, transition to personalization checklist
    setTimeout(() => {
      setPhase("tasks");
    }, 2450);
  };

  const animateToAuthBadges = () => {
    setAnimationStep(3); // Step 3: Shift cards to left side of Auth Card
    setPhase("auth");
  };

  const handleContinueWithEmail = () => {
    setAuthSubPhase("press");
    setError(null);
    setTimeout(() => {
      setAuthSubPhase("expanding");
      
      setTimeout(() => {
        setAuthSubPhase("form");
        let currentItem = 0;
        setStaggerIndex(0);
        const interval = setInterval(() => {
          currentItem += 1;
          if (currentItem <= 5) {
            setStaggerIndex(currentItem);
          } else {
            clearInterval(interval);
          }
        }, 90); // 90ms staggered reveal interval
      }, 500); // 500ms card height expansion duration
    }, 100); // 100ms press animation duration
  };

  const handleGoogleSignIn = async () => {
    localStorage.setItem("onboarding_auth_pending", "true");
    const { error } = await signInWithGoogle();

    if (error) {
      localStorage.removeItem("onboarding_auth_pending");
      setError(error.message);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = authFormState === "login"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.session) {
        setPhase("logging-in");
        return;
      }

      setAuthFormState("login");
      setError("Check your email to confirm your account, then sign in.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFormState = () => {
    setError(null);
    setAuthFormState((prev) => (prev === "login" ? "signup" : "login"));
  };

  useEffect(() => {
    localStorage.setItem("selected_vibes", JSON.stringify(Array.from(selectedVibes)));
  }, [selectedVibes]);

  useEffect(() => {
    if (searchParams.get("onboarding") === "complete" && !authLoading && user) {
      setPhase("logging-in");
    }
  }, [authLoading, searchParams, user]);

  const saveVibes = async (userId: string) => {
    try {
      const selected = Array.from(selectedVibes);
      
      // 1. Delete existing user vibes
      const { error: deleteError } = await supabase
        .from("user_vibes")
        .delete()
        .eq("user_id", userId);

      if (deleteError) {
        throw deleteError;
      }

      // 2. Insert new user vibes
      const rows = selected.map((vibe) => ({
        user_id: userId,
        vibe,
      }));

      const { error: insertError } = await supabase
        .from("user_vibes")
        .insert(rows);

      if (insertError) {
        throw insertError;
      }

      localStorage.removeItem("selected_vibes");
      return true;
    } catch (err: any) {
      console.error("Failed to save vibes:", err);
      setError(err?.message || "Failed to save your vibes in the database. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    if (phase === "tasks") {
      let currentTask = 0;
      setTaskIndex(0);
      const interval = setInterval(() => {
        currentTask += 1;
        if (currentTask < tasks.length) {
          setTaskIndex(currentTask);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            animateToAuthBadges();
          }, 1200);
        }
      }, 650);
      return () => clearInterval(interval);
    }
  }, [phase, user]);

  useEffect(() => {
    if (phase === "logging-in" && user) {
      let currentStep = 0;
      setLoginStep(0);
      const interval = setInterval(() => {
        currentStep += 1;
        if (currentStep < loginSteps.length) {
          setLoginStep(currentStep);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            if (user) {
              saveVibes(user.id).then((success) => {
                if (success) {
                  navigate("/explore");
                }
              });
            }
          }, 1000);
        }
      }, 700);
      return () => clearInterval(interval);
    }
  }, [phase, user]);

  const selectedArray = Array.from(selectedVibes);
  const remaining = Math.max(0, 3 - selectedVibes.size);
  const canContinue = selectedVibes.size >= 3;

  const counterText =
    selectedVibes.size === 0 ? "None yet" : selectedArray.join(", ");

  const ctaLabel = canContinue
    ? `Continue with ${selectedVibes.size} Vibes`
    : `Choose ${remaining} more to continue`;

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        isExiting ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "#18120d",
        color: "#ede0d8",
        cursor: "crosshair",
        backgroundImage:
          "linear-gradient(to right, rgba(237,224,216,0.05) 1px, transparent 1px), radial-gradient(circle at 70% 30%, rgba(255,178,107,0.08) 0%, transparent 50%)",
        backgroundSize: "calc((100vw - 128px) / 12) 100%, cover",
        backgroundPosition: "64px 0, center",
      }}
    >
      <div 
        className={`absolute inset-0 z-0 bg-black transition-opacity duration-1000 pointer-events-none ${
          phase !== "selection" ? "opacity-50" : "opacity-0"
        }`} 
      />

      <div 
        className={`absolute inset-0 z-0 transition-all duration-1000 pointer-events-none ${
          phase !== "selection" ? "opacity-100" : "opacity-0"
        } ${authSubPhase === "expanding" ? "scale-110 brightness-125" : ""}`}
        style={{
          background: authSubPhase === "expanding" 
            ? "radial-gradient(circle at center, rgba(255,178,107,0.3) 0%, transparent 60%)" 
            : "radial-gradient(circle at center, rgba(255,178,107,0.22) 0%, transparent 60%)",
        }}
      />

      <nav className={`${phase === "logging-in" ? "hidden" : "flex"} justify-between items-center w-full px-16 py-4 h-20 relative z-50 transition-opacity duration-1000 ${phase !== "selection" ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div
          className="text-[#ede0d8] uppercase tracking-widest"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "32px",
            fontWeight: 500,
          }}
        >
          Collexa
        </div>
        <span
          className="uppercase tracking-widest text-[#ffd7b7]"
          style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", fontWeight: 600 }}
        >
          STEP 1 OF 2
        </span>
      </nav>

      <main className={`${phase === "logging-in" ? "hidden" : "flex"} flex-grow px-16 gap-12 relative overflow-hidden`}>
        <section className={`w-[45%] flex flex-col justify-center py-20 relative z-10 transition-opacity duration-1000 ${phase !== "selection" ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="mb-12">
            <button
              onClick={handleBackClick}
              className="inline-flex items-center gap-2 group transition-opacity hover:opacity-70 focus:outline-none bg-transparent border-none p-0 text-inherit cursor-pointer"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              <span
                className="uppercase border-b border-transparent group-hover:border-[#ffd7b7] transition-all"
                style={{ fontSize: "14px", letterSpacing: "0.2em", fontWeight: 600 }}
              >
                Back
              </span>
            </button>
          </div>

          <div className="space-y-6">
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "64px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 700,
                maxWidth: "28rem",
              }}
            >
              Choose your{" "}
              <span style={{ color: "#ffb26b" }}>vibe.</span>
            </h1>
            <p
              className="max-w-sm leading-relaxed"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "18px",
                lineHeight: 1.6,
                color: "#d7c3b4",
              }}
            >
              Pick what excites you and discover opportunities curated around
              your energy.
            </p>
          </div>

          <div className="mt-auto space-y-12 pt-16">
            <div className="space-y-3">
              <p
                className="uppercase tracking-widest"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgba(215,195,180,0.6)",
                }}
              >
                Selected
              </p>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "32px",
                  fontWeight: 500,
                  color: selectedVibes.size > 0 ? "#ffb26b" : "#ede0d8",
                  transition: "color 0.3s",
                }}
              >
                {counterText}
              </div>
            </div>
          </div>
        </section>

        <section className="w-[55%] relative flex items-center h-full">
          <div
            ref={gridRef}
            onScroll={handleScroll}
            className={`grid grid-cols-3 gap-6 w-full pr-8 pt-20 pb-20 ${
              phase !== "selection" ? "overflow-visible" : "overflow-y-auto"
            }`}
            style={{
              maxHeight: "870px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {VIBE_CARDS.map((card) => {
              const isSelected = selectedVibes.has(card.vibe);
              const isDimmed = selectedVibes.size > 0 && !isSelected;

              let customStyle: React.CSSProperties = {};

              if (phase !== "selection") {
                if (isSelected) {
                  // Hide selected grid cards completely because they are animated in the fixed overlay!
                  customStyle = {
                    opacity: 0,
                    pointerEvents: "none",
                    transition: "opacity 0.2s ease-in-out",
                  };
                } else {
                  customStyle = {
                    opacity: 0.1,
                    pointerEvents: "none",
                    transform: "scale(1.12)", // Scale unselected cards by 12% in the background
                    transition: "opacity 1.8s ease-in-out, filter 1.8s, transform 1.8s ease-in-out",
                    filter: "grayscale(0.6)",
                  };
                }
              }

              return (
                <VibeCard
                  key={card.vibe}
                  ref={(el) => {
                    cardRefs.current[card.vibe] = el;
                  }}
                  card={card}
                  isSelected={isSelected}
                  isDimmed={isDimmed}
                  onClick={handleCardClick}
                  style={customStyle}
                />
              );
            })}
          </div>

          {phase === "selection" && (
            <div className="absolute bottom-10 right-0 z-50">
              <button
                disabled={!canContinue}
                onClick={startTransition}
                className="group flex items-center gap-6 pl-8 pr-4 py-4 rounded-full shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer"
                style={{ backgroundColor: "#ffb26b", color: "#4b2700" }}
              >
                <span
                  className="uppercase font-bold"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "14px",
                    letterSpacing: "0.2em",
                    fontWeight: 700,
                  }}
                >
                  {ctaLabel}
                </span>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500"
                  style={{ backgroundColor: "#4b2700", color: "#ffb26b" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Restructured Cinematic Transition Overlay Layout */}
      {phase !== "selection" && phase !== "logging-in" && (
        <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center pointer-events-none">
          {/* 1. Floating merged cards placeholder */}
          <div ref={placeholderRef} className="w-[310px] h-[360px] pointer-events-none opacity-0" />
          
          {/* 2. Large vertical spacing (90px) */}
          <div className="h-[90px] pointer-events-none" />
          
          {/* 3. Text content block (visible during tasks phase) */}
          <div className={`flex flex-col items-center text-center transition-all duration-1000 transform ${
            phase === "tasks" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}>
            <h2 
              className="text-3xl font-semibold text-[#F6F3EF]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Building your Collexa identity
            </h2>
            <p className="text-white/60 text-xs uppercase tracking-widest mt-2">
              Your interests are shaping your campus experience.
            </p>

            <div className="mt-10 space-y-4 text-left w-64">
              {tasks.map((task, idx) => {
                const isVisible = taskIndex >= idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 transition-all duration-500 transform ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border border-[#FFB26B] flex items-center justify-center text-[#FFB26B] text-[10px] font-bold bg-[#FFB26B]/10">
                      ✓
                    </div>
                    <span className="text-xs uppercase tracking-widest text-[#F6F3EF]/70 font-semibold font-['Manrope']">
                      {task}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {(phase === "auth" || phase === "logging-in") && (
        <div className="absolute inset-0 z-[120] flex items-center justify-center pointer-events-none">
          <div 
            className="rounded-[28px] border border-white/5 shadow-2xl backdrop-blur-[24px] pointer-events-auto flex flex-col justify-between transition-all duration-500 ease-in-out"
            style={{
              width: authSubPhase === "form" ? "580px" : "450px",
              height: authSubPhase === "buttons" || authSubPhase === "press" ? "325px" : (authSubPhase === "expanding" ? "450px" : "620px"),
              padding: authSubPhase === "form" ? "48px" : "40px",
              backgroundColor: "rgba(30, 23, 19, 0.85)", 
              borderColor: "rgba(255, 178, 107, 0.08)",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            {phase === "logging-in" ? (
              <div className="flex flex-col items-center justify-center py-6 text-center h-full">
                <div className="space-y-5">
                  {loginSteps.map((step, idx) => {
                    const isVisible = loginStep >= idx;
                    const isCurrent = loginStep === idx;
                    return (
                      <div
                        key={idx}
                        className={`transition-all duration-700 transform ${
                          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        } ${isCurrent ? "text-[#FFB26B]" : "text-[#ede0d8]/40"}`}
                      >
                        <p className="font-['Manrope'] text-xs font-semibold uppercase tracking-[0.25em]">
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : authSubPhase === "buttons" || authSubPhase === "press" || authSubPhase === "expanding" ? (
              <div className="flex flex-col justify-between h-full w-full">
                {/* Header (fades out during expanding) */}
                <div className={`text-center mb-6 transition-all duration-300 transform ${
                  authSubPhase === "expanding" ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
                }`}>
                  <h2 
                    className="text-3xl font-semibold text-[#F6F3EF]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Continue your journey
                  </h2>
                  <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mt-3 leading-relaxed">
                    Sign in to save your personalized campus experience.
                  </p>
                </div>

                {/* Buttons container */}
                <div className="flex flex-col gap-4">
                  {/* Google Login Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    className={`w-full h-12 rounded-full bg-[#ede0d8] hover:bg-white text-black font-bold text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-md ${
                      authSubPhase === "expanding" ? "opacity-0 -translate-y-6 pointer-events-none" : "opacity-100 translate-y-0"
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  {/* Email Login Button */}
                  <button
                    onClick={handleContinueWithEmail}
                    className={`w-full h-12 rounded-full border border-white/10 hover:border-white/20 bg-transparent text-[#F6F3EF] font-bold text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 cursor-pointer ${
                      authSubPhase === "press" ? "scale-[0.98]" : "scale-100"
                    } ${authSubPhase === "expanding" ? "border-transparent bg-transparent pointer-events-none" : ""}`}
                  >
                    <svg className={`w-4 h-4 transition-opacity duration-200 ${authSubPhase === "expanding" ? "opacity-0" : "opacity-100"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className={`transition-opacity duration-200 ${authSubPhase === "expanding" ? "opacity-0" : "opacity-100"}`}>
                      Continue with Email
                    </span>
                  </button>
                </div>

                {/* Terms Disclaimer */}
                <p className={`text-[9px] text-white/30 text-center mt-6 font-semibold tracking-wider uppercase leading-relaxed transition-all duration-300 ${
                  authSubPhase === "expanding" ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
                }`}>
                  By continuing, you agree to Collexa's <br />
                  <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
                </p>
              </div>
            ) : (
              /* Email Auth Form Block */
              <div className="flex flex-col justify-between h-full w-full">
                {/* Header (Stagger Item 0) */}
                <div className={`text-center transition-all duration-500 transform ${
                  staggerIndex >= 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}>
                  <h2 
                    className="text-[38px] font-semibold text-[#F6F3EF] leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {authFormState === "login" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mt-3.5">
                    Continue your Collexa journey.
                  </p>
                </div>

                {/* Inline Error Alert box (if any) */}
                {error && (
                  <div className="mt-4 p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs leading-relaxed animate-fade-in text-left">
                    <div className="flex gap-2 items-start">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-7 mt-8">
                  {/* Email (Stagger Item 1) */}
                  <div className={`flex flex-col gap-2.5 transition-all duration-500 transform ${
                    staggerIndex >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}>
                    <label className="text-[16px] uppercase tracking-widest text-[#ffb26b] font-bold pl-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      disabled={loading}
                      className="h-[70px] px-6 rounded-full w-full bg-[#18120d]/60 border border-white/10 text-[18px] text-[#ede0d8] placeholder-white/20 transition-all duration-300 focus:outline-none focus:border-[#ffb26b] focus:ring-1 focus:ring-[#ffb26b]/50 disabled:opacity-50 py-0"
                    />
                  </div>

                  {/* Password (Stagger Item 2) */}
                  <div className={`flex flex-col gap-2.5 transition-all duration-500 transform ${
                    staggerIndex >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}>
                    <label className="text-[16px] uppercase tracking-widest text-[#ffb26b] font-bold pl-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="h-[70px] px-6 rounded-full w-full bg-[#18120d]/60 border border-white/10 text-[18px] text-[#ede0d8] placeholder-white/20 transition-all duration-300 focus:outline-none focus:border-[#ffb26b] focus:ring-1 focus:ring-[#ffb26b]/50 disabled:opacity-50 py-0"
                    />
                  </div>

                  {/* Submit Button (Stagger Item 3) */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-13 mt-4 rounded-full bg-[#ede0d8] hover:bg-white text-black font-bold text-xs uppercase tracking-[0.15em] transition-all hover:scale-[1.01] flex items-center justify-center gap-3 cursor-pointer shadow-md disabled:opacity-65 disabled:cursor-not-allowed ${
                      staggerIndex >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : authFormState === "login" ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Stagger Item 4: Toggle form state */}
                <button
                  type="button"
                  onClick={toggleFormState}
                  disabled={loading}
                  className={`mt-10 text-center text-[16px] font-semibold text-white/50 hover:text-white transition-all bg-transparent border-none p-0 cursor-pointer disabled:opacity-50 ${
                    staggerIndex >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  {authFormState === "login" ? (
                    <>
                      Don't have an account? <span className="text-[#ffb26b] text-[16px] font-medium pl-1 hover:underline">Sign up</span>
                    </>
                  ) : (
                    <>
                      Already have an account? <span className="text-[#ffb26b] text-[16px] font-medium pl-1 hover:underline">Sign in</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cinematic Fixed Overlay Cards */}
      {phase !== "selection" && phase !== "logging-in" && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-visible">
          {transitionCards.map((tCard, i) => {
            let transformStr = "";
            let transitionDuration = "1.8s";

            const rect = tCard.rect;
            const viewportCenterX = window.innerWidth / 2;
            const viewportCenterY = window.innerHeight / 2;

            if (animationStep === 0) {
              // Step 0: Original position and scale match the grid card top-left
              transformStr = `translate(${rect.left}px, ${rect.top}px) scale(${rect.width / 240}, ${rect.height / 320})`;
              transitionDuration = "0s";
            } else if (animationStep === 1) {
              // Step 1: Normalize sizes in place
              transformStr = `translate(${rect.left}px, ${rect.top}px) scale(1)`;
              transitionDuration = "0.6s";
            } else if (animationStep === 2) {
              // Step 2: Center stack with offsets relative to stackCenter placeholder
              const targetX = stackCenter.x - 120 + (i - 1) * 35;
              const targetY = stackCenter.y - 160 + (i - 1) * 20;
              transformStr = `translate(${targetX}px, ${targetY}px) scale(1)`;
              transitionDuration = "1.8s";
            } else if (animationStep === 3) {
              // Step 3: Auth Badges stack vertically along the left edge of the Auth Card aligned to the top
              const badgeX = viewportCenterX - 400 - 120 + (i - 1) * 15;
              const badgeY = viewportCenterY - 310 + i * 130;
              const rot = i === 0 ? -2 : (i === 1 ? 1 : -1);
              transformStr = `translate(${badgeX}px, ${badgeY}px) scale(0.58) rotate(${rot}deg)`;
              transitionDuration = "1.8s";
            }

            return (
              <div
                key={tCard.vibe}
                className="absolute border border-white/5 rounded-xl overflow-hidden bg-[#251e19] transition-all"
                style={{
                  left: 0,
                  top: 0,
                  width: "240px",
                  height: "320px",
                  transform: transformStr,
                  transformOrigin: "top left",
                  transition: `transform ${transitionDuration} cubic-bezier(0.25, 1, 0.5, 1), opacity 1.8s`,
                  zIndex: 200 + i,
                  boxShadow: phase === "auth"
                    ? "0 0 25px rgba(255, 178, 107, 0.2)" 
                    : "0 20px 50px rgba(0,0,0,0.6)",
                  opacity: 1,
                }}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${tCard.imageUrl}')` }}
                />
                
                {/* Overlay vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#18120d] to-transparent opacity-85" />
                
                {/* Card Content */}
                <div className="absolute bottom-6 left-6 z-10 text-left">
                  {tCard.accent && (
                    <span className="font-['Playfair_Display'] text-3xl mb-2 text-white opacity-30 block">
                      {tCard.accent}
                    </span>
                  )}
                  {tCard.vibe === "Hackathons" && (
                    <div className="flex gap-1 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
                      <div className="w-2 h-2 rounded-full bg-[#ffb26b]" />
                    </div>
                  )}
                  {tCard.category && (
                    <span className="font-['Manrope'] text-[9px] font-semibold text-[#ffb26b] uppercase tracking-widest mb-1 block">
                      {tCard.category}
                    </span>
                  )}
                  <h3 className="font-['Playfair_Display'] text-xl font-semibold text-white">
                    {tCard.vibe}
                  </h3>
                  {tCard.note && (
                    <p className="font-['Manrope'] text-[10px] text-white/70 mt-1">{tCard.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <footer
        className={`${phase === "logging-in" ? "hidden" : "flex"} flex-col md:flex-row justify-between items-center w-full px-16 py-8 gap-4 relative z-50 transition-opacity duration-1000 ${phase !== "selection" ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{ borderTop: "1px solid rgba(237,224,216,0.05)" }}
      >
        <div
          className="uppercase tracking-widest"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: "rgba(215,195,180,0.4)",
          }}
        >
          © 2024 COLLEXA EDITORIAL. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-8">
          {["Privacy Policy", "Terms of Service", "Journal Ethics"].map((label) => (
            <a
              key={label}
              href="#"
              className="uppercase tracking-widest transition-colors hover:text-[#ffb26b]"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "#d7c3b4",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </footer>

      {/* Hide scrollbar globally for the grid */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
