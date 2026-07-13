import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { useFavorites } from "../context/FavoritesContext";

const LIVE_STATUSES = new Set([
  "IN_PLAY",
  "PAUSED",
  "EXTRA_TIME",
  "PENALTY_SHOOTOUT",
]);

const FINAL_STATUSES = new Set(["FINISHED", "AWARDED"]);

function Team({ team }) {
  return (
    <span className="fc-match-team">
      {team.crest ? (
        <img
          src={team.crest}
          alt=""
          className="fc-team-crest"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
          }}
        />
      ) : (
        <span className="fc-team-placeholder" aria-hidden="true">
          {team.name?.charAt(0)}
        </span>
      )}
      <span>{team.shortName || team.name}</span>
    </span>
  );
}

function getMatchInfo(match) {
  if (LIVE_STATUSES.has(match.status)) {
    return { label: match.result, live: true };
  }

  if (FINAL_STATUSES.has(match.status)) {
    return { label: match.result, finished: true };
  }

  if (match.status === "POSTPONED" || match.status === "SUSPENDED") {
    return { label: "Adiado" };
  }

  if (match.status === "CANCELLED") {
    return { label: "Cancelado" };
  }

  return {
    label: new Date(match.utcDate).toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function MatchCard({ match, canFavorite }) {
  const info = getMatchInfo(match);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [saving, setSaving] = useState(false);
  const favorite = isFavorite("match", match.id);

  const handleFavorite = async () => {
    if (!canFavorite) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      await toggleFavorite("match", match);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="fc-match-row">
      <div className="fc-match-status">
        {info.live && <span className="fc-live-dot" aria-hidden="true" />}
        <span
          className={`${info.live ? "is-live" : ""} ${
            info.finished ? "is-finished" : ""
          }`}
        >
          {info.label}
        </span>
      </div>

      <div className="fc-match-teams">
        <Team team={match.homeTeam} />
        <Team team={match.awayTeam} />
      </div>

      <button
        type="button"
        className={`fc-favorite-btn ${favorite ? "active" : ""}`}
        disabled={saving}
        onClick={handleFavorite}
        aria-label={
          canFavorite
            ? favorite
              ? "Remover jogo dos favoritos"
              : "Adicionar jogo aos favoritos"
            : "Inicie sessão para adicionar aos favoritos"
        }
        title={
          canFavorite
            ? favorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
            : "Inicie sessão para usar os favoritos"
        }
      >
        {favorite ? <IoStar size={19} /> : <IoStarOutline size={19} />}
      </button>
    </article>
  );
}

export default MatchCard;
