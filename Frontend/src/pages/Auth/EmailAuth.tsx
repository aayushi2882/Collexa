import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmail,
  signUpWithEmail,
} from "../../services/auth";

export default function EmailAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
      if (isLogin) {
        const { error } = await signInWithEmail(email, password);

        if (error) {
          setError(error.message);
          return;
        }

        navigate("/explore");
      } else {
        const { error } = await signUpWithEmail(email, password);

        if (error) {
          setError(error.message);
          return;
        }

        alert(
          "Account created successfully! Please check your email to verify your account."
        );

        setIsLogin(true);
        setEmail("");
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4"
      style={{
        backgroundColor: "#18120d",
        color: "#ede0d8",
        fontFamily: "'Manrope', sans-serif",
        backgroundImage:
          "linear-gradient(to right, rgba(237,224,216,0.05) 1px, transparent 1px), radial-gradient(circle at 50% 35%, rgba(255,178,107,0.15) 0%, transparent 60%)",
        backgroundSize: "calc((100vw - 128px) / 12) 100%, cover",
        backgroundPosition: "64px 0, center",
      }}
    >
      {/* Background Darkening Vignette */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* Auth Card */}
      <div 
        className="w-full max-w-[450px] p-10 rounded-[28px] border shadow-2xl backdrop-blur-[24px] z-10 flex flex-col justify-between animate-float-up"
        style={{
          backgroundColor: "rgba(30, 23, 19, 0.85)", 
          borderColor: "rgba(255, 178, 107, 0.08)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="text-center mb-8">
          <h1 

            className="text-[66px] leading-[0.95] font-semibold text-[#F6F3EF]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-white/70 text-[18px] font-semibold uppercase tracking-wider mt-3 leading-relaxed">
            Continue your Collexa journey.
          </p>
        </div>

        {/* Error message alert box */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs leading-relaxed animate-fade-in">
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email input field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[15px] uppercase tracking-widest text-[#ffb26b] font-bold pl-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={loading}
              className="h-[70px] px-6 rounded-full w-full bg-[#18120d]/60 border border-white/10 text-[18px] text-[#ede0d8] placeholder-white/20 transition-all duration-300 focus:outline-none focus:border-[#ffb26b] focus:ring-1 focus:ring-[#ffb26b]/50 disabled:opacity-50"
            />
          </div>

          {/* Password input field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[15px] uppercase tracking-widest text-[#ffb26b] font-bold pl-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="h-[70px] px-6 rounded-full w-full bg-[#18120d]/60 border border-white/10 text-[18px] text-[#ede0d8] placeholder-white/20 transition-all duration-300 focus:outline-none focus:border-[#ffb26b] focus:ring-1 focus:ring-[#ffb26b]/50 disabled:opacity-50"
            />
          </div>

          {/* Submit CTA button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-4 rounded-full bg-[#ede0d8] hover:bg-white text-black font-bold text-[20px] uppercase tracking-[0.18em] transition-all hover:scale-[1.01] flex items-center justify-center gap-3 cursor-pointer shadow-md disabled:opacity-65 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Toggle option link */}
        <button
          type="button"
          onClick={() => {
            if (!loading) {
              setIsLogin(!isLogin);
              setError(null);
            }
          }}
          disabled={loading}
          className="mt-6 text-center text-[16px] font-semibold text-white/50 hover:text-white transition-all bg-transparent border-none p-0 cursor-pointer disabled:opacity-50"
        >
          {isLogin ? (
            <>
              Don't have an account? <span className="text-[#ffb26b] text-[16px] font-bold pl-1 hover:underline">Sign up</span>
            </>
          ) : (
            <>
              Already have an account? <span className="text-[#ffb26b] text-[16px] font-bold pl-1 hover:underline">Sign in</span>
            </>
          )}
        </button>
      </div>

      {/* Entry animation stylesheet */}
      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float-up {
          animation: floatUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
