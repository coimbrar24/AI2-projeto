import { useEffect, useMemo, useState } from "react";
import { IoCalendarOutline, IoRadioButtonOn } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import CompetitionCard from "../../components/CompetitionCard";
import NewsPanel from "../../components/NewsPanel";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./Home.css";

const LIVE_STATUSES = new Set([
  "IN_PLAY",
  "PAUSED",
  "EXTRA_TIME",
  "PENALTY_SHOOTOUT",
]);

const getDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const dateOptions = [
  { label: "Ontem", value: getDate(-1) },
  { label: "Hoje", value: getDate(0) },
  { label: "Amanhã", value: getDate(1) },
];

function Home() {
  const { isAuthenticated, user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getDate());
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [liveOnly, setLiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/matches", {
          params: { date: selectedDate, limit: 50 },
        });

        setMatches(response.data.matches);
      } catch (requestError) {
        console.error(requestError);
        setMatches([]);
        setError("Não foi possível carregar os jogos. Tenta novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [selectedDate]);

  const visibleMatches = useMemo(() => {
    return matches.filter((match) => {
      const isSelectedLeague =
        !selectedLeague ||
        selectedLeague.aliases.some((name) =>
          match.competition.name.toLowerCase().includes(name.toLowerCase())
        );
      const isLive = !liveOnly || LIVE_STATUSES.has(match.status);
      return isSelectedLeague && isLive;
    });
  }, [liveOnly, matches, selectedLeague]);

  const competitions = useMemo(() => {
    const groupedMatches = new Map();

    visibleMatches.forEach((match) => {
      const key = match.competition.id || match.competition.name;
      const group = groupedMatches.get(key);

      if (group) {
        group.matches.push(match);
      } else {
        groupedMatches.set(key, {
          competition: match.competition,
          matches: [match],
        });
      }
    });

    return Array.from(groupedMatches.values());
  }, [visibleMatches]);

  const formattedDate = new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
    "pt-PT",
    { weekday: "long", day: "numeric", month: "long" }
  );

  return (
    <>
      <Navbar />

      <main className="fc-home-shell">
        <div className="fc-home-grid">
          <Sidebar
            selectedLeague={selectedLeague}
            onSelectLeague={setSelectedLeague}
          />

          <section className="fc-feed" aria-label="Jogos">
            <header className="fc-feed-toolbar">
              <div>
                <span className="fc-feed-eyebrow">
                  <IoCalendarOutline aria-hidden="true" />
                  {formattedDate}
                </span>
                <h1>
                  {liveOnly
                    ? "Jogos ao vivo"
                    : selectedLeague?.name || "Jogos de futebol"}
                </h1>
              </div>

              {isAuthenticated && (
                <span className="fc-welcome">Olá, {user?.name}</span>
              )}
            </header>

            <div className="fc-date-navigation" aria-label="Escolher data">
              {dateOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={selectedDate === option.value ? "active" : ""}
                  onClick={() => {
                    setSelectedDate(option.value);
                    setLiveOnly(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
              <span className="fc-date-divider" aria-hidden="true" />
              <button
                type="button"
                className={`fc-live-filter ${liveOnly ? "active" : ""}`}
                onClick={() => setLiveOnly((current) => !current)}
              >
                <IoRadioButtonOn aria-hidden="true" />
                Ao vivo
              </button>
            </div>

            {loading && (
              <div className="fc-state-card" role="status">
                <span className="fc-loader" aria-hidden="true" />
                <p>A carregar jogos...</p>
              </div>
            )}

            {!loading && error && (
              <div className="fc-state-card is-error">
                <p>{error}</p>
                <button type="button" onClick={() => setSelectedDate(getDate())}>
                  Voltar a hoje
                </button>
              </div>
            )}

            {!loading && !error && competitions.length === 0 && (
              <div className="fc-state-card">
                <span className="fc-empty-ball" aria-hidden="true">⚽</span>
                <h2>Nenhum jogo encontrado</h2>
                <p>
                  {liveOnly
                    ? "Não existem jogos ao vivo neste momento."
                    : "Não há jogos disponíveis para esta data ou competição."}
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              competitions.map((group) => (
                <CompetitionCard
                  key={group.competition.id || group.competition.name}
                  competition={group.competition}
                  matches={group.matches}
                  canFavorite={isAuthenticated}
                />
              ))}
          </section>

          <NewsPanel isAuthenticated={isAuthenticated} />
        </div>
      </main>
    </>
  );
}

export default Home;
