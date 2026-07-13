import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import footballApi from "../../services/footballApi";
import "./Home.css";

function Home() {
  const { isAuthenticated, user } = useAuth();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const leagues = [
    "Liga Portugal",
    "Premier League",
    "LaLiga",
    "Serie A",
    "Bundesliga",
    "Champions League",
  ];

  const news = [
    "Benfica prepara novo reforço.",
    "Messi marca mais um golo.",
    "UEFA divulga calendário.",
  ];

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);

        const response = await footballApi.get(
  "/matches?dateFrom=2026-06-15&dateTo=2026-08-16");

        setMatches(response.data.matches.slice(0, 10));
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os jogos.");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  return (
    <>
      <Navbar />

      <main className="container-fluid py-4">

        <div className="row g-4">

          {/* Competições */}
          <aside className="col-lg-3">

            <div className="fc-card">

              <h5 className="mb-4">🏆 Competições</h5>

              {leagues.map((league) => (
                <button
                  key={league}
                  className="fc-league-btn"
                >
                  {league}
                </button>
              ))}

            </div>

          </aside>

          {/* Jogos */}

          <section className="col-lg-6">

            <div className="fc-card">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h4 className="mb-0">
                  Jogos
                </h4>

                {isAuthenticated && (
                  <span className="text-success fw-semibold">
                    👋 {user?.name}
                  </span>
                )}

              </div>

              {loading && (
                <p>A carregar jogos...</p>
              )}

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {!loading &&
                !error &&
                matches.map((match) => (
                  <div
                    key={match.id}
                    className="fc-match"
                  >

                    <small className="text-secondary">
                      {match.competition.name}
                    </small>

                    <div className="d-flex justify-content-between align-items-center mt-2">

                      <strong>
                        {match.homeTeam.name}
                      </strong>

                      <span className="badge bg-success px-3 py-2">

                        {match.status === "TIMED"
                          ? new Date(match.utcDate).toLocaleTimeString(
                              "pt-PT",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : `${match.score.fullTime.home ?? "-"} - ${
                              match.score.fullTime.away ?? "-"
                            }`}

                      </span>

                      <strong>
                        {match.awayTeam.name}
                      </strong>

                    </div>

                  </div>
                ))}

            </div>

          </section>

          {/* Notícias */}

          <aside className="col-lg-3">

            <div className="fc-card">

              <h5 className="mb-4">
                📰 Últimas Notícias
              </h5>

              {news.map((item, index) => (
                <div
                  key={index}
                  className="fc-news"
                >
                  {item}
                </div>
              ))}

            </div>

          </aside>

        </div>

      </main>
    </>
  );
}

export default Home;