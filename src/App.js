import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import PlaylistDetails from './components/PlaylistDetails';
import TrackDetails from './components/TrackDetails';


function App() {
  return (
    <div className="App bg-stone-950">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlist/:id" element={<PlaylistDetails />} /> {/* Route for track details */}
          <Route path="/track/:id" element={<TrackDetails />} /> {/* Route for track details */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
