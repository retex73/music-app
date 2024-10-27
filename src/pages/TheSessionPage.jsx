import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";

const TheSessionPage = () => {
  const [tunes, setTunes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("new"); // new, popular, recordings, sets

  const fetchTunes = async (category, searchTerm = "") => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (searchTerm) {
        url = `https://thesession.org/tunes/search?q=${searchTerm}&format=json`;
      } else {
        url = `https://thesession.org/tunes/${category}?format=json`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch tunes");
      }
      const data = await response.json();
      setTunes(data.tunes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTunes(category);
  }, [category]);

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      fetchTunes("search", searchTerm);
    } else {
      fetchTunes(category);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">The Session Tunes</h1>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="new">New Tunes</option>
          <option value="popular">Popular Tunes</option>
          <option value="recordings">Recordings</option>
          <option value="sets">Sets</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid gap-4">
        {tunes.map((tune) => (
          <div key={tune.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{tune.name}</h2>
            <p>Type: {tune.type}</p>
            <p>Settings: {tune.settings}</p>
            <a
              href={`https://thesession.org/tunes/${tune.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on TheSession.org
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheSessionPage;
