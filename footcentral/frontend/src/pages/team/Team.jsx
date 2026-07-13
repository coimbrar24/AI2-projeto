import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoShirtOutline,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import "../search/Search.css";
import "./Team.css";

const positionLabels = {
  Goalkeeper: "Guarda-redes",
  Defence: "Defesas",
  Midfield: "Médios",
  Offence: "Avançados",
  Unknown: "Outros",
};

const getPositionGroup = (position) => {
  if (position === "Goalkeeper") return "Goalkeeper";
  if (["Defence", "Centre-Back", "Right-Back", "Left-Back"].includes(position)) {
    return "Defence";
  }
  if (
    ["Midfield", "Defensive Midfield", "Central Midfield", "Attacking Midfield"].includes(position)
  ) {
    return "Midfield";
  }
  if (
    ["Offence", "Right Winger", "Left Winger", "Centre-Forward", "Second Striker"].includes(position)
  ) {
    return "Offence";
  }
  return "Unknown";
};

const getAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};

function Team() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingFavorite, setSavingFavorite] = useState(false);

  useEffect(() => {
    let active = true;

    const loadTeam = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/teams/${id}`);
        if (active) setTeam(response.data.team);
      } catch (requestError) {
        console.error(requestError);
        if (active) setError("Não foi possível carregar esta equipa.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTeam();
    return () => { active = false; };
  }, [id]);

  const squadByPosition = useMemo(() => {
    const groups = new Map();

    (team?.squad || []).forEach((player) => {
      const position = getPositionGroup(player.position);
      const players = groups.get(position) || [];
      players.push(player);
      groups.set(position, players);
    });

    return Array.from(groups.entries());
  }, [team]);

  const seasonLabel = team?.season
    ? `${team.season}/${String(team.season + 1).slice(-2)}`
    : "atual";
  const favorite = team ? isFavorite("team", team.id) : false;

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const summary = {
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      tla: team.tla,
      crest: team.crest,
      founded: team.founded,
      venue: team.venue,
      area: team.area,
    };

    try {
      setSavingFavorite(true);
      await toggleFavorite("team", summary);
    } catch (favoriteError) {
      console.error(favoriteError);
    } finally {
      setSavingFavorite(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="fc-team-page">
        <div className="fc-team-content">
          <Link to="/teams" className="fc-team-back">← Todas as equipas</Link>

          {loading && (
            <section className="fc-directory-state" role="status">
              <span className="fc-loader" aria-hidden="true" />
              <p>A carregar equipa...</p>
            </section>
          )}

          {!loading && error && (
            <section className="fc-directory-state is-error"><p>{error}</p></section>
          )}

          {!loading && team && (
            <>
              <header className="fc-team-hero">
                <div className="fc-team-main-crest">
                  {team.crest ? <img src={team.crest} alt={`Escudo do ${team.name}`} /> : team.tla}
                </div>
                <div className="fc-team-hero-copy">
                  <span>{team.area?.name || "Internacional"}</span>
                  <h1>{team.name}</h1>
                  <p>{[team.tla, team.clubColors].filter(Boolean).join(" · ")}</p>
                </div>
                <button
                  type="button"
                  className={`fc-team-favorite ${favorite ? "active" : ""}`}
                  disabled={savingFavorite}
                  onClick={handleFavorite}
                >
                  {favorite ? <IoStar /> : <IoStarOutline />}
                  {favorite ? "Guardada" : "Guardar equipa"}
                </button>
              </header>

              <section className="fc-team-facts" aria-label="Informações da equipa">
                <div><IoCalendarOutline /><span>Fundação<strong>{team.founded || "—"}</strong></span></div>
                <div><IoLocationOutline /><span>Estádio<strong>{team.venue || "—"}</strong></span></div>
                <div><IoPersonOutline /><span>Treinador<strong>{team.coach?.name || "—"}</strong></span></div>
                <div><IoPeopleOutline /><span>Plantel<strong>{team.squad?.length || 0} jogadores</strong></span></div>
              </section>

              {team.runningCompetitions?.length > 0 && (
                <section className="fc-team-section">
                  <div className="fc-team-section-title">
                    <IoShirtOutline />
                    <div><span>Época {seasonLabel}</span><h2>Competições</h2></div>
                  </div>
                  <div className="fc-team-competitions">
                    {team.runningCompetitions.map((competition) => (
                      <div key={competition.id}>
                        {competition.emblem && <img src={competition.emblem} alt="" />}
                        <span>{competition.name}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="fc-team-section">
                <div className="fc-team-section-title">
                  <IoPeopleOutline />
                  <div><span>{team.squad?.length || 0} jogadores · {seasonLabel}</span><h2>Plantel</h2></div>
                </div>

                {squadByPosition.length === 0 ? (
                  <p className="fc-squad-empty">O plantel não está disponível para esta equipa.</p>
                ) : (
                  squadByPosition.map(([position, players]) => (
                    <div key={position} className="fc-squad-group">
                      <h3>{positionLabels[position] || position}</h3>
                      <div className="fc-player-grid">
                        {players.map((player) => {
                          const age = getAge(player.dateOfBirth);
                          return (
                            <article key={player.id} className="fc-player-card">
                              <span className="fc-player-avatar">{player.name?.charAt(0)}</span>
                              <div>
                                <h4>{player.name}</h4>
                                <p>
                                  {[player.nationality, age !== null && `${age} anos`]
                                    .filter(Boolean)
                                    .join(" · ") || "Sem informação"}
                                </p>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Team;
