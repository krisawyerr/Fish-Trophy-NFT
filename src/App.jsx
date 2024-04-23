import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Mint from './pages/Mint';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route exact path="/" element={<Home />} /> */}
        <Route exact path="/" element={<Mint />} />
        {/* <Route exact path="/mint" element={<Mint />} /> */}
      </Routes>
    </Router>
  );
}

export default App;