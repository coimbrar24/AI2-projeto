import { Link } from "react-router-dom";
import {
  IoNewspaperOutline,
  IoStar,
  IoStarOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";
import { useFavorites } from "../context/FavoritesContext";

const news = [
  { category: "Mercado", title: "As principais movimentações do mercado de transferências", time: "Há 24 min" },
  { category: "Destaque", title: "Clubes preparam a nova época e definem os seus plantéis", time: "Há 1 h" },
  { category: "Internacional", title: "Os jogos e histórias que estão a marcar o futebol mundial", time: "Há 2 h" },
];

function NewsPanel({ isAuthenticated }) {
  const { favorites, loading } = useFavorites();
  const recentTeams = favorites.teams.slice(0, 2);
  const recentMatches = favorites.matches.slice(0, 1);
  const hasFavorites = recentTeams.length > 0 || recentMatches.length > 0;

  return (
    <aside className="fc-right-column">
      <section className="fc-panel fc-news-panel">
        <div className="fc-panel-title">
          <IoNewspaperOutline aria-hidden="true" />
          <h2>Notícias</h2>
        </div>
        <div className="fc-news-list">
          {news.map((item) => (
            <article key={item.title} className="fc-news-item">
              <div className="fc-news-thumb" aria-hidden="true">
                {item.category === "Mercado" ? <IoSwapHorizontalOutline /> : <IoNewspaperOutline />}
              </div>
              <div><span>{item.category}</span><h3>{item.title}</h3><small>{item.time}</small></div>
            </article>
          ))}
        </div>
        <button type="button" className="fc-text-btn">Ver todas as notícias</button>
      </section>

      <section className="fc-panel fc-favorites-panel">
        <div className="fc-favorites-panel-heading">
          {hasFavorites ? <IoStar className="fc-favorites-icon" /> : <IoStarOutline className="fc-favorites-icon" />}
          <div>
            <h2>Os teus favoritos</h2>
            {!loading && !hasFavorites && (
              <p>{isAuthenticated ? "Ainda não guardaste equipas ou jogos." : "Inicia sessão para guardares equipas e jogos."}</p>
            )}
          </div>
        </div>

        {loading && isAuthenticated && <span className="fc-favorites-loading">A carregar...</span>}

        {!loading && hasFavorites && (
          <div className="fc-home-favorites-list">
            {recentTeams.map((favorite) => {
              const team = favorite.data;
              return (
                <Link key={favorite.id} to={`/teams/${favorite.externalId}`}>
                  <span className="fc-home-favorite-crest">
                    {team.crest ? <img src={team.crest} alt="" /> : team.tla}
                  </span>
                  <span><small>Equipa</small><strong>{team.shortName || team.name}</strong></span>
                </Link>
              );
            })}
            {recentMatches.map((favorite) => {
              const match = favorite.data;
              return (
                <div key={favorite.id} className="fc-home-favorite-match">
                  <span>{match.result || "Jogo"}</span>
                  <strong>{match.homeTeam?.shortName || match.homeTeam?.name} · {match.awayTeam?.shortName || match.awayTeam?.name}</strong>
                </div>
              );
            })}
          </div>
        )}

        <Link className="fc-favorites-link" to={isAuthenticated ? "/favorites" : "/login"}>
          {isAuthenticated ? "Ver todos" : "Iniciar sessão"}
        </Link>
      </section>
    </aside>
  );
}

export default NewsPanel;
