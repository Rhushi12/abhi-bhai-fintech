import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { Home } from './pages/Home';
import { Sanctum } from './pages/Sanctum';
import { Gateway } from './pages/Gateway';

function App() {
  return (
    <Router>
      <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
        {/* Global SVG Noise Overlay - Opacity managed in CSS */}
        <div className="noise-overlay pointer-events-none" />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sanctum" element={<Sanctum />} />
          <Route path="/login" element={<Gateway />} />
        </Routes>
      </ReactLenis>
    </Router>
  );
}

export default App;
