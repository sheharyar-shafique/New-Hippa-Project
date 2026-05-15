import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import NewConsultation from './pages/NewConsultation';
import NoteDetail from './pages/NoteDetail';
import LabAnalysis from './pages/LabAnalysis';
import Patients from './pages/Patients';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';
import { RequireAuth } from './lib/AuthProvider';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="new" element={<NewConsultation />} />
        <Route path="notes/:id" element={<NoteDetail />} />
        <Route path="labs" element={<LabAnalysis />} />
        <Route path="patients" element={<Patients />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
