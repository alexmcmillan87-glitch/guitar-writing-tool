import React from 'react';
import '../styles/ScaleSidebar.css';

function ScaleSidebar() {
  const scales = [
    'C Major',
    'A Minor',
    'G Major',
    'E Minor',
    'D Major',
    'B Minor'
  ];

  return (
    <div className="scale-sidebar">
      <h3>Scales</h3>
      <div className="scale-list">
        {scales.map((scale, index) => (
          <div key={index} className="scale-item">
            {scale}
          </div>
        ))}
      </div>
      <div className="scale-info">
        <p>Select a key to see scale patterns</p>
      </div>
    </div>
  );
}

export default ScaleSidebar;
