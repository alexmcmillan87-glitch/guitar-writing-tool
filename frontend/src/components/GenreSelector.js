import React, { useState } from 'react';
import '../styles/GenreSelector.css';

function GenreSelector() {
  const [selectedGenre, setSelectedGenre] = useState('');
  
  const genres = [
    'Rock',
    'Metal',
    'Blues',
    'Jazz',
    'Pop',
    'Country',
    'Classical'
  ];

  return (
    <div className="genre-selector">
      <h3>Select Genre</h3>
      <select 
        value={selectedGenre} 
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="genre-dropdown"
      >
        <option value="">-- Choose a Genre --</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      {selectedGenre && (
        <p className="selected-genre">Selected: {selectedGenre}</p>
      )}
    </div>
  );
}

export default GenreSelector;
