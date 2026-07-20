import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Vibes from './pages/Vibes';
import Explore from './pages/Explore';
import Callback from './pages/Auth/Callback';
import EmailAuth from "./pages/Auth/EmailAuth";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/vibes" element={<Vibes />} />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route path="/auth/callback" element={<Callback />} />
        <Route path="/auth/email" element={<EmailAuth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;