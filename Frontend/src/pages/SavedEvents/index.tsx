import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface SavedEventRow {
  event_id: string;
  saved_at: string | null;
}

export default function SavedEvents() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [unsavingId, setUnsavingId] = useState<string | null>(null);

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
    async function fetchSavedEvents() {
      if (authLoading) return;
      if (!user) {
        setEvents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data: savedRows, error: savedEventsError } = await supabase
        .from("saved_events")
        .select("event_id, saved_at")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (savedEventsError) {
        setError("We couldn't load your saved events right now. Please try again.");
        setLoading(false);
        return;
      }

      const savedEvents = (savedRows ?? []) as SavedEventRow[];
      if (savedEvents.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      const eventIds = savedEvents.map((savedEvent) => savedEvent.event_id);
      const { data: eventRows, error: eventsError } = await supabase
        .from("events")
        .select("id, title, description, category, club, venue, event_date, image_url, registration_url")
        .in("id", eventIds);

      if (eventsError) {
        setError("We couldn't load the details for your saved events. Please try again.");
        setLoading(false);
        return;
      }

      const eventsById = new Map((eventRows as Event[]).map((event) => [event.id, event]));
      setEvents(eventIds.flatMap((eventId) => {
        const event = eventsById.get(eventId);
        return event ? [event] : [];
      }));
      setLoading(false);
    }

    fetchSavedEvents();
  }, [authLoading, user]);

  const unsaveEvent = async (eventId: string) => {
    if (!user || unsavingId) return;

    setUnsavingId(eventId);
    setActionMessage(null);
    const { error: unsaveError } = await supabase
      .from("saved_events")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);

    if (unsaveError) {
      setActionMessage("We couldn't unsave this event. Please try again.");
    } else {
      setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
    }
    setUnsavingId(null);
  };

  if (loading || authLoading) {
    return <PageShell><StatusPanel title="Loading saved events" message="Gathering the events you want to keep close." /></PageShell>;
  }

  if (error) {
    return <PageShell><StatusPanel title="Unable to load saved events" message={error} onAction={() => navigate("/explore")} actionLabel="Explore events" /></PageShell>;
  }

  if (!user || events.length === 0) {
    return <PageShell><StatusPanel title="No saved events yet" message="Save an event from its details page and it will be waiting for you here." onAction={() => navigate("/explore")} actionLabel="Explore events" /></PageShell>;
  }

  return (
    <PageShell>
      <main className="max-w-[1536px] mx-auto w-full px-6 md:px-12 py-8 md:py-12">
        <button type="button" onClick={() => navigate("/explore")} className="inline-flex items-center gap-2 text-xs text-[#d6c3b4] uppercase tracking-[0.18em] font-semibold hover:text-primary transition-colors cursor-pointer mb-8 md:mb-12">
          <span className="material-symbols-outlined text-base">arrow_back</span>Back to explore
        </button>
        <section>
          <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-4">Your collection</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.04] text-white">Saved events</h1>
              <p className="text-[#d6c3b4] text-base mt-4">The events you want to come back to.</p>
            </div>
            <p className="text-[#d6c3b4]/70 text-sm">{events.length} saved {events.length === 1 ? "event" : "events"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <article
                key={event.id}
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/event/${event.id}`)}
                onKeyDown={(eventKey) => {
                  if (eventKey.key === "Enter" || eventKey.key === " ") {
                    eventKey.preventDefault();
                    navigate(`/event/${event.id}`);
                  }
                }}
                className="glass rounded-xl overflow-hidden hover-lift group flex flex-col justify-between min-h-[380px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/70"
              >
                <div>
                  <div className="aspect-[4/3] bg-[#231f1a] relative overflow-hidden">
                    {event.image_url ? <img src={event.image_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(252,185,118,0.35),_transparent_38%),linear-gradient(135deg,_#39342f,_#17130f_70%)]" />}
                  </div>
                  <div className="p-6">
                    <span className="text-primary uppercase font-bold tracking-widest text-[10px]">{event.category || "Event"}{event.club ? ` · ${event.club}` : ""}</span>
                    <h2 className="font-headline-sm text-base font-bold mt-4 mb-2 group-hover:text-primary transition-colors">{event.title}</h2>
                    <p className="text-[#d6c3b4]/80 text-xs leading-5 line-clamp-2">{event.description || `Hosted by ${event.club || "Collexa"}.`}</p>
                    <p className="text-[#d6c3b4]/70 text-xs mt-4 truncate">{event.venue || "Venue to be announced"}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex justify-between items-center gap-4">
                  <span className="text-xs text-white/50">{formatDate(event.event_date)}</span>
                  <button
                    type="button"
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      unsaveEvent(event.id);
                    }}
                    disabled={unsavingId !== null}
                    className="shrink-0 text-xs text-primary font-semibold uppercase tracking-wider hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {unsavingId === event.id ? "Unsaving..." : "Unsave"}
                  </button>
                </div>
              </article>
            ))}
          </div>
          {actionMessage && <p className="mt-6 text-sm text-[#d6c3b4]" role="status">{actionMessage}</p>}
        </section>
      </main>
    </PageShell>
  );
}

function formatDate(date: string | null) {
  if (!date) return "Date to be announced";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? "Date to be announced" : parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#17130f] text-[#ebe1d9] font-sans">{children}</div>;
}

function StatusPanel({ title, message, onAction, actionLabel }: { title: string; message: string; onAction?: () => void; actionLabel?: string }) {
  return <main className="min-h-screen max-w-[1536px] mx-auto px-6 md:px-12 flex items-center"><div className="border-l border-primary pl-6 md:pl-8 max-w-lg"><p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-3">Collexa events</p><h1 className="font-editorial text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1><p className="text-[#d6c3b4] leading-7">{message}</p>{onAction && <button type="button" onClick={onAction} className="mt-8 text-primary uppercase tracking-widest text-xs font-bold cursor-pointer hover:text-white transition-colors">{actionLabel}</button>}</div></main>;
}
