import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

interface Event {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  club: string | null;
  venue: string | null;
  event_date: string | null;
  image_url: string | null;
  registration_url: string | null;
}

export default function EventDetails() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(true);
  const [submittingRegistration, setSubmittingRegistration] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(true);
  const [submittingSave, setSubmittingSave] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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
    async function fetchEvent() {
      if (!eventId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setNotFound(false);
      const { data, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") setNotFound(true);
        else setError(fetchError.message || "We couldn't load this event right now.");
      } else {
        setEvent(data as Event);
      }
      setLoading(false);
    }

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    async function fetchRegistration() {
      if (!eventId || !user) {
        setIsRegistered(false);
        setRegistrationLoading(false);
        return;
      }

      setRegistrationLoading(true);
      setRegistrationMessage(null);
      const { data, error: registrationError } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (registrationError) {
        setRegistrationMessage("We couldn't check your registration status right now.");
        setIsRegistered(false);
      } else {
        setIsRegistered(Boolean(data));
      }
      setRegistrationLoading(false);
    }

    fetchRegistration();
  }, [eventId, user]);

  useEffect(() => {
    async function fetchSavedEvent() {
      if (authLoading) {
        setSaveLoading(true);
        return;
      }

      if (!eventId || !user) {
        setIsSaved(false);
        setSaveLoading(false);
        return;
      }

      setSaveLoading(true);
      setSaveMessage(null);
      const { data, error: savedEventError } = await supabase
        .from("saved_events")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (savedEventError) {
        setSaveMessage("We couldn't check whether this event is saved right now.");
        setIsSaved(false);
      } else {
        setIsSaved(Boolean(data));
      }
      setSaveLoading(false);
    }

    fetchSavedEvent();
  }, [authLoading, eventId, user]);

  const formatDate = (date: string | null) => {
    if (!date) return "Date to be announced";
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? "Date to be announced"
      : parsedDate.toLocaleString(undefined, {
          weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
        });
  };

  const goBack = () => navigate("/explore");

  if (loading) return <PageShell><StatusPanel title="Loading event" message="Gathering the details for you." /></PageShell>;
  if (notFound) return <PageShell><StatusPanel title="Event not found" message="This event may have moved on, or the link is no longer available." onBack={goBack} /></PageShell>;
  if (error) return <PageShell><StatusPanel title="Unable to load event" message={error} onBack={goBack} /></PageShell>;
  if (!event) return null;

  const registerForEvent = async () => {
    if (isRegistered || submittingRegistration || registrationLoading) return;
    if (!eventId || !user) {
      setRegistrationMessage("Your session is unavailable. Please sign in again and try once more.");
      return;
    }

    setSubmittingRegistration(true);
    setRegistrationMessage(null);
    const { error: registrationError } = await supabase
      .from("event_registrations")
      .insert({ event_id: eventId, user_id: user.id });

    if (registrationError) {
      if (registrationError.code === "23505") {
        setIsRegistered(true);
        setRegistrationMessage("You're already registered for this event.");
      } else {
        setRegistrationMessage("We couldn't complete your registration. Please try again.");
      }
    } else {
      setIsRegistered(true);
      setRegistrationMessage("You're registered for this event.");
    }
    setSubmittingRegistration(false);
  };

  const openExternalRegistration = () => {
    if (!event.registration_url) {
      setRegistrationMessage("Registration details have not been published yet.");
      return;
    }
    window.open(event.registration_url, "_blank", "noopener,noreferrer");
  };

  const toggleSavedEvent = async () => {
    if (saveLoading || submittingSave) return;
    if (!eventId || !user) {
      setSaveMessage("Your session is unavailable. Please sign in again and try once more.");
      return;
    }

    setSubmittingSave(true);
    setSaveMessage(null);

    if (isSaved) {
      const { error: unsaveError } = await supabase
        .from("saved_events")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (unsaveError) {
        setSaveMessage("We couldn't unsave this event. Please try again.");
      } else {
        setIsSaved(false);
        setSaveMessage("Event removed from your saved list.");
      }
    } else {
      const { error: saveError } = await supabase
        .from("saved_events")
        .insert({ event_id: eventId, user_id: user.id });

      if (saveError) {
        if (saveError.code === "23505") {
          setIsSaved(true);
          setSaveMessage("This event is already in your saved list.");
        } else {
          setSaveMessage("We couldn't save this event. Please try again.");
        }
      } else {
        setIsSaved(true);
        setSaveMessage("Event saved to your list.");
      }
    }

    setSubmittingSave(false);
  };

  return (
    <PageShell>
      <main className="max-w-[1536px] mx-auto w-full px-6 md:px-12 py-8 md:py-12">
        <button type="button" onClick={goBack} className="inline-flex items-center gap-2 text-xs text-[#d6c3b4] uppercase tracking-[0.18em] font-semibold hover:text-primary transition-colors cursor-pointer mb-8 md:mb-12">
          <span className="material-symbols-outlined text-base">arrow_back</span>Back to explore
        </button>
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-xl bg-[#231f1a] border border-white/10">
            {event.image_url ? <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(252,185,118,0.35),_transparent_38%),linear-gradient(135deg,_#39342f,_#17130f_70%)]" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130f]/65 via-transparent to-transparent" />
          </div>
          <div className="lg:col-span-5 lg:pt-5">
            <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-4">{event.category || "Event"}</p>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.04] text-white mb-5">{event.title}</h1>
            <p className="text-[#d6c3b4] text-base mb-8">Hosted by {event.club || "Collexa"}</p>
            <div className="border-y border-white/10 py-6 space-y-5 mb-8">
              <Detail label="When" value={formatDate(event.event_date)} icon="calendar_month" />
              <Detail label="Where" value={event.venue || "Venue to be announced"} icon="location_on" />
            </div>
            <div className="mb-8">
              <p className="text-primary uppercase tracking-[0.18em] font-bold text-[10px] mb-3">About the event</p>
              <p className="text-[#ebe1d9]/85 leading-7 text-base whitespace-pre-line">{event.description || "More details about this event will be shared soon."}</p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={registerForEvent}
                  disabled={isRegistered || registrationLoading || submittingRegistration}
                  className="w-full sm:w-auto bg-primary text-background px-10 py-4 font-semibold uppercase tracking-widest text-xs rounded-full hover:brightness-110 transition-all active:scale-95 cursor-pointer shadow-lg disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100 disabled:active:scale-100"
                >
                  {registrationLoading ? "Checking registration..." : submittingRegistration ? "Registering..." : isRegistered ? "Registered ✓" : "Register"}
                </button>
                <button
                  type="button"
                  onClick={toggleSavedEvent}
                  disabled={saveLoading || submittingSave}
                  className="w-full sm:w-auto border border-white/20 text-[#ebe1d9] px-6 py-4 font-semibold uppercase tracking-widest text-xs rounded-full hover:border-primary hover:text-primary transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:border-white/20 disabled:hover:text-[#ebe1d9]"
                >
                  {saveLoading ? "Checking saved..." : submittingSave ? isSaved ? "Unsaving..." : "Saving..." : isSaved ? "Saved ✓ · Unsave" : "Save event"}
                </button>
              </div>
              {event.registration_url && (
                <button type="button" onClick={openExternalRegistration} className="text-primary uppercase tracking-widest text-[10px] font-bold hover:text-white transition-colors cursor-pointer">
                  Open external registration
                </button>
              )}
            </div>
            {registrationMessage && <p className="mt-3 text-sm text-[#d6c3b4]" role="status">{registrationMessage}</p>}
            {saveMessage && <p className="mt-3 text-sm text-[#d6c3b4]" role="status">{saveMessage}</p>}
          </div>
        </article>
      </main>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#17130f] text-[#ebe1d9] font-sans">{children}</div>;
}

function Detail({ label, value, icon }: { label: string; value: string; icon: string }) {
  return <div className="flex gap-4 items-start"><span className="material-symbols-outlined text-primary text-xl">{icon}</span><div><p className="text-[#d6c3b4]/65 uppercase tracking-[0.16em] text-[10px] font-bold mb-1">{label}</p><p className="text-[#ebe1d9] text-sm">{value}</p></div></div>;
}

function StatusPanel({ title, message, onBack }: { title: string; message: string; onBack?: () => void }) {
  return <main className="min-h-screen max-w-[1536px] mx-auto px-6 md:px-12 flex items-center"><div className="border-l border-primary pl-6 md:pl-8 max-w-lg"><p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-3">Collexa events</p><h1 className="font-editorial text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1><p className="text-[#d6c3b4] leading-7">{message}</p>{onBack && <button type="button" onClick={onBack} className="mt-8 text-primary uppercase tracking-widest text-xs font-bold cursor-pointer hover:text-white transition-colors">Back to explore</button>}</div></main>;
}
