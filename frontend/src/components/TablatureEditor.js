import React, { useState } from 'react';
import '../styles/TablatureEditor.css';

function TablatureEditor() {
  // Guitar strings (from LOW E to high e) - we'll reverse display
  const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
  
  // Number of positions (beats) per measure
  const positionsPerMeasure = 16;
  
  // State to store all the notes
  const [notes, setNotes] = useState([]);
  
  // State for selected cell
  const [selectedCell, setSelectedCell] = useState(null);
  
  // State to store partial input for two-digit numbers
  const [partialInput, setPartialInput] = useState('');

  // Function to check if a note exists at a position
  const getNoteAt = (stringIndex, position) => {
    return notes.find(
      note => note.string === stringIndex && note.position === position
    );
  };

  // Function to add or remove a note
  const handleCellClick = (stringIndex, position) => {
    const existingNote = getNoteAt(stringIndex, position);
    
    if (existingNote) {
      // Note exists, remove it
      setNotes(notes.filter(note => 
        !(note.string === stringIndex && note.position === position)
      ));
      setSelectedCell(null);
    } else {
      // No note, select this cell for input
      setSelectedCell({ string: stringIndex, position: position });
    }
    setPartialInput(''); // Clear any partial input
  };

  // Function to add a fret number to selected cell
  const addFret = (fretNumber) => {
    if (selectedCell) {
      const newNote = {
        string: selectedCell.string,
        position: selectedCell.position,
        fret: fretNumber
      };
      
      setNotes([...notes, newNote]);
      setSelectedCell(null);
      setPartialInput(''); // Clear partial input
    }
  };

  // Handle keyboard input with two-digit support
  const handleKeyPress = (event) => {
    if (selectedCell) {
      const key = event.key;
      
      if (key >= '0' && key <= '9') {
        const digit = key;
        
        // If we have a partial input, combine it
        if (partialInput) {
          const twoDigitNumber = parseInt(partialInput + digit);
          if (twoDigitNumber <= 24) {
            addFret(twoDigitNumber);
            setPartialInput('');
          } else {
            // Number too high, just use the new digit
            setPartialInput(digit);
          }
        } else {
          // First digit
          const singleDigit = parseInt(digit);
          if (singleDigit >= 0 && singleDigit <= 9) {
            // Could be single digit or first of two digits
            setPartialInput(digit);
            
            // Auto-submit after short delay if no second digit
            setTimeout(() => {
              setPartialInput(prev => {
                if (prev === digit) {
                  addFret(singleDigit);
                  return '';
                }
                return prev;
              });
            }, 500); // Wait 500ms for second digit
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
          <span>Notes: {notes.length}</span>
        </div>
      </div>

      <div className="tab-container">
        {/* String labels - REVERSED to show high e at top */}
        <div className="string-labels">
          {[...strings].reverse().map((note, index) => (
            <div key={index} className="string-label">
              {note}
            </div>
          ))}
        </div>

        {/* Tablature grid - REVERSED to show high e at top */}
        <div className="tab-grid">
          {[...strings].reverse().map((_, reverseIndex) => {
            const stringIndex = strings.length - 1 - reverseIndex;
            return (
              <div key={stringIndex} className="tab-string">
                {[...Array(positionsPerMeasure)].map((_, positionIndex) => {
                  const note = getNoteAt(stringIndex, positionIndex);
                  const isSelected = selectedCell?.string === stringIndex && 
                                   selectedCell?.position === positionIndex;
                  
                  return (
                    <div
                      key={positionIndex}
                      className={`tab-cell ${isSelected ? 'selected' : ''} ${note ? 'has-note' : ''}`}
                      onClick={() => handleCellClick(stringIndex, positionIndex)}
                    >
                      {note ? (
                        <span className="fret-number">{note.fret}</span>
                      ) : (
                        <span className="fret-line">─</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
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
      {notes.length > 0 && (
        <button 
          className="clear-button"
          onClick={() => {
            if (window.confirm('Clear all notes?')) {
              setNotes([]);
              setSelectedCell(null);
            }
          }}
        >
          🗑️ Clear All
        </button>
      )}
    </div>
  );
}

export default TablatureEditor;
