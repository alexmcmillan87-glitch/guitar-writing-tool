import React, { useState } from 'react';
import '../styles/PlaybackControls.css';

function PlaybackControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="playback-controls">
      <h3>Playback</h3>
      <div className="controls-container">
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <div className="tempo-control">
          <label>Tempo: {tempo} BPM</label>
          <input 
            type="range" 
            min="60" 
            max="240" 
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            className="tempo-slider"
          />
        </div>
      </div>
    </div>
  );
}

export default PlaybackControls;
