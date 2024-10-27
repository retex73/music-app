import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTuneById } from "../services/tunesService";

function TuneDetails() {
  const { tuneId } = useParams();
  const navigate = useNavigate();
  const [tune, setTune] = useState(null);

  useEffect(() => {
    const fetchTune = async () => {
      try {
        const tuneData = await getTuneById(tuneId);
        setTune(tuneData);
      } catch (error) {
        console.error("Error fetching tune details:", error);
      }
    };

    if (tuneId) {
      fetchTune();
    }
  }, [tuneId]);

  return (
    <div className="tune-details">
      {tune ? (
        <>
          <button onClick={() => navigate("/")}>Back to Search</button>
          <h2>{tune.trackName}</h2>
          <p>Artist: {tune.artistName}</p>
          {/* Add more tune details as needed */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TuneDetails;
