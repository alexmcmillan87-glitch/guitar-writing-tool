import React, { useState } from 'react';
import '../styles/TablatureEditor.css';

function TablatureEditor() {
  // Guitar strings (from LOW E to high e)
  const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
  
  // Number of positions per measure
  const positionsPerMeasure = 16;
  
  // State to store measures (array of measure objects)
  const [measures, setMeasures] = useState([
    { id: 1, notes: [] } // Start with one empty measure
  ]);
  
  // State for selected cell
  const [selectedCell, setSelectedCell] = useState(null);
  
  // State for partial keyboard input
  const [partialInput, setPartialInput] = useState('');

  // Get total note count across all measures
  const getTotalNotes = () => {
    return measures.reduce((total, measure) => total + measure.notes.length, 0);
  };

  // Function to check if a note exists at a position in a specific measure
  const getNoteAt = (measureId, stringIndex, position) => {
    const measure = measures.find(m => m.id === measureId);
    if (!measure) return null;
    
    return measure.notes.find(
      note => note.string === stringIndex && note.position === position
    );
  };

  // Function to add or remove a note
  const handleCellClick = (measureId, stringIndex, position) => {
    const existingNote = getNoteAt(measureId, stringIndex, position);
    
    if (existingNote) {
      // Note exists, remove it
      setMeasures(measures.map(measure => {
        if (measure.id === measureId) {
          return {
            ...measure,
            notes: measure.notes.filter(note => 
              !(note.string === stringIndex && note.position === position)
            )
          };
        }
        return measure;
      }));
      setSelectedCell(null);
    } else {
      // No note, select this cell for input
      setSelectedCell({ measureId, string: stringIndex, position });
    }
    setPartialInput('');
  };

  // Function to add a fret number to selected cell
  const addFret = (fretNumber) => {
    if (selectedCell) {
      const newNote = {
        string: selectedCell.string,
        position: selectedCell.position,
        fret: fretNumber
      };
      
      setMeasures(measures.map(measure => {
        if (measure.id === selectedCell.measureId) {
          return {
            ...measure,
            notes: [...measure.notes, newNote]
          };
        }
        return measure;
      }));
      
      setSelectedCell(null);
      setPartialInput('');
    }
  };

  // Add a new measure
  const addMeasure = () => {
    const newId = Math.max(...measures.map(m => m.id), 0) + 1;
    setMeasures([...measures, { id: newId, notes: [] }]);
  };

  // Delete a measure
  const deleteMeasure = (measureId) => {
    if (measures.length === 1) {
      alert("You must have at least one measure!");
      return;
    }
    
    if (window.confirm(`Delete measure ${measures.findIndex(m => m.id === measureId) + 1}?`)) {
      setMeasures(measures.filter(m => m.id !== measureId));
      if (selectedCell?.measureId === measureId) {
        setSelectedCell(null);
      }
    }
  };

  // Duplicate a measure
  const duplicateMeasure = (measureId) => {
    const measureToDuplicate = measures.find(m => m.id === measureId);
    if (!measureToDuplicate) return;
    
    const newId = Math.max(...measures.map(m => m.id), 0) + 1;
    const measureIndex = measures.findIndex(m => m.id === measureId);
    
    const duplicatedMeasure = {
      id: newId,
      notes: [...measureToDuplicate.notes] // Copy the notes
    };
    
    const newMeasures = [...measures];
    newMeasures.splice(measureIndex + 1, 0, duplicatedMeasure);
    setMeasures(newMeasures);
  };

  // Handle keyboard input
  const handleKeyPress = (event) => {
    if (selectedCell) {
      const key = event.key;
      
      if (key >= '0' && key <= '9') {
        const digit = key;
        
        if (partialInput) {
          const twoDigitNumber = parseInt(partialInput + digit);
          if (twoDigitNumber <= 24) {
            addFret(twoDigitNumber);
            setPartialInput('');
          } else {
            setPartialInput(digit);
          }
        } else {
          const singleDigit = parseInt(digit);
          if (singleDigit >= 0 && singleDigit <= 9) {
            setPartialInput(digit);
            
            setTimeout(() => {
              setPartialInput(prev => {
                if (prev === digit) {
                  addFret(singleDigit);
                  return '';
                }
                return prev;
              });
            }, 500);
          }
        }
      }
      
      if (key === 'Escape') {
        setSelectedCell(null);
        setPartialInput('');
      }
      
      if (key === 'Backspace') {
        setPartialInput('');
      }
    }
  };

  // Add keyboard listener
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedCell, partialInput]);

  return (
    <div className="tablature-editor">
      <div className="editor-header">
        <h3>Tablature Editor</h3>
        <div className="editor-stats">
          <span>Measures: {measures.length}</span>
          <span>Notes: {getTotalNotes()}</span>
        </div>
      </div>

      <div className="measures-container">
        {measures.map((measure, measureIndex) => (
          <div key={measure.id} className="measure-wrapper">
            <div className="measure-header">
              <span className="measure-number">Measure {measureIndex + 1}</span>
              <div className="measure-actions">
                <button
                  className="measure-action-btn duplicate"
                  onClick={() => duplicateMeasure(measure.id)}
                  title="Duplicate this measure"
                >
                  📋
                </button>
                <button
                  className="measure-action-btn delete"
                  onClick={() => deleteMeasure(measure.id)}
                  title="Delete this measure"
                  disabled={measures.length === 1}
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="tab-container">
              {/* String labels - only show for first measure */}
              {measureIndex === 0 && (
                <div className="string-labels">
                  {[...strings].reverse().map((note, index) => (
                    <div key={index} className="string-label">
                      {note}
                    </div>
                  ))}
                </div>
              )}

              {/* Tablature grid */}
              <div className="tab-grid">
                {[...strings].reverse().map((_, reverseIndex) => {
                  const stringIndex = strings.length - 1 - reverseIndex;
                  return (
                    <div key={stringIndex} className="tab-string">
                      {[...Array(positionsPerMeasure)].map((_, positionIndex) => {
                        const note = getNoteAt(measure.id, stringIndex, positionIndex);
                        const isSelected = 
                          selectedCell?.measureId === measure.id &&
                          selectedCell?.string === stringIndex && 
                          selectedCell?.position === positionIndex;
                        
                        return (
                          <div
                            key={positionIndex}
                            className={`tab-cell ${isSelected ? 'selected' : ''} ${note ? 'has-note' : ''}`}
                            onClick={() => handleCellClick(measure.id, stringIndex, positionIndex)}
                          >
                            {note ? (
                              <span className="fret-number">{note.fret}</span>
                            ) : (
                              <span className="fret-line">─</span>
                            )}
                          </div>
                        );
                      })}
                      {/* Measure separator line */}
                      <div className="measure-separator">|</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Add measure button */}
        <div className="add-measure-container">
          <button className="add-measure-btn" onClick={addMeasure}>
            ➕ Add Measure
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="editor-instructions">
        {selectedCell ? (
          <p className="instruction-active">
            ✏️ {partialInput ? `Typing: ${partialInput}_ (press another digit or wait)` : 'Type 0-24 for fret number, or ESC to cancel'}
          </p>
        ) : (
          <p className="instruction-normal">
            💡 Click on any position to add a note
          </p>
        )}
      </div>

      {/* Fret number buttons */}
      {selectedCell && (
        <div className="fret-selector">
          <p>Or click a fret number:</p>
          <div className="fret-buttons">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(fret => (
              <button
                key={fret}
                className="fret-button"
                onClick={() => addFret(fret)}
              >
                {fret}
              </button>
            ))}
          </div>
          <div className="fret-buttons">
            {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(fret => (
              <button
                key={fret}
                className="fret-button"
                onClick={() => addFret(fret)}
              >
                {fret}
              </button>
            ))}
          </div>
          <div className="fret-buttons">
            {[20, 21, 22, 23, 24].map(fret => (
              <button
                key={fret}
                className="fret-button"
                onClick={() => addFret(fret)}
              >
                {fret}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear all button */}
      {getTotalNotes() > 0 && (
        <button 
          className="clear-button"
          onClick={() => {
            if (window.confirm('Clear all notes from all measures?')) {
              setMeasures(measures.map(m => ({ ...m, notes: [] })));
              setSelectedCell(null);
            }
          }}
        >
          🗑️ Clear All Notes
        </button>
      )}
    </div>
  );
}

export default TablatureEditor;
