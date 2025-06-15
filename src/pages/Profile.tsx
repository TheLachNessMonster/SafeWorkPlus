import Layout from '../components/Layout';

export default function Profile() {
  // mock user data - replace with actual auth context later
  const mockUser = {
    name: 'Ashley Smith',
    email: 'ashley@company.com',
    role: 'user' as const,
    workplace: 'Building 1 - Construction Site A'
  };

  return (
    <Layout title="Profile">
      <div className="space-y-6">
        {/* user info card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {mockUser.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">{mockUser.name}</h2>
              <p className="text-gray-600">{mockUser.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900 capitalize">{mockUser.role}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Workplace</label>
              <p className="mt-1 text-sm text-gray-900">{mockUser.workplace}</p>
            </div>
          </div>
        </div>

        {/* actions - not implemented */}
        <div className="space-y-3">
          <button className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
            Settings
          </button>
          <button className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
            Help & Support
          </button>
          <button className="w-full bg-red-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
}
