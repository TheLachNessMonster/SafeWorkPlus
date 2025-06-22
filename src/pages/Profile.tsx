import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Layout title="Profile">
        <div className="text-center py-12">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile">
      <div className="space-y-6">
        {/* user info card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Workplace</label>
              <p className="mt-1 text-sm text-gray-900">
                {user.workplaceId ? `Workplace ID: ${user.workplaceId}` : 'No workplace assigned'}
              </p>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="space-y-3">
          <button className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colours">
            Settings
          </button>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-600 transition-colours"
          >
            Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
}