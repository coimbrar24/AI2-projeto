import { Link } from "react-router-dom";
import { IoStar, IoTrashOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import MatchCard from "../../components/MatchCard";
import { useFavorites } from "../../context/FavoritesContext";
import "./Favorites.css";

function Favorites() {
  const { favorites, loading, toggleFavorite } = useFavorites();
  const empty = favorites.teams.length === 0 && favorites.matches.length === 0;

  return (
    <>
      <Navbar />
      <main className="fc-favorites-page">
        <header className="fc-favorites-header">
          <span><IoStar /> Área pessoal</span>
          <h1>Os meus favoritos</h1>
          <p>Equipas e jogos guardados na tua conta.</p>
        </header>

        {loading && (
          <section className="fc-favorites-empty" role="status">
            <span className="fc-loader" aria-hidden="true" />
            <p>A carregar favoritos...</p>
          </section>
        )}

        {!loading && empty && (
          <section className="fc-favorites-empty">
            <IoStar aria-hidden="true" />
            <h2>Ainda não tens favoritos</h2>
            <p>Usa a estrela junto de uma equipa ou jogo para o guardares aqui.</p>
            <Link to="/">Explorar jogos</Link>
          </section>
        )}

        {!loading && favorites.teams.length > 0 && (
          <section className="fc-favorites-section">
            <div className="fc-favorites-section-title">
              <span>{favorites.teams.length}</span>
              <h2>Equipas</h2>
            </div>
            <div className="fc-favorite-teams-grid">
              {favorites.teams.map((favorite) => {
                const team = favorite.data;
                return (
                  <article key={favorite.id} className="fc-favorite-team-card">
                    <Link to={`/teams/${favorite.externalId}`}>
                      <span className="fc-favorite-team-crest">
                        {team.crest ? <img src={team.crest} alt="" /> : team.tla}
                      </span>
                      <span>
                        <small>{team.area?.name || "Internacional"}</small>
                        <strong>{team.shortName || team.name}</strong>
                        <em>{team.venue || team.name}</em>
                      </span>
                    </Link>
                    <button
                      type="button"
                      aria-label={`Remover ${team.shortName || team.name} dos favoritos`}
                      onClick={() => toggleFavorite("team", team)}
                    >
                      <IoTrashOutline />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {!loading && favorites.matches.length > 0 && (
          <section className="fc-favorites-section">
            <div className="fc-favorites-section-title">
              <span>{favorites.matches.length}</span>
              <h2>Jogos</h2>
            </div>
            <div className="fc-favorite-matches">
              {favorites.matches.map((favorite) => (
                <MatchCard
                  key={favorite.id}
                  match={favorite.data}
                  canFavorite
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default Favorites;
