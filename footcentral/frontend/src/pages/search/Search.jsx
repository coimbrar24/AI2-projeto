import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IoChevronForward, IoSearch } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "./Search.css";

function Search() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.length < 2) {
      setTeams([]);
      setError("");
      return;
    }

    let active = true;

    const loadTeams = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/teams/search", { params: { q: query } });

        if (active) {
          setTeams(response.data.teams);
        }
      } catch (requestError) {
        console.error(requestError);
        if (active) {
          setTeams([]);
          setError("Não foi possível pesquisar equipas neste momento.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTeams();

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <>
      <Navbar />
      <main className="fc-directory-shell">
        <header className="fc-directory-header">
          <span><IoSearch aria-hidden="true" /> Pesquisa global</span>
          <h1>{query ? `Equipas para “${query}”` : "Pesquisar equipas"}</h1>
          <p>
            Encontra um clube mesmo que não jogue hoje e consulta o seu plantel,
            treinador e informações gerais.
          </p>
        </header>

        {query.length < 2 && (
          <section className="fc-directory-state">
            <IoSearch aria-hidden="true" />
            <h2>O que procuras?</h2>
            <p>Escreve pelo menos dois caracteres na pesquisa acima.</p>
          </section>
        )}

        {loading && (
          <section className="fc-directory-state" role="status">
            <span className="fc-loader" aria-hidden="true" />
            <p>A procurar equipas...</p>
          </section>
        )}

        {!loading && error && (
          <section className="fc-directory-state is-error"><p>{error}</p></section>
        )}

        {!loading && !error && query.length >= 2 && teams.length === 0 && (
          <section className="fc-directory-state">
            <h2>Nenhuma equipa encontrada</h2>
            <p>Experimenta o nome completo, a abreviatura ou o país.</p>
          </section>
        )}

        {!loading && !error && teams.length > 0 && (
          <section className="fc-team-results" aria-label="Resultados da pesquisa">
            {teams.map((team) => (
              <Link key={team.id} to={`/teams/${team.id}`} className="fc-team-result-card">
                <div className="fc-team-result-crest">
                  {team.crest ? <img src={team.crest} alt="" /> : <span>{team.tla}</span>}
                </div>
                <div className="fc-team-result-copy">
                  <span>{team.area?.name || "Internacional"}</span>
                  <h2>{team.shortName || team.name}</h2>
                  <p>
                    {[team.venue, team.founded && `Fundado em ${team.founded}`]
                      .filter(Boolean)
                      .join(" · ") || team.name}
                  </p>
                </div>
                <IoChevronForward aria-hidden="true" />
              </Link>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default Search;
