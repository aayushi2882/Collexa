import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";


export default function Callback() {
  const navigate = useNavigate();

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      const onboardingAuthPending = localStorage.getItem("onboarding_auth_pending");

      if (onboardingAuthPending) {
        localStorage.removeItem("onboarding_auth_pending");
        navigate("/vibes?onboarding=complete", { replace: true });
        return;
      }

      navigate("/explore");
    } else {
      navigate("/");
    }
  });
}, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      Loading...
    </div>
  );
}
