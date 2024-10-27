import { useState, useEffect } from "react";
import { initializeTunesData, searchTunes } from "./services/tunesService";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import "./App.css";

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeTunesData()
      .then(() => setIsLoading(false))
      .catch(console.error);
  }, []);

  const handleSearch = (query) => {
    const searchResults = searchTunes(query);
    setResults(searchResults);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Irish Tunes Search</h1>
      </header>
      <main className="main-content">
        <SearchBar onSearch={handleSearch} />
        <SearchResults results={results} />
      </main>
    </div>
  );
}

export default App;
