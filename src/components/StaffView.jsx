import AdminDashboard from './AdminDashboard';
import GuruKelasDashboard from './GuruKelasDashboard';
import GuruSubjekDashboard from './GuruSubjekDashboard';
export default function StaffView({ user, onLogout, API_URL }) {
  const getRoleBadge = (peranan) => {
    const colors = {
      'Admin': 'bg-purple-500',
      'Guru Kelas': 'bg-blue-500',
      'Guru Subjek': 'bg-orange-500'
    };
    return colors[peranan] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Staff</h1>
            <p className="text-gray-500 text-sm">Selamat datang, {user.namaPenuh}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Log Keluar
          </button>
        </div>

        {/* Kad Maklumat Peranan */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Maklumat Akaun Anda</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Username</p>
              <p className="font-bold text-gray-800">{user.username}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Peranan</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${getRoleBadge(user.peranan)}`}>
                {user.peranan}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Tugasan Khas</p>
              <p className="font-bold text-gray-800">{user.tugasanKhas || '-'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Nama Penuh</p>
              <p className="font-bold text-gray-800">{user.namaPenuh}</p>
            </div>
          </div>
        </div>

        {/* Menu Mengikut Peranan */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Menu Akses Anda</h2>
          <div className="space-y-3">
            {user.peranan === 'Admin' && (
  <AdminDashboard user={user} API_URL={API_URL} />
)}
            {user.peranan === 'Guru Kelas' && (
  <GuruKelasDashboard user={user} API_URL={API_URL} />
)}
            {user.peranan === 'Guru Subjek' && (
  <GuruSubjekDashboard user={user} API_URL={API_URL} />
)}
          </div>
        </div>
      </div>
    </div>
  );
}