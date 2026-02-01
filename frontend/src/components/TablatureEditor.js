import React from 'react';
import '../styles/TablatureEditor.css';

function TablatureEditor() {
  const strings = ['E', 'A', 'D', 'G', 'B', 'E'];

  return (
    <div className="tablature-editor">
      <h3>Tablature Editor</h3>
      <div className="tab-container">
        <div className="string-labels">
          {strings.map((note, index) => (
            <div key={index} className="string-label">
              {note}
            </div>
          ))}
        </div>
        <div className="tab-grid">
          {strings.map((_, stringIndex) => (
            <div key={stringIndex} className="tab-string">
              {[...Array(16)].map((_, fretIndex) => (
                <div key={fretIndex} className="tab-cell">
                  <span className="fret-line">─</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="editor-hint">Click on a position to add notes (coming soon!)</p>
    </div>
  );
}

export default TablatureEditor;
