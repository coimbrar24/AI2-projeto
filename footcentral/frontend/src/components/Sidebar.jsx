import { IoFootball, IoTrophy } from "react-icons/io5";

const leagues = [
  { name: "Liga Portugal", icon: "🇵🇹", aliases: ["Primeira Liga", "Liga Portugal"] },
  { name: "Premier League", icon: "🏴", aliases: ["Premier League"] },
  { name: "LaLiga", icon: "🇪🇸", aliases: ["Primera Division", "LaLiga"] },
  { name: "Serie A", icon: "🇮🇹", aliases: ["Serie A"] },
  { name: "Bundesliga", icon: "🇩🇪", aliases: ["Bundesliga"] },
  { name: "Ligue 1", icon: "🇫🇷", aliases: ["Ligue 1"] },
  { name: "Champions League", icon: "🇪🇺", aliases: ["UEFA Champions League"] },
  { name: "Mundial de Clubes", icon: "🌍", aliases: ["FIFA Club World Cup"] },
];

function Sidebar({ selectedLeague, onSelectLeague }) {
  return (
    <aside className="fc-sidebar fc-panel">
      <div className="fc-panel-title">
        <IoTrophy aria-hidden="true" />
        <h2>Melhores ligas</h2>
      </div>

      <nav aria-label="Competições populares" className="fc-league-list">
        <button
          type="button"
          className={`fc-league-item ${selectedLeague === null ? "active" : ""}`}
          onClick={() => onSelectLeague(null)}
        >
          <span className="fc-league-generic"><IoFootball /></span>
          Todos os jogos
        </button>

        {leagues.map((league) => (
          <button
            key={league.name}
            type="button"
            className={`fc-league-item ${
              selectedLeague?.name === league.name ? "active" : ""
            }`}
            onClick={() => onSelectLeague(league)}
          >
            <span className="fc-league-flag" aria-hidden="true">{league.icon}</span>
            {league.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
