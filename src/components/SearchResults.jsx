import React from "react";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ results }) => {
  const navigate = useNavigate();

  const handleTuneClick = (tuneId) => {
    navigate(`/tune/${tuneId}`);
  };

  if (!results.length) return null;

  return (
    <div className="search-results">
      {results.map((tune, index) => (
        <div
          key={index}
          className="result-card"
          onClick={() => handleTuneClick(tune.trackId)}
        >
          <h3>{tune["Tune Title"]}</h3>
          <div className="result-details">
            <span>{tune.Genre}</span>
            <span>{tune.Rhythm}</span>
            <span>
              {tune.Key} {tune.Mode}
            </span>
          </div>
          <a
            href={tune["Learning Video"]}
            target="_blank"
            rel="noopener noreferrer"
            className="video-link"
          >
            Watch Tutorial
          </a>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
