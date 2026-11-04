import { useState, useEffect } from 'react'
import Login from './components/Login'
import StudentView from './components/StudentView'
import StaffView from './components/StaffView'

function App() {
  const API_URL = "https://script.google.com/macros/s/AKfycbxPTaPXaegE9C8Xvx_7X09MWw7I-bSzwEbTAVojpCi4hLDQzzAF_JnNvv0JTh-iQ3U/exec"; // GANTI DENGAN URL ANDA

  const [user, setUser] = useState(null); // Data pengguna yang log masuk
  const [view, setView] = useState('login'); // 'login', 'student', 'staff'

  // Semak localStorage bila aplikasi mula
  useEffect(() => {
    // Dalam useEffect
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
  const parsed = JSON.parse(savedUser);
  setUser(parsed);
  setView(parsed.peranan === 'Pelajar' ? 'student' : 'staff');
}

  }, []);

  // Dalam handleLoginSuccess
const handleLoginSuccess = (userData) => {
  setUser(userData);
  localStorage.setItem('currentUser', JSON.stringify(userData));
  setView(userData.peranan === 'Pelajar' ? 'student' : 'staff');
};

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setView('login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} API_URL={API_URL} />}
      {view === 'student' && <StudentView user={user} onLogout={handleLogout} API_URL={API_URL} />}
      {view === 'staff' && <StaffView user={user} onLogout={handleLogout} API_URL={API_URL} />}
    </div>
  );
}

export default App;