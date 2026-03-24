import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Students from './pages/Students';
import Group from './pages/Group';
import GroupDetails from './pages/GroupDetails';
import SessionDetails from './pages/SessionDetails';
import Sessions from './pages/Sessions';
import ThemeToggle from './components/ThemeToggle';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import StudentDetailsPage from './pages/StudentDetailsPage';


function App() {
  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('token');
    // You can also check token validity here (e.g., expiration)
    if (token) {
      // Optionally, you can dispatch an action to load user data
      // dispatch(loadUserFromToken(token));
    }
  }, []);
  return (
    <BrowserRouter >
      <Routes>
        {/* Login page خارج الـ Layout */}
        <Route path="/login" element={<Login />} />

        {/* Layout شامل TopBar + SideBar */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

          {/* Pages اللي جوه Layout */}
          <Route path="/" element={<DashboardPage />} />
          {/* لو عندك صفحات تانية */}
          <Route path="/students" element={<Students />} />
          <Route path="/Group" element={<Group />} />
          <Route path="/GroupDetails/:id" element={<GroupDetails />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/session/:id" element={<SessionDetails />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students/:id" element={<StudentDetailsPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
