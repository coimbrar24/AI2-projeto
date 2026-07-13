import { IoChevronForward } from "react-icons/io5";
import MatchCard from "./MatchCard";

function CompetitionCard({ competition, matches, canFavorite }) {
  return (
    <section className="fc-competition-card">
      <header className="fc-competition-header">
        <div className="fc-competition-identity">
          {competition.emblem ? (
            <img src={competition.emblem} alt="" className="fc-competition-logo" />
          ) : (
            <span className="fc-competition-placeholder" aria-hidden="true" />
          )}
          <div>
            <span className="fc-competition-area">
              {matches[0]?.area?.name || "Internacional"}
            </span>
            <h2>{competition.name}</h2>
          </div>
        </div>
        <IoChevronForward className="fc-competition-arrow" aria-hidden="true" />
      </header>

      <div className="fc-match-list">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            canFavorite={canFavorite}
          />
        ))}
      </div>
    </section>
  );
}

export default CompetitionCard;
