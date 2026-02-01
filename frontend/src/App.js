import './App.css';
import GenreSelector from './components/GenreSelector';
import TablatureEditor from './components/TablatureEditor';
import ScaleSidebar from './components/ScaleSidebar';
import PlaybackControls from './components/PlaybackControls';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎸 Guitar Writing Tool</h1>
        <p>AI-Powered Composition Assistant</p>
      </header>

      <main className="app-main">
        <div className="main-layout">
          <div className="left-panel">
            <GenreSelector />
            <PlaybackControls />
            <TablatureEditor />
          </div>
          
          <div className="right-panel">
            <ScaleSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
